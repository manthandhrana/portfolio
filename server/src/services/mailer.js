import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

let transporter;

const oneLine = (text = '') => String(text).replace(/[\r\n]+/g, ' ').trim();

/** Emails you when someone submits the contact form. Silently skipped if SMTP isn't configured. */
export async function notifyNewMessage(message) {
  const { host, port, secure, user, pass, notify } = env.smtp;
  if (!host || !notify) return;

  transporter ??= nodemailer.createTransport({ host, port, secure, auth: user ? { user, pass } : undefined });

  await transporter.sendMail({
    from: user || notify,
    to: notify,
    replyTo: message.email,
    subject: oneLine(`New enquiry from ${message.name}${message.service ? ` · ${message.service}` : ''}`),
    text: [
      `Name:    ${message.name}`,
      `Email:   ${message.email}`,
      message.phone ? `Phone:   ${message.phone}` : null,
      message.service ? `Service: ${message.service}` : null,
      message.budget ? `Budget:  ${message.budget}` : null,
      message.subject ? `Subject: ${message.subject}` : null,
      '',
      message.message,
    ]
      .filter((line) => line !== null)
      .join('\n'),
  });
}
