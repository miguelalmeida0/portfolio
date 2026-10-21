import sharp from 'sharp';
import {test,expect,type Page} from '@playwright/test';
test.use({contextOptions:{reducedMotion:'no-preference'}});
async function hold(page:Page){
 await page.addInitScript(()=>{const animate=Element.prototype.animate;Element.prototype.animate=function(...args:Parameters<typeof animate>){const a=animate.apply(this,args);if(this.matches('[data-intro-backdrop]')&&a.effect?.getTiming().duration===3600){a.pause();a.currentTime=0;}return a;};});
 await page.goto('/hero-lab/typographic#top');
 await expect(page.locator('[data-pixel-intro]')).toHaveAttribute('data-stage','approach');
}
async function seek(page:Page,t:number){await page.locator('[data-intro-backdrop]').evaluate((el,t)=>{const a=el.getAnimations()[0];if(t>=3600)a.finish();else a.currentTime=t;},t);await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));}
for(const width of [390,768,1440]){
 test('front portrait resolves into the live header at '+width,async({page})=>{
  await page.setViewportSize({width,height:900});await hold(page);
  await expect(page.locator('.mah')).toHaveAttribute('data-role','engineer');
  await expect(page.locator('[data-intro-photo]')).toHaveAttribute('src','/turntable-header/miguel-front-contour.webp');
  await seek(page,3550);
  const photo=await page.locator('[data-intro-photo]').boundingBox(),live=await page.locator('.mah-photo-front').boundingBox();
  for(const key of ['x','y','width','height'] as const)expect(Math.abs(photo![key]-live![key])).toBeLessThan(1);
  await expect(page.locator('[data-intro-photo]')).toHaveCSS('opacity','1');
  await page.screenshot({path:'/tmp/portfolio-intro-20261019/handoff-'+width+'.png'});
  const clip={x:Math.floor(live!.x),y:Math.floor(live!.y),width:Math.ceil(live!.width),height:Math.ceil(live!.height)};
  const before=await page.screenshot({clip});
  await seek(page,3601);await expect(page.locator('[data-pixel-intro]')).toHaveCount(0);
  const after=await page.screenshot({clip});
  const a=await sharp(before).ensureAlpha().raw().toBuffer(),b=await sharp(after).ensureAlpha().raw().toBuffer();
  let changed=0,max=0;
  for(let i=0;i<a.length;i++){const delta=Math.abs(a[i]-b[i]);if(delta)changed++;max=Math.max(max,delta);}
  expect({changed,max},'portrait pixels must not change at handoff').toEqual({changed:0,max:0});
  await expect(page.locator('#portfolio-content')).not.toHaveAttribute('inert');
  expect(await page.evaluate(()=>document.body.style.backgroundColor)).toBe('');
  await page.getByRole('button',{name:'Product designer',exact:true}).click();
  await expect(page.locator('.mah')).toHaveAttribute('data-role','designer');
 });
}
test('resize during transfer remeasures the front portrait',async({page})=>{
 await hold(page);await seek(page,2800);await page.setViewportSize({width:390,height:844});await page.waitForTimeout(100);await seek(page,3550);
 const a=await page.locator('[data-intro-photo]').boundingBox(),b=await page.locator('.mah-photo-front').boundingBox();
 for(const k of ['x','y','width','height'] as const)expect(Math.abs(a![k]-b![k])).toBeLessThan(1);
 await seek(page,3601);await expect(page.locator('html')).toHaveAttribute('data-presentation','complete');
});
test('Escape releases the intro and reload does not replay',async({page})=>{
 await hold(page);await page.keyboard.press('Escape');await expect(page.locator('[data-pixel-intro]')).toHaveCount(0);
 await expect(page.locator('#portfolio-content')).not.toHaveAttribute('inert');
 await page.reload();await expect(page.locator('html')).toHaveAttribute('data-presentation','complete');
 await expect(page.locator('[data-pixel-intro]')).toHaveCount(0);
});
test('reduced motion and deep links bypass the intro',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/hero-lab/typographic#top');
 await expect(page.locator('[data-pixel-intro]')).toHaveCount(0);await expect(page.locator('#portfolio-content')).toBeVisible();
 await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/hero-lab/typographic#work');
 await expect(page.locator('[data-pixel-intro]')).toHaveCount(0);
});
test('an unavailable front image never traps the page',async({page})=>{
 await page.route('**/miguel-front-contour.webp',route=>route.abort());await page.goto('/hero-lab/typographic#top');
 await expect(page.locator('html')).toHaveAttribute('data-presentation','complete');
 await expect(page.locator('#portfolio-content')).not.toHaveAttribute('inert');
 await expect(page.locator('#portfolio-content')).toBeVisible();
});

