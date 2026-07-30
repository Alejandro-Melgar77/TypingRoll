import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { useMenuBGM } from '../components/audio/useMenuBGM';
import {
  getKeyboardLayout,
  keyboardCodes,
  KEYBOARD_MASCOTS,
  KEYBOARD_PALETTES,
  KEYBOARD_THEMES,
  type KeyboardKey,
  type KeyboardLanguage,
  type KeyboardSize,
} from '../components/keyboard-test/keyboardData';
import './KeyboardTestScreen.css';

interface Props {
  musicOn: boolean;
  setMusicOn: (value: boolean) => void;
  volume: number;
  setVolume: (value: number) => void;
  onBack: () => void;
}

const languages: readonly { id: KeyboardLanguage; name: string }[] = [
  { id: 'en', name: 'English ANSI' },
  { id: 'es', name: 'Español ISO' },
];

const sizes: readonly { id: KeyboardSize; name: string }[] = [
  { id: '60', name: '60%' },
  { id: '75', name: '75%' },
  { id: '100', name: '100%' },
];

function KeyRow({ keys, activeCodes, activate }: { keys: readonly KeyboardKey[]; activeCodes: ReadonlySet<string>; activate: (code: string) => void }) {
  return (
    <div className="tester-key-row">
      {keys.map((key, index) => (
        <button
          key={`${key.code}-${index}`}
          type="button"
          className={`tester-key ${key.accent ? `tester-key-${key.accent}` : ''} ${activeCodes.has(key.code) ? 'is-active' : ''}`}
          style={{ '--key-units': key.units ?? 1 } as CSSProperties}
          aria-pressed={activeCodes.has(key.code)}
          aria-label={`Tecla ${key.label}`}
          onClick={() => activate(key.code)}
        >
          {key.label}
        </button>
      ))}
    </div>
  );
}

