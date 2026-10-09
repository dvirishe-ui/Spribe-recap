import { useId, useState } from 'react';

/* Small hand-rolled SVG charts for the operator view: one y-axis, thin marks,
   recessive grid, legend + hover tooltip, colors from CSS tokens. */

function niceTicks(min, max, count = 4) {
  const span = max - min || 1;
  const raw = span / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= count) || raw;
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(Math.round(v * 1000) / 1000);
  return ticks;
}

export function Legend({ items }) {
  return (
    <ul className="legend" role="list">
      {items.map((s) => (
        <li key={s.label}>
          <span className={`legend__key ${s.dashed ? 'legend__key--dashed' : ''}`} style={{ '--c': s.color }} aria-hidden="true" />
          {s.label}
        </li>
      ))}
    </ul>
  );
}

/**
 * Line chart with crosshair tooltip.
 * series: [{ label, color, values, dashed }]; labels: x labels (same length).
 */
export function LineChart({ series, labels, tickEvery = 1, yFmt = (v) => v, tipFmt = yFmt, zero = false, title, height = 220 }) {
  const W = 640;
  const H = height;
  const m = { t: 12, r: 16, b: 26, l: 48 };
  const all = series.flatMap((s) => s.values);
  const ticks = niceTicks(zero ? 0 : Math.min(...all) * 0.97, Math.max(...all) * 1.02);
  const y0 = ticks[0];
  const y1 = ticks[ticks.length - 1];
  const n = labels.length;
  const x = (i) => m.l + (i * (W - m.l - m.r)) / (n - 1);
  const y = (v) => H - m.b - ((v - y0) / (y1 - y0)) * (H - m.t - m.b);
  const [hover, setHover] = useState(null);
  const id = useId();

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    const i = Math.round(((px - m.l) / (W - m.l - m.r)) * (n - 1));
    setHover(Math.max(0, Math.min(n - 1, i)));
  };

  return (
    <figure className="chart" aria-labelledby={`${id}-t`}>
      <figcaption id={`${id}-t`} className="sr-only">
        {title}
      </figcaption>
      <div className="chart__plot">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title} onPointerMove={onMove} onPointerDown={onMove} onPointerLeave={(e) => e.pointerType === 'mouse' && setHover(null)}>
          {ticks.map((t) => (
            <g key={t}>
              <line className="chart__grid" x1={m.l} x2={W - m.r} y1={y(t)} y2={y(t)} />
              <text className="chart__tick" x={m.l - 8} y={y(t) + 4} textAnchor="end">
                {yFmt(t)}
              </text>
            </g>
          ))}
          {labels.map((l, i) =>
            i % tickEvery === 0 || i === n - 1 ? (
              <text key={i} className="chart__tick" x={x(i)} y={H - 6} textAnchor="middle">
                {l}
              </text>
            ) : null,
          )}
          {hover !== null && <line className="chart__cross" x1={x(hover)} x2={x(hover)} y1={m.t} y2={H - m.b} />}
          {series.map((s) => (
            <polyline
              key={s.label}
              className="chart__line"
              points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ')}
              style={{ stroke: s.color }}
              strokeDasharray={s.dashed ? '6 5' : undefined}
            />
          ))}
          {series.map((s) => {
            const i = hover ?? s.values.length - 1;
            return <circle key={s.label} className="chart__dot" cx={x(i)} cy={y(s.values[i])} r="4.5" style={{ fill: s.color }} />;
          })}
          <rect x={m.l} y={m.t} width={W - m.l - m.r} height={H - m.t - m.b} fill="transparent" />
        </svg>
        {hover !== null && (
          <div className="tip" style={{ left: `${(x(hover) / W) * 100}%` }} role="status">
            <strong>{labels[hover]}</strong>
            {series.map((s) => (
              <span key={s.label}>
                <i style={{ background: s.color }} aria-hidden="true" />
                {s.label}
                <b>{tipFmt(s.values[hover])}</b>
              </span>
            ))}
          </div>
        )}
      </div>
    </figure>
  );
}

/** Paired horizontal bars (Northstar vs benchmark) per category, with values. */
export function PairedBars({ rows, a, b, fmt = (v) => `${v}%` }) {
  const max = Math.max(...rows.flatMap((r) => [r[a.key], r[b.key]]));
  return (
    <div className="pbars" role="table" aria-label="Share of rounds by game">
      {rows.map((r) => (
        <div className="pbars__row" role="row" key={r.label}>
          <span className="pbars__label" role="rowheader">
            {r.label}
          </span>
          <div className="pbars__bars" role="cell">
            {[a, b].map((s) => (
              <div className="pbars__line" key={s.key} title={`${s.label}: ${fmt(r[s.key])}`}>
                <span className="pbars__bar" style={{ width: `${(r[s.key] / max) * 100}%`, background: s.color }} />
                <span className="pbars__val">
                  <span className="sr-only">{s.label}: </span>
                  {fmt(r[s.key])}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Single-series vertical bars with an optional highlighted bar. */
export function Columns({ rows, color, fmt = (v) => `${v}%`, title }) {
  const max = Math.max(...rows.map((r) => r.value));
  return (
    <div className="cols" role="img" aria-label={title}>
      {rows.map((r) => (
        <div className={`cols__col ${r.flag ? 'is-flag' : ''}`} key={r.label} title={`${r.label}: ${fmt(r.value)}`}>
          <span className="cols__val">{fmt(r.value)}</span>
          <span className="cols__track">
            <span className="cols__bar" style={{ height: `${Math.max(2, (r.value / max) * 100)}%`, background: color }} />
          </span>
          <span className="cols__label">{r.label}</span>
        </div>
      ))}
    </div>
  );
}