test('the natural sequence completes and then starts the role cycle',async({page})=>{
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/hero-lab/typographic?intro=replay#top');
 await expect(page.locator('[data-pixel-intro][data-stage="approach"]')).toBeVisible();
 await expect(page.locator('[data-pixel-intro]')).toHaveCount(0);
 await expect(page.locator('.mah')).toHaveAttribute('data-role','engineer');
 await expect(page.locator('.mah')).toHaveAttribute('data-role','designer',{timeout:10000});
 expect(errors).toEqual([]);
});
test('wheel dismissal releases scrolling after consuming its first gesture',async({page})=>{
 await hold(page);await page.mouse.wheel(0,150);
 await expect(page.locator('[data-pixel-intro]')).toHaveCount(0);
 expect(await page.evaluate(()=>scrollY)).toBe(0);
 await page.waitForTimeout(850);await page.mouse.wheel(0,400);
 await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(100);
});
test('runtime reduced motion immediately settles the portrait',async({page})=>{
 await hold(page);await page.emulateMedia({reducedMotion:'reduce'});
 await expect(page.locator('[data-pixel-intro]')).toHaveCount(0);
 await expect(page.locator('#portfolio-content')).not.toHaveAttribute('inert');
 await expect(page.locator('.mah-photo-front')).toBeVisible();
});
test('before measurement no misplaced portrait flashes, and a stalled bundle releases the page',async({page})=>{
 await page.route('**/*',r=>r.request().resourceType()==='script'?r.abort():r.continue());
 await page.goto('/hero-lab/typographic#top');
 await expect(page.locator('[data-intro-body]')).toBeHidden();
 await expect(page.locator('[data-intro-backdrop]')).toBeVisible();
 await expect(page.locator('[data-intro-body]')).toHaveCSS('mask-image',/miguel-front-contour/);
 await expect(page.locator('#portfolio-content')).toHaveCSS('visibility','hidden');
 await expect(page.locator('[data-intro-source]')).toBeHidden();
 await expect(page.locator('html')).toHaveAttribute('data-presentation','complete',{timeout:8000});
 await expect(page.locator('#portfolio-content')).toBeVisible();
});

for(const width of [390,768,1440]){
 test('intro stays registered to the live portrait for every frame at '+width,async({page})=>{
  await page.setViewportSize({width,height:900});await hold(page);
  const destination=(await page.locator('.mah-photo-front').boundingBox())!;
  let previous=0;
  for(const time of [0,550,1200,1800,2150,2500,2800,3100,3450,3550]){
   await seek(page,time);
   const current=(await page.locator('[data-intro-body]').boundingBox())!;
   expect(current.height,'no overshoot at '+time).toBeLessThanOrEqual(destination.height+.5);
   expect(current.height,'no shrinking at '+time).toBeGreaterThanOrEqual(previous-.5);
   for(const key of ['x','y','width','height'] as const){
    expect(Math.abs(current[key]-destination[key]),'fixed portrait '+key+' at '+time).toBeLessThan(.02);
   }
   previous=current.height;
  }
  await seek(page,3601);await expect(page.locator('[data-pixel-intro]')).toHaveCount(0);
 });
}
