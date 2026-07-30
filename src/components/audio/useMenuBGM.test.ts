import { describe, expect, it } from 'vitest';
import { bgmProfileForMood } from './useMenuBGM';

describe('música procedural de Párrafo', () => {
  it('asigna un perfil instrumental distinto a cada colección', () => {
    const categories = ['poetic', 'motivational-literature', 'romanticism', 'self-improvement', 'biblical-self-help', 'constructive-dialogues'] as const;
    const signatures = categories.map((category) => {
      const profile = bgmProfileForMood(category);
      return `${profile.interval}:${profile.release}:${profile.pattern.join(',')}`;
    });
    expect(new Set(signatures).size).toBe(categories.length);
  });
});
