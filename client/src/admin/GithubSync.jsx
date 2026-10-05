import { useEffect, useState } from 'react';
import { FaGithub } from 'react-icons/fa6';
import { LuRefreshCw } from 'react-icons/lu';
import { useToast } from '../context/ToastContext.jsx';
import { api } from '../lib/api.js';

/** Imports public repos from GitHub as projects (re-running only refreshes stars/forks). */
export default function GithubSync({ onSynced }) {
  const [username, setUsername] = useState('');
  const [includeForks, setIncludeForks] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const toast = useToast();

  useEffect(() => {
    api
      .get('/admin/profile')
      .then((p) => setUsername(p.githubUsername || ''))
      .catch(() => {});
  }, []);

  const sync = async (e) => {
    e.preventDefault();
    setSyncing(true);
    try {
      const res = await api.post('/admin/github/sync', { username: username.trim(), includeForks });
      toast(res.message);
      onSynced();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <form className="card github-sync" onSubmit={sync}>
      <span className="github-sync__icon">
        <FaGithub />
      </span>
      <div className="github-sync__text">
        <strong>Import from GitHub</strong>
        <small>New public repos are added as projects; existing ones get fresh stars & forks. Your edits are kept.</small>
      </div>
      <input
        className="input"
        placeholder="GitHub username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        aria-label="GitHub username"
        required
      />
      <label className="checkbox">
        <input type="checkbox" checked={includeForks} onChange={(e) => setIncludeForks(e.target.checked)} /> Include forks
      </label>
      <button type="submit" className="btn btn-primary" disabled={syncing || !username.trim()}>
        <LuRefreshCw className={syncing ? 'spin' : ''} /> {syncing ? 'Syncing…' : 'Sync now'}
      </button>
    </form>
  );
}
