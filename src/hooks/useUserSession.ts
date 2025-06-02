'use client';

import { useState, useEffect } from 'react';

interface UserSession {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

export function useUserSession(): {
  user: UserSession | null;
  loading: boolean;
  error: Error | null;
} {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/user/session', {
          method: 'GET',
          credentials: 'include' // Important for cookies
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user session');
        }

        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        console.error('Error fetching user session:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchUserSession();
  }, []);

  return { user, loading, error };
}
