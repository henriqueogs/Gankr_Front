import { useCallback, useEffect, useState } from "react";
import { groupApi } from "../../api/client";
import { UseGetListGroupsState, UseGetListGroupsReturn } from "./types";

export const useGetListGroups = (): UseGetListGroupsReturn => {
  const [state, setState] = useState<UseGetListGroupsState>({
    groups: [],
    loading: true,
    error: null,
  });

  const fetchGroups = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await groupApi.listGroups();
      setState({
        groups: data,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error("Error fetching groups:", err);
      setState({
        groups: [],
        loading: false,
        error: "Não foi possível carregar seus grupos.",
      });
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return {
    ...state,
    refetch: fetchGroups,
  };
};
