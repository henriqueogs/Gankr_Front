export interface UseRegisterPayload {
  email: string;
  password: string;
  displayName: string;
  nickname: string;
  avatarUrl?: string;
}

export interface UseRegisterState {
  loading: boolean;
  error: string | null;
}

export interface UseRegisterReturn extends UseRegisterState {
  register: (payload: UseRegisterPayload) => Promise<void>;
}