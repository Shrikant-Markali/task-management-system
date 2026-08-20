'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

const MODE_KEY = 'pyramid.themeMode';
const ACCENT_KEY = 'pyramid.accentColor';

export const ACCENT_COLORS = ['AMBER', 'BLUE', 'PINK', 'ROSE', 'EMERALD', 'BLACK'] as const;
export type AccentColor = typeof ACCENT_COLORS[number];
export type ThemeMode = 'LIGHT' | 'DARK';

interface ThemeContextValue {
  mode: ThemeMode;
  accent: AccentColor;
  setMode: (mode: ThemeMode) => void;
  setAccent: (accent: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyToDocument(mode: ThemeMode, accent: AccentColor) {
  const root = document.documentElement;
  root.classList.toggle('dark', mode === 'DARK');
  root.setAttribute('data-accent', accent.toLowerCase());
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('LIGHT');
  const [accent, setAccentState] = useState<AccentColor>('BLUE');

  useEffect(() => {
  const storedMode = (localStorage.getItem(MODE_KEY) as ThemeMode | null) ?? 'LIGHT';
  const storedAccent = (localStorage.getItem(ACCENT_KEY) as AccentColor | null) ?? 'BLUE';
  setModeState(storedMode);
  setAccentState(storedAccent);
  applyToDocument(storedMode, storedAccent);
}, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    localStorage.setItem(MODE_KEY, next);
    applyToDocument(next, accent);
  }, [accent]);

  const setAccent = useCallback((next: AccentColor) => {
    setAccentState(next);
    localStorage.setItem(ACCENT_KEY, next);
    applyToDocument(mode, next);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, accent, setMode, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}