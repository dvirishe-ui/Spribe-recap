import { describe, expect, it } from 'vitest';
import { REPLAY_DATA, buildShareCardData, deriveReplay, formatChange, formatMoney } from './data.js';

describe('normal scenario', () => {
  const r = deriveReplay(REPLAY_DATA, 'normal');

  it('derives round totals and lineup', () => {
    expect(r.totalRounds).toEqual({ 2025: 1120, 2026: 1344 });
    expect(r.gamesPlayed).toEqual({ 2025: 3, 2026: 5 });
    expect(r.games.map((g) => [g.name, g.roundsThisYear])).toEqual([
      ['Aviator', 800], ['Mines', 230], ['Plinko', 160], ['Goal', 94], ['Pilot Chicken', 60],
    ]);
    expect(r.favorite.name).toBe('Aviator');
    expect(r.newGames.map((g) => g.name)).toEqual(['Goal', 'Pilot Chicken']);
    expect(r.personality.title).toBe('The Explorer');
  });

  it('computes percentage changes from the raw values', () => {
    const byId = Object.fromEntries(r.comparison.map((c) => [c.id, c]));
    expect([byId.days.from, byId.days.to, byId.days.change]).toEqual([74, 92, 24.3]);
    expect([byId.games.from, byId.games.to, byId.games.change]).toEqual([3, 5, 66.7]);
    expect([byId.rounds.from, byId.rounds.to, byId.rounds.change]).toEqual([1120, 1344, 20]);
    expect(formatChange(24.3)).toBe('+24.3%');
    expect(formatChange(20)).toBe('+20%');
  });

  it('net result = payouts − stakes', () => {
    expect(r.statements.map((s) => [s.stakes, s.payouts, s.net])).toEqual([
      [3200, 2920, -280],
      [4900, 4490, -410],
    ]);
    for (const s of r.statements) expect(s.net).toBe(s.payouts - s.stakes);
    expect(formatMoney(-410)).toBe('−$410');
    expect(r.mode).toBe('story');
  });
});

describe('high-loss scenario', () => {
  const r = deriveReplay(REPLAY_DATA, 'highLoss');

  it('2026 net result is −$50,000 and equals payouts − stakes', () => {
    const latest = r.statements[1];
    expect(latest.net).toBe(-50000);
    expect(latest.net).toBe(latest.payouts - latest.stakes);
    expect(r.statements[0].net).toBe(-280);
    expect(formatMoney(latest.net)).toBe('−$50,000');
  });

  it('switches to the restrained presentation', () => {
    expect(r.mode).toBe('restrained');
  });
});

describe('share card', () => {
  it('contains no financial, betting, account or location data', () => {
    const card = buildShareCardData(deriveReplay());
    const json = JSON.stringify(card).toLowerCase();
    for (const banned of ['stake', 'payout', 'net', 'round', 'account', 'location', '$']) {
      expect(json).not.toContain(banned);
    }
  });
});
