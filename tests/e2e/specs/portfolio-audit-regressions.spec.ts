import { test, expect } from '@playwright/test';
const home='/#top';
for(const width of [390,1440]) test('history interrupts a forward shutter at '+width, async({page})=>{
 await page.setViewportSize({width,height:900});
 await page.goto(home); await expect(page.locator('.mah[data-renderer]')).toBeVisible();
 await page.locator('.mah-btn').click();
 await page.waitForURL('**/cv');
 await page.goBack({waitUntil:'networkidle'});
 await page.waitForTimeout(1800);
 await expect(page).toHaveURL(/\/#top$/);
 await expect(page.locator('.mah')).toBeVisible();
 await expect(page.locator('[data-route-shutter]')).toHaveAttribute('data-phase','idle');
 await expect(page.locator('#portfolio-content')).not.toHaveAttribute('inert','');
 await page.goForward(); await expect(page.locator('h1')).toContainText('Experience');
 await expect(page.locator('[data-route-shutter]')).toHaveAttribute('data-phase','idle');
});
test('Ask stays usable as a mobile viewport shrinks',async({page})=>{
 await page.setViewportSize({width:390,height:844}); await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto(home); await expect(page.locator('.mah[data-renderer]')).toBeVisible();
 await page.getByRole('button',{name:'Index',exact:true}).click();
 await page.locator('#d1-index').getByRole('button',{name:'Ask MiguelLLM',exact:true}).click();
 await expect(page.getByRole('textbox',{name:'Type your own question'})).toBeVisible();
 for(const height of [568,480,420,320,844]){
  await page.setViewportSize({width:390,height});
  await expect.poll(async()=>page.locator('.ask-form input').evaluate(e=>e.getBoundingClientRect().bottom<=innerHeight)).toBe(true);
  await expect.poll(async()=>page.locator('.ask-answer-scroll').evaluate(e=>e.getBoundingClientRect().height)).toBeGreaterThanOrEqual(60);
 }
 await page.getByRole('textbox',{name:'Type your own question'}).fill('Hi');
 await page.getByRole('button',{name:'Ask your question',exact:true}).click();
 await expect(page.locator('.ask-answer')).toContainText(/Hi|Hello|Hey/i);
 await page.keyboard.press('Escape'); await expect(page.locator('.ask-panel')).not.toBeVisible();
});
test('project video control receives pointer input beside the scrollbar',async({page})=>{
 await page.setViewportSize({width:390,height:900}); await page.goto(home);
 await expect(page.locator('.mah[data-renderer]')).toBeVisible();
 const pause=page.getByRole('button',{name:'Pause project videos',exact:true});
 await pause.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));
 await expect.poll(()=>pause.evaluate(e=>{const r=e.getBoundingClientRect();return e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));})).toBe(true);
 await pause.click(); await expect(page.getByRole('button',{name:'Play project videos',exact:true})).toBeVisible();
 const rail=page.getByRole('scrollbar',{name:'Scroll page'});
 await rail.focus(); await page.keyboard.press('Home'); await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(0);
 await page.keyboard.press('PageDown'); await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(400);
});