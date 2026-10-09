import { StoryShell, DemoPill, ReplayIcon, Arrow } from '../components/Story.jsx';
import GameArt, { GAME_ACCENTS } from '../components/GameArt.jsx';

/*
 * Partner Replay: an end-of-year, Wrapped-style story for a partner site.
 * Celebratory and light; comparisons with the market only highlight where the
 * site did well. The complete, neutral figures live in PartnerNumbers.
 */

const GAME_IDS = { Aviator: 'aviator', Mines: 'mines', Plinko: 'plinko', Goal: 'goal', 'Pilot Chicken': 'pilot-chicken' };

export const int = (n) => Math.round(n).toLocaleString('en-US');
export function compact(n, money = false) {
  const abs = Math.abs(n);
  const [d, s] = abs >= 1e9 ? [1e9, 'B'] : abs >= 1e6 ? [1e6, 'M'] : abs >= 1e3 ? [1e3, 'k'] : [1, ''];
  const digits = s === 'M' && n / d < 10 ? 2 : s ? 1 : 0;
  return `${money ? '$' : ''}${(n / d).toFixed(digits).replace(/\.0+$/, '')}${s}`;
}
export const hour = (h) => `${String(h).padStart(2, '0')}:00`;
const plus = (p) => `${p > 0 ? '+' : p < 0 ? '−' : ''}${Math.abs(p)}%`;
const times = (growthPct) => `${(growthPct / 100 + 1).toFixed(1)}×`;

function CountryChip({ site }) {
  return (
    <span className="cc-chip">
      <b>{site.cc}</b>
      {site.city}, {site.country}
    </span>
  );
}

/* ---------- slides ---------- */

function Opening({ p, onNext }) {
  const { site } = p;
  return (
    <div className="slide-inner slide-inner--center">
      <p className="wordmark reveal" style={{ '--d': 0 }}>
        SPRIBE <span>Partner Replay</span> 2026
      </p>
      <div className="reveal" style={{ '--d': 1 }}>
        <CountryChip site={site} />
      </div>
      <h1 className="display display--md reveal" style={{ '--d': 2 }}>
        {site.name},
        <br />
        <em>what a year.</em>
      </h1>
      <p className="lede reveal" style={{ '--d': 3 }}>
        Your 2026 with SPRIBE games: who played, when they played, what they loved, and how {site.country} compares.
      </p>
      <div className="reveal" style={{ '--d': 4 }}>
        <DemoPill>Fictional site · invented data</DemoPill>
      </div>
      <button type="button" className="btn btn--primary reveal" style={{ '--d': 5 }} onClick={onNext}>
        Start the recap <Arrow />
      </button>
    </div>
  );
}

function VersusBars({ you, market, label, fmt = int, country }) {
  const max = Math.max(you, market);
  return (
    <div className="vs-bars" role="img" aria-label={`${label}: you ${fmt(you)}, ${country} average ${fmt(market)}`}>
      <p className="vs-bars__label">{label}</p>
      {[
        ['You', you, 'var(--c-ns)'],
        [`${country} avg`, market, 'var(--c-bm)'],
      ].map(([l, v, c]) => (
        <div className="vs-bars__row" key={l}>
          <span className="vs-bars__who">{l}</span>
          <span className="vs-bars__track">
            <span className="vs-bars__bar" style={{ width: `${(v / max) * 100}%`, background: c }} />
          </span>
          <span className="vs-bars__val">{fmt(v)}</span>
        </div>
      ))}
    </div>
  );
}

function Players({ p }) {
  const { site, growth, vsMarket } = p;
  const ahead = vsMarket.mau > 0;
  return (
    <div className="slide-inner">
      <p className="eyebrow reveal" style={{ '--d': 0 }}>
        Your crew
      </p>
      <h2 className="headline reveal" style={{ '--d': 1 }}>
        <span className="accent-violet">{int(site.uniquePlayers[2026])}</span> players took off with SPRIBE at {site.name}.
      </h2>
      <div className="stat-row reveal" style={{ '--d': 2 }}>
        <div className="stat">
          <span className="stat__num">{int(site.mau[2026])}</span>
          <span className="stat__label">active every month, on average</span>
        </div>
        <div className="stat">
          <span className="stat__num">{int(site.newPlayers)}</span>
          <span className="stat__label">first-timers joined in 2026</span>
        </div>
        <div className="stat">
          <span className="stat__num">{plus(growth.mau)}</span>
          <span className="stat__label">monthly players vs 2025</span>
        </div>
      </div>
      <div className="reveal" style={{ '--d': 3 }}>
        {ahead ? (
          <VersusBars label={`Monthly players vs the average ${site.country} operator`} you={site.mau[2026]} market={site.market.mau} country={site.country} />
        ) : (
          <p className="fun-note">
            Still climbing: your monthly crowd grew <strong>{plus(growth.mau)}</strong> on 2025.
          </p>
        )}
      </div>
    </div>
  );
}

