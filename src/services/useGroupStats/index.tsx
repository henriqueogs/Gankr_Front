import { useCallback, useEffect, useState } from "react";
import { api, getApiErrorMessage } from "../../api/client";

export interface GroupStatsGame {
  game: {
    appId: string;
    name: string;
    iconUrl?: string | null;
    logoUrl?: string | null;
  };
  totalPlaytime: number;
  totalPlaytime2weeks: number;
  totalAchievements: number;
  playersCount: number;
}

export interface GroupStatsData {
  groupId: string;
  totalMembers: number;
  totalPlaytime: number;
  totalPlaytime2weeks: number;
  totalAchievements: number;
  gamesCount: number;
  games: GroupStatsGame[];
  topGames: GroupStatsGame[];
}

interface UseGroupStatsReturn {
  stats: GroupStatsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useGroupStats = (groupId: string): UseGroupStatsReturn => {
  const [stats, setStats] = useState<GroupStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!groupId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.get<GroupStatsData>(
        `/groups/${groupId}/stats`,
      );
      setStats(response.data);
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, "Failed to load group stats");
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};
