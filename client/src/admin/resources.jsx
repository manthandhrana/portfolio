// Every content type in the admin panel is described here: its list columns and its form fields.
// ResourceManager.jsx turns each entry into a full list + add/edit/delete screen.
import {
  LuAward,
  LuBriefcase,
  LuBug,
  LuCode,
  LuFileText,
  LuFolderGit2,
  LuGraduationCap,
  LuMessageSquareQuote,
  LuRocket,
} from 'react-icons/lu';
import { formatMonth, period } from '../lib/format.js';
import { Icon } from '../lib/icons.jsx';

export const RESUME_SECTIONS = [
  { value: 'summary', label: 'Professional summary' },
  { value: 'skills', label: 'Skills' },
  { value: 'experience', label: 'Experience' },
  { value: 'projects', label: 'Projects' },
  { value: 'research', label: 'Security research' },
  { value: 'education', label: 'Education' },
  { value: 'certifications', label: 'Certifications' },
];

const SKILL_CATEGORIES = ['Frontend', 'Backend', 'Database', 'Security', 'Design', 'CMS', 'Tools & DevOps', 'Mobile'];
const PROJECT_CATEGORIES = ['Web App', 'Website', 'E-commerce', 'Security', 'UI/UX', 'Open Source', 'Mobile'];
const RESEARCH_TYPES = ['Bug Bounty', 'CVE', 'Responsible Disclosure', 'Hall of Fame', 'CTF', 'Write-up', 'Talk', 'Tool'];
const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Internship', 'Freelance', 'Contract', 'Self-employed'];

const resumeToggle = { name: 'showInResume', label: 'Include in PDF resume', type: 'switch' };
const visibleToggle = { name: 'visible', label: 'Show on website', type: 'switch' };

