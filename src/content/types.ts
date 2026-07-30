/** Stable content contracts shared by the game, local fallback, and remote services. */
export type ContentLanguage = 'es' | 'en';
export type Difficulty = 1 | 2 | 3 | 4 | 5;
export type ContentStatus = 'draft' | 'published' | 'archived';
export type WordCategory =
  | 'animals'
  | 'body'
  | 'clothing'
  | 'colors'
  | 'food'
  | 'home'
  | 'nature'
  | 'people'
  | 'school'
  | 'technology'
  | 'travel';

export type CosmeticKind =
  | 'cloud_palette'
  | 'river_palette'
  | 'success_trail'
  | 'particles'
  | 'profile_frame'
  | 'keyboard_theme';

export type GameContentMode = 'classic' | 'es_en' | 'en_es';

export type ParagraphCategory = 'poetic' | 'motivational-literature' | 'romanticism' | 'self-improvement' | 'biblical-self-help' | 'constructive-dialogues';
export type ParagraphMode = 'classic' | ParagraphCategory;
export type ParagraphContentOrigin = 'typingroll-original' | 'scripture-reflection';

export interface ParagraphEntry {
  id: string;
  text: string;
  category: ParagraphCategory;
  origin: ParagraphContentOrigin;
  /** Biblical entries point to a passage, but use an original reflection instead of reproducing a translation. */
  sourceReference?: string;
  isSafe: true;
}

export interface ContentPack {
  id: string;
  version: number;
  name: string;
  description: string;
  language: ContentLanguage;
  categories: readonly WordCategory[];
  status: ContentStatus;
  releasedAt: string;
}

export interface WordEntry {
  id: string;
  text: string;
  /** Uppercase, accent-free form used for matching keyboard input. */
  normalized: string;
  language: ContentLanguage;
  difficulty: Difficulty;
  category: WordCategory;
  packId: string;
  status: ContentStatus;
  isSafe: boolean;
}

export interface TranslationEntry {
  id: string;
  sourceWordId: string;
  targetWordId: string;
  status: ContentStatus;
}

export interface Cosmetic {
  id: string;
  name: string;
  description: string;
  kind: CosmeticKind;
  rarity: 'common' | 'rare' | 'epic';
  priceCoins: number;
  isFree: boolean;
  status: ContentStatus;
  preview: {
    primary: string;
    secondary: string;
  };
}

export interface Season {
  id: string;
  name: string;
  theme: string;
  startsAt: string;
  endsAt: string;
  featuredPackIds: readonly string[];
  rewardCosmeticIds: readonly string[];
  status: ContentStatus;
}

export interface DailyChallenge {
  id: string;
  date: string;
  mode: GameContentMode;
  seed: number;
  packId: string;
  targetScore: number;
  rewardCoins: number;
  title: string;
}

export interface PlayerProgress {
  version: 1;
  playerId: string;
  displayName: 'Jugador invitado';
  coins: number;
  highScore: number;
  ownedCosmeticIds: string[];
  selectedCosmeticIds: Partial<Record<CosmeticKind, string>>;
  achievementIds: string[];
  claimedDailyChallengeIds: string[];
  updatedAt: string;
}

export interface ContentCatalog {
  packs: readonly ContentPack[];
  words: readonly WordEntry[];
  translations: readonly TranslationEntry[];
  cosmetics: readonly Cosmetic[];
  seasons: readonly Season[];
}

export interface DailyChallengeRequest {
  date?: Date;
  mode?: GameContentMode;
}
