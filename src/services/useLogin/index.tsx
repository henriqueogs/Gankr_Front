import { useState } from "react";
import { authApi } from "../../api/client";
import { AuthResponse } from "../../api/types";

interface UseLoginPayload {
  email: string;
  password: string;
}

interface UseLoginState {
  loading: boolean;
  error: string | null;
}

interface UseLoginReturn extends UseLoginState {
  login: (payload: UseLoginPayload) => Promise<AuthResponse>;
}

export const useLogin = (): UseLoginReturn => {
  const [state, setState] = useState<UseLoginState>({
    loading: false,
    error: null,
  });

  const login = async (payload: UseLoginPayload) => {
    setState({ loading: true, error: null });

    try {
      const response = await authApi.login(payload);
      setState({ loading: false, error: null });
      return response;
    } catch (err) {
      console.error("Error logging in:", err);
      setState({
        loading: false,
        error: "Email ou senha incorretos.",
      });
      throw err;
    }
  };

  return {
    ...state,
    login,
  };
};
