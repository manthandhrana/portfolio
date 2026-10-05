import { LuArrowRight, LuShieldCheck } from 'react-icons/lu';
import { useTypewriter } from '../../hooks/useTypewriter.js';
import { Icon } from '../../lib/icons.jsx';
import Avatar from '../ui/Avatar.jsx';
import ResumeMenu from './ResumeMenu.jsx';
import SocialLinks from './SocialLinks.jsx';

const PREFERRED_CHIPS = ['react', 'nodejs', 'mongodb', 'burpsuite', 'shield', 'figma', 'wordpress', 'javascript'];

function pickChips(skills) {
  const withIcons = skills.filter((s) => s.icon);
  const preferred = PREFERRED_CHIPS.map((icon) => withIcons.find((s) => s.icon === icon)).filter(Boolean);
  const rest = withIcons.filter((s) => !preferred.includes(s)).sort((a, b) => b.level - a.level);
  return [...preferred, ...rest].slice(0, 4);
}

export default function Hero({ profile, skills, resumes }) {
  const roles = profile.roles?.length ? profile.roles : [profile.title].filter(Boolean);
  const typed = useTypewriter(roles);
  const chips = pickChips(skills);

  return (
    <section className="hero" id="home">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__grid" />
        <div className="hero__glow hero__glow--1" />
        <div className="hero__glow hero__glow--2" />
      </div>

      <div className="container hero__inner">
        <div className="hero__content">
          {profile.availability && (
            <span className={`status-pill ${profile.available ? '' : 'status-pill--busy'}`}>
              <span className="status-pill__dot" />
              {profile.availability}
            </span>
          )}

          <h1 className="hero__title">
            Hi, I’m <span className="gradient-text">{profile.name}</span>
          </h1>

          {roles.length > 0 && (
            <p className="hero__role mono" aria-label={roles.join(', ')}>
              <span className="hero__prompt" aria-hidden="true">
                &gt;_
              </span>
              <span aria-hidden="true">{typed}</span>
              <span className="hero__caret" aria-hidden="true" />
            </p>
          )}

          {profile.tagline && <p className="hero__tagline">{profile.tagline}</p>}

          <div className="hero__actions">
            <a href="#contact" className="btn btn-primary btn-lg">
              Hire me <LuArrowRight />
            </a>
            <ResumeMenu resumes={resumes} className="btn btn-outline btn-lg" />
          </div>

          <SocialLinks socials={profile.socials} className="hero__socials" />
        </div>

        <div className="hero__visual" aria-hidden="true">
          <div className="hero__orbit" />
          <div className="hero__avatar-ring">
            <Avatar src={profile.avatar} name={profile.name} className="hero__avatar" />
          </div>
          {chips.map((skill, i) => (
            <span key={skill._id || skill.name} className={`float-chip float-chip--${i + 1}`}>
              <Icon name={skill.icon} />
              {skill.name}
            </span>
          ))}
          <span className="float-chip float-chip--secure">
            <LuShieldCheck />
            Secure by design
          </span>
        </div>
      </div>

      {profile.stats?.length > 0 && (
        <div className="container">
          <dl className="stats">
            {profile.stats.map((stat) => (
              <div key={`${stat.label}-${stat.value}`} className="stats__item">
                <dt className="stats__value gradient-text">{stat.value}</dt>
                <dd className="stats__label">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </section>
  );
}
