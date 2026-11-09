const API_BASE = import.meta.env.VITE_API_URL || '';

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function api(path, { method = 'GET', body, headers = {} } = {}) {
  const isForm = body instanceof FormData;

  const res = await fetch(`${API_BASE}/api${path}`, {
    method,
    credentials: 'include',
    headers: {
      ...(body && !isForm ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(data.message || 'Something went wrong. Please try again.', res.status, data);
  }

  return data;
}

export function assetUrl(url) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url) || url.startsWith('data:')) return url;
  if (url.startsWith('/images/')) return url;
  return `${API_BASE}${url}`;
}

export async function uploadImages(files) {
  const form = new FormData();
  Array.from(files).forEach((file) => form.append('images', file));
  return api('/admin/upload', { method: 'POST', body: form });
}
