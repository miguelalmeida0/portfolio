import { brotliCompressSync, constants, gzipSync } from 'node:zlib';

import type { Handle } from '@sveltejs/kit';

const securityHeaders = {
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'cross-origin-opener-policy': 'same-origin'
};

const appendVary = (headers: Headers, value: string) => {
  const current = headers.get('vary');
  if (!current) {
    headers.set('vary', value);
    return;
  }

  const values = current.split(',').map((item) => item.trim().toLowerCase());
  if (!values.includes(value.toLowerCase())) {
    headers.set('vary', `${current}, ${value}`);
  }
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

  if (event.request.method === 'GET' && isHtml && !headers.has('cache-control')) {
    headers.set('cache-control', 'public, max-age=60, stale-while-revalidate=86400');
  }

  const acceptsEncoding = event.request.headers.get('accept-encoding') ?? '';
  const canCompress =
    event.request.method === 'GET' &&
    isHtml &&
    !!response.body &&
    !headers.has('content-encoding') &&
    !event.request.headers.has('range');

  if (!canCompress) {
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }

  const body = Buffer.from(await response.arrayBuffer());

  if (acceptsEncoding.includes('br')) {
    const compressed = brotliCompressSync(body, {
      params: {
        [constants.BROTLI_PARAM_QUALITY]: 5
      }
    });
    headers.set('content-encoding', 'br');
    headers.delete('content-length');
    appendVary(headers, 'Accept-Encoding');
    return new Response(compressed, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }

  if (acceptsEncoding.includes('gzip')) {
    const compressed = gzipSync(body, { level: 6 });
    headers.set('content-encoding', 'gzip');
    headers.delete('content-length');
    appendVary(headers, 'Accept-Encoding');
    return new Response(compressed, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }

  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
};
