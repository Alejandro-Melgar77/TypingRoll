import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { VirtualKeyboard } from '../components/game/VirtualKeyboard';
import { useGameBGM } from '../components/audio/useGameBGM';
import { useSFX } from '../components/audio/useSFX';
import { CONTENT_CATALOG } from '../content/catalog';
import { createRunConfig } from '../game/domain/engine';
import type { RunEvent, RunInput, RunResult, RunState, Tier } from '../game/domain/types';
import type { PhaserGameHandle } from '../game/phaser/PhaserGame';
import './GameScreen.css';

const PhaserGameView = lazy(async () => {
  const module = await import('../game/phaser/PhaserGame');
  return { default: module.PhaserGameView };
});

interface Props {
  initialScore: number;
  baseTier: number;
  isRevived: boolean;
  onGameOver: (score: number) => void;
  musicOn: boolean;
  setMusicOn: (value: boolean) => void;
  volume: number;
  setVolume: (value: number) => void;
  gameMode: 'classic' | 'es_en' | 'en_es';
  onExit: () => void;
}

const modeLabels = {
  classic: 'Escribe la palabra de la nube más baja',
  es_en: 'Traduce al inglés y confirma',
  en_es: 'Traduce al español y confirma',
};

const formatTime = (milliseconds: number) => {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
};

const playableContent = (mode: Props['gameMode']) => {
  const classicWords: Record<Tier, string[]> = { 1: [], 2: [], 3: [], 4: [], 5: [] };
  CONTENT_CATALOG.words
    .filter((word) => word.language === 'es' && word.status === 'published' && word.isSafe)
    .forEach((word) => classicWords[word.difficulty].push(word.text));
  const translations: Record<string, string[]> = {};
  CONTENT_CATALOG.translations
    .filter((translation) => translation.status === 'published')
    .forEach((translation) => {
      const source = CONTENT_CATALOG.words.find((word) => word.id === translation.sourceWordId);
      const target = CONTENT_CATALOG.words.find((word) => word.id === translation.targetWordId);
      if (!source || !target) return;
      if (mode === 'es_en' && source.language === 'es' && target.language === 'en') {
        (translations[source.text] ??= []).push(target.text);
      }
      if (mode === 'en_es' && source.language === 'es' && target.language === 'en') {
        (translations[target.text] ??= []).push(source.text);
      }
    });
  return { classicWords, translations };
};

