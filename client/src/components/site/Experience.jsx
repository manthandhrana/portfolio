import { LuCalendar, LuExternalLink, LuMapPin } from 'react-icons/lu';
import { ensureUrl, period } from '../../lib/format.js';
import Reveal from '../ui/Reveal.jsx';
import SectionHeader from './SectionHeader.jsx';

export default function Experience({ experience }) {
  return (
    <section className="section section--alt" id="experience">
      <div className="container container--narrow">
        <SectionHeader eyebrow="experience" title="Where I’ve worked" subtitle="Roles, freelance work and the impact I’ve made along the way." />
        <ol className="timeline">
          {experience.map((job, i) => (
            <Reveal as="li" key={job._id} className="timeline__item" delay={Math.min(i, 3) * 0.05}>
              <span className={`timeline__dot ${job.current ? 'timeline__dot--live' : ''}`} aria-hidden="true" />
              <article className="card timeline__card">
                <header className="timeline__head">
                  <div>
                    <h3 className="timeline__title">{job.role}</h3>
                    <p className="timeline__org">
                      {job.companyUrl ? (
                        <a href={ensureUrl(job.companyUrl)} target="_blank" rel="noreferrer">
                          {job.company} <LuExternalLink />
                        </a>
                      ) : (
                        job.company
                      )}
                    </p>
                  </div>
                  <div className="timeline__badges">
                    {job.current && <span className="badge badge--success">Current</span>}
                    {job.employmentType && <span className="badge">{job.employmentType}</span>}
                  </div>
                </header>
                <div className="timeline__meta">
                  <span>
                    <LuCalendar /> {period(job.startDate, job.endDate, job.current)}
                  </span>
                  {job.location && (
                    <span>
                      <LuMapPin /> {job.location}
                    </span>
                  )}
                </div>
                {job.summary && <p className="timeline__summary">{job.summary}</p>}
                {job.highlights?.length > 0 && (
                  <ul className="bullets">
                    {job.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                )}
                {job.tech?.length > 0 && (
                  <div className="chips">
                    {job.tech.map((t) => (
                      <span key={t} className="chip">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
