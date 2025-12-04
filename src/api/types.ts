export interface AuthenticatedUser {
  id: string;
  email: string;
  displayName: string;
  nickname: string;
  avatarUrl?: string | null;
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
