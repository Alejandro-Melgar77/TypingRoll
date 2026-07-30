import { describe, expect, it } from 'vitest';
import { getKeyboardLayout, keyboardCodes } from './keyboardData';

describe('distribuciones de Keyboard test', () => {
  it('diferencia el Enter ANSI del Intro ISO y conserva Ñ', () => {
    const ansi = getKeyboardLayout('en', '60');
    const iso = getKeyboardLayout('es', '60');
    expect(ansi.mainRows.flat().find((key) => key.code === 'Enter')).toMatchObject({ label: 'Enter', units: 2.25 });
    expect(iso.mainRows.flat().find((key) => key.label === 'Ñ')).toBeDefined();
    expect(iso.mainRows.flat().find((key) => key.code === 'IntlBackslash')).toBeDefined();
  });

  it('incluye las zonas correctas en 60%, 75% y 100%', () => {
    const compact = getKeyboardLayout('en', '60');
    const seventyFive = getKeyboardLayout('en', '75');
    const full = getKeyboardLayout('es', '100');
    expect(compact.functionRow).toBeUndefined();
    expect(keyboardCodes(compact).has('Numpad0')).toBe(false);
    expect(seventyFive.functionRow).toHaveLength(13);
    expect(seventyFive.numpadRows).toBeUndefined();
    expect(keyboardCodes(full).has('Numpad0')).toBe(true);
  });
});
