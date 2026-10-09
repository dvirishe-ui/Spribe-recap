// Simple, original SVG illustrations inspired by each game's theme.
// Not official game artwork.

function Aviator() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <linearGradient id="ga-av-trail" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#ff4d6d" stopOpacity="0" />
          <stop offset="1" stopColor="#ff4d6d" stopOpacity=".9" />
        </linearGradient>
      </defs>
      <path d="M8 104 C 40 100, 70 80, 92 34" fill="none" stroke="url(#ga-av-trail)" strokeWidth="4" strokeLinecap="round" />
      <path d="M8 104 C 40 100, 70 80, 92 34 L 92 104 Z" fill="#ff4d6d" opacity=".12" />
      <g transform="translate(90 32) rotate(-35)">
        <path d="M-18 0 L14 -3 Q20 0 14 3 Z" fill="#ff4d6d" />
        <path d="M-2 -2 L-8 -16 L-1 -16 L6 -2 Z" fill="#ff8fa3" />
        <path d="M-2 2 L-8 16 L-1 16 L6 2 Z" fill="#e63956" />
        <path d="M-16 -1 L-20 -8 L-15 -8 L-11 -1 Z" fill="#ff8fa3" />
        <circle cx="18" cy="0" r="2.2" fill="#fff" />
      </g>
    </svg>
  );
}

function Mines() {
  const cells = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const x = 14 + c * 24;
      const y = 14 + r * 24;
      const gem = (r === 1 && c === 2) || (r === 3 && c === 0) || (r === 0 && c === 1);
      const mine = r === 2 && c === 3;
      cells.push(
        <g key={`${r}-${c}`}>
          <rect x={x} y={y} width="20" height="20" rx="5" fill={gem || mine ? '#1b1f4b' : '#2c2f6e'} stroke="#4c4fa8" strokeWidth="1" />
          {gem && <path d={`M${x + 10} ${y + 4} L${x + 16} ${y + 9} L${x + 10} ${y + 17} L${x + 4} ${y + 9} Z`} fill="#3ee6a8" />}
          {mine && (
            <g>
              <circle cx={x + 10} cy={y + 11} r="5.5" fill="#ff5c7a" />
              <path d={`M${x + 10} ${y + 5.5} l2 -2.5`} stroke="#ffd166" strokeWidth="1.6" strokeLinecap="round" />
            </g>
          )}
        </g>,
      );
    }
  }
  return <svg viewBox="0 0 120 120" aria-hidden="true">{cells}</svg>;
}

function Plinko() {
  const pegs = [];
  for (let r = 0; r < 6; r++) {
    for (let i = 0; i <= r + 1; i++) {
      pegs.push(<circle key={`${r}-${i}`} cx={60 - (r + 1) * 7 + i * 14} cy={22 + r * 14} r="2.4" fill="#c9c6ff" opacity=".85" />);
    }
  }
  const slots = ['#7b5cff', '#5b8cff', '#3ec9e6', '#5b8cff', '#7b5cff'];
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      {pegs}
      <path d="M60 8 C 62 20, 52 30, 56 44 S 70 62, 66 78" fill="none" stroke="#ffd166" strokeWidth="1.2" strokeDasharray="2 3" opacity=".7" />
      <circle cx="66" cy="80" r="5" fill="#ffd166" />
      {slots.map((c, i) => (
        <rect key={i} x={21 + i * 16} y="104" width="14" height="8" rx="2.5" fill={c} />
      ))}
    </svg>
  );
}

function Goal() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <path d="M14 30 H106 V92" fill="none" stroke="#e8e6ff" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M14 30 V92" fill="none" stroke="#e8e6ff" strokeWidth="3.5" />
      <g stroke="#8f8ccf" strokeWidth=".8" opacity=".6">
        {[24, 34, 44, 54, 64, 74, 84, 94].map((x) => <line key={x} x1={x} y1="30" x2={x} y2="92" />)}
        {[40, 50, 60, 70, 80].map((y) => <line key={y} x1="14" y1={y} x2="106" y2={y} />)}
      </g>
      <rect x="6" y="92" width="108" height="4" rx="2" fill="#3ee6a8" opacity=".7" />
      <g transform="translate(60 74)">
        <circle r="13" fill="#fff" />
        <path d="M0 -6 L5.7 -1.9 L3.5 4.9 L-3.5 4.9 L-5.7 -1.9 Z" fill="#1b1f4b" />
        <path d="M0 -6 V-13 M5.7 -1.9 L12.4 -4 M3.5 4.9 L7.6 10.5 M-3.5 4.9 L-7.6 10.5 M-5.7 -1.9 L-12.4 -4" stroke="#1b1f4b" strokeWidth="1.4" />
      </g>
    </svg>
  );
}

function PilotChicken() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <path d="M20 100 Q60 88 100 100" stroke="#5b8cff" strokeWidth="3" fill="none" opacity=".6" />
      <ellipse cx="60" cy="72" rx="28" ry="24" fill="#fff4e0" />
      <path d="M38 70 Q30 82 44 86 Q48 76 38 70 Z" fill="#ffe2b8" />
      <circle cx="66" cy="44" r="18" fill="#fff4e0" />
      <path d="M58 26 q4 -10 8 -2 q4 -9 8 0 q2 6 -4 6 h-10 z" fill="#ff4d6d" />
      <path d="M82 46 l12 3 l-12 4 z" fill="#ffb02e" />
      <path d="M76 56 q4 6 -2 8 q-4 -4 2 -8 z" fill="#ff4d6d" />
      <rect x="54" y="36" width="28" height="10" rx="5" fill="#2c2f6e" />
      <circle cx="61" cy="41" r="4" fill="#9fd8ff" stroke="#c9c6ff" strokeWidth="1.5" />
      <circle cx="74" cy="41" r="4" fill="#9fd8ff" stroke="#c9c6ff" strokeWidth="1.5" />
      <path d="M50 92 v8 m-4 0 h8 M68 92 v8 m-4 0 h8" stroke="#ffb02e" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M40 34 q-10 -4 -14 2" stroke="#c9c6ff" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".7" />
    </svg>
  );
}

const ART = { aviator: Aviator, mines: Mines, plinko: Plinko, goal: Goal, 'pilot-chicken': PilotChicken };

export const GAME_ACCENTS = {
  aviator: '#ff4d6d',
  mines: '#3ee6a8',
  plinko: '#ffd166',
  goal: '#5b8cff',
  'pilot-chicken': '#ffb02e',
};

export default function GameArt({ id }) {
  const Art = ART[id];
  return Art ? <Art /> : null;
}
