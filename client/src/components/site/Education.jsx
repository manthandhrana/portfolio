import { LuArrowUpRight, LuAward, LuCalendar, LuGraduationCap } from 'react-icons/lu';
import { ensureUrl, formatMonth, period } from '../../lib/format.js';
import Reveal from '../ui/Reveal.jsx';
import SectionHeader from './SectionHeader.jsx';

export default function Education({ education, certifications }) {
  return (
    <section className="section" id="education">
      <div className="container">
        <SectionHeader eyebrow="education" title="Education & certifications" subtitle="Where I learned the fundamentals — and the certifications I’ve earned since." />
        <div className={`edu ${certifications.length && education.length ? '' : 'edu--single'}`}>
          {education.length > 0 && (
            <div className="edu__col">
              <h3 className="edu__heading">
                <LuGraduationCap /> Education
              </h3>
              <ol className="timeline timeline--compact">
                {education.map((edu, i) => (
                  <Reveal as="li" key={edu._id} className="timeline__item" delay={i * 0.06}>
                    <span className="timeline__dot" aria-hidden="true" />
                    <article className="card timeline__card">
                      <h4 className="timeline__title">{[edu.degree, edu.field].filter(Boolean).join(' in ')}</h4>
                      <p className="timeline__org">{edu.institution}</p>
                      <div className="timeline__meta">
                        <span>
                          <LuCalendar /> {period(edu.startDate, edu.endDate, edu.current)}
                        </span>
                        {edu.grade && <span className="badge">{edu.grade}</span>}
                      </div>
                      {edu.description && <p className="timeline__summary">{edu.description}</p>}
                      {edu.highlights?.length > 0 && (
                        <ul className="bullets">
                          {edu.highlights.map((h) => (
                            <li key={h}>{h}</li>
                          ))}
                        </ul>
                      )}
                    </article>
                  </Reveal>
                ))}
              </ol>
            </div>
          )}

          {certifications.length > 0 && (
            <div className="edu__col">
              <h3 className="edu__heading">
                <LuAward /> Certifications
              </h3>
              <ul className="certs">
                {certifications.map((cert, i) => (
                  <Reveal as="li" key={cert._id} delay={i * 0.05} className="card card--hover cert">
                    {cert.image ? (
                      <img className="cert__image" src={cert.image} alt="" loading="lazy" />
                    ) : (
                      <span className="icon-box icon-box--sm">
                        <LuAward />
                      </span>
                    )}
                    <div className="cert__body">
                      <h4>{cert.title}</h4>
                      <p className="muted">{[cert.issuer, formatMonth(cert.date)].filter(Boolean).join(' · ')}</p>
                    </div>
                    {cert.credentialUrl && (
                      <a
                        className="btn btn-ghost btn-icon btn-sm"
                        href={ensureUrl(cert.credentialUrl)}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Verify ${cert.title}`}
                        title="Verify credential"
                      >
                        <LuArrowUpRight />
                      </a>
                    )}
                  </Reveal>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