function Traffic({ p }) {
  const { site, y26 } = p;
  const perSec = p.perSecond >= 1 ? `${p.perSecond.toFixed(1)} every second` : `one every ${(1 / p.perSecond).toFixed(1)} seconds`;
  const laps =
    p.earthLaps >= 1 ? `${p.earthLaps.toFixed(1)} laps of the Earth` : `${Math.round(p.earthLaps * 100)}% of the way around the Earth`;
  return (
    <div className="slide-inner">
      <p className="eyebrow reveal" style={{ '--d': 0 }}>
        Traffic
      </p>
      <h2 className="headline reveal" style={{ '--d': 1 }}>
        {compact(y26.rounds)} rounds. That&rsquo;s {perSec}, all year long.
      </h2>
      <div className="fact-grid">
        <div className="fact reveal" style={{ '--d': 2 }}>
          <span className="fact__kicker">If every round were a step</span>
          <span className="fact__big">{laps}</span>
          <svg className="fact__globe" viewBox="0 0 60 60" aria-hidden="true">
            <circle cx="30" cy="30" r="22" />
            <ellipse cx="30" cy="30" rx="10" ry="22" />
            <line x1="8" y1="30" x2="52" y2="30" />
            <circle className="fact__orbit" cx="30" cy="30" r="28" pathLength="1" style={{ '--p': Math.min(1, p.earthLaps % 1 || 1) }} />
          </svg>
        </div>
        <div className="fact reveal" style={{ '--d': 2.6 }}>
          <span className="fact__kicker">Record day</span>
          <span className="fact__big">{compact(site.recordDay.rounds)} rounds</span>
          <span className="fact__small">{site.recordDay.date}</span>
        </div>
        <div className="fact reveal" style={{ '--d': 3.2 }}>
          <span className="fact__kicker">Per player, per month</span>
          <span className="fact__big">{int(site.roundsPerPlayerMonth[2026])} rounds</span>
          <span className="fact__small">
            across {site.sessionsPerMonth} visits of about {site.sessionMinutes} minutes
          </span>
        </div>
      </div>
    </div>
  );
}

function PrimeTime({ p }) {
  const { site, hourly } = p;
  const max = Math.max(...hourly);
  return (
    <div className="slide-inner">
      <p className="eyebrow reveal" style={{ '--d': 0 }}>
        Prime time
      </p>
      <h2 className="headline reveal" style={{ '--d': 1 }}>
        Your runway is busiest at <span className="accent-violet">{hour(site.peakHour)}</span>.
      </h2>
      <div className="clock-bars reveal" style={{ '--d': 2 }} role="img" aria-label={`Share of rounds by hour; peak at ${hour(site.peakHour)}`}>
        {hourly.map((v, h) => (
          <span key={h} className={`clock-bars__bar ${h === site.peakHour ? 'is-peak' : ''}`} style={{ height: `${(v / max) * 100}%`, '--i': h }}>
            {h === site.peakHour && <i>{hour(h)}</i>}
          </span>
        ))}
      </div>
      <div className="clock-axis reveal" style={{ '--d': 2 }} aria-hidden="true">
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>23:00</span>
      </div>
      <div className="stat-row reveal" style={{ '--d': 3 }}>
        <div className="stat">
          <span className="stat__num">{site.busiestDay}s</span>
          <span className="stat__label">your biggest day of the week</span>
        </div>
        <div className="stat">
          <span className="stat__num">{site.mobileShare}%</span>
          <span className="stat__label">of rounds played on a phone</span>
        </div>
      </div>
    </div>
  );
}

function Ggr({ p }) {
  const { site, y26, growth, monthlyGgr, bestMonth, vsMarket } = p;
  const max = Math.max(...monthlyGgr);
  const letters = 'JFMAMJJASOND';
  return (
    <div className="slide-inner">
      <p className="eyebrow reveal" style={{ '--d': 0 }}>
        GGR
      </p>
      <h2 className="headline reveal" style={{ '--d': 1 }}>
        SPRIBE games brought in <span className="accent-violet">{compact(y26.ggr, true)}</span> GGR.
      </h2>
      <div className="pill-row reveal" style={{ '--d': 2 }}>
        <span className="pill pill--up">
          {plus(growth.ggr)} on 2025{growth.partialPrevYear ? ' (first full year)' : ''}
        </span>
        <span className="pill">
          {site.country} market: +{site.market.ggrGrowth}%
        </span>
        {vsMarket.ggr > 0 && <span className="pill">{plus(vsMarket.ggr)} vs the average {site.country} operator</span>}
      </div>
      <div className="month-bars reveal" style={{ '--d': 3 }} role="img" aria-label={`Monthly GGR in 2026; best month ${bestMonth}`}>
        {monthlyGgr.map((v, i) => {
          const best = v === max;
          return (
            <span key={i} className={`month-bars__col ${best ? 'is-best' : ''}`}>
              <span className="month-bars__bar" style={{ height: `${(v / max) * 100}%`, '--i': i }}>
                {best && <i>{compact(v, true)}</i>}
              </span>
              <small>{letters[i]}</small>
            </span>
          );
        })}
      </div>
      <p className="fun-note reveal" style={{ '--d': 4 }}>
        Best month: <strong>{bestMonth}</strong>, home of your record day.
      </p>
    </div>
  );
}

