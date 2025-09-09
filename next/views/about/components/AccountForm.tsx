import React from 'react';
import { Box, Button, Stack, Typography, Alert } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RHFTextField } from '../../../components/hook-form';
import api, { getToken, setToken } from '../../../utils/axios';

const schema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .regex(/^[a-zA-Z0-9]+$/, 'Alphanumeric only'),
  password: z.string().min(8, 'At least 8 characters'),
  confirm: z.string().min(8, 'At least 8 characters'),
}).refine((v) => v.password === v.confirm, {
  message: 'Passwords do not match',
  path: ['confirm'],
});

type FormValues = z.infer<typeof schema>;

export default function AccountForm() {
  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: '', password: '', confirm: '' },
    mode: 'onChange',
  });

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const onSubmit = methods.handleSubmit(async ({ username, password }) => {
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      const token = getToken();
      const res = await api.put<{ token: string }>(
        '/auth/login',
        { username, password },
        token ? { headers: { token } } : undefined
      );
      const newToken = res.data?.token;
      if (newToken) {
        setToken(newToken);
        setSuccess('Account updated. You are now signed in with the new credentials.');
        methods.reset({ username: '', password: '', confirm: '' });
      } else {
        setError('Invalid response from server');
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={onSubmit} noValidate>
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Update Account</Typography>
          {success && <Alert severity="success" variant="outlined">{success}</Alert>}
          <RHFTextField name="username" label="New Username" autoComplete="username" fullWidth />
          <RHFTextField name="password" type="password" label="New Password" autoComplete="new-password" fullWidth />
          <RHFTextField name="confirm" type="password" label="Confirm Password" autoComplete="new-password" fullWidth />
          {error && <Typography color="error" variant="body2">{error}</Typography>}
          <Button type="submit" variant="contained" size="large" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save Changes'}
          </Button>
        </Stack>
      </Box>
    </FormProvider>
  );
}

