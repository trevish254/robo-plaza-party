// TypeScript interfaces for Roblox integration

export interface PlayerStats {
  userId: string;
  username: string;
  displayName: string;
  totalWins: number;
  totalGamesPlayed: number;
  coins: number;
  level: number;
  experience: number;
  joinDate: string;
  lastActive: string;
}

export interface GameStats {
  gameId: string;
  gameName: string;
  wins: number;
  losses: number;
  bestTime?: number;
  totalPlays: number;
  winRate: number;
  lastPlayed: string;
}

export interface MiniGame {
  id: string;
  name: string;
  description: string;
  category: 'obby' | 'racing' | 'battle' | 'tycoon' | 'puzzle';
  thumbnail: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  maxPlayers: number;
  averagePlayTime: number;
  totalPlayers: number;
  isActive: boolean;
  placeId?: string; // Roblox place ID for teleporting
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  reward?: {
    type: 'coins' | 'cosmetic' | 'badge';
    amount?: number;
    itemId?: string;
  };
}

export interface CosmeticItem {
  id: string;
  name: string;
  description: string;
  category: 'hat' | 'shirt' | 'pants' | 'accessory' | 'gear';
  price: number;
  currency: 'coins' | 'robux';
  thumbnail: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  isOwned: boolean;
  isEquipped: boolean;
  assetId?: string; // Roblox asset ID
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  wins: number;
  level: number;
  gameSpecificScore?: number;
}

// API Response interfaces
export interface RobloxApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface GameTeleportRequest {
  placeId: string;
  userId: string;
  privateServerId?: string;
  jobId?: string;
}

export interface PurchaseRequest {
  userId: string;
  itemId: string;
  price: number;
  currency: 'coins' | 'robux';
}

// Roblox DataStore interfaces
export interface PlayerDataStore {
  stats: PlayerStats;
  gameStats: GameStats[];
  achievements: Achievement[];
  inventory: CosmeticItem[];
  settings: {
    notifications: boolean;
    soundEnabled: boolean;
    musicVolume: number;
    sfxVolume: number;
  };
}

// Hub-specific interfaces
export interface HubNotification {
  id: string;
  type: 'achievement' | 'game_invite' | 'system' | 'purchase';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface GameSession {
  sessionId: string;
  gameId: string;
  startTime: string;
  endTime?: string;
  score?: number;
  placement?: number;
  isWin: boolean;
}