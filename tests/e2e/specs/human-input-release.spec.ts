import {test,expect,type Locator} from '@playwright/test';

async function expectVisiblePreviewChange(scene:Locator,minimumFraction=.01){
 const {PNG}=await import('pngjs');
 const before=PNG.sync.read(await scene.screenshot());
 // Several samples avoid mistaking two equal points in a repeating fade for a freeze.
 await expect.poll(async()=>{
  const after=PNG.sync.read(await scene.screenshot());
  let changed=0;
  for(let p=0;p<before.data.length;p+=4){
   const delta=Math.abs(before.data[p]-after.data[p])+Math.abs(before.data[p+1]-after.data[p+1])+Math.abs(before.data[p+2]-after.data[p+2]);
   if(delta>30)changed++;
  }
  return changed/(before.width*before.height);
 },{message:'The visible preview must change without input',timeout:4000,intervals:[400,500,600]}).toBeGreaterThan(minimumFraction);
}

test('reviewed homepage opens immediately with recruiter contact links',async({page})=>{
 await page.goto('/');
 await expect(page.getByRole('heading',{name:'Miguel Almeida',exact:true})).toBeVisible();
 await expect(page.locator('.brand-logo')).toBeVisible();
 await expect(page.locator('.nav').getByRole('link',{name:'View CV'})).toHaveAttribute('href',/\/cv\/pdf$/);
 await expect(page.getByRole('link',{name:'Get in touch',exact:true})).toHaveAttribute('href',/^mailto:/);
});

test('project navigation, animated preview and case dialog remain usable',async({page})=>{
 await page.goto('/');
 await page.getByRole('link',{name:'Work',exact:true}).click();
 await page.getByRole('button',{name:'Second Voice',exact:true}).click();
 await expect(page.locator('#second-voice')).toBeInViewport();
 await page.getByRole('button',{name:'Read Second Voice case study',exact:true}).click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await expect(page.getByRole('dialog').getByRole('link',{name:/Open Second Voice app/})).toHaveAttribute('href','https://secondvoice.miguelalmeida.xyz/');
 await page.keyboard.press('Escape');
 await expect(page.getByRole('dialog')).not.toBeVisible();
});

