import { useState, useEffect, useCallback } from 'react';
import { api } from '../../api/client';

export interface Notification {
  id: string;
  type: 'FRIEND_REQUEST' | 'GROUP_REQUEST' | 'SYSTEM';
  content: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await api.get<Notification[]>('/social/notifications');
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  }, []);

  const markRead = async (id: string) => {
    try {
      await api.patch(`/social/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark read', error);
    }
  };

  const respondFriendRequest = async (requestId: string, status: 'ACCEPTED' | 'REJECTED') => {
    await api.patch(`/social/friends/requests/${requestId}`, { status });
    fetchNotifications();
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    markRead,
    respondFriendRequest,
    refetch: fetchNotifications
  };
};
