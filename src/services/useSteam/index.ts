import { useState } from 'react';
import { api, userApi } from '../../api/client';
import { AuthenticatedUser } from '../../api/types';
import { useAuth } from '../../hooks/useAuth';

export const useSteam = () => {
  const { setUserSession, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const linkSteam = async (steamId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<AuthenticatedUser>('/me/steam/link', { steamId });
      // Update local user state
      if (token && response.data) {
        setUserSession(token, response.data);
      }
      return response.data;
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any;
      const msg = error.response?.data?.message || 'Failed to link Steam account';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const syncSteam = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/me/steam/sync');
      await api.post('/me/steam/sync');

      // Refetch updated profile
      if (token) {
        const updatedUser = await userApi.getMe();
        setUserSession(token, updatedUser);
        setUserSession(token, updatedUser);
        setUserSession(token, updatedUser);
      }
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any;
      const msg = error.response?.data?.message || 'Failed to sync Steam data';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    linkSteam,
    syncSteam,
    loading,
    error,
  };
};
