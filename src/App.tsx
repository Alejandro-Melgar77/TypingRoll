import { useState, useEffect } from 'react';
import './App.css';
import { PresentationScreen } from './screens/PresentationScreen';
import { HomeScreen } from './screens/HomeScreen';
import { CategoriesScreen } from './screens/CategoriesScreen';
import { GameOverScreen } from './screens/GameOverScreen';
import { GameScreen } from './screens/GameScreen';
import { TutorialScreen } from './screens/TutorialScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { CatalogScreen } from './screens/CatalogScreen';
import { ParagraphScreen } from './screens/ParagraphScreen';
import { KeyboardTestScreen } from './screens/KeyboardTestScreen';
import { useMenuBGM } from './components/audio/useMenuBGM';
import { createDailyChallenge } from './content/catalog';
import type { ParagraphMode } from './content/types';
import type { PlayerProgressPreview } from './components/ui/experienceTypes';
import type { AccessibilityPreferences } from './components/ui/AccessibilityControls';
import { isMathGameMode } from './game/domain/math';
import type { GameMode as DomainGameMode } from './game/domain/types';

export type ScreenState = 'PRESENTATION' | 'HOME' | 'CATEGORIES' | 'GAME' | 'GAMEOVER' | 'TUTORIAL' | 'PROGRESS' | 'CATALOG' | 'PARAGRAPH' | 'KEYBOARD_TEST';
export type GameMode = DomainGameMode;

interface PlayerProfile {
  coins: number;
  maxScore: number;
}

const PROFILE_STORAGE_KEY = 'typingroll_profiles';

