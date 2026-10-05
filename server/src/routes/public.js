import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { SORT } from '../config/sorting.js';
import Certification from '../models/Certification.js';
import Education from '../models/Education.js';
import Experience from '../models/Experience.js';
import Message from '../models/Message.js';
import Profile from '../models/Profile.js';
import Project from '../models/Project.js';
import Research from '../models/Research.js';
import ResumeVariant from '../models/ResumeVariant.js';
import Service from '../models/Service.js';
import Skill from '../models/Skill.js';
import Testimonial from '../models/Testimonial.js';
import { notifyNewMessage } from '../services/mailer.js';

const router = Router();

const visible = { visible: true };

/** Everything the public site needs, in one request. */
router.get('/portfolio', async (req, res) => {
  const [profile, services, skills, experience, education, projects, research, certifications, testimonials, resumes] =
    await Promise.all([
      Profile.getSingleton(),
      Service.find(visible).sort(SORT.services).lean(),
      Skill.find(visible).sort(SORT.skills).lean(),
      Experience.find(visible).sort(SORT.experience).lean(),
      Education.find(visible).sort(SORT.education).lean(),
      Project.find(visible).sort(SORT.projects).lean(),
      Research.find(visible).sort(SORT.research).lean(),
      Certification.find(visible).sort(SORT.certifications).lean(),
      Testimonial.find(visible).sort(SORT.testimonials).lean(),
      ResumeVariant.find(visible).sort(SORT.resumes).select('name slug headline isDefault').lean(),
    ]);

  res.set('Cache-Control', 'no-cache');
  res.json({ profile, services, skills, experience, education, projects, research, certifications, testimonials, resumes });
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'You have sent several messages already. Please try again in an hour.' },
});

router.post('/contact', contactLimiter, async (req, res) => {
  const { name, email, phone, subject, service, budget, message, website } = req.body || {};
  const thanks = { message: 'Thank you! Your message has been sent — I will get back to you soon.' };

  // Honeypot: real visitors never see or fill the hidden "website" field.
  if (website) return res.status(201).json(thanks);

  const saved = await Message.create({
    name,
    email,
    phone,
    subject,
    service,
    budget,
    message,
    meta: { ip: req.ip, userAgent: String(req.get('user-agent') || '').slice(0, 300) },
  });

  notifyNewMessage(saved).catch((err) => console.error('Email notification failed:', err.message));
  res.status(201).json(thanks);
});

export default router;
