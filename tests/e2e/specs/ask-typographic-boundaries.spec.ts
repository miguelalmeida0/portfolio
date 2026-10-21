import { expect, test } from '@playwright/test';
import { loadLocalTs } from '../../../scripts/lib/load-local-ts.mjs';

// Reconstruct only authored local facts. These regressions never call a paid provider.
type AnswerModule = Pick<typeof import('$lib/miguel-llm/askConversation'), 'prepareAskAnswer' | 'assembleAskAnswer'>;
let answers: AnswerModule;
test.beforeAll(async () => { answers = await loadLocalTs<AnswerModule>('src/lib/miguel-llm/askConversation.ts'); });
test.beforeEach(async ({ page }) => {
  await page.route('**/api/ask', async route => {
    const { question, history, area } = route.request().postDataJSON();
    await route.fulfill({ json: { question, steps: [], knowledge: answers.assembleAskAnswer(answers.prepareAskAnswer(question, history, area)) } });
  });
});

for (const width of [390, 768]) for (const reducedMotion of ['reduce', 'no-preference'] as const) {
  test(`Index owns shortcuts and restores Ask focus at ${width}px with ${reducedMotion}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion });
    await page.goto('/cv');
    const index = page.getByRole('button', { name: 'Index', exact: true });
    const dialog = page.getByRole('dialog', { name: 'Site index' });
    const input = page.getByRole('textbox', { name: 'Type your own question' });
    await index.click();
    await dialog.getByRole('button', { name: 'Close', exact: true }).focus();
    for (const shortcut of ['Control+/', 'Meta+/']) {
      await page.keyboard.press(shortcut);
      await expect(dialog).toBeVisible();
      await expect(page.locator('[data-ask-panel]')).toHaveCount(0);
    }
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(index).toBeFocused();
    for (const closeWith of ['escape', 'button']) {
      await index.click();
      await dialog.getByRole('button', { name: 'Ask MiguelLLM', exact: true }).click();
      await expect(dialog).not.toBeVisible();
      await expect(input).toBeFocused();
      if (closeWith === 'escape') await input.press('Escape');
      else await page.getByRole('button', { name: 'Close LLM' }).click();
      await expect(page.locator('[data-ask-panel]')).toHaveCount(0);
      await expect(index).toBeFocused();
    }
    await page.keyboard.press('Control+/');
    await expect(input).toBeFocused();
  });
}

test('Flow conversation survives navigation while this project resolves to the active Leu case', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/work/flow');
  await page.locator('[data-ask-trigger]:visible').click();
  const input = page.getByRole('textbox', { name: 'Type your own question' });
  await input.fill('What went wrong in Flow?'); await input.press('Enter');
  await expect(page.locator('.ask-sources a').first()).toHaveAttribute('href', '/work/flow');
  const previous = await page.locator('[data-ask-knowledge]').innerText();
  await input.press('Escape');
  await page.getByRole('navigation', { name: 'Main navigation', exact: true }).getByRole('link', { name: 'Work', exact: true }).click();
  await page.locator('a[href="/work/leu"]').first().click();
  await expect(page).toHaveURL(/\/work\/leu$/);
  await page.locator('[data-ask-trigger]:visible').click();
  await expect(page.locator('[data-ask-knowledge]')).toHaveText(previous, { useInnerText: true });
  await input.fill('What went wrong in this project?'); await input.press('Enter');
  await expect(page.locator('.ask-sources a').first()).toHaveAttribute('href', '/work/leu');
  await expect(page.locator('[data-ask-knowledge]')).not.toContainText('During arrangeDay');
});

for(const width of [390,1440]) for(const reduced of [false,true]) for(const method of ['button','Escape'])
 test(`Ask functional ${method} dismissal at ${width} reduced=${reduced}`,async({page},info)=>{
  await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:reduced?'reduce':'no-preference'});
  await page.goto('/cv');await expect(page.locator('[data-ask-trigger]').first()).toBeEnabled();
  await page.keyboard.press('Control+/');const input=page.getByRole('textbox',{name:'Type your own question'});await expect(input).toBeFocused();
  if(method==='button')await expect(page.getByRole('button',{name:'Close LLM'})).toHaveCSS('opacity','1');
  const duration=await page.evaluate(method=>new Promise<number>(resolve=>{
   const start=performance.now();const observer=new MutationObserver(()=>{if(document.querySelector('[data-ask-panel]'))return;observer.disconnect();resolve(performance.now()-start);});
   observer.observe(document.body,{childList:true,subtree:true});
   if(method==='button')(document.querySelector('.ask-close') as HTMLButtonElement).click();
   else(document.querySelector('.ask-form input') as HTMLInputElement).dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));
  }),method);
  expect(duration).toBeLessThan(reduced?200:450);
  if(!reduced)expect(duration).toBeGreaterThanOrEqual(170);
  await expect(page.locator('[data-ask-panel]')).toHaveCount(0);
  const focused=await page.evaluate(()=>({trigger:document.activeElement?.hasAttribute('data-ask-trigger'),index:document.activeElement?.textContent}));
  expect(focused.trigger||focused.index?.trim()==='Index').toBeTruthy();
  await info.attach('approximate-dismissal-ms.json',{body:JSON.stringify({duration,method,reduced}),contentType:'application/json'});
 });

for(const reduced of [false,true]) test('Ask immediate reopen and repeated intent keep one active panel reduced='+reduced,async({page})=>{
 await page.emulateMedia({reducedMotion:reduced?'reduce':'no-preference'});await page.goto('/cv');
 await expect(page.locator('[data-ask-trigger]').first()).toBeEnabled();await page.keyboard.press('Control+/');
 const input=page.getByRole('textbox',{name:'Type your own question'});await expect(input).toBeFocused();
 await page.evaluate(()=>{
  const input=document.querySelector('.ask-form input')!;
  for(let i=0;i<4;i++){
   input.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));
   window.dispatchEvent(new CustomEvent('ask:open'));
  }
 });
 await expect(input).toBeFocused();await expect(page.locator('[data-ask-panel]')).toHaveCount(1);
 await expect(page.locator('[data-ask-panel]')).not.toHaveAttribute('inert','');
 // Observe past every obsolete entrance/exit callback, not just the next tick.
 await page.waitForTimeout(2700);await expect(input).toBeFocused();await expect(page.locator('[data-ask-panel]')).toHaveCount(1);
});

test('Ask close during loading aborts old content and never steals reopened focus',async({page})=>{
 let release!:()=>void;const gate=new Promise<void>(resolve=>release=resolve);let requested!:()=>void;const started=new Promise<void>(resolve=>requested=resolve);
 await page.route('**/api/ask',async route=>{requested();await gate;await route.fulfill({json:{question:'OLD QUESTION',steps:[],knowledge:null}}).catch(()=>{});});
 await page.goto('/cv');await expect(page.locator('[data-ask-trigger]').first()).toBeEnabled();await page.keyboard.press('Control+/');
 const input=page.getByRole('textbox',{name:'Type your own question'});await input.fill('What is your stack?');await input.press('Enter');await started;
 await input.press('Escape');await page.keyboard.press('Control+/');await expect(input).toBeFocused();release();
 await expect(page.locator('.ask-answer')).not.toHaveClass(/loading/);
 await expect(page.locator('.ask-answer')).not.toContainText('OLD QUESTION');
 await page.waitForTimeout(2700);await expect(input).toBeFocused();
});

test('Ask route dismissal clears panel and obsolete exit focus',async({page})=>{
 await page.setViewportSize({width:1440,height:900});await page.goto('/');
 await expect(page.locator('.mah')).toHaveAttribute('data-renderer',/webgl|fallback/);
 await page.getByRole('navigation',{name:'Main navigation',exact:true}).getByRole('link',{name:'CV',exact:true}).click();
 await expect(page).toHaveURL(/\/cv$/);await expect(page.locator('[data-route-shutter]')).toHaveAttribute('data-phase','idle');
 await page.keyboard.press('Control+/');await expect(page.getByRole('textbox',{name:'Type your own question'})).toBeFocused();
 // Annotated links intentionally answer in Ask; native Back is independent navigation.
 await page.goBack();await expect(page).toHaveURL(/\/$/);await expect(page.locator('[data-route-shutter]')).toHaveAttribute('data-phase','idle');
 await expect(page.locator('[data-ask-panel]')).toHaveCount(0);
 const destination=page.getByRole('button',{name:'Frontend engineer',exact:true});await destination.focus();
 await page.waitForTimeout(2700);await expect(destination).toBeFocused();
});