function Lineup({ p }) {
  const { site, games, risingStar, newGames } = p;
  const top = games[0];
  return (
    <div className="slide-inner">
      <p className="eyebrow reveal" style={{ '--d': 0 }}>
        The lineup
      </p>
      <h2 className="headline reveal" style={{ '--d': 1 }}>
        {top.name} led the way with {top.share}% of rounds.
      </h2>
      <div className="lineup-split">
      <ul className="mix" role="list">
        {games.map((g, i) => (
          <li key={g.name} className="mix__row reveal" style={{ '--d': 2 + i * 0.3 }}>
            <span className="mix__icon">{GAME_IDS[g.name] ? <GameArt id={GAME_IDS[g.name]} /> : <span className="mix__dots" aria-hidden="true" />}</span>
            <span className="mix__name">
              {g.name}
              {g.isNew && <span className="tag tag--new">New</span>}
            </span>
            <span className="mix__track">
              <span className="mix__bar" style={{ width: `${(g.share / top.share) * 100}%`, background: GAME_ACCENTS[GAME_IDS[g.name]] || '#8b8fb5' }} />
            </span>
            <span className="mix__val">{g.share}%</span>
          </li>
        ))}
      </ul>
      <div className="star-card reveal" style={{ '--d': 4 }}>
        <span className="star-card__kicker">Rising star</span>
        <strong>{risingStar.name}</strong>
        <span>
          {risingStar.growth >= 100 ? `${times(risingStar.growth)} the rounds of 2025` : `${plus(risingStar.growth)} rounds on 2025`}
          {newGames.length > 0 && ` · New on ${site.name}: ${newGames.join(', ')}`}
        </span>
      </div>
      </div>
    </div>
  );
}

function MarketWins({ p }) {
  const { site, market, growth } = p;
  const s = site;
  const wins = [
    s.mau[2026] > market.mau && { big: `${plus(p.vsMarket.mau)}`, text: `more monthly players than the average ${s.country} operator` },
    growth.ggr > market.ggrGrowth && { big: `${plus(growth.ggr)}`, text: `GGR growth, against +${market.ggrGrowth}% for the ${s.country} market` },
    s.avgBet[2026] > market.avgBet && { big: `$${s.avgBet[2026].toFixed(2)}`, text: `average bet (market $${market.avgBet.toFixed(2)})` },
    s.roundsPerPlayerMonth[2026] > market.roundsPerPlayerMonth && {
      big: int(s.roundsPerPlayerMonth[2026]),
      text: `rounds per player each month (market ${int(market.roundsPerPlayerMonth)})`,
    },
    s.sessionMinutes > market.sessionMinutes && { big: `+${s.sessionMinutes - market.sessionMinutes} min`, text: `longer visits than the market average` },
    s.mobileShare > market.mobileShare && { big: `${s.mobileShare}%`, text: `of rounds on mobile (market ${market.mobileShare}%)` },
    s.retentionM1 > market.retentionM1 && { big: `${s.retentionM1}%`, text: `of new players came back the next month (market ${market.retentionM1}%)` },
  ].filter(Boolean);
  return (
    <div className="slide-inner">
      <p className="eyebrow reveal" style={{ '--d': 0 }}>
        You vs {s.country}
      </p>
      <h2 className="headline reveal" style={{ '--d': 1 }}>
        Where {s.name} flew higher than the market.
      </h2>
      <ul className="wins" role="list">
        {wins.slice(0, 6).map((w, i) => (
          <li key={w.text} className="win reveal" style={{ '--d': 2 + i * 0.35 }}>
            <span className="win__big">{w.big}</span>
            <span className="win__text">{w.text}</span>
          </li>
        ))}
      </ul>
      <p className="footnote reveal" style={{ '--d': 4 }}>
        Market = average of {market.operators} SPRIBE operators in {s.country} (illustrative). Every comparison is in &ldquo;All the
        numbers&rdquo;.
      </p>
    </div>
  );
}

