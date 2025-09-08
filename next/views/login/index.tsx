import React from 'react';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import LoginForm from './components/LoginForm';

export default function LoginView() {
  return (
    <Stack spacing={6} sx={{ py: 6, alignItems: 'center' }}>
      <Box sx={{ textAlign: 'center', width: '100%' }}>
        <Typography variant="overline" color="primary" sx={{ letterSpacing: 3 }}>AUTHENTICATION</Typography>
        <Typography variant="h3" sx={{ mt: 1, fontWeight: 800 }}>Welcome back</Typography>
        <Typography sx={{ mt: 2, opacity: 0.8, maxWidth: 700, mx: 'auto' }}>
          Sign in to access your trading dashboard.
        </Typography>
      </Box>

      <Box sx={{ maxWidth: 420, width: '100%' }}>
        <Card>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );
}
