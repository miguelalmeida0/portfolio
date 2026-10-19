import {defineConfig} from '@playwright/test';
import audit from './portfolio-audit.config';
export default defineConfig({
 ...audit,
 testMatch:[...(audit.testMatch as string[]),'portfolio-release.spec.ts'],
 use:{...audit.use,baseURL:process.env.PORTFOLIO_AUDIT_URL||'http://localhost:4285'},
 timeout:45000,
 webServer:process.env.CI ? {
  command:'node node_modules/wrangler/bin/wrangler.js pages dev .svelte-kit/cloudflare --ip 127.0.0.1 --port 4285 --show-interactive-dev-session=false',
  url:'http://localhost:4285',timeout:60000,reuseExistingServer:false
 } : undefined
});
