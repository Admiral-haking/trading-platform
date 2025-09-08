import React, { useEffect, useMemo, useState } from 'react';
import { Box, Paper, Stack, TextField, Typography } from '@mui/material';
import api from '../../utils/axios';
import MarketsTable from '../dashboard/components/MarketsTable';
import type { Markets } from '../../types/coinex';
import useInterval from '../../hooks/useInterval';

export default function MarketsView() {
  const [markets, setMarkets] = useState<Markets>({});
  const [q, setQ] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await api.get<{ markets: Markets }>("/coinex/full");
        if (!active) return;
        setMarkets(res.data.markets);
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Failed to load markets');
      }
    })();
    return () => { active = false; };
  }, []);

  // Poll every 1s for live updates
  useInterval(async () => {
    try {
      const res = await api.get<{ markets: Markets }>("/coinex/full");
      setMarkets(res.data.markets);
    } catch { }
  }, 1000);

  const filtered = useMemo(() => {
    if (!q) return markets;
    const m = Object.values(markets).filter((x) => x.market.toLowerCase().includes(q.toLowerCase())) as any[];
    const o: Markets = {} as any;
    m.forEach((x) => { (o as any)[x.market] = x; });
    return o;
  }, [markets, q]);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="overline" color="primary" sx={{ letterSpacing: 3 }}>MARKETS</Typography>
        <Typography variant="h4" sx={{ mt: 1, fontWeight: 800 }}>Browse Prices</Typography>
      </Box>
      <Paper sx={{ p: 2 }}>
        <TextField fullWidth placeholder="Search markets (e.g., BTCUSDT)" value={q} onChange={(e) => setQ(e.target.value)} />
      </Paper>
      <MarketsTable markets={filtered} />
      {error && <Typography color="error" variant="body2">{error}</Typography>}
    </Stack>
  );
}
