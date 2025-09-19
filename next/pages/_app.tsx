import type { AppProps } from 'next/app';
import React from 'react';
import '../styles/global.css';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ColorModeProvider, useColorMode } from '../lib/ColorModeProvider';
import { createAppTheme } from '../theme';
import Layout from '../components/Layout';
import AuthGuard from '../components/common/AuthGuard';
import WSListener from '../components/common/WSListener';

function ThemeRoot({ children }: { children: React.ReactNode }) {
  const { mode } = useColorMode();
  const theme = React.useMemo(() => createAppTheme(mode, `Inter, Roboto, Helvetica, Arial, sans-serif`), [mode]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    if ('serviceWorker' in navigator) {
      const register = () => {
        navigator.serviceWorker
          .register('/sw.js')
          .catch((error) => {
            console.error('Service worker registration failed:', error);
          });
      };

      window.addEventListener('load', register);
      return () => window.removeEventListener('load', register);
    }
  }, []);

  return (
    <ColorModeProvider>
      <ThemeRoot>
        <Layout>
          <AuthGuard>
            <Component {...pageProps} />
          </AuthGuard>
          <WSListener />
        </Layout>
      </ThemeRoot>
    </ColorModeProvider>
  );
}
