import { useEffect } from 'react';
import './AccessibilityControls.css';

export interface AccessibilityPreferences {
  reducedMotion: boolean;
  highContrast: boolean;
}

interface AccessibilityControlsProps extends AccessibilityPreferences {
  onChange: (preferences: AccessibilityPreferences) => void;
  compact?: boolean;
}

/** A small, reusable control that also exposes the preference to CSS. */
export function AccessibilityControls({
  reducedMotion,
  highContrast,
  onChange,
  compact = false,
}: AccessibilityControlsProps) {
  useEffect(() => {
    document.documentElement.dataset.reduceMotion = String(reducedMotion);
    document.documentElement.dataset.contrast = highContrast ? 'high' : 'normal';

    return () => {
      delete document.documentElement.dataset.reduceMotion;
      delete document.documentElement.dataset.contrast;
    };
  }, [highContrast, reducedMotion]);

  return (
    <section className={`accessibility-controls ${compact ? 'is-compact' : ''}`} aria-label="Accesibilidad">
      <span className="accessibility-title" aria-hidden="true">Accesibilidad</span>
      <button
        className="accessibility-toggle"
        type="button"
        aria-pressed={reducedMotion}
        onClick={() => onChange({ reducedMotion: !reducedMotion, highContrast })}
      >
        <span aria-hidden="true">◌</span>
        {reducedMotion ? 'Menos movimiento: sí' : 'Menos movimiento: no'}
      </button>
      <button
        className="accessibility-toggle"
        type="button"
        aria-pressed={highContrast}
        onClick={() => onChange({ reducedMotion, highContrast: !highContrast })}
      >
        <span aria-hidden="true">◐</span>
        {highContrast ? 'Contraste alto: sí' : 'Contraste alto: no'}
      </button>
    </section>
  );
}
