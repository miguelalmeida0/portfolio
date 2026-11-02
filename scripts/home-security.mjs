import { createHash } from 'node:crypto';

/** The static homepage bypasses hooks.server; bind its CSP to the final bytes. */
export function homepageHeaders(html) {
  const hashes = [...new Set([...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter(([, attrs]) => !/\bsrc\s*=/.test(attrs) && !/type=["']application\/(?:ld\+)?json/.test(attrs))
    .map(([, , body]) => `'sha256-${createHash('sha256').update(body).digest('base64')}'`))];
  const policy = ["default-src 'self'", `script-src 'self' ${hashes.join(' ')}`,
    "style-src 'self' 'unsafe-inline'", "img-src 'self' data: blob:",
    "font-src 'self' data:", "media-src 'self' blob:", "connect-src 'self'",
    "object-src 'none'", "base-uri 'self'", "frame-ancestors 'none'", "form-action 'self'"].join('; ');
  if (policy.length > 1950) throw Error('Homepage CSP exceeds the static-header line budget; externalize inline scripts.');
  return `\n/\n  Strict-Transport-Security: max-age=31536000\n  Content-Security-Policy: ${policy}\n`;
}
