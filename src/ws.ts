import type { Server } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { logger } from './utils/logger';

type EventPayload = { type: string; payload?: any };

let wss: WebSocketServer | null = null;

export function initWebSocket(server: Server) {
  if (wss) return wss;
  wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    try {
      ws.send(JSON.stringify({ type: 'ws:hello', payload: { ts: Date.now() } }));
    } catch {}

    ws.on('pong', () => {
      // noop; keep-alive managed below
    });
  });

  // Heartbeat ping to keep connections alive
  const interval = setInterval(() => {
    if (!wss) return;
    wss.clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        try { ws.ping(); } catch {}
      }
    });
  }, 30000);

  wss.on('close', () => clearInterval(interval));

  logger.info('WebSocket server initialized at /ws');
  return wss;
}

export function broadcast(event: EventPayload) {
  if (!wss) return;
  const msg = JSON.stringify(event);
  wss.clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      try { ws.send(msg); } catch {}
    }
  });
}

