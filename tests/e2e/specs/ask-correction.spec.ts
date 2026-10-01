import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test.beforeEach(async ({page}) => {
  await page.setViewportSize({width:1440,height:1020});
  await page.addInitScript(()=>sessionStorage.setItem('seen-intro','true'));
  await page.goto('/'); await expect(page.locator('[data-ask-trigger]').first()).toBeEnabled();
});
for(const [id,words] of [
  ['role',['product-design','F24','Second Voice','recovery']],
  ['stack',['2022','2026','React','Svelte','Second Voice','Flow','architecture']],
  ['f24',['product, design, backend and QA','migration','production']],
  ['quality',['Playwright','focus','keyboard','pagination','retry']],
  ['w-sv',['author','strength','React','TypeScript','request','designed']],
  ['w-leu',['SwiftUI','PDFKit','Teach It Back','on the device','source']],
  ['city',['Berlin','Remote','F24']]
] as const) test(`clicking ${id} rewards the visitor with documented context`,async({page})=>{
  await page.keyboard.press('/');
  const area=page.locator(`[data-ask-id="${id}"]`); const clicked=await area.innerText();
  await area.click(); const answer=page.locator('[data-ask-knowledge]');
  await expect(answer).toBeVisible();
  for(const word of words) await expect(answer).toContainText(word);
  expect((await answer.innerText()).length).toBeGreaterThan(clicked.length * 2);
  await expect(page.locator('.ask-sources a').first()).toBeVisible();
  await expect(page.locator('.ask-flag')).toHaveCount(1);
});
test('typed questions use knowledge beyond visible sources and reject invented explanation',async({page})=>{
  for(const [question,expected] of [
    ['What did Miguel do at F24?','migration'],
    ['What is his strongest frontend experience?','product, design, backend and QA'],
    ['How much React experience does he have?','not four years of React'],
    ['What did he own in Second Voice?','request'],
    ['What kind of engineer is he?','product-design'],
    ['What has he built in Swift?','PDFKit']
  ]) {
    const res=await page.request.post('/api/ask',{data:{question,areas:{}}}); expect(res.ok()).toBe(true);
    const body=await res.json(); expect(body.steps).toEqual([]);
    expect(JSON.stringify(body.knowledge)).toContain(expected);
  }
  await page.keyboard.press('/');
  const input=page.getByRole('textbox',{name:'Type your own question'});
  await input.fill('What has he built in Swift?'); await input.press('Enter');
  await expect(page.locator('[data-ask-knowledge]')).toContainText('Teach It Back');
  await page.route('**/api/ask',route=>route.fulfill({json:{question:'What is his stack?',knowledge:{paragraphs:['Miguel has ten years of Rust.'],bullets:[],sources:['Résumé|/cv']},steps:[{lead:'',source:'stack',quote:'React'}]}}));
  await input.fill('What is his stack?'); await input.press('Enter');
  await expect(page.locator('[data-ask-answer]')).toContainText('not established');
  await expect(page.locator('[data-ask-knowledge]')).toHaveCount(0);
  await expect(page.locator('.ask-flag')).toHaveCount(0);
});
test('portrait stays recognisable on the right and returns without drift over ten cycles',async({page})=>{
  test.setTimeout(60000);
  await page.locator('.portrait').evaluate((img:HTMLImageElement)=>img.decode());
  const photo=page.locator('.portrait'),card=page.locator('.portrait-card');
  const home=(await photo.boundingBox())!, bounds=(await card.boundingBox())!;
  const src=await photo.evaluate((img:HTMLImageElement)=>img.currentSrc);
  for(let i=0;i<10;i++) {
    await page.keyboard.press('/'); await expect(photo).toHaveCSS('opacity','0.16');
    const rect=(await photo.boundingBox())!;
    expect(rect.y).toBe(home.y); expect(rect.height).toBe(home.height); expect(rect.width).toBe(home.width);
    const visible=bounds.x+bounds.width-rect.x;
    expect(visible/rect.width).toBeCloseTo(.56,2);
    const answer=(await page.locator('.ask-panel').boundingBox())!;
    expect(answer.x+answer.width+15).toBeLessThanOrEqual(rect.x);
    expect(rect.x+rect.width*.5).toBeLessThan(bounds.x+bounds.width);
    await page.keyboard.press('Escape'); await expect(page.locator('[data-ask-panel]')).toHaveCount(0);
    expect(await photo.boundingBox()).toEqual(home);
    await expect(photo).toHaveCSS('opacity','1');
    expect(await photo.evaluate((img:HTMLImageElement)=>img.currentSrc)).toBe(src);
    expect(await photo.getAttribute('style')).not.toContain('--ask-photo-x');
  }
});
test('rich answers retain whole-page accessibility',async({page})=>{
  await page.keyboard.press('/'); await page.getByRole('button',{name:'His stack',exact:true}).click();
  await expect(page.locator('[data-ask-announcement]')).toContainText('2026');
  const result=await new AxeBuilder({page}).analyze(); expect(result.violations.map(v=>v.id)).toEqual([]);
});
