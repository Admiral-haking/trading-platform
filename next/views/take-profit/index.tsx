import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import api from '../../utils/axios';
import type { AuthInit } from '../../types/auth';
import TakeProfitForm, { TakeProfitConfigValues } from './components/TakeProfitForm';

export default function TakeProfitView() {
  const [loading, setLoading] = useState(true);
  const [defaults, setDefaults] = useState<Partial<TakeProfitConfigValues>>({});

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await api.get<AuthInit>('/auth/init');
        const cfg = res.data?.configs || {};
        const current: Partial<TakeProfitConfigValues> = {
          withdrawalDayOfWeek: cfg.withdrawalDayOfWeek ? Number(cfg.withdrawalDayOfWeek) : undefined,
          withdrawalBase: cfg.withdrawalBase ? Number(cfg.withdrawalBase) : undefined,
          withdrawalTakeProfitPercentage: cfg.withdrawalTakeProfitPercentage ? Number(cfg.withdrawalTakeProfitPercentage) : undefined,
          wallet: cfg.wallet || '',
        };
        if (!active) return;
        setDefaults(current);
      } catch {}
      finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  if (loading) return null;

  return (
    <Stack spacing={6} sx={{ py: 6, alignItems: 'center' }}>
      <Box sx={{ textAlign: 'center', width: '100%' }}>
        <Typography variant="overline" color="primary" sx={{ letterSpacing: 3 }}>STRATEGY</Typography>
        <Typography variant="h3" sx={{ mt: 1, fontWeight: 800 }}>Take Profit</Typography>
        <Typography sx={{ mt: 2, opacity: 0.8, maxWidth: 700, mx: 'auto' }}>
          Configure automatic weekly take-profit payouts and wallet destination.
        </Typography>
      </Box>
      <Box sx={{ maxWidth: 520, width: '100%' }}>
        <Card>
          <CardContent>
            <TakeProfitForm defaults={defaults} />
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );
}
