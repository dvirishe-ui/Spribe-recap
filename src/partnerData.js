/**
 * Partner Replay 2026: mock data for five FICTIONAL partner sites.
 *
 * Every site name and figure is invented. Countries are real markets, but each
 * "market average" is an illustrative average SPRIBE operator in that country,
 * not real operator data. Figures are calibrated to look like real Aviator
 * traffic seen in earlier promo dashboards: average bet $0.20–0.60, realised
 * RTP ~95.5–97%, 700–1,300 rounds per active player a month, tournament
 * participation ~63% and mission participation ~38% of registered players.
 *
 * Full-year 2026 values are invented for this end-of-year preview.
 * Edit PARTNER_SITES; rounds, stakes, GGR, growth, comparisons, the busiest
 * month, the rising-star game and the site personality are all derived.
 */

export const GAMES = ['Aviator', 'Mines', 'Plinko', 'Goal', 'Pilot Chicken', 'Other SPRIBE games'];

// Network-wide participation by promo format (from earlier campaign results).
export const NETWORK_PARTICIPATION = { Tournament: 63, Mission: 38 };

// Shared monthly shape of play (Jan–Dec); each site tilts it by its own growth.
const SEASON = [0.93, 0.88, 0.95, 0.96, 0.98, 1.07, 1.05, 1.02, 1.0, 1.01, 1.03, 1.12];

