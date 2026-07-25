import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = fileURLToPath(new URL('.', import.meta.url));
const catalogPath = resolve(scriptDirectory, '../src/content/catalog.ts');
const releaseMode = process.argv.includes('--release');
const catalogSource = readFileSync(catalogPath, 'utf8');
const payloadMatch = catalogSource.match(/const CONTENT_VALIDATION_PAYLOAD = String\.raw`([\s\S]*?)`;/);

if (!payloadMatch) {
  console.error('No se encontró CONTENT_VALIDATION_PAYLOAD en src/content/catalog.ts.');
  process.exit(1);
}

let catalog;
try {
  catalog = JSON.parse(payloadMatch[1]);
} catch (error) {
  console.error('El catálogo contiene JSON inválido:', error instanceof Error ? error.message : error);
  process.exit(1);
}

const errors = [];
const allowedLanguages = new Set(['es', 'en']);
const allowedStatuses = new Set(['draft', 'published', 'archived']);
const allowedCategories = new Set([
  'animals', 'body', 'clothing', 'colors', 'food', 'home', 'nature', 'people', 'school', 'technology', 'travel',
]);
const allowedCosmeticKinds = new Set([
  'cloud_palette', 'river_palette', 'success_trail', 'particles', 'profile_frame', 'keyboard_theme',
]);
const blockedTerms = [
  'ANAL', 'ASESINO', 'COCAINA', 'DROGA', 'ESTUPRO', 'FASCISTA', 'GORE', 'MIERDA', 'NAZI',
  'PENE', 'PUTA', 'PUTO', 'RACISTA', 'SEXO', 'VIOLACION',
];

function fail(message) {
  errors.push(message);
}

function normalize(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z]/g, '');
}

function requireArray(value, name) {
  if (!Array.isArray(value)) {
    fail(`${name} debe ser un arreglo.`);
    return [];
  }
  return value;
}

function validateId(value, label) {
  if (typeof value !== 'string' || !/^[a-z0-9][a-z0-9:-]*$/.test(value)) {
    fail(`${label} debe ser un identificador estable en minúsculas.`);
  }
}

const packs = requireArray(catalog.packs, 'packs');
const words = requireArray(catalog.words, 'words');
const translations = requireArray(catalog.translations, 'translations');
const cosmetics = requireArray(catalog.cosmetics, 'cosmetics');
const seasons = requireArray(catalog.seasons, 'seasons');

const packIds = new Set();
for (const pack of packs) {
  validateId(pack.id, 'pack.id');
  if (packIds.has(pack.id)) fail(`Pack duplicado: ${pack.id}`);
  packIds.add(pack.id);
  if (!allowedLanguages.has(pack.language)) fail(`Idioma inválido en pack ${pack.id}.`);
  if (!allowedStatuses.has(pack.status)) fail(`Estado inválido en pack ${pack.id}.`);
  if (!Number.isInteger(pack.version) || pack.version < 1) fail(`Versión inválida en pack ${pack.id}.`);
  if (!Array.isArray(pack.categories) || pack.categories.length === 0) fail(`El pack ${pack.id} no declara categorías.`);
  for (const category of pack.categories ?? []) {
    if (!allowedCategories.has(category)) fail(`Categoría inválida en pack ${pack.id}: ${category}`);
  }
}

const wordsById = new Map();
const normalizedByLanguage = new Set();
const wordCountByPack = new Map();
for (const word of words) {
  validateId(word.id, 'word.id');
  if (wordsById.has(word.id)) fail(`Palabra con id duplicado: ${word.id}`);
  wordsById.set(word.id, word);
  if (typeof word.text !== 'string' || word.text.trim() !== word.text || !word.text) fail(`Texto inválido en ${word.id}.`);
  if ([...(word.text ?? '')].some((character) => (
    character.codePointAt(0) === 0xfffd || character.codePointAt(0) === 0x00c3
  ))) fail(`Codificación dañada en ${word.id}.`);
  const normalized = normalize(word.text ?? '');
  if (!normalized || normalized.length !== normalize((word.text ?? '').replace(/\s/g, '')).length) {
    fail(`Normalización inválida en ${word.id}.`);
  }
  if (normalized.length < 2 || normalized.length > 24) fail(`Longitud fuera de rango en ${word.id}.`);
  const duplicateKey = `${word.language}:${normalized}`;
  if (normalizedByLanguage.has(duplicateKey)) fail(`Duplicado normalizado: ${duplicateKey}`);
  normalizedByLanguage.add(duplicateKey);
  if (!allowedLanguages.has(word.language)) fail(`Idioma inválido en ${word.id}.`);
  if (!Number.isInteger(word.difficulty) || word.difficulty < 1 || word.difficulty > 5) {
    fail(`Dificultad fuera de rango en ${word.id}.`);
  }
  if (!allowedCategories.has(word.category)) fail(`Categoría inválida en ${word.id}.`);
  const pack = packs.find((candidate) => candidate.id === word.packId);
  if (!pack) fail(`Pack inexistente para ${word.id}: ${word.packId}`);
  if (pack && pack.language !== word.language) fail(`Idioma de pack no coincide en ${word.id}.`);
  if (pack && !pack.categories.includes(word.category)) fail(`La categoría de ${word.id} no está habilitada por ${pack.id}.`);
  if (!allowedStatuses.has(word.status)) fail(`Estado inválido en ${word.id}.`);
  if (word.isSafe !== true) fail(`La palabra ${word.id} no está marcada como segura.`);
  for (const blocked of blockedTerms) {
    if (normalized.includes(blocked)) fail(`Término bloqueado detectado en ${word.id}.`);
  }
  wordCountByPack.set(word.packId, (wordCountByPack.get(word.packId) ?? 0) + 1);
}

