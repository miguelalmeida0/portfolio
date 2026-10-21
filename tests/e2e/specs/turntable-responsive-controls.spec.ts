import { expect, test } from '@playwright/test';

// Regression: ENG-01 — coalesce in-flight selections to the latest role.
// Found by /qa on 2026-10-21. Report: implementation-evidence/progress.md
for(const width of [390,1440]) for(const initial of ['engineer','designer'])
 test('rapid opposite role selection honors '+initial+' at '+width,async({page},info)=>{
  await page.setViewportSize({width,height:900});await page.goto('/');
  const header=page.locator('.mah');await expect(header).toHaveAttribute('data-renderer',/webgl|fallback/);
  await page.getByRole('button',{name:'Pause the role animation',exact:true}).click();
  const name=(role:string)=>role==='engineer'?'Frontend engineer':'Product designer';
  await page.getByRole('button',{name:name(initial),exact:true}).click();
  await expect(header).toHaveAttribute('data-role',initial);
  await expect(page.locator('.mah-word')).toHaveText(initial==='engineer'?'FRONTEND':'DESIGNER');
  await expect.poll(()=>page.locator('.mah-word .mah-g').count()).toBe(8);
  await expect.poll(()=>page.locator('.mah-room-img').evaluate(e=>new DOMMatrixReadOnly(getComputedStyle(e).transform).a)).toBe(1);
  const opposite=initial==='engineer'?'designer':'engineer';
  const timing=await page.evaluate(async({initial,opposite})=>{
   const press=(role:string)=>(document.querySelector(`[data-mah-role="${role}"]`) as HTMLButtonElement).click();
   const start=performance.now();press(opposite);await Promise.resolve();
   const started=document.querySelector('.mah')!.classList.contains('is-sweeping');
   await new Promise<void>(resolve=>setTimeout(resolve,150));press(initial);
   return {started,betweenClicksMs:performance.now()-start};
  },{initial,opposite});
  expect(timing.started,'the first turn must actually be running before the reversal').toBe(true);
  await expect(header).toHaveAttribute('data-role',initial);
  await expect(page.locator('.mah-word')).toHaveText(initial==='engineer'?'FRONTEND':'DESIGNER');
  await expect(page.locator('.mah-word .mah-g')).toHaveCount(8);
  await expect(page.getByRole('button',{name:name(initial),exact:true})).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('.mah-photo')).not.toHaveClass(/is-turning/);
  await expect(header).toHaveAttribute('data-role',initial);
  await expect(page.locator('.mah-word')).toHaveText(initial==='engineer'?'FRONTEND':'DESIGNER');
  await info.attach('selection-timing.json',{body:JSON.stringify(timing),contentType:'application/json'});
 });

test('compact controls and supporting copy keep a restrained hierarchy', async ({ page }) => {
  for (const width of [320, 390, 500, 560, 768, 1100]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('.mah-copy > .turntable-switch')).toBeVisible();
    // The columns enter with staggered translations. Measure the settled layout,
    // after initialization and both entrances, rather than two animation frames.
    await expect(page.locator('.mah')).toHaveAttribute('data-renderer', /^(webgl|fallback)$/);
    await expect(page.locator('.mah-col--left')).toHaveCSS('opacity', '1');
    await expect(page.locator('.mah-col--right')).toHaveCSS('opacity', '1');
    const tabs = (await page.locator('[data-mah-tabs]').boundingBox())!;
    expect(tabs.width).toBeLessThanOrEqual(200);
    expect(tabs.height).toBeLessThanOrEqual(44);
    await expect(page.locator('.mah-stack')).toHaveCSS('font-size', '14px');
    await expect(page.locator('.mah-proof')).toHaveCSS('font-size', '16px');
    const left = (await page.locator('.mah-col--left').boundingBox())!;
    const right = (await page.locator('.mah-col--right').boundingBox())!;
    if (width < 560) {
      expect(right.x).toBe(left.x);
      expect(right.y).toBeGreaterThan(left.y + left.height);
    } else {
      expect(Math.abs(right.y - left.y)).toBeLessThan(1);
    }
  }
});

test('compact hero controls leave a single-row navbar and survive breakpoint changes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('.mah-copy > .turntable-switch [data-mah-tabs]')).toBeVisible();
  expect((await page.locator('[data-mast]').boundingBox())!.height).toBeLessThanOrEqual(70);
  await expect(page.locator('[data-mast] [data-mah-tabs]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Product designer', exact: true }).click();
  await expect(page.locator('.mah')).toHaveAttribute('data-role', 'designer');
  await expect(page.locator('[data-mah-pause]')).toHaveAttribute('aria-pressed', 'true');
  for (const width of [768, 1100, 1240, 1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    const owner = width >= 1280 ? '[data-mast]' : '.mah-copy > .turntable-switch';
    await expect(page.locator(`${owner} [data-mah-tabs]`)).toBeVisible();
    await expect(page.locator('[data-mah-tabs]')).toHaveCount(1);
    await expect(page.locator('[data-mah-role="designer"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-mah-pause]')).toHaveAttribute('aria-pressed', 'true');
  }
});

