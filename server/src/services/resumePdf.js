import PDFDocument from 'pdfkit';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const INK = '#1d2433';
const MUTED = '#5c6475';
const RULE = '#d9dde6';

export function formatMonth(value) {
  if (!value) return '';
  const [year, month] = value.split('-');
  return month ? `${MONTHS[Number(month) - 1]} ${year}` : year;
}

export function period(start, end, current) {
  return [formatMonth(start), current ? 'Present' : formatMonth(end)].filter(Boolean).join(' – ');
}

// The built-in PDF fonts only cover Windows-1252, so swap out characters they can't draw.
const WIN_ANSI_EXTRAS = new Set('€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ');
function clean(text = '') {
  return String(text)
    .replace(/₹\s?/g, 'Rs. ')
    .replace(/[→⇒]/g, '->')
    .replace(/[^\x00-\xff]/g, (ch) => (WIN_ANSI_EXTRAS.has(ch) ? ch : ''));
}

const prettyUrl = (url = '') => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
const ensureUrl = (url = '') => (!url || /^https?:\/\//i.test(url) ? url : `https://${url}`);

function groupBy(items, key) {
  const groups = new Map();
  for (const item of items) {
    const name = item[key] || 'Other';
    if (!groups.has(name)) groups.set(name, []);
    groups.get(name).push(item);
  }
  return groups;
}

const matchesFilter = (filter, value) =>
  !filter?.length || filter.some((f) => f.toLowerCase() === String(value || '').toLowerCase());

/**
 * Builds the resume PDF for one variant from live portfolio data.
 * Returns a PDFKit document — pipe it somewhere and it will end itself.
 */
export function renderResume({ profile, variant, data }) {
  const accent = variant.accentColor || '#5b4ae6';
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 40, bottom: 44, left: 46, right: 46 },
    bufferPages: true,
    info: {
      Title: `${profile.name || 'Resume'} – ${variant.name}`,
      Author: profile.name || '',
      Subject: variant.headline || profile.title || '',
    },
  });

  const left = doc.page.margins.left;
  const width = doc.page.width - left - doc.page.margins.right;
  const bottomLimit = () => doc.page.height - doc.page.margins.bottom;
  const ensureSpace = (height) => {
    if (doc.y + height > bottomLimit()) doc.addPage();
  };

  const body = () => doc.font('Helvetica').fontSize(9.5).fillColor(INK);

  const paragraph = (text, options = {}) => {
    if (!text) return;
    body().text(clean(text), left, doc.y, { width, lineGap: 1.6, ...options });
  };

  const bullets = (items = []) => {
    for (const item of items.filter(Boolean)) {
      ensureSpace(14);
      const y = doc.y;
      body().fillColor(accent).text('•', left + 3, y, { width: 10, lineBreak: false });
      body().text(clean(item), left + 14, y, { width: width - 14, lineGap: 1.4 });
      doc.moveDown(0.12);
    }
  };

  const techLine = (tech = []) => {
    if (!tech.length) return;
    doc.moveDown(0.1);
    doc
      .font('Helvetica-Bold').fontSize(8.8).fillColor(MUTED)
      .text('Tech: ', left, doc.y, { width, continued: true })
      .font('Helvetica')
      .text(clean(tech.join(', ')));
  };

  const sectionTitle = (title) => {
    ensureSpace(48);
    doc.moveDown(0.75);
    doc.font('Helvetica-Bold').fontSize(10.5).fillColor(accent)
      .text(title.toUpperCase(), left, doc.y, { width, characterSpacing: 1.1 });
    const y = doc.y + 1.5;
    doc.moveTo(left, y).lineTo(left + width, y).lineWidth(0.6).strokeColor(RULE).stroke();
    doc.y = y + 6;
  };

  const entryHeader = ({ title, link, right, sub }) => {
    ensureSpace(46);
    const y = doc.y;
    const rightWidth = 140;
    if (right) {
      doc.font('Helvetica').fontSize(9).fillColor(MUTED)
        .text(clean(right), left + width - rightWidth, y + 1, { width: rightWidth, align: 'right' });
    }
    doc.font('Helvetica-Bold').fontSize(10.5).fillColor(INK)
      .text(clean(title), left, y, { width: width - (right ? rightWidth + 8 : 0), link: link || null });
    if (sub) {
      doc.font('Helvetica-Oblique').fontSize(9.3).fillColor(MUTED).text(clean(sub), left, doc.y + 0.5, { width });
    }
    doc.moveDown(0.25);
  };

  const gap = () => doc.moveDown(0.55);

  // ── Header ──────────────────────────────────────────────
  doc.font('Helvetica-Bold').fontSize(23).fillColor(INK).text(clean(profile.name || 'Your Name'), left, doc.y, { width });
  const headline = variant.headline || profile.title;
  if (headline) {
    doc.moveDown(0.1);
    doc.font('Helvetica').fontSize(12).fillColor(accent).text(clean(headline), { width });
  }

  const socials = profile.socials || {};
  const contacts = [
    profile.email && { text: profile.email, link: `mailto:${profile.email}` },
    profile.phone && { text: profile.phone, link: `tel:${profile.phone.replace(/[^\d+]/g, '')}` },
    profile.location && { text: profile.location },
    profile.website && { text: prettyUrl(profile.website), link: ensureUrl(profile.website) },
    socials.github && { text: prettyUrl(socials.github), link: ensureUrl(socials.github) },
    socials.linkedin && { text: prettyUrl(socials.linkedin), link: ensureUrl(socials.linkedin) },
  ].filter(Boolean);

  if (contacts.length) {
    doc.moveDown(0.35);
    doc.font('Helvetica').fontSize(9).fillColor(MUTED);
    doc.x = left;
    contacts.forEach((contact, i) => {
      const last = i === contacts.length - 1;
      // PDFKit ignores empty strings, so the line must end on real text for the cursor to advance.
      doc.text(clean(contact.text), { width, link: contact.link || null, continued: !last });
      if (!last) doc.text('   |   ', { width, link: null, continued: true });
    });
  }

  // ── Sections ────────────────────────────────────────────
  const skills = data.skills.filter((s) => matchesFilter(variant.skillCategories, s.category));
  const projects = data.projects
    .filter((p) => matchesFilter(variant.projectCategories, p.category))
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, variant.maxProjects ?? 4);

  const renderers = {
    summary() {
      const summary = variant.summary || profile.about?.split(/\n\s*\n/)[0];
      if (!summary) return;
      sectionTitle('Professional Summary');
      paragraph(summary);
    },

    skills() {
      if (!skills.length) return;
      sectionTitle('Skills');
      for (const [category, items] of groupBy(skills, 'category')) {
        ensureSpace(14);
        doc.font('Helvetica-Bold').fontSize(9.5).fillColor(INK)
          .text(`${clean(category)}: `, left, doc.y, { width, continued: true, lineGap: 1.6 })
          .font('Helvetica')
          .text(clean(items.map((s) => s.name).join(', ')));
        doc.moveDown(0.15);
      }
    },

    experience() {
      if (!data.experience.length) return;
      sectionTitle('Experience');
      data.experience.forEach((job, i) => {
        if (i) gap();
        entryHeader({
          title: job.role,
          right: period(job.startDate, job.endDate, job.current),
          sub: [job.company, job.employmentType, job.location].filter(Boolean).join('  ·  '),
          link: job.companyUrl ? ensureUrl(job.companyUrl) : null,
        });
        paragraph(job.summary);
        if (job.summary && job.highlights?.length) doc.moveDown(0.15);
        bullets(job.highlights);
        techLine(job.tech);
      });
    },

    projects() {
      if (!projects.length) return;
      sectionTitle('Projects');
      projects.forEach((project, i) => {
        if (i) gap();
        const links = [project.liveUrl && prettyUrl(project.liveUrl), project.githubUrl && prettyUrl(project.githubUrl)]
          .filter(Boolean)
          .join('  |  ');
        entryHeader({
          title: project.title,
          link: ensureUrl(project.liveUrl || project.githubUrl) || null,
          right: formatMonth(project.date),
          sub: links,
        });
        paragraph(project.summary);
        techLine(project.tech);
      });
    },

    research() {
      if (!data.research.length) return;
      sectionTitle('Security Research');
      data.research.forEach((item, i) => {
        if (i) gap();
        entryHeader({
          title: item.title,
          link: item.link ? ensureUrl(item.link) : null,
          right: formatMonth(item.date),
          sub: [item.type, item.platform, item.severity && `${item.severity} severity`, item.cveId]
            .filter(Boolean)
            .join('  ·  '),
        });
        paragraph(item.description);
      });
    },

    education() {
      if (!data.education.length) return;
      sectionTitle('Education');
      data.education.forEach((edu, i) => {
        if (i) gap();
        entryHeader({
          title: [edu.degree, edu.field].filter(Boolean).join(' in '),
          right: period(edu.startDate, edu.endDate, edu.current),
          sub: [edu.institution, edu.location, edu.grade].filter(Boolean).join('  ·  '),
        });
        paragraph(edu.description);
        bullets(edu.highlights);
      });
    },

    certifications() {
      if (!data.certifications.length) return;
      sectionTitle('Certifications');
      for (const cert of data.certifications) {
        ensureSpace(14);
        const y = doc.y;
        body().fillColor(accent).text('•', left + 3, y, { width: 10, lineBreak: false });
        doc.font('Helvetica-Bold').fontSize(9.5).fillColor(INK)
          .text(clean(cert.title), left + 14, y, {
            width: width - 14,
            continued: true,
            link: cert.credentialUrl ? ensureUrl(cert.credentialUrl) : null,
          })
          .font('Helvetica').fillColor(MUTED)
          .text(clean([cert.issuer && ` — ${cert.issuer}`, cert.date && ` (${formatMonth(cert.date)})`].filter(Boolean).join('')), {
            link: null,
          });
        doc.moveDown(0.12);
      }
    },
  };

  for (const section of variant.sections?.length ? variant.sections : Object.keys(renderers)) {
    renderers[section]?.();
  }

  // Page numbers (only when the resume spills over one page)
  const range = doc.bufferedPageRange();
  if (range.count > 1) {
    for (let i = 0; i < range.count; i++) {
      doc.switchToPage(range.start + i);
      const bottom = doc.page.margins.bottom;
      doc.page.margins.bottom = 0; // writing inside the margin would otherwise add a page
      doc.font('Helvetica').fontSize(8).fillColor(MUTED)
        .text(`${clean(profile.name || '')}  ·  Page ${i + 1} of ${range.count}`, left, doc.page.height - 28, {
          width,
          align: 'center',
          lineBreak: false,
        });
      doc.page.margins.bottom = bottom;
    }
  }

  doc.end();
  return doc;
}
