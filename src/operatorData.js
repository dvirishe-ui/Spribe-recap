/**
 * Operator-side mock data for the Northstar Casino pilot.
 *
 * EVERYTHING HERE IS INVENTED. Northstar Casino is fictional, and the
 * "Zambia benchmark" is an illustrative average of SPRIBE operators in one
 * market, not real operator data. Figures are only CALIBRATED to look like
 * real Aviator traffic (from earlier promo-campaign dashboards): average bet
 * $0.35–0.90, realised RTP ~96–97%, ~1,000 rounds per active player a month,
 * 20–40k monthly active SPRIBE players for a mid-sized operator.
 *
 * Edit OPERATOR_DATA; every total, average and comparison is derived below.
 * Money is USD. 2026 is year-to-date (Jan–Sep); 2025 is the full year.
 */

export const OPERATOR_DATA = {
  operator: 'Northstar Casino',
  market: 'Zambia',
  benchmarkLabel: 'Zambia average',
  benchmarkOperators: 7, // SPRIBE operators in the illustrative market average
  periods: {
    2025: { label: 'Jan–Dec 2025', months: 12 },
    2026: { label: 'Jan–Sep 2026 (year to date)', months: 9 },
  },
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

  // Monthly active SPRIBE players (played ≥1 round that month).
  mau: {
    northstar: {
      2025: [21400, 21000, 22300, 22900, 23600, 24800, 24200, 24900, 25300, 25800, 26100, 26800],
      2026: [27100, 26600, 28400, 29200, 30100, 32700, 31900, 32800, 33900],
    },
    benchmark: {
      2025: [24000, 23500, 24300, 24600, 24900, 25600, 25200, 25500, 25700, 25900, 26100, 26500],
      2026: [26200, 25800, 26700, 27100, 27400, 28600, 28100, 28400, 28900],
    },
  },

  // Unique SPRIBE players across the whole period.
  uniquePlayers: {
    northstar: { 2025: 84900, 2026: 71400 },
    benchmark: { 2025: 88300, 2026: 66000 },
  },

  // Per-period averages used to derive rounds, stakes, payouts and GGR.
  perPlayer: {
    northstar: {
      2025: { roundsPerMonth: 940, avgBet: 0.5, rtp: 0.971, sessionsPerMonth: 17, sessionMinutes: 13 },
      2026: { roundsPerMonth: 980, avgBet: 0.52, rtp: 0.971, sessionsPerMonth: 18, sessionMinutes: 14 },
    },
    benchmark: {
      2025: { roundsPerMonth: 1010, avgBet: 0.45, rtp: 0.968, sessionsPerMonth: 17, sessionMinutes: 12 },
      2026: { roundsPerMonth: 1040, avgBet: 0.47, rtp: 0.968, sessionsPerMonth: 17, sessionMinutes: 12 },
    },
  },

  // Share of 2026 rounds by local hour (0–23), in percent. Each sums to 100.
  hourly: {
    northstar: [2.3, 1.5, 1.0, 0.7, 0.5, 0.7, 1.3, 2.4, 3.3, 3.7, 3.9, 4.2, 5.0, 4.8, 4.3, 4.3, 4.7, 5.4, 6.5, 7.7, 8.9, 9.4, 8.5, 5.0],
    benchmark: [2.6, 1.7, 1.1, 0.7, 0.6, 0.9, 1.6, 2.8, 3.6, 4.0, 4.3, 4.7, 5.7, 5.3, 4.6, 4.5, 4.8, 5.7, 7.0, 8.0, 8.1, 7.3, 6.4, 4.0],
  },

  // Share of 2026 rounds by SPRIBE game, in percent. Each sums to 100.
  gameMix: [
    { game: 'Aviator', northstar: 68, benchmark: 74 },
    { game: 'Mines', northstar: 11, benchmark: 9 },
    { game: 'Plinko', northstar: 7, benchmark: 6 },
    { game: 'Pilot Chicken', northstar: 4, benchmark: 3 },
    { game: 'Goal', northstar: 3, benchmark: 2 },
    { game: 'Other SPRIBE games', northstar: 7, benchmark: 6 },
  ],

  deviceMobileShare: { northstar: 91, benchmark: 86 },
  // New SPRIBE players still playing a month later.
  monthOneRetention: { northstar: 41, benchmark: 37 },

  // Network promotions Northstar joined in 2026.
  promos: [
    { name: 'Aviator Cup (network tournament)', dates: '15–28 Jun 2026', registered: 2410, active: 1561 },
    { name: 'Aviator Prize Hunt (mission)', dates: '14 days, Aug 2026', registered: 3380, active: 1282 },
  ],

  // 2026 YTD net result (payouts − stakes) per player, as a share of players.
  // The last band is the one that gets the restrained, private-summary Replay.
  netResultBands: [
    { label: 'Ahead (≥ $0)', share: 31.0 },
    { label: '$0 to −$100', share: 38.0 },
    { label: '−$100 to −$1,000', share: 23.0 },
    { label: '−$1,000 to −$5,000', share: 7.1 },
    { label: '−$5,000 or more', share: 0.9, restrained: true },
  ],

  // Replay rollout planning assumptions (not measurements).
  replay: {
    minRoundsToQualify: 50,
    eligibleShareOfPlayers: 0.815, // of 2026 unique players, by Dec
    openRate: 0.4, // Wrapped-style recaps typically see 30–45%
    sharePreviewRate: 0.12, // of players who open the story
  },
};

