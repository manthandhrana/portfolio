import { LuArrowRight, LuCheck, LuClock } from 'react-icons/lu';
import { Icon } from '../../lib/icons.jsx';
import Reveal from '../ui/Reveal.jsx';
import SectionHeader from './SectionHeader.jsx';

export default function Services({ services, onSelect }) {
  return (
    <section className="section section--alt" id="services">
      <div className="container">
        <SectionHeader
          eyebrow="services"
          title="What I can do for your business"
          subtitle="From design to deployment to security — everything you need to go online with confidence, at fair prices for businesses across India."
        />
        <div className="services">
          {services.map((service, i) => (
            <Reveal
              as="article"
              key={service._id}
              delay={(i % 4) * 0.06}
              className={`card card--hover service ${service.highlighted ? 'service--highlighted' : ''}`}
            >
              {service.highlighted && <span className="service__ribbon">Most popular</span>}
              <span className="icon-box">
                <Icon name={service.icon} />
              </span>
              <h3 className="service__title">{service.title}</h3>
              {service.description && <p className="service__desc">{service.description}</p>}
              {service.features?.length > 0 && (
                <ul className="service__features">
                  {service.features.map((feature) => (
                    <li key={feature}>
                      <LuCheck /> {feature}
                    </li>
                  ))}
                </ul>
              )}
              <div className="service__footer">
                {service.price && (
                  <div className="service__price">
                    {service.priceNote && <small>{service.priceNote}</small>}
                    <strong>{service.price}</strong>
                  </div>
                )}
                {service.deliveryTime && (
                  <span className="badge badge--neutral">
                    <LuClock /> {service.deliveryTime}
                  </span>
                )}
              </div>
              <button type="button" className="btn btn-outline btn-block" onClick={() => onSelect(service.title)}>
                Get a quote <LuArrowRight />
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
