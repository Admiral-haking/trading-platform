import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import api from '../../utils/axios';
import type { AuthInit } from '../../types/auth';
import DeepSeekForm from './components/DeepSeekForm';

export default function DeepSeekView() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState<string>('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await api.get<AuthInit>('/auth/init');
        const key = res.data?.configs?.deepSeekApiKey || '';
        if (!active) return;
        if (key) {
          // Already configured; go back to check
          router.replace('/check');
          return;
        }
        setCurrent(key);
      } catch (e) {
        // ignore, show form
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [router]);

  if (loading) return null;

  return (
    <Stack spacing={6} sx={{ py: 6, alignItems: 'center' }}>
      <Box sx={{ textAlign: 'center', width: '100%' }}>
        <Typography variant="overline" color="primary" sx={{ letterSpacing: 3 }}>CONFIGURATION</Typography>
        <Typography variant="h3" sx={{ mt: 1, fontWeight: 800 }}>DeepSeek Setup</Typography>
        <Typography sx={{ mt: 2, opacity: 0.8, maxWidth: 700, mx: 'auto' }}>
          Provide your DeepSeek API key. It will be validated, then saved to your configuration.
        </Typography>
      </Box>

      <Box sx={{ maxWidth: 520, width: '100%' }}>
        <Card>
          <CardContent>
            <DeepSeekForm defaultValue={current} onDone={() => router.replace('/check')} />
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );
}

