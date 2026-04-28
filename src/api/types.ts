export interface AuthenticatedUser {
  id: string;
  email: string;
  displayName: string;
  nickname: string;
  avatarUrl?: string | null;
  bio?: string | null;
  coverImageUrl?: string | null;
  steamId?: string | null;
  steamProfileUrl?: string | null;
  countryCode?: string | null;
  favoriteGames?: {
    game: {
      appId: string;
      name: string;
      iconUrl?: string | null;
      logoUrl?: string | null;
    };
    addedAt?: string;
  }[];
  gameStats?: {
    game: SteamGame;
    playtime: number;
    playtime2weeks: number;
    achievements: number;
  }[];
}

export type FriendshipStatus =
  | 'SELF'
  | 'FRIENDS'
  | 'PENDING_SENT'
  | 'PENDING_RECEIVED'
  | 'NONE';

export interface UserSearchResult {
  id: string;
  nickname: string;
  displayName: string;
  avatarUrl?: string | null;
  friendshipStatus: FriendshipStatus;
}

export interface BasicUserProfile {
  id: string;
  nickname: string;
  displayName: string;
  avatarUrl?: string | null;
}

export interface PendingFriendRequest {
  id: string;
  direction: 'INCOMING' | 'OUTGOING';
  createdAt: string;
  user: BasicUserProfile;
}

export interface PublicUserProfile {
  id: string;
  displayName: string;
  nickname: string;
  avatarUrl?: string | null;
  bio?: string | null;
  coverImageUrl?: string | null;
  steamId?: string | null;
  steamProfileUrl?: string | null;
  countryCode?: string | null;
  friendshipStatus: FriendshipStatus;
  stats: {
    totalGames: number;
    totalPlaytime: number;
    totalAchievements: number;
  };
  topGames: {
    playtime: number;
    playtime2weeks: number;
    achievements: number;
    game: {
      appId: string;
      name: string;
      iconUrl?: string | null;
      logoUrl?: string | null;
    };
  }[];
  favoriteGames?: {
    game: {
      appId: string;
      name: string;
      iconUrl?: string | null;
      logoUrl?: string | null;
    };
    addedAt: string;
  }[];
}

export interface AuthResponse {
  token: string;
  user: AuthenticatedUser;
}

export interface GroupSummary {
  id: string;
  name: string;
  nickname: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  membershipRole: 'ADMIN' | 'MEMBER';
  membersCount?: number;
}

export interface GroupMember {
  id: string;
  nickname: string;
  displayName: string;
  avatarUrl?: string | null;
  role: 'ADMIN' | 'MEMBER';
  joinedAt: string;
}

export interface GroupDetail extends GroupSummary {
  members: GroupMember[];
}

export interface SteamGame {
  appId: string;
  name: string;
  iconUrl?: string;
  logoUrl?: string;
  playtime: number;
}

export interface GameSearchResult {
  appId: string;
  name: string;
  iconUrl?: string | null;
  logoUrl?: string | null;
}
