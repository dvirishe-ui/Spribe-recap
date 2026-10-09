import { useMemo } from 'react';
import { Columns, Legend, LineChart, PairedBars } from './Charts.jsx';
import { OPERATOR_DATA, deriveOperator } from '../operatorData.js';

/*
 * Operator insights: what Northstar Casino's team would see alongside the
 * player-facing Replay. All figures are invented (see operatorData.js) and
 * the market benchmark is illustrative.
 */

const NS = 'var(--c-ns)';
const BM = 'var(--c-bm)';

const int = (n) => Math.round(n).toLocaleString('en-US');
const compact = (n, money = false) => {
  const abs = Math.abs(n);
  const [d, s] = abs >= 1e9 ? [1e9, 'B'] : abs >= 1e6 ? [1e6, 'M'] : abs >= 1e3 ? [1e3, 'k'] : [1, ''];
  const v = (n / d).toFixed(abs >= 1e3 && n / d < 100 ? 1 : 0);
  return `${money ? '$' : ''}${v}${s}`;
};
const fmtKpi = (v, f) =>
  f === 'usd2' ? `$${v.toFixed(2)}` : f === 'pct' ? `${v}%` : f === 'min' ? `${v} min` : int(v);
const signed = (p) => (p === null ? '—' : `${p > 0 ? '+' : p < 0 ? '−' : ''}${Math.abs(p)}%`);
const hourLabel = (h) => `${String(h).padStart(2, '0')}:00`;

function Kpi({ k, bmLabel }) {
  return (
    <div className="kpi">
      <span className="kpi__label">{k.label}</span>
      <span className="kpi__value">{fmtKpi(k.ns, k.fmt)}</span>
      <span className="kpi__cmp">
        {bmLabel} {fmtKpi(k.bm, k.fmt)}
        <span className="kpi__diff">{signed(k.diff)}</span>
      </span>
    </div>
  );
}

