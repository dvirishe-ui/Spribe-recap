import { useState } from 'react';
import Dialog from './Dialog.jsx';
import { formatMoney } from '../data.js';

/*
 * Private activity statement. Deliberately calm and visually separate from
 * the story: light surface, plain type, no animation, no share action.
 * Used in two places:
 *  - variant="normal":     reached only via "View my activity" on the closing slide.
 *  - variant="restrained": replaces the story entirely in the high-loss scenario.
 */

function YearStatement({ s, operatorName }) {
  return (
    <section className="stmt-year" aria-labelledby={`stmt-${s.year}`}>
      <div className="stmt-year__head">
        <h3 id={`stmt-${s.year}`}>{s.year}</h3>
        <span className="stmt-year__period">Reporting period: {s.period}</span>
      </div>
      <dl className="stmt-table">
        <div>
          <dt>Total stakes</dt>
          <dd>{formatMoney(s.stakes)}</dd>
        </div>
        <div>
          <dt>Total payouts</dt>
          <dd>{formatMoney(s.payouts)}</dd>
        </div>
        <div className="stmt-table__net">
          <dt>Net result</dt>
          <dd>{formatMoney(s.net)}</dd>
        </div>
      </dl>
      <p className="stmt-math">
        <span className="stmt-math__label">Calculation</span>
        Total payouts {formatMoney(s.payouts)} − total stakes {formatMoney(s.stakes)} ={' '}
        <strong className="nowrap">{formatMoney(s.net)}</strong>
      </p>
      <p className="stmt-scope">SPRIBE games on this {operatorName} account only.</p>
    </section>
  );
}

function Explainer({ operatorName }) {
  return (
    <section className="stmt-explainer" aria-labelledby="stmt-explain">
      <h3 id="stmt-explain">What these figures mean</h3>
      <dl>
        <dt>Total stakes</dt>
        <dd>
          The sum of the amounts wagered across all of your SPRIBE rounds in the reporting period. This is <strong>not</strong> the
          same as deposits: the same funds can be staked several times, so total stakes are usually higher than the money you added
          to your account.
        </dd>
        <dt>Total payouts</dt>
        <dd>The sum of all amounts returned to you from those rounds.</dd>
        <dt>Net result</dt>
        <dd>Total payouts minus total stakes for the same period. A negative figure means a net loss.</dd>
        <dt>What’s included</dt>
        <dd>
          Only SPRIBE games played on this {operatorName} account. These figures do not cover any other games, other casinos or
          other operators.
        </dd>
      </dl>
    </section>
  );
}

const DEMO_DIALOGS = {
  history: {
    title: 'Full account history (demo)',
    body: (
      <>
        <p>In a live product, this would open your complete account history from the operator, including deposits, withdrawals and every game.</p>
        <p className="dialog__note">Prototype only — there is no real account behind this demo.</p>
      </>
    ),
  },
  limit: {
    title: 'Set a limit (demo)',
    body: (
      <>
        <p>Choose a limit that suits you. Limits take effect straight away; increases would normally apply after a cooling-off period.</p>
        <fieldset className="calm-fieldset">
          <legend>Limit type</legend>
          {['Deposit limit', 'Loss limit', 'Session time reminder'].map((l, i) => (
            <label key={l}>
              <input type="radio" name="limit" defaultChecked={i === 0} /> {l}
            </label>
          ))}
        </fieldset>
        <label className="calm-field">
          Period
          <select defaultValue="weekly">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </label>
        <p className="dialog__note">Demo dialog — nothing is saved.</p>
      </>
    ),
  },
  break: {
    title: 'Take a break (demo)',
    body: (
      <>
        <p>Pause access to your account for a period of your choice. During a break you won’t be able to play.</p>
        <fieldset className="calm-fieldset">
          <legend>Break length</legend>
          {['24 hours', '1 week', '1 month', '6 months'].map((l, i) => (
            <label key={l}>
              <input type="radio" name="break" defaultChecked={i === 1} /> {l}
            </label>
          ))}
        </fieldset>
        <p className="dialog__note">Demo dialog — no break is applied.</p>
      </>
    ),
  },
  support: {
    title: 'Talk to someone (demo)',
    body: (
      <>
        <p>
          In a live product, this would connect you with the operator’s support team and list free, confidential, independent
          support services available where you live.
        </p>
        <p>You don’t need to have a problem to reach out — a conversation can help you decide what feels right.</p>
        <p className="dialog__note">Demo dialog — no contact details are shown for a fictional operator.</p>
      </>
    ),
  },
};

export default function Activity({ replay, onBack, onClose, variant = 'normal' }) {
  const [dialog, setDialog] = useState(null);
  const restrained = variant === 'restrained';
  const op = replay.operator.name;
  const actions = [
    { id: 'history', label: 'View full account history' },
    // In restrained mode these two already sit in the support panel above.
    ...(restrained
      ? []
      : [
          { id: 'limit', label: 'Set a limit' },
          { id: 'break', label: 'Take a break' },
        ]),
  ];

  return (
    <div className={`statement ${restrained ? 'statement--restrained' : ''}`}>
      <div className="statement__wrap">
        <header className="statement__head">
          <div className="statement__meta">
            <span className="statement__op">{op}</span>
            <span className="statement__tag">Fictional demo data</span>
            <span className="statement__tag">Private</span>
          </div>
          {onBack && (
            <button type="button" className="btn-calm btn-calm--link" onClick={onBack}>
              ← Back to Replay
            </button>
          )}
          {onClose && !onBack && (
            <button type="button" className="btn-calm btn-calm--link" onClick={onClose}>
              Close
            </button>
          )}
        </header>

        <h1 className="statement__title">{restrained ? `Your ${replay.year} summary` : 'My activity'}</h1>
        <p className="statement__sub">
          {restrained
            ? `This year we’re showing a simple, private summary instead of the Replay story. It covers SPRIBE games on this ${op} account only.`
            : `A private summary of your SPRIBE games on this ${op} account. It is never included in share cards.`}
        </p>

        {restrained && (
          <section className="support-panel" aria-labelledby="support-h">
            <h2 id="support-h">Support is available</h2>
            <p>
              Your {replay.year} net result for SPRIBE games was <strong>{formatMoney(replay.statements.at(-1).net)}</strong>. If you’d
              like to take stock, these options are here whenever you need them.
            </p>
            <div className="support-actions">
              <button type="button" className="btn-calm" onClick={() => setDialog('support')}>Talk to someone</button>
              <button type="button" className="btn-calm" onClick={() => setDialog('limit')}>Set a limit</button>
              <button type="button" className="btn-calm" onClick={() => setDialog('break')}>Take a break</button>
            </div>
          </section>
        )}

        <h2 className="statement__section">SPRIBE games · net results by year</h2>
        <div className="stmt-years">
          {[...replay.statements].reverse().map((s) => (
            <YearStatement key={s.year} s={s} operatorName={op} />
          ))}
        </div>

        <Explainer operatorName={op} />

        <section className="stmt-actions" aria-label="Account tools">
          {actions.map((a) => (
            <button key={a.id} type="button" className="btn-calm" onClick={() => setDialog(a.id)}>
              {a.label}
            </button>
          ))}
        </section>

        <p className="statement__foot">
          Concept prototype. {op} is a fictional operator and every figure on this page is invented for demonstration.
        </p>
      </div>

      {dialog && (
        <Dialog tone="calm" title={DEMO_DIALOGS[dialog].title} onClose={() => setDialog(null)}>
          {DEMO_DIALOGS[dialog].body}
        </Dialog>
      )}
    </div>
  );
}
