import axios from 'axios';
import {
  AuthenticatedUser,
  AuthResponse,
  GroupSummary,
  GroupMember,
  GroupDetail
} from './types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3333';

const api = axios.create({
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
  searchByNickname(nickname: string) {
    return api
      .get<AuthenticatedUser[]>(`/users/search`, { params: { nickname } })
      .then((res) => res.data);
  },
};
