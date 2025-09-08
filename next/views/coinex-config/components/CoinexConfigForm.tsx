import React from 'react';
import { Box, Button, MenuItem, Stack, Typography } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../../../utils/axios';
import { RHFTextField, RHFSelect } from '../../../components/hook-form';

const schema = z.object({
  CoinexAccessId: z.string().min(1, 'Access ID is required'),
  CoinexSecretKey: z.string().min(1, 'Secret Key is required'),
  workingCapitalPercentage: z.coerce.number({ error: 'Enter a number' }).min(0.01, 'Must be > 0').max(100, 'Max 100'),
  eachTradePercentage: z.coerce.number({ error: 'Enter a number' }).min(0.01, 'Must be > 0').max(100, 'Max 100'),
  strategy: z.enum(['fast-tp', 'risk-free'], { error: 'Select a strategy' }),
});

export type CoinexConfigValues = z.infer<typeof schema>;

type Props = {
  defaults?: Partial<CoinexConfigValues>;
  onDone: () => void;
};

export default function CoinexConfigForm({ defaults, onDone }: Props) {
  const methods = useForm<CoinexConfigValues>({
    resolver: zodResolver(schema as any),
    defaultValues: {
      CoinexAccessId: '',
      CoinexSecretKey: '',
      workingCapitalPercentage: 10,
      eachTradePercentage: 1,
      strategy: 'fast-tp',
      ...defaults,
    },
    mode: 'onChange',
  });

  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = methods.handleSubmit(async (values) => {
    setError(null);
    setSaving(true);
    try {
      await api.put('/auth/init', values);
      onDone();
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
          <Typography variant="h6" sx={{ fontWeight: 700 }}>CoinEx Configuration</Typography>
          <RHFTextField name="CoinexAccessId" label="Access ID" fullWidth />
          <RHFTextField name="CoinexSecretKey" label="Secret Key" fullWidth />
          <RHFTextField name="workingCapitalPercentage" label="Working Capital %" type="number" inputProps={{ step: '0.01', min: '0', max: '100' }} fullWidth />
          <RHFTextField name="eachTradePercentage" label="Each Trade %" type="number" inputProps={{ step: '0.01', min: '0', max: '100' }} fullWidth />
          <RHFSelect name="strategy" label="Strategy" fullWidth>
            <MenuItem value="fast-tp">fast-tp</MenuItem>
            <MenuItem value="risk-free">risk-free</MenuItem>
          </RHFSelect>
          {error && <Typography color="error" variant="body2">{error}</Typography>}
          <Button type="submit" variant="contained" size="large" disabled={saving}>
            {saving ? 'Saving…' : 'Save & Continue'}
          </Button>
        </Stack>
      </Box>
    </FormProvider>
  );
}

