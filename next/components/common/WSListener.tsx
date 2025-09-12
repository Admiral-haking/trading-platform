import React from 'react';
import { Alert, Snackbar } from '@mui/material';

type Event = { type: string; payload?: any };

function eventToMessage(e: Event): { severity: 'success' | 'info' | 'warning' | 'error'; text: string } | null {
  switch (e.type) {
    case 'signal:new':
      return { severity: 'info', text: `New signal: ${e?.payload?.market} ${e?.payload?.position} @ ${e?.payload?.entry}` };
    case 'signal:update':
      return { severity: 'info', text: `Signal updated: ${e?.payload?.market || e?.payload?._id}` };
    case 'signal:delete':
      return { severity: 'warning', text: `Signal deleted: ${e?.payload?.messageId}` };
    case 'signal:exit':
      return { severity: 'info', text: `Exit signal received.` };
    case 'signal:state':
      return { severity: 'success', text: `Order placed for ${e?.payload?.market}` };
    case 'signal:error':
      return { severity: 'error', text: `Signal error: ${e?.payload?.message || 'Unknown'}` };
    case 'position:sl_moved':
      return { severity: 'success', text: `Stop loss moved on ${e?.payload?.market}: ${e?.payload?.from} → ${e?.payload?.to}` };
    case 'order:filled':
      return { severity: 'success', text: `Order filled on ${e?.payload?.market}. Position #${e?.payload?.positionId}` };
    case 'position:closed':
      return { severity: 'info', text: `Position closed on ${e?.payload?.market}. PnL: ${e?.payload?.realized_pnl}` };
    default:
      return null;
  }
}

export default function WSListener() {
  const [queue, setQueue] = React.useState<{ id: number; msg: ReturnType<typeof eventToMessage> }[]>([]);
  const [open, setOpen] = React.useState(false);
  const current = queue[0];

  const showNext = React.useCallback(() => {
    setQueue((q) => q.slice(1));
    setOpen(false);
  }, []);

  React.useEffect(() => {
    if (queue.length > 0) setOpen(true);
  }, [queue.length]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const ws = new WebSocket(`${proto}://${window.location.host}/ws`);

    ws.onmessage = (ev) => {
      try {
        const event: Event = JSON.parse(ev.data);
        const msg = eventToMessage(event);
        if (msg) setQueue((q) => [...q, { id: Date.now() + Math.random(), msg }]);
      } catch {}
    };
    ws.onerror = () => { /* ignore */ };
    return () => ws.close();
  }, []);

  return (
    <Snackbar
      key={current?.id}
      open={open && !!current}
      autoHideDuration={2600}
      onClose={showNext}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={showNext} severity={current?.msg?.severity || 'info'} variant="filled" elevation={6}>
        {current?.msg?.text}
      </Alert>
    </Snackbar>
  );
}
