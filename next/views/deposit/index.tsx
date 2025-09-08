import React from 'react';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';

export default function DepositView() {
  return (
    <Stack spacing={6} sx={{ py: 6, alignItems: 'center' }}>
      <Box sx={{ textAlign: 'center', width: '100%' }}>
        <Typography variant="overline" color="primary" sx={{ letterSpacing: 3 }}>FUNDS</Typography>
        <Typography variant="h3" sx={{ mt: 1, fontWeight: 800 }}>Deposit</Typography>
        <Typography sx={{ mt: 2, opacity: 0.8, maxWidth: 700, mx: 'auto' }}>
          Coming soon: deposit options and on-chain instructions.
        </Typography>
      </Box>
      <Box sx={{ maxWidth: 520, width: '100%' }}>
        <Card>
          <CardContent>
            <Typography variant="body2">This section will allow you to fund your account.</Typography>
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );
}

