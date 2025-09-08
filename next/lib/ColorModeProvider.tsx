"use client";
import * as React from 'react';
import type { PaletteMode } from '@mui/material';

type ColorModeContextType = {
  mode: PaletteMode;
  toggle: () => void;
};

const ColorModeContext = React.createContext<ColorModeContextType | undefined>(undefined);

function getInitialMode(): PaletteMode {
  if (typeof window === 'undefined') return 'dark';
  const saved = window.localStorage.getItem('color-mode');
  if (saved === 'light' || saved === 'dark') return saved;
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

export function ColorModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<PaletteMode>(getInitialMode);

  const toggle = React.useCallback(() => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') window.localStorage.setItem('color-mode', next);
      return next;
    });
  }, []);

  const value = React.useMemo(() => ({ mode, toggle }), [mode, toggle]);
  return <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>;
}

export function useColorMode() {
  const ctx = React.useContext(ColorModeContext);
  if (!ctx) throw new Error('useColorMode must be used within ColorModeProvider');
  return ctx;
}

