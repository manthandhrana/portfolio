import { useEffect, useMemo, useState } from 'react';
import { LuSearch } from 'react-icons/lu';
import ProjectCard from '../components/site/ProjectCard.jsx';
import ProjectFilters, { projectCategories } from '../components/site/ProjectFilters.jsx';
import SectionHeader from '../components/site/SectionHeader.jsx';
import SiteLayout from '../components/site/SiteLayout.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import { usePortfolio } from '../context/PortfolioContext.jsx';

export default function ProjectsPage() {
  const { projects, profile } = usePortfolio();
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `Projects — ${profile.name}`;
  }, [profile.name]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (category !== 'All' && p.category !== category) return false;
      if (!q) return true;
      return [p.title, p.summary, p.category, ...(p.tech || [])].some((v) => v?.toLowerCase().includes(q));
    });
  }, [projects, category, query]);

  return (
    <SiteLayout>
      <section className="section page-top">
        <div className="container">
          <SectionHeader
            eyebrow="portfolio"
            title="All projects"
            subtitle={`${projects.length} projects — client work, personal products and open-source repositories.`}
          />
          <div className="projects-toolbar">
            <label className="search">
              <LuSearch aria-hidden="true" />
              <span className="sr-only">Search projects</span>
              <input
                className="input"
                type="search"
                placeholder="Search by name or technology (e.g. React)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
          </div>
          <ProjectFilters categories={projectCategories(projects)} active={category} onChange={setCategory} />
          {filtered.length ? (
            <div className="projects">
              {filtered.map((project, i) => (
                <Reveal key={project._id} delay={(i % 3) * 0.06}>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="empty-state">No projects match your search.</p>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
