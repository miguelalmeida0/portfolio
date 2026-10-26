import {readFileSync} from 'node:fs';
import {test,expect} from '@playwright/test';

test('Bollard joins the project index and opens an accessible fictional case study',async({page})=>{
 await page.goto('/#bollard');
 await expect(page.locator('.project')).toHaveCount(5);
 await expect(page.locator('[data-project="4"]')).toHaveAttribute('aria-controls','bollard');
 const project=page.locator('#bollard');
 await expect(project.getByRole('link',{name:'Open Bollard app in a new tab'})).toHaveAttribute('href','https://bollard-nine.vercel.app/today');
 await project.locator('.project-shot').click();
 const dialog=page.getByRole('dialog');
 await expect(dialog).toBeVisible();
 await expect(dialog.getByRole('heading',{name:'Bollard',exact:true})).toBeVisible();
 await expect(dialog).toContainText('+€62/t');await expect(dialog).toContainText('+€23/t');
 await expect(dialog).toContainText('€1.19M');await expect(dialog).toContainText('hypothetical estimate');
 await expect(dialog.getByRole('link',{name:'Open Bollard app in a new tab'})).toHaveAttribute('href','https://bollard-nine.vercel.app/today');
 await page.keyboard.press('Escape');await expect(dialog).not.toBeVisible();
});

test('Bollard uses its static poster for reduced motion',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/#bollard');
 await expect(page.locator('#bollard .project-cover')).toBeVisible();
 await expect(page.locator('#bollard-film')).toBeHidden();
 await expect(page.locator('[data-bollard-toggle]')).toBeHidden();
 expect(await page.locator('#bollard-film').evaluate((video:HTMLVideoElement)=>video.paused)).toBe(true);
});

test('global mobile pause also stops and resumes Bollard',async({page,isMobile})=>{
 test.skip(!isMobile,'Shared motion control is mobile only');
 await page.goto('/#bollard');
 await expect(page.locator('#bollard-film')).toBeVisible();
 const global=page.locator('[data-film-toggle]');
 await global.click();
 await expect(page.locator('#bollard-film')).toBeHidden();
 await expect(page.locator('#bollard .project-cover')).toBeVisible();
 await global.click();
 await page.locator('#bollard .project-shot').scrollIntoViewIfNeeded();
 await expect(page.locator('#bollard-film')).toBeVisible();
});

test('Bollard case content remains available without JavaScript',async({browser,baseURL})=>{
 const context=await browser.newContext({javaScriptEnabled:false,baseURL});
 const page=await context.newPage();
 await page.goto('/#bollard');
 const fallback=page.locator('.bollard-case-fallback');
 await fallback.getByText('Read Bollard case study',{exact:true}).click();
 await expect(fallback).toContainText('+€62/t');
 await expect(fallback).toContainText('+€23/t');
 await expect(fallback).toContainText('hypothetical estimate');
 await expect(page.locator('a[href="https://miguelalmeida.is-a.dev/work/bollard"]')).toHaveCount(0);
 await context.close();
});

test('visitor evidence and approval controls seek the film and resume local pause',async({page})=>{
 await page.goto('/#bollard');
 const video=page.locator('#bollard-film');
 await expect(video).toBeVisible();
 await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.duration)).toBe(6.5);
 await page.locator('[data-bollard-toggle]').click();
 await expect(video).toBeHidden();
 await page.getByRole('button',{name:'Inspect evidence',exact:true}).click();
 await expect(video).toBeVisible();
 await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.currentTime)).toBeGreaterThanOrEqual(0.8);
 expect(await video.evaluate((v:HTMLVideoElement)=>v.currentTime)).toBeLessThan(1.7);
 await page.getByRole('button',{name:'Approve preview',exact:true}).click();
 await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.currentTime)).toBeGreaterThanOrEqual(2.5);
 expect(await video.evaluate((v:HTMLVideoElement)=>v.currentTime)).toBeLessThan(4);
 expect(await video.evaluate((v:HTMLVideoElement)=>v.paused)).toBe(false);
 await expect(page.getByRole('dialog')).not.toBeVisible();
});


test('explicit preview seeks work when the server ignores HTTP byte ranges',async({page})=>{
 const media=readFileSync(new URL('../../../static/projects/bollard/approval-v3.mp4',import.meta.url));let fetches=0;
 await page.route('**/projects/bollard/approval-v3.mp4',route=>{
  if(route.request().resourceType()==='fetch')fetches++;
  return route.fulfill({status:200,contentType:'video/mp4',body:media});
 });
 await page.goto('/#bollard');const video=page.locator('#bollard-film');
 await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.readyState)).toBe(4);
 expect(await video.evaluate((v:HTMLVideoElement)=>v.seekable.length?v.seekable.end(v.seekable.length-1):0)).toBe(0);
 await page.getByRole('button',{name:'Inspect evidence',exact:true}).click();
 await page.getByRole('button',{name:'Approve preview',exact:true}).click();
 await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.src)).toMatch(/^blob:/);
 await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.currentTime)).toBeGreaterThanOrEqual(2.5);
 expect(await video.evaluate((v:HTMLVideoElement)=>v.currentTime)).toBeLessThan(4);
 expect(fetches).toBe(1);
 await page.getByRole('button',{name:'Inspect evidence',exact:true}).click();
 await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.currentTime)).toBeGreaterThanOrEqual(0.8);
 expect(await video.evaluate((v:HTMLVideoElement)=>v.currentTime)).toBeLessThan(1.7);expect(fetches).toBe(1);
});

for(const failure of ['download','blob media'])test(`preview retries after a ${failure} failure`,async({page})=>{
 const media=readFileSync(new URL('../../../static/projects/bollard/approval-v3.mp4',import.meta.url));let fetches=0;
 await page.route('**/projects/bollard/approval-v3.mp4',route=>{
  if(route.request().resourceType()==='fetch'&&++fetches===1)return route.fulfill({status:failure==='download'?503:200,contentType:'video/mp4',body:Buffer.from('unavailable media')});
  return route.fulfill({status:200,contentType:'video/mp4',body:media});
 });
 await page.goto('/#bollard');const video=page.locator('#bollard-film');
 await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.readyState)).toBe(4);
 await page.getByRole('button',{name:'Inspect evidence',exact:true}).click();await expect.poll(()=>fetches).toBe(1);
 if(failure==='blob media')await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.src)).toMatch(/\/projects\/bollard\/approval-v3\.mp4$/);
 // Retry the explicit action until the asynchronous failed request has settled.
 await expect.poll(async()=>{await page.getByRole('button',{name:'Approve preview',exact:true}).click();return fetches;}).toBe(2);
 await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.src)).toMatch(/^blob:/);
 await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.currentTime)).toBeGreaterThanOrEqual(2.5);
 expect(await video.evaluate((v:HTMLVideoElement)=>v.currentTime)).toBeLessThan(4);
 await expect(video).toBeVisible();expect(fetches).toBe(2);
});
