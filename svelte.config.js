import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const cloudflareAdapter = adapter();
// Local pages and API routes use SvelteKit's env modules, not Cloudflare bindings.
// Avoid starting workerd for every development preview; retain it for deployment.
if (process.argv.includes('dev')) {
  delete cloudflareAdapter.emulate;
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: cloudflareAdapter
  }
};

export default config;
