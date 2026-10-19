import {expect,test} from '@playwright/test';
test.beforeEach(async({page})=>{await page.addInitScript(()=>sessionStorage.setItem('seen-intro','true'));});
test('diff modes expose a coherent accessible sentence',async({page})=>{
 await page.goto('/work/second-voice');
 const view=page.getByRole('radiogroup',{name:'View',exact:true});
 await view.getByRole('radio',{name:'Original',exact:true}).click();
 const original=await page.locator('#draftText').textContent();
 expect((await page.locator('#mv').ariaSnapshot()).replace(/\s+/g,' ')).toContain(original!.replace(/\s+/g,' '));
 await view.getByRole('radio',{name:'Rewrite',exact:true}).click();
 const result=await page.locator('#mv .diff-accessible').textContent();
 expect(result).not.toEqual(original);
 await expect(page.locator('#mv [aria-hidden="true"]')).not.toHaveCount(0);
});
test('case chapters remain operable on a phone',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/work/f24');
 await page.getByRole('combobox',{name:'Case study chapter'}).selectOption('testing');
 await expect(page).toHaveURL(/#testing$/);await expect(page.locator('#testing')).toBeFocused();
 const y=await page.locator('#testing').evaluate(el=>el.getBoundingClientRect().top);
 expect(y).toBeGreaterThanOrEqual(120);expect(y).toBeLessThan(220);
});
test('F24 explanations stay stable until Play, then pause when focus enters the panel',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/work/f24');await page.locator('#try').scrollIntoViewIfNeeded();
 const initial=await page.locator('#sitT').textContent();await page.waitForTimeout(2700);await expect(page.locator('#sitT')).toHaveText(initial!);
 await page.getByRole('button',{name:'Play walkthrough',exact:true}).click();
 await page.locator('#sitPanel').focus();const focused=await page.locator('#sitT').textContent();
 await page.waitForTimeout(2700);await expect(page.locator('#sitT')).toHaveText(focused!);
});
test('OS and manual reduced motion disable Flow and Leu transitions',async({page})=>{
 for(const [path,selector] of [['/work/flow','.ev'],['/work/leu','.fill']]){
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto(path);
  expect(await page.locator(selector).first().evaluate(el=>getComputedStyle(el).transitionDuration)).toBe('0s');
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.evaluate(()=>document.documentElement.dataset.motion='reduced');
  expect(await page.locator(selector).first().evaluate(el=>getComputedStyle(el).transitionDuration)).toBe('0s');
 }
});
test('plain slash stays native while a modified shortcut opens Ask',async({page})=>{
 await page.goto('/hero-lab/typographic/cv');await expect(page.locator('[data-ask-trigger]').first()).toBeEnabled();
 await page.keyboard.press('/');await expect(page.locator('[data-ask-panel]')).toHaveCount(0);
 await page.keyboard.press('Control+/');await expect(page.locator('[data-ask-panel]')).toBeVisible();
 await page.getByRole('textbox',{name:'Type your own question'}).fill('How much experience does Miguel have?');
 await page.keyboard.press('Control+/');await expect(page.getByRole('textbox')).toHaveValue('How much experience does Miguel have?');
});
test('sharing clearly remains a local example with no publication request',async({page})=>{
 await page.goto('/work/second-voice');const requests:string[]=[];page.on('request',r=>{if(r.method()==='POST')requests.push(r.url());});
 await expect(page.locator('#privacy')).toContainText('Nothing is published');
 await page.getByRole('button',{name:'Share this rewrite',exact:true}).click();await page.getByRole('button',{name:'Simulate public link',exact:true}).click();
 await expect(page.locator('#linkline')).toHaveText(/Example public-link state/);expect(requests).toEqual([]);
});