for(const viewport of [{width:768,height:1024},{width:1024,height:700},{width:1366,height:650},{width:1440,height:900},{width:1536,height:690}]){
 test(`medium/large ${viewport.width}x${viewport.height}: original project layout and scroll remain active`,async({page})=>{
  await page.setViewportSize(viewport);
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('/');
  await expect(page.locator('.mobile-role')).toBeHidden();
  await expect(page.locator('.project-scene.mobile-film')).toHaveCount(0);
  await expect(page.locator('.pin-spacer-human-hero')).toHaveCount(1);
  const front=page.locator('#home [data-sheet-front]'),hand=page.locator('#home .hand.left');
  const frontTop=(await front.boundingBox())!.y,handPose=await hand.evaluate(el=>getComputedStyle(el).transform);
  await page.mouse.wheel(0,viewport.height*2.7);
  await expect.poll(async()=>(await front.boundingBox())!.y).toBeLessThan(frontTop-100);
  await expect.poll(()=>hand.evaluate(el=>getComputedStyle(el).transform)).not.toBe(handPose);
  await page.mouse.wheel(0,-viewport.height*2.7);
  await expect.poll(async()=>Math.abs((await front.boundingBox())!.y-frontTop)).toBeLessThan(2);
  const workLink=page.locator('.nav').getByRole('link',{name:'Work',exact:true});
  await workLink.focus();await workLink.press('Enter');
  await expect(page.locator('body')).toHaveClass(/gallery-is-horizontal/);
  await expect(page.locator('.pin-spacer-human-gallery')).toHaveCount(1);
  const track=page.locator('.work-track');
  const before=await track.evaluate(el=>getComputedStyle(el).transform);
  await page.mouse.wheel(0,1800);
  await expect.poll(()=>track.evaluate(el=>getComputedStyle(el).transform)).not.toBe(before);
  for(const [index,id] of ['f24','second-voice','leu','needle','bollard'].entries()){
   const button=page.locator('[data-project]').nth(index);
   await button.focus();await button.press('Enter');
   const project=page.locator(`#${id}`),shot=project.locator('.project-shot');
   await expect(shot).toBeInViewport({ratio:.99});
   const title=(await project.locator('h3').boundingBox())!,image=(await shot.boundingBox())!;
   expect(title.x+title.width).toBeLessThanOrEqual(image.x+1);
   const actions=project.locator('.project-actions');
   await expect(actions.getByRole('button',{name:/Read .* case study/,exact:true})).toBeInViewport();
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 });
}

test('resizing across the phone boundary restores one scroll owner and keeps phone autoplay',async({page})=>{
 await page.setViewportSize({width:767,height:900});
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.goto('/');
 for(const viewport of [{width:768,height:900},{width:1024,height:650},{width:1440,height:900}]){
  await page.setViewportSize(viewport);
  await expect(page.locator('.project-scene.mobile-film')).toHaveCount(0);
  await expect(page.locator('.mobile-menu')).toBeHidden();
  await expect(page.locator('.pin-spacer-human-hero')).toHaveCount(1);
  await expect(page.locator('.pin-spacer-human-gallery')).toHaveCount(1);
  await page.setViewportSize({width:767,height:900});
  await expect(page.locator('.mobile-menu')).toBeVisible();
  await expect(page.locator('.pin-spacer-human-hero,.pin-spacer-human-gallery')).toHaveCount(0);
  const scene=page.locator('#needle .project-scene');
  await scene.scrollIntoViewIfNeeded();
  await expect(scene).toHaveAttribute('data-film-playing','true');
  const before=await scene.getAttribute('data-film-time');
  await expect.poll(()=>scene.getAttribute('data-film-time')).not.toBe(before);
 }
});

test('footer keyboard contacts and scrollbar work on a narrow screen',async({page})=>{
 await page.setViewportSize({width:320,height:800});
 await page.goto('/');
 await page.locator('#contact').scrollIntoViewIfNeeded();
 await expect(page.locator('#contact').getByRole('link',{name:'Email Miguel',exact:true})).toBeVisible();
 await page.locator('#contact').getByRole('button',{name:'Copy email',exact:true}).focus();
 await expect(page.locator('#contact').getByRole('button',{name:'Copy email',exact:true})).toBeFocused();
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
 expect(overflow).toBe(false);
 await page.getByRole('link',{name:/Back to top/}).click();
 await expect(page.getByRole('heading',{name:'Frontend engineer & design engineer.',exact:true})).toBeInViewport();
});

test('reduced motion preserves project previews and all existing public routes',async({page,request})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');
 await expect(page.locator('.sv-result')).toContainText('Rain arrived');
 for(const path of ['/story','/cv','/cv/pdf','/work/f24','/work/needle','/work/second-voice','/work/leu']){
  const response=await request.get(path);expect(response.status(),path).toBe(200);
 }
 const pdf=await request.get('/files/miguel-almeida-cv.pdf');
 expect(pdf.headers()['content-type']).toContain('application/pdf');
});

for (const width of [320,390,430,600,767]) {
 test(`mobile ${width}: opaque navigation and readable Needle in reduced motion`,async({page})=>{
  await page.setViewportSize({width,height:844});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  const nav=page.locator('.nav');
  const title=page.locator('.mobile-role');
  expect((await title.boundingBox())!.y).toBeGreaterThan((await nav.boundingBox())!.height+15);
  await page.evaluate(()=>scrollTo(0,70));
  expect(await nav.evaluate(el=>getComputedStyle(el).backgroundColor)).not.toBe('rgba(0, 0, 0, 0)');
  const preview=page.locator('#needle .project-shot');
  expect((await preview.boundingBox())!.width).toBeGreaterThan(width*.8);
  await expect(preview.locator('.nd-question')).toBeVisible();
  await preview.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(preview).toBeFocused();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 });
}

