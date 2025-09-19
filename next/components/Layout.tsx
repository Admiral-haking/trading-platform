import * as React from 'react';
import Link from 'next/link';
import { AppBar, Box, Container, IconButton, NoSsr, Toolbar, Typography, Tooltip, Snackbar, Alert } from '@mui/material';
import AdbIcon from '@mui/icons-material/Adb';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ThemeToggle from './ThemeToggle';
import Sidebar from './Sidebar';
import api, { getToken } from '../utils/axios';

export default function Layout({ children, fontClass }: { children: React.ReactNode; fontClass?: string }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [sendingTest, setSendingTest] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const handleDrawerToggle = () => setMobileOpen((v) => !v);

  const handleSnackClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleTestNotification = React.useCallback(async () => {
    if (typeof window === 'undefined') return;
    if (!('Notification' in window)) {
      setSnackbar({ open: true, message: 'Notifications are not supported in this browser.', severity: 'error' });
      return;
    }
    if (Notification.permission !== 'granted') {
      setSnackbar({ open: true, message: 'Enable notifications on the Signals page first.', severity: 'error' });
      return;
    }
    if (!('serviceWorker' in navigator)) {
      setSnackbar({ open: true, message: 'Service workers are not available in this environment.', severity: 'error' });
      return;
    }

    try {
      setSendingTest(true);
      const response = await api.post('/notifications/test');
      const delivered = response?.data?.delivered ?? 0;
      const total = response?.data?.total ?? delivered;
      const message = response?.data?.message as string | undefined;

      if (total === 0) {
        setSnackbar({ open: true, message: message ?? 'No devices have subscribed to notifications yet.', severity: 'error' });
        return;
      }

      if (delivered === 0) {
        setSnackbar({ open: true, message: message ?? 'Unable to deliver the test notification.', severity: 'error' });
        return;
      }

      setSnackbar({ open: true, message: 'Test notification sent. Check your device.', severity: 'success' });
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.message ?? 'Failed to send test notification.';
      setSnackbar({ open: true, message, severity: 'error' });
    } finally {
      setSendingTest(false);
    }
  }, []);

  return (
    <Box className={fontClass} sx={{ minHeight: '100vh', display: 'flex' }}>
      <AppBar position="fixed" color="transparent" enableColorOnDark sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 1, display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <AdbIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 800 }}>
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Hippogriff Trade</Link>
          </Typography>
          <Tooltip title={sendingTest ? 'Sending test notification…' : 'Send test notification'}>
            <span>
              <IconButton
                color="inherit"
                sx={{ mr: 1 }}
                onClick={handleTestNotification}
                disabled={sendingTest}
                aria-label="send test notification"
              >
                <NotificationsActiveIcon />
              </IconButton>
            </span>
          </Tooltip>
          <ThemeToggle />
        </Toolbar>
      </AppBar>

      <NoSsr>
        {!!getToken() && <Sidebar open={mobileOpen} onClose={handleDrawerToggle} />}
      </NoSsr>

      <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column', }}>
        <Toolbar />
        <Container sx={{ flex: 1, py: 6 }}>
          {children}
        </Container>
        <Box component="footer" sx={{ py: 3, textAlign: 'center', opacity: 0.7 }}>
          <Typography variant="caption">Hussain Nazarnejad © {new Date().getFullYear()} Hippogriff Trade</Typography>
        </Box>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
