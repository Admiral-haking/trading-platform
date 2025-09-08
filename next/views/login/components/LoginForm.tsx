import React, { useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { z } from 'zod';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RHFTextField } from '../../../components/hook-form';
import api, { setToken } from '../../../utils/axios';

const schema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .regex(/^[a-zA-Z0-9]+$/, 'Alphanumeric only'),
  password: z.string().min(8, 'At least 8 characters'),
});

type FormValues = z.infer<typeof schema>;

export default function LoginForm() {
  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: '', password: '' },
    mode: 'onChange',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = methods.handleSubmit(async (values) => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      const res = await api.post<{ token: string }>('/auth/login', values);
      const token = res.data?.token;
      if (token) {
        setToken(token);
        window.location.href = '/check';
      } else {
        setSubmitError('Invalid response from server');
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Login failed';
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={onSubmit} noValidate>
        <Stack spacing={2}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Sign in</Typography>
          <RHFTextField name="username" label="Username" autoComplete="username" fullWidth />
          <RHFTextField name="password" type="password" label="Password" autoComplete="current-password" fullWidth />
          {submitError && (
            <Typography color="error" variant="body2">{submitError}</Typography>
          )}
          <Button type="submit" variant="contained" size="large" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </Stack>
      </Box>
    </FormProvider>
  );
}
