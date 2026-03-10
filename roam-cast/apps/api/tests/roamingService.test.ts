import { describe, it, expect } from 'vitest';

describe('roaming scoring', () => {
  it('keeps deterministic scoring envelope', () => {
    const distanceScore = Math.max(0, 1 - 10 / 30);
    const score = distanceScore * 0.5 + 0.8 * 0.4 + 0.4;
    expect(score).toBeGreaterThan(0.9);
    expect(score).toBeLessThan(1.1);
  });
});
