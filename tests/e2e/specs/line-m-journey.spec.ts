import { test, expect, type Page } from '@playwright/test';
test.use({ video: 'on', trace: 'on' });
const cars = (page: Page) => page.locator('[data-car]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('transform')));
const runtimeErrors = new WeakMap<Page,string[]>();
test.beforeEach(async({page})=>{
  const errors:string[]=[];runtimeErrors.set(page,errors);
  page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(()=>sessionStorage.setItem('seen-intro','true'));
  await page.goto('/');await expect(page.locator('[data-stop="0"]')).toBeAttached();
});
test.afterEach(async({page})=>{
  expect(runtimeErrors.get(page)??[],'Line M journeys must not raise uncaught runtime errors').toEqual([]);
});
test('reduced motion breakpoint changes keep carriage bodies and spacing at the same scale',async({page})=>{
  await page.locator('[data-stop="2"]').focus();
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const width of [390,899,900,1440,390]){
    await page.setViewportSize({width,height:900});
    await page.locator('[data-line-m]').scrollIntoViewIfNeeded();
    const touchLayout=await page.evaluate(()=>!matchMedia('(min-width: 900px) and (pointer: fine) and (hover: hover)').matches);
    await expect.poll(async()=> (await page.locator('[data-train]').boundingBox())?.width).toBeCloseTo(116*(touchLayout ? .66 : 1),0);
    await expect(page.locator('[data-car]')).toHaveCount(3);
    await expect(page.locator('[data-stop][data-arrived="true"]')).toHaveCount(0);
    await expect(page.locator('[data-stop="2"]')).toHaveAttribute('href','https://github.com/miguelalmeida0');
  }
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));
  await expect(page.locator('[data-train]')).toHaveAttribute('data-phase','origin');
  await expect(page.locator('[data-stop][data-arrived="true"]')).toHaveCount(0);
});
test('intermediate-width departure board fills its content span without truncating contacts',async({page})=>{
  for(const width of [900,1024,1140,1279]){
    await page.setViewportSize({width,height:900});
    const layout=await page.locator('[data-board]').evaluate(el=>{
      const board=el.getBoundingClientRect(),parent=el.parentElement!.getBoundingClientRect();
      return {boardWidth:board.width,parentWidth:parent.width,left:board.left-parent.left,
        truncated:[...el.querySelectorAll('[data-dep] > span')].filter(e=>e.scrollWidth>e.clientWidth+1).length};
    });
    expect(layout.boardWidth).toBeCloseTo(layout.parentWidth,0);
    expect(layout.left).toBeCloseTo(0,0);
    expect(layout.truncated).toBe(0);
  }
});
test('narrow contact focus completes the train morph instead of leaving purple dashes',async({page})=>{
  await page.setViewportSize({width:860,height:900});
  await page.reload();
  const contact=page.locator('[data-stop="0"]');
  await contact.focus();
  await expect(contact).toHaveAttribute('data-requested','true');
  await expect(page.locator('[data-train]')).toHaveAttribute('data-phase','origin');
  const box=(await page.locator('[data-train]').boundingBox())!;
  expect(box.width).toBeCloseTo(116*.66,0);
  expect(box.height).toBeGreaterThan(14);
  await expect(page.locator('[data-stop][data-arrived="true"]')).toHaveCount(0);
  await expect(contact).toHaveAttribute('href','mailto:miguelalmeida1592@gmail.com');
});
test('contact entry has no painted guide and reveals the scroll handle only on use',async({page,isMobile})=>{
  test.skip(isMobile,'Fine-pointer scrollbar; mobile geometry is covered separately');
  await page.mouse.move(10,10);
  await page.evaluate(()=>{
    const dock=document.querySelector('[data-thread-dock]')!.getBoundingClientRect();
    scrollTo(0,scrollY+dock.top-innerHeight*.7);
  });
  await expect(page.locator('html')).toHaveAttribute('data-line-m-traveller','journey');
  await expect(page.locator('[data-line-m-journey] path[stroke]')).toHaveCount(0);
  await expect(page.locator('[data-scroll-handle]')).toHaveCSS('opacity','0');
  const rail=page.getByRole('scrollbar',{name:'Scroll page'});
  await rail.focus();
  await expect(page.locator('[data-scroll-handle]')).toHaveCSS('opacity','1');
  const before=await rail.getAttribute('aria-valuenow');await rail.press('ArrowUp');
  await expect(rail).not.toHaveAttribute('aria-valuenow',before!);
  await expect(page.locator('[data-car]')).toHaveCount(3);
});
test('early thumb morph never leaves both visual layers invisible',async({page,isMobile})=>{
  test.skip(isMobile,'Desktop custom scrollbar');
  await page.evaluate(()=>scrollTo(0,(document.documentElement.scrollHeight-innerHeight)*.03));
  await expect(page.locator('html')).toHaveAttribute('data-line-m-traveller','rail');
  const opacity=await page.evaluate(()=>({
    thumb:Number(getComputedStyle(document.querySelector('[data-scroll-handle]')!).opacity),
    train:Number(document.querySelector('[data-train]')!.getAttribute('opacity'))
  }));
  expect(opacity.thumb+opacity.train).toBeGreaterThanOrEqual(.299);
});
test('scrollbar keyboard focus uses a solid thumb without borders',async({page,isMobile})=>{
  test.skip(isMobile,'Desktop custom scrollbar');
  const rail=page.getByRole('scrollbar',{name:'Scroll page'}),handle=page.locator('[data-scroll-handle]');
  await rail.press('Home');
  await expect(rail).toHaveCSS('outline-style','none');
  await expect(handle).toHaveCSS('outline-style','none');
  await expect(handle).toHaveCSS('opacity','1');
  await rail.press('PageDown');await rail.press('PageDown');
  await expect(page.locator('html')).toHaveAttribute('data-line-m-traveller','rail');
  await expect(handle).toHaveCSS('opacity','0');
  const h=(await handle.boundingBox())!;
  const center=await page.locator('[data-car="1"]').evaluate(el=>{
    const m=(el as SVGGraphicsElement).transform.baseVal.consolidate()!.matrix;return{x:m.e,y:m.f};
  });
  expect(Math.abs(center.x-h.x-h.width/2)).toBeLessThan(.1);
  expect(Math.abs(center.y-h.y-h.height/2)).toBeLessThan(.1);
  expect((await handle.boundingBox())!.height).toBeLessThanOrEqual(44);
  await expect(rail).toBeFocused();
});
test('resizing a stationary sidebar train anchors it without a travel animation',async({page,isMobile})=>{
  test.skip(isMobile,'Desktop scrollbar with responsive layout');
  await page.getByRole('scrollbar',{name:'Scroll page'}).press('Home');
  await page.getByRole('scrollbar',{name:'Scroll page'}).press('PageDown');
  await expect(page.locator('html')).toHaveAttribute('data-line-m-traveller','rail');
  await page.clock.install();await page.clock.pauseAt(new Date());
  for(const width of [1024,899,532,1440]){
    await page.setViewportSize({width,height:1000});await page.clock.runFor(34);
    await expect(page.locator('html')).toHaveAttribute('data-line-m-traveller','rail');
    const before=await cars(page);
    const xs=await page.locator('[data-car]').evaluateAll(nodes=>nodes.map(n=>(n as SVGGraphicsElement).transform.baseVal.consolidate()!.matrix.e));
    expect(xs.every(x=>Math.abs(x-(width-12))<.1)).toBe(true);
    await page.clock.runFor(1000);expect(await cars(page)).toEqual(before);
  }
});
test('small wheel movement holds manual intent and footer exit rejoins continuously',async({page,isMobile})=>{
  test.skip(isMobile,'Desktop service');
  await page.getByRole('scrollbar',{name:'Scroll page'}).press('End');
  await page.locator('[data-stop="2"]').focus();
  await expect(page.locator('[data-stop="2"]')).toHaveAttribute('data-arrived','true');
  await page.mouse.move(10,10);await page.mouse.wheel(0,-32);
  await expect(page.locator('[data-stop="2"]')).toHaveAttribute('data-requested','true');
  await page.getByRole('scrollbar',{name:'Scroll page'}).press('Home');
  await expect(page.locator('[data-stop][data-requested="true"]')).toHaveCount(0);
  await expect(page.locator('[data-train]')).toHaveAttribute('opacity','0');
  await expect.poll(()=>page.locator('[data-scroll-handle]').evaluate(e=>Number(getComputedStyle(e).opacity))).toBeGreaterThan(0);
});
test('focus leaving an already offscreen footer wakes the idle return',async({page,isMobile})=>{
  test.skip(isMobile,'Desktop service');
  await page.locator('[data-stop="2"]').focus();await expect(page.locator('[data-stop="2"]')).toHaveAttribute('data-arrived','true');
  await page.clock.install();await page.clock.pauseAt(new Date());
  await page.evaluate(()=>scrollTo(0,0));await page.clock.runFor(4000);
  await expect(page.locator('[data-stop="2"]')).toBeFocused();
  await expect(page.locator('[data-stop="2"]')).toHaveAttribute('data-requested','true');
  await page.locator('body').click({position:{x:5,y:350}});await page.clock.runFor(34);
  await expect(page.locator('[data-stop][data-requested="true"]')).toHaveCount(0);
  await page.clock.runFor(4000);await expect(page.locator('[data-train]')).toHaveAttribute('opacity','0');
});
test('native board focus is exposed without duplicating the station Tab sequence',async({page,isMobile})=>{
  test.skip(isMobile,'Board hidden below 900px');
  await page.locator('[data-dep="2"]').focus();
  expect(await page.locator('[data-dep="2"]').evaluate(e=>!!e.closest('[aria-hidden="true"]'))).toBe(false);
  for(const row of await page.locator('[data-dep]').all())await expect(row).toHaveAttribute('tabindex','-1');
  await page.locator('[data-stop="0"]').focus();await page.keyboard.press('Tab');await expect(page.locator('[data-stop="1"]')).toBeFocused();
});
test('unprompted fast scroll uses the bend before quietly arriving',async({page,isMobile})=>{
  test.skip(isMobile,'Desktop scrollbar');
  await page.clock.install();await page.clock.pauseAt(new Date());
  await page.getByRole('scrollbar',{name:'Scroll page'}).press('End');
  await page.clock.runFor(34);
  const distance=()=>page.evaluate(()=>{
    const train=document.querySelector('[data-car="1"]')!.getBoundingClientRect();
    const dock=document.querySelector('[data-thread-dock]')!.getBoundingClientRect();
    return Math.hypot(train.x+train.width/2-dock.x-dock.width/2,train.y+train.height/2-dock.y-dock.height/2);
  });
  expect(await distance()).toBeGreaterThan(30);
  await page.clock.runFor(3000);expect(await distance()).toBeLessThan(.5);
  await expect(page.locator('[data-train]')).toHaveAttribute('data-phase','origin');
  const box=await page.locator('[data-train]').boundingBox();expect(box!.width).toBeCloseTo(116,0);
});
test('early GitHub hover curves onto the rail before rolling into the stop',async({page,isMobile})=>{
  test.skip(isMobile,'Desktop hover route');
  await page.clock.install();await page.clock.pauseAt(new Date());
  await page.getByRole('scrollbar',{name:'Scroll page'}).press('End');await page.clock.runFor(119);
  await page.locator('[data-dep="2"]').hover();
  await expect(page.locator('[data-stop="2"]')).toHaveAttribute('data-requested','true');
  let rolled=false;
  for(let frame=0;frame<95;frame++){
    await page.clock.runFor(34);
    const pose=await page.evaluate(()=>{
      const car=document.querySelector('[data-car="1"]') as SVGGraphicsElement;
      const matrix=car.transform.baseVal.consolidate()!.matrix;
      const stop=document.querySelector('[data-stop="2"] > span:first-child')!.getBoundingClientRect();
      return{dx:Math.abs(matrix.e-stop.x-stop.width/2),dy:Math.abs(matrix.f-stop.y-stop.height/2)};
    });
    if(pose.dy<.5&&pose.dx>15)rolled=true;
  }
  expect(rolled,'horizontal travel before the requested platform').toBe(true);
  await expect(page.locator('[data-stop="2"]')).toHaveAttribute('data-arrived','true');
});
test('scroll handle remains visible while reverse train is offscreen',async({page,isMobile})=>{
  test.skip(isMobile,'Desktop custom scrollbar');
  await page.locator('[data-stop="3"]').focus();
  await expect(page.locator('[data-stop="3"]')).toHaveAttribute('data-arrived','true');
  await page.getByRole('scrollbar',{name:'Scroll page'}).press('Home');
  await expect.poll(()=>page.locator('[data-scroll-handle]').evaluate(e=>Number(getComputedStyle(e).opacity))).toBeGreaterThan(0);
  await expect(page.locator('[data-car]')).toHaveCount(3);
});
test('station circles clear the train and reform after it leaves',async({page,isMobile})=>{
  test.skip(isMobile,'Desktop roaming');
  await page.locator('[data-stop="0"]').focus();
  await expect(page.locator('[data-stop="0"]')).toHaveAttribute('data-arrived','true');
  await expect(page.locator('[data-stop="0"] > span:first-child')).toHaveCSS('opacity','0');
  await expect(page.locator('[data-stop="0"]')).toBeVisible();
  await page.locator('[data-stop="3"]').focus();
  await expect(page.locator('[data-stop="3"]')).toHaveAttribute('data-arrived','true');
  await expect(page.locator('[data-stop="0"] > span:first-child')).toHaveCSS('opacity','1');
  await expect(page.locator('[data-stop="3"] > span:first-child')).toHaveCSS('opacity','0');
});
test('locked approach clears the departure board at desktop density',async({page,isMobile})=>{
  test.skip(isMobile,'Separate mobile composition');
  const clearance=await page.evaluate(()=>{
    const board=document.querySelector('[data-board]')!.getBoundingClientRect();
    const dock=document.querySelector('[data-thread-dock]')!.getBoundingClientRect();
    return dock.y+dock.height/2-board.bottom;
  });
  expect(clearance).toBeGreaterThan(220);
});
test('compact arrival clears the mobile contact heading',async({page,isMobile})=>{
  test.skip(!isMobile,'Separate desktop approach');
  const clearance=await page.evaluate(()=>{
    const head=document.querySelector('[data-contact-head]')!.getBoundingClientRect();
    const dock=document.querySelector('[data-thread-dock]')!.getBoundingClientRect();
    return dock.y+dock.height/2-head.bottom;
  });
  expect(clearance).toBeGreaterThan(180);
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect.poll(()=>page.evaluate(()=>{
    const train=document.querySelector('[data-train]')!.getBoundingClientRect();
    const label=document.querySelector('[data-thread-dock] + span')!.getBoundingClientRect();
    return label.left-train.right;
  })).toBeGreaterThanOrEqual(6);
});
test('pre-dock manual intent changes rendered trajectory with scroll held fixed',async({page,isMobile})=>{
  test.skip(isMobile,'Desktop roaming only');
  const trajectories = [];
  for(const manual of [false,true]){
    const run=await page.context().newPage();
    await run.addInitScript(()=>{sessionStorage.setItem('seen-intro','true');history.scrollRestoration='manual';});
    await run.goto('/');await expect(run.locator('[data-car]')).toHaveCount(3);
    await run.clock.install();await run.clock.pauseAt(new Date());
    await run.evaluate(()=>{
      const board=document.querySelector('[data-board]')!.getBoundingClientRect();
      window.scrollTo(0,scrollY+board.bottom-innerHeight+60);
    });
    await run.clock.runFor(300);
    const read=()=>run.locator('[data-car]').evaluateAll(nodes=>nodes.map(n=>{const m=(n as SVGGraphicsElement).transform.baseVal.consolidate()!.matrix;return{x:m.e,y:m.f};}));
    const before=await read();
    const origin=await run.locator('[data-thread-dock]').evaluate(n=>{const b=n.getBoundingClientRect();return{x:b.x+b.width/2,y:b.y+b.height/2};});
    expect(Math.hypot(before[1].x-origin.x,before[1].y-origin.y)).toBeGreaterThan(10);
    await expect(run.locator('[data-train]')).toHaveAttribute('data-phase','approach');
    const scroll=await run.evaluate(()=>scrollY);
    if(manual){
      await run.locator('[data-dep="2"]').dispatchEvent('pointerenter');
      await expect(run.locator('[data-dep="2"]')).toHaveAttribute('data-requested','true');
      expect(await read()).toEqual(before);
    }
    await run.clock.runFor(34);trajectories.push(await read());
    expect(await run.evaluate(()=>scrollY)).toBe(scroll);
    if(manual){await run.clock.runFor(4000);await expect(run.locator('[data-stop="2"]')).toHaveAttribute('data-arrived','true');}
    await run.close();
  }
  expect(Math.hypot(trajectories[0][1].x-trajectories[1][1].x,trajectories[0][1].y-trajectories[1][1].y)).toBeGreaterThan(.05);
});
for(const surface of ['stop','dep'])for(const stop of [0,1,2,3])test(`${surface} ${stop} interrupts undocked arrival on the next frame`,async({page,isMobile})=>{
  test.skip(isMobile,'Desktop roaming');
  await page.clock.install();await page.clock.pauseAt(new Date());
  await page.evaluate(()=>{const footer=document.querySelector('[data-line-m]')!.getBoundingClientRect();window.scrollTo(0,scrollY+footer.top-innerHeight*.4);});
  await page.clock.runFor(34);
  await expect(page.locator('[data-train]')).toHaveAttribute('data-phase','approach');
  const before=await cars(page),y=await page.evaluate(()=>scrollY);
  await page.locator(`[data-${surface}="${stop}"]`).dispatchEvent('pointerenter');
  await expect(page.locator(`[data-${surface}="${stop}"]`)).toHaveAttribute('data-requested','true');
  expect(await cars(page)).toEqual(before);
  await page.clock.runFor(34);expect(await cars(page)).not.toEqual(before);
  expect(await page.evaluate(()=>scrollY)).toBe(y);
  await page.clock.runFor(4000);await expect(page.locator(`[data-stop="${stop}"]`)).toHaveAttribute('data-arrived','true');
});
test('rapid station focus and paused route keep latest input and one train',async({page,isMobile})=>{
  test.skip(isMobile,'Desktop roaming only');await page.locator('[data-line-m]').scrollIntoViewIfNeeded();
  await page.getByRole('button',{name:'Pause route'}).click();
  for(const i of [0,2,1,3])await page.locator(`[data-stop="${i}"]`).focus();
  await expect(page.locator('[data-stop="3"]')).toHaveAttribute('data-requested','true');
  await expect(page.locator('[data-stop="3"]')).toHaveAttribute('data-arrived','true');
  await expect(page.locator('[data-train]')).toHaveCount(1);await expect(page.locator('[data-car]')).toHaveCount(3);
  await page.screenshot({path:'.cache/line-m-codex-handoff-g9tj7mmp/qa/desktop-arrival.png'});
});
for(const surface of ['stop','dep'])test(`${surface} native links activate with animation frozen`,async({page,context,isMobile})=>{
  test.skip(isMobile && surface==='dep','Board hidden on mobile');
  await page.locator(`[data-${surface}="3"]`).scrollIntoViewIfNeeded();await page.clock.install();await page.clock.pauseAt(new Date());
  for(const [i,url] of [[1,'https://www.linkedin.com/in/miguelalmeida1/'],[2,'https://github.com/miguelalmeida0'],[3,'/cv/pdf']] as const){
    const dest=new URL(url,page.url()).href;await context.route(dest,r=>r.fulfill({body:'Contact destination'}));
    const link=page.locator(`[data-${surface}="${i}"]`);await expect(link).toHaveAttribute('href',url);
    const popup=context.waitForEvent('page');if(isMobile)await link.tap({force:true});else await link.click({force:true});const opened=await popup;await opened.waitForURL(dest);await opened.close();
  }
});
test('native Enter modifier and middle click retain browser new-tab behavior',async({page,context,isMobile})=>{
  test.skip(isMobile,'Desktop activation conventions');
  await context.route('https://github.com/miguelalmeida0',r=>r.fulfill({body:'GitHub destination'}));
  const link=page.locator('[data-stop="2"]');
  for(const kind of ['enter','modifier','middle']){
    const popup=context.waitForEvent('page');
    if(kind==='enter')await link.press('Enter');else await link.click(kind==='middle'?{button:'middle'}:{modifiers:['ControlOrMeta']});
    const opened=await popup;await opened.waitForURL('https://github.com/miguelalmeida0');await opened.close();
  }
});
test('SSR and failed geometry preserve contact navigation',async({browser,page})=>{
  const noJs=await browser.newContext({javaScriptEnabled:false});const plain=await noJs.newPage();await plain.goto(new URL('/',page.url()).href);
  await expect(plain.locator('[data-stop="3"]')).toHaveAttribute('href','/cv/pdf');await expect(plain.locator('[data-stop="0"]')).toHaveAttribute('href','mailto:miguelalmeida1592@gmail.com');await noJs.close();
  await page.addInitScript(()=>{const original=Element.prototype.getBoundingClientRect;Element.prototype.getBoundingClientRect=function(){if(this.hasAttribute('data-thread-dock'))throw Error('QA geometry failure');return original.call(this);};});
  await page.reload();await page.locator('[data-stop="3"]').scrollIntoViewIfNeeded();await expect(page.locator('[data-line-m-journey]')).toBeHidden();
  const popup=page.waitForEvent('popup');await page.locator('[data-stop="3"]').click();const opened=await popup;await expect(opened).toHaveURL(/\/cv\/pdf$/);await opened.close();
});
test('SPA navigation disposes the prior visual owner and PDF has none',async({page})=>{
  const menu=page.getByRole('button',{name:'Menu',exact:true});
  if(await menu.isVisible()) await menu.click();
  await page.locator('a[href="/story"]:visible').first().click();await expect(page).toHaveURL(/\/story$/);await expect(page.locator('[data-train]')).toHaveCount(1);
  await page.goBack();await expect(page.locator('[data-train]')).toHaveCount(1);await expect(page.locator('[data-car]')).toHaveCount(3);
  await page.goto('/cv/pdf');await expect(page.locator('[data-line-m-journey]')).toHaveCount(0);await expect(page.locator('[data-bookmark-rail]')).toHaveCount(0);
});
test('email native action survives unresolved clipboard and hover never copies',async({page})=>{
  await page.locator('[data-stop="0"]').scrollIntoViewIfNeeded();
  await page.evaluate(()=>{
    (window as any).copies=0;Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:()=>{(window as any).copies++;return new Promise(()=>{});}}});
    document.addEventListener('click',e=>{if((e.target as Element).closest('[data-stop="0"]')){(window as any).mailPrevented=e.defaultPrevented;e.preventDefault();}});
  });
  await page.locator('[data-stop="0"]').dispatchEvent('pointerenter');expect(await page.evaluate(()=>(window as any).copies)).toBe(0);
  await page.locator('[data-stop="0"]').click();expect(await page.evaluate(()=>(window as any).mailPrevented)).toBe(false);
  expect(await page.evaluate(()=>(window as any).copies)).toBe(1);await expect(page.locator('[data-toast]')).not.toContainText('sent');
});
test('responsive and runtime reduced motion keep native contacts and one representation',async({page})=>{
  for(const width of [320,375,390,768,899,900,1024,1440,1920]){
    await page.setViewportSize({width,height:844});await page.locator('[data-line-m]').scrollIntoViewIfNeeded();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    if(width<900)await expect(page.locator('[data-board]')).toBeHidden();else await expect(page.locator('[data-board]')).toBeVisible();
    await expect(page.locator('[data-car]')).toHaveCount(3);
  }
  await page.emulateMedia({reducedMotion:'reduce'});const before=await cars(page);
  await expect.poll(()=>page.locator('[data-scroll-handle]').evaluate(e=>Number(getComputedStyle(e).opacity))).toBeGreaterThan(0);
  await page.locator('[data-stop="1"]').focus();await page.waitForTimeout(300);expect(await cars(page)).toEqual(before);
  await expect(page.locator('[data-stop="1"]')).toHaveAttribute('data-requested','true');
});
