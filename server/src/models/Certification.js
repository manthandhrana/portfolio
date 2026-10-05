import mongoose from 'mongoose';
import { contentSchema, month, str } from './_shared.js';

const schema = contentSchema({
  title: str(200, { required: [true, 'Title is required'] }),
  issuer: str(120),
  date: month,
  credentialId: str(120),
  credentialUrl: str(300),
  image: str(500),
});

export default mongoose.model('Certification', schema);
