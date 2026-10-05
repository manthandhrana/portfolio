import { useState } from 'react';
import { initials } from '../../lib/format.js';

/** Shows the image, or gradient initials if there is no image (or it fails to load). */
export default function Avatar({ src, name, className = '', size }) {
  const [failed, setFailed] = useState(false);
  const style = size ? { width: size, height: size } : undefined;

  if (src && !failed) {
    return <img className={`avatar ${className}`} src={src} alt={name || ''} style={style} onError={() => setFailed(true)} />;
  }
  return (
    <span className={`avatar avatar--initials ${className}`} style={style} aria-label={name}>
      {initials(name)}
    </span>
  );
}