test('headline stays centered and inside the hero while resizing during a role turn', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('/');
  await expect(page.locator('.mah-photo')).toHaveCSS('opacity', '1');
  await page.getByRole('button', { name: 'Product designer', exact: true }).click();
  await page.waitForTimeout(200);
  for (const width of [1000, 560, 1280, 390]) {
    await page.setViewportSize({ width, height: 800 });
    await page.waitForTimeout(80);
    const box = await page.evaluate(() => {
      const word = document.querySelector('.mah-word')!.getBoundingClientRect();
      const hero = document.querySelector('.mah')!.getBoundingClientRect();
      return { left: word.left - hero.left, right: hero.right - word.right, center: Math.abs((word.left + word.right - hero.left - hero.right) / 2) };
    });
    expect(box.left).toBeGreaterThanOrEqual(-1);
    expect(box.right).toBeGreaterThanOrEqual(-1);
    expect(box.center).toBeLessThan(2);
  }
  await expect(page.locator('.mah-photo-back')).toHaveCSS('opacity', '1');
  await expect(page.locator('.mah-word')).toHaveText('DESIGNER');
});

for (const width of [390,1440]) test('keyboard role intent, repeated selection, pause and resume remain coherent at '+width,async({page})=>{
 await page.setViewportSize({width,height:900});await page.goto('/');
 await expect(page.locator('.mah')).toHaveAttribute('data-renderer',/webgl|fallback/);
 const designer=page.getByRole('button',{name:'Product designer',exact:true});
 const engineer=page.getByRole('button',{name:'Frontend engineer',exact:true});
 await designer.focus();await page.keyboard.press('Enter');
 await expect(page.locator('.mah')).toHaveClass(/is-sweeping/);
 await engineer.focus();await page.keyboard.press('Space');await page.keyboard.press('Enter');
 await expect(page.locator('.mah-word')).toHaveText('FRONTEND');
 await expect(page.locator('.mah-word .mah-g')).toHaveCount(8);
 await expect(engineer).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('.mah-photo')).not.toHaveClass(/is-turning/);
 await expect(page.locator('[data-mah-pause]')).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Play the role animation',exact:true}).click();
 await expect(page.locator('[data-mah-pause]')).toHaveAttribute('aria-pressed','false');
 await expect(page.locator('.mah')).toHaveAttribute('data-role','designer');
 await expect(page.locator('.mah-word')).toHaveText('DESIGNER');
});

for (const delay of [100,600]) test('route teardown owns every former hero mutation after '+delay+'ms across remounts',async({page})=>{
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 await page.setViewportSize({width:1440,height:900});await page.goto('/');
 for(let cycle=0;cycle<3;cycle++){
  await expect(page.locator('.mah')).toHaveAttribute('data-renderer',/webgl|fallback/);
  await page.evaluate(async delay=>{
   const old=document.querySelector('.mah')!;
   (window as any).lateHeroMutations=0;
   let detached=false;
   const observer=new MutationObserver(records=>{
    if(detached)(window as any).lateHeroMutations+=records.length;
   });
   // Mutation records are delivered after removal. Exclude synchronous cleanup
   // performed while the node was still connected, then watch future callbacks.
   const removal=new MutationObserver(()=>{
    if(old.isConnected)return;
    observer.takeRecords();detached=true;removal.disconnect();
   });
   removal.observe(document.body,{subtree:true,childList:true});
   observer.observe(old,{subtree:true,attributes:true,childList:true,characterData:true});
   (window as any).stopHeroWatch=()=>{observer.disconnect();removal.disconnect();return (window as any).lateHeroMutations;};
   (document.querySelector('[data-mah-role=designer]') as HTMLButtonElement).click();
   await new Promise(resolve=>setTimeout(resolve,delay));
   (document.querySelector('nav[aria-label="Main navigation"] a[href="/story"]') as HTMLAnchorElement).click();
  },delay);
  await expect(page).toHaveURL(/\/story$/);
  await expect(page.locator('[data-route-shutter]')).toHaveAttribute('data-phase','idle');
  // A bounded observation window exceeds the sweep, letter, room and settle durations.
  await page.waitForTimeout(2400);
  expect(await page.evaluate(()=>(window as any).stopHeroWatch())).toBe(0);
  await page.goBack();await expect(page.locator('[data-route-shutter]')).toHaveAttribute('data-phase','idle');
 }
 expect(errors).toEqual([]);
});

