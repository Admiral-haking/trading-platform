import React from 'react';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';

export default function TakeProfitView() {
  return (
    <Stack spacing={6} sx={{ py: 6, alignItems: 'center' }}>
      <Box sx={{ textAlign: 'center', width: '100%' }}>
        <Typography variant="overline" color="primary" sx={{ letterSpacing: 3 }}>STRATEGY</Typography>
        <Typography variant="h3" sx={{ mt: 1, fontWeight: 800 }}>Take Profit</Typography>
        <Typography sx={{ mt: 2, opacity: 0.8, maxWidth: 700, mx: 'auto' }}>
          Configure take profit strategies and presets. Coming soon.
        </Typography>
      </Box>
      <Box sx={{ maxWidth: 520, width: '100%' }}>
        <Card>
          <CardContent>
            <Typography variant="body2">You will manage TP levels and templates here.</Typography>
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );
}

