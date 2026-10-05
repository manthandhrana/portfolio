import { ensureUrl } from '../../lib/format.js';
import { SOCIALS } from '../../lib/icons.jsx';

export default function SocialLinks({ socials = {}, only, className = '' }) {
  const items = SOCIALS.filter(({ key }) => socials[key] && (!only || only.includes(key)));
  if (!items.length) return null;
  return (
    <ul className={`socials ${className}`}>
      {items.map(({ key, label, icon: SocialIcon }) => (
        <li key={key}>
          <a href={ensureUrl(socials[key])} target="_blank" rel="noreferrer me" aria-label={label} title={label}>
            <SocialIcon />
          </a>
        </li>
      ))}
    </ul>
  );
}
