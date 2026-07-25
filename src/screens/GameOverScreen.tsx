import type { Dispatch, SetStateAction } from 'react';
import './GameOverScreen.css';

interface Props {
  score: number;
  checkpointScore: number;
  setCheckpointScore: Dispatch<SetStateAction<number>>;
  revivalCount: number;
  setRevivalCount: Dispatch<SetStateAction<number>>;
  globalCoins: number;
  setGlobalCoins: Dispatch<SetStateAction<number>>;
  earnedCoins: number;
  onCategories: () => void;
  onRevive: () => void;
  accuracy?: number;
  wpm?: number;
  isNewHighScore?: boolean;
}

export function GameOverScreen({
  score,
  checkpointScore,
  setCheckpointScore,
  revivalCount,
  setRevivalCount,
  globalCoins,
  setGlobalCoins,
  earnedCoins,
  onCategories,
  onRevive,
  accuracy,
  wpm,
  isNewHighScore,
}: Props) {
  const reviveCost = 900 * 2 ** revivalCount;
  const canRevive = globalCoins >= reviveCost;
  const scoreSinceCheckpoint = Math.max(0, score - checkpointScore);

  const handleRevive = () => {
    if (!canRevive) return;
    setGlobalCoins((coins) => coins - reviveCost);
    setCheckpointScore(score);
    setRevivalCount((count) => count + 1);
    onRevive();
  };

  return (
    <main className="gameover-container">
      <section className="gameover-card" aria-labelledby="gameover-title">
        <div className="sad-cloud-logo" aria-hidden="true"><div className="cloud-face-sad"><div className="eye-sad left" /><div className="eye-sad right" /><div className="mouth-sad" /></div></div>
        <p className="gameover-kicker">El río volvió a estar tranquilo</p>
        <h1 id="gameover-title" className="gameover-title">Fin de la partida</h1>
        {isNewHighScore && <p className="new-record">✦ ¡Nuevo récord personal!</p>}
        <div className="score-display" aria-label={`Puntuación final ${score}`}><span>Puntuación</span><strong>{score.toLocaleString('es-ES')}</strong></div>

        <div className="gameover-stats" aria-label="Resumen de la partida">
          <div><span aria-hidden="true">☁</span><small>Desde el punto</small><strong>{scoreSinceCheckpoint}</strong></div>
          {wpm !== undefined && <div><span aria-hidden="true">⚡</span><small>Ritmo</small><strong>{wpm} <em>PPM</em></strong></div>}
          {accuracy !== undefined && <div><span aria-hidden="true">🎯</span><small>Precisión</small><strong>{accuracy}<em>%</em></strong></div>}
          <div><span aria-hidden="true">✦</span><small>Recompensa</small><strong>+{earnedCoins}</strong></div>
        </div>

        <div className="gameover-wallet"><span aria-hidden="true">☁</span><div><small>Saldo de nubes</small><strong>{globalCoins.toLocaleString('es-ES')}</strong></div><p>Las monedas se guardan en este perfil local.</p></div>

        <div className="gameover-buttons">
          <button className="btn-primary revive-button" type="button" onClick={handleRevive} disabled={!canRevive} aria-describedby="revive-cost"><span>Retomar desde aquí</span><small id="revive-cost">{canRevive ? `Costo: ${reviveCost} nubes` : `Necesitas ${reviveCost} nubes`}</small></button>
          <button className="btn-secondary" type="button" onClick={onCategories}>Nueva partida</button>
        </div>
        {!canRevive && <p className="revive-note">Sigue jugando para acumular nubes; nunca se requieren pagos.</p>}
      </section>
    </main>
  );
}
