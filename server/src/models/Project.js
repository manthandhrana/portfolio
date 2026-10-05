import mongoose from 'mongoose';
import { uniqueSlug } from '../utils/slugify.js';
import { contentSchema, month, str, strList } from './_shared.js';

const schema = contentSchema({
  title: str(120, { required: [true, 'Title is required'] }),
  slug: { type: String, trim: true, index: true },
  summary: str(400),
  description: str(5000),
  image: str(500),
  category: str(60, { default: 'Web App' }),
  tech: strList(60),
  githubUrl: str(300),
  liveUrl: str(300),
  featured: { type: Boolean, default: false },
  date: month,
  source: { type: String, enum: ['manual', 'github'], default: 'manual' },
  github: {
    id: { type: Number, index: true, sparse: true },
    fullName: String,
    stars: { type: Number, default: 0 },
    forks: { type: Number, default: 0 },
    language: String,
    topics: [String],
    pushedAt: Date,
  },
});

schema.pre('validate', async function setSlug() {
  if (!this.slug || this.isModified('title')) {
    this.slug = await uniqueSlug(this.constructor, this.title, this._id);
  }
});

export default mongoose.model('Project', schema);
