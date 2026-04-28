import axios from 'axios';
import {
  AuthenticatedUser,
  AuthResponse,
  GroupSummary,
  GroupMember,
  GroupDetail,
  GameSearchResult,
  PendingFriendRequest,
  PublicUserProfile,
  UserSearchResult,
} from './types';

declare const __API_BASE_URL__: string | undefined;

const API_BASE_URL =
  typeof __API_BASE_URL__ !== 'undefined' && __API_BASE_URL__
    ? __API_BASE_URL__
    : 'http://localhost:3333';

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'data' in error.response &&
    typeof error.response.data === 'object' &&
    error.response.data !== null &&
    'message' in error.response.data &&
    typeof error.response.data.message === 'string'
  ) {
    return error.response.data.message;
  }

  return fallback;
}

export const api = axios.create({
  baseURL: API_BASE_URL,
});

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export const authApi = {
  register(payload: {
    email: string;
    password: string;
    displayName: string;
    nickname: string;
    avatarUrl?: string;
  }) {
    return api.post<AuthResponse>('/auth/register', payload).then((res) => res.data);
  },
  login(payload: { email: string; password: string }) {
    return api.post<AuthResponse>('/auth/login', payload).then((res) => res.data);
  },
};

export const groupApi = {
  listGroups() {
    return api.get<GroupSummary[]>('/groups').then((res) => res.data);
  },
  createGroup(payload: { name: string; nickname: string }) {
    return api.post<GroupSummary>('/groups', payload).then((res) => res.data);
  },
  getGroup(id: string) {
    return api.get<GroupDetail>(`/groups/${id}`).then((res) => res.data);
  },
  addMember(groupId: string, nickname: string) {
    return api
      .post<GroupMember>(`/groups/${groupId}/members`, { nickname })
      .then((res) => res.data);
  },
  removeMember(groupId: string, userId: string) {
    return api
      .delete<void>(`/groups/${groupId}/members/${userId}`)
      .then(() => undefined);
  },
};

export const userApi = {
  getMe() {
    return api.get<AuthenticatedUser>('/me').then((res) => res.data);
  },
  updateMe(payload: {
    displayName?: string;
    avatarUrl?: string | null;
    bio?: string | null;
    coverImageUrl?: string | null;
    favoriteGames?: { appId: string; name: string }[];
  }) {
    return api.patch<AuthenticatedUser>('/me', payload).then((res) => res.data);
  },
  searchByNickname(nickname: string) {
    return api
      .get<UserSearchResult[]>(`/users/search`, { params: { nickname } })
      .then((res) => res.data);
  },
  getPublicProfile(userId: string) {
    return api
      .get<PublicUserProfile>(`/users/${userId}/public`)
      .then((res) => res.data);
  },

};

export const socialApi = {
  joinGroup(groupCode: string) {
    return api.post('/social/groups/join', { groupCode }).then((res) => res.data);
  },
  getGroupRequests(groupId: string) {
    return api.get<{ id: string; user: AuthenticatedUser }[]>(`/social/groups/${groupId}/requests`).then((res) => res.data);
  },
  respondGroupRequest(requestId: string, status: 'APPROVED' | 'REJECTED') {
    return api.patch(`/social/group-requests/${requestId}`, { status }).then((res) => res.data);
  },
  // Friends
  listFriends() {
    return api.get<AuthenticatedUser[]>('/social/friends').then((res) => res.data);
  },
  sendFriendRequest(nickname: string) {
    return api.post('/social/friends/requests', { nickname }).then((res) => res.data);
  },
  respondFriendRequest(requestId: string, status: 'ACCEPTED' | 'REJECTED') {
    return api.patch(`/social/friends/requests/${requestId}`, { status }).then((res) => res.data);
  },
  listFriendRequests() {
    return api.get<{ id: string; sender: AuthenticatedUser }[]>('/social/friends/requests').then((res) => res.data);
  },
  listPendingFriendRequests() {
    return api
      .get<PendingFriendRequest[]>('/social/friends/requests/pending')
      .then((res) => res.data);
  }
};

export const gameApi = {
  getDetails(appId: string) {
    return api.get<{ appId: string; name: string; description: string; shortDescription: string }>(`/games/${appId}`).then(res => res.data);
  },
  search(query: string, limit = 15) {
    return api
      .get<GameSearchResult[]>('/games/search', {
        params: { query, limit },
      })
      .then((res) => res.data);
  }
};
