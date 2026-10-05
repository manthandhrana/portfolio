import { useState } from 'react';
import { LuArrowLeft, LuCircleAlert, LuEye, LuEyeOff, LuLock, LuLogIn } from 'react-icons/lu';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Spinner from '../components/ui/Spinner.jsx';
import { useAuth } from './AuthContext.jsx';

export default function Login() {
  const { admin, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (admin === undefined) return <Spinner fullscreen />;
  if (admin) return <Navigate to={location.state?.from || '/admin'} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(location.state?.from || '/admin', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login__glow" aria-hidden="true" />
      <form className="card login__card" onSubmit={submit}>
        <span className="icon-box login__icon">
          <LuLock />
        </span>
        <div>
          <h1>Admin login</h1>
          <p className="muted">Sign in to manage your portfolio.</p>
        </div>

        {error && (
          <div className="alert alert--error" role="alert">
            <LuCircleAlert /> <span>{error}</span>
          </div>
        )}

        <div className="field">
          <label className="label" htmlFor="login-email">
            Email
          </label>
          <input
            id="login-email"
            className="input"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div className="field">
          <label className="label" htmlFor="login-password">
            Password
          </label>
          <div className="password-input">
            <input
              id="login-password"
              className="input"
              type={show ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'}>
              {show ? <LuEyeOff /> : <LuEye />}
            </button>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
          {loading ? <span className="spinner" /> : <LuLogIn />} {loading ? 'Signing in…' : 'Sign in'}
        </button>
        <Link to="/" className="login__back">
          <LuArrowLeft /> Back to website
        </Link>
      </form>
    </div>
  );
}
