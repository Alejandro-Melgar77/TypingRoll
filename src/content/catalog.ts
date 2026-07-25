import type {
  ContentCatalog,
  ContentLanguage,
  ContentPack,
  Cosmetic,
  DailyChallenge,
  GameContentMode,
  Season,
  TranslationEntry,
  WordEntry,
} from './types';

type WordSeed = Omit<WordEntry, 'normalized'>;

interface CatalogSeed {
  packs: ContentPack[];
  words: WordSeed[];
  translations: TranslationEntry[];
  cosmetics: Cosmetic[];
  seasons: Season[];
}

/**
 * This JSON is deliberately plain data so scripts/validate-content.mjs can
 * validate the exact catalogue without a TypeScript runtime or a backend.
 */
const CONTENT_VALIDATION_PAYLOAD = String.raw`{
  "packs": [
    {"id":"core-es-v1","version":1,"name":"Español esencial","description":"Vocabulario seguro y cotidiano para partidas clásicas.","language":"es","categories":["animals","body","clothing","colors","food","home","nature","people","school","technology","travel"],"status":"published","releasedAt":"2026-07-25T00:00:00.000Z"},
    {"id":"core-en-v1","version":1,"name":"English essentials","description":"Equivalentes revisados para los modos de traducción.","language":"en","categories":["animals","body","clothing","colors","food","home","nature","people","school","technology","travel"],"status":"published","releasedAt":"2026-07-25T00:00:00.000Z"}
  ],
  "words": [
    {"id":"es-sol","text":"SOL","language":"es","difficulty":1,"category":"nature","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-luna","text":"LUNA","language":"es","difficulty":1,"category":"nature","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-mar","text":"MAR","language":"es","difficulty":1,"category":"nature","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-rio","text":"RIO","language":"es","difficulty":1,"category":"nature","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-nube","text":"NUBE","language":"es","difficulty":1,"category":"nature","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-lluvia","text":"LLUVIA","language":"es","difficulty":2,"category":"nature","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-arbol","text":"ARBOL","language":"es","difficulty":2,"category":"nature","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-flor","text":"FLOR","language":"es","difficulty":1,"category":"nature","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-bosque","text":"BOSQUE","language":"es","difficulty":2,"category":"nature","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-montana","text":"MONTAÑA","language":"es","difficulty":3,"category":"nature","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-gato","text":"GATO","language":"es","difficulty":1,"category":"animals","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-perro","text":"PERRO","language":"es","difficulty":1,"category":"animals","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-pez","text":"PEZ","language":"es","difficulty":1,"category":"animals","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-pajaro","text":"PAJARO","language":"es","difficulty":2,"category":"animals","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-rana","text":"RANA","language":"es","difficulty":1,"category":"animals","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-oso","text":"OSO","language":"es","difficulty":1,"category":"animals","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-conejo","text":"CONEJO","language":"es","difficulty":2,"category":"animals","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-abeja","text":"ABEJA","language":"es","difficulty":2,"category":"animals","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-manzana","text":"MANZANA","language":"es","difficulty":2,"category":"food","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-pan","text":"PAN","language":"es","difficulty":1,"category":"food","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-agua","text":"AGUA","language":"es","difficulty":1,"category":"food","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-leche","text":"LECHE","language":"es","difficulty":2,"category":"food","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-queso","text":"QUESO","language":"es","difficulty":2,"category":"food","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-arroz","text":"ARROZ","language":"es","difficulty":2,"category":"food","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-mesa","text":"MESA","language":"es","difficulty":1,"category":"home","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-silla","text":"SILLA","language":"es","difficulty":2,"category":"home","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-puerta","text":"PUERTA","language":"es","difficulty":2,"category":"home","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-ventana","text":"VENTANA","language":"es","difficulty":2,"category":"home","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-cama","text":"CAMA","language":"es","difficulty":1,"category":"home","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-libro","text":"LIBRO","language":"es","difficulty":2,"category":"school","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-lapiz","text":"LAPIZ","language":"es","difficulty":2,"category":"school","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-escuela","text":"ESCUELA","language":"es","difficulty":2,"category":"school","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-mochila","text":"MOCHILA","language":"es","difficulty":2,"category":"school","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-teclado","text":"TECLADO","language":"es","difficulty":3,"category":"technology","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-pantalla","text":"PANTALLA","language":"es","difficulty":3,"category":"technology","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-camino","text":"CAMINO","language":"es","difficulty":2,"category":"travel","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-puente","text":"PUENTE","language":"es","difficulty":2,"category":"travel","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-tren","text":"TREN","language":"es","difficulty":1,"category":"travel","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-avion","text":"AVION","language":"es","difficulty":2,"category":"travel","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-bicicleta","text":"BICICLETA","language":"es","difficulty":3,"category":"travel","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-camisa","text":"CAMISA","language":"es","difficulty":2,"category":"clothing","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-zapato","text":"ZAPATO","language":"es","difficulty":2,"category":"clothing","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-sombrero","text":"SOMBRERO","language":"es","difficulty":3,"category":"clothing","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-rojo","text":"ROJO","language":"es","difficulty":1,"category":"colors","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-azul","text":"AZUL","language":"es","difficulty":1,"category":"colors","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-verde","text":"VERDE","language":"es","difficulty":2,"category":"colors","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-amarillo","text":"AMARILLO","language":"es","difficulty":3,"category":"colors","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-familia","text":"FAMILIA","language":"es","difficulty":2,"category":"people","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-amigo","text":"AMIGO","language":"es","difficulty":2,"category":"people","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-musica","text":"MUSICA","language":"es","difficulty":2,"category":"technology","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-juego","text":"JUEGO","language":"es","difficulty":2,"category":"technology","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-aventura","text":"AVENTURA","language":"es","difficulty":3,"category":"travel","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-historia","text":"HISTORIA","language":"es","difficulty":3,"category":"school","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-planeta","text":"PLANETA","language":"es","difficulty":3,"category":"nature","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-velocidad","text":"VELOCIDAD","language":"es","difficulty":4,"category":"travel","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-creatividad","text":"CREATIVIDAD","language":"es","difficulty":4,"category":"school","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-concentracion","text":"CONCENTRACION","language":"es","difficulty":4,"category":"school","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-programacion","text":"PROGRAMACION","language":"es","difficulty":4,"category":"technology","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-navegacion","text":"NAVEGACION","language":"es","difficulty":4,"category":"travel","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"es-aprendizaje","text":"APRENDIZAJE","language":"es","difficulty":4,"category":"school","packId":"core-es-v1","status":"published","isSafe":true},
    {"id":"en-sun","text":"SUN","language":"en","difficulty":1,"category":"nature","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-moon","text":"MOON","language":"en","difficulty":1,"category":"nature","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-sea","text":"SEA","language":"en","difficulty":1,"category":"nature","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-river","text":"RIVER","language":"en","difficulty":1,"category":"nature","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-cloud","text":"CLOUD","language":"en","difficulty":1,"category":"nature","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-rain","text":"RAIN","language":"en","difficulty":2,"category":"nature","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-tree","text":"TREE","language":"en","difficulty":2,"category":"nature","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-flower","text":"FLOWER","language":"en","difficulty":1,"category":"nature","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-forest","text":"FOREST","language":"en","difficulty":2,"category":"nature","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-mountain","text":"MOUNTAIN","language":"en","difficulty":3,"category":"nature","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-cat","text":"CAT","language":"en","difficulty":1,"category":"animals","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-dog","text":"DOG","language":"en","difficulty":1,"category":"animals","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-fish","text":"FISH","language":"en","difficulty":1,"category":"animals","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-bird","text":"BIRD","language":"en","difficulty":2,"category":"animals","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-frog","text":"FROG","language":"en","difficulty":1,"category":"animals","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-bear","text":"BEAR","language":"en","difficulty":1,"category":"animals","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-rabbit","text":"RABBIT","language":"en","difficulty":2,"category":"animals","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-bee","text":"BEE","language":"en","difficulty":2,"category":"animals","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-apple","text":"APPLE","language":"en","difficulty":2,"category":"food","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-bread","text":"BREAD","language":"en","difficulty":1,"category":"food","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-water","text":"WATER","language":"en","difficulty":1,"category":"food","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-milk","text":"MILK","language":"en","difficulty":2,"category":"food","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-cheese","text":"CHEESE","language":"en","difficulty":2,"category":"food","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-rice","text":"RICE","language":"en","difficulty":2,"category":"food","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-table","text":"TABLE","language":"en","difficulty":1,"category":"home","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-chair","text":"CHAIR","language":"en","difficulty":2,"category":"home","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-door","text":"DOOR","language":"en","difficulty":2,"category":"home","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-window","text":"WINDOW","language":"en","difficulty":2,"category":"home","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-bed","text":"BED","language":"en","difficulty":1,"category":"home","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-book","text":"BOOK","language":"en","difficulty":2,"category":"school","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-pencil","text":"PENCIL","language":"en","difficulty":2,"category":"school","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-school","text":"SCHOOL","language":"en","difficulty":2,"category":"school","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-backpack","text":"BACKPACK","language":"en","difficulty":2,"category":"school","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-keyboard","text":"KEYBOARD","language":"en","difficulty":3,"category":"technology","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-screen","text":"SCREEN","language":"en","difficulty":3,"category":"technology","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-road","text":"ROAD","language":"en","difficulty":2,"category":"travel","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-bridge","text":"BRIDGE","language":"en","difficulty":2,"category":"travel","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-train","text":"TRAIN","language":"en","difficulty":1,"category":"travel","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-airplane","text":"AIRPLANE","language":"en","difficulty":2,"category":"travel","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-bicycle","text":"BICYCLE","language":"en","difficulty":3,"category":"travel","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-shirt","text":"SHIRT","language":"en","difficulty":2,"category":"clothing","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-shoe","text":"SHOE","language":"en","difficulty":2,"category":"clothing","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-hat","text":"HAT","language":"en","difficulty":3,"category":"clothing","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-red","text":"RED","language":"en","difficulty":1,"category":"colors","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-blue","text":"BLUE","language":"en","difficulty":1,"category":"colors","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-green","text":"GREEN","language":"en","difficulty":2,"category":"colors","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-yellow","text":"YELLOW","language":"en","difficulty":3,"category":"colors","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-family","text":"FAMILY","language":"en","difficulty":2,"category":"people","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-friend","text":"FRIEND","language":"en","difficulty":2,"category":"people","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-music","text":"MUSIC","language":"en","difficulty":2,"category":"technology","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-game","text":"GAME","language":"en","difficulty":2,"category":"technology","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-adventure","text":"ADVENTURE","language":"en","difficulty":3,"category":"travel","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-history","text":"HISTORY","language":"en","difficulty":3,"category":"school","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-planet","text":"PLANET","language":"en","difficulty":3,"category":"nature","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-speed","text":"SPEED","language":"en","difficulty":4,"category":"travel","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-creativity","text":"CREATIVITY","language":"en","difficulty":4,"category":"school","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-focus","text":"FOCUS","language":"en","difficulty":4,"category":"school","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-programming","text":"PROGRAMMING","language":"en","difficulty":4,"category":"technology","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-navigation","text":"NAVIGATION","language":"en","difficulty":4,"category":"travel","packId":"core-en-v1","status":"published","isSafe":true},
    {"id":"en-learning","text":"LEARNING","language":"en","difficulty":4,"category":"school","packId":"core-en-v1","status":"published","isSafe":true}
  ],
  "translations": [
    {"id":"tr-sol-sun","sourceWordId":"es-sol","targetWordId":"en-sun","status":"published"},{"id":"tr-luna-moon","sourceWordId":"es-luna","targetWordId":"en-moon","status":"published"},{"id":"tr-mar-sea","sourceWordId":"es-mar","targetWordId":"en-sea","status":"published"},{"id":"tr-rio-river","sourceWordId":"es-rio","targetWordId":"en-river","status":"published"},{"id":"tr-nube-cloud","sourceWordId":"es-nube","targetWordId":"en-cloud","status":"published"},{"id":"tr-lluvia-rain","sourceWordId":"es-lluvia","targetWordId":"en-rain","status":"published"},{"id":"tr-arbol-tree","sourceWordId":"es-arbol","targetWordId":"en-tree","status":"published"},{"id":"tr-flor-flower","sourceWordId":"es-flor","targetWordId":"en-flower","status":"published"},{"id":"tr-bosque-forest","sourceWordId":"es-bosque","targetWordId":"en-forest","status":"published"},{"id":"tr-montana-mountain","sourceWordId":"es-montana","targetWordId":"en-mountain","status":"published"},
    {"id":"tr-gato-cat","sourceWordId":"es-gato","targetWordId":"en-cat","status":"published"},{"id":"tr-perro-dog","sourceWordId":"es-perro","targetWordId":"en-dog","status":"published"},{"id":"tr-pez-fish","sourceWordId":"es-pez","targetWordId":"en-fish","status":"published"},{"id":"tr-pajaro-bird","sourceWordId":"es-pajaro","targetWordId":"en-bird","status":"published"},{"id":"tr-rana-frog","sourceWordId":"es-rana","targetWordId":"en-frog","status":"published"},{"id":"tr-oso-bear","sourceWordId":"es-oso","targetWordId":"en-bear","status":"published"},{"id":"tr-conejo-rabbit","sourceWordId":"es-conejo","targetWordId":"en-rabbit","status":"published"},{"id":"tr-abeja-bee","sourceWordId":"es-abeja","targetWordId":"en-bee","status":"published"},
    {"id":"tr-manzana-apple","sourceWordId":"es-manzana","targetWordId":"en-apple","status":"published"},{"id":"tr-pan-bread","sourceWordId":"es-pan","targetWordId":"en-bread","status":"published"},{"id":"tr-agua-water","sourceWordId":"es-agua","targetWordId":"en-water","status":"published"},{"id":"tr-leche-milk","sourceWordId":"es-leche","targetWordId":"en-milk","status":"published"},{"id":"tr-queso-cheese","sourceWordId":"es-queso","targetWordId":"en-cheese","status":"published"},{"id":"tr-arroz-rice","sourceWordId":"es-arroz","targetWordId":"en-rice","status":"published"},
    {"id":"tr-mesa-table","sourceWordId":"es-mesa","targetWordId":"en-table","status":"published"},{"id":"tr-silla-chair","sourceWordId":"es-silla","targetWordId":"en-chair","status":"published"},{"id":"tr-puerta-door","sourceWordId":"es-puerta","targetWordId":"en-door","status":"published"},{"id":"tr-ventana-window","sourceWordId":"es-ventana","targetWordId":"en-window","status":"published"},{"id":"tr-cama-bed","sourceWordId":"es-cama","targetWordId":"en-bed","status":"published"},
    {"id":"tr-libro-book","sourceWordId":"es-libro","targetWordId":"en-book","status":"published"},{"id":"tr-lapiz-pencil","sourceWordId":"es-lapiz","targetWordId":"en-pencil","status":"published"},{"id":"tr-escuela-school","sourceWordId":"es-escuela","targetWordId":"en-school","status":"published"},{"id":"tr-mochila-backpack","sourceWordId":"es-mochila","targetWordId":"en-backpack","status":"published"},{"id":"tr-teclado-keyboard","sourceWordId":"es-teclado","targetWordId":"en-keyboard","status":"published"},{"id":"tr-pantalla-screen","sourceWordId":"es-pantalla","targetWordId":"en-screen","status":"published"},
    {"id":"tr-camino-road","sourceWordId":"es-camino","targetWordId":"en-road","status":"published"},{"id":"tr-puente-bridge","sourceWordId":"es-puente","targetWordId":"en-bridge","status":"published"},{"id":"tr-tren-train","sourceWordId":"es-tren","targetWordId":"en-train","status":"published"},{"id":"tr-avion-airplane","sourceWordId":"es-avion","targetWordId":"en-airplane","status":"published"},{"id":"tr-bicicleta-bicycle","sourceWordId":"es-bicicleta","targetWordId":"en-bicycle","status":"published"},
    {"id":"tr-camisa-shirt","sourceWordId":"es-camisa","targetWordId":"en-shirt","status":"published"},{"id":"tr-zapato-shoe","sourceWordId":"es-zapato","targetWordId":"en-shoe","status":"published"},{"id":"tr-sombrero-hat","sourceWordId":"es-sombrero","targetWordId":"en-hat","status":"published"},{"id":"tr-rojo-red","sourceWordId":"es-rojo","targetWordId":"en-red","status":"published"},{"id":"tr-azul-blue","sourceWordId":"es-azul","targetWordId":"en-blue","status":"published"},{"id":"tr-verde-green","sourceWordId":"es-verde","targetWordId":"en-green","status":"published"},{"id":"tr-amarillo-yellow","sourceWordId":"es-amarillo","targetWordId":"en-yellow","status":"published"},
    {"id":"tr-familia-family","sourceWordId":"es-familia","targetWordId":"en-family","status":"published"},{"id":"tr-amigo-friend","sourceWordId":"es-amigo","targetWordId":"en-friend","status":"published"},{"id":"tr-musica-music","sourceWordId":"es-musica","targetWordId":"en-music","status":"published"},{"id":"tr-juego-game","sourceWordId":"es-juego","targetWordId":"en-game","status":"published"},{"id":"tr-aventura-adventure","sourceWordId":"es-aventura","targetWordId":"en-adventure","status":"published"},{"id":"tr-historia-history","sourceWordId":"es-historia","targetWordId":"en-history","status":"published"},{"id":"tr-planeta-planet","sourceWordId":"es-planeta","targetWordId":"en-planet","status":"published"},{"id":"tr-velocidad-speed","sourceWordId":"es-velocidad","targetWordId":"en-speed","status":"published"},{"id":"tr-creatividad-creativity","sourceWordId":"es-creatividad","targetWordId":"en-creativity","status":"published"},{"id":"tr-concentracion-focus","sourceWordId":"es-concentracion","targetWordId":"en-focus","status":"published"},{"id":"tr-programacion-programming","sourceWordId":"es-programacion","targetWordId":"en-programming","status":"published"},{"id":"tr-navegacion-navigation","sourceWordId":"es-navegacion","targetWordId":"en-navigation","status":"published"},{"id":"tr-aprendizaje-learning","sourceWordId":"es-aprendizaje","targetWordId":"en-learning","status":"published"}
  ],
  "cosmetics": [
    {"id":"cloud-cotton","name":"Nubes de algodón","description":"Paleta clara para las nubes.","kind":"cloud_palette","rarity":"common","priceCoins":0,"isFree":true,"status":"published","preview":{"primary":"#F8FBFF","secondary":"#B9D8FF"}},
    {"id":"river-celeste","name":"Río celeste","description":"Agua azul brillante.","kind":"river_palette","rarity":"common","priceCoins":0,"isFree":true,"status":"published","preview":{"primary":"#52B9F3","secondary":"#B9F4FF"}},
    {"id":"trail-comet","name":"Estela cometa","description":"Destello al completar una palabra.","kind":"success_trail","rarity":"common","priceCoins":0,"isFree":true,"status":"published","preview":{"primary":"#FFF1A8","secondary":"#FFBE5C"}},
    {"id":"particles-breeze","name":"Brisa","description":"Partículas suaves de acierto.","kind":"particles","rarity":"common","priceCoins":0,"isFree":true,"status":"published","preview":{"primary":"#FFFFFF","secondary":"#BDE9FF"}},
    {"id":"frame-starter","name":"Marco inicial","description":"Marco limpio para el perfil invitado.","kind":"profile_frame","rarity":"common","priceCoins":0,"isFree":true,"status":"published","preview":{"primary":"#70D6FF","secondary":"#7568FF"}},
    {"id":"keyboard-sky","name":"Teclado cielo","description":"Tema legible de teclado.","kind":"keyboard_theme","rarity":"common","priceCoins":0,"isFree":true,"status":"published","preview":{"primary":"#314C8A","secondary":"#A9D6FF"}},
    {"id":"cloud-neon","name":"Nubes neón","description":"Recompensa de la temporada Noche Neón.","kind":"cloud_palette","rarity":"rare","priceCoins":450,"isFree":false,"status":"draft","preview":{"primary":"#E7D8FF","secondary":"#9B6CFF"}},
    {"id":"river-aurora","name":"Río aurora","description":"Recompensa de Bosque Aurora.","kind":"river_palette","rarity":"rare","priceCoins":450,"isFree":false,"status":"draft","preview":{"primary":"#35E1B5","secondary":"#7D7CFF"}},
    {"id":"particles-ocean","name":"Burbuja oceánica","description":"Recompensa de Océano Celeste.","kind":"particles","rarity":"rare","priceCoins":450,"isFree":false,"status":"draft","preview":{"primary":"#BDEBFF","secondary":"#3E9EFF"}}
  ],
  "seasons": [
    {"id":"season-neon-2026","name":"Noche Neón","theme":"Una ciudad luminosa de práctica nocturna.","startsAt":"2026-07-25T00:00:00.000Z","endsAt":"2026-09-18T23:59:59.000Z","featuredPackIds":["core-es-v1","core-en-v1"],"rewardCosmeticIds":["cloud-neon"],"status":"published"},
    {"id":"season-aurora-2026","name":"Bosque Aurora","theme":"Un bosque sereno iluminado por auroras.","startsAt":"2026-09-19T00:00:00.000Z","endsAt":"2026-11-13T23:59:59.000Z","featuredPackIds":["core-es-v1"],"rewardCosmeticIds":["river-aurora"],"status":"draft"},
    {"id":"season-ocean-2026","name":"Océano Celeste","theme":"Una travesía de nubes sobre el mar.","startsAt":"2026-11-14T00:00:00.000Z","endsAt":"2027-01-08T23:59:59.000Z","featuredPackIds":["core-es-v1"],"rewardCosmeticIds":["particles-ocean"],"status":"draft"}
  ]
}`;

