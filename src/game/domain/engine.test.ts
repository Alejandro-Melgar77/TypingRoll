import { describe, expect, it } from 'vitest';
import { createRun, reduceRun, resultFromRun } from './engine';
import type { RunConfig, Tier } from './types';

const words: Record<Tier, readonly string[]> = {
  1: ['SOL', 'MAR'],
  2: ['AMIGO'],
  3: ['AVENTURA'],
  4: ['CONCENTRACION'],
  5: ['INTERNACIONALIZACION'],
};

const config = (overrides: Partial<RunConfig> = {}): RunConfig => ({
  runId: 'test-run', seed: 12, gameMode: 'classic', baseTier: 1, durationMs: 180_000,
  classicWords: words, translations: { GATO: ['CAT'] }, ...overrides,
});

const tickUntilCloud = (run = createRun(config())) => reduceRun(run, { type: 'tick', deltaMs: 16 }).state;

describe('motor de partida', () => {
  it('produce la misma primera nube con la misma semilla', () => {
    const first = tickUntilCloud(createRun(config({ seed: 99 })));
    const second = tickUntilCloud(createRun(config({ seed: 99 })));
    expect(first.clouds[0]).toMatchObject(second.clouds[0]);
  });

  it('otorga puntos y elimina una palabra escrita correctamente', () => {
    let state = tickUntilCloud();
    const word = state.clouds[0].word;
    for (const key of word) state = reduceRun(state, { type: 'key', key }).state;
    expect(state.clouds).toHaveLength(0);
    expect(state.correctWords).toBe(1);
    expect(state.score).toBe(word.length * 10);
  });

  it('pierde una vida y reinicia la racha al fallar', () => {
    let state = tickUntilCloud();
    state = { ...state, combo: 3 };
    const transition = reduceRun(state, { type: 'key', key: 'Z' });
    expect(transition.state.lives).toBe(2);
    expect(transition.state.combo).toBe(0);
    expect(transition.events).toContainEqual(expect.objectContaining({ type: 'damage', reason: 'typing' }));
  });

  it('acepta traducciones sin distinguir tildes ni mayúsculas', () => {
    let state = tickUntilCloud(createRun(config({ gameMode: 'es_en', translations: { GATO: ['CAT'] } })));
    state = reduceRun(state, { type: 'key', key: 'c' }).state;
    state = reduceRun(state, { type: 'key', key: 'a' }).state;
    state = reduceRun(state, { type: 'key', key: 't' }).state;
    state = reduceRun(state, { type: 'confirm' }).state;
    expect(state.correctWords).toBe(1);
    expect(state.inputBuffer).toBe('');
  });

  it('pausa sin avanzar tiempo ni nubes', () => {
    let state = tickUntilCloud();
    const before = state.clouds[0].y;
    state = reduceRun(state, { type: 'pause' }).state;
    state = reduceRun(state, { type: 'tick', deltaMs: 5000 }).state;
    expect(state.elapsedMs).toBe(16);
    expect(state.clouds[0].y).toBe(before);
  });

  it('termina al agotarse el tiempo y calcula las métricas', () => {
    const state = reduceRun(createRun(config({ durationMs: 20 })), { type: 'tick', deltaMs: 20 }).state;
    expect(state.status).toBe('finished');
    expect(resultFromRun(state)).toMatchObject({ score: 0, accuracy: 100, elapsedMs: 20 });
  });

  it('restaura una partida desde su puntuación de reintento y ajusta su fase', () => {
    const state = createRun(config({ initialScore: 850 }));
    expect(state.score).toBe(850);
    expect(state.tier).toBe(2);
    expect(state.lives).toBe(3);
    expect(state.status).toBe('playing');
  });

  it('sube de fase al cruzar un hito de puntuación', () => {
    let state = tickUntilCloud(createRun(config({ initialScore: 790, classicWords: { ...words, 1: ['SOL'] } })));
    for (const key of 'SOL') state = reduceRun(state, { type: 'key', key }).state;
    expect(state.score).toBe(820);
    expect(state.tier).toBe(2);
  });
});
