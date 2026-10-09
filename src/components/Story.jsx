import { useCallback, useEffect, useRef, useState } from 'react';
import GameArt, { GAME_ACCENTS } from './GameArt.jsx';
import Dialog from './Dialog.jsx';
import ShareCard from './ShareCard.jsx';
import Sky from './Sky.jsx';
import Constellation from './Constellation.jsx';
import { buildShareCardData, formatChange, formatInt } from '../data.js';

/* ---------- Brand bits ---------- */

export function NorthstarMark() {
  return (
    <span className="northstar">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 1 L14 10 L23 12 L14 14 L12 23 L10 14 L1 12 L10 10 Z" />
      </svg>
      Northstar Casino
    </span>
  );
}

export function DemoPill({ children = 'Fictional demo data' }) {
  return <span className="demo-pill">{children}</span>;
}

/* ---------- Slides ---------- */

function Opening({ replay, onNext }) {
  return (
    <div className="slide-inner slide-inner--center">
      <p className="eyebrow reveal" style={{ '--d': 0 }}>
        <NorthstarMark /> <span className="eyebrow__sep">presents</span>
      </p>
      <p className="wordmark reveal" style={{ '--d': 1 }}>
        SPRIBE <span>Replay</span> {replay.year}
      </p>
      <h1 className="display reveal" style={{ '--d': 2 }}>
        Your {replay.year},
        <br />
        <em>in play.</em>
      </h1>
      <p className="lede reveal" style={{ '--d': 3 }}>
        A look back at the SPRIBE games you played at {replay.operator.name} this year.
      </p>
      <div className="reveal" style={{ '--d': 4 }}>
        <DemoPill>Fictional demo data · concept preview</DemoPill>
      </div>
      <button type="button" className="btn btn--primary reveal" style={{ '--d': 5 }} onClick={onNext}>
        Start your Replay
        <Arrow />
      </button>
    </div>
  );
}

