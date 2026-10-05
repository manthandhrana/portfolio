import { LuBriefcase, LuMail, LuMapPin, LuMessageCircle, LuPhone } from 'react-icons/lu';
import { paragraphs } from '../../lib/format.js';
import Avatar from '../ui/Avatar.jsx';
import Reveal from '../ui/Reveal.jsx';
import ResumeMenu from './ResumeMenu.jsx';
import SectionHeader from './SectionHeader.jsx';

export default function About({ profile, resumes }) {
  const facts = [
    profile.location && { icon: LuMapPin, label: 'Location', value: profile.location },
    profile.email && { icon: LuMail, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    profile.phone && { icon: LuPhone, label: 'Phone', value: profile.phone, href: `tel:${profile.phone.replace(/[^\d+]/g, '')}` },
    profile.availability && { icon: LuBriefcase, label: 'Status', value: profile.availability },
  ].filter(Boolean);

  const highlight = profile.stats?.[0];

  return (
    <section className="section" id="about">
      <div className="container about">
        <Reveal className="about__media">
          <div className="about__frame">
            <Avatar src={profile.aboutImage || profile.avatar} name={profile.name} className="about__image" />
          </div>
          {highlight && (
            <div className="about__badge">
              <strong className="gradient-text">{highlight.value}</strong>
              <span>{highlight.label}</span>
            </div>
          )}
          <div className="terminal about__terminal" aria-hidden="true">
            <div className="terminal__bar">
              <span />
              <span />
              <span />
              <em>~/whoami</em>
            </div>
            <pre className="terminal__body">
              <span className="t-prompt">$</span> whoami{'\n'}
              <span className="t-out">{profile.name}</span>
              {'\n'}
              <span className="t-prompt">$</span> cat skills.txt{'\n'}
              <span className="t-out">{(profile.roles || []).slice(0, 3).join(' · ')}</span>
              {'\n'}
              <span className="t-prompt">$</span> ./status{'\n'}
              <span className="t-ok">✔ {profile.available ? 'open to new projects' : 'currently busy'}</span>
            </pre>
          </div>
        </Reveal>

        <div className="about__content">
          <SectionHeader align="left" eyebrow="about me" title="Building fast, beautiful and secure web experiences" />
          <Reveal className="about__text" delay={0.1}>
            {paragraphs(profile.about).map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </Reveal>

          {facts.length > 0 && (
            <Reveal as="ul" className="about__facts" delay={0.15}>
              {facts.map(({ icon: FactIcon, label, value, href }) => (
                <li key={label}>
                  <span className="about__fact-icon">
                    <FactIcon />
                  </span>
                  <span>
                    <small>{label}</small>
                    {href ? <a href={href}>{value}</a> : <strong>{value}</strong>}
                  </span>
                </li>
              ))}
            </Reveal>
          )}

          <Reveal className="row" delay={0.2}>
            <a href="#contact" className="btn btn-primary">
              <LuMessageCircle /> Let’s talk
            </a>
            <ResumeMenu resumes={resumes} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
