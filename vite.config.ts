import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    allowedHosts: ['terminal.local'],
    // Native file events are not delivered reliably in the local workspace.
    // Poll so edited components and generated route modules invalidate Vite's
    // transform cache instead of leaving the browser on stale module URLs.
    watch: { usePolling: true, interval: 200 }
  },
  plugins: [tailwindcss(), sveltekit()]
});
