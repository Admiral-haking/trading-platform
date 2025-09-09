import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import api from '../../utils/axios';
import type { AuthInit } from '../../types/auth';
import DeepSeekForm from '../deep-seek/components/DeepSeekForm';
import CoinexConfigForm, { CoinexConfigValues } from '../coinex-config/components/CoinexConfigForm';
import WithdrawalConfigForm, { WithdrawalConfigValues } from '../withdrawal-config/components/WithdrawalConfigForm';

export default function ConfigsView() {
  const [loading, setLoading] = useState(true);
  const [deepSeekKey, setDeepSeekKey] = useState<string>('');
  const [coinexDefaults, setCoinexDefaults] = useState<Partial<CoinexConfigValues>>({});
  const [withdrawalDefaults, setWithdrawalDefaults] = useState<Partial<WithdrawalConfigValues>>({});

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await api.get<AuthInit>('/auth/init');
        const cfg = res.data?.configs || {};
        if (!active) return;
        setDeepSeekKey(cfg.deepSeekApiKey || '');
        setCoinexDefaults({
          CoinexAccessId: cfg.CoinexAccessId || '',
          CoinexSecretKey: cfg.CoinexSecretKey || '',
          workingCapitalPercentage: cfg.workingCapitalPercentage ? Number(cfg.workingCapitalPercentage) : undefined,
          eachTradePercentage: cfg.eachTradePercentage ? Number(cfg.eachTradePercentage) : undefined,
          strategy: (cfg.strategy as any) || 'fast-tp',
        });
        setWithdrawalDefaults({
          withdrawalDayOfWeek: cfg.withdrawalDayOfWeek ? Number(cfg.withdrawalDayOfWeek) : undefined,
          withdrawalBase: cfg.withdrawalBase ? Number(cfg.withdrawalBase) : undefined,
          withdrawalTakeProfitPercentage: cfg.withdrawalTakeProfitPercentage ? Number(cfg.withdrawalTakeProfitPercentage) : undefined,
          wallet: cfg.wallet || '',
        });
      } catch {}
      finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  if (loading) return null;

  return (
    <Stack spacing={6} sx={{ py: 2 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="overline" color="primary" sx={{ letterSpacing: 3 }}>CONFIGURATION</Typography>
        <Typography variant="h3" sx={{ mt: 1, fontWeight: 800 }}>Application Configs</Typography>
        <Typography sx={{ mt: 2, opacity: 0.8, maxWidth: 800, mx: 'auto' }}>
          Update any of your initial setup settings below.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <DeepSeekForm defaultValue={deepSeekKey} onDone={() => { /* keep on page */ }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <CoinexConfigForm defaults={coinexDefaults} onDone={() => { /* keep on page */ }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={12} lg={4}>
          <Card>
            <CardContent>
              <WithdrawalConfigForm defaults={withdrawalDefaults} onDone={() => { /* keep on page */ }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}

