import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Stack } from '@mui/material';
import Log from '../../signals/components/log';

type Log = { timestamp: number; message: string };

export default function SignalLogsDialog({ open, onClose, logs }: { open: boolean; onClose: () => void; logs: Log[] }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Signal Logs</DialogTitle>
      <DialogContent dividers>
        {(!logs || logs.length === 0) ? (
          <Typography variant="body2" sx={{ opacity: 0.7 }}>No logs yet.</Typography>
        ) : (
          <Stack gap={2}>
            {logs.slice().reverse().map((l) => <Log {...l} key={l.timestamp} />)}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}

