// ─────────────────────────────────────────────────────────────────────────────
// SAMPLE CONTENT — loaded on first start so the site isn't empty.
// Replace everything from the admin panel (/admin). You never need to edit this file.
// ─────────────────────────────────────────────────────────────────────────────

export const profile = {
  name: 'Your Name',
  title: 'Full Stack Developer & Cyber Security Researcher',
  roles: ['Full Stack Developer', 'Cyber Security Researcher', 'UI/UX Designer', 'WordPress Developer'],
  tagline:
    'I design, build and secure fast, modern websites and web apps for businesses across India — from pixel-perfect UI to hardened, production-ready backends.',
  about: [
    "I'm a full stack web developer who builds with React, Node.js, Express and MongoDB, and a cyber security researcher who spends a lot of time breaking web applications to make them stronger.",
    'That combination means every website I deliver is designed to convert, engineered to scale, and tested against the OWASP Top 10 before it goes live.',
    'I work with startups, small businesses and agencies across India — from a simple business website to a complete e-commerce store, custom dashboard or security audit.',
  ].join('\n\n'),
  email: 'hello@example.com',
  phone: '+91 98765 43210',
  whatsapp: '919876543210',
  location: 'India',
  website: '',
  availability: 'Available for freelance projects',
  available: true,
  githubUsername: '',
  stats: [
    { value: '3+', label: 'Years experience' },
    { value: '25+', label: 'Projects delivered' },
    { value: '15+', label: 'Happy clients' },
    { value: '10+', label: 'Security findings' },
  ],
  socials: {
    github: 'https://github.com/',
    linkedin: 'https://www.linkedin.com/',
    twitter: '',
    instagram: '',
    youtube: '',
    medium: '',
    hackerone: '',
    bugcrowd: '',
    tryhackme: '',
    hackthebox: '',
  },
  seo: {
    title: 'Your Name — Full Stack Developer & Cyber Security Researcher',
    description:
      'Website design, website development, MERN web apps, WordPress and security audits (VAPT) for businesses across India.',
    keywords: 'web developer india, website designer, full stack developer, mern developer, cyber security, vapt',
  },
};

export const services = [
  {
    title: 'Website Designing',
    icon: 'palette',
    description: 'Clean, modern and conversion-focused UI/UX designs in Figma — mobile-first and on-brand.',
    features: ['Custom UI/UX in Figma', 'Mobile-first responsive layouts', 'Brand colours & typography', 'Unlimited revisions on design'],
    price: '₹4,999',
    priceNote: 'starting from',
    deliveryTime: '5–7 days',
  },
  {
    title: 'Website Development',
    icon: 'code',
    description: 'Fast, SEO-friendly business websites built with React or plain HTML/CSS/JS and deployed for you.',
    features: ['Up to 8 pages', 'Contact form & WhatsApp chat', 'On-page SEO & Google Analytics', 'Free deployment + SSL'],
    price: '₹9,999',
    priceNote: 'starting from',
    deliveryTime: '1–2 weeks',
    highlighted: true,
  },
  {
    title: 'Full Stack Web Apps (MERN)',
    icon: 'layers',
    description: 'Custom dashboards, SaaS products, booking systems and portals with React, Node.js and MongoDB.',
    features: ['Auth, roles & admin panel', 'REST APIs & integrations', 'Payment gateway (Razorpay)', 'Scalable cloud deployment'],
    price: '₹29,999',
    priceNote: 'starting from',
    deliveryTime: '3–6 weeks',
  },
  {
    title: 'E-commerce Websites',
    icon: 'cart',
    description: 'Online stores that sell — product catalogue, cart, Razorpay/UPI payments and order management.',
    features: ['Product & inventory management', 'Razorpay / UPI / COD', 'Order & invoice emails', 'Shiprocket integration'],
    price: '₹19,999',
    priceNote: 'starting from',
    deliveryTime: '2–4 weeks',
  },
  {
    title: 'WordPress Websites',
    icon: 'wordpress',
    description: 'Easy-to-manage WordPress and WooCommerce sites with Elementor, so you can edit content yourself.',
    features: ['Theme setup & customisation', 'Elementor page builder', 'WooCommerce store', 'Speed & security hardening'],
    price: '₹7,999',
    priceNote: 'starting from',
    deliveryTime: '1–2 weeks',
  },
  {
    title: 'Security Audit & VAPT',
    icon: 'shield',
    description: 'Vulnerability assessment and penetration testing for websites and APIs, with a clear fix report.',
    features: ['OWASP Top 10 testing', 'API & authentication testing', 'Detailed report with PoCs', 'Free re-test after fixes'],
    price: '₹14,999',
    priceNote: 'starting from',
    deliveryTime: '5–10 days',
  },
  {
    title: 'Maintenance & Support',
    icon: 'wrench',
    description: 'Updates, backups, uptime monitoring, bug fixes and content changes — so you can focus on business.',
    features: ['Monthly backups & updates', 'Uptime & malware monitoring', 'Small content changes', 'Priority WhatsApp support'],
    price: '₹1,999',
    priceNote: 'per month',
    deliveryTime: 'Ongoing',
  },
  {
    title: 'SEO & Speed Optimisation',
    icon: 'gauge',
    description: 'Better Google rankings and 90+ PageSpeed scores through technical SEO and performance tuning.',
    features: ['Core Web Vitals fixes', 'Technical SEO audit', 'Image & code optimisation', 'Google Search Console setup'],
    price: '₹4,999',
    priceNote: 'starting from',
    deliveryTime: '3–5 days',
  },
].map((service, order) => ({ ...service, order }));