function Promos({ p }) {
  const { promos } = p;
  return (
    <div className="slide-inner">
      <p className="eyebrow reveal" style={{ '--d': 0 }}>
        Network promotions
      </p>
      <h2 className="headline reveal" style={{ '--d': 1 }}>
        You joined {promos.length === 1 ? 'a network promotion' : `${promos.length} network promotions`} this year.
      </h2>
      <div className="promo-grid">
        {promos.map((pr, i) => (
          <div className="promo-card reveal" key={pr.name} style={{ '--d': 2 + i * 0.6 }}>
            <span className="promo-card__type">{pr.type}</span>
            <strong>{pr.name}</strong>
            <div className="promo-card__nums">
              <span>
                <b>{int(pr.registered)}</b> signed up
              </span>
              <span>
                <b>{int(pr.active)}</b> got playing
              </span>
            </div>
            <div className="promo-card__meter" role="img" aria-label={`Participation ${pr.participation}% vs network ${pr.network}%`}>
              <span className="promo-card__fill" style={{ width: `${pr.participation}%` }} />
              <span className="promo-card__mark" style={{ left: `${pr.network}%` }} />
            </div>
            <span className="promo-card__cap">
              {pr.participation}% took part · network average for {pr.type.toLowerCase()}s {pr.network}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Persona({ p }) {
  const { site, personality } = p;
  return (
    <div className="slide-inner slide-inner--center">
      <p className="eyebrow reveal" style={{ '--d': 0 }}>
        Your site personality
      </p>
      <div className="persona-card reveal" style={{ '--d': 1 }}>
        <svg className="persona-plane" viewBox="0 0 120 60" aria-hidden="true">
          <path d="M4 54 C 40 52, 70 40, 100 12" />
          <g transform="translate(102 10) rotate(-40)">
            <path d="M-12 0 L9 -2 Q12 0 9 2 Z M-2 -1.5 L-5 -10 L-1 -10 L3 -1.5 Z M-2 1.5 L-5 10 L-1 10 L3 1.5 Z" />
          </g>
        </svg>
        <p className="persona-card__kicker">{site.name} is</p>
        <h2 className="persona-card__title">{personality.title}</h2>
        <p className="persona-card__blurb">{personality.line}</p>
        <p className="persona-card__note">
          {site.cc} · SPRIBE partner since {site.spribeSince}
        </p>
      </div>
    </div>
  );
}

function Closing({ p, onReplay, onNumbers }) {
  return (
    <div className="slide-inner slide-inner--center">
      <p className="wordmark wordmark--sm reveal" style={{ '--d': 0 }}>
        SPRIBE <span>Partner Replay</span> 2026
      </p>
      <h2 className="display display--md reveal" style={{ '--d': 1 }}>
        Here&rsquo;s to
        <br />
        <em>2027.</em>
      </h2>
      <p className="lede reveal" style={{ '--d': 2 }}>
        Thanks for flying with us, {p.site.name}. Same runway, new heights.
      </p>
      <div className="btn-row reveal" style={{ '--d': 3 }}>
        <button type="button" className="btn btn--primary" onClick={onReplay}>
          <ReplayIcon /> Replay
        </button>
        <button type="button" className="btn btn--ghost" onClick={onNumbers}>
          See all the numbers
        </button>
      </div>
    </div>
  );
}

export const PARTNER_SLIDES = [
  { id: 'p-opening', label: 'Opening', C: Opening },
  { id: 'p-players', label: 'Your crew', C: Players },
  { id: 'p-traffic', label: 'Traffic', C: Traffic },
  { id: 'p-prime', label: 'Prime time', C: PrimeTime },
  { id: 'p-ggr', label: 'GGR', C: Ggr },
  { id: 'p-lineup', label: 'The lineup', C: Lineup },
  { id: 'p-market', label: 'You vs the market', C: MarketWins },
  { id: 'p-promos', label: 'Network promotions', C: Promos },
  { id: 'p-persona', label: 'Site personality', C: Persona },
  { id: 'p-closing', label: 'Here’s to 2027', C: Closing },
];

export default function PartnerStory({ p, reducedMotion, onNumbers, initialSlide = 0 }) {
  return (
    <StoryShell
      slides={PARTNER_SLIDES}
      ctx={{ p, onNumbers }}
      reducedMotion={reducedMotion}
      initialSlide={initialSlide}
      brand={
        <>
          <span className="northstar">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 1 L14 10 L23 12 L14 14 L12 23 L10 14 L1 12 L10 10 Z" />
            </svg>
            {p.site.name}
          </span>
          <span className="story__brand-sep" aria-hidden="true">
            ·
          </span>
          <span className="story__product">Partner Replay 2026</span>
          <DemoPill />
        </>
      }
    />
  );
}
