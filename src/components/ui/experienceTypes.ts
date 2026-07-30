/**
 * View models used by the React experience around a run.  They deliberately
 * contain no persistence or store-specific fields so web, desktop and mobile
 * can render the same screens.
 */
import type { GameMode } from '../../game/domain/types';

export type PlayableMode = GameMode;

export interface DailyMissionPreview {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  rewardLabel: string;
  completed?: boolean;
}

export interface AchievementPreview {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked?: boolean;
}

export interface PlayerProgressPreview {
  displayName?: string;
  guest?: boolean;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  coins: number;
  highScore: number;
  bestWpm?: number;
  accuracy?: number;
  streakDays?: number;
  dailyMissions: DailyMissionPreview[];
  achievements?: AchievementPreview[];
}

export type CosmeticSlot =
  | 'cloud'
  | 'river'
  | 'trail'
  | 'particles'
  | 'profile-frame'
  | 'keyboard';

export interface CosmeticPreview {
  id: string;
  name: string;
  description: string;
  slot: CosmeticSlot;
  palette: readonly [string, string, string];
  unlockLabel: string;
  owned?: boolean;
  isNew?: boolean;
}