const skill = (category) => (name, icon, level) => ({ name, icon, level, category });
const frontend = skill('Frontend');
const backend = skill('Backend');
const database = skill('Database');
const security = skill('Security');
const design = skill('Design');
const cms = skill('CMS');
const tools = skill('Tools & DevOps');

export const skills = [
  frontend('HTML5', 'html5', 95),
  frontend('CSS3', 'css', 92),
  frontend('JavaScript', 'javascript', 90),
  frontend('TypeScript', 'typescript', 75),
  frontend('React', 'react', 90),
  frontend('Next.js', 'nextjs', 75),
  frontend('Tailwind CSS', 'tailwind', 88),
  frontend('Bootstrap', 'bootstrap', 85),
  frontend('Redux', 'redux', 75),
  backend('Node.js', 'nodejs', 88),
  backend('Express.js', 'express', 88),
  backend('REST APIs', 'api', 88),
  backend('PHP', 'php', 70),
  backend('Python', 'python', 72),
  database('MongoDB', 'mongodb', 85),
  database('MySQL', 'mysql', 78),
  database('PostgreSQL', 'postgresql', 65),
  database('Firebase', 'firebase', 70),
  security('Web App Pentesting', 'shield', 85),
  security('OWASP Top 10', 'owasp', 88),
  security('Burp Suite', 'burpsuite', 85),
  security('Kali Linux', 'kali', 82),
  security('Nmap & Recon', 'radar', 80),
  security('Metasploit', 'metasploit', 70),
  security('Wireshark', 'wireshark', 70),
  design('Figma', 'figma', 85),
  design('UI/UX Design', 'pentool', 82),
  design('Responsive Design', 'smartphone', 92),
  cms('WordPress', 'wordpress', 88),
  cms('WooCommerce', 'woocommerce', 80),
  cms('Elementor', 'elementor', 85),
  tools('Git & GitHub', 'git', 88),
  tools('Docker', 'docker', 65),
  tools('Linux', 'linux', 82),
  tools('Postman', 'postman', 85),
  tools('Vercel / Netlify', 'vercel', 80),
].map((item, order) => ({ ...item, order }));

