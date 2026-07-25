import { useState } from 'react';
import { AccessibilityControls, type AccessibilityPreferences } from '../components/ui/AccessibilityControls';
import type { PlayerProgressPreview } from '../components/ui/experienceTypes';
import './ProgressScreen.css';

export interface ProgressScreenProps {
  progress: PlayerProgressPreview;
  onBack: () => void;
  onPlay?: () => void;
  onOpenCatalog?: () => void;
  accessibilityPreferences?: AccessibilityPreferences;
  onAccessibilityPreferencesChange?: (preferences: AccessibilityPreferences) => void;
}

function clampProgress(value: number, total: number) {
  return Math.max(0, Math.min(100, total > 0 ? (value / total) * 100 : 0));
}

export function ProgressScreen({ progress, onBack, onPlay, onOpenCatalog, accessibilityPreferences, onAccessibilityPreferencesChange }: ProgressScreenProps) {
  const [localPreferences, setLocalPreferences] = useState<AccessibilityPreferences>({
    reducedMotion: false,
    highContrast: false,
  });
  const preferences = accessibilityPreferences ?? localPreferences;
  const setPreferences = onAccessibilityPreferencesChange ?? setLocalPreferences;
  const levelProgress = clampProgress(progress.experience, progress.experienceToNextLevel);
  const completedMissions = progress.dailyMissions.filter((mission) => mission.completed || mission.current >= mission.target).length;

  return (
    <main className="progress-container">
      <header className="progress-header">
        <button className="btn-back" type="button" onClick={onBack}>← Inicio</button>
        <div>
          <p className="screen-kicker">Tu recorrido</p>
          <h1>Progreso</h1>
        </div>
        <span className="progress-coins" aria-label={`${progress.coins} nubes moneda`}>☁ {progress.coins}</span>
      </header>

      <section className="progress-identity progress-card">
        <div className="player-cloud" aria-hidden="true"><span>✦</span></div>
        <div>
          <p className="guest-label">{progress.guest === false ? 'Perfil de jugador' : 'Perfil invitado'}</p>
          <h2>{progress.displayName || 'Jugador invitado'}</h2>
          <p className="guest-note">{progress.guest === false
            ? 'Tu progreso se sincroniza cuando haya conexión.'
            : 'Tu progreso está ligado a este dispositivo mientras juegas como invitado.'}</p>
        </div>
        <div className="level-pill" aria-label={`Nivel ${progress.level}`}><span>Nivel</span><strong>{progress.level}</strong></div>
        <div className="experience-meter progress-wide-meter">
          <div className="meter-label"><span>Experiencia</span><strong>{progress.experience}/{progress.experienceToNextLevel} XP</strong></div>
          <div className="meter-track" role="progressbar" aria-label="Experiencia al siguiente nivel" aria-valuemin={0} aria-valuemax={progress.experienceToNextLevel} aria-valuenow={progress.experience}>
            <span style={{ width: `${levelProgress}%` }} />
          </div>
        </div>
      </section>

      <section className="progress-stat-grid" aria-label="Mejores marcas">
        <article className="progress-card stat-card"><span aria-hidden="true">🏆</span><p>Récord</p><strong>{progress.highScore.toLocaleString('es-ES')}</strong></article>
        <article className="progress-card stat-card"><span aria-hidden="true">⚡</span><p>Mejor ritmo</p><strong>{progress.bestWpm ?? 0} <small>PPM</small></strong></article>
        <article className="progress-card stat-card"><span aria-hidden="true">🎯</span><p>Precisión</p><strong>{progress.accuracy ?? 0}<small>%</small></strong></article>
        <article className="progress-card stat-card"><span aria-hidden="true">🔥</span><p>Racha diaria</p><strong>{progress.streakDays ?? 0} <small>días</small></strong></article>
      </section>

      <section className="mission-section" aria-labelledby="missions-heading">
        <div className="section-heading"><div><p className="screen-kicker">Hoy</p><h2 id="missions-heading">Retos diarios</h2></div><span>{completedMissions}/{progress.dailyMissions.length} listos</span></div>
        <div className="mission-list">
          {progress.dailyMissions.map((mission) => {
            const isComplete = Boolean(mission.completed || mission.current >= mission.target);
            const missionProgress = clampProgress(mission.current, mission.target);
            return (
              <article key={mission.id} className={`mission-card ${isComplete ? 'is-complete' : ''}`}>
                <div className="mission-check" aria-hidden="true">{isComplete ? '✓' : '○'}</div>
                <div className="mission-copy"><h3>{mission.title}</h3><p>{mission.description}</p><div className="meter-track mission-meter" role="progressbar" aria-label={`${mission.title}: ${mission.current} de ${mission.target}`} aria-valuemin={0} aria-valuemax={mission.target} aria-valuenow={mission.current}><span style={{ width: `${missionProgress}%` }} /></div></div>
                <span className="mission-reward">{mission.rewardLabel}</span>
              </article>
            );
          })}
        </div>
      </section>

      {progress.achievements && progress.achievements.length > 0 && (
        <section className="achievement-section" aria-labelledby="achievements-heading">
          <div className="section-heading"><div><p className="screen-kicker">Colección</p><h2 id="achievements-heading">Insignias</h2></div></div>
          <div className="achievement-list">
            {progress.achievements.map((achievement) => <article key={achievement.id} className={`achievement-card ${achievement.unlocked ? 'is-unlocked' : ''}`}><span aria-hidden="true">{achievement.icon}</span><div><h3>{achievement.title}</h3><p>{achievement.description}</p></div></article>)}
          </div>
        </section>
      )}

      <div className="progress-actions">
        {onPlay && <button className="btn-primary" type="button" onClick={onPlay}>Jugar reto de hoy</button>}
        {onOpenCatalog && <button className="btn-secondary" type="button" onClick={onOpenCatalog}>Ver cosméticos</button>}
      </div>
      <AccessibilityControls compact {...preferences} onChange={setPreferences} />
    </main>
  );
}
