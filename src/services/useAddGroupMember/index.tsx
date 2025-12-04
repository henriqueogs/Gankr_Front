import { useState } from "react";
import { groupApi } from "../../api/client";
import { UseAddGroupMemberState, UseAddGroupMemberReturn } from "./types";

export const useAddGroupMember = (): UseAddGroupMemberReturn => {
  const [state, setState] = useState<UseAddGroupMemberState>({
    loading: false,
    error: null,
  });

  const addMember = async (groupId: string, nickname: string) => {
    setState({ loading: true, error: null });

    try {
      await groupApi.addMember(groupId, nickname);
      setState({ loading: false, error: null });
    } catch (err) {
      console.error("Error adding member:", err);
      setState({
        loading: false,
        error: "Erro ao adicionar membro. Verifique se o usuário existe.",
      });
      throw err;
    }
  };

  return {
    ...state,
    addMember,
  };
};
