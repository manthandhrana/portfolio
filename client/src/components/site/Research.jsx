import { LuArrowUpRight, LuAward, LuBug, LuFileText, LuFlag, LuMegaphone, LuShieldAlert, LuWrench } from 'react-icons/lu';
import { ensureUrl, formatMonth } from '../../lib/format.js';
import Reveal from '../ui/Reveal.jsx';
import SectionHeader from './SectionHeader.jsx';
import SocialLinks from './SocialLinks.jsx';

const TYPE_ICONS = {
  cve: LuShieldAlert,
  'bug bounty': LuBug,
  'responsible disclosure': LuShieldAlert,
  'hall of fame': LuAward,
  ctf: LuFlag,
  'write-up': LuFileText,
  writeup: LuFileText,
  talk: LuMegaphone,
  tool: LuWrench,
};

const SEVERITY_CLASS = {
  Critical: 'badge--danger',
  High: 'badge--warning',
  Medium: 'badge--info',
  Low: 'badge--success',
  Info: 'badge--neutral',
};

const SECURITY_PROFILES = ['hackerone', 'bugcrowd', 'tryhackme', 'hackthebox'];

export default function Research({ research, socials }) {
  const hasProfiles = SECURITY_PROFILES.some((key) => socials?.[key]);

  return (
    <section className="section section--alt research-section" id="research">
      <div className="research-section__bg" aria-hidden="true" />
      <div className="container">
        <SectionHeader
          eyebrow="security research"
          title="Breaking things to make them safer"
          subtitle="Vulnerabilities I’ve found and responsibly disclosed, CTFs, write-ups and security tools."
        />

        {hasProfiles && (
          <Reveal className="research__profiles">
            <span className="mono muted">find me on</span>
            <SocialLinks socials={socials} only={SECURITY_PROFILES} />
          </Reveal>
        )}

        <div className="research">
          {research.map((item, i) => {
            const TypeIcon = TYPE_ICONS[item.type?.toLowerCase()] || LuBug;
            return (
              <Reveal as="article" key={item._id} delay={(i % 3) * 0.07} className="card card--hover finding">
                <header className="finding__head">
                  <span className="finding__type">
                    <TypeIcon /> {item.type}
                  </span>
                  {item.severity && <span className={`badge ${SEVERITY_CLASS[item.severity]}`}>{item.severity}</span>}
                </header>
                <h3 className="finding__title">{item.title}</h3>
                <p className="finding__meta mono">
                  {[item.cveId, item.platform, formatMonth(item.date)].filter(Boolean).join('  ·  ')}
                </p>
                {item.description && <p className="finding__desc">{item.description}</p>}
                {item.link && (
                  <a className="finding__link" href={ensureUrl(item.link)} target="_blank" rel="noreferrer">
                    Read more <LuArrowUpRight />
                  </a>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
