import { LuQuote, LuStar } from 'react-icons/lu';
import Avatar from '../ui/Avatar.jsx';
import Reveal from '../ui/Reveal.jsx';
import SectionHeader from './SectionHeader.jsx';

export default function Testimonials({ testimonials }) {
  return (
    <section className="section section--alt" id="testimonials">
      <div className="container">
        <SectionHeader eyebrow="testimonials" title="What clients say" />
        <div className="testimonials">
          {testimonials.map((t, i) => (
            <Reveal as="figure" key={t._id} delay={(i % 3) * 0.07} className="card testimonial">
              <LuQuote className="testimonial__quote-icon" aria-hidden="true" />
              <div className="testimonial__stars" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: 5 }, (_, n) => (
                  <LuStar key={n} className={n < t.rating ? 'is-filled' : ''} aria-hidden="true" />
                ))}
              </div>
              <blockquote>{t.quote}</blockquote>
              <figcaption className="testimonial__author">
                <Avatar src={t.avatar} name={t.name} size="2.75rem" />
                <span>
                  <strong>{t.name}</strong>
                  <small>{[t.role, t.company].filter(Boolean).join(', ')}</small>
                </span>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