function readProfiles(): Record<string, PlayerProfile> {
  try {
    const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('PRESENTATION');
  const [lastScore, setLastScore] = useState(0);
  const [baseTier, setBaseTier] = useState(1);

  // Global Settings State
  const [musicOn, setMusicOn] = useState(false);
  const [volume, setVolume] = useState(50);
  const [darkMode, setDarkMode] = useState(false);
  const [accessibilityPreferences, setAccessibilityPreferences] = useState<AccessibilityPreferences>(() => {
    try {
      const stored = localStorage.getItem('typingroll_accessibility');
      return stored ? JSON.parse(stored) as AccessibilityPreferences : { reducedMotion: false, highContrast: false };
    } catch {
      return { reducedMotion: false, highContrast: false };
    }
  });
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [paragraphMode, setParagraphMode] = useState<ParagraphMode>('classic');

  const [sessionUser, setSessionUser] = useState<string | null>(() => {
    return localStorage.getItem('typingroll_session');
  });

  // Economy State
  const [globalCoins, setGlobalCoins] = useState(() => {
    const session = localStorage.getItem('typingroll_session');
    return session ? readProfiles()[session]?.coins ?? 0 : 0;
  });

  // Max Score State
  const [globalMaxScore, setGlobalMaxScore] = useState(() => {
    const session = localStorage.getItem('typingroll_session');
    return session ? readProfiles()[session]?.maxScore ?? 0 : 0;
  });

  // Cada perfil local conserva su propio progreso; el modo invitado es temporal.
  useEffect(() => {
    if (sessionUser) {
      localStorage.setItem('typingroll_session', sessionUser);
      const profiles = readProfiles();
      profiles[sessionUser] = { coins: globalCoins, maxScore: globalMaxScore };
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profiles));
    } else {
      localStorage.removeItem('typingroll_session');
    }
  }, [globalCoins, globalMaxScore, sessionUser]);

  const handleLogout = () => {
    setSessionUser(null);
    setGlobalCoins(0);
    setGlobalMaxScore(0);
    localStorage.removeItem('typingroll_session');
  };

  // Revival Mechanics State
  const [checkpointScore, setCheckpointScore] = useState(0);
  const [revivalCount, setRevivalCount] = useState(0);
  const [lastEarnedCoins, setLastEarnedCoins] = useState(0);
  const [lastRunScore, setLastRunScore] = useState(0);

  // BGM
  const isMenu = currentScreen !== 'GAME' && currentScreen !== 'PARAGRAPH' && currentScreen !== 'KEYBOARD_TEST';
  useMenuBGM(musicOn && isMenu, volume / 100);

  const startGame = (mode: GameMode, tier: number) => {
    setGameMode(mode);
    setLastScore(0);
    setBaseTier(isMathGameMode(mode) ? 1 : tier);
    setCheckpointScore(0);
    setRevivalCount(0);
    setLastEarnedCoins(0);
    setCurrentScreen('GAME');
  };

  const dailyChallenge = createDailyChallenge();
  const progressPreview: PlayerProgressPreview = {
    displayName: sessionUser ?? 'Jugador invitado',
    guest: !sessionUser,
    level: Math.max(1, Math.floor(globalMaxScore / 800) + 1),
    experience: globalMaxScore % 800,
    experienceToNextLevel: 800,
    coins: globalCoins,
    highScore: globalMaxScore,
    bestWpm: 0,
    accuracy: lastRunScore ? Math.min(100, Math.round(78 + Math.min(20, lastRunScore / 350))) : 0,
    streakDays: 0,
    dailyMissions: [
      {
        id: dailyChallenge.id,
        title: dailyChallenge.title,
        description: `Consigue ${dailyChallenge.targetScore.toLocaleString('es-ES')} puntos en una partida clásica.`,
        current: Math.min(lastRunScore, dailyChallenge.targetScore),
        target: dailyChallenge.targetScore,
        rewardLabel: `+${dailyChallenge.rewardCoins} nubes`,
        completed: lastRunScore >= dailyChallenge.targetScore,
      },
      { id: 'daily-words', title: 'Nubes al rescate', description: 'Elimina 15 palabras en una sesión.', current: 0, target: 15, rewardLabel: 'Estela brillante' },
      { id: 'daily-focus', title: 'Ritmo sereno', description: 'Termina una partida con precisión alta.', current: 0, target: 1, rewardLabel: '+15 nubes' },
    ],
    achievements: [
      { id: 'first-flight', title: 'Primer vuelo', description: 'Completa una partida.', icon: '☁', unlocked: lastRunScore > 0 },
      { id: 'score-1000', title: 'Mil destellos', description: 'Alcanza 1.000 puntos.', icon: '✦', unlocked: globalMaxScore >= 1000 },
      { id: 'score-3000', title: 'Noche valiente', description: 'Alcanza 3.000 puntos.', icon: '⚡', unlocked: globalMaxScore >= 3000 },
    ],
  };

  // Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.dataset.reduceMotion = String(accessibilityPreferences.reducedMotion);
    document.documentElement.dataset.contrast = accessibilityPreferences.highContrast ? 'high' : 'normal';
    localStorage.setItem('typingroll_accessibility', JSON.stringify(accessibilityPreferences));
  }, [accessibilityPreferences]);

  return (
    <div className="app-container">
      {currentScreen === 'PRESENTATION' && (
        <PresentationScreen onNext={() => setCurrentScreen('HOME')} />
      )}
      
      {currentScreen === 'HOME' && (
        <HomeScreen 
          onPlay={() => setCurrentScreen('CATEGORIES')} 
          musicOn={musicOn} setMusicOn={setMusicOn}
          volume={volume} setVolume={setVolume}
          darkMode={darkMode} setDarkMode={setDarkMode}
          coins={globalCoins}
          maxScore={globalMaxScore}
          sessionUser={sessionUser}
          onLogin={(name) => {
            const profileName = name.trim().slice(0, 24);
            const profile = readProfiles()[profileName] ?? { coins: 0, maxScore: 0 };
            setGlobalCoins(profile.coins);
            setGlobalMaxScore(profile.maxScore);
            setSessionUser(profileName);
          }}
          onLogout={handleLogout}
          onShowTutorial={() => setCurrentScreen('TUTORIAL')}
          onShowProgress={() => setCurrentScreen('PROGRESS')}
          onShowCatalog={() => setCurrentScreen('CATALOG')}
          onShowKeyboardTest={() => setCurrentScreen('KEYBOARD_TEST')}
          accessibilityPreferences={accessibilityPreferences}
          onAccessibilityPreferencesChange={setAccessibilityPreferences}
        />
      )}

      {currentScreen === 'CATEGORIES' && (
        <CategoriesScreen 
          onBack={() => setCurrentScreen('HOME')}
          onSelectCategory={startGame}
          onStartParagraph={(mode) => { setParagraphMode(mode); setCurrentScreen('PARAGRAPH'); }}
          coins={globalCoins}
        />
      )}

      {currentScreen === 'TUTORIAL' && (
        <TutorialScreen
          onBack={() => setCurrentScreen('HOME')}
          onStart={startGame}
          accessibilityPreferences={accessibilityPreferences}
          onAccessibilityPreferencesChange={setAccessibilityPreferences}
        />
      )}

      {currentScreen === 'PROGRESS' && (
        <ProgressScreen
          progress={progressPreview}
          onBack={() => setCurrentScreen('HOME')}
          onPlay={() => startGame('classic', 1)}
          onOpenCatalog={() => setCurrentScreen('CATALOG')}
          accessibilityPreferences={accessibilityPreferences}
          onAccessibilityPreferencesChange={setAccessibilityPreferences}
        />
      )}

      {currentScreen === 'CATALOG' && (
        <CatalogScreen
          coins={globalCoins}
          onBack={() => setCurrentScreen('HOME')}
          accessibilityPreferences={accessibilityPreferences}
          onAccessibilityPreferencesChange={setAccessibilityPreferences}
        />
      )}

      {currentScreen === 'PARAGRAPH' && (
        <ParagraphScreen
          mode={paragraphMode}
          musicOn={musicOn}
          setMusicOn={setMusicOn}
          volume={volume}
          setVolume={setVolume}
          onExit={() => setCurrentScreen('CATEGORIES')}
        />
      )}

      {currentScreen === 'KEYBOARD_TEST' && (
        <KeyboardTestScreen
          musicOn={musicOn}
          setMusicOn={setMusicOn}
          volume={volume}
          setVolume={setVolume}
          onBack={() => setCurrentScreen('HOME')}
        />
      )}

      {currentScreen === 'GAME' && (
        <GameScreen 
          musicOn={musicOn}
          setMusicOn={setMusicOn}
          volume={volume}
          setVolume={setVolume}
          initialScore={lastScore}
          baseTier={baseTier}
          isRevived={revivalCount > 0}
          gameMode={gameMode}
          onExit={() => setCurrentScreen('HOME')}
          onGameOver={(score) => {
            setLastScore(score);
            setLastRunScore(score);
            setGlobalMaxScore((current) => Math.max(current, score));
            const earned = Math.floor(Math.max(0, score - checkpointScore) / 4);
            setLastEarnedCoins(earned);
            setGlobalCoins((current) => current + earned);
            setCurrentScreen('GAMEOVER');
          }} 
        />
      )}

      {currentScreen === 'GAMEOVER' && (
        <GameOverScreen 
          score={lastScore}
          checkpointScore={checkpointScore}
          setCheckpointScore={setCheckpointScore}
          revivalCount={revivalCount}
          setRevivalCount={setRevivalCount}
          globalCoins={globalCoins}
          setGlobalCoins={setGlobalCoins}
          earnedCoins={lastEarnedCoins}
          onCategories={() => setCurrentScreen('CATEGORIES')}
          onRevive={() => setCurrentScreen('GAME')}
        />
      )}
    </div>
  );
}

export default App;
