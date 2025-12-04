import { useCallback, useEffect, useState } from "react";
import { groupApi } from "../../api/client";
import { GroupDetail } from "../../api/types";

interface UseGetGroupDetailState {
  group: GroupDetail | null;
  loading: boolean;
  error: string | null;
}

interface UseGetGroupDetailReturn extends UseGetGroupDetailState {
  refetch: () => Promise<void>;
}

export const useGetGroupDetail = (groupId: string): UseGetGroupDetailReturn => {
  const [state, setState] = useState<UseGetGroupDetailState>({
    group: null,
    loading: true,
    error: null,
  });

  const fetchGroup = useCallback(async () => {
    if (!groupId) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await groupApi.getGroup(groupId);
      setState({
        group: data,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error("Error fetching group detail:", err);
      setState({
        group: null,
        loading: false,
        error: "Não foi possível carregar os detalhes do grupo.",
      });
    }
  }, [groupId]);

  useEffect(() => {
    fetchGroup();
  }, [fetchGroup]);

  return {
    ...state,
    refetch: fetchGroup,
  };
};
