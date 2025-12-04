import { AuthResponse } from "../../api/types";

export interface UseLoginPayload {
  email: string;
  password: string;
}

export interface UseLoginState {
  loading: boolean;
  error: string | null;
}

export interface UseLoginReturn extends UseLoginState {
  login: (payload: UseLoginPayload) => Promise<AuthResponse>;
}