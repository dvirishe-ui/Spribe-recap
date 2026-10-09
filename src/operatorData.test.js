import { describe, expect, it } from 'vitest';
import { OPERATOR_DATA, deriveOperator } from './operatorData.js';

const sum = (a) => a.reduce((s, n) => s + n, 0);

describe('operator data', () => {
  const o = deriveOperator();

  it('shares sum to 100', () => {
    expect(sum(OPERATOR_DATA.hourly.northstar)).toBeCloseTo(100, 5);
    expect(sum(OPERATOR_DATA.hourly.benchmark)).toBeCloseTo(100, 5);
    expect(sum(OPERATOR_DATA.gameMix.map((g) => g.northstar))).toBe(100);
    expect(sum(OPERATOR_DATA.gameMix.map((g) => g.benchmark))).toBe(100);
    expect(sum(OPERATOR_DATA.netResultBands.map((b) => b.share))).toBeCloseTo(100, 5);
  });

  it('GGR = stakes − payouts and realised RTP stays realistic', () => {
    for (const t of [o.ns26, o.ns25, o.bm26, o.bm25]) {
      expect(t.ggr).toBeCloseTo(t.stakes - t.payouts, 6);
      expect(t.payouts / t.stakes).toBeGreaterThan(0.95);
      expect(t.payouts / t.stakes).toBeLessThan(0.98);
    }
  });

  it('derives KPIs and the Replay rollout funnel', () => {
    expect(o.ns26.avgMau).toBe(Math.round(sum(OPERATOR_DATA.mau.northstar[2026]) / 9));
    expect(o.kpis.find((k) => k.id === 'avgBet').diff).toBe(10.6); // 0.52 vs 0.47
    expect(o.replay.eligible).toBe(Math.round(71400 * 0.815));
    expect(o.replay.restrained + o.replay.storyAudience).toBe(o.replay.eligible);
    expect(o.promos[0].participation).toBe(64.8);
  });
});
