# Guía de TypingRoll

## Cómo jugar

- En Clásico escribe la palabra de la nube más baja que empiece por tu primera
  letra. Un error, una traducción incorrecta o una nube que toca el río resta
  una vida.
- En Idiomas escribe la traducción y confirma con `Enter`; `Backspace` borra.
- Cinco aciertos seguidos pueden recuperar una vida. Ocho aciertos otorgan una
  carga para **Calma** (ralentiza nubes) o **Escudo** (bloquea el próximo daño).
- Las partidas duran tres minutos en escritorio y 90 segundos en móvil. La
  precisión y las palabras por minuto ajustan la fase cada ocho intentos.

## Pantallas web

La página de inicio permite jugar de inmediato como invitado, abrir la guía,
ver progreso, retos diarios y un catálogo de skins solo de vista previa. No se
solicita correo, no hay pagos ni anuncios. Si se borran los datos del navegador
se pierde el progreso del invitado.

## Accesibilidad y audio

Los ajustes ofrecen contraste alto y reducción de movimiento persistentes. La
música procedural evoluciona con la fase, y los SFX distinguen acierto, daño y
poder. El volumen se puede cambiar durante una pausa.

## Contenido

El catálogo local usa packs versionados y solo muestra palabras marcadas como
seguras y publicadas. Ejecuta `node scripts/validate-content.mjs` antes de
publicar un pack. La IA puede proponer material editorial fuera de la partida,
pero nunca genera una palabra en tiempo real ni publica contenido por sí sola.

## Próximas plataformas

[platforms/desktop](platforms/desktop/README.md) describe la aplicación Windows
con Tauri y [platforms/mobile](platforms/mobile/README.md) la versión Android
con Capacitor. Ambas dependen de validar primero la web.
