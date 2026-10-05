import { useEffect } from 'react';
import { LuX } from 'react-icons/lu';

/** Slide-in panel from the right, used for add/edit forms. */
export default function Drawer({ title, onClose, children, footer }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
      <div className="drawer__backdrop" onClick={onClose} aria-hidden="true" />
      <div className="drawer__panel">
        <header className="drawer__header">
          <h2 id="drawer-title">{title}</h2>
          <button type="button" className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close">
            <LuX />
          </button>
        </header>
        <div className="drawer__body">{children}</div>
        {footer && <footer className="drawer__footer">{footer}</footer>}
      </div>
    </div>
  );
}
