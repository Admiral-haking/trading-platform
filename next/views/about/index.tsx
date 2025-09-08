import React from 'react';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';

export default function AboutView() {
  return (
    <Stack spacing={6} sx={{ py: 6, alignItems: 'center' }}>
      <Box sx={{ textAlign: 'center', width: '100%' }}>
        <Typography variant="overline" color="primary" sx={{ letterSpacing: 3 }}>INFORMATION</Typography>
        <Typography variant="h3" sx={{ mt: 1, fontWeight: 800 }}>About Me</Typography>
        <Typography sx={{ mt: 2, opacity: 0.8, maxWidth: 700, mx: 'auto' }}>
          Project details, credits, and contact information.
        </Typography>
      </Box>
      <Box sx={{ maxWidth: 720, width: '100%' }}>
        <Card>
          <CardContent>
            <Typography variant="body2">
              This personal trading platform integrates Telegram signals, CoinEx trading, and configurable strategies.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );
}