for (const pack of packs.filter((item) => item.status === 'published')) {
  if ((wordCountByPack.get(pack.id) ?? 0) < 20) fail(`El pack publicado ${pack.id} tiene menos de 20 palabras.`);
}

const translationPairs = new Set();
const translatedSources = new Set();
const translatedTargets = new Set();
for (const translation of translations) {
  validateId(translation.id, 'translation.id');
  const source = wordsById.get(translation.sourceWordId);
  const target = wordsById.get(translation.targetWordId);
  if (!source || !target) {
    fail(`Traducción incompleta: ${translation.id}`);
    continue;
  }
  if (source.language === target.language) fail(`La traducción ${translation.id} usa el mismo idioma dos veces.`);
  if (!allowedStatuses.has(translation.status)) fail(`Estado inválido en traducción ${translation.id}.`);
  const pair = `${source.id}:${target.id}`;
  if (translationPairs.has(pair)) fail(`Traducción duplicada: ${pair}`);
  translationPairs.add(pair);
  if (translation.status === 'published') {
    translatedSources.add(source.id);
    translatedTargets.add(target.id);
  }
}

for (const word of words.filter((item) => item.status === 'published')) {
  const isCovered = word.language === 'es' ? translatedSources.has(word.id) : translatedTargets.has(word.id);
  if (!isCovered) fail(`Palabra publicada sin traducción revisada: ${word.id}`);
}
if (translations.length < 20) fail('Se requieren al menos 20 pares de traducción en el catálogo de muestra.');

if (releaseMode) {
  const publishedSpanishWords = words.filter((word) => word.language === 'es' && word.status === 'published' && word.isSafe).length;
  const publishedTranslations = translations.filter((translation) => translation.status === 'published').length;
  if (publishedSpanishWords < 1000) fail(`El lanzamiento requiere 1.000 palabras españolas publicadas; hay ${publishedSpanishWords}.`);
  if (publishedTranslations < 500) fail(`El lanzamiento requiere 500 pares de traducción publicados; hay ${publishedTranslations}.`);
}

const cosmeticIds = new Set();
for (const cosmetic of cosmetics) {
  validateId(cosmetic.id, 'cosmetic.id');
  if (cosmeticIds.has(cosmetic.id)) fail(`Cosmético duplicado: ${cosmetic.id}`);
  cosmeticIds.add(cosmetic.id);
  if (!allowedCosmeticKinds.has(cosmetic.kind)) fail(`Tipo de cosmético inválido: ${cosmetic.id}`);
  if (!Number.isInteger(cosmetic.priceCoins) || cosmetic.priceCoins < 0) fail(`Precio inválido: ${cosmetic.id}`);
  if (cosmetic.isFree && cosmetic.priceCoins !== 0) fail(`Cosmético gratis con precio: ${cosmetic.id}`);
  if (!allowedStatuses.has(cosmetic.status)) fail(`Estado inválido en ${cosmetic.id}.`);
}

const seasonIds = new Set();
for (const season of seasons) {
  validateId(season.id, 'season.id');
  if (seasonIds.has(season.id)) fail(`Temporada duplicada: ${season.id}`);
  seasonIds.add(season.id);
  const startsAt = Date.parse(season.startsAt);
  const endsAt = Date.parse(season.endsAt);
  if (!Number.isFinite(startsAt) || !Number.isFinite(endsAt) || startsAt >= endsAt) fail(`Fechas inválidas en ${season.id}.`);
  for (const packId of season.featuredPackIds ?? []) if (!packIds.has(packId)) fail(`Pack de temporada inexistente: ${packId}`);
  for (const cosmeticId of season.rewardCosmeticIds ?? []) if (!cosmeticIds.has(cosmeticId)) fail(`Recompensa de temporada inexistente: ${cosmeticId}`);
}

if (errors.length > 0) {
  console.error(`Validación de contenido falló con ${errors.length} problema(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Contenido válido: ${packs.length} packs, ${words.length} palabras, ${translations.length} traducciones, ${cosmetics.length} cosméticos y ${seasons.length} temporadas.`);
