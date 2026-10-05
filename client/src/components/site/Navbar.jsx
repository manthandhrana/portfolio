import { useEffect, useState } from 'react';
import { LuMenu, LuMoon, LuSun, LuX } from 'react-icons/lu';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme.js';
import { useActiveSection, useScrolled } from '../../hooks/useScroll.js';
import { initials } from '../../lib/format.js';
import ResumeMenu from './ResumeMenu.jsx';

export default function Navbar({ profile, links, resumes }) {
  const [open, setOpen] = useState(false);
  const [theme, toggleTheme] = useTheme();
  const scrolled = useScrolled();
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const active = useActiveSection(isHome ? links.map((l) => l.id) : []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const firstName = profile.name?.split(' ')[0] || 'Portfolio';

  return (
    <header className={`navbar ${scrolled || open ? 'navbar--solid' : ''}`}>
      <nav className="container navbar__inner" aria-label="Main">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand__mark">{initials(profile.name)}</span>
          <span className="brand__name">
            {firstName}
            <span className="brand__dot">.</span>
          </span>
        </Link>

        <ul className={`navbar__links ${open ? 'is-open' : ''}`}>
          {links.map(({ id, label }) => (
            <li key={id}>
              <Link
                to={{ pathname: '/', hash: `#${id}` }}
                className={active === id ? 'is-active' : ''}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            </li>
          ))}
          <li className="navbar__mobile-cta">
            <ResumeMenu resumes={resumes} className="btn btn-primary btn-block" />
          </li>
        </ul>

        <div className="navbar__actions">
          <button
            type="button"
            className="btn btn-ghost btn-icon"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title="Toggle theme"
          >
            {theme === 'dark' ? <LuSun /> : <LuMoon />}
          </button>
          <div className="navbar__resume">
            <ResumeMenu resumes={resumes} className="btn btn-primary btn-sm" label="Resume" />
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-icon navbar__toggle"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <LuX /> : <LuMenu />}
          </button>
        </div>
      </nav>
    </header>
  );
}
