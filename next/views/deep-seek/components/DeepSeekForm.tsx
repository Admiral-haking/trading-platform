import React from 'react';
import { Alert, Box, Button, Snackbar, Stack, Typography } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../../../utils/axios';
import { RHFTextField } from '../../../components/hook-form';

const schema = z.object({
  deepSeekApiKey: z.string().min(1, 'API key is required'),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  defaultValue?: string;
  onDone: () => void;
};

export default function DeepSeekForm({ defaultValue = '', onDone }: Props) {
  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { deepSeekApiKey: defaultValue },
  });

  const [testing, setTesting] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [testedOk, setTestedOk] = React.useState(false);
  const [successOpen, setSuccessOpen] = React.useState(false);

  const testKey = async (key: string) => {
    setError(null);
    setTesting(true);
    try {
      const res = await fetch('https://api.deepseek.com/v1/models', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${key}`,
        },
        mode: 'cors',
      });
      if (res.ok) {
        setTestedOk(true);
        return true;
      }
      let msg = `DeepSeek API error (${res.status})`;
      try {
        const data = await res.json();
        msg = data?.error?.message || data?.message || msg;
      } catch {}
      setTestedOk(false);
      setError(msg);
      return false;
    } catch (e) {
      setTestedOk(false);
      setError('Unable to reach DeepSeek API (network/CORS)');
      return false;
    } finally {
      setTesting(false);
    }
  };

  const onSubmit = methods.handleSubmit(async (values) => {
    setError(null);
    // 1) Test the key first
    const ok = await testKey(values.deepSeekApiKey);
    if (!ok) return;

    // 2) Save the config
    setSaving(true);
    try {
      await api.put('/auth/init', { deepSeekApiKey: values.deepSeekApiKey });
      setSuccessOpen(true);
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
          <Typography variant="h6" sx={{ fontWeight: 700 }}>DeepSeek API Key</Typography>
          {Object.keys(methods.formState.errors).length > 0 && (
            <Alert severity="error" variant="outlined">
              {Object.values(methods.formState.errors).map((e: any, idx) => (
                <div key={idx}>{e?.message}</div>
              ))}
            </Alert>
          )}
          <Typography sx={{ opacity: 0.8 }}>
            Enter your DeepSeek API key. It will be validated before saving.
          </Typography>
          <RHFTextField name="deepSeekApiKey" label="DeepSeek API Key" fullWidth />
          {error && <Typography color="error" variant="body2">{error}</Typography>}
          <Stack direction="row" spacing={2}>
            <Button type="button" variant="outlined" disabled={testing} onClick={methods.handleSubmit(async ({ deepSeekApiKey }) => { await testKey(deepSeekApiKey); })}>
              {testing ? 'Testing…' : testedOk ? 'Retest' : 'Test'}
            </Button>
            <Button type="submit" variant="contained" disabled={saving || testing}>
              {saving ? 'Saving…' : 'Save & Continue'}
            </Button>
          </Stack>
        </Stack>
        <Snackbar open={successOpen} autoHideDuration={2500} onClose={() => setSuccessOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert elevation={6} variant="filled" severity="success" sx={{ width: '100%' }}>
            DeepSeek key saved successfully.
          </Alert>
        </Snackbar>
      </Box>
    </FormProvider>
  );
}
