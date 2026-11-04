import { test, expect } from '@playwright/test';

const preview = '/';

test('optical portfolio retains its approved project content and source policy', async ({ page }) => {
  await page.setViewportSize({width: 1440, height: 900});
  const response = await page.goto(preview, { waitUntil: 'domcontentloaded' });
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/Miguel Almeida/);
  await expect(page.locator('#work .card')).toHaveCount(4);
  await expect(page.locator('#experience')).toHaveCount(1);
  await expect(page.locator('#about')).toHaveCount(1);
  await expect(page.locator('.ola-voice')).toHaveAttribute('aria-label', /Olá/i);
  const meta = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content');
  expect(meta).toContain("default-src 'none'");
  for (const id of ['morrow', 'second-voice', 'leu', 'needle']) {
    await expect(page.locator('#toggle-' + id)).toHaveCount(1);
  }
});

test('mobile restores the full portrait and visible project previews under the header', async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto(preview,{waitUntil:'domcontentloaded'});
  await expect(page.locator('body')).not.toHaveClass(/mobile-index/);
  const stage=await page.locator('#stage').boundingBox();
  expect(stage).not.toBeNull();
  expect(stage!.width).toBeGreaterThanOrEqual(375);
  expect(stage!.height).toBeGreaterThanOrEqual(400);
  const hero=await page.locator('#hero').boundingBox();
  const work=await page.locator('#work').boundingBox();
  expect(work!.y-(hero!.y+hero!.height)).toBeLessThan(45);
  await expect(page.locator('#work .card')).toHaveCount(4);
  await expect(page.locator('#work .project-toggle')).toBeHidden();
  for(const id of ['morrow','second-voice','leu','needle']){
    await expect(page.locator('#panel-'+id+' .frame')).toBeVisible();
    await expect(page.locator('#panel-'+id)).not.toHaveAttribute('aria-hidden','true');
  }
  const sizes=await page.evaluate(()=>({viewport:document.documentElement.clientWidth,content:document.documentElement.scrollWidth}));
  expect(sizes.content).toBeLessThanOrEqual(sizes.viewport+1);
});
test('375px project film plays muted, inline and loops on arrival',async({page})=>{
  await page.setViewportSize({width:375,height:812});
  await page.goto(preview,{waitUntil:'domcontentloaded'});
  const video=page.locator('#p-morrow .media-screen video');
  await video.scrollIntoViewIfNeeded();
  await expect(video).toHaveAttribute('muted','');
  await expect(video).toHaveAttribute('loop','');
  await expect(video).toHaveAttribute('playsinline','');
  await expect.poll(()=>video.evaluate((node:HTMLVideoElement)=>!node.paused&&node.readyState>=2),{timeout:12000}).toBe(true);
});

test('footer keyboard, mobile navigation and project case studies remain available', async ({ page }) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.goto(preview, { waitUntil: 'domcontentloaded' });
  await page.locator('#burger').click();
  await expect(page.locator('#burger')).toHaveAttribute('aria-expanded', 'true');
  await page.locator('#burger').click();
  await expect(page.locator('#burger')).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#panel-leu .cap-cs')).toBeVisible();
  await page.locator('#panel-leu .cap-cs').click();
  await expect(page.locator('#csTitle')).toBeVisible();
  await page.locator('#csBack').click();
  // The native dialog animates its close for 560ms. Focus must not escape it early.
  await expect(page.locator('#cs')).toBeHidden({timeout:4000});
  await expect(page.locator('#work')).toBeVisible();
  const mail = page.locator('#frMail');
  await mail.scrollIntoViewIfNeeded();
  await mail.focus();
  await expect(mail).toBeFocused();
});

test('the Olá speaker uses a single accented word and keeps native audio accessible',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(preview,{waitUntil:'domcontentloaded'});
  const voice=page.locator('.ola-voice');
  await voice.scrollIntoViewIfNeeded();
  await expect(voice).toHaveAttribute('aria-label',/Olá/i);
  await expect(voice.locator('.ola-glyph')).toHaveCount(3);
  await expect(voice.locator('.ola-a')).toHaveCount(0);
  await expect(voice.locator('.ola-speaker')).toBeVisible();
  await voice.click();
  await expect(page.locator('#olaVoiceStatus')).toContainText(/Miguel says olá|recording could not play/i);
});
