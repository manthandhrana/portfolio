import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import About from '../components/site/About.jsx';
import Contact from '../components/site/Contact.jsx';
import Education from '../components/site/Education.jsx';
import Experience from '../components/site/Experience.jsx';
import Hero from '../components/site/Hero.jsx';
import Projects from '../components/site/Projects.jsx';
import Research from '../components/site/Research.jsx';
import Services from '../components/site/Services.jsx';
import SiteLayout from '../components/site/SiteLayout.jsx';
import Skills from '../components/site/Skills.jsx';
import Testimonials from '../components/site/Testimonials.jsx';
import { usePortfolio } from '../context/PortfolioContext.jsx';

export default function Home() {
  const data = usePortfolio();
  const { profile } = data;
  const { hash } = useLocation();
  const [presetService, setPresetService] = useState('');

  // Scroll to #section when arriving from another page (e.g. /projects → /#contact)
  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth' }));
  }, [hash]);

  const chooseService = useCallback((title) => {
    setPresetService(title);
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <SiteLayout>
      <Hero profile={profile} skills={data.skills} resumes={data.resumes} />
      {profile.about && <About profile={profile} resumes={data.resumes} />}
      {data.services.length > 0 && <Services services={data.services} onSelect={chooseService} />}
      {data.skills.length > 0 && <Skills skills={data.skills} />}
      {data.experience.length > 0 && <Experience experience={data.experience} />}
      {data.projects.length > 0 && <Projects projects={data.projects} githubUrl={profile.socials?.github} />}
      {data.research.length > 0 && <Research research={data.research} socials={profile.socials} />}
      {(data.education.length > 0 || data.certifications.length > 0) && (
        <Education education={data.education} certifications={data.certifications} />
      )}
      {data.testimonials.length > 0 && <Testimonials testimonials={data.testimonials} />}
      <Contact profile={profile} services={data.services} presetService={presetService} />
    </SiteLayout>
  );
}
