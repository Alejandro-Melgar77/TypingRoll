export type KeyboardLanguage = 'en' | 'es';
export type KeyboardSize = '60' | '75' | '100';

export interface KeyboardKey {
  code: string;
  label: string;
  units?: number;
  accent?: 'enter' | 'space' | 'mod';
}

export interface KeyboardLayout {
  mainRows: readonly (readonly KeyboardKey[])[];
  functionRow?: readonly KeyboardKey[];
  navigationRows?: readonly (readonly KeyboardKey[])[];
  numpadRows?: readonly (readonly KeyboardKey[])[];
}

export interface KeyboardTheme {
  id: string;
  name: string;
  description: string;
  background: string;
}

export interface KeyboardPalette {
  id: string;
  name: string;
  key: string;
  keyText: string;
  border: string;
  pressed: string;
  pressedText: string;
  panel: string;
}

export interface KeyboardMascot {
  id: string;
  name: string;
  description: string;
  asset: string;
}

const enRows: readonly (readonly KeyboardKey[])[] = [
  [
    { code: 'Backquote', label: '`' }, { code: 'Digit1', label: '1' }, { code: 'Digit2', label: '2' }, { code: 'Digit3', label: '3' }, { code: 'Digit4', label: '4' }, { code: 'Digit5', label: '5' }, { code: 'Digit6', label: '6' }, { code: 'Digit7', label: '7' }, { code: 'Digit8', label: '8' }, { code: 'Digit9', label: '9' }, { code: 'Digit0', label: '0' }, { code: 'Minus', label: '-' }, { code: 'Equal', label: '=' }, { code: 'Backspace', label: 'Backspace', units: 2, accent: 'mod' },
  ],
  [
    { code: 'Tab', label: 'Tab', units: 1.5, accent: 'mod' }, { code: 'KeyQ', label: 'Q' }, { code: 'KeyW', label: 'W' }, { code: 'KeyE', label: 'E' }, { code: 'KeyR', label: 'R' }, { code: 'KeyT', label: 'T' }, { code: 'KeyY', label: 'Y' }, { code: 'KeyU', label: 'U' }, { code: 'KeyI', label: 'I' }, { code: 'KeyO', label: 'O' }, { code: 'KeyP', label: 'P' }, { code: 'BracketLeft', label: '[' }, { code: 'BracketRight', label: ']' }, { code: 'Backslash', label: '\\', units: 1.5 },
  ],
  [
    { code: 'CapsLock', label: 'Caps', units: 1.8, accent: 'mod' }, { code: 'KeyA', label: 'A' }, { code: 'KeyS', label: 'S' }, { code: 'KeyD', label: 'D' }, { code: 'KeyF', label: 'F' }, { code: 'KeyG', label: 'G' }, { code: 'KeyH', label: 'H' }, { code: 'KeyJ', label: 'J' }, { code: 'KeyK', label: 'K' }, { code: 'KeyL', label: 'L' }, { code: 'Semicolon', label: ';' }, { code: 'Quote', label: "'" }, { code: 'Enter', label: 'Enter', units: 2.25, accent: 'enter' },
  ],
  [
    { code: 'ShiftLeft', label: 'Shift', units: 2.25, accent: 'mod' }, { code: 'KeyZ', label: 'Z' }, { code: 'KeyX', label: 'X' }, { code: 'KeyC', label: 'C' }, { code: 'KeyV', label: 'V' }, { code: 'KeyB', label: 'B' }, { code: 'KeyN', label: 'N' }, { code: 'KeyM', label: 'M' }, { code: 'Comma', label: ',' }, { code: 'Period', label: '.' }, { code: 'Slash', label: '/' }, { code: 'ShiftRight', label: 'Shift', units: 2.75, accent: 'mod' },
  ],
  [
    { code: 'ControlLeft', label: 'Ctrl', units: 1.25, accent: 'mod' }, { code: 'MetaLeft', label: 'Win', units: 1.25, accent: 'mod' }, { code: 'AltLeft', label: 'Alt', units: 1.25, accent: 'mod' }, { code: 'Space', label: 'Space', units: 6.25, accent: 'space' }, { code: 'AltRight', label: 'Alt', units: 1.25, accent: 'mod' }, { code: 'MetaRight', label: 'Win', units: 1.25, accent: 'mod' }, { code: 'ContextMenu', label: 'Menu', units: 1.25, accent: 'mod' }, { code: 'ControlRight', label: 'Ctrl', units: 1.25, accent: 'mod' },
  ],
];

