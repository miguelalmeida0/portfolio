import {defineConfig} from '@playwright/test';
import audit from './portfolio-audit.config';
import {fileURLToPath} from 'node:url';
export default defineConfig({
 ...audit,
 testMatch:['human-input-release.spec.ts','cv-pdf-reader.spec.ts','case-demo-recovery.spec.ts','morrow-preview-fit.spec.ts','automatic-previews.spec.ts','bollard-mobile-pixels.spec.ts'],
 use:{...audit.use,baseURL:process.env.PORTFOLIO_AUDIT_URL||'http://localhost:4285'},
 timeout:45000,
 webServer:process.env.CI ? {
  cwd:fileURLToPath(new URL('../..',import.meta.url)),
  command:'node node_modules/wrangler/bin/wrangler.js pages dev .svelte-kit/cloudflare --ip 127.0.0.1 --port 4285 --show-interactive-dev-session=false',
  url:'http://localhost:4285',timeout:60000,reuseExistingServer:false
 } : undefined
});
