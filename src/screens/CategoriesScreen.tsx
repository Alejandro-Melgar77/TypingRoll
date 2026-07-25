import { useState } from 'react';
import type { PlayableMode } from '../components/ui/experienceTypes';
import './CategoriesScreen.css';

interface Props {
  onSelectCategory: (category: PlayableMode, baseTier: number) => void;
  onBack: () => void;
  coins: number;
  onShowTutorial?: () => void;
}

type CategoryView = 'modes' | 'difficulty-classic' | 'language';

const DIFFICULTIES = [
  { tier: 1, name: 'Suave', description: 'Palabras cortas para entrar en ritmo.', icon: '☁' },
  { tier: 3, name: 'Fluida', description: 'El vuelo ideal para una partida completa.', icon: '✦' },
  { tier: 5, name: 'Tormenta', description: 'Nubes veloces para manos expertas.', icon: '⚡' },
] as const;

export function CategoriesScreen({ onSelectCategory, onBack, coins, onShowTutorial }: Props) {
  const [view, setView] = useState<CategoryView>('modes');
  const [selectedMode, setSelectedMode] = useState<PlayableMode>('classic');

  const openDifficulty = (mode: PlayableMode) => {
    setSelectedMode(mode);
    setView('difficulty-classic');
  };

  const back = () => {
    if (view === 'modes') onBack();
    else setView('modes');
  };

  const pageTitle = view === 'difficulty-classic' ? 'Elige tu ritmo' : view === 'language' ? 'Modo idiomas' : 'Elige tu vuelo';

  return (
    <main className="categories-container">
      <header className="categories-header">
        <button className="btn-back" type="button" onClick={back}>← {view === 'modes' ? 'Inicio' : 'Modos'}</button>
        <div><p className="screen-kicker">Partida nueva</p><h1 className="title">{pageTitle}</h1></div>
        <span className="categories-coins" aria-label={`${coins} nubes moneda`}>☁ {coins}</span>
      </header>

      {view === 'modes' && (
        <section className="categories-layout" aria-label="Modos disponibles">
          <p className="categories-intro">Todas las partidas son de supervivencia: escribe antes de que la nube alcance el río.</p>
          <div className="categories-list">
            <button className="btn-category classic category-featured" type="button" onClick={() => openDifficulty('classic')}><span className="category-icon" aria-hidden="true">☁</span><strong>Clásico</strong><span>Nubes, palabras y tu mejor ritmo.</span></button>
            <button className="btn-category classic category-language" type="button" onClick={() => setView('language')}><span className="category-icon" aria-hidden="true">🌍</span><strong>Idiomas</strong><span>Traduce palabras mientras mantienes el vuelo.</span></button>
            <button className="btn-category locked" type="button" disabled><span className="category-icon" aria-hidden="true">✎</span><strong>Escritura</strong><span>Próximamente</span></button>
          </div>
          {onShowTutorial && <button className="categories-guide" type="button" onClick={onShowTutorial}>¿Primera partida? Mira la guía de 1 minuto</button>}
        </section>
      )}

      {view === 'language' && (
        <section className="categories-layout" aria-label="Dirección de traducción">
          <p className="categories-intro">Lee una palabra y escribe su traducción. Empieza suave para conocer el vocabulario.</p>
          <div className="categories-list">
            <button className="btn-category classic category-language" type="button" onClick={() => openDifficulty('es_en')}><span className="category-icon" aria-hidden="true">ES → EN</span><strong>Español a inglés</strong><span>La nube viene en español, responde en inglés.</span></button>
            <button className="btn-category classic category-featured" type="button" onClick={() => openDifficulty('en_es')}><span className="category-icon" aria-hidden="true">EN → ES</span><strong>Inglés a español</strong><span>La nube viene en inglés, responde en español.</span></button>
          </div>
        </section>
      )}

      {view === 'difficulty-classic' && (
        <section className="categories-layout" aria-label="Nivel de dificultad">
          <p className="categories-intro">Puedes cambiar de ritmo en tu próxima partida. Lo importante es sostener una racha que se sienta bien.</p>
          <div className="categories-list difficulty-list">
            {DIFFICULTIES.map((difficulty) => <button key={difficulty.tier} className={`btn-category classic difficulty-tier tier-${difficulty.tier}`} type="button" onClick={() => onSelectCategory(selectedMode, difficulty.tier)}><span className="category-icon" aria-hidden="true">{difficulty.icon}</span><strong>{difficulty.name}</strong><span>{difficulty.description}</span></button>)}
          </div>
        </section>
      )}
    </main>
  );
}
