import { useState } from "react";
import { authApi } from "../../api/client";

interface UseRegisterPayload {
  email: string;
  password: string;
  displayName: string;
  nickname: string;
  avatarUrl?: string;
}

interface UseRegisterState {
  loading: boolean;
  error: string | null;
}

interface UseRegisterReturn extends UseRegisterState {
  register: (payload: UseRegisterPayload) => Promise<void>;
}

export const useRegister = (): UseRegisterReturn => {
  const [state, setState] = useState<UseRegisterState>({
    loading: false,
    error: null,
  });

  const register = async (payload: UseRegisterPayload) => {
    setState({ loading: true, error: null });

    try {
      await authApi.register(payload);
      setState({ loading: false, error: null });
    } catch (err) {
      console.error("Error registering:", err);
      setState({
        loading: false,
        error:
          "Erro ao criar conta. Verifique se o email ou nickname já existem.",
      });
      throw err;
    }
  };

  return {
    ...state,
    register,
  };
};