export const experience = [
  {
    role: 'Full Stack Developer',
    company: 'Company Name',
    employmentType: 'Full-time',
    location: 'India · Remote',
    startDate: '2024-01',
    current: true,
    summary: 'Building and maintaining MERN stack web applications for clients in e-commerce, education and services.',
    highlights: [
      'Built 10+ responsive React front-ends backed by Node.js/Express REST APIs and MongoDB.',
      'Cut average page load time by 40% through code-splitting, image optimisation and caching.',
      'Introduced security reviews (OWASP Top 10) into the release process, fixing XSS and IDOR issues before launch.',
    ],
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
  },
  {
    role: 'Freelance Web Developer & Security Researcher',
    company: 'Self-employed',
    employmentType: 'Freelance',
    location: 'India',
    startDate: '2022-06',
    current: true,
    summary: 'Designing and developing websites for small businesses and testing web apps for security vulnerabilities.',
    highlights: [
      'Delivered business websites, WordPress stores and admin dashboards for clients across India.',
      'Reported vulnerabilities through responsible disclosure and bug bounty programmes.',
    ],
    tech: ['WordPress', 'React', 'Burp Suite', 'Figma'],
  },
  {
    role: 'Web Developer Intern',
    company: 'Company Name',
    employmentType: 'Internship',
    location: 'India',
    startDate: '2022-01',
    endDate: '2022-05',
    summary: 'Worked on the company website and internal tools.',
    highlights: ['Converted Figma designs into pixel-perfect, responsive pages.', 'Built reusable UI components used across 5 projects.'],
    tech: ['HTML', 'CSS', 'JavaScript', 'PHP'],
  },
].map((item, order) => ({ ...item, order }));

export const education = [
  {
    degree: 'Bachelor of Technology',
    field: 'Computer Science & Engineering',
    institution: 'Your College / University',
    location: 'India',
    startDate: '2020-08',
    endDate: '2024-06',
    grade: 'CGPA: 8.0 / 10',
    description: '',
    highlights: ['Coursework: Data Structures, DBMS, Computer Networks, Information Security.'],
  },
  {
    degree: 'Higher Secondary (Class XII)',
    field: 'Science (PCM)',
    institution: 'Your School',
    location: 'India',
    startDate: '2018-04',
    endDate: '2020-03',
    grade: '',
  },
].map((item, order) => ({ ...item, order }));

export const projects = [
  {
    title: 'Portfolio CMS with Resume Generator',
    category: 'Web App',
    summary:
      'This website: a React + Vite portfolio with a Node/Express admin panel, MongoDB, contact inbox and one-click PDF resume generation.',
    tech: ['React', 'Vite', 'Node.js', 'Express', 'MongoDB', 'PDFKit'],
    featured: true,
    date: '2026-10',
  },
  {
    title: 'E-commerce Store',
    category: 'E-commerce',
    summary: 'Full-featured online store with product catalogue, cart, Razorpay payments and an order management dashboard.',
    tech: ['React', 'Node.js', 'MongoDB', 'Razorpay'],
    featured: true,
    date: '2025-08',
  },
  {
    title: 'Web Vulnerability Scanner',
    category: 'Security',
    summary: 'A recon and vulnerability-scanning dashboard that automates subdomain discovery, header checks and common misconfigurations.',
    tech: ['Python', 'Node.js', 'React'],
    featured: true,
    date: '2025-03',
  },
  {
    title: 'Business Website for a Local Clinic',
    category: 'Website',
    summary: 'Fast, SEO-optimised WordPress website with appointment booking and WhatsApp integration.',
    tech: ['WordPress', 'Elementor', 'SEO'],
    date: '2024-11',
  },
].map((item, order) => ({ ...item, order }));

