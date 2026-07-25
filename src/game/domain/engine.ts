import type { CloudState, GameMode, PowerUp, RunConfig, RunEvent, RunInput, RunResult, RunState, RunTransition, Tier } from './types';

const MAX_LIVES = 3;
const MAX_TIER: Tier = 5;
const COMBO_FOR_RESTORE = 5;
const COMBO_FOR_POWER = 8;
const RIVER_LIMIT = 0.84;
const NORMALIZED_KEY = /^[A-ZÁÉÍÓÚÜÑ ]$/;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const normalizeText = (value: string) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .trim()
  .toUpperCase();

const seedStep = (seed: number) => (seed * 1664525 + 1013904223) >>> 0;

const nextRandom = (state: RunState) => {
  const randomState = seedStep(state.randomState);
  return { randomState, value: randomState / 0x100000000 };
};

const tierFromScore = (score: number, baseTier: Tier): Tier => {
  const scoreTier: Tier = score >= 5400 ? 5 : score >= 3300 ? 4 : score >= 1900 ? 3 : score >= 800 ? 2 : 1;
  return Math.max(baseTier, scoreTier) as Tier;
};

// La primera fase debe dar tiempo para reconocer una palabra; la presión se
// construye por fases y no convierte la primera partida en una derrota en 20 s.
const spawnRateForTier = (tier: Tier) => Math.max(1_700, 4_300 - (tier - 1) * 620);
const speedForTier = (tier: Tier) => 0.023 + tier * 0.008;

const availableWords = (state: RunState): readonly string[] => {
  if (state.config.gameMode === 'classic') return state.config.classicWords[state.tier];
  return Object.keys(state.config.translations);
};

const lowestCloud = (clouds: readonly CloudState[]) => clouds.reduce<CloudState | null>(
  (lowest, cloud) => (!lowest || cloud.y > lowest.y ? cloud : lowest),
  null,
);

const wpmFor = (state: RunState) => {
  const minutes = Math.max(state.elapsedMs / 60_000, 1 / 60);
  return Math.round((state.typedCharacters / 5) / minutes);
};

const accuracyFor = (state: RunState) => {
  const attempts = state.correctWords + state.mistakes;
  return attempts ? Math.round((state.correctWords / attempts) * 100) : 100;
};

const maybeAdaptTier = (state: RunState, events: RunEvent[]): RunState => {
  const attempts = state.correctWords + state.mistakes;
  if (!attempts || attempts % 8 !== 0) return state;
  const accuracy = accuracyFor(state);
  const wpm = wpmFor(state);
  let tier = state.tier;
  if (accuracy >= 95 && wpm >= 18 && tier < MAX_TIER) tier = (tier + 1) as Tier;
  if (accuracy < 82 && tier > state.config.baseTier) tier = (tier - 1) as Tier;
  if (tier !== state.tier) events.push({ type: 'tier-changed', tier });
  return { ...state, tier };
};

const withDamage = (state: RunState, reason: 'miss' | 'typing' | 'translation', events: RunEvent[]): RunState => {
  if (state.shieldActive) {
    events.push({ type: 'powerup-used', powerUp: 'shield' });
    return { ...state, shieldActive: false, combo: 0, targetId: null, inputBuffer: '' };
  }
  const lives = Math.max(0, state.lives - 1);
  events.push({ type: 'damage', remainingLives: lives, reason });
  const next = maybeAdaptTier({ ...state, lives, combo: 0, mistakes: state.mistakes + 1, targetId: null, inputBuffer: '' }, events);
  if (!lives) events.push({ type: 'game-over', reason: 'lives' });
  return !lives ? { ...next, status: 'finished' } : next;
};

const clearCloud = (state: RunState, cloud: CloudState, typedLength: number, events: RunEvent[]): RunState => {
  const combo = state.combo + 1;
  const scoreDelta = Math.max(1, typedLength) * 10 * state.tier * (combo >= 4 ? 2 : 1);
  let lives = state.lives;
  let powerCharges = state.powerCharges;
  let nextCombo = combo;
  if (combo === COMBO_FOR_RESTORE) {
    lives = Math.min(MAX_LIVES, lives + 1);
    nextCombo = 0;
  }
  if (combo === COMBO_FOR_POWER) {
    powerCharges = Math.min(2, powerCharges + 1);
    nextCombo = 0;
    events.push({ type: 'powerup-earned', charges: powerCharges });
  }
  const preliminary = {
    ...state,
    clouds: state.clouds.filter((item) => item.id !== cloud.id),
    targetId: null,
    inputBuffer: '',
    score: state.score + scoreDelta,
    lives,
    combo: nextCombo,
    correctWords: state.correctWords + 1,
    typedCharacters: state.typedCharacters + typedLength,
  };
  events.push({ type: 'word-cleared', cloudId: cloud.id, scoreDelta });
  const withScoreTier = { ...preliminary, tier: tierFromScore(preliminary.score, preliminary.config.baseTier) };
  if (withScoreTier.tier !== state.tier) events.push({ type: 'tier-changed', tier: withScoreTier.tier });
  return maybeAdaptTier(withScoreTier, events);
};

