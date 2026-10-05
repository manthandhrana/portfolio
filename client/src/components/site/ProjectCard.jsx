import { useState } from 'react';
import { FaGithub } from 'react-icons/fa6';
import { LuArrowUpRight, LuGitFork, LuStar } from 'react-icons/lu';
import { ensureUrl, formatMonth, initials } from '../../lib/format.js';
import { Icon } from '../../lib/icons.jsx';

const CATEGORY_ICONS = {
  security: 'shield',
  'web app': 'layers',
  website: 'globe',
  'e-commerce': 'cart',
  'ui/ux': 'palette',
  'open source': 'github',
  mobile: 'smartphone',
};

export default function ProjectCard({ project }) {
  const [imageFailed, setImageFailed] = useState(false);
  const mainLink = ensureUrl(project.liveUrl || project.githubUrl);
  const isGithub = project.source === 'github' || project.github?.id;

  return (
    <article className="card card--hover project">
      <div className="project__media">
        {project.image && !imageFailed ? (
          <img src={project.image} alt="" loading="lazy" onError={() => setImageFailed(true)} />
        ) : (
          <div className="project__placeholder" aria-hidden="true">
            <Icon name={CATEGORY_ICONS[project.category?.toLowerCase()] || 'code'} />
            <span>{initials(project.title)}</span>
          </div>
        )}
        <div className="project__badges">
          {project.category && <span className="badge badge--glass">{project.category}</span>}
          {project.featured && (
            <span className="badge badge--glass badge--star">
              <LuStar /> Featured
            </span>
          )}
        </div>
      </div>

      <div className="project__body">
        <div className="project__head">
          <h3 className="project__title">
            {mainLink ? (
              <a href={mainLink} target="_blank" rel="noreferrer">
                {project.title}
              </a>
            ) : (
              project.title
            )}
          </h3>
          {project.date && <span className="project__date">{formatMonth(project.date)}</span>}
        </div>
        {project.summary && <p className="project__summary">{project.summary}</p>}
        {project.tech?.length > 0 && (
          <div className="chips">
            {project.tech.slice(0, 6).map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      <footer className="project__footer">
        <div className="row">
          {project.githubUrl && (
            <a className="btn btn-ghost btn-sm" href={ensureUrl(project.githubUrl)} target="_blank" rel="noreferrer">
              <FaGithub /> Code
            </a>
          )}
          {project.liveUrl && (
            <a className="btn btn-outline btn-sm" href={ensureUrl(project.liveUrl)} target="_blank" rel="noreferrer">
              Live <LuArrowUpRight />
            </a>
          )}
        </div>
        {isGithub && (
          <div className="project__stats" title="GitHub stars and forks">
            <span>
              <LuStar /> {project.github?.stars ?? 0}
            </span>
            <span>
              <LuGitFork /> {project.github?.forks ?? 0}
            </span>
          </div>
        )}
      </footer>
    </article>
  );
}
