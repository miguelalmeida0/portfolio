import { dev } from '$app/environment';
import type { Handle } from '@sveltejs/kit';

const securityHeaders = {
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'cross-origin-opener-policy': 'same-origin'
};

export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  const headers = new Headers(response.headers);

  for (const [name, value] of Object.entries(securityHeaders)) {
    headers.set(name, value);
  }

  if (event.url.protocol === 'https:') {
    headers.set('strict-transport-security', 'max-age=31536000; includeSubDomains; preload');
  }

  const contentType = headers.get('content-type') ?? '';
  const isHtml = contentType.includes('text/html');

  if (dev && isHtml) {
    headers.set('cache-control', 'no-store');
  } else if (event.request.method === 'GET' && isHtml && !headers.has('cache-control')) {
    headers.set('cache-control', 'public, max-age=60, stale-while-revalidate=86400');
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
};