for (const width of [320,393,767]) {
 test(`mobile ${width}: portrait entrance cannot expose fragments below the illustration`,async({page})=>{
  await page.setViewportSize({width,height:852});
  await page.goto('/');
  await page.locator('#contact').scrollIntoViewIfNeeded();
  // Hold the original entrance's largest downward offset, including after it settles.
  await page.addStyleTag({content:'.footer-person{transform:translateY(18px)!important}'});
  const illustration=page.locator('.footer-illustration');
  const art=(await illustration.boundingBox())!;
  const copy=(await page.locator('.footer-contact-main').boundingBox())!;
  expect(copy.y-art.y-art.height).toBeGreaterThanOrEqual(31);
  const {PNG}=await import('pngjs');
  const strip=PNG.sync.read(await page.screenshot({clip:{x:0,y:art.y+art.height+2,width,height:20}}));
  // This strip used to show detached clothing fragments during the entrance.
  let fragments=0;
  for(let i=0;i<strip.data.length;i+=4){
   if(strip.data[i]!==16||strip.data[i+1]!==45||strip.data[i+2]!==136)fragments++;
  }
  expect(fragments).toBe(0);
 });
}

test('mobile previews autoplay independently and pause offscreen, in dialogs and by choice',async({page})=>{
 await page.setViewportSize({width:393,height:852});
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.goto('/');
 for(const id of ['second-voice','leu','needle']){
  const scene=page.locator(`#${id} .project-scene`);
  await scene.scrollIntoViewIfNeeded();
  await expect(scene).toHaveAttribute('data-film-playing','true');
  const before=Number(await scene.getAttribute('data-film-time'));
  await expect.poll(async()=>Number(await scene.getAttribute('data-film-time'))).not.toBe(before);
 }
 const leu=page.locator('#leu .project-scene');
 await page.locator('#leu .project-shot').click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await expect(page.locator('.project-scene[data-film-playing=true]')).toHaveCount(0);
 const stopped=await leu.getAttribute('data-film-time');
 await page.waitForTimeout(200);
 expect(await leu.getAttribute('data-film-time')).toBe(stopped);
 await page.keyboard.press('Escape');
 await expect(leu).toHaveAttribute('data-film-playing','true');
 const toggle=page.locator('[data-film-toggle]');
 await toggle.click();
 await expect(toggle).toHaveAttribute('aria-pressed','true');
 await page.locator('#needle .project-scene').scrollIntoViewIfNeeded();
 await expect(page.locator('.project-scene[data-film-playing=true]')).toHaveCount(0);
 await toggle.click();
 await page.locator('#needle .project-scene').scrollIntoViewIfNeeded();
 await expect(page.locator('#needle .project-scene')).toHaveAttribute('data-film-playing','true');
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(page.locator('.project-scene.mobile-film')).toHaveCount(3);
 await expect(toggle).toBeVisible();
 await page.reload();
 await expect(toggle).toHaveAccessibleName(/Pause/);
 await expect(page.locator('.project-scene.mobile-film')).toHaveCount(3);
 await page.setViewportSize({width:1440,height:900});
 await page.emulateMedia({reducedMotion:'no-preference'});
 await expect(page.locator('.project-scene.mobile-film')).toHaveCount(0);
});

