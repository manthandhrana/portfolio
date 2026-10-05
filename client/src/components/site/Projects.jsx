import { useState } from 'react';
import { FaGithub } from 'react-icons/fa6';
import { LuArrowRight } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import { ensureUrl } from '../../lib/format.js';
import Reveal from '../ui/Reveal.jsx';
import ProjectCard from './ProjectCard.jsx';
import ProjectFilters, { projectCategories } from './ProjectFilters.jsx';
import SectionHeader from './SectionHeader.jsx';

const HOME_LIMIT = 6;

export default function Projects({ projects, githubUrl }) {
  const [category, setCategory] = useState('All');
  const categories = projectCategories(projects);
  const filtered = category === 'All' ? projects : projects.filter((p) => p.category === category);
  const shown = filtered.slice(0, HOME_LIMIT);

  return (
    <section className="section" id="projects">
      <div className="container">
        <SectionHeader
          eyebrow="portfolio"
          title="Featured projects"
          subtitle="Client work, products and open-source tools — including projects straight from my GitHub."
        />
        <ProjectFilters categories={categories} active={category} onChange={setCategory} />
        <div className="projects">
          {shown.map((project, i) => (
            <Reveal key={project._id} delay={(i % 3) * 0.07}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
        <div className="section-cta">
          {projects.length > HOME_LIMIT && (
            <Link to="/projects" className="btn btn-primary">
              View all {projects.length} projects <LuArrowRight />
            </Link>
          )}
          {githubUrl && (
            <a href={ensureUrl(githubUrl)} className="btn btn-outline" target="_blank" rel="noreferrer">
              <FaGithub /> More on GitHub
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
