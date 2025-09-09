import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import api from '../../utils/axios';
import type { MonitorItem } from '../../types/monitor';
import RequestsTable from './components/RequestsTable';
import useInterval from '../../hooks/useInterval';

export default function MonitorView() {
  const [rows, setRows] = React.useState<MonitorItem[] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    try {
      const res = await api.get<MonitorItem[]>('/coinex/monitor');
      setRows(res.data || []);
      setError(null);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load monitor');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  useInterval(load, 500);

  return (
    <Stack spacing={6} sx={{ py: 2 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="overline" color="primary" sx={{ letterSpacing: 3 }}>TOOLS</Typography>
        <Typography variant="h3" sx={{ mt: 1, fontWeight: 800 }}>CoinEx Monitor</Typography>
        <Typography sx={{ mt: 2, opacity: 0.8, maxWidth: 700, mx: 'auto' }}>
          Live view of queued CoinEx API requests. Updates every 0.5s.
        </Typography>
      </Box>

      <RequestsTable rows={rows} loading={loading} error={error} />
    </Stack>
  );
}

