import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const sizes = [[320,640],[390,844],[844,390],[768,1024],[1440,900]];
const projects = ['f24','second-voice','leu','needle','bollard','morrow'];
for (const [width,height] of sizes) test.describe(`${width}x${height}`, () => {
  test.use({ viewport: { width, height } });
  test('hero and supporting text retain contrast through scroll', async ({page,browser}, info) => {
    info.annotations.push({type:'browser-version', description:browser.version()});
    const handRequests:string[]=[];
    page.on('request',request=>{if(request.url().includes('/images/hero-pointing-hand-'))handRequests.push(request.url());});
    await page.goto('/');
    await expect(page.locator('.hero-location')).toBeVisible();
    await expect(page.locator('.hero-location')).toBeInViewport();
    const hero = await new AxeBuilder({page}).include('.hero-location').withRules(['color-contrast']).analyze();
    expect(hero.violations).toEqual([]);
    if(width<768) expect(handRequests).toEqual([]);
    await info.attach('hero', {body:await page.screenshot(), contentType:'image/png'});
    for (const selector of ['.work-head > p','.about-intro > p','.background-row']) {
      const blocks = page.locator(selector+':visible');
      for (let i=0;i<await blocks.count();i++) {
        const block=blocks.nth(i);
        await block.scrollIntoViewIfNeeded();
        await expect(block).toHaveCSS('opacity','1');
      }
      const result=await new AxeBuilder({page}).include(selector).withRules(['color-contrast']).analyze();
      expect(result.violations).toEqual([]);
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+1)).toBe(true);
    await info.attach('about', {body:await page.screenshot(), contentType:'image/png'});
  });
  test('mobile menu outside dismissal, Escape and focus restoration', async ({page}, info) => {
    test.skip(width>=768,'The mobile menu is not displayed at this breakpoint.');
    await page.goto('/');
    const menu=page.locator('.mobile-menu'), trigger=menu.locator('summary'), panel=page.locator('.mobile-menu-panel');
    await expect(panel).toBeHidden();
    await trigger.click(); await expect(panel).toBeVisible();
    const box=await panel.boundingBox();
    expect(box).not.toBeNull();
    await page.mouse.click(8,box!.y+box!.height+12); await expect(panel).toBeHidden();
    await trigger.press('Enter'); await expect(panel).toBeVisible();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden(); await expect(trigger).toBeFocused();
    await info.attach('menu-closed', {body:await page.screenshot(),contentType:'image/png'});
  });
  test('all project actions and previews open and dismiss the correct case', async ({page}, info) => {
    test.setTimeout(90000);
    await page.goto('/');
    for (let i=0;i<projects.length;i++) {
      const id=projects[i], card=page.locator(`#${id}`);
      if(width>=768 && height>=600) { await page.locator('.nav-links a[href="#work"]').click(); await page.locator(`[data-project="${i}"]`).click(); }
      for (const selector of ['.project-actions [data-case]', '.project-shot:is(button), .project-preview-action']) {
        const trigger=card.locator(selector);
        // Mobile intentionally exposes the preview instead of duplicate actions.
        if(!await trigger.isVisible()) { info.annotations.push({type:'not-applicable', description:`${id} ${selector} hidden by authored ${width}px layout`}); continue; }
        const visiblePhrase=selector.includes('actions')?'Read case study':'View case study';
        await expect(trigger).toHaveAccessibleName(new RegExp(visiblePhrase));
        if(!selector.includes('actions')){
          await trigger.scrollIntoViewIfNeeded();
          const labelAudit=await new AxeBuilder({page}).include(`#${id} .project-shot`).withRules(['label-content-name-mismatch']).analyze();
          expect(labelAudit.violations).toEqual([]);
        }
        await trigger.click();
        const dialog=page.locator('#case-dialog'); await expect(dialog).toBeVisible();
        await expect(page.locator('#case-title')).toContainText(id==='second-voice'?'Second Voice':id==='f24'?'F24':id[0].toUpperCase()+id.slice(1));
        const controls=dialog.locator('a[href],button').filter({visible:true});
        const count=await controls.count();
        for(const key of ['Tab','Shift+Tab']) for(let n=0;n<count+1;n++){
          await page.keyboard.press(key);
          expect(await dialog.evaluate(el=>el.contains(document.activeElement))).toBe(true);
        }
        await info.attach(`${id}-${selector.includes('actions')?'action':'preview'}`, {body:await page.screenshot(),contentType:'image/png'});
        await page.keyboard.press('Escape'); await expect(dialog).toBeHidden();
        await expect(trigger).toBeFocused();
        if(id==='f24' && !selector.includes('actions')){
          await trigger.click();
          await dialog.locator('.dialog-next').click();
          await expect(page.locator('#case-title')).toContainText('Second Voice');
          await page.keyboard.press('Escape');
          await expect(dialog).toBeHidden();
          await expect(page.locator(width<768?'#second-voice .project-preview-action':'#second-voice .project-actions [data-case]')).toBeFocused();
        }
      }
    }
  });
  test('navigation preserves expected destinations through Back and Forward', async ({page}) => {
    await page.goto('/');
    if(width<768) await page.locator('.mobile-menu summary').click();
    await page.locator(width<768?'.mobile-menu-panel a[href="#about"]':'.nav-links a[href="#about"]').click();
    await expect(page).toHaveURL(/\/#about$/);
    await expect(page.locator('#about-heading')).toBeInViewport();
    await page.goBack(); await expect(page).toHaveURL(/\/$/);
    await page.goForward(); await expect(page).toHaveURL(/\/#about$/);
    await expect(page.locator('#about-heading')).toBeInViewport();
  });
  test('CV zoom, keyboard activation, dismissal and rendered PDF', async ({page}, info) => {
    await page.goto('/cv/pdf');
    const trigger=page.locator('.zoom-trigger'); await expect(trigger).toBeEnabled();
    await expect(page.locator('.annotationLayer a').first()).toBeVisible();
    const targets=await page.locator('.annotationLayer a').evaluateAll(elements=>elements.map(el=>{const r=el.getBoundingClientRect();return {href:(el as HTMLAnchorElement).href,name:el.getAttribute('aria-label'),x:r.x,y:r.y,w:r.width,h:r.height};}));
    const undersized=targets.filter(t=>t.w<24||t.h<24);
    const crowded=undersized.filter(a=>targets.some(b=>{
      if(a===b)return false;
      const ax=a.x+a.w/2,ay=a.y+a.h/2;
      if(b.w<24||b.h<24)return Math.hypot(ax-b.x-b.w/2,ay-b.y-b.h/2)<24;
      const dx=Math.max(b.x-ax,0,ax-b.x-b.w),dy=Math.max(b.y-ay,0,ay-b.y-b.h);
      return Math.hypot(dx,dy)<12;
    }));
    await info.attach('pdf-target-spacing',{body:JSON.stringify({targets,undersized,crowded}),contentType:'application/json'});
    const linksTrigger=page.locator('.cv-links summary');
    await linksTrigger.focus(); await page.keyboard.press('Enter');
    const alternatives=page.getByRole('navigation',{name:'Links from the CV'});
    await expect(alternatives).toBeVisible();
    // WCAG 2.5.8 equivalent-control exception: each crowded PDF link has
    // the same destination on this page with independently measured targets.
    for(const target of crowded){
      const equivalent=alternatives.locator('a').filter({hasText:target.name!.split(' — ')[0].replace(/^Email .+$/, 'Email')});
      await expect(equivalent).toHaveAttribute('href',target.href);
      const box=await equivalent.boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(24); expect(box!.width).toBeGreaterThanOrEqual(24);
    }
    await info.attach('cv-equivalent-links',{body:await page.screenshot(),contentType:'image/png'});
    await page.keyboard.press('Escape'); await expect(alternatives).toBeHidden();
    await expect(linksTrigger).toBeFocused();
    await linksTrigger.click(); await expect(alternatives).toBeVisible();
    await page.locator('.reader-title').click(); await expect(alternatives).toBeHidden();
    const initial=await trigger.innerText();
    await expect(trigger).toHaveAccessibleName(new RegExp(initial.trim().replace('%','%')));
    await page.getByRole('button',{name:'Zoom in',exact:true}).click();
    await expect(trigger).not.toHaveText(initial);
    await trigger.focus(); await page.keyboard.press('Enter');
    await expect(page.getByRole('slider',{name:'Zoom percentage'})).toBeFocused();
    expect((await new AxeBuilder({page}).include('.zoom').withRules(['label-content-name-mismatch']).analyze()).violations).toEqual([]);
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Escape'); await expect(page.locator('#cv-zoom-panel')).toBeHidden();
    await expect(trigger).toBeFocused();
    await page.getByRole('button',{name:'Zoom out',exact:true}).click();
    await expect(page.locator('canvas').first()).toBeVisible();
    await info.attach('cv', {body:await page.screenshot(),contentType:'image/png'});
    const a11y=await new AxeBuilder({page}).include('.zoom').withRules(['label-content-name-mismatch']).analyze();
    expect(a11y.violations).toEqual([]);
  });
  test('copy email reports success and clipboard matches when permission is supported', async ({page,context,browserName},info) => {
    if(browserName==='chromium') await context.grantPermissions(['clipboard-read','clipboard-write']);
    await page.goto('/'); await page.locator('.copy-email').click();
    await expect(page.locator('.contact-status')).toContainText(/copied/i);
    if(browserName==='chromium') expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe('miguelalmeida1592@gmail.com');
    else info.annotations.push({type:'uncovered',description:'Clipboard read permission is unavailable in this browser; only the visible copy result is asserted.'});
  });
});

test('static homepage sends HSTS and an executable CSP', async ({page},info) => {
  await page.addInitScript(()=>{
    (window as any).__cspViolations=[];
    document.addEventListener('securitypolicyviolation',event=>(window as any).__cspViolations.push({directive:event.effectiveDirective,blocked:event.blockedURI}));
  });
  const response=await page.goto('/');
  expect(response?.headers()['strict-transport-security']).toContain('max-age=31536000');
  expect(response?.headers()['content-security-policy']).toContain("script-src 'self' 'sha256-");
  await page.locator('.nav-links a[href="#work"]').click();
  await page.locator('#f24 .project-actions [data-case]').click();
  await expect(page.locator('#case-dialog')).toBeVisible();
  const violations=await page.evaluate(()=>(window as any).__cspViolations);
  await info.attach('csp-violations',{body:JSON.stringify(violations),contentType:'application/json'});
  expect(violations).toEqual([]);
});

test('worker routes enforce CSP while the PDF reader remains usable', async ({page}, info) => {
  const violations: {directive:string; blocked:string}[]=[];
  await page.exposeFunction('recordCspViolation', (value:{directive:string; blocked:string})=>violations.push(value));
  await page.addInitScript(()=>document.addEventListener('securitypolicyviolation', event=>
    (window as any).recordCspViolation({directive:event.effectiveDirective, blocked:event.blockedURI})));
  const response=await page.goto('/cv/pdf');
  const policy=response?.headers()['content-security-policy'] || '';
  expect(policy).toMatch(/script-src[^;]*'self'[^;]*'nonce-[^']+'/);
  expect(policy).not.toContain("'unsafe-eval'");
  expect(policy).toContain("object-src 'none'");
  await expect(page.locator('.annotationLayer a').first()).toBeVisible();
  const trigger=page.locator('.zoom-trigger');
  const initial=await trigger.innerText();
  await page.getByRole('button',{name:'Zoom in',exact:true}).click();
  await expect(trigger).not.toHaveText(initial);
  await expect(page.locator('canvas').first()).toBeVisible();
  for(const path of ['/story','/cv','/work/needle']) {
    const route=await page.goto(path);
    expect(route?.headers()['content-security-policy']).toMatch(/script-src[^;]*'nonce-/);
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-motion', /full|reduced/);
  }
  await info.attach('worker-csp-violations',{body:JSON.stringify(violations),contentType:'application/json'});
  expect(violations).toEqual([]);
});

test('hero copy keeps full contrast throughout its entrance animation', async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  // Sample the actual CSS animation, not wall-clock-dependent screenshot timing.
  const samples=await page.locator('.hero-meta').evaluate(element=>{
    document.documentElement.setAttribute('data-landing-enter','playing');
    const animations=element.getAnimations();
    if(animations.length!==1) throw Error('Expected the authored hero copy entrance');
    const animation=animations[0];animation.pause();
    return [0,110,180,320,530].map(time=>{
      animation.currentTime=time;
      return {time,opacity:getComputedStyle(element).opacity};
    });
  });
  expect(samples.map(sample=>sample.opacity)).toEqual(['1','1','1','1','1']);
});

test('CV zoom panel fits short landscape and keeps every fit control reachable', async ({page}) => {
  await page.setViewportSize({width:844,height:390});
  await page.goto('/cv/pdf');
  await expect(page.locator('.annotationLayer a').first()).toBeVisible();
  await expect(page.locator('.zoom-trigger')).toBeEnabled();
  await page.locator('.zoom-trigger').click();
  const panel=page.locator('#cv-zoom-panel');
  await expect(panel).toHaveCSS('opacity','1');
  const fits=async()=>{
    const rect=await panel.boundingBox();
    expect(rect!.y).toBeGreaterThanOrEqual(0);
    expect(rect!.y+rect!.height).toBeLessThanOrEqual(page.viewportSize()!.height-8);
  };
  await fits();
  await panel.getByRole('button',{name:'Fit width',exact:true}).focus();
  await page.keyboard.press('Enter');
  await expect(panel.getByRole('button',{name:'Fit width',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.setViewportSize({width:844,height:320});
  await expect(async()=>{await fits();}).toPass();
  await panel.getByRole('button',{name:'Fit page',exact:true}).focus();
  await page.keyboard.press('Enter');
  await expect(panel.getByRole('button',{name:'Fit page',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.keyboard.press('Escape');
  await expect(page.locator('.zoom-trigger')).toBeFocused();
});

test('CV scale copy stays opaque during opening', async ({page}) => {
  await page.goto('/cv/pdf');
  await expect(page.locator('.annotationLayer a').first()).toBeVisible();
  await page.locator('.zoom-trigger').click();
  const opacity=await page.locator('#cv-zoom-panel').evaluate(element=>{
    const animation=element.getAnimations()[0];
    if(!animation)throw Error('Expected the authored panel entrance');
    animation.pause();animation.currentTime=60;
    return getComputedStyle(element).opacity;
  });
  expect(opacity).toBe('1');
});

test('CV fit labels retain contrast when the selected mode changes', async ({page}) => {
  await page.goto('/cv/pdf');
  await expect(page.locator('.annotationLayer a').first()).toBeVisible();
  await page.locator('.zoom-trigger').click();
  const panel=page.locator('#cv-zoom-panel');
  await expect(panel).toHaveCSS('opacity','1');
  for(const label of ['Fit page','Fit width','Auto — Automatic fit']) {
    await panel.getByRole('button',{name:label,exact:true}).click();
    // Freeze any selection transitions midway so transient low contrast cannot
    // be hidden by waiting for the final state before auditing.
    await panel.locator('.fit-options').evaluate(element=>{
      for(const animation of element.getAnimations({subtree:true})){
        const timing=animation.effect!.getTiming();
        animation.pause();animation.currentTime=Number(timing.duration)/2;
      }
    });
    expect((await new AxeBuilder({page}).include('.fit-options').withRules(['color-contrast']).analyze()).violations).toEqual([]);
  }
});

test('CV zoom trigger stays in place while PDF links become available', async ({page}) => {
  let releasePdf!:()=>void;
  const heldPdf=new Promise<void>(resolve=>{releasePdf=resolve;});
  await page.route('**/files/Miguel_Almeida_CV.pdf',async route=>{
    await heldPdf;
    await route.continue();
  });
  await page.goto('/cv/pdf',{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>document.fonts.ready);
  const trigger=page.locator('.zoom-trigger');
  await expect(trigger).toBeDisabled();
  const before=await trigger.boundingBox();
  releasePdf();
  await expect(page.locator('.annotationLayer a').first()).toBeVisible();
  await expect(trigger).toBeEnabled();
  const after=await trigger.boundingBox();
  expect(after!.x).toBeCloseTo(before!.x,0);
  expect(after!.y).toBeCloseTo(before!.y,0);
});