const esRows: readonly (readonly KeyboardKey[])[] = [
  [
    { code: 'Backquote', label: 'º' }, { code: 'Digit1', label: '1' }, { code: 'Digit2', label: '2' }, { code: 'Digit3', label: '3' }, { code: 'Digit4', label: '4' }, { code: 'Digit5', label: '5' }, { code: 'Digit6', label: '6' }, { code: 'Digit7', label: '7' }, { code: 'Digit8', label: '8' }, { code: 'Digit9', label: '9' }, { code: 'Digit0', label: '0' }, { code: 'Minus', label: "'" }, { code: 'Equal', label: '¡' }, { code: 'Backspace', label: 'Borrar', units: 2, accent: 'mod' },
  ],
  [
    { code: 'Tab', label: 'Tab', units: 1.5, accent: 'mod' }, { code: 'KeyQ', label: 'Q' }, { code: 'KeyW', label: 'W' }, { code: 'KeyE', label: 'E' }, { code: 'KeyR', label: 'R' }, { code: 'KeyT', label: 'T' }, { code: 'KeyY', label: 'Y' }, { code: 'KeyU', label: 'U' }, { code: 'KeyI', label: 'I' }, { code: 'KeyO', label: 'O' }, { code: 'KeyP', label: 'P' }, { code: 'BracketLeft', label: '`' }, { code: 'BracketRight', label: '+' },
  ],
  [
    { code: 'CapsLock', label: 'Bloq', units: 1.8, accent: 'mod' }, { code: 'KeyA', label: 'A' }, { code: 'KeyS', label: 'S' }, { code: 'KeyD', label: 'D' }, { code: 'KeyF', label: 'F' }, { code: 'KeyG', label: 'G' }, { code: 'KeyH', label: 'H' }, { code: 'KeyJ', label: 'J' }, { code: 'KeyK', label: 'K' }, { code: 'KeyL', label: 'L' }, { code: 'Semicolon', label: 'Ñ' }, { code: 'Quote', label: '´' }, { code: 'Backslash', label: 'Ç' }, { code: 'Enter', label: 'Intro', units: 1.75, accent: 'enter' },
  ],
  [
    { code: 'ShiftLeft', label: 'Shift', units: 1.25, accent: 'mod' }, { code: 'IntlBackslash', label: '< >' }, { code: 'KeyZ', label: 'Z' }, { code: 'KeyX', label: 'X' }, { code: 'KeyC', label: 'C' }, { code: 'KeyV', label: 'V' }, { code: 'KeyB', label: 'B' }, { code: 'KeyN', label: 'N' }, { code: 'KeyM', label: 'M' }, { code: 'Comma', label: ',' }, { code: 'Period', label: '.' }, { code: 'Slash', label: '-' }, { code: 'ShiftRight', label: 'Shift', units: 2.25, accent: 'mod' },
  ],
  enRows[4],
];

const functionRow: readonly KeyboardKey[] = [
  { code: 'Escape', label: 'Esc', accent: 'mod' }, { code: 'F1', label: 'F1' }, { code: 'F2', label: 'F2' }, { code: 'F3', label: 'F3' }, { code: 'F4', label: 'F4' }, { code: 'F5', label: 'F5' }, { code: 'F6', label: 'F6' }, { code: 'F7', label: 'F7' }, { code: 'F8', label: 'F8' }, { code: 'F9', label: 'F9' }, { code: 'F10', label: 'F10' }, { code: 'F11', label: 'F11' }, { code: 'F12', label: 'F12' },
];

const navigationRows: readonly (readonly KeyboardKey[])[] = [
  [{ code: 'Insert', label: 'Ins' }, { code: 'Home', label: 'Inicio' }, { code: 'PageUp', label: 'Pg ↑' }],
  [{ code: 'Delete', label: 'Supr' }, { code: 'End', label: 'Fin' }, { code: 'PageDown', label: 'Pg ↓' }],
  [{ code: 'ArrowLeft', label: '←' }, { code: 'ArrowDown', label: '↓' }, { code: 'ArrowRight', label: '→' }],
];

const numpadRows: readonly (readonly KeyboardKey[])[] = [
  [{ code: 'NumLock', label: 'Num' }, { code: 'NumpadDivide', label: '/' }, { code: 'NumpadMultiply', label: '×' }, { code: 'NumpadSubtract', label: '−' }],
  [{ code: 'Numpad7', label: '7' }, { code: 'Numpad8', label: '8' }, { code: 'Numpad9', label: '9' }, { code: 'NumpadAdd', label: '+', accent: 'enter' }],
  [{ code: 'Numpad4', label: '4' }, { code: 'Numpad5', label: '5' }, { code: 'Numpad6', label: '6' }, { code: 'NumpadAdd', label: '+', accent: 'enter' }],
  [{ code: 'Numpad1', label: '1' }, { code: 'Numpad2', label: '2' }, { code: 'Numpad3', label: '3' }, { code: 'NumpadEnter', label: 'Enter', accent: 'enter' }],
  [{ code: 'Numpad0', label: '0', units: 2 }, { code: 'NumpadDecimal', label: '.' }, { code: 'NumpadEnter', label: 'Enter', accent: 'enter' }],
];