test('reduced-motion visitors get gentle autoplay and can keep their pause choice on reload',async({page})=>{
 await page.setViewportSize({width:393,height:852});
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');
 const toggle=page.locator('[data-film-toggle]');
 await expect(page.locator('.project-scene.mobile-film')).toHaveCount(3);
 await expect(toggle).toBeVisible();
 await expect(toggle).toHaveAccessibleName(/Pause/);
 await toggle.click();
 const scene=page.locator('#leu .project-scene');
 await scene.scrollIntoViewIfNeeded();
 await expect(scene).toHaveAttribute('data-film-playing','false');
 await expect(scene.locator('.leu-leaf')).toHaveCount(0);
 await expect(scene.locator('.leu-room')).toHaveCSS('transform','none');
 await page.reload();
 await scene.scrollIntoViewIfNeeded();
 await expect(scene).toHaveAttribute('data-film-playing','false');
 await toggle.click();
 await scene.scrollIntoViewIfNeeded();
 await expect(scene).toHaveAttribute('data-film-playing','true');
 await expect(scene.locator('.leu-leaf')).toHaveCount(0);
 await expect(scene.locator('.leu-room')).toHaveCSS('transform','none');
});

test('explicit play link clears a saved pause without changing desktop motion',async({page})=>{
 await page.setViewportSize({width:393,height:852});
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');
 await page.evaluate(()=>sessionStorage.setItem('portfolio-previews-paused','true'));
 await page.goto('/?motion=play#second-voice');
 const scene=page.locator('#second-voice .project-scene');
 await expect(scene).toHaveAttribute('data-film-playing','true');
 const transfer=scene.locator('.sv-transfer');
 await expect(transfer).toHaveCSS('display','block');
 const turn=await transfer.evaluate(el=>getComputedStyle(el).transform);
 await expect.poll(()=>transfer.evaluate(el=>getComputedStyle(el).transform)).not.toBe(turn);
 const before=await scene.getAttribute('data-film-time');
 await expect.poll(()=>scene.getAttribute('data-film-time')).not.toBe(before);
 await page.goto('/#second-voice');
 await expect(scene).toHaveAttribute('data-film-playing','true');
 await expect(transfer).toHaveCSS('display','block');
 await page.setViewportSize({width:1440,height:900});
 await expect(page.locator('.project-scene.mobile-film')).toHaveCount(0);
});

test('two fully visible mobile previews both animate without touch input',async({page})=>{
 await page.setViewportSize({width:320,height:852});
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.goto('/');
 const leu=page.locator('#leu .project-scene');
 const voice=page.locator('#second-voice .project-scene');
 // This narrow layout fits both previews; the former winner-only policy froze Voice.
 await leu.scrollIntoViewIfNeeded();
 await voice.scrollIntoViewIfNeeded();
 await expect(leu).toBeInViewport({ratio:.99});
 await expect(voice).toBeInViewport({ratio:.99});
 for(const scene of [leu,voice]){
  await expect(scene).toHaveAttribute('data-film-playing','true');
  const before=await scene.getAttribute('data-film-time');
  await expect.poll(()=>scene.getAttribute('data-film-time')).not.toBe(before);
 }
 await page.locator('#contact').scrollIntoViewIfNeeded();
 await expect(page.locator('.project-scene[data-film-playing=true]')).toHaveCount(0);
});

test('plain mobile URL visibly autoplays all three DOM previews with gentle reduced motion',async({page})=>{
 await page.setViewportSize({width:393,height:852});
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');
 await page.evaluate(()=>document.fonts.ready);
 for(const id of ['second-voice','leu','needle']){
  const scene=page.locator(`#${id} .project-scene`);
  await scene.scrollIntoViewIfNeeded();
  await expect(scene).toHaveAttribute('data-film-playing','true');
  const layers=scene.locator('.scene-world,.needle-search,.rule-save,.sv-result>span,.sv-strength-dot,.leu-room');
  const positions=await layers.evaluateAll(elements=>elements.map(el=>getComputedStyle(el).transform));
  await expectVisiblePreviewChange(id==='leu'?scene.locator('.leu-arch'):scene);
  expect(await layers.evaluateAll(elements=>elements.map(el=>getComputedStyle(el).transform)),`${id} must keep its camera and reading copy still`).toEqual(positions);
 }
 await expect(page.locator('#leu .leu-leaf')).toHaveCount(0);
 await expect(page.locator('#leu .leu-room')).toHaveCSS('transform','none');
 await page.locator('[data-film-toggle]').click();
 await expect(page.locator('.project-scene[data-film-playing=true]')).toHaveCount(0);
});

