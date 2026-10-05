import { createContext, useContext, useEffect, useState } from 'react';
import { LuRefreshCw } from 'react-icons/lu';
import { Outlet } from 'react-router-dom';
import Spinner from '../components/ui/Spinner.jsx';
import { api } from '../lib/api.js';

const PortfolioContext = createContext(null);

function setMeta(name, content, attr = 'name') {
  if (!content) return;
  let tag = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

/** Loads all public content once and shares it with the home page and the projects page. */
export function PortfolioProvider() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setError('');
    api
      .get('/public/portfolio')
      .then((result) => !cancelled && setData(result))
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  useEffect(() => {
    if (!data) return;
    const { profile } = data;
    const title = profile.seo?.title || [profile.name, profile.title].filter(Boolean).join(' — ');
    const description = profile.seo?.description || profile.tagline;
    if (title) document.title = title;
    setMeta('description', description);
    setMeta('keywords', profile.seo?.keywords);
    setMeta('og:title', title, 'property');
    setMeta('og:description', description, 'property');
    if (profile.avatar) setMeta('og:image', new URL(profile.avatar, window.location.origin).href, 'property');
  }, [data]);

  if (error && !data) {
    return (
      <div className="spinner-screen">
        <div className="stack" style={{ alignItems: 'center', textAlign: 'center', padding: '0 1rem' }}>
          <h2>Couldn’t load the site</h2>
          <p className="muted">{error}</p>
          <button type="button" className="btn btn-primary" onClick={() => setAttempt((n) => n + 1)}>
            <LuRefreshCw /> Try again
          </button>
        </div>
      </div>
    );
  }

  if (!data) return <Spinner fullscreen />;

  return (
    <PortfolioContext.Provider value={data}>
      <Outlet />
    </PortfolioContext.Provider>
  );
}

export const usePortfolio = () => useContext(PortfolioContext);