const spawnCloud = (state: RunState, events: RunEvent[]): RunState => {
  const currentWords = availableWords(state);
  if (!currentWords.length) return state;
  const active = new Set(state.clouds.map((cloud) => cloud.word));
  const choices = currentWords.filter((word) => !active.has(word));
  const first = nextRandom(state);
  const wordPool = choices.length ? choices : currentWords;
  const word = wordPool[Math.floor(first.value * wordPool.length)];
  const second = nextRandom({ ...state, randomState: first.randomState });
  const cloud: CloudState = {
    id: `cloud-${state.nextCloudId}`,
    word,
    typed: '',
    x: 0.12 + second.value * 0.76,
    y: -0.09,
    speed: speedForTier(state.tier),
  };
  events.push({ type: 'cloud-spawned', cloud });
  return {
    ...state,
    clouds: [...state.clouds, cloud],
    randomState: second.randomState,
    nextCloudId: state.nextCloudId + 1,
    nextSpawnAtMs: state.elapsedMs + spawnRateForTier(state.tier),
  };
};

export const createRun = (config: RunConfig): RunState => ({
  config,
  elapsedMs: 0,
  nextSpawnAtMs: 0,
  nextCloudId: 1,
  randomState: config.seed >>> 0,
  clouds: [],
  targetId: null,
  inputBuffer: '',
  score: Math.max(0, config.initialScore ?? 0),
  lives: MAX_LIVES,
  combo: 0,
  tier: tierFromScore(Math.max(0, config.initialScore ?? 0), config.baseTier),
  correctWords: 0,
  mistakes: 0,
  typedCharacters: 0,
  powerCharges: 0,
  shieldActive: false,
  slowUntilMs: 0,
  status: 'playing',
});

const tick = (state: RunState, deltaMs: number, events: RunEvent[]): RunState => {
  if (state.status !== 'playing') return state;
  const safeDelta = clamp(deltaMs, 0, 100);
  let next = { ...state, elapsedMs: state.elapsedMs + safeDelta };
  if (next.elapsedMs >= next.config.durationMs) {
    events.push({ type: 'game-over', reason: 'time' });
    return { ...next, status: 'finished' };
  }
  while (next.elapsedMs >= next.nextSpawnAtMs && next.status === 'playing') next = spawnCloud(next, events);
  const isSlow = next.slowUntilMs > next.elapsedMs;
  const moveAmount = safeDelta / 1000 * (isSlow ? 0.42 : 1);
  let clouds = next.clouds.map((cloud) => ({
    ...cloud,
    y: cloud.y + cloud.speed * moveAmount,
    ...(cloud.feedbackUntilMs && cloud.feedbackUntilMs <= next.elapsedMs ? { feedback: undefined, feedbackUntilMs: undefined } : {}),
  }));
  const missed = clouds.filter((cloud) => cloud.y > RIVER_LIMIT);
  clouds = clouds.filter((cloud) => cloud.y <= RIVER_LIMIT);
  next = { ...next, clouds, targetId: next.targetId && clouds.some((cloud) => cloud.id === next.targetId) ? next.targetId : null };
  for (const _cloud of missed) {
    next = withDamage(next, 'miss', events);
    if (next.status === 'finished') break;
  }
  return next;
};

