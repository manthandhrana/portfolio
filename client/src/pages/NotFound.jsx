import { LuArrowLeft } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import SiteLayout from '../components/site/SiteLayout.jsx';

export default function NotFound() {
  return (
    <SiteLayout>
      <section className="section page-top not-found">
        <div className="container">
          <p className="not-found__code mono gradient-text">404</p>
          <h1>Page not found</h1>
          <p className="muted">The page you’re looking for doesn’t exist or has moved.</p>
          <Link to="/" className="btn btn-primary">
            <LuArrowLeft /> Back to home
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
