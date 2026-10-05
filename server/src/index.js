import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import Admin from './models/Admin.js';
import Profile from './models/Profile.js';
import { seedContent } from './seed/seed.js';

async function ensureAdmin() {
  if (await Admin.countDocuments()) return;
  if (!env.adminEmail || !env.adminPassword) {
    console.warn('⚠ No admin account yet. Set ADMIN_EMAIL and ADMIN_PASSWORD in server/.env and restart.');
    return;
  }
  const admin = new Admin({ email: env.adminEmail });
  await admin.setPassword(env.adminPassword);
  await admin.save();
  console.log(`✔ Admin account created for ${env.adminEmail}`);
}

async function main() {
  await connectDB();
  await ensureAdmin();
  // First run on an empty database: load the sample content so the site isn't blank.
  if (!(await Profile.exists({}))) await seedContent();

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`✔ API ready on http://localhost:${env.port}`);
  });
}

main().catch((err) => {
  console.error('✖ Failed to start server:', err.message);
  process.exit(1);
});