// ENG-02: each restrictive input uses the shared policy, not only OS motion.
for (const width of [390,1440]) for (const system of [false,true]) for (const stored of [false,true]) for (const saveData of [false,true])
 test(`shared motion policy ${width} OS=${system} stored=${stored} data=${saveData}`,async({page},info)=>{
  await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:system?'reduce':'no-preference'});
  await page.addInitScript(({stored,saveData})=>{
   localStorage.setItem('miguel-motion-preference',stored?'reduced':'system');
   const connection=new EventTarget();Object.defineProperty(connection,'saveData',{value:saveData,writable:true});
   Object.defineProperty(navigator,'connection',{value:connection,configurable:true});
  },{stored,saveData});
  const media:string[]=[];page.on('request',r=>{if(/miguel-back-repaired|room\.jpg/.test(r.url()))media.push(r.url());});
  await page.goto('/');const reduced=system||stored||saveData;
  await expect(page.locator('html')).toHaveAttribute('data-motion',reduced?'reduced':'full');
  await expect(page.locator('.mah')).toHaveAttribute('data-renderer',reduced?'fallback':/webgl|fallback/);
  if(reduced){
   await expect(page.locator('.mah')).toHaveClass(/is-reduced/);
   expect(media,'inactive images must not be fetched under restrictive policy').toEqual([]);
   if(Number(system)+Number(stored)+Number(saveData)===1){
    // Bounded negative observation extends beyond the ordinary automatic hold.
    await page.waitForTimeout(4500);
    await expect(page.locator('.mah')).toHaveAttribute('data-role','engineer');
    expect(await page.locator('[data-mah-tabs]').evaluate(e=>parseFloat(getComputedStyle(e).getPropertyValue('--mah-p')))).toBe(0);
   }
   expect(await page.locator('.mah').evaluate(e=>e.getAnimations({subtree:true}).filter(a=>a.playState==='running').length)).toBe(0);
   await page.getByRole('button',{name:'Product designer',exact:true}).click();
   await expect(page.locator('.mah')).toHaveAttribute('data-role','designer');
   await expect(page.locator('.mah-word')).toHaveText('DESIGNER');
   await expect(page.locator('.mah-photo-back')).toHaveJSProperty('complete',true);
   await expect(page.locator('.mah-photo-back')).toHaveCSS('opacity','1');
   await page.getByRole('button',{name:'Frontend engineer',exact:true}).click();
   await expect(page.locator('.mah')).toHaveAttribute('data-role','engineer');
   await expect(page.locator('.mah-word')).toHaveText('FRONTEND');
   await page.keyboard.press('Control+/');
   await expect(page.getByRole('textbox',{name:'Type your own question'})).toBeFocused();
   expect(await page.locator('[data-ask-panel]').evaluate(e=>Math.max(...getComputedStyle(e).transitionDuration.split(',').map(parseFloat)))).toBeLessThanOrEqual(.001);
   await page.keyboard.press('Escape');await expect(page.locator('[data-ask-panel]')).toHaveCount(0);
  }else await expect(page.locator('[data-mah-pause]')).toBeVisible();
  await info.attach('media-requests.json',{body:JSON.stringify(media),contentType:'application/json'});
 });

for (const input of ['OS','Save-Data']) test('restricting '+input+' during a turn settles the latest role immediately',async({page})=>{
 await page.addInitScript(()=>{
  const connection=new EventTarget();Object.defineProperty(connection,'saveData',{value:false,writable:true});
  Object.defineProperty(navigator,'connection',{value:connection,configurable:true});
 });
 await page.goto('/');await expect(page.locator('.mah')).toHaveAttribute('data-renderer',/webgl|fallback/);
 await page.getByRole('button',{name:'Product designer',exact:true}).click();
 await expect(page.locator('.mah')).toHaveClass(/is-sweeping/);
 if(input==='OS')await page.emulateMedia({reducedMotion:'reduce'});
 else await page.evaluate(()=>{const connection=(navigator as any).connection;connection.saveData=true;connection.dispatchEvent(new Event('change'));});
 await expect(page.locator('.mah')).toHaveClass(/is-reduced/);
 await expect(page.locator('.mah')).not.toHaveClass(/is-sweeping|has-gl/);
 await expect(page.locator('.mah')).toHaveAttribute('data-role','designer');
 await expect(page.locator('.mah-word')).toHaveText('DESIGNER');
 await expect(page.locator('.mah-word .mah-g')).toHaveCount(8);
 await page.getByRole('button',{name:'Frontend engineer',exact:true}).click();
 await expect(page.locator('.mah-word')).toHaveText('FRONTEND');
});

