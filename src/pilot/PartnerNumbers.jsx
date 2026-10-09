import { compact, hour, int } from './PartnerStory.jsx';

/* "All the numbers": the complete, neutral figures behind the Partner Replay,
   in the calm statement style. Market = illustrative average operator. */

const pct = (from, to) => (from ? Math.round(((to - from) / from) * 1000) / 10 : null);
const signed = (p) => (p === null || p === undefined ? '—' : `${p > 0 ? '+' : p < 0 ? '−' : ''}${Math.abs(p)}%`);
const money = (n) => compact(n, true);
const usd2 = (n) => `$${n.toFixed(2)}`;
const pc1 = (r) => `${(r * 100).toFixed(1)}%`;

export default function PartnerNumbers({ p, onBack }) {
  const { site: s, y25, y26, market: m } = p;
  const mStakes = m.rounds * m.avgBet;
  const rows = [
    ['Players', [
      ['Unique players', int(s.uniquePlayers[2026]), int(s.uniquePlayers[2025]), '—', null],
      ['Average monthly active players', int(s.mau[2026]), int(s.mau[2025]), int(m.mau), pct(m.mau, s.mau[2026])],
      ['New players', int(s.newPlayers), '—', '—', null],
      ['Month-1 retention, new players', `${s.retentionM1}%`, '—', `${m.retentionM1}%`, null],
    ]],
    ['Traffic', [
      ['Rounds', compact(y26.rounds), compact(y25.rounds), compact(m.rounds), pct(m.rounds, y26.rounds)],
      ['Rounds per player per month', int(s.roundsPerPlayerMonth[2026]), int(s.roundsPerPlayerMonth[2025]), int(m.roundsPerPlayerMonth), pct(m.roundsPerPlayerMonth, s.roundsPerPlayerMonth[2026])],
      ['Visits per player per month', s.sessionsPerMonth, '—', '—', null],
      ['Average visit length', `${s.sessionMinutes} min`, '—', `${m.sessionMinutes} min`, null],
      ['Rounds on mobile', `${s.mobileShare}%`, '—', `${m.mobileShare}%`, null],
      ['Peak hour (local)', hour(s.peakHour), '—', '—', null],
      ['Record day', `${compact(s.recordDay.rounds)} rounds`, '—', '—', null],
    ]],
    ['Money (USD)', [
      ['Average bet', usd2(s.avgBet[2026]), usd2(s.avgBet[2025]), usd2(m.avgBet), pct(m.avgBet, s.avgBet[2026])],
      ['Total stakes', money(y26.stakes), money(y25.stakes), money(mStakes), pct(mStakes, y26.stakes)],
      ['Total payouts', money(y26.payouts), money(y25.payouts), money(mStakes * m.rtp), null],
      ['Realised RTP (payouts ÷ stakes)', pc1(s.rtp[2026]), pc1(s.rtp[2025]), pc1(m.rtp), null],
      ['GGR (stakes − payouts)', money(y26.ggr), money(y25.ggr), money(m.ggr), pct(m.ggr, y26.ggr)],
      ['GGR growth on 2025', signed(p.growth.ggr), '—', `+${m.ggrGrowth}%`, null],
    ]],
  ];

  return (
    <div className="statement">
      <div className="statement__wrap">
        <header className="statement__head">
          <div className="statement__meta">
            <span className="statement__op">{s.name}</span>
            <span className="statement__tag">
              {s.cc} · {s.country}
            </span>
            <span className="statement__tag">Fictional demo data</span>
          </div>
          <button type="button" className="btn-calm btn-calm--link" onClick={onBack}>
            ← Back to the recap
          </button>
        </header>
        <h1 className="statement__title">All the numbers</h1>
        <p className="statement__sub">
          SPRIBE games on {s.name}, 1 Jan – 31 Dec 2026{p.growth.partialPrevYear ? ` (2025 covers ${s.monthsLive[2025]} months live)` : ''}.
          &ldquo;{s.country} avg&rdquo; is an illustrative average of {m.operators} SPRIBE operators in {s.country}.
        </p>
        {rows.map(([group, list]) => (
          <section className="stmt-year" key={group} aria-labelledby={`g-${group}`}>
            <div className="stmt-year__head">
              <h3 id={`g-${group}`}>{group}</h3>
            </div>
            <div className="table-wrap">
              <table className="num-table">
                <thead>
                  <tr>
                    <th scope="col">Metric</th>
                    <th scope="col">2026</th>
                    <th scope="col">2025</th>
                    <th scope="col">{s.country} avg</th>
                    <th scope="col">vs avg</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map(([label, a, b, c, d]) => (
                    <tr key={label}>
                      <th scope="row">{label}</th>
                      <td>{a}</td>
                      <td>{b}</td>
                      <td>{c}</td>
                      <td>{signed(d)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
        <section className="stmt-explainer">
          <h3>How these are calculated</h3>
          <dl>
            <dt>Rounds</dt>
            <dd>Average monthly active players × months live × rounds per player per month.</dd>
            <dt>Stakes, payouts, GGR</dt>
            <dd>Stakes = rounds × average bet. Payouts = stakes × realised RTP. GGR = stakes − payouts.</dd>
            <dt>Market average</dt>
            <dd>The same measures for an average SPRIBE operator in {s.country}. Illustrative, invented for this pilot.</dd>
          </dl>
        </section>
        <p className="statement__foot">Concept prototype. {s.name} is a fictional site and every figure on this page is invented.</p>
      </div>
    </div>
  );
}
