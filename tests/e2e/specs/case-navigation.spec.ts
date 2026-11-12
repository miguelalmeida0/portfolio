import {test,expect,type Page} from '@playwright/test';

const caseLink = (page: Page, slug: string) => page.locator(`.cap-cs[href="/case/${slug}/"]`);
async function opened(page: Page, slug: string) {
  await expect(page).toHaveURL(new RegExp('/case/'+slug+'/$'));
  await expect(page.locator('#cs')).toBeVisible();
  await expect(page.locator('#csBack')).toContainText('< Back to home');
}
async function home(page: Page) {
  await expect(page.locator('#cs')).toBeHidden();
  await expect(page).not.toHaveURL(/\/case\//);
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(300);
}
for (const width of [1440,390]) {
 test(`browser history and UI return preserve project position at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});
  await page.goto('/');
  const link=caseLink(page,'needle');
  await link.scrollIntoViewIfNeeded();
  const y=await page.evaluate(()=>scrollY);
  await link.click(); await opened(page,'needle');
  await page.goBack(); await home(page);
  expect(Math.abs(await page.evaluate(()=>scrollY)-y)).toBeLessThan(4);
  await page.goForward(); await opened(page,'needle');
  await page.reload(); await opened(page,'needle');
  await page.locator('#csBack').click(); await home(page);
  expect(Math.abs(await page.evaluate(()=>scrollY)-y)).toBeLessThan(4);
  await expect(link).toBeFocused();
  await expect.poll(()=>page.evaluate(()=>history.scrollRestoration)).toBe('auto');
 });
}
test('next-case history returns to its original project',async({page})=>{
 await page.goto('/');
 const link=caseLink(page,'morrow');await link.scrollIntoViewIfNeeded();
 const y=await page.evaluate(()=>scrollY);
 await link.click();await opened(page,'morrow');
 await page.locator('#csNext').click();await opened(page,'second-voice');
 await expect(page.locator('#csTitle')).toContainText('Second Voice');
 await page.goBack();await opened(page,'morrow');
 await page.goForward();await opened(page,'second-voice');
 await page.locator('#csBack').click();await home(page);
 expect(Math.abs(await page.evaluate(()=>scrollY)-y)).toBeLessThan(4);
});
for(const slug of ['morrow','second-voice','leu','needle','f24']) {
 test(`direct ${slug} URL reloads and returns to relevant section`,async({page})=>{
  const response=await page.goto('/case/'+slug);expect(response?.status()).toBe(200);
  await opened(page,slug);await page.reload();await opened(page,slug);
  await page.locator('#csBack').click();await home(page);
  await expect(page).toHaveURL(slug==='f24'?/\/#experience$/:/\/#work$/);
  await expect(page.locator(slug==='f24'?'#experience':'#panel-'+slug)).toBeInViewport();
 });
}
test('next from a directly loaded case can still return home',async({page})=>{
 await page.goto('/case/morrow');await opened(page,'morrow');
 await page.locator('#csNext').click();await opened(page,'second-voice');
 await page.locator('#csBack').click();await home(page);
 await expect(page).toHaveURL(/\/#work$/);
});
test('Escape and contact preserve their intended destinations',async({page})=>{
 await page.goto('/#work');await caseLink(page,'morrow').click();await opened(page,'morrow');
 await page.keyboard.press('Escape');await home(page);
 await caseLink(page,'morrow').click();await opened(page,'morrow');
 await page.locator('#csContact').click();await home(page);
 await expect(page).toHaveURL(/\/#footer$/);
 await expect(page.locator('#frMail')).toBeFocused();
});
