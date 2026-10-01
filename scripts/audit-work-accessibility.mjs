import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const axePath = process.env.AXE_PATH;
if (!axePath) throw new Error('Set AXE_PATH to a local axe.min.js installation.');
const browser = await chromium.launch();
const results = [];
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: {width,height:1020}, reducedMotion:'reduce' });
    await page.goto(process.env.HOMEPAGE_URL || 'http://127.0.0.1:4173/#work');
    await page.locator('.project-index').waitFor();
    await page.addScriptTag({path:axePath});
    for (let index=0;index<4;index++) {
      await page.locator('.project-index button').nth(index).click();
      await page.waitForFunction(expected => getComputedStyle(document.querySelector('#work-title')).color === expected,
        ['rgb(20, 42, 34)','rgb(240, 243, 228)','rgb(20, 42, 34)','rgb(249, 247, 238)'][index]);
      await page.waitForFunction(expected => getComputedStyle(document.querySelector('.caption h3')).color === expected,
        ['rgb(20, 42, 34)','rgb(240, 243, 228)','rgb(20, 42, 34)','rgb(249, 247, 238)'][index]);
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      await page.evaluate(() => document.fonts.ready);
      const result = await page.evaluate(() => axe.run(document.querySelector('#work'), {runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}}));
      results.push({width,project:await page.locator('#work').getAttribute('data-project'),violations:result.violations});
    }
    await page.close();
  }
  await writeFile('artifacts/homepage-handoff/axe-work.json',JSON.stringify(results,null,2));
  console.log(JSON.stringify(results.map(({width,project,violations})=>({width,project,violations:violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))})),null,2));
} finally { await browser.close(); }
