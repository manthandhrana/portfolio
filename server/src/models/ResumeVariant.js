import mongoose from 'mongoose';
import { uniqueSlug } from '../utils/slugify.js';
import { str, strList } from './_shared.js';

export const RESUME_SECTIONS = ['summary', 'skills', 'experience', 'projects', 'research', 'education', 'certifications'];

// One data source, many resumes: each variant picks a headline, summary, sections and filters.
const resumeSchema = new mongoose.Schema(
  {
    name: str(80, { required: [true, 'Name is required'] }),
    slug: { type: String, trim: true, unique: true },
    headline: str(160),
    summary: str(2000),
    sections: {
      type: [{ type: String, enum: RESUME_SECTIONS }],
      default: ['summary', 'skills', 'experience', 'projects', 'education', 'certifications'],
    },
    skillCategories: strList(60),
    projectCategories: strList(60),
    maxProjects: { type: Number, min: 0, max: 20, default: 4 },
    accentColor: { type: String, default: '#5b4ae6', match: [/^#[0-9a-fA-F]{6}$/, 'Use a hex color like #5b4ae6'] },
    isDefault: { type: Boolean, default: false },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

resumeSchema.pre('validate', async function setSlug() {
  if (!this.slug || this.isModified('name')) {
    this.slug = await uniqueSlug(this.constructor, this.name, this._id);
  }
});

// Only one variant can be the default.
resumeSchema.post('save', async function ensureSingleDefault(doc) {
  if (doc.isDefault) await doc.constructor.updateMany({ _id: { $ne: doc._id } }, { isDefault: false });
});

export default mongoose.model('ResumeVariant', resumeSchema);
