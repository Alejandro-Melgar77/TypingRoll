import { describe, expect, it } from 'vitest';
import { PARAGRAPH_CATALOG, PARAGRAPH_CATEGORY_DETAILS, paragraphsForMode } from '../../content/paragraphs';
import { paragraphCharacterState, paragraphMatches, paragraphMetrics } from './paragraph';

describe('modo párrafo', () => {
  it('solo permite la igualdad exacta, preservando espacios y puntuación', () => {
    expect(paragraphMatches('Luna suave.', 'Luna suave.')).toBe(true);
    expect(paragraphMatches('Luna suave.', 'Luna  suave.')).toBe(false);
    expect(paragraphMatches('Luna suave.', 'Luna suave')).toBe(false);
  });

  it('normaliza formas Unicode equivalentes al comparar', () => {
    expect(paragraphMatches('corazón', 'corazo\u0301n')).toBe(true);
  });

  it('marca los caracteres correctos e incorrectos sin bloquear la corrección', () => {
    expect(paragraphCharacterState('sol', 'sxl', 0)).toBe('correct');
    expect(paragraphCharacterState('sol', 'sxl', 1)).toBe('incorrect');
    expect(paragraphCharacterState('sol', 's', 2)).toBe('pending');
  });

  it('normaliza el puntaje por longitud y tiempo', () => {
    expect(paragraphMetrics('a'.repeat(50), 60_000)).toEqual({ elapsedMs: 60_000, wordsPerMinute: 10, score: 100 });
  });

  it('ofrece un repertorio local seguro para cada subcategoría y un Clásico mixto', () => {
    expect(PARAGRAPH_CATALOG).toHaveLength(120);
    expect(new Set(PARAGRAPH_CATALOG.map((entry) => entry.text)).size).toBe(120);
    expect(PARAGRAPH_CATALOG.every((entry) => entry.isSafe)).toBe(true);
    expect(PARAGRAPH_CATEGORY_DETAILS).toHaveLength(7);
    for (const detail of PARAGRAPH_CATEGORY_DETAILS.filter((item) => item.id !== 'classic')) {
      expect(paragraphsForMode(detail.id)).toHaveLength(20);
    }
    expect(paragraphsForMode('classic')).toHaveLength(PARAGRAPH_CATALOG.length);
    expect(PARAGRAPH_CATALOG.filter((entry) => entry.category === 'biblical-self-help').every((entry) => entry.origin === 'scripture-reflection' && entry.sourceReference)).toBe(true);
  });
});