export const RESOURCES = {
  services: {
    path: 'services',
    title: 'Services',
    singular: 'service',
    icon: LuRocket,
    description: 'What you offer clients. Each card has a “Get a quote” button that pre-fills the contact form.',
    sortable: true,
    columns: [
      { label: 'Service', primary: (s) => s.title, secondary: (s) => s.description, icon: (s) => <Icon name={s.icon} /> },
      { label: 'Price', render: (s) => [s.price, s.priceNote].filter(Boolean).join(' · ') || '—' },
    ],
    defaults: { icon: 'code', priceNote: 'starting from', visible: true },
    fields: [
      { name: 'title', label: 'Title', required: true, placeholder: 'Website Development' },
      { name: 'icon', label: 'Icon', type: 'icon' },
      { name: 'description', label: 'Short description', type: 'textarea', rows: 3, full: true },
      { name: 'features', label: 'Features (one per line)', type: 'lines', full: true, placeholder: 'Up to 8 pages\nContact form & WhatsApp chat' },
      { name: 'price', label: 'Price', placeholder: '₹9,999' },
      { name: 'priceNote', label: 'Price note', placeholder: 'starting from / per month' },
      { name: 'deliveryTime', label: 'Delivery time', placeholder: '1–2 weeks' },
      { name: 'highlighted', label: 'Highlight as “Most popular”', type: 'switch' },
      visibleToggle,
    ],
  },

  skills: {
    path: 'skills',
    title: 'Skills',
    singular: 'skill',
    icon: LuCode,
    description: 'Grouped by category on the website. In the resume builder you can choose which categories each resume includes.',
    sortable: true,
    filterField: 'category',
    columns: [
      { label: 'Skill', primary: (s) => s.name, icon: (s) => <Icon name={s.icon} /> },
      { label: 'Category', render: (s) => s.category },
      { label: 'Level', render: (s) => (s.level ? `${s.level}%` : '—') },
    ],
    defaults: { category: 'Frontend', level: 80, visible: true, showInResume: true },
    fields: [
      { name: 'name', label: 'Skill name', required: true, placeholder: 'React' },
      { name: 'category', label: 'Category', type: 'combo', options: SKILL_CATEGORIES },
      { name: 'icon', label: 'Icon', type: 'icon' },
      { name: 'level', label: 'Proficiency', type: 'range', min: 0, max: 100, step: 5, hint: 'Set to 0 to hide the progress bar.' },
      visibleToggle,
      resumeToggle,
    ],
  },

  experience: {
    path: 'experience',
    title: 'Experience',
    singular: 'experience',
    icon: LuBriefcase,
    description: 'Jobs, internships and freelance work — newest first on the site and in your resume.',
    columns: [
      { label: 'Role', primary: (e) => e.role, secondary: (e) => e.company },
      { label: 'Period', render: (e) => period(e.startDate, e.endDate, e.current) || '—' },
    ],
    defaults: { visible: true, showInResume: true, current: false },
    fields: [
      { name: 'role', label: 'Role / position', required: true, placeholder: 'Full Stack Developer' },
      { name: 'company', label: 'Company', required: true, placeholder: 'Company name' },
      { name: 'employmentType', label: 'Type', type: 'combo', options: EMPLOYMENT_TYPES },
      { name: 'location', label: 'Location', placeholder: 'Bengaluru · Remote' },
      { name: 'startDate', label: 'Start date', type: 'month' },
      { name: 'endDate', label: 'End date', type: 'month', showIf: (v) => !v.current },
      { name: 'current', label: 'I currently work here', type: 'switch' },
      { name: 'companyUrl', label: 'Company website', type: 'url' },
      { name: 'summary', label: 'Summary', type: 'textarea', rows: 3, full: true },
      { name: 'highlights', label: 'Achievements (one per line)', type: 'lines', full: true, hint: 'Start with a verb and add numbers: “Cut page load time by 40%…”' },
      { name: 'tech', label: 'Technologies', type: 'tags', full: true },
      visibleToggle,
      resumeToggle,
    ],
  },

  education: {
    path: 'education',
    title: 'Education',
    singular: 'education',
    icon: LuGraduationCap,
    description: 'Degrees, diplomas and schooling.',
    columns: [
      { label: 'Degree', primary: (e) => [e.degree, e.field].filter(Boolean).join(' in '), secondary: (e) => e.institution },
      { label: 'Period', render: (e) => period(e.startDate, e.endDate, e.current) || '—' },
    ],
    defaults: { visible: true, showInResume: true },
    fields: [
      { name: 'degree', label: 'Degree', required: true, placeholder: 'Bachelor of Technology' },
      { name: 'field', label: 'Field of study', placeholder: 'Computer Science' },
      { name: 'institution', label: 'Institution', required: true, full: true },
      { name: 'location', label: 'Location' },
      { name: 'grade', label: 'Grade / CGPA', placeholder: 'CGPA: 8.4 / 10' },
      { name: 'startDate', label: 'Start date', type: 'month' },
      { name: 'endDate', label: 'End date', type: 'month', showIf: (v) => !v.current },
      { name: 'current', label: 'Currently studying', type: 'switch' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 3, full: true },
      { name: 'highlights', label: 'Highlights (one per line)', type: 'lines', full: true },
      visibleToggle,
      resumeToggle,
    ],
  },

  projects: {
    path: 'projects',
    title: 'Projects',
    singular: 'project',
    icon: LuFolderGit2,
    description: 'Your own projects and repositories imported from GitHub. Featured projects appear first.',
    sortable: true,
    filterField: 'category',
    githubSync: true,
    columns: [
      { label: 'Project', primary: (p) => p.title, secondary: (p) => p.summary, image: (p) => p.image },
      { label: 'Category', render: (p) => p.category },
      {
        label: 'Source',
        render: (p) =>
          p.source === 'github' ? <span className="badge badge--neutral">GitHub ★ {p.github?.stars ?? 0}</span> : <span className="badge">Manual</span>,
      },
    ],
    defaults: { category: 'Web App', visible: true, showInResume: true, featured: false },
    fields: [
      { name: 'title', label: 'Title', required: true },
      { name: 'category', label: 'Category', type: 'combo', options: PROJECT_CATEGORIES },
      { name: 'summary', label: 'Short summary', type: 'textarea', rows: 3, full: true, hint: 'One or two sentences — used on cards and in the resume.' },
      { name: 'image', label: 'Cover image', type: 'image', full: true, hint: '16:9 works best, e.g. 1280×720.' },
      { name: 'tech', label: 'Tech stack', type: 'tags', full: true },
      { name: 'liveUrl', label: 'Live URL', type: 'url' },
      { name: 'githubUrl', label: 'GitHub URL', type: 'url' },
      { name: 'date', label: 'Date', type: 'month' },
      { name: 'featured', label: 'Featured', type: 'switch' },
      visibleToggle,
      resumeToggle,
    ],
  },

  research: {
    path: 'research',
    title: 'Security Research',
    singular: 'finding',
    icon: LuBug,
    description: 'CVEs, bug bounty reports, hall-of-fame mentions, CTFs, write-ups and talks.',
    filterField: 'type',
    columns: [
      { label: 'Title', primary: (r) => r.title, secondary: (r) => [r.platform, r.cveId].filter(Boolean).join(' · ') },
      { label: 'Type', render: (r) => r.type },
      { label: 'Severity', render: (r) => r.severity || '—' },
      { label: 'Date', render: (r) => formatMonth(r.date) || '—' },
    ],
    defaults: { type: 'Bug Bounty', visible: true, showInResume: true },
    fields: [
      { name: 'title', label: 'Title', required: true, full: true, placeholder: 'Stored XSS in admin dashboard' },
      { name: 'type', label: 'Type', type: 'combo', options: RESEARCH_TYPES },
      { name: 'severity', label: 'Severity', type: 'select', options: ['', 'Critical', 'High', 'Medium', 'Low', 'Info'] },
      { name: 'platform', label: 'Platform / organisation', placeholder: 'HackerOne · Company' },
      { name: 'cveId', label: 'CVE ID', placeholder: 'CVE-2026-12345' },
      { name: 'date', label: 'Date', type: 'month' },
      { name: 'link', label: 'Link (report / write-up)', type: 'url' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 4, full: true, hint: 'Don’t publish details of unfixed vulnerabilities.' },
      visibleToggle,
      resumeToggle,
    ],
  },

  certifications: {
    path: 'certifications',
    title: 'Certifications',
    singular: 'certification',
    icon: LuAward,
    description: 'Certificates and courses, with verification links.',
    columns: [
      { label: 'Certification', primary: (c) => c.title, secondary: (c) => c.issuer, image: (c) => c.image },
      { label: 'Date', render: (c) => formatMonth(c.date) || '—' },
    ],
    defaults: { visible: true, showInResume: true },
    fields: [
      { name: 'title', label: 'Title', required: true, full: true },
      { name: 'issuer', label: 'Issuer', placeholder: 'EC-Council, Google, Coursera…' },
      { name: 'date', label: 'Issued', type: 'month' },
      { name: 'credentialId', label: 'Credential ID' },
      { name: 'credentialUrl', label: 'Verification URL', type: 'url' },
      { name: 'image', label: 'Logo / badge', type: 'image', full: true },
      visibleToggle,
      resumeToggle,
    ],
  },

  testimonials: {
    path: 'testimonials',
    title: 'Testimonials',
    singular: 'testimonial',
    icon: LuMessageSquareQuote,
    description: 'Client reviews shown on the website.',
    sortable: true,
    columns: [
      { label: 'Client', primary: (t) => t.name, secondary: (t) => [t.role, t.company].filter(Boolean).join(', '), image: (t) => t.avatar },
      { label: 'Rating', render: (t) => '★'.repeat(t.rating || 0) },
    ],
    defaults: { rating: 5, visible: true },
    fields: [
      { name: 'name', label: 'Client name', required: true },
      { name: 'rating', label: 'Rating', type: 'select', options: [5, 4, 3, 2, 1].map((n) => ({ value: n, label: '★'.repeat(n) })) },
      { name: 'role', label: 'Role', placeholder: 'Founder' },
      { name: 'company', label: 'Company' },
      { name: 'quote', label: 'Testimonial', type: 'textarea', rows: 4, required: true, full: true },
      { name: 'avatar', label: 'Photo', type: 'image', full: true },
      visibleToggle,
    ],
  },

  resumes: {
    path: 'resumes',
    title: 'Resume Builder',
    singular: 'resume',
    icon: LuFileText,
    description:
      'Each resume is generated live from your profile, skills, experience and projects — update your data once and every PDF stays current. Create one per role you apply for.',
    sortable: true,
    resumeActions: true,
    columns: [
      { label: 'Resume', primary: (r) => r.name, secondary: (r) => r.headline },
      { label: 'Default', render: (r) => (r.isDefault ? <span className="badge badge--success">Default</span> : '—') },
    ],
    defaults: {
      sections: ['summary', 'skills', 'experience', 'projects', 'education', 'certifications'],
      maxProjects: 4,
      accentColor: '#5b4ae6',
      visible: true,
    },
    fields: [
      { name: 'name', label: 'Resume name', required: true, placeholder: 'Full Stack Developer', hint: 'Shown in the download menu on your site.' },
      { name: 'headline', label: 'Headline under your name', placeholder: 'Full Stack Developer (MERN)' },
      { name: 'summary', label: 'Professional summary', type: 'textarea', rows: 4, full: true, hint: 'Leave empty to use the first paragraph of your About text.' },
      { name: 'sections', label: 'Sections & order', type: 'sections', options: RESUME_SECTIONS, full: true },
      { name: 'skillCategories', label: 'Only these skill categories', type: 'tags', suggestions: SKILL_CATEGORIES, hint: 'Empty = all categories.' },
      { name: 'projectCategories', label: 'Only these project categories', type: 'tags', suggestions: PROJECT_CATEGORIES, hint: 'Empty = all categories.' },
      { name: 'maxProjects', label: 'Max projects', type: 'number', min: 0, max: 20 },
      { name: 'accentColor', label: 'Accent colour', type: 'color' },
      { name: 'isDefault', label: 'Default resume', type: 'switch' },
      { name: 'visible', label: 'Show in download menu', type: 'switch' },
    ],
  },
};
