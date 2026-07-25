import { useState } from 'react';
import { AccessibilityControls, type AccessibilityPreferences } from '../components/ui/AccessibilityControls';
import type { PlayableMode } from '../components/ui/experienceTypes';
import './TutorialScreen.css';

export interface TutorialScreenProps {
  onBack: () => void;
  onStart: (mode: PlayableMode, baseTier: number) => void;
  accessibilityPreferences?: AccessibilityPreferences;
  onAccessibilityPreferencesChange?: (preferences: AccessibilityPreferences) => void;
}

const STEPS = [
  {
    icon: '☁️',
    title: 'Mira la nube',
    text: 'Cada nube trae una palabra. Léela completa antes de tocar una tecla.',
    tip: 'Las palabras claras son más rápidas de reconocer.',
  },
  {
    icon: '⌨️',
    title: 'Escribe con ritmo',
    text: 'Teclea la palabra tal como aparece. Cada letra correcta colorea el recorrido.',
    tip: 'Busca precisión antes que velocidad: las rachas llegan solas.',
  },
  {
    icon: '🌊',
    title: 'Cuida el río',
    text: 'No dejes que las nubes alcancen el río. Conserva tus tres corazones y sube de fase.',
    tip: 'Una racha larga devuelve energía y mejora tu puntuación.',
  },
] as const;

export function TutorialScreen({ onBack, onStart, accessibilityPreferences, onAccessibilityPreferencesChange }: TutorialScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [localPreferences, setLocalPreferences] = useState<AccessibilityPreferences>({
    reducedMotion: false,
    highContrast: false,
  });
  const preferences = accessibilityPreferences ?? localPreferences;
  const setPreferences = onAccessibilityPreferencesChange ?? setLocalPreferences;
  const step = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <main className="tutorial-container">
      <header className="screen-topbar">
        <button className="btn-back" type="button" onClick={onBack}>← Volver</button>
        <p className="screen-kicker">Guía de vuelo</p>
        <span className="screen-step-count" aria-label={`Paso ${currentStep + 1} de ${STEPS.length}`}>
          {currentStep + 1}/{STEPS.length}
        </span>
      </header>

      <section className="tutorial-card" aria-live="polite">
        <div className="tutorial-sky" aria-hidden="true">
          <span className="tutorial-cloud tutorial-cloud-one" />
          <span className="tutorial-cloud tutorial-cloud-two" />
          <span className="tutorial-river" />
          <span className="tutorial-letter">{step.icon}</span>
        </div>
        <div className="tutorial-content">
          <p className="tutorial-eyebrow">Paso {currentStep + 1}</p>
          <h1>{step.title}</h1>
          <p>{step.text}</p>
          <aside className="tutorial-tip"><span aria-hidden="true">✦</span>{step.tip}</aside>
        </div>
      </section>

      <nav className="tutorial-dots" aria-label="Pasos del tutorial">
        {STEPS.map((item, index) => (
          <button
            key={item.title}
            type="button"
            className={index === currentStep ? 'is-current' : ''}
            aria-label={`Ir al paso ${index + 1}: ${item.title}`}
            aria-current={index === currentStep ? 'step' : undefined}
            onClick={() => setCurrentStep(index)}
          />
        ))}
      </nav>

      <div className="tutorial-actions">
        {currentStep > 0 && (
          <button className="btn-secondary tutorial-previous" type="button" onClick={() => setCurrentStep((stepIndex) => stepIndex - 1)}>
            Anterior
          </button>
        )}
        {isLastStep ? (
          <button className="btn-primary tutorial-start" type="button" onClick={() => onStart('classic', 1)}>
            ¡A jugar!
          </button>
        ) : (
          <button className="btn-primary tutorial-next" type="button" onClick={() => setCurrentStep((stepIndex) => stepIndex + 1)}>
            Siguiente
          </button>
        )}
      </div>

      <p className="tutorial-shortcut">Puedes volver a ver esta guía cuando quieras desde el inicio.</p>
      <AccessibilityControls compact {...preferences} onChange={setPreferences} />
    </main>
  );
}
