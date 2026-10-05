const isProd = process.env.NODE_ENV === 'production';

const DEFAULT_SECRET = 'change-me-to-a-long-random-string';

export const env = {
  isProd,
  port: Number(process.env.PORT) || 5000,
  trustProxy: Number(process.env.TRUST_PROXY) || 0,
  clientUrls: (process.env.CLIENT_URL || '')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio',
  jwtSecret: process.env.JWT_SECRET || DEFAULT_SECRET,
  jwtExpiresIn: '7d',
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  githubToken: process.env.GITHUB_TOKEN,
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    notify: process.env.NOTIFY_EMAIL,
  },
};

if (isProd && (env.jwtSecret === DEFAULT_SECRET || env.jwtSecret.length < 32)) {
  throw new Error('JWT_SECRET must be set to a random string of at least 32 characters in production.');
}
