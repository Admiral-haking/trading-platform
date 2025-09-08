import React, { useEffect, useMemo, useState } from 'react';
import { Box, Chip, Grid, Paper, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import api from '../../utils/axios';
import type { CoinexFullResponse, Signal, SignalState } from '../../types/coinex';
import SignalCard from './components/SignalCard';
import useInterval from '../../hooks/useInterval';
import { MOCK_SIGNALS } from '../dashboard/mocks';

const allStates: SignalState[] = ['pending', 'order placed', 'filled', 'finished'];

export default function SignalsView() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [filter, setFilter] = useState<SignalState | 'all'>('all');
  const [q, setQ] = useState('');
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await api.get<CoinexFullResponse>('/coinex/full');
      setSignals([...(res.data.signals || []), ...MOCK_SIGNALS]);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load signals');
    }
  };

  useEffect(() => { load(); }, []);
  useInterval(load, 2000);

  const filtered = useMemo(() => {
    let s = signals;
    if (filter !== 'all') s = s.filter((x) => x.state === filter);
    if (q) {
      const qq = q.toLowerCase();
      s = s.filter((x) => x.market.toLowerCase().includes(qq) || String(x.messageId).includes(qq));
    }
    return s;
  }, [signals, filter, q]);

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
      </Box>

      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between">
          <ToggleButtonGroup value={filter} exclusive onChange={(_, v) => v && setFilter(v)} size="small">
            <ToggleButton value="all">All <Chip label={counts.all} size="small" sx={{ ml: 1 }} /></ToggleButton>
            {allStates.map((st) => (
              <ToggleButton key={st} value={st}>
                {st} <Chip label={counts[st]} size="small" sx={{ ml: 1 }} />
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <TextField placeholder="Search market or messageId" value={q} onChange={(e) => setQ(e.target.value)} size="small" sx={{ minWidth: 260 }} />
        </Stack>
      </Paper>

      <Grid container spacing={2}>
        {filtered.map((s) => (
          <Grid key={`${s.messageId}-${s.state}`} item xs={12} md={6}>
            <SignalCard s={s} />
          </Grid>
        ))}
      </Grid>

      {error && <Typography color="error" variant="body2">{error}</Typography>}
    </Stack>
  );
}
