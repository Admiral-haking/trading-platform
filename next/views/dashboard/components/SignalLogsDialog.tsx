import React from 'react';
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, Typography } from '@mui/material';

type Log = { timestamp: number; message: string };

export default function SignalLogsDialog({ open, onClose, logs }: { open: boolean; onClose: () => void; logs: Log[] }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Signal Logs</DialogTitle>
      <DialogContent dividers>
        {(!logs || logs.length === 0) ? (
          <Typography variant="body2" sx={{ opacity: 0.7 }}>No logs yet.</Typography>
        ) : (
          <List>
            {logs.slice().reverse().map((l, idx) => (
              <ListItem key={idx} alignItems="flex-start" divider>
                <ListItemText
                  primary={new Date(l.timestamp).toLocaleString()}
                  secondary={<Typography variant="body2">{l.message}</Typography>}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
}

