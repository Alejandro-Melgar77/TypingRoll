import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { AccessibilityControls, type AccessibilityPreferences } from '../components/ui/AccessibilityControls';
import type { CosmeticPreview, CosmeticSlot } from '../components/ui/experienceTypes';
import './CatalogScreen.css';

export interface CatalogScreenProps {
  coins: number;
  cosmetics?: readonly CosmeticPreview[];
  equippedId?: string;
  onBack: () => void;
  onPreviewCosmetic?: (cosmetic: CosmeticPreview) => void;
  accessibilityPreferences?: AccessibilityPreferences;
  onAccessibilityPreferencesChange?: (preferences: AccessibilityPreferences) => void;
}

const DEFAULT_COSMETICS: readonly CosmeticPreview[] = [
  { id: 'sky-mint', name: 'Cielo menta', description: 'Nubes sobre una mañana tranquila.', slot: 'cloud', palette: ['#d7fbfd', '#87d8db', '#357d88'], unlockLabel: 'Incluido', owned: true },
  { id: 'river-lilac', name: 'Río lila', description: 'Ondas suaves con brillo violeta.', slot: 'river', palette: ['#e6deff', '#ad9dd4', '#655584'], unlockLabel: 'Incluido', owned: true },
  { id: 'trail-spark', name: 'Estela de estrellas', description: 'Pequeñas estrellas al completar una palabra.', slot: 'trail', palette: ['#fff6c7', '#f7cf66', '#c78a2f'], unlockLabel: 'Reto diario', isNew: true },
  { id: 'petal-pop', name: 'Pétalos pop', description: 'Una lluvia de pétalos para las rachas largas.', slot: 'particles', palette: ['#ffe3ef', '#f29bbe', '#ac5e7b'], unlockLabel: 'Nivel 4' },
  { id: 'frame-dew', name: 'Marco rocío', description: 'Un marco brillante para tu perfil invitado.', slot: 'profile-frame', palette: ['#dbfbf3', '#8ddbc5', '#408978'], unlockLabel: 'Nivel 6' },
  { id: 'keys-coast', name: 'Teclas costa', description: 'Teclado azul con luces de espuma.', slot: 'keyboard', palette: ['#d8f4ff', '#7dbed4', '#35667c'], unlockLabel: 'Próxima temporada' },
];

const SLOT_LABELS: Record<CosmeticSlot, string> = {
  cloud: 'Nubes',
  river: 'Río',
  trail: 'Estelas',
  particles: 'Partículas',
  'profile-frame': 'Perfil',
  keyboard: 'Teclado',
};

export function CatalogScreen({ coins, cosmetics = DEFAULT_COSMETICS, equippedId, onBack, onPreviewCosmetic, accessibilityPreferences, onAccessibilityPreferencesChange }: CatalogScreenProps) {
  const [activeSlot, setActiveSlot] = useState<CosmeticSlot | 'all'>('all');
  const [selectedId, setSelectedId] = useState(equippedId ?? cosmetics[0]?.id ?? '');
  const [localPreferences, setLocalPreferences] = useState<AccessibilityPreferences>({ reducedMotion: false, highContrast: false });
  const preferences = accessibilityPreferences ?? localPreferences;
  const setPreferences = onAccessibilityPreferencesChange ?? setLocalPreferences;
  const selected = cosmetics.find((cosmetic) => cosmetic.id === selectedId) ?? cosmetics[0];
  const visibleCosmetics = useMemo(() => activeSlot === 'all' ? cosmetics : cosmetics.filter((cosmetic) => cosmetic.slot === activeSlot), [activeSlot, cosmetics]);

  const selectCosmetic = (cosmetic: CosmeticPreview) => {
    setSelectedId(cosmetic.id);
    onPreviewCosmetic?.(cosmetic);
  };

  return (
    <main className="catalog-container">
      <header className="catalog-header">
        <button className="btn-back" type="button" onClick={onBack}>← Inicio</button>
        <div><p className="screen-kicker">Personaliza tu vuelo</p><h1>Catálogo</h1></div>
        <span className="catalog-coins" aria-label={`${coins} nubes moneda`}>☁ {coins}</span>
      </header>

      <aside className="catalog-note" aria-label="Información del catálogo"><span aria-hidden="true">✦</span><p>Vista previa gratuita: no hay pagos, anuncios ni ventajas de juego en esta versión.</p></aside>

      {selected && (
        <section className="skin-preview" style={{ '--skin-light': selected.palette[0], '--skin-main': selected.palette[1], '--skin-dark': selected.palette[2] } as CSSProperties} aria-label={`Vista previa de ${selected.name}`}>
          <div className="preview-sky" aria-hidden="true"><span className="preview-star star-one">✦</span><span className="preview-star star-two">✧</span><span className="preview-cloud"><i /><i /></span><span className="preview-word">ritmo</span><span className="preview-river" /><span className="preview-trail">✦ ✦ ✦</span></div>
          <div className="preview-description"><p className="screen-kicker">{SLOT_LABELS[selected.slot]}</p><h2>{selected.name}</h2><p>{selected.description}</p><span className="preview-unlock">{selected.unlockLabel}</span></div>
        </section>
      )}

      <nav className="catalog-filters" aria-label="Filtrar cosméticos">
        <button type="button" className={activeSlot === 'all' ? 'is-active' : ''} aria-pressed={activeSlot === 'all'} onClick={() => setActiveSlot('all')}>Todo</button>
        {(Object.keys(SLOT_LABELS) as CosmeticSlot[]).map((slot) => <button key={slot} type="button" className={activeSlot === slot ? 'is-active' : ''} aria-pressed={activeSlot === slot} onClick={() => setActiveSlot(slot)}>{SLOT_LABELS[slot]}</button>)}
      </nav>

      <section className="catalog-grid" aria-label="Cosméticos disponibles">
        {visibleCosmetics.map((cosmetic) => {
          const isSelected = cosmetic.id === selected?.id;
          return (
            <button key={cosmetic.id} className={`catalog-card ${isSelected ? 'is-selected' : ''}`} type="button" aria-pressed={isSelected} onClick={() => selectCosmetic(cosmetic)}>
              <span className="catalog-card-preview" style={{ '--skin-light': cosmetic.palette[0], '--skin-main': cosmetic.palette[1], '--skin-dark': cosmetic.palette[2] } as CSSProperties} aria-hidden="true"><i /><b /></span>
              <span className="catalog-card-copy"><small>{SLOT_LABELS[cosmetic.slot]}</small><strong>{cosmetic.name}</strong><em>{cosmetic.unlockLabel}</em></span>
              {cosmetic.isNew && <span className="catalog-new">Nuevo</span>}
            </button>
          );
        })}
      </section>
      <p className="catalog-footnote">Las temporadas y packs temáticos se anunciarán aquí antes de llegar al juego.</p>
      <AccessibilityControls compact {...preferences} onChange={setPreferences} />
    </main>
  );
}