export const KEYBOARD_THEMES: readonly KeyboardTheme[] = [
  { id: 'sky', name: 'Cielo turquesa', description: 'Nubes suaves y luz de mañana.', background: 'sky' },
  { id: 'sakura', name: 'Sakura lila', description: 'Pétalos tranquilos bajo un cielo violeta.', background: 'sakura' },
  { id: 'tide', name: 'Marea pastel', description: 'Olas de algodón y espuma brillante.', background: 'tide' },
  { id: 'starlight', name: 'Noche estelar', description: 'Constelaciones para practicar sin prisa.', background: 'starlight' },
  { id: 'peach', name: 'Melocotón retro', description: 'Una habitación cálida con brillo suave.', background: 'peach' },
  { id: 'matcha', name: 'Jardín matcha', description: 'Hojas redondas y una tarde zen.', background: 'matcha' },
  { id: 'arcade', name: 'Arcade lavanda', description: 'Luces pastel en una pequeña sala de juegos.', background: 'arcade' },
  { id: 'cream', name: 'Amanecer crema', description: 'Rayos dorados sobre una nube de vainilla.', background: 'cream' },
];

export const KEYBOARD_PALETTES: readonly KeyboardPalette[] = [
  { id: 'turquoise', name: 'Turquesa', key: '#efffff', keyText: '#154b59', border: '#80ccd1', pressed: '#38bfc7', pressedText: '#062f38', panel: '#d8f7f7' },
  { id: 'lilac', name: 'Lila', key: '#fbf8ff', keyText: '#4d3d6e', border: '#c2b0e7', pressed: '#9c83d8', pressedText: '#ffffff', panel: '#eee8ff' },
  { id: 'coral', name: 'Coral', key: '#fff9f5', keyText: '#674133', border: '#e6b69d', pressed: '#ef9278', pressedText: '#50261d', panel: '#ffeadf' },
  { id: 'ocean', name: 'Océano', key: '#f1faff', keyText: '#1c4769', border: '#89bedb', pressed: '#4e9ed0', pressedText: '#ffffff', panel: '#d9effa' },
  { id: 'matcha', name: 'Matcha', key: '#fbfdf7', keyText: '#405633', border: '#b8d18f', pressed: '#83b85b', pressedText: '#ffffff', panel: '#e9f4d9' },
  { id: 'night', name: 'Noche', key: '#28324f', keyText: '#f6f4ff', border: '#6975ab', pressed: '#b8a4ff', pressedText: '#1e2341', panel: '#202741' },
  { id: 'candy', name: 'Algodón', key: '#fffafd', keyText: '#6b3d5c', border: '#f0b4d2', pressed: '#ef8fbd', pressedText: '#57283f', panel: '#ffe5f1' },
  { id: 'sunrise', name: 'Amanecer', key: '#fffdf7', keyText: '#634e29', border: '#e8ca7e', pressed: '#e8aa48', pressedText: '#3d2705', panel: '#fff0c7' },
];

export const KEYBOARD_MASCOTS: readonly KeyboardMascot[] = [
  { id: 'none', name: 'Sin personaje', description: 'Solo el teclado y el tema.', asset: '' },
  { id: 'cloud', name: 'Nubi', description: 'La nube que cuida el ritmo.', asset: cloudAsset },
  { id: 'cinnamon', name: 'Canela', description: 'Un rollito dulce y valiente.', asset: cinnamonAsset },
  { id: 'seal', name: 'Pompón', description: 'Una foca que ama las burbujas.', asset: sealAsset },
  { id: 'cat', name: 'Misu', description: 'Un gato blanco de patitas suaves.', asset: catAsset },
  { id: 'bunny', name: 'Mochi', description: 'Un conejito listo para el picnic.', asset: bunnyAsset },
  { id: 'penguin', name: 'Pipo', description: 'Un pingüino con auriculares lavanda.', asset: penguinAsset },
];

export const getKeyboardLayout = (language: KeyboardLanguage, size: KeyboardSize): KeyboardLayout => ({
  mainRows: language === 'es' ? esRows : enRows,
  ...(size === '60' ? {} : { functionRow, navigationRows }),
  ...(size === '100' ? { numpadRows } : {}),
});

export const keyboardCodes = (layout: KeyboardLayout): ReadonlySet<string> => new Set([
  ...layout.mainRows.flat().map((key) => key.code),
  ...(layout.functionRow ?? []).map((key) => key.code),
  ...(layout.navigationRows ?? []).flat().map((key) => key.code),
  ...(layout.numpadRows ?? []).flat().map((key) => key.code),
]);
import cloudAsset from '../../assets/keyboard-test/mascots/cloud-nubi.png';
import cinnamonAsset from '../../assets/keyboard-test/mascots/cinnamon-canela.png';
import sealAsset from '../../assets/keyboard-test/mascots/seal-pompon.png';
import catAsset from '../../assets/keyboard-test/mascots/cat-misu.png';
import bunnyAsset from '../../assets/keyboard-test/mascots/bunny-mochi.png';
import penguinAsset from '../../assets/keyboard-test/mascots/penguin-pipo.png';
