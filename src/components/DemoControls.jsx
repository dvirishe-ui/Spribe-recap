import { useState } from 'react';

/** Clearly labelled developer/demo panel. Not part of the product UI. */
export default function DemoControls({ scenario, onScenario, motion, onMotion }) {
  const [open, setOpen] = useState(false);
  return (
    <aside className={`demo-controls ${open ? 'is-open' : ''}`} aria-label="Developer demo controls">
      <button type="button" className="demo-controls__toggle" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span aria-hidden="true">⚙</span> Demo controls
        {scenario === 'highLoss' && <span className="demo-controls__flag">High-loss</span>}
      </button>
      {open && (
        <div className="demo-controls__panel">
          <p className="demo-controls__note">Developer only — not part of the player experience.</p>
          <label className="switch">
            <input
              type="checkbox"
              role="switch"
              checked={scenario === 'highLoss'}
              onChange={(e) => onScenario(e.target.checked ? 'highLoss' : 'normal')}
            />
            <span className="switch__track" aria-hidden="true" />
            <span>
              High-loss scenario
              <small>2026 net result becomes −$50,000; story is replaced by a private summary.</small>
            </span>
          </label>
          <label className="demo-controls__field">
            Motion
            <select value={motion} onChange={(e) => onMotion(e.target.value)}>
              <option value="system">Follow system setting</option>
              <option value="reduce">Force reduced motion</option>
              <option value="full">Force full motion</option>
            </select>
          </label>
        </div>
      )}
    </aside>
  );
}