const sum = (a) => a.reduce((s, n) => s + n, 0);
const pct = (from, to) => (from === 0 ? null : Math.round(((to - from) / from) * 1000) / 10);

/** Totals for one side (northstar | benchmark) in one year. */
function yearTotals(d, side, year) {
  const mau = d.mau[side][year];
  const p = d.perPlayer[side][year];
  const playerMonths = sum(mau);
  const rounds = playerMonths * p.roundsPerMonth;
  const stakes = rounds * p.avgBet;
  const payouts = stakes * p.rtp;
  return {
    avgMau: Math.round(playerMonths / mau.length),
    uniquePlayers: d.uniquePlayers[side][year],
    rounds,
    stakes,
    payouts,
    ggr: stakes - payouts, // operator gross gaming revenue = stakes − payouts
    avgBet: p.avgBet,
    rtp: p.rtp,
    roundsPerMonth: p.roundsPerMonth,
    sessionsPerMonth: p.sessionsPerMonth,
    sessionMinutes: p.sessionMinutes,
    ggrPerPlayerMonth: (stakes - payouts) / playerMonths,
  };
}

export function deriveOperator(d = OPERATOR_DATA) {
  const ns26 = yearTotals(d, 'northstar', 2026);
  const ns25 = yearTotals(d, 'northstar', 2025);
  const bm26 = yearTotals(d, 'benchmark', 2026);
  const bm25 = yearTotals(d, 'benchmark', 2025);

  // Same-months comparison (Jan–Sep) so growth isn't flattered by Q4 2025.
  const ytdMonths = d.mau.northstar[2026].length;
  const nsMau25SamePeriod = sum(d.mau.northstar[2025].slice(0, ytdMonths)) / ytdMonths;
  const bmMau25SamePeriod = sum(d.mau.benchmark[2025].slice(0, ytdMonths)) / ytdMonths;

  const vs = (a, b) => pct(b, a); // Northstar relative to benchmark

  const kpis = [
    { id: 'mau', label: 'Avg monthly active players', ns: ns26.avgMau, bm: bm26.avgMau, fmt: 'int' },
    { id: 'rounds', label: 'Rounds per player / month', ns: ns26.roundsPerMonth, bm: bm26.roundsPerMonth, fmt: 'int' },
    { id: 'avgBet', label: 'Average bet', ns: ns26.avgBet, bm: bm26.avgBet, fmt: 'usd2' },
    { id: 'session', label: 'Avg session length', ns: ns26.sessionMinutes, bm: bm26.sessionMinutes, fmt: 'min' },
    { id: 'mobile', label: 'Rounds on mobile', ns: d.deviceMobileShare.northstar, bm: d.deviceMobileShare.benchmark, fmt: 'pct' },
    { id: 'retention', label: 'Month-1 retention, new players', ns: d.monthOneRetention.northstar, bm: d.monthOneRetention.benchmark, fmt: 'pct' },
  ].map((k) => ({ ...k, diff: vs(k.ns, k.bm) }));

  const peakHour = (arr) => arr.indexOf(Math.max(...arr));

  const promos = d.promos.map((p) => ({ ...p, participation: Math.round((p.active / p.registered) * 1000) / 10 }));

  const eligible = Math.round(ns26.uniquePlayers * d.replay.eligibleShareOfPlayers);
  const restrainedShare = d.netResultBands.filter((b) => b.restrained).reduce((s, b) => s + b.share, 0) / 100;
  const restrained = Math.round(eligible * restrainedShare);
  const storyAudience = eligible - restrained;
  const opens = Math.round(storyAudience * d.replay.openRate);
  const sharePreviews = Math.round(opens * d.replay.sharePreviewRate);

  return {
    d,
    ns26,
    ns25,
    bm26,
    bm25,
    growth: {
      mauNs: pct(nsMau25SamePeriod, ns26.avgMau),
      mauBm: pct(bmMau25SamePeriod, bm26.avgMau),
    },
    kpis,
    peak: { ns: peakHour(d.hourly.northstar), bm: peakHour(d.hourly.benchmark) },
    promos,
    replay: { eligible, restrained, restrainedShare, storyAudience, opens, sharePreviews },
  };
}
