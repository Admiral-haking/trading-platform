import React from 'react';
import { Chip, Divider, Grid, Stack, Typography, } from '@mui/material';
import type { Markets, Signal, SignalState } from '../../../types/coinex';
import SignalCard from '../../signals/components/SignalCard';

type Props = { signals: Signal[], markets: Markets };

const states: SignalState[] = ['pending', 'order placed', 'filled', 'finished'];

function fmt(n: number) {
  const d = Math.abs(n) < 1 ? 4 : 2;
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: d }).format(n);
}

export default function SignalsByState({ signals, markets }: Props) {
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
    <Stack gap={3}>
      {states.map((st) => (
        <Stack key={st} gap={1.5}>
          <Stack direction="row" alignItems="center" gap={1}>
            <Typography variant="h6" sx={{ fontWeight: 700, textTransform: 'capitalize' }}>{st}</Typography>
            <Chip label={(grouped[st] || []).length} size="small" />
          </Stack>
          <Grid container spacing={1.5}>
            {(grouped[st] || []).map((s) => (
              <Grid key={s.messageId} item xs={12} md={6}>
                <SignalCard s={s} markets={markets} />
              </Grid>
            ))}
          </Grid>
          <Divider sx={{ opacity: 0.2 }} />
        </Stack>
      ))}
    </Stack>
  );
}