export default function Insights() {
  const o = useMemo(() => deriveOperator(OPERATOR_DATA), []);
  const d = o.d;
  const bmLabel = d.benchmarkLabel;

  const timeline = [
    ...d.months.map((m) => `${m} 25`),
    ...d.months.slice(0, d.mau.northstar[2026].length).map((m) => `${m} 26`),
  ];
  const mauSeries = [
    { label: 'Northstar', color: NS, values: [...d.mau.northstar[2025], ...d.mau.northstar[2026]] },
    { label: `${bmLabel} (per operator)`, color: BM, dashed: true, values: [...d.mau.benchmark[2025], ...d.mau.benchmark[2026]] },
  ];
  // First month from which Northstar stays at or above the market average.
  const nsAll = mauSeries[0].values;
  const bmAll = mauSeries[1].values;
  const cross = nsAll.findIndex((v, i) => nsAll.slice(i).every((w, j) => w >= bmAll[i + j]));
  const hours = Array.from({ length: 24 }, (_, h) => hourLabel(h));
  const hourSeries = [
    { label: 'Northstar', color: NS, values: d.hourly.northstar },
    { label: bmLabel, color: BM, dashed: true, values: d.hourly.benchmark },
  ];
  const r = o.replay;
  const funnel = [
    { label: `Unique SPRIBE players, ${d.periods[2026].label.split(' (')[0]}`, value: o.ns26.uniquePlayers },
    { label: `Eligible for Replay (≥ ${d.replay.minRoundsToQualify} rounds)`, value: r.eligible },
    { label: 'Get the Replay story', value: r.storyAudience },
    { label: `Expected to open it (${Math.round(d.replay.openRate * 100)}% assumption)`, value: r.opens },
    { label: `Expected to preview a share card (${Math.round(d.replay.sharePreviewRate * 100)}%)`, value: r.sharePreviews },
  ];

  return (
    <div className="insights">
      <header className="ins-head">
        <div>
          <p className="brief__kicker">Northstar Casino · operator insights</p>
          <h1>Your SPRIBE year so far</h1>
          <p className="brief__lede">
            {d.periods[2026].label}, compared with the {bmLabel} of {d.benchmarkOperators} SPRIBE operators. Every
            figure is invented for this pilot; the benchmark is illustrative and calibrated to typical Aviator traffic.
          </p>
        </div>
        <dl className="ins-period">
          <div>
            <dt>Reporting period</dt>
            <dd>{d.periods[2026].label}</dd>
          </div>
          <div>
            <dt>Compared with</dt>
            <dd>{d.periods[2025].label}</dd>
          </div>
          <div>
            <dt>Currency</dt>
            <dd>USD</dd>
          </div>
        </dl>
      </header>

      <section className="ins-hero" aria-label="Headline figures">
        <div className="hero-stat">
          <span className="hero-stat__label">Rounds played</span>
          <span className="hero-stat__value">{compact(o.ns26.rounds)}</span>
          <span className="hero-stat__sub">2025 full year: {compact(o.ns25.rounds)}</span>
        </div>
        <div className="hero-stat">
          <span className="hero-stat__label">Total stakes</span>
          <span className="hero-stat__value">{compact(o.ns26.stakes, true)}</span>
          <span className="hero-stat__sub">2025 full year: {compact(o.ns25.stakes, true)}</span>
        </div>
        <div className="hero-stat">
          <span className="hero-stat__label">GGR (stakes − payouts)</span>
          <span className="hero-stat__value">{compact(o.ns26.ggr, true)}</span>
          <span className="hero-stat__sub">
            Hold {((1 - o.ns26.rtp) * 100).toFixed(1)}% · {bmLabel} {((1 - o.bm26.rtp) * 100).toFixed(1)}%
          </span>
        </div>
        <div className="hero-stat">
          <span className="hero-stat__label">Unique players</span>
          <span className="hero-stat__value">{int(o.ns26.uniquePlayers)}</span>
          <span className="hero-stat__sub">
            {bmLabel}: {int(o.bm26.uniquePlayers)} per operator
          </span>
        </div>
      </section>

      <section className="panel" aria-labelledby="ins-kpi">
        <div className="panel__head">
          <h2 id="ins-kpi">You vs the market</h2>
          <p>Northstar first; the line below each figure is the {bmLabel} and the difference.</p>
        </div>
        <div className="kpi-grid">
          {o.kpis.map((k) => (
            <Kpi key={k.id} k={k} bmLabel={bmLabel} />
          ))}
        </div>
      </section>

      <div className="ins-grid">
        <section className="panel" aria-labelledby="ins-mau">
          <div className="panel__head">
            <h2 id="ins-mau">Monthly active SPRIBE players</h2>
            <p>
              Jan–Sep average up {signed(o.growth.mauNs)} on the same months of 2025 ({bmLabel}: {signed(o.growth.mauBm)}).
              {cross > 0 && ` Northstar has been above the market average since ${timeline[cross].replace(' ', ' 20')}.`}
            </p>
          </div>
          <Legend items={mauSeries} />
          <LineChart
            title="Monthly active SPRIBE players, Jan 2025 to Sep 2026"
            series={mauSeries}
            labels={timeline}
            tickEvery={3}
            yFmt={(v) => `${Math.round(v / 1000)}k`}
            tipFmt={int}
          />
        </section>

        <section className="panel" aria-labelledby="ins-hour">
          <div className="panel__head">
            <h2 id="ins-hour">When players play</h2>
            <p>
              Share of 2026 rounds by local hour. Northstar peaks at {hourLabel(o.peak.ns)}; the market peaks at{' '}
              {hourLabel(o.peak.bm)}. Northstar has a smaller lunchtime bump.
            </p>
          </div>
          <Legend items={hourSeries} />
          <LineChart
            title="Share of rounds by hour of day"
            series={hourSeries}
            labels={hours}
            tickEvery={6}
            zero
            yFmt={(v) => `${v}%`}
            tipFmt={(v) => `${v.toFixed(1)}%`}
          />
        </section>

        <section className="panel" aria-labelledby="ins-mix">
          <div className="panel__head">
            <h2 id="ins-mix">Game mix</h2>
            <p>Share of 2026 rounds. Northstar players lean less on Aviator and more on Mines, Plinko and the newer titles.</p>
          </div>
          <Legend
            items={[
              { label: 'Northstar', color: NS },
              { label: bmLabel, color: BM },
            ]}
          />
          <PairedBars
            rows={d.gameMix.map((g) => ({ label: g.game, ns: g.northstar, bm: g.benchmark }))}
            a={{ key: 'ns', label: 'Northstar', color: NS }}
            b={{ key: 'bm', label: bmLabel, color: BM }}
          />
        </section>

        <section className="panel" aria-labelledby="ins-net">
          <div className="panel__head">
            <h2 id="ins-net">Player net results, 2026 so far</h2>
            <p>
              Share of Northstar SPRIBE players by net result (payouts − stakes). The {d.netResultBands.at(-1).share}% at −$5,000 or
              more get the private summary instead of the Replay story.
            </p>
          </div>
          <Columns
            title="Share of players by 2026 net result"
            color={NS}
            rows={d.netResultBands.map((b) => ({ label: b.label, value: b.share, flag: b.restrained }))}
          />
        </section>
      </div>

      <div className="ins-grid">
        <section className="panel" aria-labelledby="ins-replay">
          <div className="panel__head">
            <h2 id="ins-replay">Replay rollout, December 2026</h2>
            <p>Planning estimate from this year&rsquo;s player base. Rates are assumptions to replace with pilot results.</p>
          </div>
          <ol className="funnel">
            {funnel.map((f) => (
              <li key={f.label}>
                <span className="funnel__label">{f.label}</span>
                <span className="funnel__track">
                  <span className="funnel__bar" style={{ width: `${(f.value / funnel[0].value) * 100}%` }} />
                </span>
                <span className="funnel__val">{int(f.value)}</span>
              </li>
            ))}
          </ol>
          <p className="calm-note">
            <strong>{int(r.restrained)}</strong> eligible players ({(r.restrainedShare * 100).toFixed(1)}%) see only the private
            summary with limits, breaks and support, and never get a share card.
          </p>
        </section>

        <section className="panel" aria-labelledby="ins-promo">
          <div className="panel__head">
            <h2 id="ins-promo">Network promotions you joined</h2>
            <p>Participation = players who placed a qualifying bet ÷ players who registered.</p>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Promotion</th>
                  <th scope="col" className="num">
                    Registered
                  </th>
                  <th scope="col" className="num">
                    Active
                  </th>
                  <th scope="col" className="num">
                    Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {o.promos.map((p) => (
                  <tr key={p.name}>
                    <td>
                      {p.name}
                      <small>{p.dates}</small>
                    </td>
                    <td className="num">{int(p.registered)}</td>
                    <td className="num">{int(p.active)}</td>
                    <td className="num">{p.participation}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <dl className="kv kv--spaced">
            <div>
              <dt>Sessions per player / month</dt>
              <dd>
                {o.ns26.sessionsPerMonth} · {bmLabel} {o.bm26.sessionsPerMonth}
              </dd>
            </div>
            <div>
              <dt>GGR per active player / month</dt>
              <dd>
                ${o.ns26.ggrPerPlayerMonth.toFixed(2)} · {bmLabel} ${o.bm26.ggrPerPlayerMonth.toFixed(2)}
              </dd>
            </div>
          </dl>
        </section>
      </div>

      <p className="ins-foot">
        How these are calculated: rounds = monthly active players × rounds per player; stakes = rounds × average bet; payouts =
        stakes × realised RTP; GGR = stakes − payouts. 2026 covers January to September; growth compares the same months of 2025.
      </p>
    </div>
  );
}
