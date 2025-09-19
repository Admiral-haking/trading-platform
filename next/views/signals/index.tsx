import React, { useEffect, useMemo, useState } from 'react';
import { Box, Chip, Grid, Paper, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography, Pagination, Select, MenuItem, FormControl, InputLabel, FormControlLabel, Switch } from '@mui/material';
import api from '../../utils/axios';
import type { CoinexFullResponse, Markets, Signal, SignalState } from '../../types/coinex';
import SignalCard from './components/SignalCard';
import useInterval from '../../hooks/useInterval';

const allStates: SignalState[] = ['pending', 'order placed', 'filled', 'cancelled', 'finished'];

export default function SignalsView() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [markets, setMarkets] = useState<Markets>({});
  const [filter, setFilter] = useState<SignalState | 'all'>('all');
  const [q, setQ] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [ignored, setIgnored] = useState(true);
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
          <Stack direction="row" spacing={2} alignItems="center">
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

      <Grid container spacing={2}>
        {paged.map((s) => (
          <Grid key={`${s.messageId}-${s.state}`} item xs={12} md={6}>
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
