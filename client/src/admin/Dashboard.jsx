import { useEffect, useState } from 'react';
import { LuArrowRight, LuDownload, LuExternalLink, LuInbox, LuInfo, LuPalette, LuUser } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import Spinner from '../components/ui/Spinner.jsx';
import { api, resumeUrl } from '../lib/api.js';
import { timeAgo } from '../lib/format.js';
import { useAuth } from './AuthContext.jsx';
import { RESOURCES } from './resources.jsx';

export default function Dashboard() {
  const { admin } = useAuth();
  const [stats, setStats] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    Promise.all([api.get('/admin/stats'), api.get('/admin/profile')])
      .then(([s, p]) => {
        setStats(s);
        setProfile(p);
      })
      .catch(() => {});
  }, []);

  if (!stats) {
    return (
      <div className="page__loading">
        <Spinner />
      </div>
    );
  }

  const usingSample = profile?.name === 'Your Name' || profile?.email === 'hello@example.com';
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <h1>
            {greeting}
            {admin?.name && admin.name !== 'Admin' ? `, ${admin.name}` : ''} 👋
          </h1>
          <p className="muted">Here’s what’s happening with your portfolio.</p>
        </div>
        <div className="row">
          <a href="/" target="_blank" rel="noreferrer" className="btn btn-outline">
            <LuExternalLink /> View site
          </a>
          <a href={resumeUrl(null, true)} className="btn btn-primary">
            <LuDownload /> Resume PDF
          </a>
        </div>
      </header>

      {usingSample && (
        <div className="alert alert--info">
          <LuInfo />
          <div>
            <strong>Your site is showing sample content.</strong> Start with{' '}
            <Link to="/admin/profile" className="link">
              Profile & About
            </Link>
            , then update experience, education, skills, projects and services. Everything you change here updates the website and the PDF resumes
            instantly.
          </div>
        </div>
      )}

      <div className="stat-grid">
        <Link to="/admin/messages" className="card stat-card stat-card--accent">
          <span className="icon-box">
            <LuInbox />
          </span>
          <div>
            <strong>{stats.unread}</strong>
            <span>Unread messages</span>
          </div>
        </Link>
        {Object.entries(RESOURCES).map(([key, r]) => (
          <Link key={key} to={`/admin/${r.path}`} className="card stat-card">
            <span className="icon-box icon-box--sm">
              <r.icon />
            </span>
            <div>
              <strong>{stats.counts[key] ?? 0}</strong>
              <span>{r.title}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="dash-grid">
        <section className="card">
          <header className="card__header">
            <h2>Recent messages</h2>
            <Link to="/admin/messages" className="btn btn-ghost btn-sm">
              View all <LuArrowRight />
            </Link>
          </header>
          {stats.recentMessages.length ? (
            <ul className="recent">
              {stats.recentMessages.map((m) => (
                <li key={m._id}>
                  <Link to={`/admin/messages?id=${m._id}`} className="recent__item">
                    <span className={`recent__dot ${m.status === 'new' ? 'is-new' : ''}`} />
                    <span className="recent__text">
                      <strong>{m.name}</strong>
                      <small>{m.subject || m.service || m.email}</small>
                    </span>
                    <time className="recent__time">{timeAgo(m.createdAt)}</time>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">No messages yet. They’ll appear here when someone fills in your contact form.</p>
          )}
        </section>

        <section className="card">
          <header className="card__header">
            <h2>Quick tips</h2>
          </header>
          <ul className="tips">
            <li>
              <LuUser />
              <span>
                Upload your photo in{' '}
                <Link className="link" to="/admin/profile">
                  Profile
                </Link>{' '}
                — it’s used in the hero and about sections.
              </span>
            </li>
            <li>
              <LuDownload />
              <span>
                Create one resume per role in the{' '}
                <Link className="link" to="/admin/resumes">
                  Resume Builder
                </Link>{' '}
                — each one picks its own skills, projects and section order.
              </span>
            </li>
            <li>
              <LuPalette />
              <span>
                Change the website colours in <code>client/src/styles/global.css</code> — edit <code>--primary</code> and <code>--accent</code>.
              </span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
