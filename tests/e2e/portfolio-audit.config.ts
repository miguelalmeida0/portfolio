import { defineConfig } from '@playwright/test';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
// Traces contain HTML; keeping them outside Vite's watched root avoids reloads.
const evidence = process.env.PORTFOLIO_AUDIT_OUTPUT || join(tmpdir(), 'portfolio-ui-audit');
export default defineConfig({
 testDir: './specs',
 testMatch: ['portfolio-first-paint.spec.ts','portfolio-audit-regressions.spec.ts','portfolio-current-journeys.spec.ts','portfolio-flow-audit.spec.ts','turntable-wipe-contrast.spec.ts','turntable-responsive-controls.spec.ts','case-demo-recovery.spec.ts','cv-pdf-reader.spec.ts','story-context.spec.ts','ask-typographic-boundaries.spec.ts'],
 timeout: 35000, expect: { timeout: 8000 }, workers: 1, retries: 0,
 reporter: [['list'], ['json', { outputFile: join(evidence, 'results.json') }]],
 outputDir: join(evidence, 'artifacts'),
 use: { baseURL: process.env.PORTFOLIO_AUDIT_URL || 'http://localhost:4275', viewport: { width: 1440, height: 900 }, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
 projects: [{ name: 'chromium', use: { browserName: 'chromium' } }, { name: 'webkit', use: { browserName: 'webkit', launchOptions: process.platform === 'linux' ? { env: { ...process.env, WEBKIT_GST_USE_PLAYBIN3: '1' } } : undefined } }]
});
