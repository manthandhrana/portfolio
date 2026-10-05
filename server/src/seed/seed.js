import { pathToFileURL } from 'node:url';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Certification from '../models/Certification.js';
import Education from '../models/Education.js';
import Experience from '../models/Experience.js';
import Profile from '../models/Profile.js';
import Project from '../models/Project.js';
import Research from '../models/Research.js';
import ResumeVariant from '../models/ResumeVariant.js';
import Service from '../models/Service.js';
import Skill from '../models/Skill.js';
import Testimonial from '../models/Testimonial.js';
import * as data from './data.js';

const COLLECTIONS = [
  [Service, data.services],
  [Skill, data.skills],
  [Experience, data.experience],
  [Education, data.education],
  [Project, data.projects],
  [Research, data.research],
  [Certification, data.certifications],
  [Testimonial, data.testimonials],
  [ResumeVariant, data.resumes],
];

/**
 * Loads the sample content. With `reset`, existing content is wiped first.
 * Admin accounts and contact messages are never touched.
 */
export async function seedContent({ reset = false } = {}) {
  if (reset) {
    await Promise.all([Profile, ...COLLECTIONS.map(([Model]) => Model)].map((Model) => Model.deleteMany({})));
  }

  if (!(await Profile.exists({}))) await Profile.create(data.profile);

  for (const [Model, items] of COLLECTIONS) {
    if (await Model.countDocuments()) continue;
    // create() one by one so slug hooks run
    for (const item of items) await Model.create(item);
  }
  console.log(`✔ Sample content loaded${reset ? ' (after reset)' : ''}`);
}

// Run directly: `npm run seed` or `npm run seed:reset`
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await connectDB();
  await seedContent({ reset: process.argv.includes('--reset') });
  await mongoose.disconnect();
}
