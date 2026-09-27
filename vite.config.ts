import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  server: { host: '0.0.0.0', allowedHosts: ['terminal.local'] },
  plugins: [tailwindcss(), sveltekit()]
});
