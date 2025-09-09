import React from 'react';
import { Box, Button, MenuItem, Stack, Typography, Alert } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RHFTextField, RHFSelect } from '../../../components/hook-form';
import api from '../../../utils/axios';
import type { TransferRequest, TransferAccountType } from '../../../types/transfer';

const ACCOUNT_TYPES: TransferAccountType[] = ['SPOT', 'FUTURES'];
const PRIORITY_CCYS = ['USDT', 'BTC', 'TRX', 'ETH', 'NEAR'];

const schema = z.object({
  from_account_type: z.enum(['SPOT', 'FUTURES']),
  to_account_type: z.enum(['SPOT', 'FUTURES']),
  ccy: z.string().min(1, 'Choose an asset'),
  amount: z.string().refine((v) => {
    const n = Number(v);
    return Number.isFinite(n) && n > 0;
  }, 'Enter a valid amount > 0'),
}).refine((v) => v.from_account_type !== v.to_account_type, {
  message: 'From and To accounts must differ',
  path: ['to_account_type'],
});

type FormValues = z.infer<typeof schema>;

type Props = {
  onSuccess?: () => void;
};

export default function TransferForm({ onSuccess }: Props) {
  const methods = useForm<FormValues>({
    resolver: zodResolver(schema as any),
    defaultValues: { from_account_type: 'SPOT', to_account_type: 'FUTURES', ccy: 'USDT', amount: '' },
    mode: 'onChange',
  });

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const onSubmit = methods.handleSubmit(async (values) => {
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      const payload: TransferRequest = values;
      await api.post('/coinex/transfer', payload);
      setSuccess('Transfer submitted successfully.');
      onSuccess?.();
      methods.reset({ ...values, amount: '' });
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Transfer failed');
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={onSubmit} noValidate>
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Internal Transfer</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <RHFSelect name="from_account_type" label="From" fullWidth>
              {ACCOUNT_TYPES.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </RHFSelect>
            <RHFSelect name="to_account_type" label="To" fullWidth>
              {ACCOUNT_TYPES.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </RHFSelect>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <RHFSelect name="ccy" label="Asset" fullWidth>
              {PRIORITY_CCYS.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </RHFSelect>
            <RHFTextField name="amount" label="Amount" type="number" inputProps={{ step: '0.00000001', min: '0' }} fullWidth />
          </Stack>
          {error && <Alert severity="error" variant="outlined">{error}</Alert>}
          {success && <Alert severity="success" variant="outlined">{success}</Alert>}
          <Button type="submit" variant="contained" size="large" disabled={submitting}>
            {submitting ? 'Transferring…' : 'Transfer'}
          </Button>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Note: Transfers move funds between internal accounts (e.g., Spot ↔ Futures). Ensure the selected asset and amount are correct.
          </Typography>
        </Stack>
      </Box>
    </FormProvider>
  );
}

