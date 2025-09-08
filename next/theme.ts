import { createTheme, type PaletteMode } from '@mui/material';

export function createAppTheme(mode: PaletteMode, fontFamily: string) {
  const isDark = mode === 'dark';

  const primary = {
    main: isDark ? '#00E5A8' : '#0C7BE8',
    light: isDark ? '#33f0bc' : '#4ea2f0',
    dark: isDark ? '#00b381' : '#085fb7',
    contrastText: isDark ? '#051012' : '#ffffff',
  };
  const secondary = {
    main: isDark ? '#7C4DFF' : '#7B46FF',
  };

  return createTheme({
    palette: {
      mode,
      primary,
      secondary,
      background: {
        default: isDark ? '#0b0f14' : '#f7f9fb',
        paper: isDark ? '#0f141b' : '#ffffff',
      },
      text: {
        primary: isDark ? '#E6EDF3' : '#0B1220',
        secondary: isDark ? '#A9B4C0' : '#4A5568',
      },
      success: { main: '#00E5A8' },
      error: { main: '#FF5370' },
      warning: { main: '#FFC107' },
      info: { main: '#26C6DA' },
    },
    shape: { borderRadius: 14 },
    typography: {
      fontFamily,
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundImage: isDark
              ? 'radial-gradient(1200px 600px at 100% -20%, rgba(124,77,255,0.12) 0, transparent 60%), radial-gradient(1000px 600px at -20% 120%, rgba(0,229,168,0.10) 0, transparent 60%)'
              : 'radial-gradient(1200px 600px at 100% -20%, rgba(12,123,232,0.10) 0, transparent 60%), radial-gradient(1000px 600px at -20% 120%, rgba(123,70,255,0.06) 0, transparent 60%)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: isDark ? 'rgba(5, 10, 16, 0.6)' : 'rgba(255,255,255,0.6)',
            backdropFilter: 'saturate(160%) blur(6px)',
            boxShadow: 'none',
            borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)'
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
    },
  });
}