test('Leu visibly keeps playing through the middle of its loop',async({page})=>{
 await page.setViewportSize({width:393,height:852});
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.goto('/#leu');
 const scene=page.locator('#leu .project-scene');
 await scene.scrollIntoViewIfNeeded();
 await expect.poll(async()=>Number(await scene.getAttribute('data-film-time'))).toBeGreaterThan(3);
 await expectVisiblePreviewChange(scene.locator('.leu-arch'));
});

for(const reducedMotion of ['reduce','no-preference'] as const){
 test(`Leu ${reducedMotion}: only rain moves and the room has no covering panel`,async({page})=>{
  await page.setViewportSize({width:393,height:637});
  await page.emulateMedia({reducedMotion});
  await page.goto('/#leu');await page.evaluate(()=>document.fonts.ready);
  const scene=page.locator('#leu .project-scene'),drop=scene.locator('.leu-rain i').first();
  await expect(scene).toHaveAttribute('data-film-playing','true');
  await expect(scene.locator('.leu-leaf,.leu-window-glow')).toHaveCount(0);
  await expect(scene.locator('.leu-room')).toHaveCSS('transform','none');
  const before=await drop.evaluate(el=>getComputedStyle(el).transform);
  await expect.poll(()=>drop.evaluate(el=>getComputedStyle(el).transform)).not.toBe(before);
  await expectVisiblePreviewChange(scene.locator('.leu-arch'));
  const {PNG}=await import('pngjs');
  const bounds=(await scene.boundingBox())!,window=(await scene.locator('.leu-arch').boundingBox())!;
  // Compare in CSS pixels, matching boundingBox even on high-DPR phones.
  const a=PNG.sync.read(await scene.screenshot({scale:'css'}));await page.waitForTimeout(700);const b=PNG.sync.read(await scene.screenshot({scale:'css'}));
  let outside=0;
  for(let y=0;y<a.height;y++)for(let x=0;x<a.width;x++){
   if(x>window.x-bounds.x-2&&x<window.x-bounds.x+window.width+2&&y>window.y-bounds.y-2&&y<window.y-bounds.y+window.height+2)continue;
   const p=(y*a.width+x)*4;
   const delta=Math.abs(a.data[p]-b.data[p])+Math.abs(a.data[p+1]-b.data[p+1])+Math.abs(a.data[p+2]-b.data[p+2]);
   // Ignore subpixel compositor rounding, using the same visible-change
   // threshold as the rain assertion above.
   if(delta>30)outside++;
  }
  expect(outside,'The room, headline and sofa must stay still').toBe(0);
 });
}

