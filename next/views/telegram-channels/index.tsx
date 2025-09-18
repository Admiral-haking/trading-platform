import React, { useEffect, useMemo, useState } from 'react';
import { Box, Card, CardContent, Checkbox, CircularProgress, Divider, FormControlLabel, List, ListItem, ListItemIcon, ListItemText, Paper, Stack, Typography } from '@mui/material';
import api from '../../utils/axios';

type Channel = { id: string; title: string; selected: boolean };

export default function TelegramChannelsView() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Channel[]>('/telegram/list');
      // selected at top
      const sorted = [...res.data]
      setChannels(sorted);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load channels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const selectedIds = useMemo(() => channels.filter(c => c.selected).map(c => c.id), [channels.length]);

  const toggle = (id: string) => {
    setChannels((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c));
      // Re-sort with selected on top
      (async () => {
        try {
          setSaving(true);
          await api.post('/telegram/save', next.filter(x => x.selected).map(x => x.id));
        } catch (e) {
          // ignore; UI remains optimistic
        } finally {
          setSaving(false);
        }
      })()
      return [...next];
    });
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="overline" color="primary" sx={{ letterSpacing: 3 }}>TELEGRAM</Typography>
        <Typography variant="h4" sx={{ mt: 1, fontWeight: 800 }}>Signal Channels</Typography>
        <Typography variant="body2" sx={{ opacity: 0.75, mt: 0.5 }}>
          Select which Telegram channels to receive signals from. Selected channels are pinned to the top.
        </Typography>
      </Box>

      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <CircularProgress />
              <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>Loading channels…</Typography>
            </Box>
          ) : (
            <List>
              {channels.map((c) => (
                <React.Fragment key={c.id}>
                  <ListItem secondaryAction={<FormControlLabel control={<Checkbox checked={c.selected} onChange={() => toggle(c.id)} />} label={c.selected ? 'Selected' : 'Hidden'} />}>
                    <ListItemText
                      primary={<Typography sx={{ fontWeight: 600 }}>{c.title}</Typography>}
                      secondary={<Typography color="primary" variant="caption" sx={{ fontWeight: 600 }}>{c.id}</Typography>}
                    />
                  </ListItem>
                  <Divider component="li" sx={{ opacity: 0.12 }} />
                </React.Fragment>
              ))}
            </List>
          )}
          {error && <Typography color="error" variant="body2" sx={{ mt: 2 }}>{error}</Typography>}
          {saving && !loading && (
            <Typography variant="caption" sx={{ mt: 1, display: 'block', opacity: 0.7 }}>Saving…</Typography>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}

