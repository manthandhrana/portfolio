import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Spinner from './components/ui/Spinner.jsx';
import { PortfolioProvider } from './context/PortfolioContext.jsx';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';

// The admin panel is loaded only when someone visits /admin, keeping the public site light.
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'));

export default function App() {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={<Spinner fullscreen />}>
            <AdminApp />
          </Suspense>
        }
      />
      <Route element={<PortfolioProvider />}>
        <Route index element={<Home />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
