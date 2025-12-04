import { useState } from "react";
import { groupApi } from "../../api/client";
import { UseRemoveGroupMemberState, UseRemoveGroupMemberReturn } from "./types";

export const useRemoveGroupMember = (): UseRemoveGroupMemberReturn => {
  const [state, setState] = useState<UseRemoveGroupMemberState>({
    loading: false,
    error: null,
  });

  const removeMember = async (groupId: string, userId: string) => {
    setState({ loading: true, error: null });

    try {
      await groupApi.removeMember(groupId, userId);
      setState({ loading: false, error: null });
    } catch (err) {
      console.error("Error removing member:", err);
      setState({
        loading: false,
        error: "Erro ao remover membro do grupo.",
      });
      throw err;
    }
  };

  return {
    ...state,
    removeMember,
  };
};
