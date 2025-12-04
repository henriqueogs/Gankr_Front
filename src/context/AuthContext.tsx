import {
  ReactNode,
  createContext,
  useCallback,
  useMemo,
  useState,
} from "react";

import { AuthenticatedUser, AuthResponse } from "../api/types";
import { authApi, setAuthToken } from "../api/client";

interface AuthContextValue {
  user: AuthenticatedUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  setUserSession: (token: string, user: AuthenticatedUser) => void;
  register: (payload: {
    email: string;
    password: string;
    displayName: string;
    nickname: string;
  }) => Promise<void>;
  logout: () => void;
  setSession: (payload: AuthResponse) => void;
}

const STORAGE_KEY = "gankr.auth";

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

const getInitialState = () => {
  const serialized = localStorage.getItem(STORAGE_KEY);
  if (!serialized) {
    return { user: null, token: null };
  }

  try {
    const parsed = JSON.parse(serialized) as AuthResponse;
    setAuthToken(parsed.token);
    return { user: parsed.user, token: parsed.token };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return { user: null, token: null };
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<{
    user: AuthenticatedUser | null;
    token: string | null;
  }>(() => getInitialState());

  const { user, token } = session;

  const persist = useCallback((payload: AuthResponse | null) => {
    if (payload) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setAuthToken(payload.token);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      setAuthToken(null);
    }
  }, []);

  const setSession = useCallback(
    (payload: AuthResponse) => {
      setSessionState({
        user: payload.user,
        token: payload.token,
      });
      persist(payload);
    },
    [persist]
  );

  const setUserSession = useCallback(
    (token: string, user: AuthenticatedUser) => {
      const payload: AuthResponse = { token, user };
      setSession(payload);
    },
    [setSession]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const session = await authApi.login({ email, password });
      setSession(session);
    },
    [setSession]
  );

  const register = useCallback(
    async (payload: {
      email: string;
      password: string;
      displayName: string;
      nickname: string;
    }) => {
      const session = await authApi.register(payload);
      setSession(session);
    },
    [setSession]
  );

  const logout = useCallback(() => {
    setSessionState({
      user: null,
      token: null,
    });
    persist(null);
  }, [persist]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      login,
      setUserSession,
      register,
      logout,
      setSession,
    }),
    [user, token, login, register, logout, setSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