export function KeyboardTestScreen({ musicOn, setMusicOn, volume, setVolume, onBack }: Props) {
  const [themeId, setThemeId] = useState(KEYBOARD_THEMES[0].id);
  const [paletteId, setPaletteId] = useState(KEYBOARD_PALETTES[0].id);
  const [mascotId, setMascotId] = useState('cloud');
  const [language, setLanguage] = useState<KeyboardLanguage>('es');
  const [size, setSize] = useState<KeyboardSize>('75');
  const [activeCodes, setActiveCodes] = useState<ReadonlySet<string>>(() => new Set());

  const theme = KEYBOARD_THEMES.find((item) => item.id === themeId) ?? KEYBOARD_THEMES[0];
  const palette = KEYBOARD_PALETTES.find((item) => item.id === paletteId) ?? KEYBOARD_PALETTES[0];
  const mascot = KEYBOARD_MASCOTS.find((item) => item.id === mascotId) ?? KEYBOARD_MASCOTS[0];
  const layout = useMemo(() => getKeyboardLayout(language, size), [language, size]);
  const visibleCodes = useMemo(() => keyboardCodes(layout), [layout]);

  useMenuBGM(musicOn, volume / 100);

  const activate = (code: string) => setActiveCodes((current) => new Set([...current, code]));

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement || event.target instanceof HTMLTextAreaElement) return;
      if (!visibleCodes.has(event.code)) return;
      event.preventDefault();
      activate(event.code);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [visibleCodes]);

  const styles = {
    '--tester-key': palette.key,
    '--tester-key-text': palette.keyText,
    '--tester-key-border': palette.border,
    '--tester-pressed': palette.pressed,
    '--tester-pressed-text': palette.pressedText,
    '--tester-panel': palette.panel,
  } as CSSProperties;

  return (
    <main className={`keyboard-test-screen keyboard-theme-${theme.background}`} style={styles}>
      <header className="keyboard-test-header">
        <button type="button" className="btn-back" onClick={onBack}>← Inicio</button>
        <div><p className="screen-kicker">Herramienta web gratuita</p><h1>Keyboard test</h1></div>
        <button type="button" className="keyboard-clean-header" onClick={() => setActiveCodes(new Set())}>Clean</button>
      </header>

      <section className="keyboard-test-layout" aria-label="Configuración y visualización del teclado">
        <aside className="keyboard-controls-panel" aria-label="Personaliza tu teclado">
          <div className="keyboard-control-heading"><p className="screen-kicker">Personaliza</p><h2>Tu teclado kawaii</h2></div>
          <label className="keyboard-select-label" htmlFor="keyboard-theme">Fondo<select id="keyboard-theme" value={themeId} onChange={(event) => setThemeId(event.target.value)}>{KEYBOARD_THEMES.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          <label className="keyboard-select-label" htmlFor="keyboard-palette">Paleta<select id="keyboard-palette" value={paletteId} onChange={(event) => setPaletteId(event.target.value)}>{KEYBOARD_PALETTES.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          <label className="keyboard-select-label" htmlFor="keyboard-mascot">Personaje<select id="keyboard-mascot" value={mascotId} onChange={(event) => setMascotId(event.target.value)}>{KEYBOARD_MASCOTS.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>

          <fieldset className="keyboard-choice-group"><legend>Distribución</legend><div>{languages.map((item) => <button key={item.id} type="button" className={language === item.id ? 'is-selected' : ''} aria-pressed={language === item.id} onClick={() => setLanguage(item.id)}>{item.name}</button>)}</div></fieldset>
          <fieldset className="keyboard-choice-group"><legend>Tamaño</legend><div>{sizes.map((item) => <button key={item.id} type="button" className={size === item.id ? 'is-selected' : ''} aria-pressed={size === item.id} onClick={() => setSize(item.id)}>{item.name}</button>)}</div></fieldset>

          <div className="keyboard-audio-panel"><div><strong>Música romántica</strong><span>{musicOn ? 'Sonando suave' : 'En pausa'}</span></div><button type="button" aria-pressed={musicOn} onClick={() => setMusicOn(!musicOn)}>{musicOn ? 'Silenciar' : 'Activar'}</button>{musicOn && <label htmlFor="keyboard-test-volume">Volumen <input id="keyboard-test-volume" type="range" min="0" max="100" value={volume} onChange={(event) => setVolume(Number(event.target.value))} /></label>}</div>
          <button type="button" className="keyboard-clean-button" onClick={() => setActiveCodes(new Set())}>Limpiar teclas usadas</button>
        </aside>

        <section className="keyboard-preview-panel" aria-live="polite">
          <div className="keyboard-preview-copy"><div><span>{theme.name}</span><h2>{palette.name} · {language === 'es' ? 'Español ISO' : 'English ANSI'} · {size}%</h2><p>{theme.description}</p></div>{mascot.asset && <img className="keyboard-mascot" src={mascot.asset} alt={`${mascot.name}: ${mascot.description}`} />}</div>
          <p className="keyboard-hint">Presiona las teclas físicas o tócalas aquí: cada una conserva el color de tu paleta.</p>
          <div className={`keyboard-visual-scroll keyboard-size-${size}`}>
            <div className="keyboard-visual" aria-label={`Teclado ${language === 'es' ? 'español ISO' : 'inglés ANSI'} ${size}%`}>
              {layout.functionRow && <KeyRow keys={layout.functionRow} activeCodes={activeCodes} activate={activate} />}
              <div className="keyboard-main-and-extras"><div className="keyboard-main-rows">{layout.mainRows.map((row, index) => <KeyRow key={index} keys={row} activeCodes={activeCodes} activate={activate} />)}</div>{layout.navigationRows && <div className="keyboard-navigation">{layout.navigationRows.map((row, index) => <KeyRow key={index} keys={row} activeCodes={activeCodes} activate={activate} />)}</div>}{layout.numpadRows && <div className="keyboard-numpad">{layout.numpadRows.map((row, index) => <KeyRow key={index} keys={row} activeCodes={activeCodes} activate={activate} />)}</div>}</div>
            </div>
          </div>
          <p className="keyboard-status">{activeCodes.size === 0 ? 'Aún no has probado teclas.' : `${activeCodes.size} tecla${activeCodes.size === 1 ? '' : 's'} iluminada${activeCodes.size === 1 ? '' : 's'}.`}</p>
        </section>
      </section>
    </main>
  );
}
