# TypingRoll

Juego web de mecanografía con nubes, río, ritmo y dificultad adaptable. La web
es pública, se juega como invitado y no contiene pagos ni anuncios.

## Desarrollo

```powershell
npm install
npm run dev
```

```powershell
npm run lint
npm run test
node scripts/validate-content.mjs
npm run build
```

`npm run content:release` activa los mínimos editoriales de la publicación
comercial: 1.000 palabras españolas y 500 pares de traducción.

La portada carga rápido; Phaser se descarga al comenzar una partida. El motor
reutilizable está en `src/game/domain`, el adaptador visual en
`src/game/phaser` y la interfaz React en `src/screens`.

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
