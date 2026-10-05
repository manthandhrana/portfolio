import mongoose from 'mongoose';
import { contentSchema, str } from './_shared.js';

const schema = contentSchema({
  name: str(60, { required: [true, 'Skill name is required'] }),
  category: str(60, { default: 'Other' }),
  level: { type: Number, min: 0, max: 100, default: 80 },
  icon: str(60),
});

export default mongoose.model('Skill', schema);
