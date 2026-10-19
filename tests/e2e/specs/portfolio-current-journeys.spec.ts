import {test,expect,type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
async function ready(page:Page,path:string){await page.goto(path);await expect(page.locator('[data-ask-trigger]').first()).toBeEnabled();}
for(const width of [390,1440]){
 test.describe('current journeys '+width,()=>{
 test.beforeEach(async({page})=>{await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});});
 test('Needle searches, inspection, cache and windowing',async({page})=>{
  await ready(page,'/work/needle');
  const demo=page.locator('[data-needle-demo]');
  await demo.getByRole('button',{name:'a blue scarab',exact:true}).click();
  await expect(demo.locator('.inspector h3')).toHaveText('Scarab Decorated with Scrolls');
  await demo.getByRole('button',{name:'Inspect Scarab of Sebekhotep V',exact:true}).click();
  await expect(demo.locator('.inspector h3')).toHaveText('Scarab of Sebekhotep V');
  await expect(demo.getByRole('link',{name:'View the Met record'})).toHaveAttribute('href','https://www.metmuseum.org/art/collection/search/552610');
  const cache=page.locator('[data-cache-journey]');
  await cache.getByRole('button',{name:'Repeat visit'}).press('Enter');await expect(cache).toContainText('304');
  await cache.getByRole('button',{name:'New corpus'}).click();await expect(cache).toContainText('old graph cannot be reused');
  await page.locator('.pipeline-model').getByRole('button',{name:'Older reply'}).click();
  await expect(page.locator('.pipeline-model')).toContainText('Discard stale response');
  await page.getByRole('button',{name:'Jump to middle'}).click();
  await expect(page.locator('[data-window-model] [data-record]').first()).toHaveAttribute('data-record','4996');
  expect(await page.locator('[data-window-model] [data-record]').count()).toBeLessThan(40);
 });
 test('F24 filters, state recovery, and duplicate save protection',async({page})=>{
  await ready(page,'/work/f24');const state=page.locator('#states');
  await state.getByRole('searchbox',{name:'Search activity'}).fill('Power outage');
  await expect(state.locator('.hist-row')).toHaveCount(3);
  await state.getByRole('radio',{name:'Failed',exact:true}).check();await expect(state.locator('.hist-row')).toHaveCount(1);
  await state.getByRole('radio',{name:'Error',exact:true}).check();await state.getByRole('button',{name:'Retry',exact:true}).click();
  await expect(state.getByRole('searchbox')).toHaveValue('Power outage');await expect(state.locator('.hist-row')).toHaveCount(1);
  await state.locator('.hist-row').click();await expect(state.locator('.hist-det')).toContainText('Root cause');
  await state.getByRole('radio',{name:'Empty',exact:true}).check();await state.locator('#hist').getByRole('button',{name:'Clear filters',exact:true}).click();
  await expect(state.locator('.hist-row')).toHaveCount(8);
  const widget=page.locator('#testing');await widget.getByRole('textbox',{name:'Name',exact:true}).fill('Audit example');
  await widget.getByRole('button',{name:'Double-click Save',exact:true}).click();
  await expect(widget.locator('#tReqs')).toHaveText('1');await expect(widget.locator('#tRes')).toContainText('Two clicks, one request.');
  await widget.getByRole('radio',{name:'Offline',exact:true}).check();await widget.getByRole('button',{name:'Save',exact:true}).click();
  await expect(widget.locator('#tRes')).toContainText("You're offline");
  await expect(widget.getByRole('textbox',{name:'Name',exact:true})).toHaveValue('Audit example');
  await expect(widget.getByRole('button',{name:'Save',exact:true})).toBeFocused();
 });
 test('Flow proposal, commit, undo, redo, reset and rollback',async({page})=>{
  await ready(page,'/work/flow');const demo=page.locator('#demo'),review=demo.locator('.ev[data-id="review"]');
  await demo.getByRole('button',{name:'Clean: Move design review to 1:30pm.',exact:true}).click();
  await expect(review).toHaveAttribute('aria-label','Design review, 10:00-11:00');
  await demo.getByRole('button',{name:'Yes',exact:true}).click();
  await expect(review).toHaveAttribute('aria-label','Design review, 13:30-14:30');
  await demo.getByRole('button',{name:'Undo',exact:true}).click();await expect(review).toHaveAttribute('aria-label','Design review, 10:00-11:00');
  await demo.getByRole('button',{name:'Redo',exact:true}).click();await expect(review).toHaveAttribute('aria-label','Design review, 13:30-14:30');
  await demo.getByRole('button',{name:'Reset day',exact:true}).click();await expect(review).toHaveAttribute('aria-label','Design review, 10:00-11:00');
  await demo.getByRole('checkbox',{name:'Make the second operation fail'}).check();
  await demo.getByRole('button',{name:/^Compound:/}).click();
  const yes=demo.getByRole('button',{name:'Yes',exact:true});if(await yes.count())await yes.click();
  await expect(demo.locator('#log')).toContainText(/failed|rejected|Nothing changed|rolled back/i);
  await expect(review).toHaveAttribute('aria-label','Design review, 10:00-11:00');
  await page.getByRole('button',{name:'What the conversation does',exact:true}).click();
  await expect(page.locator('#lat .lrow[data-g="talk"]').first()).toBeVisible();
 });
 test('Leu platform screens and source-grounded reading loop',async({page})=>{
  await ready(page,'/work/leu');const gallery=page.getByRole('region',{name:'Leu across phone and browser'});
  await gallery.getByRole('button',{name:'Desktop',exact:true}).click();
  for(const label of ['Home','Library','Read','Explain','Tell it back','Study']){
   const button=gallery.getByRole('group',{name:'Choose a desktop screen'}).getByRole('button',{name:label,exact:true});
   await button.click();await expect(button).toHaveAttribute('aria-pressed','true');
   await expect.poll(()=>gallery.locator('.browser-stage img').evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth===2048)).toBe(true);
  }
  await gallery.getByRole('button',{name:'Phone',exact:true}).click();await gallery.getByRole('button',{name:'Read',exact:true}).click();
  await expect(gallery.getByRole('img',{name:'Leu on iPhone: Read',exact:true})).toBeVisible();
  const loop=page.getByRole('region',{name:'Interactive reading loop'});
  await loop.locator('#psg-p1').click();await expect(loop.locator('.ans')).toHaveCount(3);
  await loop.locator('.ans').nth(1).click();await expect(loop.locator('.verdict')).toHaveText('Ask a follow-up. No mastery.');
  await loop.locator('.ans').first().click();await expect(loop.locator('.verdict')).toHaveText('Credit. Evidence recorded.');
  await loop.getByRole('button',{name:'Show source',exact:true}).first().click();await expect(loop.locator('#psg-p1')).toBeFocused();
  await loop.getByRole('button',{name:'Clear',exact:true}).click();await expect(loop.locator('.ans')).toHaveCount(0);
 });
 test('Second Voice preserves submitted state and sharing stays explicit',async({page})=>{
  await ready(page,'/work/second-voice');const w=page.getByRole('region',{name:'Rewrite workspace'});
  const baseline=await w.locator('#resultTag').innerText();
  await w.getByRole('radio',{name:'Spare',exact:true}).check();await w.getByRole('radio',{name:'Light',exact:true}).check();
  await expect(w.locator('#resultTag')).toHaveText(baseline);
  await w.getByRole('button',{name:'Rewrite',exact:true}).click();await expect(w.locator('#resultTag')).toHaveText('Spare, light');
  for(const mode of ['Original','Changes','Rewrite']){await w.getByRole('radio',{name:mode,exact:true}).check();await expect(w.locator('#mv')).toHaveAttribute('data-mode',mode==='Changes'?'marked':mode.toLowerCase());}
  const share=page.locator('#privacy');
  await share.getByRole('button',{name:'Share this rewrite',exact:true}).click();await share.getByRole('button',{name:'Cancel',exact:true}).click();
  await expect(share.locator('#visPill')).toHaveText('Private');
  await share.getByRole('button',{name:'Share this rewrite',exact:true}).click();await share.getByRole('button',{name:'Simulate public link',exact:true}).click();
  await expect(share.locator('#visPill')).toHaveText('Public');await share.getByRole('button',{name:'Make private again',exact:true}).click();
  await expect(share.locator('#visPill')).toHaveText('Private');
  expect((await new AxeBuilder({page}).include('#try').include('#privacy').analyze()).violations).toEqual([]);
 });
 test('all case study chapters and the complete next-project tour',async({page})=>{
  await ready(page,'/work/f24');
  for(const slug of ['f24','needle','second-voice','leu','flow']){
   await expect(page).toHaveURL(new RegExp('/work/'+slug+'(?:#.*)?$'));
   if(!page.url().includes('/work/'))break;
   const picker=page.getByRole('combobox',{name:'Case study chapter'});
   if(await picker.isVisible()){
    const values=await picker.locator('option').evaluateAll(es=>es.map(e=>(e as HTMLOptionElement).value));
    for(const id of values){await picker.selectOption(id);await expect(page).toHaveURL(new RegExp('#'+id+'$'));await expect(page.locator('#'+id).first()).toBeVisible();}
   }else{
    for(const link of await page.locator('#pnav ul a').all()){await link.click();const href=await link.getAttribute('href');await expect(page).toHaveURL(new RegExp(href+'$'));}
   }
   const next=page.locator('nav.next a');const href=await next.getAttribute('href');await next.click();await expect(page).toHaveURL(new RegExp(href!.replace('#','\\#')+'$'));
  }
  await expect(page).toHaveURL(/\/#work$/);
  await expect(page.locator('#work')).toBeVisible();
 });
 });
}
