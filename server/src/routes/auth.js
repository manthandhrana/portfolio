import bcrypt from 'bcryptjs';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { clearToken, issueToken, requireAdmin } from '../middleware/auth.js';
import { HttpError } from '../middleware/error.js';
import Admin from '../models/Admin.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Try again in 15 minutes.' },
});

// Compared against when the email doesn't exist, so response time doesn't reveal valid emails.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);

router.post('/login', loginLimiter, async (req, res) => {
  const email = String(req.body?.email || '').toLowerCase().trim();
  const password = String(req.body?.password || '');
  if (!email || !password) throw new HttpError(400, 'Email and password are required.');

  const admin = await Admin.findOne({ email }).select('+passwordHash');
  const valid = await bcrypt.compare(password, admin?.passwordHash || DUMMY_HASH);
  if (!admin || !valid) throw new HttpError(401, 'Invalid email or password.');

  admin.lastLoginAt = new Date();
  await admin.save();
  issueToken(res, admin);
  res.json({ admin });
});

router.post('/logout', (req, res) => {
  clearToken(res);
  res.json({ message: 'Logged out' });
});

router.get('/me', requireAdmin, (req, res) => {
  res.json({ admin: req.admin });
});

/** Update name/email and optionally the password. Always requires the current password. */
router.put('/account', requireAdmin, async (req, res) => {
  const { name, email, currentPassword, newPassword } = req.body || {};
  const admin = await Admin.findById(req.admin.id).select('+passwordHash');

  if (!(await admin.checkPassword(String(currentPassword || '')))) {
    throw new HttpError(400, 'Current password is incorrect.');
  }
  if (name !== undefined) admin.name = String(name).trim();
  if (email) admin.email = String(email).toLowerCase().trim();
  if (newPassword) {
    if (String(newPassword).length < 8) throw new HttpError(400, 'New password must be at least 8 characters.');
    await admin.setPassword(String(newPassword));
    admin.tokenVersion += 1; // signs out every other session
  }

  await admin.save();
  issueToken(res, admin);
  res.json({ admin, message: 'Account updated' });
});

export default router;