export const PARTNER_SITES = [
  {
    id: 'northstar',
    name: 'Northstar Casino',
    country: 'Zambia',
    cc: 'ZM',
    city: 'Lusaka',
    spribeSince: 2023,
    monthsLive: { 2025: 12, 2026: 12 },
    mau: { 2025: 24100, 2026: 30300 }, // average monthly active SPRIBE players
    uniquePlayers: { 2025: 84900, 2026: 96800 },
    roundsPerPlayerMonth: { 2025: 940, 2026: 980 },
    avgBet: { 2025: 0.5, 2026: 0.52 },
    rtp: { 2025: 0.971, 2026: 0.971 },
    newPlayers: 41200,
    retentionM1: 41, // % of new players back the next month
    mobileShare: 91,
    sessionMinutes: 14,
    sessionsPerMonth: 18,
    peakHour: 21,
    busiestDay: 'Friday',
    recordDay: { date: 'Sat 11 Jul 2026', rounds: 2140000 },
    mix: {
      2025: [71, 11, 7, 2, 2, 7],
      2026: [68, 11, 7, 3, 4, 7],
    },
    promos: [
      { name: 'Aviator Cup', type: 'Tournament', registered: 2410, active: 1561 },
      { name: 'Aviator Prize Hunt', type: 'Mission', registered: 3380, active: 1282 },
    ],
    market: { operators: 7, mau: 27500, roundsPerPlayerMonth: 1040, avgBet: 0.47, rtp: 0.968, mobileShare: 86, sessionMinutes: 12, retentionM1: 37, ggrGrowth: 9.8, aviatorShare: 74 },
  },
  {
    id: 'kilima',
    name: 'Kilima Lounge',
    country: 'Tanzania',
    cc: 'TZ',
    city: 'Dar es Salaam',
    spribeSince: 2022,
    monthsLive: { 2025: 12, 2026: 12 },
    mau: { 2025: 31200, 2026: 34800 },
    uniquePlayers: { 2025: 104000, 2026: 112500 },
    roundsPerPlayerMonth: { 2025: 740, 2026: 760 },
    avgBet: { 2025: 0.55, 2026: 0.58 },
    rtp: { 2025: 0.969, 2026: 0.969 },
    newPlayers: 38900,
    retentionM1: 39,
    mobileShare: 88,
    sessionMinutes: 12,
    sessionsPerMonth: 16,
    peakHour: 20,
    busiestDay: 'Saturday',
    recordDay: { date: 'Sun 19 Jul 2026', rounds: 1620000 },
    mix: {
      2025: [76, 10, 6, 2, 1, 5],
      2026: [72, 10, 6, 4, 3, 5],
    },
    promos: [{ name: 'Aviator Cup', type: 'Tournament', registered: 2940, active: 1710 }],
    market: { operators: 9, mau: 30000, roundsPerPlayerMonth: 700, avgBet: 0.49, rtp: 0.969, mobileShare: 85, sessionMinutes: 11, retentionM1: 36, ggrGrowth: 8.4, aviatorShare: 75 },
  },
  {
    id: 'baobab',
    name: 'Baobab Play',
    country: 'Malawi',
    cc: 'MW',
    city: 'Lilongwe',
    spribeSince: 2023,
    monthsLive: { 2025: 12, 2026: 12 },
    mau: { 2025: 13100, 2026: 14600 },
    uniquePlayers: { 2025: 46800, 2026: 51200 },
    roundsPerPlayerMonth: { 2025: 1200, 2026: 1250 },
    avgBet: { 2025: 0.23, 2026: 0.24 },
    rtp: { 2025: 0.962, 2026: 0.962 },
    newPlayers: 17900,
    retentionM1: 38,
    mobileShare: 94,
    sessionMinutes: 15,
    sessionsPerMonth: 21,
    peakHour: 13,
    busiestDay: 'Wednesday',
    recordDay: { date: 'Wed 1 Apr 2026', rounds: 1310000 },
    mix: {
      2025: [79, 8, 5, 3, 0, 5],
      2026: [76, 8, 5, 4, 2, 5],
    },
    promos: [{ name: 'Aviator Cup', type: 'Tournament', registered: 2237, active: 1402 }],
    market: { operators: 5, mau: 13000, roundsPerPlayerMonth: 1180, avgBet: 0.25, rtp: 0.963, mobileShare: 92, sessionMinutes: 13, retentionM1: 35, ggrGrowth: 6.1, aviatorShare: 78 },
  },
  {
    id: 'lakeview',
    name: 'Lakeview Games',
    country: 'Kenya',
    cc: 'KE',
    city: 'Nairobi',
    spribeSince: 2024,
    monthsLive: { 2025: 12, 2026: 12 },
    mau: { 2025: 2700, 2026: 4100 },
    uniquePlayers: { 2025: 10900, 2026: 16300 },
    roundsPerPlayerMonth: { 2025: 980, 2026: 1030 },
    avgBet: { 2025: 0.45, 2026: 0.47 },
    rtp: { 2025: 0.966, 2026: 0.965 },
    newPlayers: 9800,
    retentionM1: 44,
    mobileShare: 90,
    sessionMinutes: 13,
    sessionsPerMonth: 17,
    peakHour: 21,
    busiestDay: 'Sunday',
    recordDay: { date: 'Sun 13 Sep 2026', rounds: 318000 },
    mix: {
      2025: [66, 13, 9, 4, 1, 7],
      2026: [58, 14, 10, 6, 5, 7],
    },
    promos: [{ name: 'Aviator Prize Hunt', type: 'Mission', registered: 1026, active: 619 }],
    market: { operators: 11, mau: 6800, roundsPerPlayerMonth: 900, avgBet: 0.44, rtp: 0.97, mobileShare: 89, sessionMinutes: 11, retentionM1: 35, ggrGrowth: 12.5, aviatorShare: 73 },
  },
  {
    id: 'harmattan',
    name: 'Harmattan Club',
    country: 'Ghana',
    cc: 'GH',
    city: 'Accra',
    spribeSince: 2025,
    monthsLive: { 2025: 4, 2026: 12 }, // launched SPRIBE games in September 2025
    mau: { 2025: 1450, 2026: 2300 },
    uniquePlayers: { 2025: 2900, 2026: 7400 },
    roundsPerPlayerMonth: { 2025: 780, 2026: 820 },
    avgBet: { 2025: 0.29, 2026: 0.31 },
    rtp: { 2025: 0.957, 2026: 0.956 },
    newPlayers: 5600,
    retentionM1: 33,
    mobileShare: 96,
    sessionMinutes: 10,
    sessionsPerMonth: 14,
    peakHour: 22,
    busiestDay: 'Friday',
    recordDay: { date: 'Fri 27 Nov 2026', rounds: 151000 },
    mix: {
      2025: [88, 5, 4, 1, 0, 2],
      2026: [81, 6, 5, 3, 1, 4],
    },
    promos: [{ name: 'Aviator Prize Hunt', type: 'Mission', registered: 248, active: 171 }],
    market: { operators: 6, mau: 3200, roundsPerPlayerMonth: 760, avgBet: 0.33, rtp: 0.96, mobileShare: 93, sessionMinutes: 10, retentionM1: 31, ggrGrowth: 18, aviatorShare: 82 },
  },
];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const pct = (from, to) => (from ? Math.round(((to - from) / from) * 1000) / 10 : null);
const sum = (a) => a.reduce((s, n) => s + n, 0);

function yearTotals(s, y) {
  const rounds = s.mau[y] * s.monthsLive[y] * s.roundsPerPlayerMonth[y];
  const stakes = rounds * s.avgBet[y];
  const payouts = stakes * s.rtp[y];
  return { rounds, stakes, payouts, ggr: stakes - payouts };
}

/** 24 hourly shares (sum 100) peaking at `peak`, with a lunchtime bump. */
export function hourlyShares(peak) {
  const raw = Array.from({ length: 24 }, (_, h) => {
    const d = Math.min(Math.abs(h - peak), 24 - Math.abs(h - peak));
    const lunch = Math.exp(-((h - 13) ** 2) / 4) * 0.45;
    return 0.12 + Math.exp(-(d ** 2) / 10) + lunch;
  });
  const t = sum(raw);
  return raw.map((v) => (v / t) * 100);
}

