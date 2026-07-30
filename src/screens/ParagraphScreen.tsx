import { useEffect, useMemo, useRef, useState } from 'react';
import { paragraphCategoryDetail, paragraphsForMode } from '../content/paragraphs';
import type { ParagraphMode } from '../content/types';
import { useMenuBGM } from '../components/audio/useMenuBGM';
import { paragraphCharacterState, paragraphMatches, paragraphMetrics } from '../game/domain/paragraph';
import './ParagraphScreen.css';

interface Props {
  mode: ParagraphMode;
  musicOn: boolean;
  setMusicOn: (value: boolean) => void;
  volume: number;
  setVolume: (value: number) => void;
  onExit: () => void;
}

const nextIndex = (current: number, length: number) => {
  if (length < 2) return 0;
  const offset = 1 + Math.floor(Math.random() * (length - 1));
  return (current + offset) % length;
};

const formatTime = (milliseconds: number) => {
  const totalTenths = Math.floor(milliseconds / 100);
  const seconds = Math.floor(totalTenths / 10);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}.${totalTenths % 10}`;
};

export function ParagraphScreen({ mode, musicOn, setMusicOn, volume, setVolume, onExit }: Props) {
  const paragraphs = useMemo(() => paragraphsForMode(mode), [mode]);
  const [paragraphIndex, setParagraphIndex] = useState(0);
  const [input, setInput] = useState('');
  const [elapsedMs, setElapsedMs] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [lastWpm, setLastWpm] = useState<number | null>(null);
  const [message, setMessage] = useState('Escribe en el lienzo y confirma con Enter cuando esté perfecto.');
  const startedAt = useRef(performance.now());
  const current = paragraphs[paragraphIndex] ?? paragraphs[0];
  const selectedDetail = paragraphCategoryDetail(mode);
  const currentDetail = paragraphCategoryDetail(current.category);
  const isComplete = paragraphMatches(current.text, input);

  useMenuBGM(musicOn, volume / 100, current.category);

  useEffect(() => {
    const timer = window.setInterval(() => setElapsedMs(performance.now() - startedAt.current), 100);
    return () => window.clearInterval(timer);
  }, [paragraphIndex]);

  const submit = () => {
    if (!isComplete) {
      setMessage('Aún hay letras rojas o espacios pendientes. Corrige el lienzo antes de continuar.');
      return;
    }
    const metrics = paragraphMetrics(current.text, performance.now() - startedAt.current);
    setCompleted((value) => value + 1);
    setTotalScore((value) => value + metrics.score);
    setLastWpm(metrics.wordsPerMinute);
    setMessage(`¡Párrafo perfecto! +${metrics.score} puntos. El siguiente ya está listo.`);
    setParagraphIndex((value) => nextIndex(value, paragraphs.length));
    setInput('');
    startedAt.current = performance.now();
    setElapsedMs(0);
  };

  return (
    <main className={`paragraph-screen paragraph-mode-${mode}`}>
      <header className="paragraph-header">
        <button className="btn-back" type="button" onClick={onExit}>← Salir</button>
        <div><p className="screen-kicker">Modo infinito · {selectedDetail.shortName}</p><h1>Párrafo</h1></div>
        <div className="paragraph-time" aria-label={`Tiempo del párrafo ${formatTime(elapsedMs)}`}><span>Tiempo</span><strong>{formatTime(elapsedMs)}</strong></div>
      </header>

      <section className="paragraph-session" aria-labelledby="paragraph-title">
        <div className="paragraph-stat-row" aria-label="Métricas de la sesión"><article><span>Completados</span><strong>{completed}</strong></article><article><span>Puntaje</span><strong>{totalScore.toLocaleString('es-ES')}</strong></article><article><span>Último ritmo</span><strong>{lastWpm ?? '—'} <small>PPM</small></strong></article></div>
        <div className="paragraph-title-row"><div><p className="screen-kicker">{currentDetail.shortName}</p><h2 id="paragraph-title">Copia el texto con calma</h2><p className="paragraph-category-note">{selectedDetail.description}</p></div><button type="button" className="paragraph-music-button" aria-pressed={musicOn} onClick={() => setMusicOn(!musicOn)}>{musicOn ? `Música: ${currentDetail.musicName}` : 'Activar música'}</button></div>
        <p className="paragraph-music-note">Pista actual: {currentDetail.musicDescription}</p>
        {musicOn && <label className="paragraph-volume" htmlFor="paragraph-volume">Volumen <input id="paragraph-volume" type="range" min="0" max="100" value={volume} onChange={(event) => setVolume(Number(event.target.value))} /></label>}
        <article className="paragraph-reference" aria-label="Texto de referencia"><p>{current.text}</p>{current.sourceReference && <footer>Reflexión original vinculada a {current.sourceReference}; no sustituye la lectura del texto bíblico.</footer>}</article>

        <section className="paragraph-writing-section" aria-label="Lienzo de escritura">
          <div className="paragraph-writing-stack">
            <p className="paragraph-highlight" aria-hidden="true">{Array.from({ length: Math.max(current.text.length, input.length) }, (_, index) => {
              const character = input[index] ?? current.text[index];
              return <span key={`${character}-${index}`} className={`paragraph-char ${paragraphCharacterState(current.text, input, index)}`}>{character === ' ' ? ' ' : character}</span>;
            })}</p>
            <textarea className="paragraph-input" aria-label="Escribe el párrafo aquí" value={input} onChange={(event) => { setInput(event.target.value); setMessage(''); }} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); submit(); } }} spellCheck={false} autoFocus />
          </div>
          <div className="paragraph-action-row"><p role="status" aria-live="polite">{message}</p><button type="button" className="paragraph-submit" onClick={submit} disabled={!isComplete}>Confirmar con Enter</button></div>
        </section>
      </section>
    </main>
  );
}
