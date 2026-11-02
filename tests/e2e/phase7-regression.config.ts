import {defineConfig} from '@playwright/test';
import phase7 from './phase7.config';
export default defineConfig({
  ...phase7,
  workers:1,
  testMatch: ['landing-entrance.spec.ts','cv-pdf-reader.spec.ts','human-input-release.spec.ts'],
  grep: /landing|entrance|name reveal|reduced motion shows|PDF|reading scale|medium\/large|resizing across|project navigation|mobile previews autoplay/,
  reporter: [['list'],['json',{outputFile:'test-results/phase7/regressions.json'}]],
  outputDir:'test-results/phase7/regressions',
});
