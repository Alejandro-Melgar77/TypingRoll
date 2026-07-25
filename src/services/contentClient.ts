import { CONTENT_CATALOG, createDailyChallenge } from '../content/catalog';
import type {
  ContentCatalog,
  DailyChallenge,
  DailyChallengeRequest,
  PlayerProgress,
} from '../content/types';

const STORAGE_KEY = 'typingroll.content-player-progress.v1';
const STARTER_COSMETIC_IDS = [
  'cloud-cotton',
  'river-celeste',
  'trail-comet',
  'particles-breeze',
  'frame-starter',
  'keyboard-sky',
];

export interface ContentClient {
  getCatalog(): Promise<ContentCatalog>;
  getDailyChallenge(request?: DailyChallengeRequest): Promise<DailyChallenge>;
  getPlayerProgress(): Promise<PlayerProgress>;
  savePlayerProgress(progress: PlayerProgress): Promise<PlayerProgress>;
  claimDailyChallenge(challenge: DailyChallenge): Promise<PlayerProgress>;
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function createGuestId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `guest-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createDefaultPlayerProgress(): PlayerProgress {
  return {
    version: 1,
    playerId: createGuestId(),
    displayName: 'Jugador invitado',
    coins: 0,
    highScore: 0,
    ownedCosmeticIds: [...STARTER_COSMETIC_IDS],
    selectedCosmeticIds: {
      cloud_palette: 'cloud-cotton',
      river_palette: 'river-celeste',
      success_trail: 'trail-comet',
      particles: 'particles-breeze',
      profile_frame: 'frame-starter',
      keyboard_theme: 'keyboard-sky',
    },
    achievementIds: [],
    claimedDailyChallengeIds: [],
    updatedAt: new Date().toISOString(),
  };
}

function isProgress(value: unknown): value is PlayerProgress {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<PlayerProgress>;
  return candidate.version === 1
    && typeof candidate.playerId === 'string'
    && candidate.displayName === 'Jugador invitado'
    && typeof candidate.coins === 'number'
    && typeof candidate.highScore === 'number'
    && Array.isArray(candidate.ownedCosmeticIds)
    && Array.isArray(candidate.achievementIds)
    && Array.isArray(candidate.claimedDailyChallengeIds)
    && typeof candidate.selectedCosmeticIds === 'object'
    && candidate.selectedCosmeticIds !== null;
}

/**
 * Browser-only fallback used before Supabase is configured. It deliberately
 * persists only on this device and never includes a backend credential.
 */
export class LocalContentClient implements ContentClient {
  private memoryProgress: PlayerProgress | null = null;

  async getCatalog(): Promise<ContentCatalog> {
    return clone(CONTENT_CATALOG);
  }

  async getDailyChallenge(request: DailyChallengeRequest = {}): Promise<DailyChallenge> {
    return createDailyChallenge(request.date ?? new Date(), request.mode ?? 'classic');
  }

  async getPlayerProgress(): Promise<PlayerProgress> {
    if (this.memoryProgress) return clone(this.memoryProgress);

    const fromStorage = this.readProgress();
    this.memoryProgress = fromStorage ?? createDefaultPlayerProgress();
    if (!fromStorage) this.writeProgress(this.memoryProgress);
    return clone(this.memoryProgress);
  }

  async savePlayerProgress(progress: PlayerProgress): Promise<PlayerProgress> {
    const current = await this.getPlayerProgress();
    if (!isProgress(progress) || progress.playerId !== current.playerId) {
      throw new Error('El progreso del jugador invitado no es válido.');
    }

    const next: PlayerProgress = {
      ...clone(progress),
      coins: Math.max(0, Math.floor(progress.coins)),
      highScore: Math.max(0, Math.floor(progress.highScore)),
      updatedAt: new Date().toISOString(),
    };
    this.memoryProgress = next;
    this.writeProgress(next);
    return clone(next);
  }

  async claimDailyChallenge(challenge: DailyChallenge): Promise<PlayerProgress> {
    const current = await this.getPlayerProgress();
    if (current.claimedDailyChallengeIds.includes(challenge.id)) return current;

    return this.savePlayerProgress({
      ...current,
      coins: current.coins + challenge.rewardCoins,
      claimedDailyChallengeIds: [...current.claimedDailyChallengeIds, challenge.id],
    });
  }

  private readProgress(): PlayerProgress | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed: unknown = JSON.parse(raw);
      return isProgress(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  private writeProgress(progress: PlayerProgress): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Private browsing or a full quota must not make a single-player run fail.
    }
  }
}

export const contentClient: ContentClient = new LocalContentClient();
