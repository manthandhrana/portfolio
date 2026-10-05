import { Router } from 'express';
import { SORT } from '../config/sorting.js';
import { optionalAdmin } from '../middleware/auth.js';
import { HttpError } from '../middleware/error.js';
import Certification from '../models/Certification.js';
import Education from '../models/Education.js';
import Experience from '../models/Experience.js';
import Profile from '../models/Profile.js';
import Project from '../models/Project.js';
import Research from '../models/Research.js';
import ResumeVariant, { RESUME_SECTIONS } from '../models/ResumeVariant.js';
import Skill from '../models/Skill.js';
import { renderResume } from '../services/resumePdf.js';
import { slugify } from '../utils/slugify.js';

const router = Router();

async function findVariant(slug, isAdmin) {
  if (slug) {
    const variant = await ResumeVariant.findOne({ slug: String(slug) }).lean();
    // Hidden variants can still be previewed from the admin panel.
    if (!variant || (!variant.visible && !isAdmin)) throw new HttpError(404, 'Resume not found.');
    return variant;
  }
  const variant = await ResumeVariant.findOne({ visible: true }).sort(SORT.resumes).lean();
  return variant || { name: 'Resume', sections: RESUME_SECTIONS, maxProjects: 4 };
}

/**
 * GET /api/resume            → default resume
 * GET /api/resume/:slug      → a specific variant (e.g. /api/resume/cyber-security-researcher)
 * Add ?download=1 to force a file download instead of opening in the browser.
 */
async function sendResume(req, res) {
  const variant = await findVariant(req.params.slug, Boolean(req.admin));
  const inResume = { visible: true, showInResume: true };

  const [profile, skills, experience, education, projects, research, certifications] = await Promise.all([
    Profile.getSingleton(),
    Skill.find(inResume).sort(SORT.skills).lean(),
    Experience.find(inResume).sort(SORT.experience).lean(),
    Education.find(inResume).sort(SORT.education).lean(),
    Project.find(inResume).sort(SORT.projects).lean(),
    Research.find(inResume).sort(SORT.research).lean(),
    Certification.find(inResume).sort(SORT.certifications).lean(),
  ]);

  const filename = `${slugify(profile.name || 'resume')}-${slugify(variant.name)}.pdf`.replace(/^-/, '');
  const disposition = req.query.download ? 'attachment' : 'inline';

  // The browser's built-in PDF viewer can be blocked by the site-wide CSP.
  res.removeHeader('Content-Security-Policy');
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `${disposition}; filename="${filename}"`,
    'Cache-Control': 'no-store',
  });

  renderResume({ profile, variant, data: { skills, experience, education, projects, research, certifications } }).pipe(res);
}

router.get('/', optionalAdmin, sendResume);
router.get('/:slug', optionalAdmin, sendResume);

export default router;
