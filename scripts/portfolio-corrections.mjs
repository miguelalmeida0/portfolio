import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.env.MOTION_URL || 'http://127.0.0.1:4398';
const out = 'artifacts/portfolio-corrections';
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const results = [];
const routes = ['needle', 'f24', 'second-voice', 'flow', 'leu'];
const settle = page => page.waitForTimeout(1000);
try {
  for (const viewport of [{width:1440,height:900},{width:1280,height:800},{width:768,height:1024},{width:390,height:844},{width:375,height:812}]) {
    for (const reducedMotion of ['no-preference', 'reduce']) {
      const context = await browser.newContext({viewport, reducedMotion, isMobile:viewport.width<500, hasTouch:viewport.width<1024});
      await context.addInitScript(() => sessionStorage.setItem('seen-intro', 'true'));
      await context.addInitScript(() => {
        window.__scrollCalls=[];
        const original=window.scrollTo.bind(window);
        window.scrollTo=(...args)=>{
          const record={path:location.pathname,before:scrollY,args,stack:new Error().stack};
          original(...args); record.after=scrollY;
          window.__scrollCalls.push(record);
          if(window.__scrollCalls.length>40)window.__scrollCalls.shift();
        };
      });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      for (const slug of routes) {
        await page.goto(`${base}/work/${slug}`);
        await settle(page);
        const dimensions = await page.locator('main.wrap').evaluate(n => ({width:n.getBoundingClientRect().width, viewport:innerWidth, overflow:document.documentElement.scrollWidth>innerWidth+1}));
        assert.equal(dimensions.overflow, false, `${slug}: overflow`);
        if(viewport.width>=1024) assert.ok(dimensions.width>viewport.width*.85, `${slug}: narrow canvas`);
        if(slug==='f24') {
          const photo=page.locator('#team img');
          await photo.scrollIntoViewIfNeeded(); await settle(page);
          assert.ok(await photo.evaluate(n=>n.complete&&n.naturalWidth>0));
          assert.equal(await photo.evaluate(n=>getComputedStyle(n).transform),'none');
          await page.screenshot({path:`${out}/${viewport.width}-${reducedMotion}-f24-photo.png`});
        }
        const next=page.getByRole('navigation',{name:'Next project',exact:true}).getByRole('link');
        const href=await next.getAttribute('href');
        await next.scrollIntoViewIfNeeded(); await settle(page);
        const previousY=await page.evaluate(()=>scrollY);
        const previousHeight=await page.evaluate(()=>document.documentElement.scrollHeight);
        assert.ok(previousY>500);
        await page.evaluate(()=>document.addEventListener('click',()=>{window.__departureY=scrollY;},{once:true,capture:true}));
        await next.click(); await page.waitForURL(new URL(href,base).href); await settle(page);
        const departureY=await page.evaluate(()=>window.__departureY);
        assert.ok(await page.evaluate(()=>scrollY<2), `${slug} -> ${href}: opens at bottom`);
        await page.goBack(); await settle(page);
        const restored=await page.evaluate(()=>({y:scrollY,height:document.documentElement.scrollHeight}));
        await writeFile(`${out}/${viewport.width}-${reducedMotion}-${slug}-scroll.json`,JSON.stringify(await page.evaluate(()=>window.__scrollCalls),null,2));
        await page.screenshot({path:`${out}/${viewport.width}-${reducedMotion}-${slug}-history.png`});
        assert.ok(Math.abs(restored.y-departureY)<5, `${slug}: history position lost ${JSON.stringify({previousY,departureY,previousHeight,restored})}`);
        await page.goForward(); await settle(page);
        assert.ok(await page.evaluate(()=>scrollY<2), `${slug}: forward position wrong`);
        results.push({viewport,reducedMotion,slug,next:href,previousY,dimensions});
      }
      await page.goto(base+'/'); await settle(page);
      assert.equal(await page.locator('[data-motion-owner="portrait-depth"]').count(),0);
      const picture=page.locator('[data-portrait-card] picture');
      await picture.hover(); await settle(page);
      assert.equal(await picture.evaluate(n=>getComputedStyle(n).transform),'none');
      await page.mouse.wheel(0,550); await settle(page);
      assert.ok(await page.evaluate(()=>scrollY>50),'homepage wheel blocked');
      const photo=page.locator('.f24-moment img').first();
      await photo.scrollIntoViewIfNeeded(); await settle(page);
      assert.equal(await photo.evaluate(n=>getComputedStyle(n).transform),'none');
      await page.locator('.f24-photo-link').click(); await page.waitForURL('**/work/f24'); await settle(page);
      assert.ok(await page.evaluate(()=>scrollY<2));
      await page.getByRole('navigation',{name:'F24 Connectivity Hub sections'}).getByRole('link',{name:'Try it',exact:true}).click();
      await settle(page);
      assert.equal(new URL(page.url()).hash,'#try');
      assert.ok(await page.locator('#try').evaluate(n=>Math.abs(n.getBoundingClientRect().top)<100));
      assert.ok(await page.locator('#try').evaluate(n=>n.getBoundingClientRect().top>=document.querySelector('.pnav').getBoundingClientRect().bottom),'anchor hidden by sticky navigation');
      assert.deepEqual(errors,[]);
      await context.close();
    }
  }
  await writeFile(`${out}/results.json`, JSON.stringify(results,null,2));
  console.log(`${results.length} project navigation/history checks passed across five sizes and both motion modes.`);
} finally { await browser.close(); }
