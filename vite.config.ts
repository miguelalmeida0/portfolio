import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { currentBuildIdentity } from './scripts/lib/release-identity.mjs';

export default defineConfig(({command}) => {
 const identity = currentBuildIdentity(command === 'build');
 return {
  define: { __PORTFOLIO_BUILD__: JSON.stringify(identity) },
  server: {
    host: '0.0.0.0',
    allowedHosts: ['terminal.local'],
    // Native file events are not delivered reliably in the local workspace.
    // Poll so edited components and generated route modules invalidate Vite's
    // transform cache instead of leaving the browser on stale module URLs.
    watch: { usePolling: true, interval: 200 }
  },
  plugins: [tailwindcss(), sveltekit()]
 };
});
