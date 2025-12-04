import { useState, useCallback } from "react";
import { userApi } from "../../api/client";
import { AuthenticatedUser } from "../../api/types";

interface UseSearchUsersState {
  users: AuthenticatedUser[];
  loading: boolean;
  error: string | null;
}

interface UseSearchUsersReturn extends UseSearchUsersState {
  searchByNickname: (nickname: string) => Promise<void>;
  clearResults: () => void;
}

export const useSearchUsers = (): UseSearchUsersReturn => {
  const [state, setState] = useState<UseSearchUsersState>({
    users: [],
    loading: false,
    error: null,
  });

  const searchByNickname = useCallback(async (nickname: string) => {
    if (!nickname.trim()) {
      setState({ users: [], loading: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await userApi.searchByNickname(nickname.trim());
      setState({
        users: data,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error("Error searching users:", err);
      setState({
        users: [],
        loading: false,
        error: "Erro ao buscar usuários.",
      });
    }
  }, []);

  const clearResults = useCallback(() => {
    setState({ users: [], loading: false, error: null });
  }, []);

  return {
    ...state,
    searchByNickname,
    clearResults,
  };
};
