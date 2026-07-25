# Ejecución de fases

## Estado al 25 de julio de 2026

| Fase | Estado | Entregable |
| --- | --- | --- |
| 0. Base | Completada | Git, CI, contratos, variables públicas y build web |
| 1. Núcleo | Completada | Motor puro, semillas, Phaser, dificultad, métricas, pausas y poderes |
| 2. UX web | Completada | Tutorial, progreso, reto diario, catálogo, audio y accesibilidad |
| 3. Contenido/servicio | Completada como integración local | Catálogo versionado, validación, migración Supabase, RLS y función idempotente |
| 4. Beta web | En preparación | Revisión con jugadores, analítica anónima, dominio y Cloudflare Pages |
| 5. Escritorio | Pendiente por puerta de beta | Tauri y Windows |
| 6. Móvil | Pendiente por puerta de beta | Capacitor y Android |
| 7. Live ops | Preparado | Temporadas, skins y proceso editorial; sin ventas activas |

## Validación ejecutada

- Motor: pruebas deterministas de semilla, aciertos, daño, traducción,
  pausa y final de tiempo.
- Integración: `npm run lint`, `npm run test`, validación de contenido y
  `npm run build`.
- Navegador: inicio, tutorial, selección de modo/dificultad, carga de Phaser y
  HUD de partida verificados en escritorio.

## Cierre de beta web

La fase 4 se cerrará cuando el catálogo comercial haya sido revisado al tamaño
objetivo, Supabase/Turnstile estén configurados, no haya claves privadas en
cliente y las pruebas manuales cubran Chrome Windows y Android reciente.
