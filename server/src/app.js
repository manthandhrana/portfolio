import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middleware/error.js';
import { sanitize } from './middleware/sanitize.js';
import { UPLOAD_DIR } from './middleware/upload.js';
import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';
import publicRoutes from './routes/public.js';
import resumeRoutes from './routes/resume.js';

const CLIENT_DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../client/dist');

/**
 * Cheap CSRF guard: browsers can't attach a custom header to a cross-site request without a CORS
 * preflight, which we reject. Combined with the SameSite=Strict cookie this blocks forged requests.
 */
function requireAjaxHeader(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method) || req.get('x-requested-with') === 'fetch') return next();
  res.status(403).json({ message: 'Missing X-Requested-With header.' });
}

export function createApp() {
  const app = express();
  if (env.trustProxy) app.set('trust proxy', env.trustProxy);

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          'img-src': ["'self'", 'data:', 'blob:', 'https:'],
          'style-src': ["'self'", "'unsafe-inline'"],
          'font-src': ["'self'", 'data:'],
          'frame-ancestors': ["'none'"],
          'upgrade-insecure-requests': env.isProd ? [] : null,
        },
      },
      crossOriginResourcePolicy: { policy: 'same-site' },
    }),
  );
  if (env.clientUrls.length) app.use('/api', cors({ origin: env.clientUrls, credentials: true }));
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());
  app.use(sanitize);

  app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));
  app.use('/api', requireAjaxHeader);
  app.use('/api/public', publicRoutes);
  app.use('/api/resume', resumeRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api', notFound);

  app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '30d', immutable: true, fallthrough: false }));

  // In production the built React app is served from the same origin as the API.
  if (fs.existsSync(CLIENT_DIST)) {
    app.use('/assets', express.static(path.join(CLIENT_DIST, 'assets'), { maxAge: '1y', immutable: true }));
    app.use(express.static(CLIENT_DIST, { index: false }));
    app.get('/{*splat}', (req, res) => res.sendFile(path.join(CLIENT_DIST, 'index.html')));
  }

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
