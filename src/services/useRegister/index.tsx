import { useState } from "react";
import { authApi } from "../../api/client";
import {
  UseRegisterPayload,
  UseRegisterState,
  UseRegisterReturn,
} from "./types";

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
