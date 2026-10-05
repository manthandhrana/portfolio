import { LuArrowUp } from 'react-icons/lu';
import { useScrolled } from '../../hooks/useScroll.js';

export default function BackToTop() {
  const visible = useScrolled(700);
  return (
    <button
      type="button"
      className={`back-to-top ${visible ? 'is-visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
    >
      <LuArrowUp />
    </button>
  );
}
