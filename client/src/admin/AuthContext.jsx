import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // undefined = still checking, null = logged out
  const [admin, setAdmin] = useState(undefined);

  useEffect(() => {
    api
      .get('/auth/me')
      .then((res) => setAdmin(res.admin))
      .catch(() => setAdmin(null));

    // Any 401 from the API (expired cookie, password changed elsewhere) logs the panel out.
    const onExpired = () => setAdmin(null);
    window.addEventListener('auth:expired', onExpired);
    return () => window.removeEventListener('auth:expired', onExpired);
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setAdmin(res.admin);
  }, []);

  const logout = useCallback(async () => {
    await api.post('/auth/logout').catch(() => {});
    setAdmin(null);
  }, []);

  const value = useMemo(() => ({ admin, setAdmin, login, logout }), [admin, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
