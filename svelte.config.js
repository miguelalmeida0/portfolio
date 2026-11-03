import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { createHash } from 'node:crypto';

// Svelte's SSR image load/error replay uses this fixed handler before hydration.
// Authorize only those exact bytes, not arbitrary inline event handlers.
const eventReplayHash = `sha256-${createHash('sha256').update('this.__e=event').digest('base64')}`;

const cloudflareAdapter = adapter();
// Local pages and API routes use SvelteKit's env modules, not Cloudflare bindings.
// Avoid starting workerd for every development preview; retain it for deployment.
if (process.argv.includes('dev')) {
  delete cloudflareAdapter.emulate;
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  vitePlugin: { emitCss: false },
  kit: {
    // Worker-rendered pages need their own policy; the static homepage has
    // build-time script hashes. SvelteKit nonces cover hydration and app.html.
    // Keep styles/media unrestricted here to preserve authored case studies.
    csp: {
      mode: 'auto',
      directives: {
        'script-src': ['self', 'wasm-unsafe-eval'],
        'script-src-attr': ['unsafe-hashes', eventReplayHash],
        'worker-src': ['self', 'blob:'],
        'object-src': ['none'],
        'base-uri': ['self'],
        'frame-ancestors': ['none']
      }
    },
    // Vite's dev watcher regenerates server/internal.js. Sharing that directory
    // with a build can mix bootstrap IDs and leave the entire site unhydrated.
    outDir: process.argv.includes('dev') ? '.svelte-kit-dev' : '.svelte-kit',
    adapter: cloudflareAdapter
  }
};

export default config;
