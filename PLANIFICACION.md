# Planificación de producto

## Visión

TypingRoll debe ser fácil de entender en segundos: escribe, protege el río y
mantén el ritmo. La primera entrega comercial valida esa sensación en web; el
mismo núcleo pasará después a escritorio y móvil.

## Arquitectura aplicada

| Área | Decisión |
| --- | --- |
| Juego | Phaser + TypeScript, motor puro y reproducible separado de React |
| Interfaz | React para inicio, tutorial, progreso, catálogo y HUD |
| Datos | Packs tipados, cliente local y esquema Supabase opcional con RLS |
| Identidad | Jugador invitado; Supabase anónimo solo al habilitar el servicio |
| Economía | Cosméticos no competitivos; sin cobros ni anuncios en web |
| Contenido | Curación editorial y validador automático; IA solo como borrador offline |

## Retención y juego

- Partidas cortas de supervivencia, fases adaptables, métricas PPM/precisión,
  poderes ganados por racha, logros y reto diario.
- Tutorial de tres pasos y dificultad suave al inicio; la presión escala de
  forma gradual, no por saturación inmediata de nubes.
- Temporadas de ocho semanas: Noche Neón, Bosque Aurora y Océano Celeste están
  preparadas como catálogo, no como compras activas.

## Entregas y puertas de salida

1. **Web pública:** validar tutorial, rendimiento, retención y contenido seguro.
2. **Windows/Tauri:** solo tras aprobación de la beta web; venta premium y DLC
   cosméticos sin ventajas de juego.
3. **Android/Capacitor:** sesiones verticales de 90 segundos, hápticos y, tras
   las validaciones de tienda, anuncios recompensados y compras opcionales.

## Pendientes de lanzamiento comercial

- Completar revisión humana hasta alcanzar 1.000 palabras españolas y 500 pares
  de traducción publicados. El repositorio incluye la muestra curada, validador
  y flujo de importación; no se publicará contenido generado sin revisión.
- Configurar proyecto Supabase, Turnstile, dominio y secretos de Cloudflare.
- Medir sesión inicial, finalización del tutorial y repetición de retos con
  usuarios reales antes de iniciar los empaquetados nativos.
