import React, { useState } from 'react';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import type { FollowerInput } from '../../../types/follower';

export default function FollowerForm({
  defaults,
  onSubmit,
  submitting,
}: {
  defaults?: Partial<FollowerInput>;
  onSubmit: (values: FollowerInput) => Promise<void> | void;
  submitting?: boolean;
}) {
  const [values, setValues] = useState<FollowerInput>({
    baseUrl: defaults?.baseUrl || '',
    name: defaults?.name || '',
    expire: typeof defaults?.expire === 'number' ? defaults!.expire : Date.now() + (1e3 * 60 * 60 * 24),
  });

  const handleChange = (key: keyof FollowerInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = key === 'expire' ? Number(e.target.value) : e.target.value;
    setValues((s) => ({ ...s, [key]: v } as FollowerInput));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      baseUrl: values.baseUrl.trim(),
      name: values.name.trim(),
      expire: Number(values.expire) || 0,
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Name"
            value={values.name}
            onChange={handleChange('name')}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Base URL"
            type="url"
            value={values.baseUrl}
            onChange={handleChange('baseUrl')}
            fullWidth
            required
            placeholder="https://example.com/webhook"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Expire (seconds)"
            type="number"
            inputProps={{ min: Date.now() + (1e3 * 60 * 60 * 24), step: 1e3 * 60 * 60 * 24 }}
            value={values.expire}
            onChange={handleChange('expire')}
            fullWidth
            required
          />
          <Typography variant='caption' color="text.secondary" sx={{ display: 'block', my: 2 }}>
            {new Date(values.expire).toLocaleString()}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit" disabled={!!submitting}>
            {submitting ? 'Saving…' : 'Save'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

