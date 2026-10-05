import { useEffect, useRef, useState } from 'react';
import { LuChevronDown, LuDownload, LuEye, LuFileText } from 'react-icons/lu';
import { resumeUrl } from '../../lib/api.js';

/**
 * "Download resume" button. With several resume variants (Full Stack, Security…)
 * it opens a small menu so visitors can pick the one they need.
 */
export default function ResumeMenu({ resumes = [], className = 'btn btn-outline', label = 'Download Resume', compact = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => {
      if (e.type === 'keydown' ? e.key === 'Escape' : !ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [open]);

  if (resumes.length <= 1) {
    return (
      <a className={className} href={resumeUrl(resumes[0]?.slug, true)} download>
        <LuDownload /> {label}
      </a>
    );
  }

  return (
    <div className="dropdown" ref={ref}>
      <button type="button" className={className} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <LuDownload /> {label} {!compact && <LuChevronDown className={`dropdown__chevron ${open ? 'is-open' : ''}`} />}
      </button>
      {open && (
        <div className="dropdown__menu" role="menu">
          <p className="dropdown__title">Choose a resume</p>
          {resumes.map((resume) => (
            <div key={resume.slug} className="dropdown__item" role="none">
              <a role="menuitem" href={resumeUrl(resume.slug, true)} download onClick={() => setOpen(false)}>
                <LuFileText />
                <span>
                  <strong>{resume.name}</strong>
                  {resume.headline && <small>{resume.headline}</small>}
                </span>
              </a>
              <a
                className="dropdown__preview"
                href={resumeUrl(resume.slug)}
                target="_blank"
                rel="noreferrer"
                title="Preview in a new tab"
                aria-label={`Preview ${resume.name} resume`}
              >
                <LuEye />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
