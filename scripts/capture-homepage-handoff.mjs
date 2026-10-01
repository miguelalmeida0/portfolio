import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const output = 'artifacts/homepage-handoff';
const url = process.env.HOMEPAGE_URL || 'http://127.0.0.1:4173';
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const evidence = [];
try {
  for (const [width,height] of [[1440,1020],[1440,900],[1366,768],[1280,800],[1024,768],[834,1112],[430,932],[393,852],[390,844]]) {
    const page = await browser.newPage({ viewport: { width,height }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    const response = await page.goto(url);
    await page.locator('.project-index').waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.locator('.portrait').evaluate(img => img.decode());
    await page.screenshot({ path: `${output}/hero-${width}x${height}.png` });
    const main = width === 1440 && height === 1020 || width === 390;
    if (main) await page.screenshot({ path: `${output}/hero-${width === 390 ? 'mobile' : 'desktop'}.png` });
    for (const [index,id] of ['second-voice','f24','flow','leu'].entries()) {
      await page.locator('.project-index button').nth(index).click();
      await page.waitForFunction(expected => ['#work-title', '.caption h3'].every(selector =>
        getComputedStyle(document.querySelector(selector)).color === expected),
        ['rgb(20, 42, 34)', 'rgb(240, 243, 228)', 'rgb(20, 42, 34)', 'rgb(249, 247, 238)'][index]);
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      await page.evaluate(() => document.querySelector('#work').scrollIntoView());
      await page.locator('#work img').evaluateAll(imgs => Promise.all(imgs.map(img => img.decode().catch(() => {}))));
      await page.screenshot({ path: `${output}/work-${id}-${width}x${height}.png` });
      if (main) await page.locator('#work').screenshot({ path: `${output}/work-${id}${width === 390 ? '-mobile' : ''}.png` });
      evidence.push({ width,height,project:id,status:response.status(),title:await page.title(),errors:[...errors], geometry:await page.evaluate(() => {
        const rect = selector => {const {x,y,width,height} = document.querySelector(selector).getBoundingClientRect(); return {x,y,width,height};};
        return {work:rect('#work'),frame:rect('.frame'),hero:rect('.wind-hero'),overflow:document.documentElement.scrollWidth > innerWidth,bodyHeight:document.body.scrollHeight};
      }) });
    }
    if (main) {
      await page.locator('.project-index button').nth(0).click();
      await page.locator('footer').scrollIntoViewIfNeeded();
      await page.locator('footer img').evaluate(img => img.decode());
      await page.evaluate(() => scrollTo(0,0));
      await page.screenshot({ path: `${output}/homepage-full-${width === 390 ? 'mobile' : 'desktop'}.png`, fullPage: true });
    }
    await page.close();
  }
  for (const [width,height,name] of [[1440,900,'desktop'],[390,844,'mobile']]) {
    const page = await browser.newPage({ viewport: {width,height}, reducedMotion:'no-preference' });
    await page.clock.install();
    await page.clock.pauseAt(new Date());
    await page.goto(url, {waitUntil:'domcontentloaded'});
    await page.waitForFunction(() => document.documentElement.dataset.presentation === 'running');
    await page.clock.runFor(1250);
    await page.screenshot({path:`${output}/fresh-intro-${name}.png`});
    await page.clock.runFor(2000);
    evidence.push({intro:name,state:await page.locator('html').getAttribute('data-presentation'),inert:await page.locator('#portfolio-content').evaluate(el=>el.inert)});
    await page.close();
  }
  const playing = await browser.newPage({viewport:{width:1440,height:1020},reducedMotion:'no-preference'});
  await playing.goto(`${url}/#work`);
  for (const [index,id] of [[2,'flow'],[3,'leu']]) {
    await playing.locator('.project-index button').nth(index).click();
    await playing.locator('#work').scrollIntoViewIfNeeded();
    await playing.waitForFunction(() => {const video=document.querySelector('#work video'); return video && !video.paused && video.currentTime > 1;});
    await playing.locator('#work').screenshot({path:`${output}/work-${id}-playing.png`});
  }
  await playing.close();
  await writeFile(`${output}/geometry.json`,JSON.stringify(evidence,null,2));
  console.log(JSON.stringify({captures:evidence.length,errors:evidence.flatMap(e=>e.errors??[]),overflow:evidence.filter(e=>e.geometry?.overflow)}));
} finally { await browser.close(); }
