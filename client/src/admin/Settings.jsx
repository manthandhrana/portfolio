import { useState } from 'react';
import { LuKeyRound, LuPalette, LuSave, LuSettings } from 'react-icons/lu';
import { useToast } from '../context/ToastContext.jsx';
import { api } from '../lib/api.js';
import { useAuth } from './AuthContext.jsx';

export default function Settings() {
  const { admin, setAdmin } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ name: admin?.name || '', email: admin?.email || '', currentPassword: '', newPassword: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setError('');
    if (form.newPassword && form.newPassword !== form.confirm) return setError('New passwords don’t match.');
    if (form.newPassword && form.newPassword.length < 8) return setError('New password must be at least 8 characters.');
    setSaving(true);
    try {
      const res = await api.put('/auth/account', {
        name: form.name,
        email: form.email,
        currentPassword: form.currentPassword,
        newPassword: form.newPassword || undefined,
      });
      setAdmin(res.admin);
      setForm((f) => ({ ...f, currentPassword: '', newPassword: '', confirm: '' }));
      toast(form.newPassword ? 'Password changed — other devices have been signed out' : 'Account updated');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <header className="page__header">
        <div className="page__heading">
          <span className="icon-box icon-box--sm">
            <LuSettings />
          </span>
          <div>
            <h1>Settings</h1>
            <p className="muted">Your admin account and website theme.</p>
          </div>
        </div>
      </header>

      <form className="card form-section" onSubmit={save}>
        <div className="form-section__intro">
          <h2>
            <LuKeyRound /> Account & password
          </h2>
          <p className="muted">Changing your password signs you out on every other device.</p>
        </div>
        {error && <div className="alert alert--error">{error}</div>}
        <div className="form-grid">
          <div className="field">
            <label className="label" htmlFor="s-name">
              Name
            </label>
            <input id="s-name" name="name" className="input" value={form.name} onChange={set} autoComplete="name" />
          </div>
          <div className="field">
            <label className="label" htmlFor="s-email">
              Login email
            </label>
            <input id="s-email" name="email" type="email" className="input" value={form.email} onChange={set} autoComplete="username" />
          </div>
          <div className="field">
            <label className="label" htmlFor="s-new">
              New password
            </label>
            <input id="s-new" name="newPassword" type="password" className="input" value={form.newPassword} onChange={set} autoComplete="new-password" placeholder="Leave empty to keep current" />
          </div>
          <div className="field">
            <label className="label" htmlFor="s-confirm">
              Confirm new password
            </label>
            <input id="s-confirm" name="confirm" type="password" className="input" value={form.confirm} onChange={set} autoComplete="new-password" />
          </div>
          <div className="field field--full">
            <label className="label" htmlFor="s-current">
              Current password<span className="req">*</span>
            </label>
            <input id="s-current" name="currentPassword" type="password" className="input" value={form.currentPassword} onChange={set} autoComplete="current-password" required />
            <span className="hint">Required to save any change here.</span>
          </div>
        </div>
        <div className="row">
          <button type="submit" className="btn btn-primary" disabled={saving || !form.currentPassword}>
            {saving ? <span className="spinner" /> : <LuSave />} Save account
          </button>
        </div>
      </form>

      <section className="card form-section">
        <div className="form-section__intro">
          <h2>
            <LuPalette /> Website colours
          </h2>
          <p className="muted">
            The whole site (and this admin panel) reads its colours, fonts and sizes from CSS variables in <code>client/src/styles/global.css</code>.
            Change <code>--primary</code> and <code>--accent</code> to re-brand everything, then rebuild with <code>npm run build</code>.
          </p>
        </div>
        <div className="swatches">
          {['--primary', '--accent', '--bg', '--surface', '--text', '--success', '--warning', '--danger'].map((token) => (
            <div key={token} className="swatch">
              <span className="swatch__color" style={{ background: `var(${token})` }} />
              <code>{token}</code>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
