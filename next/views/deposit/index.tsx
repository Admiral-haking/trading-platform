import React from 'react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import api from '../../utils/axios';
import type { ChainAddresses, DepositRecord } from '../../types/deposit';
import CurrencyPicker from './components/CurrencyPicker';
import ChainAddressList from './components/ChainAddressList';
import DepositHistoryTable from './components/DepositHistoryTable';

export default function DepositView() {
  const [ccy, setCcy] = React.useState<string>('USDT');

  const [addr, setAddr] = React.useState<ChainAddresses | null>(null);
  const [addrLoading, setAddrLoading] = React.useState(false);
  const [addrError, setAddrError] = React.useState<string | null>(null);

  const [history, setHistory] = React.useState<DepositRecord[] | null>(null);
  const [historyLoading, setHistoryLoading] = React.useState(false);
  const [historyError, setHistoryError] = React.useState<string | null>(null);

  const loadAddresses = React.useCallback(async (asset: string) => {
    setAddr(null);
    setAddrError(null);
    setAddrLoading(true);
    try {
      const res = await api.get<ChainAddresses>(`/coinex/deposit/address/${asset}`);
      setAddr(res.data || {});
    } catch (e: any) {
      setAddrError(e?.response?.data?.message || 'Failed to load addresses');
    } finally {
      setAddrLoading(false);
    }
  }, []);

  const loadHistory = React.useCallback(async () => {
    setHistoryError(null);
    setHistoryLoading(true);
    try {
      const res = await api.get<DepositRecord[]>(`/coinex/deposit/history`);
      setHistory(res.data || []);
    } catch (e: any) {
      setHistoryError(e?.response?.data?.message || 'Failed to load history');
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadAddresses(ccy);
  }, [ccy, loadAddresses]);

  React.useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return (
    <Stack spacing={6} sx={{ py: 2 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="overline" color="primary" sx={{ letterSpacing: 3 }}>FUNDS</Typography>
        <Typography variant="h3" sx={{ mt: 1, fontWeight: 800 }}>Deposit</Typography>
        <Typography sx={{ mt: 2, opacity: 0.8, maxWidth: 700, mx: 'auto' }}>
          Select an asset to view deposit addresses by chain. Only send the selected asset on the displayed chain to avoid loss of funds.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Stack spacing={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Asset</Typography>
            <CurrencyPicker value={ccy} onChange={setCcy} />
            <ChainAddressList ccy={ccy} addresses={addr} loading={addrLoading} error={addrError} />
          </Stack>
        </Grid>
        <Grid item xs={12} md={7}>
          <Stack spacing={2}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Deposit History</Typography>
            <DepositHistoryTable rows={history} loading={historyLoading} error={historyError} />
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}
