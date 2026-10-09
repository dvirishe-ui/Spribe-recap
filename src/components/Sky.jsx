import { useMemo } from 'react';

// Deterministic pseudo-random so the starfield is stable between renders.
function rng(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const FLIGHTS = [
  'M -40 640 C 260 600, 520 470, 760 180 S 1100 -40, 1300 -80',
  'M -60 760 C 300 740, 640 660, 900 420 S 1180 120, 1320 40',
];

/**
 * Animated background: twinkling stars and Aviator-style flight paths.
 * With reduced motion the scene is rendered static (no twinkle, no planes).
 */
export default function Sky({ reducedMotion, intensity = 1 }) {
  const stars = useMemo(() => {
    const r = rng(42);
    return Array.from({ length: 90 }, (_, i) => ({
      id: i,
      x: r() * 1200,
      y: r() * 800,
      size: r() * 1.4 + 0.3,
      delay: (r() * 6).toFixed(2),
      dur: (3 + r() * 4).toFixed(2),
    }));
  }, []);

  return (
    <div className="sky" aria-hidden="true" style={{ opacity: intensity }}>
      <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sky-trail" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#8b5cff" stopOpacity="0" />
            <stop offset=".6" stopColor="#a78bfa" stopOpacity=".45" />
            <stop offset="1" stopColor="#ff6b8b" stopOpacity=".7" />
          </linearGradient>
        </defs>
        {stars.map((s) => (
          <circle
            key={s.id}
            className="star"
            cx={s.x}
            cy={s.y}
            r={s.size}
            style={{ animationDelay: `${s.delay}s`, animationDuration: `${s.dur}s` }}
          />
        ))}
        {FLIGHTS.map((d, i) => (
          <g key={d} className="flight" style={{ animationDelay: `${i * 3.5}s` }}>
            <path d={d} className="flight__path" stroke="url(#sky-trail)" />
            {!reducedMotion && (
              <g className="flight__plane">
                <path d="M-9 0 L7 -1.6 Q10 0 7 1.6 Z M-1 -1 L-4 -8 L0 -8 L3 -1 Z M-1 1 L-4 8 L0 8 L3 1 Z" fill="#ff6b8b" />
                <animateMotion dur={`${14 + i * 4}s`} begin={`${i * 3.5}s`} repeatCount="indefinite" rotate="auto" path={d} />
              </g>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