for(const initial of ['engineer','designer']) test('restrictive policy resolves overlapping copy during '+initial+' reversal',async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.addInitScript(()=>{const connection=new EventTarget();Object.defineProperty(connection,'saveData',{value:false,writable:true});Object.defineProperty(navigator,'connection',{value:connection,configurable:true});});
 await page.goto('/');await expect(page.locator('.mah')).toHaveAttribute('data-renderer',/webgl|fallback/);
 await page.getByRole('button',{name:initial==='engineer'?'Frontend engineer':'Product designer',exact:true}).click();
 await expect(page.locator('.mah')).toHaveAttribute('data-role',initial);
 await expect(page.locator('.mah-word .mah-g')).toHaveCount(8);
 await expect.poll(()=>page.locator('.mah-room-img').evaluate(e=>new DOMMatrixReadOnly(getComputedStyle(e).transform).a)).toBe(1);
 await page.evaluate(()=>{
  const line=document.querySelector('.mah-line')!;
  const observer=new MutationObserver(()=>{
   if(line.querySelectorAll('[data-for]:not(.is-off)').length!==2)return;
   observer.disconnect();const connection=(navigator as any).connection;connection.saveData=true;connection.dispatchEvent(new Event('change'));
  });observer.observe(line,{subtree:true,attributes:true});
 });
 const destination=initial==='engineer'?'designer':'engineer';
 await page.getByRole('button',{name:destination==='engineer'?'Frontend engineer':'Product designer',exact:true}).click();
 await expect(page.locator('.mah')).toHaveClass(/is-reduced/);
 await expect(page.locator('.mah')).toHaveAttribute('data-role',destination);
 await expect(page.locator('.mah-line>[data-for]:not(.is-off)')).toHaveCount(1);
 await expect(page.locator(`.mah-line>[data-for="${destination}"]`)).toBeVisible();
 await expect(page.locator(`.mah-line>[data-for="${initial}"]`)).not.toBeVisible();
});

// Fresh review regressions: resource readiness is another interruption boundary.
test('selection before font boot keeps every role surface coherent',async({page})=>{
 await page.addInitScript(()=>{
  let release!:()=>void;const gate=new Promise<void>(resolve=>release=resolve);(window as any).releaseHeroFonts=release;
  const load=document.fonts.load.bind(document.fonts);
  document.fonts.load=(...args)=>Promise.all([load(...args),gate]).then(([fonts])=>fonts);
 });
 await page.goto('/');await expect(page.locator('[data-ask-trigger]').first()).toBeEnabled();
 expect(await page.locator('.mah-word .mah-cell').count()).toBe(0);
 await page.getByRole('button',{name:'Product designer',exact:true}).click();
 await page.evaluate(()=>(window as any).releaseHeroFonts());
 await expect(page.locator('.mah')).toHaveAttribute('data-role','designer');
 await expect(page.locator('.mah-word')).toHaveText('DESIGNER');
 await expect(page.locator('.mah-word .mah-g')).toHaveCount(8);
 await expect(page.locator('[data-mah-role=designer]')).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('.mah-line>[data-for=designer]')).toBeVisible();
 await expect(page.locator('.mah-photo')).not.toHaveClass(/is-turning/);
 await expect(page.locator('.mah-photo-back')).toHaveCSS('opacity','1');
});

test('renderer decoding during a fallback turn settles on the current portrait',async({page})=>{
 let release!:()=>void;const gate=new Promise<void>(resolve=>release=resolve);
 await page.route('**/miguel-back-repaired.webp',async route=>{await gate;await route.continue();});
 await page.goto('/',{waitUntil:'domcontentloaded'});
 await expect(page.locator('.mah')).toHaveAttribute('data-portrait-ready','');
 await expect(page.locator('.mah')).not.toHaveAttribute('data-renderer',/webgl|fallback/);
 await page.getByRole('button',{name:'Product designer',exact:true}).click();
 await expect(page.locator('.mah')).toHaveClass(/is-sweeping/);release();
 await expect(page.locator('.mah')).toHaveAttribute('data-renderer','webgl');
 await expect(page.locator('.mah')).toHaveAttribute('data-role','designer');
 await expect(page.locator('.mah-word')).toHaveText('DESIGNER');
 await expect(page.locator('.mah-word .mah-g')).toHaveCount(8);
 await expect(page.locator('.mah-photo')).not.toHaveClass(/is-turning/);
 await expect(page.locator('.mah-photo')).toHaveAttribute('data-rest-role','designer');
 await expect(page.locator('.mah-photo-back')).toHaveCSS('opacity','1');
});
