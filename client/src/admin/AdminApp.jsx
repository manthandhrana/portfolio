import '../styles/admin.css';

import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Spinner from '../components/ui/Spinner.jsx';
import AdminLayout from './AdminLayout.jsx';
import { AuthProvider, useAuth } from './AuthContext.jsx';
import Dashboard from './Dashboard.jsx';
import Login from './Login.jsx';
import Messages from './Messages.jsx';
import ProfileEditor from './ProfileEditor.jsx';
import ResourceManager from './ResourceManager.jsx';
import { RESOURCES } from './resources.jsx';
import Settings from './Settings.jsx';

function RequireAuth({ children }) {
  const { admin } = useAuth();
  const location = useLocation();
  if (admin === undefined) return <Spinner fullscreen />;
  if (!admin) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  return children;
}

export default function AdminApp() {
  // Keep the admin panel out of search engines.
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    document.title = 'Admin Panel';
    return () => meta.remove();
  }, []);

  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<ProfileEditor />} />
          <Route path="messages" element={<Messages />} />
          <Route path="settings" element={<Settings />} />
          {Object.entries(RESOURCES).map(([key, resource]) => (
            <Route key={key} path={resource.path} element={<ResourceManager key={key} resource={resource} />} />
          ))}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
