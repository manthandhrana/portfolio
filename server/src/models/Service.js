import mongoose from 'mongoose';
import { contentSchema, str, strList } from './_shared.js';

const schema = contentSchema({
  title: str(120, { required: [true, 'Title is required'] }),
  icon: str(60, { default: 'code' }),
  description: str(800),
  features: strList(160),
  price: str(40),
  priceNote: str(60),
  deliveryTime: str(60),
  highlighted: { type: Boolean, default: false },
});

export default mongoose.model('Service', schema);
