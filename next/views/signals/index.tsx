import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, Chip, Grid, Paper, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography, Pagination, Select, MenuItem, FormControl, InputLabel, FormControlLabel, Switch } from '@mui/material';
import api from '../../utils/axios';
import type { CoinexFullResponse, Markets, Signal, SignalState } from '../../types/coinex';
import SignalCard from './components/SignalCard';
import useInterval from '../../hooks/useInterval';

const allStates: SignalState[] = ['pending', 'order placed', 'filled', 'cancelled', 'finished'];

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = typeof window === 'undefined' ? '' : window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function SignalsView() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [markets, setMarkets] = useState<Markets>({});
  const [filter, setFilter] = useState<SignalState | 'all'>('all');
  const [q, setQ] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [ignored, setIgnored] = useState(true);
  const [pushSupported, setPushSupported] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);
  const [pushError, setPushError] = useState<string | null>(null);

  const vapidPublicKey = process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY ?? '';
  const isProd = process.env.NODE_ENV === 'production';
  const notificationPermission = typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default';
  const permissionBlocked = pushSupported && notificationPermission === 'denied';

  const load = async () => {
    try {
      const res = await api.get<CoinexFullResponse>('/coinex/full');
      setSignals([...(res.data.signals || [])]);
      setMarkets(res.data.markets || {});
      setError("")
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load signals');
    }
  };

  useEffect(() => { load(); }, []);
  useInterval(load, 2000);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const supported = isProd && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
    setPushSupported(supported);
    if (!supported) return;

    let cancelled = false;

    const syncSubscription = async () => {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (cancelled) return;

        if (subscription) {
          setPushEnabled(Notification.permission === 'granted');
          if (Notification.permission === 'granted') {
            await api.post('/notifications/subscribe', { subscription });
          }
        } else {
          setPushEnabled(false);
        }
      } catch (err) {
        if (!cancelled) {
          console.warn('Unable to sync push subscription', err);
        }
      }
    };

    syncSubscription();

    return () => {
      cancelled = true;
    };
  }, [isProd]);

  const enablePushNotifications = async () => {
    if (!pushSupported) {
      setPushError('Notifications are not supported on this device.');
      return;
    }
    if (!vapidPublicKey) {
      setPushError('Push notifications are not configured.');
      return;
    }

    try {
      setPushLoading(true);
      setPushError(null);
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setPushError('Notifications permission was not granted.');
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        });
      }

      await api.post('/notifications/subscribe', { subscription });
      setPushEnabled(true);
    } catch (err: any) {
      setPushError(err?.message ?? 'Failed to enable notifications.');
    } finally {
      setPushLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let s = signals;
    if (ignored) s = s.filter(x => x.state !== 'cancelled')
    if (filter !== 'all') s = s.filter((x) => x.state === filter);
    if (q) {
      const qq = q.toLowerCase();
      s = s.filter((x) => x.market.toLowerCase().includes(qq) || String(x.messageId).includes(qq));
    }
    return s;
  }, [signals, filter, q, ignored]);

  // Reset to page 1 when filters/search change
  useEffect(() => { setPage(1); }, [filter, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: signals.length };
    for (const st of allStates) c[st] = signals.filter((x) => x.state === st).length;
    return c as Record<'all' | SignalState, number>;
  }, [signals]);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="overline" color="primary" sx={{ letterSpacing: 3 }}>SIGNALS</Typography>
        <Typography variant="h4" sx={{ mt: 1, fontWeight: 800 }}>Live Signals</Typography>
        <FormControlLabel
          control={<Switch checked={ignored} onChange={(e, v) => setIgnored(v)} />}
          label="Ignore Cancelled"
        />
        {pushSupported ? (
          pushEnabled ? (
            <Chip label="Notifications enabled" color="primary" variant="outlined" size="small" sx={{ mt: 1 }} />
          ) : (
            <>
              <Button
                variant="contained"
                size="small"
                sx={{ mt: 1 }}
                onClick={enablePushNotifications}
                disabled={pushLoading || !vapidPublicKey || permissionBlocked}
              >
                {pushLoading ? 'Enabling…' : 'Enable Notifications'}
              </Button>
              {permissionBlocked && (
                <Typography variant="caption" sx={{ mt: 0.5, display: 'block', opacity: 0.8 }}>
                  Notifications are blocked in your browser settings. Enable them to receive alerts.
                </Typography>
              )}
              {!vapidPublicKey && (
                <Typography variant="caption" sx={{ mt: 0.5, display: 'block', opacity: 0.8 }}>
                  Admin setup required: missing public push key.
                </Typography>
              )}
            </>
          )
        ) : (
          <Typography variant="caption" sx={{ mt: 1, opacity: 0.7 }}>
            Install the production build on a supported browser to receive push notifications.
          </Typography>
        )}
      </Box>

      {pushError && (
        <Alert severity="error" onClose={() => setPushError(null)}>{pushError}</Alert>
      )}

      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between">
          <ToggleButtonGroup value={filter} exclusive onChange={(_, v) => v && setFilter(v)} size="small" sx={{ display: { xs: 'block', md: 'inline-flex' } }}>
            <ToggleButton value="all">All <Chip label={counts.all} size="small" sx={{ ml: 1 }} /></ToggleButton>
            {allStates.map((st) => (
              <ToggleButton key={st} value={st}>
                {st} <Chip label={counts[st]} size="small" sx={{ ml: 1 }} />
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
            <TextField placeholder="Search market or messageId" value={q} onChange={(e) => setQ(e.target.value)} size="small" sx={{ minWidth: 260 }} />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="page-size-label">Per page</InputLabel>
              <Select labelId="page-size-label" label="Per page" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
                {[20, 50, 100].map((n) => (
                  <MenuItem key={n} value={n}>{n}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="caption" sx={{ opacity: 0.8 }}>{filtered.length.toLocaleString()} results</Typography>
          <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} size="small" color="primary" />
        </Stack>
      </Paper>

      <Grid container>
        {paged.map((s) => (
          <Grid key={`${s.messageId}-${s.state}`} item xs={12} md={6} sx={{ p: 1 }}>
            <SignalCard s={s} markets={markets} />
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Stack alignItems="center">
          <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" />
        </Stack>
      )}

      {error && <Typography color="error" variant="body2">{error}</Typography>}
    </Stack>
  );
}
