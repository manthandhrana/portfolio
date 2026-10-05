import Reveal from '../ui/Reveal.jsx';

export default function SectionHeader({ eyebrow, title, subtitle, align = 'center' }) {
  return (
    <Reveal className={`section-header section-header--${align}`}>
      {eyebrow && (
        <span className="eyebrow">
          <span aria-hidden="true">//</span> {eyebrow}
        </span>
      )}
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </Reveal>
  );
}