export function GameScreen({
  initialScore, baseTier, onGameOver, musicOn, setMusicOn, volume, setVolume, gameMode, onExit,
}: Props) {
  const gameRef = useRef<PhaserGameHandle>(null);
  const finishedRef = useRef(false);
  const lastHudUpdateRef = useRef(0);
  const hasHudStateRef = useRef(false);
  const damageTimeoutRef = useRef<number | null>(null);
  const [snapshot, setSnapshot] = useState<RunState | null>(null);
  const [flashDamage, setFlashDamage] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { playDamageSound, playSuccessSound, playPowerSound } = useSFX();

  const runContent = useMemo(() => playableContent(gameMode), [gameMode]);
  const config = useMemo(() => createRunConfig(
    gameMode,
    Math.min(5, Math.max(1, baseTier)) as Tier,
    runContent.classicWords,
    runContent.translations,
    { durationMs: window.matchMedia('(max-width: 640px)').matches ? 90_000 : 180_000, initialScore },
  ), [baseTier, gameMode, initialScore, runContent]);

  const triggerDamage = useCallback(() => {
    setFlashDamage(true);
    playDamageSound(volume / 100);
    if (damageTimeoutRef.current !== null) window.clearTimeout(damageTimeoutRef.current);
    damageTimeoutRef.current = window.setTimeout(() => setFlashDamage(false), 220);
  }, [playDamageSound, volume]);

  const handleEvents = useCallback((events: readonly RunEvent[]) => {
    events.forEach((event) => {
      if (event.type === 'damage') triggerDamage();
      if (event.type === 'word-cleared') playSuccessSound(volume / 100);
      if (event.type === 'powerup-earned') playPowerSound(volume / 100);
    });
  }, [playPowerSound, playSuccessSound, triggerDamage, volume]);

  const handleState = useCallback((state: RunState) => {
    if (state.elapsedMs - lastHudUpdateRef.current >= 100 || state.status !== 'playing' || !hasHudStateRef.current) {
      lastHudUpdateRef.current = state.elapsedMs;
      hasHudStateRef.current = true;
      setSnapshot(state);
      setIsPaused(state.status === 'paused');
    }
  }, []);

  const handleFinished = useCallback((result: RunResult) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onGameOver(result.score);
  }, [onGameOver]);

  const dispatch = useCallback((input: RunInput) => gameRef.current?.dispatch(input), []);

  useGameBGM(musicOn && !isPaused, volume / 100, snapshot?.tier ?? baseTier);

  useEffect(() => () => {
    if (damageTimeoutRef.current !== null) window.clearTimeout(damageTimeoutRef.current);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        dispatch({ type: isPaused ? 'resume' : 'pause' });
        return;
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        dispatch({ type: 'confirm' });
        return;
      }
      if (event.key === 'Backspace') {
        event.preventDefault();
        dispatch({ type: 'backspace' });
        return;
      }
      if (/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ ]$/.test(event.key)) {
        event.preventDefault();
        dispatch({ type: 'key', key: event.key });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, isPaused]);

  const togglePause = () => dispatch({ type: isPaused ? 'resume' : 'pause' });
  const handleVirtualKey = (key: string) => {
    if (key === 'Enter') dispatch({ type: 'confirm' });
    else if (key === 'Backspace') dispatch({ type: 'backspace' });
    else dispatch({ type: 'key', key });
  };
  const timeRemaining = config.durationMs - (snapshot?.elapsedMs ?? 0);

  return (
    <main className={`game-screen tier-${snapshot?.tier ?? baseTier}`}>
      <div className={`damage-flash ${flashDamage ? 'is-visible' : ''}`} aria-hidden="true" />

      <header className="game-hud">
        <div className="hud-group hud-left">
          <div className="hud-pill"><span>Puntos</span><strong>{snapshot?.score ?? 0}</strong></div>
          <div className={`combo-meter ${snapshot?.combo ? 'is-active' : ''}`} aria-label={`Racha: ${snapshot?.combo ?? 0}`}>
            <span>Racha</span><strong>{snapshot?.combo ?? 0}</strong><i>★</i>
          </div>
          <div className="time-pill" aria-label={`Tiempo restante ${formatTime(timeRemaining)}`}>⌛ {formatTime(timeRemaining)}</div>
        </div>

        <div className="game-status" aria-live="polite">
          <span className="phase-label">Fase {snapshot?.tier ?? baseTier}</span>
          <span>{modeLabels[gameMode]}</span>
        </div>

        <div className="hud-group hud-right">
          <div className="lives" aria-label={`${snapshot?.lives ?? 3} vidas restantes`}>
            {Array.from({ length: 3 }, (_, index) => <span key={index} className={index < (snapshot?.lives ?? 3) ? 'is-full' : ''}>♥</span>)}
          </div>
          <button className="icon-button" onClick={togglePause} aria-label={isPaused ? 'Reanudar partida' : 'Pausar partida'}>
            {isPaused ? '▶' : 'Ⅱ'}
          </button>
        </div>
      </header>

      <section className="game-canvas-wrap" aria-label="Área de juego">
        <Suspense fallback={<div className="game-loading" aria-live="polite">Preparando el cielo…</div>}>
          <PhaserGameView ref={gameRef} config={config} onState={handleState} onEvents={handleEvents} onFinished={handleFinished} />
        </Suspense>
        {gameMode !== 'classic' && snapshot?.inputBuffer && <p className="translation-preview">Respuesta: <strong>{snapshot.inputBuffer}</strong></p>}
        <p className="river-warning">No dejes que las nubes lleguen al río</p>
        <div className="run-metrics" aria-label="Métricas de partida"><span>{snapshot?.correctWords ?? 0} palabras</span><span>{snapshot ? Math.round((snapshot.typedCharacters / 5) / Math.max(snapshot.elapsedMs / 60000, 1 / 60)) : 0} PPM</span></div>

        {isPaused && (
          <div className="pause-overlay" role="dialog" aria-modal="true" aria-label="Partida pausada">
            <div className="pause-card">
              <span className="phase-label">Pausa</span>
              <h2>Toma aire, la nube espera.</h2>
              <label className="volume-control" htmlFor="game-volume">
                <span>Volumen</span>
                <input id="game-volume" type="range" min="0" max="100" value={volume} onChange={(event) => setVolume(Number(event.target.value))} />
              </label>
              <button className="sound-toggle" onClick={() => setMusicOn(!musicOn)}>{musicOn ? '♫ Música activada' : '♫ Música apagada'}</button>
              <button className="btn-primary" onClick={togglePause}>Reanudar</button>
              <button className="text-button" onClick={onExit}>Salir al menú</button>
            </div>
          </div>
        )}
      </section>

      <section className="game-controls" aria-label="Ayudas de juego">
        <button className="power-button" disabled={!snapshot?.powerCharges} onClick={() => dispatch({ type: 'powerup', powerUp: 'breeze' })}>〰 Calma ×{snapshot?.powerCharges ?? 0}</button>
        <button className="power-button" disabled={!snapshot?.powerCharges} onClick={() => dispatch({ type: 'powerup', powerUp: 'shield' })}>✦ Escudo</button>
      </section>
      <VirtualKeyboard onKeyPress={handleVirtualKey} showControls={gameMode !== 'classic'} />
    </main>
  );
}
