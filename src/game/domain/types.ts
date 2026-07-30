export type MathOperation = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'fractions';
export type MathGameMode = 'math_classic' | 'math_addition' | 'math_subtraction' | 'math_multiplication' | 'math_division' | 'math_fractions';
export type GameMode = 'classic' | 'es_en' | 'en_es' | MathGameMode;
export type Tier = 1 | 2 | 3 | 4 | 5;
export type PowerUp = 'breeze' | 'shield';

export interface TranslationMap {
  [prompt: string]: readonly string[];
}

export interface RunConfig {
  runId: string;
  seed: number;
  gameMode: GameMode;
  baseTier: Tier;
  durationMs: number;
  initialScore?: number;
  classicWords: Readonly<Record<Tier, readonly string[]>>;
  translations: TranslationMap;
}

export interface CloudState {
  id: string;
  word: string;
  typed: string;
  x: number;
  y: number;
  speed: number;
  feedback?: string;
  feedbackUntilMs?: number;
  answer?: string;
  operation?: MathOperation;
}

export interface RunState {
  config: RunConfig;
  elapsedMs: number;
  nextSpawnAtMs: number;
  nextCloudId: number;
  randomState: number;
  clouds: readonly CloudState[];
  targetId: string | null;
  inputBuffer: string;
  score: number;
  lives: number;
  combo: number;
  tier: Tier;
  correctWords: number;
  mistakes: number;
  typedCharacters: number;
  powerCharges: number;
  mathCorrectAtTier: number;
  shieldActive: boolean;
  slowUntilMs: number;
  status: 'playing' | 'paused' | 'finished';
}

export type RunInput =
  | { type: 'tick'; deltaMs: number }
  | { type: 'key'; key: string }
  | { type: 'backspace' }
  | { type: 'confirm' }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'powerup'; powerUp: PowerUp };

export type RunEvent =
  | { type: 'cloud-spawned'; cloud: CloudState }
  | { type: 'word-cleared'; cloudId: string; scoreDelta: number }
  | { type: 'damage'; remainingLives: number; reason: 'miss' | 'typing' | 'translation' }
  | { type: 'tier-changed'; tier: Tier }
  | { type: 'powerup-earned'; charges: number }
  | { type: 'powerup-used'; powerUp: PowerUp }
  | { type: 'game-over'; reason: 'lives' | 'time' };

export interface RunResult {
  runId: string;
  score: number;
  accuracy: number;
  wordsPerMinute: number;
  correctWords: number;
  mistakes: number;
  tier: Tier;
  elapsedMs: number;
  rewardCoins: number;
}

export interface RunTransition {
  state: RunState;
  events: readonly RunEvent[];
}
