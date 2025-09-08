import type { Signal } from '../../types/coinex';

export const MOCK_SIGNALS: Signal[] = [
  {
    _id: "as",
    market: 'BTCUSDT',
    entry: 64250,
    position: 'LONG',
    stopLoss: 63100,
    takeProfit: [64600, 65150, 65900],
    leverage: 10,
    messageId: 9000001,
    state: 'pending',
    realized_pnl: 0,
    sl_tp_done: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    logs: [
      { timestamp: Date.now(), message: 'Mock signal created' },
    ],
  },
  {
    _id: "ass",
    market: 'ETHUSDT',
    entry: 3420,
    position: 'SHORT',
    stopLoss: 3480,
    takeProfit: [3390, 3340, 3290],
    leverage: 8,
    messageId: 9000002,
    state: 'order placed',
    realized_pnl: 0,
    sl_tp_done: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    logs: [
      { timestamp: Date.now(), message: 'Order submitted to exchange' },
    ],
  },
  {
    _id: "ass2",
    market: 'SOLUSDT',
    entry: 155.2,
    position: 'LONG',
    stopLoss: 149.5,
    takeProfit: [157, 160, 165],
    leverage: 5,
    messageId: 9000003,
    state: 'filled',
    realized_pnl: 12.5,
    sl_tp_done: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    logs: [
      { timestamp: Date.now(), message: 'Order filled at 155.2' },
    ],
  },
];