function Favorite({ replay }) {
  const fav = replay.favorite;
  return (
    <div className="slide-inner slide-inner--split">
      <div className="fav-visual reveal" style={{ '--d': 1 }}>
        <svg viewBox="0 0 320 240" className="fav-flight" aria-hidden="true">
          <defs>
            <linearGradient id="fav-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ff4d6d" stopOpacity=".35" />
              <stop offset="1" stopColor="#ff4d6d" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g className="fav-grid">
            {[40, 80, 120, 160, 200].map((y) => <line key={y} x1="0" x2="320" y1={y} y2={y} />)}
          </g>
          <path className="fav-area" d="M10 225 C 120 220, 210 170, 280 50 L 280 230 L 10 230 Z" fill="url(#fav-fill)" />
          <path className="fav-line" d="M10 225 C 120 220, 210 170, 280 50" pathLength="1" />
          <g className="fav-plane" transform="translate(282 48) rotate(-50)">
            <path d="M-16 0 L12 -3 Q17 0 12 3 Z" fill="#ff4d6d" />
            <path d="M-2 -2 L-7 -14 L-1 -14 L5 -2 Z M-2 2 L-7 14 L-1 14 L5 2 Z" fill="#ff8fa3" />
          </g>
        </svg>
        <div className="fav-badge">
          <GameArt id={fav.id} />
        </div>
      </div>
      <div>
        <p className="eyebrow reveal" style={{ '--d': 0 }}>Most played</p>
        <h2 className="headline reveal" style={{ '--d': 1 }}>
          <span className="accent-red">{fav.name}</span> was your most played SPRIBE game.
        </h2>
        <div className="stat-row reveal" style={{ '--d': 2 }}>
          <div className="stat">
            <span className="stat__num">{formatInt(fav.roundsThisYear)}</span>
            <span className="stat__label">rounds in {replay.year}</span>
          </div>
          <div className="stat">
            <span className="stat__num">{replay.favoriteShare}%</span>
            <span className="stat__label">of your SPRIBE rounds</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Lineup({ replay }) {
  const [revealed, setRevealed] = useState(() => new Set());
  const toggle = (id) =>
    setRevealed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const allShown = revealed.size === replay.games.length;
  return (
    <div className="slide-inner">
      <p className="eyebrow reveal" style={{ '--d': 0 }}>Your lineup</p>
      <h2 className="headline reveal" style={{ '--d': 1 }}>
        {replay.games.length} SPRIBE games made your {replay.year}.
      </h2>
      <p className="hint reveal" style={{ '--d': 2 }}>Tap a card to see its {replay.year} rounds.</p>
      <ul className="lineup" role="list">
        {replay.games.map((g, i) => {
          const open = revealed.has(g.id);
          return (
            <li key={g.id} className="reveal" style={{ '--d': 2 + i * 0.5 }}>
              <button
                type="button"
                className={`game-card ${open ? 'is-open' : ''}`}
                style={{ '--accent': GAME_ACCENTS[g.id] }}
                aria-pressed={open}
                aria-label={open ? `${g.name}: ${formatInt(g.roundsThisYear)} rounds in ${replay.year}` : `${g.name}. Show ${replay.year} rounds`}
                onClick={() => toggle(g.id)}
              >
                <span className="game-card__art"><GameArt id={g.id} /></span>
                <span className="game-card__name">{g.name}</span>
                <span className="game-card__count" aria-hidden={!open}>
                  {open ? (
                    <>
                      <strong>{formatInt(g.roundsThisYear)}</strong> rounds
                    </>
                  ) : (
                    <span className="game-card__tap">Tap to reveal</span>
                  )}
                </span>
                {g.isNew && <span className="tag tag--new">New</span>}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="lineup-foot reveal" style={{ '--d': 5 }}>
        <span>
          Total: <strong>{formatInt(replay.totalRounds[replay.year])}</strong> rounds
        </span>
        <button
          type="button"
          className="link-btn"
          onClick={() => setRevealed(allShown ? new Set() : new Set(replay.games.map((g) => g.id)))}
        >
          {allShown ? 'Hide all' : 'Reveal all'}
        </button>
      </div>
    </div>
  );
}

function Discoveries({ replay }) {
  const names = replay.newGames.map((g) => g.name);
  return (
    <div className="slide-inner">
      <p className="eyebrow reveal" style={{ '--d': 0 }}>New discoveries</p>
      <h2 className="headline reveal" style={{ '--d': 1 }}>
        {names.join(' and ')} {names.length > 1 ? 'were' : 'was'} new to you in {replay.year}.
      </h2>
      <p className="lede reveal" style={{ '--d': 2 }}>
        You branched out from familiar favourites and explored something different.
      </p>
      <div className="discoveries">
        {replay.newGames.map((g, i) => (
          <div key={g.id} className="disc-card reveal" style={{ '--d': 3 + i, '--accent': GAME_ACCENTS[g.id] }}>
            <span className="disc-card__orbit" aria-hidden="true" />
            <span className="disc-card__art"><GameArt id={g.id} /></span>
            <span className="tag tag--new">First played in {replay.year}</span>
            <span className="disc-card__name">{g.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ThenNow({ replay }) {
  return (
    <div className="slide-inner">
      <p className="eyebrow reveal" style={{ '--d': 0 }}>Then vs now</p>
      <h2 className="headline reveal" style={{ '--d': 1 }}>
        {replay.previousYear} → {replay.year}, side by side.
      </h2>
      <ul className="compare" role="list">
        {replay.comparison.map((row, i) => (
          <li key={row.id} className="compare__row reveal" style={{ '--d': 2 + i * 0.6 }}>
            <span className="compare__label">{row.label}</span>
            <span className="compare__vals">
              <span className="compare__from">
                <small>{replay.previousYear}</small>
                {formatInt(row.from)}
              </span>
              <span className="compare__arrow" aria-hidden="true">→</span>
              <span className="compare__to">
                <small>{replay.year}</small>
                {formatInt(row.to)}
              </span>
            </span>
            <span className="compare__change" aria-label={`Change: ${formatChange(row.change)}`}>
              {formatChange(row.change)}
            </span>
          </li>
        ))}
      </ul>
      <p className="footnote reveal" style={{ '--d': 4 }}>
        Changes are calculated from the values shown. This is a snapshot, not a scoreboard — playing more or for longer isn’t a goal.
      </p>
    </div>
  );
}

function Personality({ replay }) {
  const [preview, setPreview] = useState(false);
  const share = buildShareCardData(replay);
  return (
    <div className="slide-inner slide-inner--center">
      <p className="eyebrow reveal" style={{ '--d': 0 }}>Your player personality</p>
      <div className="persona-card reveal" style={{ '--d': 1 }}>
        <Constellation total={share.lineupNames.length} highlighted={share.newGameNames.length} />
        <p className="persona-card__kicker">You are</p>
        <h2 className="persona-card__title">{share.personality.title}</h2>
        <p className="persona-card__blurb">{share.personality.blurb}</p>
        <p className="persona-card__note">Just for fun — not a ranking.</p>
      </div>
      <button type="button" className="btn btn--ghost reveal" style={{ '--d': 2 }} onClick={() => setPreview(true)}>
        <ShareIcon /> Preview share card
      </button>
      <p className="hint reveal" style={{ '--d': 3 }}>Optional. Contains no betting, account or location details.</p>
      {preview && (
        <Dialog
          title="Share card preview"
          onClose={() => setPreview(false)}
          footer={
            <button type="button" className="btn btn--primary" disabled title="Demo only — nothing is posted">
              Share (disabled in demo)
            </button>
          }
        >
          <ShareCard data={share} />
          <p className="dialog__note">
            This is a mockup. Nothing is posted anywhere. Share cards never include rounds, stakes, payouts, results, account or
            location details.
          </p>
        </Dialog>
      )}
    </div>
  );
}

function Closing({ replay, onReplay, onViewActivity }) {
  return (
    <div className="slide-inner slide-inner--center">
      <p className="wordmark wordmark--sm reveal" style={{ '--d': 0 }}>
        SPRIBE <span>Replay</span> {replay.year}
      </p>
      <h2 className="display display--md reveal" style={{ '--d': 1 }}>
        That was your
        <br />
        <em>SPRIBE Replay.</em>
      </h2>
      <p className="lede reveal" style={{ '--d': 2 }}>Thanks for looking back with us.</p>
      <div className="btn-row reveal" style={{ '--d': 3 }}>
        <button type="button" className="btn btn--primary" onClick={onReplay}>
          <ReplayIcon /> Replay story
        </button>
        <button type="button" className="btn btn--ghost" onClick={onViewActivity}>
          View my activity
        </button>
      </div>
      <p className="hint reveal" style={{ '--d': 4 }}>
        Your activity summary is private and is never part of a share card.
      </p>
    </div>
  );
}

/* ---------- Story shell ---------- */

const SLIDES = [
  { id: 'opening', label: 'Opening', C: Opening },
  { id: 'favorite', label: 'Favourite game', C: Favorite },
  { id: 'lineup', label: 'Your lineup', C: Lineup },
  { id: 'discoveries', label: 'New discoveries', C: Discoveries },
  { id: 'then-now', label: 'Then vs now', C: ThenNow },
  { id: 'personality', label: 'Player personality', C: Personality },
  { id: 'closing', label: 'Closing', C: Closing },
];

export default function Story({ replay, reducedMotion, onViewActivity, initialSlide = 0 }) {
  const [index, setIndex] = useState(initialSlide);
  const [dir, setDir] = useState('fwd');
  const [runId, setRunId] = useState(0);
  const touch = useRef(null);
  const last = SLIDES.length - 1;

  const go = useCallback(
    (to) => {
      const clamped = Math.max(0, Math.min(last, to));
      if (clamped === index) return;
      setDir(clamped > index ? 'fwd' : 'back');
      setIndex(clamped);
    },
    [index, last],
  );
  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);
  const restart = useCallback(() => {
    setDir('back');
    setIndex(0);
    setRunId((n) => n + 1);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (document.querySelector('[aria-modal="true"]')) return;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prev(); }
      else if (e.key === 'Home') { e.preventDefault(); go(0); }
      else if (e.key === 'End') { e.preventDefault(); go(last); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, go, last]);

  const onTouchStart = (e) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e) => {
    if (!touch.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touch.current.x;
    const dy = t.clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) (dx < 0 ? next : prev)();
  };

  const { C, label, id } = SLIDES[index];

  return (
    <div className={`story story--${id}`}>
      <Sky reducedMotion={reducedMotion} />
      <div className="story__glow" aria-hidden="true" />

      <header className="story__top">
        <div className="progress" role="progressbar" aria-label="Story progress" aria-valuemin={1} aria-valuemax={SLIDES.length} aria-valuenow={index + 1} aria-valuetext={`Slide ${index + 1} of ${SLIDES.length}: ${label}`}>
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={`progress__seg ${i < index ? 'is-done' : ''} ${i === index ? 'is-current' : ''}`}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}: ${s.label}`}
              aria-current={i === index ? 'step' : undefined}
            >
              <span />
            </button>
          ))}
        </div>
        <div className="story__brandbar">
          <NorthstarMark />
          <span className="story__brand-sep" aria-hidden="true">·</span>
          <span className="story__product">SPRIBE Replay {replay.year}</span>
          <DemoPill />
          <button type="button" className="icon-btn story__replay" onClick={restart} aria-label="Replay story from the start" title="Replay story">
            <ReplayIcon />
          </button>
        </div>
      </header>

      <main className="story__stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <section
          key={`${runId}-${index}`}
          className={`slide slide--${dir}`}
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${SLIDES.length}: ${label}`}
        >
          <C replay={replay} onNext={next} onReplay={restart} onViewActivity={onViewActivity} />
        </section>
      </main>

      <footer className="story__nav">
        <button type="button" className="nav-btn" onClick={prev} disabled={index === 0} aria-label="Previous slide">
          <Arrow flip /> <span>Back</span>
        </button>
        <span className="story__count" aria-hidden="true">
          <span>
            {index + 1} / {SLIDES.length}
          </span>
          <small>← → keys</small>
        </span>
        {index < last ? (
          <button type="button" className="nav-btn nav-btn--next" onClick={next} aria-label="Next slide">
            <span>Next</span> <Arrow />
          </button>
        ) : (
          <button type="button" className="nav-btn nav-btn--next" onClick={restart} aria-label="Replay story from the start">
            <ReplayIcon /> <span>Replay</span>
          </button>
        )}
      </footer>
      <p className="sr-only" aria-live="polite">{`Slide ${index + 1} of ${SLIDES.length}: ${label}`}</p>
    </div>
  );
}

/* ---------- Icons ---------- */

function Arrow({ flip }) {
  return (
    <svg viewBox="0 0 24 24" className="ico" style={flip ? { transform: 'scaleX(-1)' } : undefined} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
export function ReplayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="ico" aria-hidden="true">
      <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v5h5" />
    </svg>
  );
}
function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" className="ico" aria-hidden="true">
      <path d="M12 3v12M7 8l5-5 5 5M5 14v5h14v-5" />
    </svg>
  );
}
