/**
 * SPRIBE Replay 2026 — mock data and derivations.
 *
 * Everything here is INVENTED for a concept prototype. There is no real player,
 * no real account and no live casino API. "Northstar Casino" is a fictional
 * operator used only to show how the recap could sit inside an operator's site.
 *
 * Edit REPLAY_DATA to change the story. Totals, percentages, "new" games,
 * net results and the presentation mode are all derived below, so each figure
 * lives in exactly one place.
 */

export const REPLAY_DATA = {
  operator: { name: 'Northstar Casino', isFictional: true },
  product: 'SPRIBE Replay',
  year: 2026,
  previousYear: 2025,

  // Per-game round counts. A game with 0 rounds in the previous year and
  // >0 this year counts as a "new discovery". Totals are summed in code:
  // 2025 = 1,120 rounds across 3 games; 2026 = 1,344 rounds across 5 games.
  games: [
    { id: 'aviator', name: 'Aviator', rounds: { 2025: 700, 2026: 800 } },
    { id: 'mines', name: 'Mines', rounds: { 2025: 260, 2026: 230 } },
    { id: 'plinko', name: 'Plinko', rounds: { 2025: 160, 2026: 160 } },
    { id: 'goal', name: 'Goal', rounds: { 2025: 0, 2026: 94 } },
    { id: 'pilot-chicken', name: 'Pilot Chicken', rounds: { 2025: 0, 2026: 60 } },
  ],

  // Days with at least one SPRIBE round.
  activeDays: { 2025: 74, 2026: 92 },

  // PRIVATE financial figures: SPRIBE games on this Northstar Casino account
  // only. Never passed to the story slides or the share card. Net result is
  // NOT stored — it is always derived as payouts − stakes.
  financials: {
    normal: {
      2025: { stakes: 3200, payouts: 2920 },
      2026: { stakes: 4900, payouts: 4490 },
    },
    // Developer-only "High-loss scenario": the 2026 net result becomes
    // −$50,000 (62,600 − 112,600). 2025 is unchanged.
    highLoss: {
      2025: { stakes: 3200, payouts: 2920 },
      2026: { stakes: 112600, payouts: 62600 },
    },
  },

  reportingPeriods: {
    2025: '1 Jan 2025 – 31 Dec 2025',
    2026: '1 Jan 2026 – 31 Dec 2026',
  },
};

/**
 * Two presentation modes:
 *  - 'story'      → the animated, celebratory Replay story (normal scenario).
 *  - 'restrained' → no story, no share card, no celebration; a calm private
 *                   financial summary with support options. Chosen whenever
 *                   the latest year's net loss reaches this threshold.
 */
export const RESTRAINED_MODE_LOSS_THRESHOLD = 5000;

/** Percentage change from a → b, rounded to one decimal place. */
export function percentChange(from, to) {
  if (from === 0) return null;
  return Math.round(((to - from) / from) * 1000) / 10;
}

/** Derive every figure the UI shows from REPLAY_DATA. */
export function deriveReplay(data = REPLAY_DATA, scenario = 'normal') {
  const { year: y, previousYear: py } = data;

  const games = data.games
    .map((g) => ({
      ...g,
      roundsThisYear: g.rounds[y] ?? 0,
      roundsLastYear: g.rounds[py] ?? 0,
      isNew: (g.rounds[py] ?? 0) === 0 && (g.rounds[y] ?? 0) > 0,
    }))
    .filter((g) => g.roundsThisYear > 0);

  const sumRounds = (yr) => data.games.reduce((s, g) => s + (g.rounds[yr] ?? 0), 0);
  const countGames = (yr) => data.games.filter((g) => (g.rounds[yr] ?? 0) > 0).length;

  const totalRounds = { [py]: sumRounds(py), [y]: sumRounds(y) };
  const gamesPlayed = { [py]: countGames(py), [y]: countGames(y) };

  const favorite = [...games].sort((a, b) => b.roundsThisYear - a.roundsThisYear)[0];
  const favoriteShare = Math.round((favorite.roundsThisYear / totalRounds[y]) * 100);
  const newGames = games.filter((g) => g.isNew);

  const comparison = [
    { id: 'days', label: 'Active days', from: data.activeDays[py], to: data.activeDays[y] },
    { id: 'games', label: 'SPRIBE games played', from: gamesPlayed[py], to: gamesPlayed[y] },
    { id: 'rounds', label: 'Rounds', from: totalRounds[py], to: totalRounds[y] },
  ].map((row) => ({ ...row, change: percentChange(row.from, row.to) }));

  // Personality is non-competitive and based only on which games were tried.
  const personality =
    newGames.length >= 2
      ? {
          id: 'explorer',
          title: 'The Explorer',
          blurb: `You tried ${newGames.length} SPRIBE games for the first time this year.`,
        }
      : {
          id: 'regular',
          title: 'The Familiar Face',
          blurb: 'You knew what you liked and kept it simple.',
        };

  const fin = data.financials[scenario];
  const statements = [py, y].map((yr) => {
    const { stakes, payouts } = fin[yr];
    return { year: yr, period: data.reportingPeriods[yr], stakes, payouts, net: payouts - stakes };
  });
  const latest = statements[statements.length - 1];
  const mode = -latest.net >= RESTRAINED_MODE_LOSS_THRESHOLD ? 'restrained' : 'story';

  return {
    operator: data.operator,
    product: data.product,
    year: y,
    previousYear: py,
    games,
    totalRounds,
    gamesPlayed,
    favorite,
    favoriteShare,
    newGames,
    comparison,
    personality,
    statements,
    mode,
  };
}

/**
 * The ONLY data the share card may receive. Deliberately excludes rounds,
 * stakes, payouts, net results, account identifiers and location.
 */
export function buildShareCardData(replay) {
  return {
    product: replay.product,
    year: replay.year,
    personality: { title: replay.personality.title, blurb: replay.personality.blurb },
    newGameNames: replay.newGames.map((g) => g.name),
    lineupNames: replay.games.map((g) => g.name),
  };
}

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

/** $4,900 / −$410 (true minus sign) / +$120. */
export function formatMoney(n, { signed = false } = {}) {
  const abs = usd.format(Math.abs(n));
  if (n < 0) return `−${abs}`;
  return signed && n > 0 ? `+${abs}` : abs;
}

export const formatInt = (n) => new Intl.NumberFormat('en-US').format(n);

export function formatChange(pct) {
  if (pct === null) return 'new';
  const s = Number.isInteger(pct) ? String(pct) : pct.toFixed(1);
  return `${pct > 0 ? '+' : pct < 0 ? '−' : ''}${s.replace('-', '')}%`;
}
