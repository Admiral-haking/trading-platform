import React from 'react';
import { Box, Button, MenuItem, Stack, Typography, Alert } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../../../utils/axios';
import { RHFTextField, RHFSelect } from '../../../components/hook-form';

const schema = z.object({
  withdrawalDayOfWeek: z.coerce.number({ error: 'Select a day' }).int().min(0).max(6),
  withdrawalBase: z.coerce.number({ error: 'Enter a number' }).positive('Must be > 0'),
  withdrawalTakeProfitPercentage: z.coerce.number({ error: 'Enter a number' }).min(0, 'Must be >= 0').max(100, 'Max 100'),
  wallet: z.string().min(1, 'Wallet is required'),
});

export type TakeProfitConfigValues = z.infer<typeof schema>;

type Props = {
  defaults?: Partial<TakeProfitConfigValues>;
  onDone?: () => void;
};

const days = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export default function TakeProfitForm({ defaults, onDone }: Props) {
  const methods = useForm<TakeProfitConfigValues>({
    resolver: zodResolver(schema as any),
    defaultValues: {
      withdrawalDayOfWeek: 4,
      withdrawalBase: 500,
      withdrawalTakeProfitPercentage: 50,
      wallet: '',
      ...defaults,
    },
    mode: 'onChange',
  });

  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const onSubmit = methods.handleSubmit(async (values) => {
    setError(null);
    setSuccess(null);
    setSaving(true);
    try {
      await api.put('/auth/init', {
        withdrawalDayOfWeek: String(values.withdrawalDayOfWeek),
        withdrawalBase: String(values.withdrawalBase),
        withdrawalTakeProfitPercentage: String(values.withdrawalTakeProfitPercentage),
        wallet: values.wallet,
      });
      setSuccess('Saved successfully.');
      onDone?.();
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  });

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={onSubmit} noValidate>
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Take Profit Configuration</Typography>
          {success && <Alert severity="success" variant="outlined">{success}</Alert>}
          <RHFSelect name="withdrawalDayOfWeek" label="Weekly Payout Day (0-6)" fullWidth>
            {days.map((d) => (
              <MenuItem key={d.value} value={d.value}>{d.label} ({d.value})</MenuItem>
            ))}
          </RHFSelect>
          <RHFTextField name="withdrawalBase" label="Base Amount" type="number" inputProps={{ step: '0.01', min: '0' }} fullWidth />
          <RHFTextField name="withdrawalTakeProfitPercentage" label="Take Profit %" type="number" inputProps={{ step: '0.01', min: '0', max: '100' }} fullWidth />
          <RHFTextField name="wallet" label="Wallet Address" fullWidth />
          {error && <Typography color="error" variant="body2">{error}</Typography>}
          <Button type="submit" variant="contained" size="large" disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </Stack>
      </Box>
    </FormProvider>
  );
}