export const research = [
  {
    title: 'Stored XSS in a SaaS dashboard',
    type: 'Bug Bounty',
    platform: 'Private programme',
    severity: 'High',
    date: '2025-06',
    description: 'Found a stored cross-site scripting issue in a rich-text field that allowed session hijacking of admin users. Fixed and rewarded.',
  },
  {
    title: 'IDOR exposing customer invoices',
    type: 'Responsible Disclosure',
    platform: 'E-commerce platform',
    severity: 'Medium',
    date: '2025-01',
    description: 'Broken object-level authorization let any logged-in user download other customers’ invoices by changing an ID.',
  },
  {
    title: 'Top 5% on TryHackMe',
    type: 'CTF',
    platform: 'TryHackMe',
    date: '2024-09',
    description: 'Completed 100+ rooms covering web exploitation, privilege escalation and network security.',
  },
].map((item, order) => ({ ...item, order }));

export const certifications = [
  { title: 'Certification Name', issuer: 'Issuing Organisation', date: '2025-01', credentialUrl: '' },
  { title: 'Another Certification', issuer: 'Issuing Organisation', date: '2024-06', credentialUrl: '' },
].map((item, order) => ({ ...item, order }));

export const testimonials = [
  {
    name: 'Client Name',
    role: 'Founder',
    company: 'Business Name',
    quote: 'Delivered our website ahead of schedule and it loads incredibly fast. Communication was clear throughout.',
    rating: 5,
  },
  {
    name: 'Client Name',
    role: 'Director',
    company: 'Company Name',
    quote: 'The security audit found issues our previous vendor missed — with a clear report and help fixing every one.',
    rating: 5,
  },
].map((item, order) => ({ ...item, order }));

export const resumes = [
  {
    name: 'Full Stack Developer',
    headline: 'Full Stack Developer (MERN)',
    summary:
      'Full stack developer experienced in building responsive, secure and scalable web applications with React, Node.js, Express and MongoDB. Strong focus on performance, clean code and security best practices.',
    sections: ['summary', 'skills', 'experience', 'projects', 'education', 'certifications'],
    skillCategories: ['Frontend', 'Backend', 'Database', 'Tools & DevOps'],
    isDefault: true,
    accentColor: '#5b4ae6',
  },
  {
    name: 'Cyber Security Researcher',
    headline: 'Cyber Security Researcher · Web Application Pentester',
    summary:
      'Security researcher specialising in web application and API security testing. Experienced in finding and responsibly disclosing vulnerabilities such as XSS, IDOR and authentication flaws, with a developer’s understanding of how to fix them.',
    sections: ['summary', 'skills', 'research', 'experience', 'certifications', 'projects', 'education'],
    skillCategories: ['Security', 'Backend', 'Tools & DevOps'],
    projectCategories: ['Security', 'Open Source'],
    accentColor: '#0f9f7a',
  },
  {
    name: 'UI/UX Designer',
    headline: 'UI/UX Designer & Frontend Developer',
    summary: 'Designer who codes — creating clean, accessible and conversion-focused interfaces in Figma and shipping them in React.',
    sections: ['summary', 'skills', 'projects', 'experience', 'education', 'certifications'],
    skillCategories: ['Design', 'Frontend'],
    projectCategories: ['Website', 'Web App', 'UI/UX'],
    accentColor: '#d9468f',
  },
  {
    name: 'Backend Developer',
    headline: 'Backend Developer (Node.js)',
    summary: 'Backend developer building secure REST APIs and data models with Node.js, Express, MongoDB and SQL databases.',
    sections: ['summary', 'skills', 'experience', 'projects', 'education', 'certifications'],
    skillCategories: ['Backend', 'Database', 'Security', 'Tools & DevOps'],
    accentColor: '#2563eb',
  },
  {
    name: 'WordPress Developer',
    headline: 'WordPress & WooCommerce Developer',
    summary: 'WordPress developer building fast, secure and easy-to-manage business websites and WooCommerce stores.',
    sections: ['summary', 'skills', 'experience', 'projects', 'education', 'certifications'],
    skillCategories: ['CMS', 'Frontend', 'Design'],
    projectCategories: ['Website', 'E-commerce'],
    accentColor: '#21759b',
  },
].map((item, order) => ({ ...item, order }));
