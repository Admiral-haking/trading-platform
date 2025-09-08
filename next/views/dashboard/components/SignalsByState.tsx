import React from 'react';
import { Card, CardContent, Chip, Divider, Grid, Stack, Typography, Button, IconButton, Tooltip } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import GppMaybeRoundedIcon from '@mui/icons-material/GppMaybeRounded';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import type { Signal, SignalState } from '../../../types/coinex';
import SignalLogsDialog from './SignalLogsDialog';
import api from '../../../utils/axios';

type Props = { signals: Signal[] };

const states: SignalState[] = ['pending', 'order placed', 'filled', 'finished'];

function fmt(n: number) {
  const d = Math.abs(n) < 1 ? 4 : 2;
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: d }).format(n);
}

function SignalItem({ s }: { s: Signal }) {
  const [open, setOpen] = React.useState(false);
  const [closing, setClosing] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const long = s.position === 'LONG';
  const posChip = (
    <Chip
      icon={long ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
      label={`${s.position} · x${s.leverage}`}
      size="small"
      sx={{
        color: long ? 'success.main' : 'error.main',
        borderColor: long ? 'success.main' : 'error.main',
        bgcolor: (t) => t.palette.mode === 'dark' ? 'transparent' : 'transparent',
        borderWidth: 1,
        borderStyle: 'solid',
        '& .MuiChip-icon': { color: long ? 'success.main' : 'error.main' },
        fontWeight: 700,
      }}
      variant="outlined"
    />
  );

  const pnl = s.realized_pnl || 0;
  const pnlColor = pnl > 0 ? 'success.main' : pnl < 0 ? 'error.main' : 'text.secondary';

  const tpSet = (s.takeProfit || []).length > 0;
  const slSet = typeof s.stopLoss === 'number' && s.stopLoss > 0;

  const stateColor = s.state === 'pending' ? 'warning' : s.state === 'filled' ? 'success' : s.state === 'order placed' ? 'info' : 'default';

  if (hidden) return null;

  return (
    <Card variant="outlined" sx={{
      background: (t) => t.palette.mode === 'dark'
        ? 'linear-gradient(180deg, rgba(0,229,168,0.05), rgba(124,77,255,0.04))'
        : 'linear-gradient(180deg, rgba(12,123,232,0.05), rgba(123,70,255,0.03))',
      borderRadius: 2,
    }}>
      <CardContent>
        <Stack spacing={1.25}>
          <Stack direction="row" alignItems="center" spacing={1.5} justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{s.market}</Typography>
              {posChip}
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Chip label={s.state} color={stateColor as any} size="small" />
              {s.sl_tp_done && (
                <Tooltip title="TP/SL configured">
                  <DoneAllRoundedIcon color="success" fontSize="small" />
                </Tooltip>
              )}
              <Tooltip title="View logs">
                <IconButton size="small" onClick={() => setOpen(true)}>
                  <ReceiptLongOutlinedIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between">
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Entry <b>{fmt(s.entry)}</b> · SL <b>{fmt(s.stopLoss)}</b> · TP <b>{s.takeProfit.map(fmt).join(', ')}</b>
            </Typography>
            <Typography variant="body2" sx={{ color: pnlColor, fontWeight: 700 }}>
              PnL: {pnl > 0 ? '+' : ''}{fmt(pnl)}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Chip icon={<TrendingUpRoundedIcon />} label={tpSet ? 'TP set' : 'TP missing'} size="small" color={tpSet ? 'success' : 'default'} variant={tpSet ? 'filled' : 'outlined'} />
            <Chip icon={<GppMaybeRoundedIcon />} label={slSet ? 'SL set' : 'SL missing'} size="small" color={slSet ? 'success' : 'warning'} variant={slSet ? 'filled' : 'outlined'} />
          </Stack>

          {!!s._id && (
            <Stack direction="row" justifyContent="flex-end">
              <Button
                onClick={async () => {
                  if (!s._id) return;
                  setClosing(true);
                  try {
                    await api.delete(`/coinex/close/${s._id}`);
                    setHidden(true);
                  } catch {
                    setClosing(false);
                  }
                }}
                disabled={closing}
                color="error"
                size="small"
                variant="contained"
              >
                {closing ? 'Closing…' : 'Close Position'}
              </Button>
            </Stack>
          )}
        </Stack>
      </CardContent>
      <SignalLogsDialog open={open} onClose={() => setOpen(false)} logs={s.logs || []} />
    </Card>
  );
}

export default function SignalsByState({ signals }: Props) {
  const grouped = React.useMemo(() => {
    const g: Record<string, Signal[]> = {};
    for (const s of signals) {
      if (s.state === 'cancelled') continue; // backend already filters, just in case
      const k = s.state;
      (g[k] ||= []).push(s);
    }
    return g;
  }, [signals]);

  return (
    <Stack spacing={3}>
      {states.map((st) => (
        <Stack key={st} spacing={1.5}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6" sx={{ fontWeight: 700, textTransform: 'capitalize' }}>{st}</Typography>
            <Chip label={(grouped[st] || []).length} size="small" />
          </Stack>
          <Grid container spacing={1.5}>
            {(grouped[st] || []).map((s) => (
              <Grid key={s.messageId} item xs={12} md={6}>
                <SignalItem s={s} />
              </Grid>
            ))}
          </Grid>
          <Divider sx={{ opacity: 0.2 }} />
        </Stack>
      ))}
    </Stack>
  );
}
