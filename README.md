# TypingRoll

Juego web de mecanografía con nubes, río, ritmo y dificultad adaptable. La web
es pública, se juega como invitado y no contiene pagos ni anuncios. Incluye
Clásico, Idiomas, Matemáticas, Párrafo infinito y el **Keyboard test** kawaii
gratuito exclusivo de la versión web.

## Desarrollo

```powershell
npm install
npm run dev
```

```powershell
npm run lint
npm run test
npm run test:e2e
node scripts/validate-content.mjs
npm run build
```

`npm run content:release` activa los mínimos editoriales de la publicación
comercial: 1.000 palabras españolas y 500 pares de traducción.

La portada carga rápido; Phaser se descarga al comenzar una partida. El motor
reutilizable está en `src/game/domain`, el adaptador visual en
`src/game/phaser` y la interfaz React en `src/screens`. El catálogo de 120
párrafos y los seis personajes del Keyboard test son locales y no requieren
Supabase ni servicios de generación en tiempo real.

## Modos nuevos

- **Matemáticas → Aritmética:** Clásico mezcla operaciones al desbloquearlas;
  Suma, Resta, Multiplicación, División y Fracciones entrenan una sola. Todas
  comienzan en fase 1 y suben cada seis respuestas exactas.
- **Párrafo infinito:** Clásico mezcla Poesía, Literatura motivacional,
  Romanticismo, Autosuperación, Autoayuda bíblica y Diálogos constructivos.
  Cada colección tiene 20 textos originales, una pista procedural temática y
  se confirma con `Enter`; la puntuación y PPM viven solo durante esa sesión.
- **Keyboard test:** personaliza fondo, paleta, mascota, ANSI/ISO y tamaño
  60/75/100%; resalta las teclas físicas mediante `KeyboardEvent.code` y se
  limpia sin abandonar la herramienta.

La colección de Párrafo usa redacción original de TypingRoll. Las entradas de
Autoayuda bíblica son reflexiones con referencia de pasaje y no copias de una
traducción; los diálogos son originales y no reproducen cine, series o anime.

## Servicios y publicación

- Sin variables de entorno, `LocalContentClient` conserva el progreso del
  invitado en este navegador.
- Con Supabase configurado, la carpeta `supabase/` ofrece migración, políticas
  RLS y una función idempotente para recompensas de partida. Copia
  `.env.example` a `.env.local`; nunca expongas una service-role key.
- GitHub Actions valida tipos, contenido, pruebas y build. El despliegue a
  Cloudflare Pages se activa al configurar los secretos del repositorio.

Consulta [GUIA.md](GUIA.md), [PLANIFICACION.md](PLANIFICACION.md),
[EJECUCION_FASES.md](EJECUCION_FASES.md) y [supabase/README.md](supabase/README.md).
