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

  const isHtml = (headers.get('content-type') ?? '').includes('text/html');
  if (isHtml) {
    // Revalidate the entry document before reuse; stale HTML can select an old
    // animation bundle on navigation while a refresh selects the fixed release.
    // Fingerprinted scripts, styles and other static assets keep their own cache policy.
    headers.set('cache-control', dev ? 'no-store' : 'no-cache, max-age=0, must-revalidate');
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
};
