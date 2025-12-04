import { useState } from "react";
import { groupApi } from "../../api/client";

interface UseCreateGroupPayload {
  name: string;
  nickname: string;
}

interface UseCreateGroupState {
  loading: boolean;
  error: string | null;
}

interface UseCreateGroupReturn extends UseCreateGroupState {
  createGroup: (payload: UseCreateGroupPayload) => Promise<void>;
}

export const useCreateGroup = (): UseCreateGroupReturn => {
  const [state, setState] = useState<UseCreateGroupState>({
    loading: false,
    error: null,
  });

  const createGroup = async (payload: UseCreateGroupPayload) => {
    setState({ loading: true, error: null });

    try {
      await groupApi.createGroup({
        name: payload.name,
        nickname: payload.nickname.toLowerCase(),
      });

      setState({ loading: false, error: null });
    } catch (err) {
      console.error("Error creating group:", err);
      setState({
        loading: false,
        error: "Erro ao criar grupo. Verifique se o nickname já existe.",
      });
      throw err; // Re-throw para permitir tratamento no componente
    }
  };

  return {
    ...state,
    createGroup,
  };
};