for(const reducedMotion of ['reduce','no-preference'] as const){
 test(`Needle ${reducedMotion}: real search, six results and artwork inspector autoplay`,async({page})=>{
  await page.setViewportSize({width:393,height:637});await page.emulateMedia({reducedMotion});
  await page.goto('/#needle');const scene=page.locator('#needle .project-scene');
  await expect(scene).toHaveAttribute('data-film-playing','true');
  const fieldPosition=await scene.locator('.nd-field').evaluate(el=>getComputedStyle(el).transform);
  const geometry=()=>scene.locator('.nd-focus').evaluate(el=>{const s=getComputedStyle(el);return {transform:s.transform,width:s.width,height:s.height};});
  const originalGeometry=await geometry();
  await expect(scene.locator('.needle-lens,.needle-found')).toHaveCount(0);
  await expect(scene.locator('.nd-query').first()).toHaveText('A room with a window');
  await expect(scene.locator('.nd-grid img')).toHaveCount(6);
  await expect.poll(()=>scene.locator('.nd-grid img').evaluateAll(es=>es.every(el=>(el as HTMLImageElement).complete&&(el as HTMLImageElement).naturalWidth>0))).toBe(true);
  await expect.poll(async()=>Number(await scene.locator('.nd-gallery').evaluate(el=>getComputedStyle(el).opacity))).toBeGreaterThan(.95);
  const brand=(await scene.locator('.nd-brand').boundingBox())!;
  const toolbar=(await scene.locator(reducedMotion==='reduce'?'.nd-docked':'.nd-field').boundingBox())!;
  expect(toolbar.x-brand.x-brand.width,'The docked search must leave room for the Needle wordmark').toBeGreaterThanOrEqual(8);
  const artworkFit=await scene.locator('.nd-grid img').evaluateAll(es=>es.map((el,index)=>{
   const image=el.getBoundingClientRect(),cell=el.parentElement!.getBoundingClientRect();
   return {result:index+1,clipPath:getComputedStyle(el).clipPath,widthDifference:Math.abs(image.width-cell.width),heightDifference:Math.abs(image.height-cell.height)};
  }));
  expect(artworkFit.filter(art=>art.clipPath!=='none'||art.widthDifference>1||art.heightDifference>1),'All six result artworks fill their cells without the poster clip').toEqual([]);
  await expectVisiblePreviewChange(scene);
  const details=scene.locator('.nd-details');
  await expect.poll(async()=>Number(await details.evaluate(el=>getComputedStyle(el).opacity)),{timeout:10000}).toBeGreaterThan(.95);
  await expect(details).toContainText('Moonlight, Strandgade 30');await expect(details).toContainText('Vilhelm Hammershøi');
  if(reducedMotion==='reduce'){
   expect(await scene.locator('.nd-field').evaluate(el=>getComputedStyle(el).transform)).toBe(fieldPosition);
   expect(await geometry()).toEqual(originalGeometry);
  }
  else expect(await scene.locator('.nd-field').evaluate(el=>getComputedStyle(el).transform)).not.toBe(fieldPosition);
  const position=await scene.locator('.nd-focus').evaluate(el=>getComputedStyle(el).transform);
  await page.waitForTimeout(450);
  expect(await scene.locator('.nd-focus').evaluate(el=>getComputedStyle(el).transform)).toBe(position);
  await expect.poll(async()=>Number(await details.evaluate(el=>getComputedStyle(el).opacity)),{timeout:6000}).toBeLessThan(.05);
  if(reducedMotion==='reduce')expect(await geometry()).toEqual(originalGeometry);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await page.setViewportSize({width:1440,height:900});
  await expect(scene.locator('.needle-demo')).toBeHidden();
  await expect(scene.locator('.needle-search')).toBeVisible();
 });
}

test('Needle mounts once after desktop entry and resumes after mobile re-entry',async({page})=>{
 await page.setViewportSize({width:1440,height:900});await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/#needle');const scene=page.locator('#needle .project-scene');
 await expect(scene.locator('.needle-demo')).toHaveCount(0);
 await page.setViewportSize({width:393,height:637});await scene.scrollIntoViewIfNeeded();
 await expect(scene.locator('.needle-demo')).toHaveCount(1);await expect(scene).toHaveAttribute('data-film-playing','true');
 await scene.locator('.needle-demo').evaluate(el=>el.setAttribute('data-reentry-probe','original'));
 await page.setViewportSize({width:1440,height:900});await expect(scene.locator('.needle-demo')).toBeHidden();
 await expect(scene.locator('.needle-search')).toBeVisible();
 await page.setViewportSize({width:393,height:637});await scene.scrollIntoViewIfNeeded();
 await expect(scene.locator('.needle-demo')).toHaveCount(1);
 await expect(scene.locator('.needle-demo')).toHaveAttribute('data-reentry-probe','original');
 await expect.poll(()=>scene.locator('.nd-grid img').evaluateAll(es=>es.length===6&&es.every(el=>(el as HTMLImageElement).complete&&(el as HTMLImageElement).naturalWidth>0))).toBe(true);
 await expect(scene).toHaveAttribute('data-film-playing','true');
 const before=await scene.getAttribute('data-film-time');await expect.poll(()=>scene.getAttribute('data-film-time')).not.toBe(before);
});