const catalogSeed = JSON.parse(CONTENT_VALIDATION_PAYLOAD) as CatalogSeed;

export function normalizeContentText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '');
}

const createWords = (words: readonly WordSeed[]): readonly WordEntry[] => words.map((word) => ({
  ...word,
  normalized: normalizeContentText(word.text),
}));

export const CONTENT_CATALOG: ContentCatalog = Object.freeze({
  packs: Object.freeze(catalogSeed.packs),
  words: Object.freeze(createWords(catalogSeed.words)),
  translations: Object.freeze(catalogSeed.translations),
  cosmetics: Object.freeze(catalogSeed.cosmetics),
  seasons: Object.freeze(catalogSeed.seasons),
});

export function getWordsForMode(
  mode: GameContentMode,
  catalog: ContentCatalog = CONTENT_CATALOG,
): readonly WordEntry[] {
  const language: ContentLanguage = mode === 'en_es' ? 'en' : 'es';
  return catalog.words.filter((word) => word.language === language && word.status === 'published' && word.isSafe);
}

export function getTranslationTarget(
  sourceWordId: string,
  catalog: ContentCatalog = CONTENT_CATALOG,
): WordEntry | undefined {
  const translation = catalog.translations.find((entry) => (
    entry.sourceWordId === sourceWordId && entry.status === 'published'
  ));
  return translation ? catalog.words.find((word) => word.id === translation.targetWordId) : undefined;
}

function dateToIsoDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function stableHash(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function createDailyChallenge(
  date = new Date(),
  mode: GameContentMode = 'classic',
): DailyChallenge {
  const isoDay = dateToIsoDay(date);
  const seed = stableHash(`${isoDay}:${mode}`);
  const packId = mode === 'en_es' ? 'core-en-v1' : 'core-es-v1';
  const targetScore = 600 + (seed % 5) * 125;
  const rewardCoins = 25 + (seed % 3) * 5;
  const modeLabel = mode === 'classic' ? 'Clásico' : mode === 'es_en' ? 'ES → EN' : 'EN → ES';

  return {
    id: `daily:${isoDay}:${mode}`,
    date: isoDay,
    mode,
    seed,
    packId,
    targetScore,
    rewardCoins,
    title: `Reto diario ${modeLabel}`,
  };
}

/** Internal fixture consumed by the Node validator; not imported by the app. */
export const CONTENT_VALIDATION_MARKER = 'catalog-v1';
