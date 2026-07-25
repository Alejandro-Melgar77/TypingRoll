import { useState } from 'react';
import { AccessibilityControls, type AccessibilityPreferences } from '../components/ui/AccessibilityControls';
import './HomeScreen.css';

interface Props {
  onPlay: () => void;
  musicOn: boolean;
  setMusicOn: (value: boolean) => void;
  volume: number;
  setVolume: (value: number) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  coins: number;
  maxScore: number;
  sessionUser: string | null;
  onLogin: (name: string) => void;
  onLogout: () => void;
  /** Optional routes supplied by the application shell once the web hub is enabled. */
  onShowTutorial?: () => void;
  onShowProgress?: () => void;
  onShowCatalog?: () => void;
  accessibilityPreferences?: AccessibilityPreferences;
  onAccessibilityPreferencesChange?: (preferences: AccessibilityPreferences) => void;
}

type HomePanel = 'menu' | 'settings' | 'profile';

export function HomeScreen({
  onPlay,
  musicOn,
  setMusicOn,
  volume,
  setVolume,
  darkMode,
  setDarkMode,
  coins,
  maxScore,
  sessionUser,
  onLogin,
  onLogout,
  onShowTutorial,
  onShowProgress,
  onShowCatalog,
  accessibilityPreferences,
  onAccessibilityPreferencesChange,
}: Props) {
  const [panel, setPanel] = useState<HomePanel>('menu');
  const [nickname, setNickname] = useState('');
  const [localPreferences, setLocalPreferences] = useState<AccessibilityPreferences>({ reducedMotion: false, highContrast: false });
  const preferences = accessibilityPreferences ?? localPreferences;
  const setPreferences = onAccessibilityPreferencesChange ?? setLocalPreferences;
  const playerName = sessionUser || 'Jugador invitado';

  const saveNickname = () => {
    const cleanedNickname = nickname.trim();
    if (!cleanedNickname) return;
    onLogin(cleanedNickname);
    setPanel('menu');
  };

  return (
    <main className="home-container">
      <header className="home-topbar">
        <div className="home-stat home-stat-left"><span aria-hidden="true">🏆</span><span>Récord</span><strong>{maxScore.toLocaleString('es-ES')}</strong></div>
        <div className="home-stat home-stat-right"><span aria-hidden="true">☁</span><strong>{coins}</strong><span className={`profile-badge ${sessionUser ? 'profile-user' : 'profile-guest'}`}>{sessionUser || 'Invitado'}</span></div>
      </header>

      <section className="home-content" aria-labelledby="home-title">
        <div className="mini-logo" aria-hidden="true"><div className="cloud-face-mini"><div className="eye-mini left" /><div className="eye-mini right" /><div className="smile-mini" /></div></div>
        <div className="home-heading"><p>Una nube, un teclado, tu ritmo</p><h1 id="home-title">TypingRoll</h1></div>

        {panel === 'menu' && (
          <>
            <div className="menu-buttons">
              <button className="btn-primary home-play" type="button" onClick={onPlay}>Jugar ahora <span aria-hidden="true">→</span></button>
              <button className="btn-secondary" type="button" onClick={() => setPanel('profile')}>{sessionUser ? 'Editar apodo' : 'Elegir apodo'}</button>
              <button className="btn-secondary home-settings-button" type="button" onClick={() => setPanel('settings')}>Ajustes</button>
            </div>
            {(onShowTutorial || onShowProgress || onShowCatalog) && (
              <nav className="home-hub-links" aria-label="Más opciones de TypingRoll">
                {onShowTutorial && <button type="button" onClick={onShowTutorial}><span aria-hidden="true">☁</span>Guía rápida</button>}
                {onShowProgress && <button type="button" onClick={onShowProgress}><span aria-hidden="true">✦</span>Mi progreso</button>}
                {onShowCatalog && <button type="button" onClick={onShowCatalog}><span aria-hidden="true">🎨</span>Catálogo</button>}
              </nav>
            )}
            <p className="home-welcome">{sessionUser ? `¡Qué bueno verte, ${playerName}!` : 'Juega al instante. Sin registro ni pagos.'}</p>
          </>
        )}

        {panel === 'profile' && (
          <section className="settings-panel home-panel" aria-labelledby="profile-title">
            <p className="panel-kicker">Perfil local</p>
            <h2 id="profile-title">{sessionUser ? 'Tu apodo' : 'Elige un apodo'}</h2>
            <p className="panel-description">No es una cuenta: solo identifica tu progreso en este navegador.</p>
            <label className="home-input-label" htmlFor="player-nickname">Apodo</label>
            <input id="player-nickname" className="input-name home-name-input" type="text" maxLength={24} value={nickname} onChange={(event) => setNickname(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') saveNickname(); }} placeholder={sessionUser || 'Ej.: NubeVeloz'} autoFocus />
            <button className="btn-primary" type="button" onClick={saveNickname}>Guardar apodo</button>
            {sessionUser && <button className="home-text-button" type="button" onClick={() => { onLogout(); setPanel('menu'); }}>Usar modo invitado</button>}
            <button className="btn-secondary" type="button" onClick={() => setPanel('menu')}>Volver</button>
          </section>
        )}

        {panel === 'settings' && (
          <section className="settings-panel home-panel" aria-labelledby="settings-title">
            <p className="panel-kicker">Personaliza tu experiencia</p>
            <h2 id="settings-title">Ajustes</h2>
            <div className="setting-item"><label htmlFor="music-toggle">Música</label><button id="music-toggle" className="btn-toggle" type="button" aria-pressed={musicOn} onClick={() => setMusicOn(!musicOn)}>{musicOn ? 'Encendida' : 'Apagada'}</button></div>
            {musicOn && <div className="setting-item volume-setting"><label htmlFor="volume-control">Volumen <span>{volume}%</span></label><input id="volume-control" type="range" min="0" max="100" value={volume} onChange={(event) => setVolume(Number(event.target.value))} /></div>}
            <div className="setting-item"><label htmlFor="theme-toggle">Modo oscuro</label><button id="theme-toggle" className="btn-toggle" type="button" aria-pressed={darkMode} onClick={() => setDarkMode(!darkMode)}>{darkMode ? 'Activado' : 'Desactivado'}</button></div>
            <AccessibilityControls {...preferences} onChange={setPreferences} />
            <button className="btn-primary" type="button" onClick={() => setPanel('menu')}>Listo</button>
          </section>
        )}
      </section>
    </main>
  );
}
