import { Icon } from '../../lib/icons.jsx';
import Reveal from '../ui/Reveal.jsx';
import SectionHeader from './SectionHeader.jsx';

const CATEGORY_ICONS = {
  frontend: 'monitor',
  backend: 'server',
  database: 'database',
  security: 'shield',
  design: 'palette',
  cms: 'wordpress',
  'tools & devops': 'wrench',
  tools: 'wrench',
  devops: 'cloud',
  mobile: 'smartphone',
};

function groupByCategory(skills) {
  const groups = new Map();
  for (const skill of skills) {
    const category = skill.category || 'Other';
    if (!groups.has(category)) groups.set(category, []);
    groups.get(category).push(skill);
  }
  return [...groups];
}

export default function Skills({ skills }) {
  const groups = groupByCategory(skills);
  const marquee = skills.filter((s) => s.icon);

  return (
    <section className="section" id="skills">
      <div className="container">
        <SectionHeader
          eyebrow="skills & tools"
          title="My tech stack"
          subtitle="The languages, frameworks and security tools I use every day to design, build and break things."
        />
      </div>

      {marquee.length > 6 && (
        <div className="marquee" aria-hidden="true">
          <div className="marquee__track">
            {[...marquee, ...marquee].map((skill, i) => (
              <span className="marquee__item" key={`${skill._id || skill.name}-${i}`}>
                <Icon name={skill.icon} />
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="container">
        <div className="skills">
          {groups.map(([category, items], i) => (
            <Reveal as="article" key={category} delay={(i % 3) * 0.08} className="card skills__group">
              <header className="skills__head">
                <span className="icon-box icon-box--sm">
                  <Icon name={CATEGORY_ICONS[category.toLowerCase()] || 'code'} />
                </span>
                <h3>{category}</h3>
                <span className="skills__count">{items.length}</span>
              </header>
              <ul className="skills__list">
                {items.map((skill) => (
                  <li key={skill._id || skill.name} className="skill">
                    <div className="skill__top">
                      <span className="skill__name">
                        {skill.icon && <Icon name={skill.icon} />}
                        {skill.name}
                      </span>
                      {skill.level > 0 && <span className="skill__level">{skill.level}%</span>}
                    </div>
                    {skill.level > 0 && (
                      <div className="skill__bar" role="presentation">
                        <span style={{ width: `${skill.level}%` }} />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
