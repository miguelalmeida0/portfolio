import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const base = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4398';
const out = 'artifacts/portfolio-corrections/f24-cv';
await mkdir(out, { recursive: true });
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const suppliedHash = '034569afa586050d2e0dc293190c6c492650a315c63a15c0c5b21530323f8dfa';
assert.equal(hash(await readFile('static/files/miguel-almeida-cv.pdf')), suppliedHash);
const browser = await chromium.launch();
const results = [];
try {
  for (const [width, height] of [[1440,900],[1280,800],[768,1024],[390,844],[375,812]]) {
    for (const reducedMotion of ['no-preference','reduce']) {
      const context = await browser.newContext({ viewport: { width, height }, reducedMotion, isMobile: width < 600, hasTouch: width < 600, acceptDownloads: true });
      await context.addInitScript(() => sessionStorage.setItem('seen-intro', 'true'));
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(base + '/#work');
      const pair = page.getByRole('link', {name:'F24 case study', exact:true});
      await pair.scrollIntoViewIfNeeded();
      const photos = pair.locator('img');
      assert.equal(await photos.count(), 2);
      await photos.evaluateAll(images => Promise.all(images.map(image => image.decode())));
      const before = await photos.evaluateAll(images => images.map(image => ({transform:getComputedStyle(image).transform,animation:getComputedStyle(image).animationName,ratio:image.getBoundingClientRect().width/image.getBoundingClientRect().height,natural:image.naturalWidth/image.naturalHeight})));
      before.forEach(photo => { assert.equal(photo.transform,'none'); assert.equal(photo.animation,'none'); assert.ok(Math.abs(photo.ratio-photo.natural)<.01); });
      await pair.hover();
      assert.deepEqual(await photos.evaluateAll(images => images.map(image => getComputedStyle(image).transform)), ['none','none']);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      await page.screenshot({path:`${out}/${width}-${reducedMotion}-photos.png`});
      await pair.focus();
      await page.keyboard.press('Enter');
      await page.waitForURL('**/work/f24');
      await page.goto(base + '/cv');
      await page.getByRole('heading', {name:'Miguel Almeida.'}).waitFor();
      for (const text of ['5,500+','75%','10x','7,000+','13 languages','2,000+ automated checks','954 files','Duet desktop/mobile','blind-spot detection','GitLab CI']) assert.ok((await page.locator('.cv-page').innerText()).includes(text),text);
      assert.deepEqual(await page.locator('.cv-project-title').allTextContents(), ['Needle','Second Voice','Leu']);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      await page.screenshot({path:`${out}/${width}-${reducedMotion}-cv.png`,fullPage:true});
      const downloadEvent = page.waitForEvent('download');
      await page.getByRole('link',{name:'Download PDF',exact:true}).click();
      const download = await downloadEvent;
      assert.equal(hash(await readFile(await download.path())),suppliedHash);
      assert.equal(new URL(page.url()).pathname, '/cv');
      const raw = await page.request.get(base + '/portfolio.pdf');
      assert.equal(hash(await raw.body()),suppliedHash);
      const readerEvent = context.waitForEvent('page');
      await page.getByRole('link',{name:'Open CV PDF',exact:true}).click();
      const reader = await readerEvent;
      reader.on('pageerror', error => errors.push(error.message));
      await reader.waitForURL('**/cv/pdf');
      await reader.locator('.annotationLayer a').first().waitFor({timeout:20000});
      const links = await reader.locator('.annotationLayer a').evaluateAll(anchors => anchors.map(a => ({href:a.href,target:a.target,rel:a.rel})));
      assert.equal(links.length,7);
      for (const link of links) { assert.equal(link.target,'_blank'); assert.ok(link.rel.includes('noopener')); }
      for (const host of ['needle.miguelalmeida.xyz','secondvoice-ai.vercel.app','leu-desktop.vercel.app']) assert.ok(links.some(link=>link.href.includes(host)));
      // Exercise the portfolio annotation locally: confirm a new tab without relying on a third-party app.
      await context.route('https://miguelalmeida.is-a.dev/', route => route.fulfill({status:200,body:'Portfolio link destination'}));
      const popupEvent = context.waitForEvent('page');
      await reader.locator('.annotationLayer a[href="https://miguelalmeida.is-a.dev/"]').click();
      const popup = await popupEvent;
      await popup.waitForLoadState();
      assert.equal(new URL(reader.url()).pathname,'/cv/pdf');
      assert.equal(new URL(page.url()).pathname,'/cv');
      await reader.screenshot({path:`${out}/${width}-${reducedMotion}-reader.png`});
      assert.deepEqual(errors,[]);
      results.push({width,height,reducedMotion,photos:2,annotationLinks:links.length,pdfSha256:suppliedHash});
      await context.close();
    }
  }
  await writeFile(`${out}/results.json`,JSON.stringify(results,null,2));
  console.log(`${results.length} F24/CV viewport-motion combinations passed, including exact download and new-tab annotations.`);
} finally { await browser.close(); }
