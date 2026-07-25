import { useEffect, useState } from 'react';
import './PresentationScreen.css';

interface Props {
  onNext: () => void;
}

interface FallingKey {
  id: number;
  left: number;
  delay: number;
  letter: string;
  duration: number;
}

function createFallingKeys(): FallingKey[] {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return Array.from({ length: 18 }, (_, index) => ({
    id: index,
    left: Math.round(Math.random() * 96 + 2),
    delay: Math.round(Math.random() * 50) / 10,
    duration: 6 + Math.round(Math.random() * 25) / 10,
    letter: letters[Math.floor(Math.random() * letters.length)],
  }));
}

export function PresentationScreen({ onNext }: Props) {
  const [keys] = useState(createFallingKeys);

  useEffect(() => {
    const timer = window.setTimeout(onNext, 3600);
    return () => window.clearTimeout(timer);
  }, [onNext]);

  return (
    <main className="presentation-container">
      <div className="presentation-glow" aria-hidden="true" />
      {keys.map((key) => <span key={key.id} className="falling-key" style={{ left: `${key.left}%`, animationDelay: `${key.delay}s`, animationDuration: `${key.duration}s` }} aria-hidden="true">{key.letter}</span>)}
      <div className="presentation-content">
        <div className="cloud-logo" aria-hidden="true"><div className="cloud-face"><div className="eye left" /><div className="eye right" /><div className="smile" /></div></div>
        <p className="presentation-kicker">Escribe. Fluye. Sobrevive.</p>
        <h1 className="game-title">TypingRoll</h1>
        <button className="tap-to-start" type="button" onClick={onNext}>Toca o presiona aquí para comenzar <span aria-hidden="true">→</span></button>
        <p className="presentation-auto">Comienza automáticamente en unos segundos</p>
      </div>
    </main>
  );
}
