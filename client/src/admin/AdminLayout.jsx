import { useEffect, useState } from 'react';
import { LuExternalLink, LuInbox, LuLayoutDashboard, LuLogOut, LuMenu, LuMoon, LuSettings, LuSun, LuUser, LuX } from 'react-icons/lu';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme.js';
import { useAuth } from './AuthContext.jsx';
import { RESOURCES } from './resources.jsx';
import { useUnread } from './useUnread.js';

const { resumes, ...content } = RESOURCES;

const NAV = [
  {
    title: 'Overview',
    items: [
      { to: '/admin', label: 'Dashboard', icon: LuLayoutDashboard, end: true },
      { to: '/admin/messages', label: 'Messages', icon: LuInbox, badge: 'unread' },
    ],
  },
  {
    title: 'Content',
    items: [
      { to: '/admin/profile', label: 'Profile & About', icon: LuUser },
      ...Object.values(content).map((r) => ({ to: `/admin/${r.path}`, label: r.title, icon: r.icon })),
    ],
  },
  {
    title: 'Resume',
    items: [{ to: `/admin/${resumes.path}`, label: resumes.title, icon: resumes.icon }],
  },
  {
    title: 'Account',
    items: [{ to: '/admin/settings', label: 'Settings', icon: LuSettings }],
  },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [theme, toggleTheme] = useTheme();
  const unread = useUnread();
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className={`admin ${open ? 'admin--nav-open' : ''}`}>
      <aside className="admin__sidebar">
        <div className="admin__brand">
          <span className="brand__mark">⌘</span>
          <div>
            <strong>Admin Panel</strong>
            <small>{admin?.email}</small>
          </div>
          <button type="button" className="btn btn-ghost btn-icon btn-sm admin__close" onClick={() => setOpen(false)} aria-label="Close menu">
            <LuX />
          </button>
        </div>

        <nav className="admin__nav">
          {NAV.map((group) => (
            <div key={group.title} className="admin__nav-group">
              <p className="admin__nav-title">{group.title}</p>
              {group.items.map(({ to, label, icon: NavIcon, end, badge }) => (
                <NavLink key={to} to={to} end={end} className={({ isActive }) => `admin__link ${isActive ? 'is-active' : ''}`}>
                  <NavIcon />
                  <span>{label}</span>
                  {badge === 'unread' && unread > 0 && <span className="admin__badge">{unread}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="admin__sidebar-footer">
          <a href="/" target="_blank" rel="noreferrer" className="admin__link">
            <LuExternalLink /> <span>View website</span>
          </a>
          <button type="button" className="admin__link" onClick={toggleTheme}>
            {theme === 'dark' ? <LuSun /> : <LuMoon />} <span>{theme === 'dark' ? 'Light' : 'Dark'} mode</span>
          </button>
          <button type="button" className="admin__link" onClick={logout}>
            <LuLogOut /> <span>Log out</span>
          </button>
        </div>
      </aside>

      <div className="admin__backdrop" onClick={() => setOpen(false)} aria-hidden="true" />

      <div className="admin__main">
        <header className="admin__topbar">
          <button type="button" className="btn btn-ghost btn-icon" onClick={() => setOpen(true)} aria-label="Open menu">
            <LuMenu />
          </button>
          <strong>Admin Panel</strong>
          {unread > 0 && (
            <NavLink to="/admin/messages" className="admin__badge">
              {unread} new
            </NavLink>
          )}
        </header>
        <main className="admin__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
