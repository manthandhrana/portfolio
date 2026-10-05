import { useEffect, useState } from 'react';
import { LuSave, LuUser } from 'react-icons/lu';
import Spinner from '../components/ui/Spinner.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { api } from '../lib/api.js';
import { SOCIALS } from '../lib/icons.jsx';
import FormField, { setPath } from './fields/FormField.jsx';

const SECTIONS = [
  {
    title: 'Basic info',
    description: 'Shown in the hero section, the navbar and at the top of every resume.',
    fields: [
      { name: 'name', label: 'Full name', required: true },
      { name: 'title', label: 'Professional title', placeholder: 'Full Stack Developer & Cyber Security Researcher' },
      { name: 'roles', label: 'Typing roles in the hero', type: 'tags', full: true, hint: 'These rotate with a typing animation.' },
      { name: 'tagline', label: 'Tagline', type: 'textarea', rows: 2, full: true },
      { name: 'availability', label: 'Availability text', placeholder: 'Available for freelance projects' },
      { name: 'available', label: 'Currently available for work (green badge)', type: 'switch' },
    ],
  },
  {
    title: 'Photos',
    description: 'Square photos work best for the profile picture.',
    fields: [
      { name: 'avatar', label: 'Profile photo (hero)', type: 'image', full: true },
      { name: 'aboutImage', label: 'About section photo', type: 'image', full: true, hint: 'Optional — falls back to the profile photo. Portrait (4:5) works best.' },
    ],
  },
  {
    title: 'About',
    fields: [
      {
        name: 'about',
        label: 'About you',
        type: 'textarea',
        rows: 8,
        full: true,
        hint: 'Leave a blank line between paragraphs. The first paragraph is also the default resume summary.',
      },
    ],
  },
  {
    title: 'Highlights',
    description: 'The numbers under the hero, e.g. “3+ Years experience”.',
    fields: [
      {
        name: 'stats',
        label: 'Stats',
        type: 'repeater',
        full: true,
        addLabel: 'Add stat',
        fields: [
          { name: 'value', label: 'Value', placeholder: '25+', width: '7rem' },
          { name: 'label', label: 'Label', placeholder: 'Projects delivered' },
        ],
      },
    ],
  },
  {
    title: 'Contact details',
    description: 'Shown in the contact section, footer and resume header.',
    fields: [
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+91 98765 43210' },
      { name: 'whatsapp', label: 'WhatsApp number', placeholder: '919876543210', hint: 'Country code + number, digits only. Adds a “Chat on WhatsApp” button.' },
      { name: 'location', label: 'Location', placeholder: 'Jaipur, India' },
      { name: 'website', label: 'Website', type: 'url', placeholder: 'https://yourname.com' },
    ],
  },
  {
    title: 'Social & security profiles',
    description: 'Leave empty to hide. HackerOne, Bugcrowd, TryHackMe and Hack The Box also appear in the Security Research section.',
    fields: [
      ...SOCIALS.map(({ key, label }) => ({ name: `socials.${key}`, label, type: 'url', placeholder: 'https://' })),
      { name: 'githubUsername', label: 'GitHub username (for project sync)', placeholder: 'octocat' },
    ],
  },
  {
    title: 'SEO',
    description: 'How your site appears on Google and when shared on WhatsApp/LinkedIn.',
    fields: [
      { name: 'seo.title', label: 'Page title', full: true },
      { name: 'seo.description', label: 'Meta description', type: 'textarea', rows: 2, full: true, hint: 'About 150 characters.' },
      { name: 'seo.keywords', label: 'Keywords', full: true, placeholder: 'web developer jaipur, website designer india' },
    ],
  },
];

export default function ProfileEditor() {
  const [values, setValues] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const toast = useToast();

  useEffect(() => {
    api
      .get('/admin/profile')
      .then(setValues)
      .catch((err) => toast(err.message, 'error'));
  }, [toast]);

  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const onChange = (name, value) => {
    setValues((v) => setPath(v, name, value));
    setDirty(true);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!values.name?.trim()) {
      setErrors({ name: 'Name is required' });
      return;
    }
    setSaving(true);
    try {
      const saved = await api.put('/admin/profile', values);
      setValues(saved);
      setErrors({});
      setDirty(false);
      toast('Profile saved — your website is updated');
    } catch (err) {
      setErrors(err.errors || {});
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!values) {
    return (
      <div className="page__loading">
        <Spinner />
      </div>
    );
  }

  return (
    <form className="page" onSubmit={save} noValidate>
      <header className="page__header page__header--sticky">
        <div className="page__heading">
          <span className="icon-box icon-box--sm">
            <LuUser />
          </span>
          <div>
            <h1>Profile & About</h1>
            <p className="muted">Your personal details, used across the website and every resume.</p>
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? <span className="spinner" /> : <LuSave />} {saving ? 'Saving…' : dirty ? 'Save changes' : 'Saved'}
        </button>
      </header>

      {SECTIONS.map((section) => (
        <section key={section.title} className="card form-section">
          <div className="form-section__intro">
            <h2>{section.title}</h2>
            {section.description && <p className="muted">{section.description}</p>}
          </div>
          <div className="form-grid">
            {section.fields.map((field) => (
              <FormField key={field.name} field={field} values={values} onChange={onChange} error={errors[field.name]} />
            ))}
          </div>
        </section>
      ))}
    </form>
  );
}
