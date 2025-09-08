import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, CircularProgress, Stack, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import api from '../../../utils/axios';
import useInterval from '../../../hooks/useInterval';
import type { TelegramQr, TelegramCheck } from '../../../types/telegram';

// Lazy-load QR component (install: react-qr-code)
const QRCode = dynamic(() => import('qrcode.react').then(res => res.QRCodeCanvas), { ssr: false, loading: () => null });

type Props = {
  onNeedPassword: () => void;
  onAuthed: () => void;
};

export default function QrSection({ onNeedPassword, onAuthed }: Props) {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [qrLoading, setQrLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  const recreateQr = useCallback(async () => {
    try {
      await api.post('/telegram/create-qr-code');
      // reset current url so loader appears until new QR is ready
      setQrUrl('');
    } catch { }
    setQrLoading(false);
  }, []);

  // Create QR session on mount
  useEffect(() => {
    let active = true;
    (async () => {
      await recreateQr();
      if (!active) return;
    })();
    return () => { active = false; };
  }, [recreateQr]);

  // Poll for QR url until available
  useInterval(async () => {
    try {
      const res = await api.get<TelegramQr>('/telegram/get-qr-code');
      if (res.data?.url) setQrUrl(res.data.url);
    } catch { }
  }, qrUrl ? null : 1200);

  // After QR is rendered, poll telegram/check for status
  useInterval(async () => {
    setChecking(true);
    try {
      const res = await api.get<TelegramCheck>('/telegram/check');
      const { isAuth, needPassword } = res.data || {};
      if (isAuth) {
        onAuthed();
      } else if (needPassword) {
        onNeedPassword();
      }
    } catch { }
    setChecking(false);
  }, qrUrl ? 1500 : null);

  // Refresh QR every 30 seconds
  useInterval(() => {
    recreateQr();
  }, 30000);

  const loadingState = qrLoading || !qrUrl;

  return (
    <Card>
      <CardContent>
        <Stack spacing={2} alignItems="center" textAlign="center">
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Connect Telegram</Typography>
          <Typography sx={{ opacity: 0.8 }}>
            Scan the QR with your Telegram app to authorize.
          </Typography>
          {loadingState ? (
            <Box sx={{ py: 4 }}>
              <CircularProgress />
              <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>Generating QR code…</Typography>
            </Box>
          ) : (
            <Box sx={{ p: 3, borderRadius: 2, bgcolor: 'background.default' }}>
              {/* @ts-ignore third-party component types */}
              <QRCode value={qrUrl} size={256} level='M' includeMargin />

              <Button
                variant='text'
                LinkComponent="a"
                href={qrUrl}
                target='_blank'
                sx={{ display: 'block', my: 2 }}
              >Open in Telegram App</Button>
            </Box>
          )}
          {!loadingState && (
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              Waiting for confirmation… {checking ? '⏳' : ''}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
