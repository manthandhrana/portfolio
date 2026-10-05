// Thin fetch wrapper. All requests are same-origin (Vite proxies /api in development).
export class ApiError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

async function request(method, path, body) {
  const headers = { 'X-Requested-With': 'fetch' };
  let payload;
  if (body instanceof FormData) payload = body;
  else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(`/api${path}`, { method, headers, body: payload, credentials: 'same-origin' });
  } catch {
    throw new ApiError('Network error — is the server running?', 0);
  }

  const data = res.headers.get('content-type')?.includes('application/json') ? await res.json() : null;
  if (!res.ok) {
    if (res.status === 401) window.dispatchEvent(new Event('auth:expired'));
    throw new ApiError(data?.message || `Request failed (${res.status})`, res.status, data?.errors);
  }
  return data;
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  patch: (path, body) => request('PATCH', path, body),
  delete: (path) => request('DELETE', path),
  upload: (file) => {
    const form = new FormData();
    form.append('file', file);
    return request('POST', '/admin/upload', form);
  },
};

export const resumeUrl = (slug, download = false) =>
  `/api/resume${slug ? `/${encodeURIComponent(slug)}` : ''}${download ? '?download=1' : ''}`;
