import { useCallback, useEffect, useState } from "react";
import { api, getApiErrorMessage } from "../../api/client";

interface Championship {
  id: string;
  name: string;
  metric: string;
  status: string;
  startDate: string;
  endDate: string;
  game: {
    appId: string;
    name: string;
    iconUrl: string;
    logoUrl: string;
  };
  createdAt: string;
}

interface UseChampionshipsReturn {
  championships: Championship[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useChampionships = (groupId: string): UseChampionshipsReturn => {
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChampionships = useCallback(async () => {
    if (!groupId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.get<Championship[]>(
        `/groups/${groupId}/championships`
      );
      setChampionships(response.data);
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, "Failed to load championships");
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchChampionships();
  }, [fetchChampionships]);

  return {
    championships,
    loading,
    error,
    refetch: fetchChampionships,
  };
};
