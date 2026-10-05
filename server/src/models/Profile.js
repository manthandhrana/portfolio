import mongoose from 'mongoose';
import { str, strList } from './_shared.js';

// Single document holding everything "about you": hero, about, contact details, socials, SEO.
const profileSchema = new mongoose.Schema(
  {
    name: str(80),
    title: str(160),
    roles: strList(80),
    tagline: str(400),
    about: str(5000),
    avatar: str(500),
    aboutImage: str(500),
    email: str(120),
    phone: str(40),
    whatsapp: str(40),
    location: str(120),
    website: str(200),
    availability: str(120),
    available: { type: Boolean, default: true },
    githubUsername: str(60),
    stats: {
      type: [{ value: str(20), label: str(60) }],
      default: [],
    },
    socials: {
      github: str(200),
      linkedin: str(200),
      twitter: str(200),
      instagram: str(200),
      youtube: str(200),
      medium: str(200),
      hackerone: str(200),
      bugcrowd: str(200),
      tryhackme: str(200),
      hackthebox: str(200),
    },
    seo: {
      title: str(120),
      description: str(300),
      keywords: str(300),
    },
  },
  { timestamps: true },
);

/** Returns the one profile document, creating an empty one on first use. */
profileSchema.statics.getSingleton = async function getSingleton() {
  return (await this.findOne()) || this.create({});
};

export default mongoose.model('Profile', profileSchema);
