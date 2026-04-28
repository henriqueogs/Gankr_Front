import { useCallback, useEffect, useState } from 'react';
import { api, getApiErrorMessage } from '../../api/client';

interface GroupPost {
  id: string;
  content: string;
  author: {
    id: string;
    displayName: string;
    nickname: string;
    avatarUrl: string | null;
  };
  createdAt: string;
}

interface UseGroupPostsReturn {
  posts: GroupPost[];
  loading: boolean;
  error: string | null;
  createPost: (content: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useGroupPosts = (groupId: string): UseGroupPostsReturn => {
  const [posts, setPosts] = useState<GroupPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    if (!groupId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get<GroupPost[]>(`/groups/${groupId}/posts`);
      setPosts(response.data);
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'Failed to load posts');
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  const createPost = async (content: string) => {
    setError(null);
    try {
      const response = await api.post<GroupPost>(`/groups/${groupId}/posts`, { content });
      setPosts((prev) => [response.data, ...prev]);
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'Failed to create post');
      setError(msg);
      throw new Error(msg);
    }
  };

  const deletePost = async (postId: string) => {
    setError(null);
    try {
      await api.delete(`/groups/${groupId}/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'Failed to delete post');
      setError(msg);
      throw new Error(msg);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    createPost,
    deletePost,
    refetch: fetchPosts,
  };
};
