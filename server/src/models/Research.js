import mongoose from 'mongoose';
import { contentSchema, month, str } from './_shared.js';

// Security research: CVEs, bug bounty reports, hall-of-fame mentions, CTFs, write-ups, talks, tools.
const schema = contentSchema({
  title: str(200, { required: [true, 'Title is required'] }),
  type: str(40, { default: 'Bug Bounty' }),
  platform: str(120),
  severity: { type: String, enum: ['', 'Critical', 'High', 'Medium', 'Low', 'Info'], default: '' },
  cveId: str(40),
  date: month,
  description: str(2000),
  link: str(300),
});

export default mongoose.model('Research', schema);
