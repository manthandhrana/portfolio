import mongoose from 'mongoose';
import { contentSchema, month, str, strList } from './_shared.js';

const schema = contentSchema({
  role: str(120, { required: [true, 'Role is required'] }),
  company: str(120, { required: [true, 'Company is required'] }),
  companyUrl: str(300),
  employmentType: str(40),
  location: str(120),
  startDate: month,
  endDate: month,
  current: { type: Boolean, default: false },
  summary: str(1500),
  highlights: strList(400),
  tech: strList(60),
  logo: str(500),
});

export default mongoose.model('Experience', schema);
