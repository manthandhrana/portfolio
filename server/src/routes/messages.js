import { Router } from 'express';
import { HttpError } from '../middleware/error.js';
import Message from '../models/Message.js';

const router = Router();

const FILTERS = {
  inbox: { status: { $ne: 'archived' } },
  new: { status: 'new' },
  starred: { starred: true },
  replied: { status: 'replied' },
  archived: { status: 'archived' },
  all: {},
};

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

router.get('/', async (req, res) => {
  const filter = { ...(FILTERS[req.query.filter] || FILTERS.inbox) };
  const q = String(req.query.q || '').trim().slice(0, 100);
  if (q) {
    const re = new RegExp(escapeRegex(q), 'i');
    filter.$or = [{ name: re }, { email: re }, { subject: re }, { message: re }, { service: re }];
  }
  res.json(await Message.find(filter).sort({ createdAt: -1 }).limit(500).select('-meta'));
});

router.get('/:id', async (req, res) => {
  const message = await Message.findById(req.params.id);
  if (!message) throw new HttpError(404, 'Message not found.');
  if (message.status === 'new') {
    message.status = 'read';
    await message.save();
  }
  res.json(message);
});

router.patch('/:id', async (req, res) => {
  const message = await Message.findById(req.params.id);
  if (!message) throw new HttpError(404, 'Message not found.');
  const { status, starred, notes } = req.body || {};
  if (status !== undefined) message.status = status;
  if (starred !== undefined) message.starred = Boolean(starred);
  if (notes !== undefined) message.notes = notes;
  await message.save();
  res.json(message);
});

router.delete('/:id', async (req, res) => {
  const message = await Message.findByIdAndDelete(req.params.id);
  if (!message) throw new HttpError(404, 'Message not found.');
  res.json({ message: 'Deleted', id: message.id });
});

export default router;
