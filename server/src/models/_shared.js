import mongoose from 'mongoose';

export const schemaOptions = { timestamps: true };

/** Fields every content type shares: sort order, public visibility, inclusion in the PDF resume. */
export const displayFields = {
  order: { type: Number, default: 0 },
  visible: { type: Boolean, default: true },
  showInResume: { type: Boolean, default: true },
};

export const str = (max = 300, extra = {}) => ({ type: String, trim: true, maxlength: max, default: '', ...extra });
export const strList = (max = 120) => ({ type: [{ type: String, trim: true, maxlength: max }], default: [] });
/** "YYYY-MM" — matches <input type="month"> */
export const month = { type: String, trim: true, default: '', match: [/^(\d{4}-\d{2})?$/, 'Use the YYYY-MM format'] };

export function contentSchema(definition) {
  const schema = new mongoose.Schema({ ...definition, ...displayFields }, schemaOptions);
  schema.index({ order: 1 });
  return schema;
}
