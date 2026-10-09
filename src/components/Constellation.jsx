export default function Constellation({ total, highlighted }) {
  // Lineup as a small constellation; newly tried games glow brighter.
  const pts = [
    [30, 90], [80, 50], [140, 70], [190, 30], [230, 85],
  ].slice(0, total);
  return (
    <svg viewBox="0 0 260 120" className="constellation" aria-hidden="true">
      <polyline points={pts.map((p) => p.join(',')).join(' ')} />
      {pts.map(([x, y], i) => {
        const hi = i >= total - highlighted;
        return (
          <g key={i} className={hi ? 'c-star c-star--hi' : 'c-star'}>
            {hi && <circle cx={x} cy={y} r="11" className="c-star__halo" />}
            <circle cx={x} cy={y} r={hi ? 5 : 3.5} />
          </g>
        );
      })}
    </svg>
  );
}
