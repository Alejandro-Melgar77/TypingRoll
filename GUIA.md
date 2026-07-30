# Guía de TypingRoll

## Cómo jugar

- En Clásico escribe la palabra de la nube más baja que empiece por tu primera
  letra. Un error, una traducción incorrecta o una nube que toca el río resta
  una vida.
- En Idiomas escribe la traducción y confirma con `Enter`; `Backspace` borra.
- En **Matemáticas → Aritmética**, escribe el resultado y confirma con `Enter`.
  Cada sesión comienza en fase 1, gana una fase por seis respuestas correctas
  y nunca presenta negativos, decimales o divisiones no exactas. En Fracciones
  responde con `a/b` ya reducida.
- En **Párrafo** copia el texto de referencia. Turquesa es correcto y rojo es
  corregible; `Enter` solo avanza al coincidir exactamente. Es infinito, no
  entrega monedas ni modifica el récord global.
- Antes de escribir, elige Clásico o una colección: Poesía, Literatura
  motivacional, Romanticismo, Autosuperación, Autoayuda bíblica o Diálogos
  constructivos. Clásico mezcla las seis; cada una tiene música instrumental
  procedural propia. Las reflexiones bíblicas muestran el pasaje relacionado,
  pero no reemplazan la lectura de la Biblia.
- Cinco aciertos seguidos pueden recuperar una vida. Ocho aciertos otorgan una
  carga para **Calma** (ralentiza nubes) o **Escudo** (bloquea el próximo daño).
- Las partidas duran tres minutos en escritorio y 90 segundos en móvil. La
  precisión y las palabras por minuto ajustan la fase cada ocho intentos.

## Pantallas web

La página de inicio permite jugar de inmediato como invitado, abrir la guía,
ver progreso, retos diarios y un catálogo de skins solo de vista previa. No se
solicita correo, no hay pagos ni anuncios. Si se borran los datos del navegador
se pierde el progreso del invitado.

**Keyboard test** es una herramienta gratuita y exclusiva de la web. Permite
elegir ocho fondos, ocho paletas, seis mascotas originales o ninguna,
distribución English ANSI / Español ISO con Ñ y tamaños 60%, 75% y 100%. Las
teclas presionadas se mantienen iluminadas hasta usar **Limpiar teclas usadas**.

## Accesibilidad y audio

Los ajustes ofrecen contraste alto y reducción de movimiento persistentes. La
música procedural evoluciona con la fase, y los SFX distinguen acierto, daño y
poder. Párrafo y Keyboard test incluyen controles propios de silencio y
volumen; al abrirlos la música del menú se suspende para no superponer pistas.

## Contenido

El catálogo local usa packs versionados y solo muestra palabras marcadas como
seguras y publicadas. El mismo validador comprueba los 120 párrafos locales.
Ejecuta `node scripts/validate-content.mjs` antes de publicar un pack. La IA
puede proponer material editorial fuera de la partida, pero nunca genera una
palabra en tiempo real ni publica contenido por sí sola.

Poesías, frases y diálogos de la colección son textos originales. Antes de
incluir citas literales de obras contemporáneas, películas, series, anime o
traducciones bíblicas se requiere una licencia o una revisión editorial de su
estado de dominio público.

## Próximas plataformas

[platforms/desktop](platforms/desktop/README.md) describe la aplicación Windows
con Tauri y [platforms/mobile](platforms/mobile/README.md) la versión Android
con Capacitor. Ambas dependen de validar primero la web.