const applyClassicKey = (state: RunState, key: string, events: RunEvent[]): RunState => {
  const target = state.targetId ? state.clouds.find((cloud) => cloud.id === state.targetId) ?? null : null;
  if (!target) {
    const candidate = state.clouds
      .filter((cloud) => normalizeText(cloud.word).startsWith(normalizeText(key)))
      .reduce<CloudState | null>((lowest, cloud) => (!lowest || cloud.y > lowest.y ? cloud : lowest), null);
    if (!candidate) return withDamage(state, 'typing', events);
    const typed = normalizeText(key);
    const selected = { ...candidate, typed };
    const selectedState = { ...state, targetId: selected.id, clouds: state.clouds.map((cloud) => cloud.id === selected.id ? selected : cloud) };
    return selected.typed === normalizeText(selected.word) ? clearCloud(selectedState, selected, 1, events) : selectedState;
  }
  const normalizedWord = normalizeText(target.word);
  if (normalizedWord[target.typed.length] !== normalizeText(key)) return withDamage(state, 'typing', events);
  const updated = { ...target, typed: `${target.typed}${normalizeText(key)}` };
  const updatedState = { ...state, clouds: state.clouds.map((cloud) => cloud.id === target.id ? updated : cloud) };
  return updated.typed === normalizedWord ? clearCloud(updatedState, updated, updated.typed.length, events) : updatedState;
};

const applyTranslationConfirm = (state: RunState, events: RunEvent[]): RunState => {
  const target = lowestCloud(state.clouds);
  if (!target) return { ...state, inputBuffer: '' };
  const answers = state.config.translations[target.word] ?? [];
  const answer = normalizeText(state.inputBuffer);
  if (answer && answers.some((translation) => normalizeText(translation) === answer)) {
    return clearCloud({ ...state, targetId: target.id }, target, answer.replace(/\s/g, '').length, events);
  }
  const feedback = answers[0] ? `Respuesta: ${answers[0]}` : 'Sin respuesta';
  const clouds = state.clouds.map((cloud) => cloud.id === target.id
    ? { ...cloud, feedback, feedbackUntilMs: state.elapsedMs + 1100 }
    : cloud,
  );
  return withDamage({ ...state, clouds }, 'translation', events);
};

const applyPowerUp = (state: RunState, powerUp: PowerUp, events: RunEvent[]): RunState => {
  if (state.powerCharges <= 0 || state.status !== 'playing') return state;
  events.push({ type: 'powerup-used', powerUp });
  if (powerUp === 'shield') return { ...state, powerCharges: state.powerCharges - 1, shieldActive: true };
  return { ...state, powerCharges: state.powerCharges - 1, slowUntilMs: state.elapsedMs + 6000 };
};

export const reduceRun = (state: RunState, input: RunInput): RunTransition => {
  const events: RunEvent[] = [];
  if (input.type === 'pause' && state.status === 'playing') return { state: { ...state, status: 'paused' }, events };
  if (input.type === 'resume' && state.status === 'paused') return { state: { ...state, status: 'playing' }, events };
  if (input.type === 'tick') return { state: tick(state, input.deltaMs, events), events };
  if (state.status !== 'playing') return { state, events };
  if (input.type === 'powerup') return { state: applyPowerUp(state, input.powerUp, events), events };
  if (state.config.gameMode !== 'classic') {
    if (input.type === 'confirm') return { state: applyTranslationConfirm(state, events), events };
    if (input.type === 'backspace') return { state: { ...state, inputBuffer: state.inputBuffer.slice(0, -1) }, events };
    if (input.type === 'key' && NORMALIZED_KEY.test(input.key.toUpperCase())) {
      return { state: { ...state, inputBuffer: `${state.inputBuffer}${input.key.toUpperCase()}` }, events };
    }
    return { state, events };
  }
  if (input.type === 'key' && NORMALIZED_KEY.test(input.key.toUpperCase()) && input.key !== ' ') {
    return { state: applyClassicKey(state, input.key, events), events };
  }
  return { state, events };
};

export const resultFromRun = (state: RunState): RunResult => ({
  runId: state.config.runId,
  score: state.score,
  accuracy: accuracyFor(state),
  wordsPerMinute: wpmFor(state),
  correctWords: state.correctWords,
  mistakes: state.mistakes,
  tier: state.tier,
  elapsedMs: state.elapsedMs,
  rewardCoins: Math.floor(state.score / 4) + state.correctWords * 2,
});

export const createRunConfig = (
  gameMode: GameMode,
  baseTier: Tier,
  classicWords: RunConfig['classicWords'],
  translations: RunConfig['translations'],
  options?: Partial<Pick<RunConfig, 'seed' | 'runId' | 'durationMs' | 'initialScore'>>,
): RunConfig => ({
  runId: options?.runId ?? crypto.randomUUID(),
  seed: options?.seed ?? Math.floor(Math.random() * 0xffffffff),
  gameMode,
  baseTier,
  durationMs: options?.durationMs ?? 180_000,
  initialScore: options?.initialScore,
  classicWords,
  translations,
});
