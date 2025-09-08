import React from 'react';
import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../../../utils/axios';
import { RHFTextField } from '../../../components/hook-form';

const schema = z.object({ password: z.string().min(1, 'Password is required') });

type FormValues = z.infer<typeof schema>;

type Props = { onSuccess: () => void };

export default function PasswordSection({ onSuccess }: Props) {
  const methods = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { password: '' } });
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = methods.handleSubmit(async (values) => {
    setError(null);
    setSubmitting(true);
    try {
      await api.post('/telegram/set-password', { password: values.password });
      onSuccess();
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to set password');
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Card>
      <CardContent>
        <FormProvider {...methods}>
          <Box component="form" onSubmit={onSubmit} noValidate>
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Enter Telegram Password</Typography>
              <Typography sx={{ opacity: 0.8 }}>
                Your account requires a password to complete authorization.
              </Typography>
              <RHFTextField name="password" type="password" label="Password" fullWidth />
              {error && <Typography color="error" variant="body2">{error}</Typography>}
              <Button type="submit" variant="contained" size="large" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit'}
              </Button>
            </Stack>
          </Box>
        </FormProvider>
      </CardContent>
    </Card>
  );
}

