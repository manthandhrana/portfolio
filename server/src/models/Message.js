import mongoose from 'mongoose';
import { str } from './_shared.js';

const messageSchema = new mongoose.Schema(
  {
    name: str(80, { required: [true, 'Please enter your name'] }),
    email: str(120, {
      required: [true, 'Please enter your email'],
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'Please enter a valid email'],
    }),
    phone: str(30),
    subject: str(150),
    service: str(120),
    budget: str(60),
    message: str(5000, { required: [true, 'Please write a message'] }),
    status: { type: String, enum: ['new', 'read', 'replied', 'archived'], default: 'new', index: true },
    starred: { type: Boolean, default: false },
    notes: str(2000),
    meta: {
      ip: String,
      userAgent: String,
    },
  },
  { timestamps: true },
);

messageSchema.index({ createdAt: -1 });

export default mongoose.model('Message', messageSchema);
