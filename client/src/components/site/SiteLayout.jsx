import { usePortfolio } from '../../context/PortfolioContext.jsx';
import BackToTop from './BackToTop.jsx';
import Footer from './Footer.jsx';
import Navbar from './Navbar.jsx';

/** Navbar links, shown only for sections that have content. */
export function useNavLinks() {
  const data = usePortfolio();
  return [
    { id: 'about', label: 'About', show: Boolean(data.profile.about) },
    { id: 'services', label: 'Services', show: data.services.length > 0 },
    { id: 'skills', label: 'Skills', show: data.skills.length > 0 },
    { id: 'experience', label: 'Experience', show: data.experience.length > 0 },
    { id: 'projects', label: 'Projects', show: data.projects.length > 0 },
    { id: 'research', label: 'Research', show: data.research.length > 0 },
    { id: 'contact', label: 'Contact', show: true },
  ].filter((link) => link.show);
}

export default function SiteLayout({ children }) {
  const data = usePortfolio();
  const links = useNavLinks();

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar profile={data.profile} links={links} resumes={data.resumes} />
      <main id="main">{children}</main>
      <Footer profile={data.profile} links={links} services={data.services} />
      <BackToTop />
    </>
  );
}
