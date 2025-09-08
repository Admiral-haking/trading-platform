import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../utils/axios';
import { Box, LinearProgress, Typography } from '@mui/material';

export default function CheckPage() {
  const router = useRouter();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        // 1) Ensure Telegram is authenticated
        const tg = await api.get<{ isAuth?: boolean }>("/telegram/check");
        const isAuth = Boolean(tg.data?.isAuth);
        if (!active) return;
        if (!isAuth) {
          router.replace('/login-telegram');
          return;
        }

        // 2) Ensure deepSeekApiKey exists and CoinEx config is complete
        const init = await api.get<{ user: any; configs: Record<string, string> }>("/auth/init");
        const cfg = init.data?.configs || {};
        const hasDeepseek = Boolean(cfg.deepSeekApiKey);
        if (!hasDeepseek) {
          router.replace('/deep-seek');
          return;
        }

        const requiredCoinexKeys = ['CoinexAccessId', 'CoinexSecretKey', 'workingCapitalPercentage', 'eachTradePercentage', 'strategy'] as const;
        const missingCoinex = requiredCoinexKeys.some((k) => !cfg[k]);
        const validStrategy = cfg.strategy === 'fast-tp' || cfg.strategy === 'risk-free';
        if (missingCoinex || !validStrategy) {
          router.replace('/coinex-config');
          return;
        }

        // 3) Ensure withdrawal config exists and is valid
        const requiredWithdrawalKeys = ['withdrawalDayOfWeek', 'withdrawalBase', 'withdrawalTakeProfitPercentage', 'wallet'] as const;
        const missingWithdrawal = requiredWithdrawalKeys.some((k) => !cfg[k]);
        const day = Number(cfg.withdrawalDayOfWeek);
        const validDay = Number.isFinite(day) && day >= 0 && day <= 6;
        if (missingWithdrawal || !validDay) {
          router.replace('/withdrawal-config');
          return;
        }

        // 4) All checks passed. Go to dashboard
        router.replace('/dashboard');
      } catch (e) {
        // If check fails, send to telegram login flow as a safe default
        if (active) router.replace('/login-telegram');
      }
    })();
    return () => { active = false; };
  }, [router]);

  return <Box sx={{
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: "center",
    justifyContent: "center",
    flexDirection: 'column'
  }}>
    <Typography variant='caption' color="primary.main">Hippogriff Software Brings ❤️ To Life.</Typography>
    <Typography variant='h4'>Wait Until We Check Configs</Typography>
    <LinearProgress sx={{ width: 200, mt: 2 }} />
  </Box>;
}
