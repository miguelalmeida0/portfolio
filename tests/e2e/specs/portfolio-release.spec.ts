import {test,expect} from '@playwright/test';
test('featured Needle launches the live app directly in a separate tab',async({page,context})=>{
 await context.route('https://needle.miguelalmeida.xyz/**',route=>route.fulfill({contentType:'text/html',body:'<title>Needle destination</title>'}));
 await page.goto('/');
 const original=page.url();
 const launch=page.getByRole('link',{name:'Open Needle app in a new tab',exact:true});
 await expect(launch).toHaveAttribute('href','https://needle.miguelalmeida.xyz');
 const opened=page.waitForEvent('popup');
 await launch.click();
 const app=await opened;
 await expect(app).toHaveURL('https://needle.miguelalmeida.xyz/');
 expect(page.url()).toBe(original);
 await app.close();
});
for(const width of [390,1440]){
 test('fresh entry immediately serves the published portfolio at '+width,async({page})=>{
  await page.setViewportSize({width,height:900});
  await page.route('**/*',r=>r.request().resourceType()==='script'?r.abort():r.continue());
  await page.goto('/?intro=replay#top');
  await expect(page.locator('[data-pixel-intro]')).toHaveCount(0);
  await expect(page.locator('#portfolio-content')).toBeVisible();
  await expect(page.locator('.mah-photo-front')).toBeVisible();
  await expect(page.locator('#portfolio-content')).not.toHaveAttribute('inert');
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href','https://miguelalmeida.is-a.dev/');
  await expect(page.locator('meta[name=robots][content*=noindex]')).toHaveCount(0);
 });
 test('canonical navigation, role controls and case return at '+width,async({page})=>{
  await page.setViewportSize({width,height:900});await page.goto('/');
  await expect(page.locator('.mah[data-renderer]')).toBeVisible();
  await expect(page.locator('[data-pixel-intro]')).toHaveCount(0);
  await expect(page.locator('.portrait-turn')).toHaveCount(0);
  await expect(page.locator('.mah')).toHaveAttribute('data-role','designer',{timeout:10000});
  await page.locator('.mah-ctas a[href="/cv"]').click();await expect(page).toHaveURL(/\/cv$/);
  await expect(page.locator('[data-d1-page=cv]')).toBeVisible();
  await page.goto('/story');await expect(page.locator('[data-d1-page=story]')).toBeVisible();
  await page.goto('/work/needle');
  await expect(page.locator('meta[name=robots][content*=noindex]')).toHaveCount(0);
  await expect(page.locator('[data-identity-home]').first()).toHaveAttribute('href','/');
  await page.locator('[data-identity-home]').first().click();await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('.mah')).toBeVisible();
 });
}
test('old preview URL cannot restore the removed intro',async({page})=>{
 await page.goto('/hero-lab/typographic?intro=replay#top');
 await expect(page.locator('[data-pixel-intro]')).toHaveCount(0);
 await expect(page.locator('.mah')).toBeVisible();
});
