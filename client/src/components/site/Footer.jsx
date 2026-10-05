import { LuMail, LuMapPin, LuPhone } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import { initials } from '../../lib/format.js';
import SocialLinks from './SocialLinks.jsx';

export default function Footer({ profile, links = [], services = [] }) {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Link to="/" className="brand">
            <span className="brand__mark">{initials(profile.name)}</span>
            <span className="brand__name">{profile.name}</span>
          </Link>
          {profile.title && <p className="muted">{profile.title}</p>}
          <SocialLinks socials={profile.socials} />
        </div>

        {links.length > 0 && (
          <nav className="footer__col" aria-label="Footer">
            <h4>Explore</h4>
            <ul>
              {links.map(({ id, label }) => (
                <li key={id}>
                  <Link to={{ pathname: '/', hash: `#${id}` }}>{label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {services.length > 0 && (
          <div className="footer__col">
            <h4>Services</h4>
            <ul>
              {services.slice(0, 6).map((s) => (
                <li key={s._id}>
                  <Link to={{ pathname: '/', hash: '#services' }}>{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="footer__col">
          <h4>Contact</h4>
          <ul className="footer__contact">
            {profile.email && (
              <li>
                <LuMail /> <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </li>
            )}
            {profile.phone && (
              <li>
                <LuPhone /> <a href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`}>{profile.phone}</a>
              </li>
            )}
            {profile.location && (
              <li>
                <LuMapPin /> {profile.location}
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="container footer__bottom">
        <p>
          © {year} {profile.name}. All rights reserved.
        </p>
        <p className="mono">
          Built with <span className="gradient-text">React</span> &amp; <span className="gradient-text">Node.js</span>
        </p>
      </div>
    </footer>
  );
}