function personality(site, d) {
  if (site.mix[2026][0] < 60)
    return {
      title: 'The Explorer',
      line: `Your players roam the whole SPRIBE lineup: only ${site.mix[2026][0]}% of rounds were Aviator, against ${site.market.aviatorShare}% across ${site.country}.`,
    };
  if (d.growth.ggr >= 40)
    return {
      title: 'The Rocket',
      line: `Straight up: GGR grew ${d.growth.ggr}% on 2025${site.monthsLive[2025] < 12 ? ' in your first full year with SPRIBE' : ''}.`,
    };
  if (site.peakHour >= 12 && site.peakHour <= 14)
    return {
      title: 'The Lunch Crowd',
      line: `Your busiest hour is ${String(site.peakHour).padStart(2, '0')}:00. SPRIBE games are a lunch-break favourite at ${site.name}.`,
    };
  if (site.peakHour >= 21)
    return {
      title: 'The Night Flyer',
      line: `Your players come alive after dark. Peak hour: ${site.peakHour}:00, and ${site.busiestDay}s are the big night.`,
    };
  return {
    title: 'The Steady Cruiser',
    line: `Smooth flying all year: no month strayed more than ${d.maxSwing}% from your monthly average.`,
  };
}

export function derivePartner(site) {
  const y25 = yearTotals(site, 2025);
  const y26 = yearTotals(site, 2026);

  // Monthly 2026 GGR: shared seasonality tilted by the site's own growth.
  const g = (site.mau[2026] - site.mau[2025]) / site.mau[2025];
  const tilt = Math.max(-0.2, Math.min(0.35, g));
  // The month holding the record day gets a lift (big event, promo, final…).
  const recordMonth = MONTHS.findIndex((name) => site.recordDay.date.includes(name.slice(0, 3)));
  const weights = SEASON.map((w, m) => w * (1 + tilt * ((m - 5.5) / 11)) * (m === recordMonth ? 1.3 : 1));
  const wsum = sum(weights);
  const monthlyGgr = weights.map((w) => (y26.ggr * w) / wsum);
  const best = monthlyGgr.indexOf(Math.max(...monthlyGgr));
  const avgMonth = y26.ggr / 12;
  const maxSwing = Math.round(Math.max(...monthlyGgr.map((v) => Math.abs(v - avgMonth) / avgMonth)) * 100);

  const m = site.market;
  const marketRounds = m.mau * 12 * m.roundsPerPlayerMonth;
  const marketGgr = marketRounds * m.avgBet * (1 - m.rtp);

  // Rising star: biggest growth in rounds, among games played in both years
  // (a game with no 2025 rounds is reported as new instead).
  const games = GAMES.map((name, i) => {
    const r25 = (y25.rounds * site.mix[2025][i]) / 100;
    const r26 = (y26.rounds * site.mix[2026][i]) / 100;
    return { name, share: site.mix[2026][i], rounds: r26, isNew: r25 === 0 && r26 > 0, growth: r25 ? pct(r25, r26) : null };
  });
  const risingStar = games
    .filter((x) => x.growth !== null && x.name !== 'Other SPRIBE games')
    .sort((a, b) => b.growth - a.growth)[0];

  const promos = site.promos.map((p) => ({
    ...p,
    participation: Math.round((p.active / p.registered) * 1000) / 10,
    network: NETWORK_PARTICIPATION[p.type],
  }));

  const d = {
    site,
    y25,
    y26,
    growth: {
      ggr: pct(y25.ggr, y26.ggr),
      mau: pct(site.mau[2025], site.mau[2026]),
      players: pct(site.uniquePlayers[2025], site.uniquePlayers[2026]),
      rounds: pct(y25.rounds, y26.rounds),
      partialPrevYear: site.monthsLive[2025] < 12,
    },
    market: { ...m, rounds: marketRounds, ggr: marketGgr },
    vsMarket: {
      mau: pct(m.mau, site.mau[2026]),
      ggr: pct(marketGgr, y26.ggr),
      avgBet: pct(m.avgBet, site.avgBet[2026]),
      roundsPerPlayer: pct(m.roundsPerPlayerMonth, site.roundsPerPlayerMonth[2026]),
    },
    monthlyGgr,
    bestMonth: MONTHS[best],
    maxSwing,
    perSecond: y26.rounds / (365 * 24 * 3600),
    // One round = one 0.75 m step; Earth's circumference is 40,075 km.
    earthLaps: (y26.rounds * 0.75) / 40075000,
    hourly: hourlyShares(site.peakHour),
    games,
    risingStar,
    newGames: games.filter((x) => x.isNew).map((x) => x.name),
    promos,
  };
  d.personality = personality(site, d);
  return d;
}
