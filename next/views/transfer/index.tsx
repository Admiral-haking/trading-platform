import React from 'react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import TransferForm from './components/TransferForm';

export default function TransferView() {
  return (
    <Stack spacing={6} sx={{ py: 2 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="overline" color="primary" sx={{ letterSpacing: 3 }}>FUNDS</Typography>
        <Typography variant="h3" sx={{ mt: 1, fontWeight: 800 }}>Transfer</Typography>
        <Typography sx={{ mt: 2, opacity: 0.8, maxWidth: 700, mx: 'auto' }}>
          Move funds between your internal accounts. Choose source, destination, asset, and amount.
        </Typography>
      </Box>

      <Grid container>
        <Grid item xs={12} md={6}>
          <TransferForm />
        </Grid>
      </Grid>
    </Stack>
  );
}

