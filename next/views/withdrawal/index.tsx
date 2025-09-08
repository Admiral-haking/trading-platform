import React from 'react';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';

export default function WithdrawalView() {
  return (
    <Stack spacing={6} sx={{ py: 6, alignItems: 'center' }}>
      <Box sx={{ textAlign: 'center', width: '100%' }}>
        <Typography variant="overline" color="primary" sx={{ letterSpacing: 3 }}>FUNDS</Typography>
        <Typography variant="h3" sx={{ mt: 1, fontWeight: 800 }}>Withdrawal</Typography>
        <Typography sx={{ mt: 2, opacity: 0.8, maxWidth: 700, mx: 'auto' }}>
          Coming soon: request withdrawals and view history.
        </Typography>
      </Box>
      <Box sx={{ maxWidth: 520, width: '100%' }}>
        <Card>
          <CardContent>
            <Typography variant="body2">Withdrawal management will be available here.</Typography>
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );
}

