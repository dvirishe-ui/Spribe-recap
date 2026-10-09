import { describe, expect, it } from 'vitest';
import { PARTNER_SITES, derivePartner, hourlyShares } from './partnerData.js';

const sum = (a) => a.reduce((s, n) => s + n, 0);

describe('partner sites', () => {
  const all = PARTNER_SITES.map(derivePartner);

  it('game mixes and hourly shares sum to 100', () => {
    for (const s of PARTNER_SITES) {
      expect(sum(s.mix[2025])).toBe(100);
      expect(sum(s.mix[2026])).toBe(100);
      expect(sum(hourlyShares(s.peakHour))).toBeCloseTo(100, 6);
    }
  });

  it('GGR = stakes − payouts, monthly GGR adds up, realistic hold', () => {
    for (const d of all) {
      expect(d.y26.ggr).toBeCloseTo(d.y26.stakes - d.y26.payouts, 6);
      expect(sum(d.monthlyGgr)).toBeCloseTo(d.y26.ggr, 4);
      const hold = d.y26.ggr / d.y26.stakes;
      expect(hold).toBeGreaterThan(0.025);
      expect(hold).toBeLessThan(0.05);
      expect(d.site.avgBet[2026]).toBeLessThan(1);
    }
  });

  it('record day is plausible against the daily average', () => {
    for (const d of all) {
      const ratio = d.site.recordDay.rounds / (d.y26.rounds / 365);
      expect(ratio).toBeGreaterThan(1.5);
      expect(ratio).toBeLessThan(3.5);
    }
  });

  it('every site gets its own personality', () => {
    const titles = all.map((d) => d.personality.title);
    expect(new Set(titles).size).toBe(titles.length);
  });
});
