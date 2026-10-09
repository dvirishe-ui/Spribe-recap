import { useId } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '../hooks.js';

/** Accessible modal dialog. `tone="calm"` matches the account-statement look. */
export default function Dialog({ title, children, onClose, tone = 'story', footer }) {
  const ref = useFocusTrap(onClose);
  const titleId = useId();
  // Portal out of the animated (transformed) slides so they can't clip the overlay.
  // A host page (e.g. the operator pilot's device frame) can mark its own root.
  const target = document.querySelector('[data-portal-root]') || document.body;
  return createPortal(
    <div className={`dialog-backdrop dialog-backdrop--${tone}`} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} className={`dialog dialog--${tone}`} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="dialog__head">
          <h2 id={titleId}>{title}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close dialog">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        <div className="dialog__body">{children}</div>
        <div className="dialog__foot">
          {footer}
          <button type="button" className={tone === 'calm' ? 'btn-calm' : 'btn btn--ghost'} onClick={onClose} data-autofocus>
            Close
          </button>
        </div>
      </div>
    </div>,
    target,
  );
}
