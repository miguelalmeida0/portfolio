import {test,expect} from '@playwright/test';
for(const width of [390,1440]){
test('all Story scenes and truthful clipboard recovery '+width,async({page})=>{
 await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/story');await expect(page.locator('[data-route-shutter]')).toHaveAttribute('data-phase','idle');
 await expect(page.locator('[data-story-index]')).toHaveCount(8);
 for(const section of await page.locator('[data-story-index]').all()){
  for(const button of await section.locator('[data-story-action]').all()){await button.click();await expect(button).toBeEnabled();}
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
 }
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('Audit: denied');}}}));
 await page.locator('[data-story-copy]').click();await expect(page.locator('[data-story-copy]')).toContainText("Couldn't copy");
 expect(errors).toEqual([]);
});
test('footer keyboard contacts, clipboard and actual PDF '+width,async({page,context})=>{
 await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/#contact');await expect(page.locator('.mah[data-renderer]')).toBeVisible();
 const footer=page.locator('[data-line-m]');await footer.scrollIntoViewIfNeeded();
 for(const i of [0,1,2,3]){await page.locator('[data-stop="'+i+'"]').focus();await expect(page.locator('[data-stop="'+i+'"]')).toBeFocused();}
 await page.evaluate(()=>{
  Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('Audit: denied');}}});document.execCommand=()=>false;
  document.querySelector('[data-stop="0"]')!.addEventListener('click',e=>e.preventDefault());
 });
 await page.locator('[data-stop="0"]').click();await expect(page.locator('[data-toast]')).toContainText('Address: miguelalmeida1592@gmail.com');
 for(const i of [1,2]){await expect(page.locator('[data-stop="'+i+'"]')).toHaveAttribute('target','_blank');await expect(page.locator('[data-stop="'+i+'"]')).toHaveAttribute('rel',/noopener/);}
 const opened=context.waitForEvent('page');await page.locator('[data-stop="3"]').click();const pdf=await opened;
 await expect(pdf).toHaveURL(/\/cv\/pdf$/);
 // A popup URL commits before its scripts, styles and fonts finish loading.
 // Keep the canvas assertion separate from that document-load lifecycle.
 await pdf.waitForLoadState('load');
 await expect(pdf.locator('canvas').first()).toBeVisible();await pdf.close();
});
}
test('CV stays free of assistant overlays across desktop and landscape',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'}); await page.goto('/cv');
 for(const [width,height] of [[1440,480],[1440,320],[844,390],[768,320],[320,568],[320,320],[390,844]]){
  await page.setViewportSize({width,height}); await page.keyboard.press('Control+/');
  await expect(page.locator('[data-ask-panel], [data-ask-trigger], .metric-ask')).toHaveCount(0);
  await expect(page.getByRole('link',{name:'Open CV PDF',exact:true})).toBeVisible();
 }
});
test('scrollbar pointer drag remains usable at narrow desktop width',async({page})=>{
 await page.setViewportSize({width:390,height:900});await page.goto('/');
 await expect(page.locator('.mah[data-renderer]')).toBeVisible();const thumb=page.locator('[data-bookmark-thumb]');const r=(await thumb.boundingBox())!;
 await page.mouse.move(r.x+r.width/2,r.y+r.height/2);await page.mouse.down();await page.mouse.move(r.x+r.width/2,r.y+130,{steps:8});await page.mouse.up();
 await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(500);
 await page.getByRole('scrollbar',{name:'Scroll page'}).press('Home');await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(0);
});
