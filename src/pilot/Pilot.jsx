import { useLayoutEffect, useMemo, useState } from 'react';
import Story, { NorthstarMark } from '../components/Story.jsx';
import PartnerStory, { PARTNER_SLIDES } from './PartnerStory.jsx';
import PartnerNumbers from './PartnerNumbers.jsx';
import { PARTNER_SITES, derivePartner } from '../partnerData.js';
import Activity from '../components/Activity.jsx';
import GameArt from '../components/GameArt.jsx';
import { REPLAY_DATA, RESTRAINED_MODE_LOSS_THRESHOLD, deriveReplay, formatMoney } from '../data.js';
import { usePrefersReducedMotion } from '../hooks.js';

/*
 * Operator pilot: how one operator (the fictional Northstar Casino) would see
 * SPRIBE Replay running inside its own site. The Replay itself is the same
 * component tree as the standalone prototype, rendered inside a device frame.
 */

const CHAPTERS = [
  'Opening',
  'Favourite game',
  'Your lineup',
  'New discoveries',
  'Then vs now',
  'Player personality',
  'Closing',
];

function Segmented({ label, value, options, onChange, id }) {
  return (
    <div className="seg" role="radiogroup" aria-labelledby={`${id}-l`}>
      <span className="seg__label" id={`${id}-l`}>
        {label}
      </span>
      <div className="seg__opts">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={value === o.value}
            className={value === o.value ? 'is-on' : ''}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Lobby({ replay, onOpen, compact }) {
  const restrained = replay.mode === 'restrained';
  return (
    <div className="ns-site">
      <header className="ns-header">
        <NorthstarMark />
        {!compact && (
          <nav className="ns-nav" aria-label="Northstar Casino (demo)">
            <span>Lobby</span>
            <span className="is-on">SPRIBE games</span>
            <span>My account</span>
          </nav>
        )}
        <span className="ns-avatar" aria-label="Signed in as Demo player">
          DP
        </span>
      </header>

      <main className="ns-main">
        {restrained ? (
          <section className="ns-entry ns-entry--calm" aria-labelledby="entry-h">
            <div>
              <p className="ns-entry__eyebrow">My account</p>
              <h2 id="entry-h">Your {replay.year} SPRIBE summary is available</h2>
              <p>A private overview of your SPRIBE activity on this account this year.</p>
            </div>
            <button type="button" className="ns-btn ns-btn--calm" onClick={() => onOpen(0)}>
              View summary
            </button>
          </section>
        ) : (
          <section className="ns-entry" aria-labelledby="entry-h">
            <div className="ns-entry__copy">
              <p className="ns-entry__eyebrow">New · SPRIBE Replay {replay.year}</p>
              <h2 id="entry-h">
                Your {replay.year}, <em>in play.</em>
              </h2>
              <p>Your year with SPRIBE games, told in seven short chapters.</p>
              <button type="button" className="ns-btn" onClick={() => onOpen(0)}>
                Open my Replay
              </button>
            </div>
            <svg className="ns-entry__flight" viewBox="0 0 300 140" aria-hidden="true">
              <path d="M6 132 C 110 128, 190 96, 262 26" />
              <g transform="translate(266 22) rotate(-42)">
                <path d="M-14 0 L10 -2.6 Q14 0 10 2.6 Z M-2 -2 L-6 -12 L-1 -12 L4 -2 Z M-2 2 L-6 12 L-1 12 L4 2 Z" />
              </g>
            </svg>
          </section>
        )}

        <section aria-labelledby="games-h">
          <h3 className="ns-h3" id="games-h">
            SPRIBE games
          </h3>
          <ul className="ns-tiles" role="list">
            {replay.games.map((g) => (
              <li key={g.id} className="ns-tile">
                <span className="ns-tile__art">
                  <GameArt id={g.id} />
                </span>
                <span>{g.name}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="ns-account" aria-labelledby="acct-h">
          <h3 className="ns-h3" id="acct-h">
            My account
          </h3>
          <ul role="list">
            <li>
              <button type="button" onClick={() => onOpen(0)}>
                {restrained ? `${replay.year} SPRIBE summary` : `SPRIBE Replay ${replay.year}`}
                <span aria-hidden="true">›</span>
              </button>
            </li>
            <li>
              <span>Limits</span>
            </li>
            <li>
              <span>Take a break</span>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}

export default function Pilot() {
  const [tab, setTab] = useState('player'); // player | partner
  const [siteId, setSiteId] = useState(PARTNER_SITES[0].id);
  const [partnerScreen, setPartnerScreen] = useState('story'); // story | numbers
  const [partnerStart, setPartnerStart] = useState({ slide: 0, n: 0 });
  const partner = useMemo(() => derivePartner(PARTNER_SITES.find((x) => x.id === siteId)), [siteId]);
  const openPartner = (slide) => {
    setPartnerStart((st) => ({ slide, n: st.n + 1 }));
    setPartnerScreen('story');
  };
  const [scenario, setScenario] = useState('normal');
  const [device, setDevice] = useState(() => (window.innerWidth < 900 ? 'mobile' : 'desktop'));
  const [motion, setMotion] = useState('system');
  const [screen, setScreen] = useState('lobby'); // lobby | replay | activity
  const [startAt, setStartAt] = useState({ slide: 0, n: 0 });

  const replay = useMemo(() => deriveReplay(REPLAY_DATA, scenario), [scenario]);
  const restrained = replay.mode === 'restrained';
  const systemReduced = usePrefersReducedMotion();
  const reducedMotion = motion === 'reduce' || (motion === 'system' && systemReduced);

  useLayoutEffect(() => {
    document.documentElement.dataset.motion = reducedMotion ? 'reduce' : 'full';
  }, [reducedMotion]);

  const open = (slide) => {
    setStartAt((s) => ({ slide, n: s.n + 1 }));
    setScreen('replay');
  };
  const close = () => setScreen('lobby');

  let content;
  if (screen === 'lobby') {
    content = <Lobby replay={replay} onOpen={open} compact={device === 'mobile'} />;
  } else if (restrained) {
    content = (
      <div className="replay-root">
        <Activity replay={replay} variant="restrained" onClose={close} />
      </div>
    );
  } else if (screen === 'activity') {
    content = (
      <div className="replay-root">
        <Activity replay={replay} onBack={() => setScreen('replay')} />
      </div>
    );
  } else {
    content = (
      <div className="replay-root">
        <Story
          key={startAt.n}
          replay={replay}
          reducedMotion={reducedMotion}
          initialSlide={startAt.slide}
          onClose={close}
          onViewActivity={() => setScreen('activity')}
        />
      </div>
    );
  }

  const net = replay.statements.at(-1).net;

  return (
    <div className="pilot">
      <header className="pilot-bar">
        <div className="pilot-bar__title">
          <strong>SPRIBE Replay {replay.year}</strong>
          <span>{tab === 'partner' ? 'Partner pilot · 5 fictional sites' : 'Operator pilot · Northstar Casino'}</span>
        </div>
        <div className="pilot-tabs" role="tablist" aria-label="Pilot views">
          {[
            ['player', 'Player Replay'],
            ['partner', 'Partner Replay'],
          ].map(([v, l]) => (
            <button key={v} type="button" role="tab" aria-selected={tab === v} className={tab === v ? 'is-on' : ''} onClick={() => setTab(v)}>
              {l}
            </button>
          ))}
        </div>
        <div className="pilot-bar__controls">
          {tab === 'partner' && (
            <label className="seg site-pick">
              <span className="seg__label">Site</span>
              <select
                value={siteId}
                onChange={(e) => {
                  setSiteId(e.target.value);
                  openPartner(0);
                }}
              >
                {PARTNER_SITES.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name} · {x.country}
                  </option>
                ))}
              </select>
            </label>
          )}
          <Segmented
            id="device"
            label="Preview"
            value={device}
            onChange={setDevice}
            options={[
              { value: 'desktop', label: 'Desktop' },
              { value: 'mobile', label: 'Mobile' },
            ]}
          />
          {tab === 'player' && (
          <Segmented
            id="scenario"
            label="Player"
            value={scenario}
            onChange={(v) => {
              setScenario(v);
              setScreen('lobby');
            }}
            options={[
              { value: 'normal', label: 'Standard' },
              { value: 'highLoss', label: 'High-loss' },
            ]}
          />
          )}
          <Segmented
            id="motion"
            label="Motion"
            value={motion}
            onChange={setMotion}
            options={[
              { value: 'system', label: 'System' },
              { value: 'reduce', label: 'Reduced' },
            ]}
          />
        </div>
      </header>

      <div className="pilot-body" hidden={tab !== 'partner'}>
        <section className="stage" aria-label="Partner Replay preview">
          <div className={`device device--${device}`}>
            {device === 'desktop' ? (
              <div className="device__chrome" aria-hidden="true">
                <span className="dots">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="url">partner-hub.example/replay-2026/{partner.site.id}</span>
              </div>
            ) : (
              <div className="device__notch" aria-hidden="true" />
            )}
            <div className="device__screen">
              <div className="replay-root">
                {partnerScreen === 'numbers' ? (
                  <PartnerNumbers p={partner} onBack={() => openPartner(PARTNER_SLIDES.length - 1)} />
                ) : (
                  <PartnerStory
                    key={`${siteId}-${partnerStart.n}`}
                    p={partner}
                    reducedMotion={reducedMotion}
                    initialSlide={partnerStart.slide}
                    onNumbers={() => setPartnerScreen('numbers')}
                  />
                )}
              </div>
            </div>
          </div>
          <p className="stage__caption">What a partner&rsquo;s team sees at the end of the year. Click through it, or pick another site above.</p>
        </section>

        <aside className="brief" aria-label="Partner site profile">
          <div className="brief__head">
            <p className="brief__kicker">Partner Replay · site profile</p>
            <h1>{partner.site.name}</h1>
            <p className="brief__lede">
              A fictional SPRIBE partner in {partner.site.city}, {partner.site.country}. Every figure is invented and calibrated to
              typical Aviator traffic.
            </p>
          </div>

          <section className="brief__block">
            <h2>At a glance</h2>
            <dl className="kv">
              <div>
                <dt>Country</dt>
                <dd>
                  {partner.site.cc} · {partner.site.country}
                </dd>
              </div>
              <div>
                <dt>SPRIBE partner since</dt>
                <dd>{partner.site.spribeSince}</dd>
              </div>
              <div>
                <dt>Players in 2026</dt>
                <dd>{partner.site.uniquePlayers[2026].toLocaleString('en-US')}</dd>
              </div>
              <div>
                <dt>GGR in 2026</dt>
                <dd>${(partner.y26.ggr / 1e6).toFixed(2)}M</dd>
              </div>
              <div>
                <dt>Personality</dt>
                <dd>{partner.personality.title}</dd>
              </div>
            </dl>
          </section>

          <section className="brief__block">
            <h2>{partner.site.country} market</h2>
            <dl className="kv">
              <div>
                <dt>SPRIBE operators</dt>
                <dd>{partner.market.operators}</dd>
              </div>
              <div>
                <dt>Avg monthly players / operator</dt>
                <dd>{partner.market.mau.toLocaleString('en-US')}</dd>
              </div>
              <div>
                <dt>Avg GGR / operator</dt>
                <dd>${(partner.market.ggr / 1e6).toFixed(2)}M</dd>
              </div>
              <div>
                <dt>Market GGR growth</dt>
                <dd>+{partner.market.ggrGrowth}%</dd>
              </div>
            </dl>
          </section>

          <section className="brief__block">
            <h2>Chapters</h2>
            <ol className="chapters">
              {PARTNER_SLIDES.map((c, i) => (
                <li key={c.id}>
                  <button type="button" onClick={() => openPartner(i)}>
                    <span className="chapters__n">{i + 1}</span>
                    {c.label}
                  </button>
                </li>
              ))}
              <li>
                <button type="button" onClick={() => setPartnerScreen('numbers')}>
                  <span className="chapters__n">+</span>
                  All the numbers
                </button>
              </li>
            </ol>
          </section>
        </aside>
      </div>

      <div className="pilot-body" hidden={tab !== 'player'}>
        <section className="stage" aria-label="Player view preview">
          <div className={`device device--${device}`}>
            {device === 'desktop' ? (
              <div className="device__chrome" aria-hidden="true">
                <span className="dots">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="url">northstar-casino.example/{screen === 'lobby' ? 'lobby' : 'account/replay-2026'}</span>
              </div>
            ) : (
              <div className="device__notch" aria-hidden="true" />
            )}
            <div className="device__screen" data-portal-root>
              {content}
            </div>
          </div>
          <p className="stage__caption">
            Live preview of what a Northstar player sees. Click through it: it is the working prototype.
          </p>
        </section>

        <aside className="brief" aria-label="Operator brief">
          <div className="brief__head">
            <p className="brief__kicker">Northstar Casino · pilot brief</p>
            <h1>How Replay runs on your site</h1>
            <p className="brief__lede">
              Northstar Casino is a fictional operator and every figure here is invented. Use the controls above to see each player
              state.
            </p>
          </div>

          <section className="brief__block">
            <h2>Player state in this preview</h2>
            <dl className="kv">
              <div>
                <dt>Scenario</dt>
                <dd>{scenario === 'normal' ? 'Standard' : 'High-loss'}</dd>
              </div>
              <div>
                <dt>{replay.year} net result</dt>
                <dd>{formatMoney(net)}</dd>
              </div>
              <div>
                <dt>Presentation</dt>
                <dd>
                  <span className={`chip ${restrained ? 'chip--calm' : 'chip--story'}`}>
                    {restrained ? 'Private summary only' : 'Replay story'}
                  </span>
                </dd>
              </div>
            </dl>
            <p className="brief__note">
              Players whose {replay.year} net loss on SPRIBE games reaches {formatMoney(RESTRAINED_MODE_LOSS_THRESHOLD)} never see the
              story or a share card. They get a calm summary with limits, breaks and support.
            </p>
          </section>

          <section className="brief__block">
            <h2>Story chapters</h2>
            {restrained ? (
              <p className="brief__note">Hidden for this player.</p>
            ) : (
              <ol className="chapters">
                {CHAPTERS.map((c, i) => (
                  <li key={c}>
                    <button type="button" onClick={() => open(i)}>
                      <span className="chapters__n">{i + 1}</span>
                      {c}
                    </button>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section className="brief__block">
            <h2>Entry points</h2>
            <ul className="ticks">
              <li>Lobby banner, shown once the year&rsquo;s data is ready</li>
              <li>My account &rsaquo; {restrained ? `${replay.year} SPRIBE summary` : `SPRIBE Replay ${replay.year}`}</li>
            </ul>
          </section>

          <section className="brief__block">
            <h2>Guardrails</h2>
            <ul className="ticks">
              <li>No deposit, bonus or &ldquo;play now&rdquo; buttons anywhere in Replay</li>
              <li>Share card carries the personality and game names only</li>
              <li>Stakes, payouts and results sit in a private statement behind &ldquo;View my activity&rdquo;</li>
              <li>Figures cover SPRIBE games on this account only, with the calculation shown</li>
              <li>Respects reduced-motion settings; full keyboard support</li>
            </ul>
          </section>

          <section className="brief__block">
            <h2>Data the operator supplies</h2>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th scope="col">Field</th>
                    <th scope="col">Per</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Rounds by SPRIBE game</td>
                    <td>player · year</td>
                  </tr>
                  <tr>
                    <td>Active days</td>
                    <td>player · year</td>
                  </tr>
                  <tr>
                    <td>Total stakes, total payouts</td>
                    <td>player · year</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="brief__note">Totals, changes and net results are calculated by Replay from these fields.</p>
          </section>
        </aside>
      </div>

      <footer className="pilot-foot">
        Concept prototype for discussion. Not a live product, not real player data, and not an official SPRIBE release.
      </footer>
    </div>
  );
}
