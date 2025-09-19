import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Chip, Grid, Paper, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography, Pagination, Select, MenuItem, FormControl, InputLabel, FormControlLabel, Switch } from '@mui/material';
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

  const load = async () => {
    try {
      const res = await api.get<CoinexFullResponse>('/coinex/full');
      setSignals([...(res.data.signals || [])]);
      setMarkets(res.data.markets || {});
      setError(null);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load signals');
    }
  };

  useEffect(() => { load(); }, []);
  useInterval(load, 2000);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const notificationsSupported = 'Notification' in window;
    setPushSupported(notificationsSupported);
    if (!notificationsSupported) {
      setPushEnabled(false);
      setPushError('This browser does not support notifications.');
      return;
    }

    const isSecureContext = window.location.protocol === 'https:' || window.location.hostname === 'localhost';

    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setPushEnabled(false);
      setPushError('Push notifications require Service Worker support in this browser.');
      return;
    }

    if (!isSecureContext) {
      setPushEnabled(false);
      setPushError('Push notifications need HTTPS or localhost to operate.');
      return;
    }

    let cancelled = false;

    const enableAndSyncPush = async () => {
      try {
        setPushLoading(true);
        setPushError(null);

        if (Notification.permission === 'default') {
          await Notification.requestPermission();
        }

        if (Notification.permission !== 'granted') {
          setPushEnabled(false);
          setPushError('Notifications permission was not granted.');
          return;
        }

        const { data } = await api.get<{ publicKey: string | null }>('/notifications/public-key');
        const vapidPublicKey = data?.publicKey?.trim();
        if (!vapidPublicKey) {
          setPushEnabled(false);
          setPushError('Push notifications are not configured by the administrator.');
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
        if (!cancelled) {
          setPushEnabled(true);
          setPushError(null);
        }
      } catch (err: any) {
        if (!cancelled) {
          const message = err?.response?.data?.message ?? err?.message ?? 'Failed to enable notifications.';
          setPushEnabled(false);
          setPushError(message);
        }
      } finally {
        if (!cancelled) {
          setPushLoading(false);
        }
      }
    };

    enableAndSyncPush();

    return () => {
      cancelled = true;
    };
  }, []);

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
        {pushSupported && pushEnabled && (
          <Chip label="Notifications enabled" color="primary" variant="outlined" size="small" sx={{ mt: 1 }} />
        )}
        {pushSupported && !pushEnabled && !pushError && (
          <Typography variant="caption" sx={{ mt: 1, opacity: 0.7 }}>
            {pushLoading ? 'Enabling notifications…' : 'Allow notifications in the permission prompt to receive alerts.'}
          </Typography>
        )}
        {!pushSupported && (
          <Typography variant="caption" sx={{ mt: 1, opacity: 0.7 }}>
            Install the production build on a supported browser to receive push notifications.
          </Typography>
        )}
      </Box>

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

      {pushError && (
        <Alert severity="error" onClose={() => setPushError(null)}>{pushError}</Alert>
      )}

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
      )}

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
    </Stack>
  );
}
