import { Router } from 'express';
import { SORT } from '../config/sorting.js';
import { requireAdmin } from '../middleware/auth.js';
import { HttpError } from '../middleware/error.js';
import { upload } from '../middleware/upload.js';
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
import { syncGithubProjects } from '../services/github.js';
import { crudRouter, pickBody } from './crud.js';
import messagesRouter from './messages.js';

const router = Router();
router.use(requireAdmin);

const CONTENT = {
  experience: Experience,
  education: Education,
  skills: Skill,
  projects: Project,
  services: Service,
  research: Research,
  certifications: Certification,
  testimonials: Testimonial,
  resumes: ResumeVariant,
};

router.get('/stats', async (req, res) => {
  const entries = await Promise.all(
    Object.entries(CONTENT).map(async ([key, Model]) => [key, await Model.countDocuments()]),
  );
  const [messages, unread, recentMessages] = await Promise.all([
    Message.countDocuments(),
    Message.countDocuments({ status: 'new' }),
    Message.find().sort({ createdAt: -1 }).limit(5).select('name email subject service status createdAt'),
  ]);
  res.json({ counts: { ...Object.fromEntries(entries), messages }, unread, recentMessages });
});

router.get('/profile', async (req, res) => {
  res.json(await Profile.getSingleton());
});

router.put('/profile', async (req, res) => {
  const profile = await Profile.getSingleton();
  profile.set(pickBody(req.body));
  await profile.save();
  res.json(profile);
});

router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) throw new HttpError(400, 'No file uploaded.');
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
});

router.post('/github/sync', async (req, res) => {
  const profile = await Profile.getSingleton();
  const username = String(req.body?.username || profile.githubUsername || '').trim();
  const result = await syncGithubProjects(username, { includeForks: Boolean(req.body?.includeForks) });
  if (!profile.githubUsername) {
    profile.githubUsername = username;
    await profile.save();
  }
  res.json({ ...result, message: `Synced ${result.total} repositories (${result.created} new, ${result.updated} updated).` });
});

router.use('/messages', messagesRouter);
for (const [path, Model] of Object.entries(CONTENT)) router.use(`/${path}`, crudRouter(Model, { sort: SORT[path] }));

export default router;
