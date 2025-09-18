import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import api from '../../utils/axios';
import type { CoinexFullResponse } from '../../types/coinex';
import SummaryCards from './components/SummaryCards';
import AssetsTable from './components/AssetsTable';
import SignalsByState from './components/SignalsByState';
import { MOCK_SIGNALS } from './mocks';
import useInterval from '../../hooks/useInterval';

export default function DashboardView() {
  const [data, setData] = useState<CoinexFullResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await api.get<CoinexFullResponse>('/coinex/full');
        if (!active) return;
        setData({ ...res.data, signals: [...res.data.signals, ...MOCK_SIGNALS] });
      } catch (e: any) {
        if (!active) return;
        setError(e?.response?.data?.message || 'Failed to load data');
      }
    })();
    return () => { active = false; };
  }, []);

  // Poll every 1s for live updates
  useInterval(async () => {
    try {
      const res = await api.get<CoinexFullResponse>('/coinex/full');
      setData({ ...res.data, signals: [...res.data.signals, ...MOCK_SIGNALS] });
    } catch { }
  }, 2000);

  if (!data) return null;

  return (
    <Stack spacing={6} sx={{ py: 2 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="overline" color="primary" sx={{ letterSpacing: 3 }}>DASHBOARD</Typography>
        <Typography variant="h3" sx={{ mt: 1, fontWeight: 800 }}>Overview</Typography>
        {error && <Typography color="error" variant="body2" sx={{ mt: 1 }}>{error}</Typography>}
      </Box>

      <SummaryCards
        spotAvailableUSDT={data.spotAvailableUSDT}
        spotFrozenUSDT={data.spotFrozenUSDT}
        featuresAvailableUSDT={data.featuresAvailableUSDT}
        featuresFrozenUSDT={data.featuresFrozenUSDT}
      />

      <Stack spacing={2}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Spot Assets (USDT Value)</Typography>
        <AssetsTable data={data} />
      </Stack>

      <Stack spacing={2}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Signals</Typography>
        <SignalsByState signals={data.signals} markets={data.markets} />
      </Stack>
    </Stack>
  );
}
