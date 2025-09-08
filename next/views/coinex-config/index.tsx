import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import api from '../../utils/axios';
import type { AuthInit } from '../../types/auth';
import CoinexConfigForm, { CoinexConfigValues } from './components/CoinexConfigForm';

export default function CoinexConfigView() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [defaults, setDefaults] = useState<Partial<CoinexConfigValues>>({});

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await api.get<AuthInit>('/auth/init');
        const cfg = res.data?.configs || {};
        const current: Partial<CoinexConfigValues> = {
          CoinexAccessId: cfg.CoinexAccessId || '',
          CoinexSecretKey: cfg.CoinexSecretKey || '',
          workingCapitalPercentage: cfg.workingCapitalPercentage ? Number(cfg.workingCapitalPercentage) : undefined,
          eachTradePercentage: cfg.eachTradePercentage ? Number(cfg.eachTradePercentage) : undefined,
          strategy: cfg.strategy as any,
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
        <Typography variant="overline" color="primary" sx={{ letterSpacing: 3 }}>CONFIGURATION</Typography>
        <Typography variant="h3" sx={{ mt: 1, fontWeight: 800 }}>CoinEx Setup</Typography>
        <Typography sx={{ mt: 2, opacity: 0.8, maxWidth: 700, mx: 'auto' }}>
          Provide your CoinEx API credentials and strategy preferences.
        </Typography>
      </Box>

      <Box sx={{ maxWidth: 520, width: '100%' }}>
        <Card>
          <CardContent>
            <CoinexConfigForm defaults={defaults} onDone={() => router.replace('/check')} />
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );
}

