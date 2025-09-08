import React from 'react';
import { Card, CardContent, Grid, Typography } from '@mui/material';

type Props = {
  spotAvailableUSDT: number;
  spotFrozenUSDT: number;
  featuresAvailableUSDT: number;
  featuresFrozenUSDT: number;
};

function Stat({ label, value, color = 'success.main' as any }: { label: string; value: string | number; color?: any }) {
  return (
    <Card sx={{ height: '100%', background: (t) => t.palette.mode === 'dark' ? 'linear-gradient(180deg, rgba(0,229,168,0.08), rgba(124,77,255,0.05))' : 'linear-gradient(180deg, rgba(12,123,232,0.06), rgba(123,70,255,0.04))' }}>
      <CardContent>
        <Typography variant="overline" sx={{ opacity: 0.8 }}>{label}</Typography>
        <Typography variant="h5" sx={{ color, fontWeight: 800 }}>{value}</Typography>
      </CardContent>
    </Card>
  );
}

export default function SummaryCards({ spotAvailableUSDT, spotFrozenUSDT, featuresAvailableUSDT, featuresFrozenUSDT }: Props) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}><Stat label="Spot USDT" value={spotAvailableUSDT.toFixed(2)} /></Grid>
      <Grid item xs={12} sm={6} md={3}><Stat label="Spot Frozen" value={spotFrozenUSDT.toFixed(2)} color="info.main" /></Grid>
      <Grid item xs={12} sm={6} md={3}><Stat label="Futures USDT" value={featuresAvailableUSDT.toFixed(2)} /></Grid>
      <Grid item xs={12} sm={6} md={3}><Stat label="Futures Frozen" value={featuresFrozenUSDT.toFixed(2)} color="info.main" /></Grid>
    </Grid>
  );
}

