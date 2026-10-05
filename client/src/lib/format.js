const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2024-06" → "Jun 2024" */
export function formatMonth(value) {
  if (!value) return '';
  const [year, month] = value.split('-');
  return month ? `${MONTHS[Number(month) - 1]} ${year}` : year;
}

export function period(start, end, current) {
  return [formatMonth(start), current ? 'Present' : formatMonth(end)].filter(Boolean).join(' — ');
}

export function initials(name = '') {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('') || '</>'
  );
}

export function timeAgo(date) {
  const seconds = Math.round((Date.now() - new Date(date).getTime()) / 1000);
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];
  for (const [unit, size] of units) {
    if (seconds >= size) {
      const n = Math.floor(seconds / size);
      return `${n} ${unit}${n > 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
}

export const formatDateTime = (date) =>
  new Date(date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

export const ensureUrl = (url = '') => (!url || /^(https?:|mailto:|tel:|\/)/i.test(url) ? url : `https://${url}`);

export const prettyUrl = (url = '') => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

/** Splits the about text into paragraphs on blank lines. */
export const paragraphs = (text = '') => text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
