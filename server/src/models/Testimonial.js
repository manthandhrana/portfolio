import mongoose from 'mongoose';
import { contentSchema, str } from './_shared.js';

const schema = contentSchema({
  name: str(80, { required: [true, 'Name is required'] }),
  role: str(120),
  company: str(120),
  avatar: str(500),
  quote: str(1200, { required: [true, 'Quote is required'] }),
  rating: { type: Number, min: 1, max: 5, default: 5 },
});

export default mongoose.model('Testimonial', schema);
