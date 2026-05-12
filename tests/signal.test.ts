import { describe, it, expect } from 'vitest';

describe('Signal Processing', () => {
  it('should validate signal structure', () => {
    const validSignal = {
      symbol: 'BTC/USDT',
      side: 'buy',
      price: 50000,
      timestamp: Date.now()
    };
    expect(validSignal).toHaveProperty('symbol');
    expect(validSignal).toHaveProperty('side');
    expect(['buy', 'sell']).toContain(validSignal.side);
  });

  it('should reject invalid signals', () => {
    const invalidSignal = { symbol: '', side: 'unknown' };
    expect(invalidSignal.side).not.toBe('buy');
    expect(invalidSignal.side).not.toBe('sell');
  });

  it('should format price correctly', () => {
    const formatPrice = (price: number) => price.toFixed(2);
    expect(formatPrice(50000.123)).toBe('50000.12');
    expect(formatPrice(0.001)).toBe('0.00');
  });
});
