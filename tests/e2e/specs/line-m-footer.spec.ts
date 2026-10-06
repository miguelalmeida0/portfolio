import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.use({ viewport: { width: 1920, height: 963 }, permissions: ['clipboard-read','clipboard-write'] });
const footer = '[data-line-m]';
const stop = (i: number) => `[data-stop="${i}"]`;
const here = (page: Page) => page.locator('[data-stop] > span:first-child').evaluateAll(nodes => nodes.findIndex(n => getComputedStyle(n).backgroundColor === 'rgb(91, 21, 60)'));
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('seen-intro','true'));
  await page.goto('/#contact');
  await expect(page.locator('[data-ask-trigger]').first()).toBeEnabled();
  await page.locator(footer).scrollIntoViewIfNeeded(); await page.mouse.move(5,5);
});

test('all four real contacts are visible and the PDF is valid', async ({ page, request }) => {
  await expect(page.locator(footer)).toContainText('Take Line M to Miguel.');
  for(const text of ['miguelalmeida1592@gmail.com','LinkedIn','GitHub','Résumé','One page, PDF','You are here']) await expect(page.locator(footer)).toContainText(text);
  await expect(page.locator('[data-stop]')).toHaveCount(4);
  expect(await page.locator(footer).innerText()).not.toMatch(/\d\d:\d\d/);
  const pdf = await request.get('/portfolio.pdf'); expect(pdf.ok()).toBe(true); expect((await pdf.body()).subarray(0,5).toString()).toBe('%PDF-');
});
test('idle service visits Email, LinkedIn and GitHub in order and opens doors', async ({ page }) => {
  for(const i of [0,1,2]) await expect.poll(()=>here(page),{timeout:5000}).toBe(i);
  await expect.poll(()=>page.locator('[data-train] > div > div > span:nth-child(2)').first().evaluate(el=>getComputedStyle(el,'::before').transform)).not.toBe('none');
});
test('hover dispatch reverses and engagement permanently stops idle service', async ({ page }) => {
  await page.locator(stop(3)).hover(); await expect.poll(()=>here(page)).toBe(3);
  await page.locator(stop(0)).hover(); await expect.poll(()=>here(page)).toBe(0);
  await expect(page.locator('[data-train] > div')).toHaveCSS('transform','matrix(-1, 0, 0, 1, 0, 0)');
  await page.mouse.move(5,5); await page.waitForTimeout(4000); expect(await here(page)).toBe(0);
});
test('Tab follows four stations in order, excludes the duplicate board and dispatches',async({page})=>{
  await page.locator(stop(0)).focus();
  for(const i of [0,1,2,3]) {
    if(i) await page.keyboard.press('Tab');
    await expect(page.locator(stop(i))).toBeFocused();
    await expect.poll(()=>here(page)).toBe(i);
    await expect(page.locator(`${stop(i)} > span:nth-child(2)`)).toHaveCSS('outline-style','solid');
  }
  for(const row of await page.locator('[data-dep]').all()) await expect(row).toHaveAttribute('tabindex','-1');
});
for(const [i,url] of [[1,'https://www.linkedin.com/in/miguelalmeida1/'],[2,'https://github.com/miguelalmeida0']] as const) {
  test(`station ${i} opens its real destination once in a new tab`,async({page,context})=>{
    const link=page.locator(stop(i)); await expect(link).toHaveAttribute('href',url); await expect(link).not.toHaveAttribute('download');
    const destination=new URL(url,page.url()).href;
    await context.route(destination,route=>route.fulfill({contentType:'text/html',body:'<title>Contact destination</title>'}));
    const original=page.url(); const opened=context.waitForEvent('page'); await link.click(); const tab=await opened;
    await tab.waitForURL(destination); expect(page.url()).toBe(original); await tab.close();
  });
}
test('resume opens in a new tab', async ({ page, context }) => {
  const link = page.locator(stop(3));
  await expect(link).toHaveAttribute('href', '/cv/pdf');
  await expect(link).toHaveAttribute('target', '_blank');
  // Verify navigation independently of the browser PDF viewer.
  await context.route('**/cv/pdf', route => route.fulfill({ contentType: 'text/html', body: '<h1>Resume PDF destination</h1>' }));
  const original = page.url();
  const opened = page.waitForEvent('popup');
  await link.click();
  const popup = await opened;
  await expect(popup).toHaveURL(/\/cv\/pdf$/);
  expect(page.url()).toBe(original);
  await popup.close();
});
test('email click copies, preserves native mailto and confirms the result',async({page})=>{
  await page.evaluate(()=>navigator.clipboard.writeText(''));
  await expect(page.locator(stop(0))).toHaveAttribute('href','mailto:miguelalmeida1592@gmail.com');
  await page.evaluate(()=>document.querySelector('[data-stop="0"]')!.addEventListener('click',event=>{(window as any).__mailPrevented=event.defaultPrevented;event.preventDefault();}));
  await page.locator(stop(0)).click(); await expect(page.locator('[data-toast]')).toContainText('Address copied');
  expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe('miguelalmeida1592@gmail.com');
  expect(await page.evaluate(()=>(window as any).__mailPrevented)).toBe(false);
});
test('clipboard denial gives the address without claiming it was copied',async({page})=>{
  await page.evaluate(()=>{
    navigator.clipboard.writeText=async()=>{throw new Error('denied');}; document.execCommand=()=>false;
    document.querySelector('[data-stop="0"]')!.addEventListener('click',event=>event.preventDefault());
  });
  await page.locator(stop(0)).click(); await expect(page.locator('[data-toast]')).toHaveText('Opening your mail app. Address: miguelalmeida1592@gmail.com');
});
test('reduced motion has no idle, travel, door or blink animations',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'}); await page.reload(); await page.locator(footer).scrollIntoViewIfNeeded();
  await page.waitForTimeout(3000); expect(await here(page)).toBe(-1);
  await page.locator(stop(2)).hover(); await expect.poll(()=>here(page)).toBe(2);
  expect(await page.locator(footer).evaluate(el=>el.getAnimations({subtree:true}).length)).toBe(0);
  await expect.poll(()=>page.locator('[data-train] > div > div > span:nth-child(2)').first().evaluate(el=>getComputedStyle(el,'::before').transform)).toBe('none');
});
test('offscreen and hidden footer stop service until it becomes visible',async({page})=>{
  await page.evaluate(()=>scrollTo(0,0)); await page.waitForTimeout(3500);
  const pos=await page.locator('[data-train]').getAttribute('style'); await page.waitForTimeout(3000);
  expect(await page.locator('[data-train]').getAttribute('style')).toBe(pos);
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{value:true,configurable:true});document.dispatchEvent(new Event('visibilitychange'));});
  await page.locator(footer).scrollIntoViewIfNeeded(); await page.waitForTimeout(3000);
  expect(await page.locator('[data-train]').getAttribute('style')).toBe(pos);
  await page.evaluate(()=>{delete (document as any).hidden;document.dispatchEvent(new Event('visibilitychange'));});
  await expect.poll(()=>here(page),{timeout:5000}).toBe(0);
});
for(const width of [1920,1440,1100,834,390,375]) test(`layout, typography and accessibility at ${width}`,async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'}); await page.setViewportSize({width,height:width<900?844:1020});
  await page.locator(footer).scrollIntoViewIfNeeded();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const boxes=await page.locator('[data-stop]').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().toJSON()));
  for(const box of boxes) {expect(box.x).toBeGreaterThanOrEqual(0);expect(box.right).toBeLessThanOrEqual(width);}
  const line=await page.getByRole('navigation',{name:'Contact Miguel'}).boundingBox();
  expect(line!.height>line!.width).toBe(width<900);
  await expect(page.locator(`${footer} p`).first()).toHaveCSS('font-style','normal');
  const axe=await new AxeBuilder({page}).include(footer).analyze();expect(axe.violations.map(v=>v.id)).toEqual([]);
});
test('desktop geometry retains the handoff line, train and station positions',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'}); await page.reload(); await page.locator(footer).scrollIntoViewIfNeeded();
  const root=(await page.locator(footer).boundingBox())!, line=(await page.getByRole('navigation',{name:'Contact Miguel'}).boundingBox())!;
  expect(root.height).toBe(640);expect(line.x-root.x).toBe(170);expect(line.y-root.y).toBe(452);expect(line.height).toBe(12);
  const train=(await page.locator('[data-train]').boundingBox())!;expect(train.width).toBe(200);expect(train.height).toBe(58);
  for(const [i,at] of [16,39,62,85].entries()) {
    const ring=(await page.locator(`${stop(i)} > span:first-child`).boundingBox())!;
    expect(ring.x+ring.width/2).toBeCloseTo(line.x+line.width*at/100,0);
  }
});
