import React from 'react';
import { Box, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import AccountForm from './components/AccountForm';
import AboutUs from './components/AboutUs';

export default function AboutView() {
  return (
    <Stack gap={6} sx={{ py: 6, alignItems: 'center' }}>
      <Box sx={{ textAlign: 'center', width: '100%' }}>
        <Typography variant="overline" color="primary" sx={{ letterSpacing: 3 }}>INFORMATION</Typography>
        <Typography variant="h3" sx={{ mt: 1, fontWeight: 800 }}>About Me</Typography>
        <Typography sx={{ mt: 2, opacity: 0.8, maxWidth: 700, mx: 'auto' }}>
          Project details, credits, and contact information.
        </Typography>
      </Box>
      <Grid container sx={{ width: '100%', maxWidth: 900 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <AccountForm />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <AboutUs />
        </Grid>
      </Grid>
    </Stack>
  );
}
