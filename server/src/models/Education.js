import mongoose from 'mongoose';
import { contentSchema, month, str, strList } from './_shared.js';

const schema = contentSchema({
  degree: str(160, { required: [true, 'Degree is required'] }),
  field: str(160),
  institution: str(200, { required: [true, 'Institution is required'] }),
  location: str(120),
  startDate: month,
  endDate: month,
  current: { type: Boolean, default: false },
  grade: str(60),
  description: str(1500),
  highlights: strList(300),
});

export default mongoose.model('Education', schema);
