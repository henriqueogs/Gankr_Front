import { useCallback, useEffect, useState } from 'react';
import { api, getApiErrorMessage } from '../../api/client';

interface LeaderboardEntry {
  position: number;
  user: {
    id: string;
    displayName: string;
    nickname: string;
    avatarUrl: string | null;
  };
  score: number;
  playtime: number;
  playtime2weeks: number;
  achievements: number;
  baselinePlaytime: number;
  baselineAchievements: number;
  deltaPlaytime: number;
  deltaAchievements: number;
}

interface UseLeaderboardReturn {
  leaderboard: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useChampionshipLeaderboard = (championshipId: string): UseLeaderboardReturn => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    if (!championshipId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get<LeaderboardEntry[]>(`/championships/${championshipId}/leaderboard`);
      setLeaderboard(response.data);
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'Failed to load leaderboard');
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [championshipId]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return {
    leaderboard,
    loading,
    error,
    refetch: fetchLeaderboard,
  };
};
