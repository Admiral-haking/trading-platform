import React, { useCallback, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import QrSection from './components/QrSection';
import PasswordSection from './components/PasswordSection';

export default function LoginTelegramView() {
  const [needPassword, setNeedPassword] = useState(false);
  const router = useRouter();

  const handleAuthed = useCallback(() => {
    router.replace('/check');
  }, [router]);

  const handleNeedPassword = useCallback(() => setNeedPassword(true), []);

  return (
    <Stack spacing={6} sx={{ py: 6, alignItems: 'center' }}>
      <Box sx={{ textAlign: 'center', width: '100%' }}>
        <Typography variant="overline" color="primary" sx={{ letterSpacing: 3 }}>TELEGRAM</Typography>
        <Typography variant="h3" sx={{ mt: 1, fontWeight: 800 }}>Authorize with Telegram</Typography>
        <Typography sx={{ mt: 2, opacity: 0.8, maxWidth: 700, mx: 'auto' }}>
          Scan the QR code to login. If your account requires a password, you will be prompted afterwards.
        </Typography>
      </Box>

      <Box sx={{ maxWidth: 480, width: '100%' }}>
        {!needPassword ? (
          <QrSection onNeedPassword={handleNeedPassword} onAuthed={handleAuthed} />
        ) : (
          <PasswordSection onSuccess={handleAuthed} />
        )}
      </Box>
    </Stack>
  );
}