test('motion diagnostics distinguish an advancing clock from a saved pause',async({page})=>{
 await page.setViewportSize({width:393,height:852});
 await page.goto('/motion-debug/#leu');
 await expect(page.locator('[data-motion-status]')).toHaveAttribute('data-motion-status','running');
 await page.getByRole('button',{name:'Copy report',exact:true}).click();
 await expect(page.locator('[data-motion-copy]')).toHaveText(/Copied|Select the report below/);
 expect(await page.evaluate(()=>new Promise<boolean>(resolve=>{
  new IntersectionObserver(function(this:IntersectionObserver,_entries,observer){observer.disconnect();resolve(this===observer);}).observe(document.body);
 }))).toBe(true);
 await page.evaluate(()=>sessionStorage.setItem('portfolio-previews-paused','true'));
 await page.reload();
 await expect(page.locator('[data-motion-status]')).toHaveAttribute('data-motion-status','paused');
 await expect(page.locator('[data-motion-report]')).toContainText('"savedPause": true');
});

test('motion diagnostics survive a failure in the main animation script',async({page})=>{
 await page.setViewportSize({width:393,height:852});
 await page.route('**/motion-debug/',async route=>{
  const response=await route.fetch();
  const body=(await response.text()).replace('function createMobileProjectFilms(panels) {','function createMobileProjectFilms(panels) { throw new Error("Motion bootstrap test failure");');
  await route.fulfill({response,body});
 });
 await page.goto('/motion-debug/#leu');
 await expect(page.locator('[data-motion-status]')).toHaveAttribute('data-motion-status','initialization-failed');
 await expect(page.locator('[data-motion-report]')).toContainText('Motion bootstrap test failure');
});

test('motion diagnostics detect a stopped clock despite the playing flag',async({page})=>{
 await page.setViewportSize({width:393,height:852});
 await page.goto('/motion-debug/#leu');
 await expect(page.locator('#leu .project-scene')).toHaveAttribute('data-film-playing','true');
 await page.evaluate(()=>{(window as unknown as {gsap:{globalTimeline:{pause():void}}}).gsap.globalTimeline.pause();});
 await expect(page.locator('[data-motion-status]')).toHaveAttribute('data-motion-status','stalled');
});

test('motion diagnostics retain an explanation when JavaScript cannot run',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:393,height:852}});
 const page=await context.newPage();
 await page.goto('/motion-debug/#leu');
 await expect(page.locator('[data-motion-status]')).toHaveText('JavaScript has not started');
 await expect(page.locator('[data-motion-report]')).toContainText('JavaScript is disabled or blocked');
 await context.close();
});

test('motion diagnostics identify missing visibility callbacks',async({page})=>{
 await page.setViewportSize({width:393,height:852});
 await page.addInitScript(()=>{
  const Original=window.IntersectionObserver;
  window.IntersectionObserver=class extends Original{
   constructor(_callback:IntersectionObserverCallback,options?:IntersectionObserverInit){super(()=>{},options);}
  };
 });
 await page.goto('/motion-debug/#leu');
 await expect(page.locator('[data-motion-status]')).toHaveAttribute('data-motion-status','no-visibility');
 await expect(page.locator('[data-motion-report]')).toContainText('"observations": []');
});

test('motion diagnostics recognize a healthy desktop layout',async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto('/motion-debug/');
 await expect(page.locator('[data-motion-status]')).toHaveAttribute('data-motion-status','desktop');
});
