'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api, getToken, setToken, clearToken, ApiError } from '@/lib/api';
import { useTheme } from '@/components/theme/ThemeProvider';
import type { ThemeMode, AccentColor } from '@/components/theme/ThemeProvider';

export interface User {
  id: string;
  email: string | null;
  fullName: string;
  title: string | null;
  username: string | null;
  avatarSeed: string;
  isGuest: boolean;
  themeMode: ThemeMode;
  accentColor: AccentColor;
  createdAt: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  guestLogin: (fullName?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { setMode, setAccent } = useTheme();

  const applyUserTheme = useCallback(
    (u: User) => {
      setMode(u.themeMode);
      setAccent(u.accentColor);
    },
    [setMode, setAccent],
  );

  useEffect(() => {
    async function loadUser() {
      if (!getToken()) {
        setIsLoading(false);
        return;
      }
      try {
        const me = await api.get<User>('/auth/me');
        setUser(me);
        applyUserTheme(me);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) clearToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const guestLogin = useCallback(
    async (fullName?: string) => {
      const result = await api.post<{ token: string; user: User }>('/auth/guest', { fullName });
      setToken(result.token);
      setUser(result.user);
      applyUserTheme(result.user);
      router.push('/tasks');
    },
    [applyUserTheme, router],
  );

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, isLoading, guestLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}