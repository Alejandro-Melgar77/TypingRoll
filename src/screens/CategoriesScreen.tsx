import { useState } from 'react';
import type { PlayableMode } from '../components/ui/experienceTypes';
import { PARAGRAPH_CATEGORY_DETAILS } from '../content/paragraphs';
import type { ParagraphMode } from '../content/types';
import './CategoriesScreen.css';

interface Props {
  onSelectCategory: (category: PlayableMode, baseTier: number) => void;
  onBack: () => void;
  coins: number;
  onShowTutorial?: () => void;
  onStartParagraph: (mode: ParagraphMode) => void;
}

type CategoryView = 'modes' | 'difficulty-classic' | 'language' | 'math' | 'arithmetic' | 'paragraph';

const DIFFICULTIES = [
  { tier: 1, name: 'Suave', description: 'Palabras cortas para entrar en ritmo.', icon: '☁' },
  { tier: 3, name: 'Fluida', description: 'El vuelo ideal para una partida completa.', icon: '✦' },
  { tier: 5, name: 'Tormenta', description: 'Nubes veloces para manos expertas.', icon: '⚡' },
] as const;

export function CategoriesScreen({ onSelectCategory, onBack, coins, onShowTutorial, onStartParagraph }: Props) {
  const [view, setView] = useState<CategoryView>('modes');
  const [selectedMode, setSelectedMode] = useState<PlayableMode>('classic');

  const openDifficulty = (mode: PlayableMode) => {
    setSelectedMode(mode);
    setView('difficulty-classic');
  };

  const back = () => {
    if (view === 'modes') onBack();
    else if (view === 'arithmetic') setView('math');
    else setView('modes');
  };

  const pageTitle = view === 'difficulty-classic'
    ? 'Elige tu ritmo'
    : view === 'language'
      ? 'Modo idiomas'
      : view === 'math'
        ? 'Matemáticas'
        : view === 'arithmetic'
          ? 'Aritmética'
          : view === 'paragraph'
            ? 'Párrafo'
          : 'Elige tu vuelo';

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
            <button className="btn-category classic category-math" type="button" onClick={() => setView('math')}><span className="category-icon" aria-hidden="true">＋</span><strong>Matemáticas</strong><span>Resuelve operaciones mientras las nubes bajan.</span></button>
            <button className="btn-category classic category-paragraph" type="button" onClick={() => setView('paragraph')}><span className="category-icon" aria-hidden="true">✎</span><strong>Párrafo infinito</strong><span>Elige una colección para escribir y respirar.</span></button>
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

      {view === 'math' && (
        <section className="categories-layout" aria-label="Modo de matemáticas">
          <p className="categories-intro">La fase empieza siempre en 1 y sube cada seis respuestas correctas. No hay resultados negativos ni decimales.</p>
          <div className="categories-list">
            <button className="btn-category classic category-math" type="button" onClick={() => setView('arithmetic')}><span className="category-icon" aria-hidden="true">＋</span><strong>Aritmética</strong><span>Sumas, restas, multiplicaciones, divisiones y fracciones.</span></button>
          </div>
        </section>
      )}

      {view === 'arithmetic' && (
        <section className="categories-layout" aria-label="Operación aritmética">
          <p className="categories-intro">Elige una operación o mezcla todas en Clásico. Cada partida aumenta la complejidad al avanzar.</p>
          <div className="categories-list arithmetic-list">
            <button className="btn-category classic category-featured" type="button" onClick={() => onSelectCategory('math_classic', 1)}><span className="category-icon" aria-hidden="true">✦</span><strong>Clásico</strong><span>Una mezcla que se desbloquea por fases.</span></button>
            <button className="btn-category classic category-math" type="button" onClick={() => onSelectCategory('math_addition', 1)}><span className="category-icon" aria-hidden="true">＋</span><strong>Suma</strong><span>Números cada vez más grandes.</span></button>
            <button className="btn-category classic category-math" type="button" onClick={() => onSelectCategory('math_subtraction', 1)}><span className="category-icon" aria-hidden="true">−</span><strong>Resta</strong><span>Solo resultados positivos.</span></button>
            <button className="btn-category classic category-math" type="button" onClick={() => onSelectCategory('math_multiplication', 1)}><span className="category-icon" aria-hidden="true">×</span><strong>Multiplicación</strong><span>Tablas para entrenar el ritmo.</span></button>
            <button className="btn-category classic category-math" type="button" onClick={() => onSelectCategory('math_division', 1)}><span className="category-icon" aria-hidden="true">÷</span><strong>División</strong><span>Siempre exacta, sin decimales.</span></button>
            <button className="btn-category classic category-math" type="button" onClick={() => onSelectCategory('math_fractions', 1)}><span className="category-icon" aria-hidden="true">½</span><strong>Fracciones</strong><span>Responde con la fracción reducida.</span></button>
          </div>
        </section>
      )}

      {view === 'paragraph' && (
        <section className="categories-layout" aria-label="Colecciones de Párrafo">
          <p className="categories-intro">Cada colección tiene textos locales y una pista instrumental procedural propia. Clásico alterna todas las subcategorías.</p>
          <div className="categories-list paragraph-mode-list">
            {PARAGRAPH_CATEGORY_DETAILS.map((detail) => (
              <button key={detail.id} className={`btn-category classic category-paragraph paragraph-mode-${detail.id}`} type="button" onClick={() => onStartParagraph(detail.id)}>
                <span className="category-icon" aria-hidden="true">{detail.id === 'classic' ? '✦' : '✎'}</span>
                <strong>{detail.name}</strong>
                <span>{detail.description} Música: {detail.musicName}.</span>
              </button>
            ))}
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
