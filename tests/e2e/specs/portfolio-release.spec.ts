import {test,expect} from '@playwright/test';
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
  await page.getByRole('button',{name:'Product designer',exact:true}).click();
  await expect(page.locator('.mah')).toHaveAttribute('data-role','designer');
  await page.locator('.mah-btn').click();await expect(page).toHaveURL(/\/cv$/);
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
