import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import Admin from '../models/Admin.js';

export const AUTH_COOKIE = 'pf_token';

export const cookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
  secure: env.isProd,
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export function issueToken(res, admin) {
  const token = jwt.sign({ sub: admin.id, v: admin.tokenVersion }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
  res.cookie(AUTH_COOKIE, token, cookieOptions);
}

export function clearToken(res) {
  const { maxAge, ...options } = cookieOptions;
  res.clearCookie(AUTH_COOKIE, options);
}

async function resolveAdmin(req) {
  const token = req.cookies?.[AUTH_COOKIE];
  if (!token) return null;
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const admin = await Admin.findById(payload.sub);
    // tokenVersion is bumped on password change / logout, which invalidates older tokens
    if (!admin || admin.tokenVersion !== payload.v) return null;
    return admin;
  } catch {
    return null;
  }
}

export async function requireAdmin(req, res, next) {
  const admin = await resolveAdmin(req);
  if (!admin) return res.status(401).json({ message: 'Please log in to continue.' });
  req.admin = admin;
  next();
}

export async function optionalAdmin(req, res, next) {
  req.admin = await resolveAdmin(req);
  next();
}
