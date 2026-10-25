import {test,expect} from '@playwright/test';

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

for (const width of [320,390,430,768]) {
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
  await expect(preview.locator('.needle-question')).toBeVisible();
  await preview.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(preview).toBeFocused();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 });
}

for (const width of [320,393,768]) {
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
 for(const id of ['needle','f24','second-voice','leu']){
  const scene=page.locator(`#${id} .project-scene`);
  await scene.scrollIntoViewIfNeeded();
  await expect(scene).toHaveAttribute('data-film-playing','true');
  const before=Number(await scene.getAttribute('data-film-time'));
  await expect.poll(async()=>Number(await scene.getAttribute('data-film-time'))).not.toBe(before);
  const other=page.locator('.project-scene[data-film-playing=true]');
  await expect(other).toHaveCount(1);
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
 await expect(page.locator('.project-scene.mobile-film')).toHaveCount(0);
 await expect(toggle).toBeHidden();
 await page.setViewportSize({width:1440,height:900});
 await page.emulateMedia({reducedMotion:'no-preference'});
 await expect(page.locator('.project-scene.mobile-film')).toHaveCount(0);
});
