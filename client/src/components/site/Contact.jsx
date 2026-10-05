import { useEffect, useState } from 'react';
import { LuCircleAlert, LuCircleCheck, LuClock, LuMail, LuMapPin, LuPhone, LuSend } from 'react-icons/lu';
import { api } from '../../lib/api.js';
import { FaWhatsapp } from '../../lib/icons.jsx';
import Reveal from '../ui/Reveal.jsx';
import SectionHeader from './SectionHeader.jsx';
import SocialLinks from './SocialLinks.jsx';

const BUDGETS = [
  'Under ₹10,000',
  '₹10,000 – ₹25,000',
  '₹25,000 – ₹50,000',
  '₹50,000 – ₹1,00,000',
  'Above ₹1,00,000',
  'Not sure yet',
];

const EMPTY = { name: '', email: '', phone: '', service: '', budget: '', subject: '', message: '', website: '' };

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Please enter your name';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) errors.email = 'Please enter a valid email';
  if (form.message.trim().length < 10) errors.message = 'Tell me a little more (at least 10 characters)';
  return errors;
}

export default function Contact({ profile, services, presetService }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  useEffect(() => {
    if (presetService) setForm((f) => ({ ...f, service: presetService }));
  }, [presetService]);

  const update = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((errs) => ({ ...errs, [name]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    setStatus({ state: 'sending', message: '' });
    try {
      const res = await api.post('/public/contact', form);
      setStatus({ state: 'sent', message: res.message });
      setForm(EMPTY);
    } catch (err) {
      setErrors(err.errors || {});
      setStatus({ state: 'error', message: err.message });
    }
  };

  const whatsapp = profile.whatsapp?.replace(/\D/g, '');
  const field = (name) => ({
    id: `contact-${name}`,
    name,
    value: form[name],
    onChange: update,
    'aria-invalid': errors[name] ? 'true' : undefined,
    'aria-describedby': errors[name] ? `contact-${name}-error` : undefined,
  });
  const error = (name) =>
    errors[name] && (
      <span className="error-text" id={`contact-${name}-error`}>
        {errors[name]}
      </span>
    );

  return (
    <section className="section" id="contact">
      <div className="container">
        <SectionHeader
          eyebrow="contact"
          title="Let’s build something great together"
          subtitle="Have a project in mind or need a security audit? Tell me about it — I usually reply within 24 hours."
        />

        <div className="contact">
          <Reveal className="contact__info">
            <div className="card contact__card">
              <h3>Get in touch</h3>
              <p className="muted">Websites, web apps, WordPress or security — happy to help businesses anywhere in India.</p>
              <ul className="contact__list">
                {profile.email && (
                  <li>
                    <span className="icon-box icon-box--sm">
                      <LuMail />
                    </span>
                    <span>
                      <small>Email</small>
                      <a href={`mailto:${profile.email}`}>{profile.email}</a>
                    </span>
                  </li>
                )}
                {profile.phone && (
                  <li>
                    <span className="icon-box icon-box--sm">
                      <LuPhone />
                    </span>
                    <span>
                      <small>Phone</small>
                      <a href={`tel:${profile.phone.replace(/[^\d+]/g, '')}`}>{profile.phone}</a>
                    </span>
                  </li>
                )}
                {profile.location && (
                  <li>
                    <span className="icon-box icon-box--sm">
                      <LuMapPin />
                    </span>
                    <span>
                      <small>Location</small>
                      <strong>{profile.location}</strong>
                    </span>
                  </li>
                )}
                <li>
                  <span className="icon-box icon-box--sm">
                    <LuClock />
                  </span>
                  <span>
                    <small>Response time</small>
                    <strong>Within 24 hours</strong>
                  </span>
                </li>
              </ul>
              {whatsapp && (
                <a
                  className="btn btn-whatsapp btn-block"
                  href={`https://wa.me/${whatsapp}?text=${encodeURIComponent('Hi! I found your website and would like to discuss a project.')}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaWhatsapp /> Chat on WhatsApp
                </a>
              )}
              <SocialLinks socials={profile.socials} className="contact__socials" />
            </div>
          </Reveal>

          <Reveal as="form" className="card contact__form" delay={0.1} onSubmit={submit} noValidate>
            {status.state === 'sent' && (
              <div className="alert alert--success" role="status">
                <LuCircleCheck /> <span>{status.message}</span>
              </div>
            )}
            {status.state === 'error' && (
              <div className="alert alert--error" role="alert">
                <LuCircleAlert /> <span>{status.message}</span>
              </div>
            )}

            <div className="form-grid">
              <div className="field">
                <label className="label" htmlFor="contact-name">
                  Your name<span className="req">*</span>
                </label>
                <input className="input" placeholder="Rahul Sharma" autoComplete="name" maxLength={80} {...field('name')} />
                {error('name')}
              </div>
              <div className="field">
                <label className="label" htmlFor="contact-email">
                  Email<span className="req">*</span>
                </label>
                <input className="input" type="email" placeholder="you@company.com" autoComplete="email" maxLength={120} {...field('email')} />
                {error('email')}
              </div>
              <div className="field">
                <label className="label" htmlFor="contact-phone">
                  Phone / WhatsApp
                </label>
                <input className="input" type="tel" placeholder="+91 98765 43210" autoComplete="tel" maxLength={30} {...field('phone')} />
              </div>
              <div className="field">
                <label className="label" htmlFor="contact-service">
                  Service needed
                </label>
                <select className="select" {...field('service')}>
                  <option value="">Select a service</option>
                  {services.map((s) => (
                    <option key={s._id} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                  <option value="Other">Something else</option>
                </select>
              </div>
              <div className="field">
                <label className="label" htmlFor="contact-budget">
                  Budget
                </label>
                <select className="select" {...field('budget')}>
                  <option value="">Select a range</option>
                  {BUDGETS.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label className="label" htmlFor="contact-subject">
                  Subject
                </label>
                <input className="input" placeholder="New website for my business" maxLength={150} {...field('subject')} />
              </div>
              <div className="field field--full">
                <label className="label" htmlFor="contact-message">
                  Project details<span className="req">*</span>
                </label>
                <textarea
                  className="textarea"
                  rows={5}
                  placeholder="Tell me about your business, what you need, and any deadline…"
                  maxLength={5000}
                  {...field('message')}
                />
                {error('message')}
              </div>
              {/* Honeypot — hidden from people, bots fill it in */}
              <div className="hp-field" aria-hidden="true">
                <label htmlFor="contact-website">Website</label>
                <input tabIndex={-1} autoComplete="off" {...field('website')} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={status.state === 'sending'}>
              {status.state === 'sending' ? (
                <>
                  <span className="spinner" /> Sending…
                </>
              ) : (
                <>
                  <LuSend /> Send message
                </>
              )}
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
