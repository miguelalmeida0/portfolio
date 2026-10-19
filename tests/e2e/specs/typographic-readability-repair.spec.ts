import { expect, test } from '@playwright/test';

test('hero copy stays opaque, headline clears the face and no early curtain cuts the portrait', async ({page}) => {
  await page.goto('/hero-lab/typographic');
  await expect(page.locator('[data-lab-root]')).toHaveAttribute('data-lab-ready','');
  await page.locator('.cv').focus(); // completes entrance before measuring settled composition
  for (const node of await page.locator('[data-col] [data-meta]').all()) await expect(node).toHaveCSS('opacity','1');
  await expect(page.locator('[data-curtain]')).toHaveCount(0);
  await expect(page.locator('.portrait-surface picture')).toHaveCSS('mask-image',/portrait-edge-mask/);
  await expect(page.locator('.portrait-surface picture img')).toHaveAttribute('src',/miguel-contact-editorial.webp/);
  await expect.poll(() => page.locator('.portrait-surface picture img').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  await expect(page.locator('.hair-retouch')).toHaveAttribute('aria-hidden','true');
  if (page.viewportSize()!.width >= 1024) {
    const left = (await page.locator('[data-row-back] .cell.left').boundingBox())!;
    const right = (await page.locator('[data-row-back] .cell.right').boundingBox())!;
    const figure = (await page.locator('[data-figure]').boundingBox())!;
    const years = (await page.locator('.d1-years').boundingBox())!;
    const reach = (await page.locator('.d1-reach').boundingBox())!;
    const stack = (await page.locator('.d1-tech').boundingBox())!;
    const actions = (await page.locator('.hero-details .actions').boundingBox())!;
    const leftColumn = (await page.locator('[data-col="left"]').boundingBox())!;
    const rightColumn = (await page.locator('[data-col="right"]').boundingBox())!;
    expect(Math.abs(years.x-stack.x)).toBeLessThan(2);
    expect(Math.abs(reach.x-actions.x)).toBeLessThan(2);
    expect(stack.y-years.y-years.height).toBeLessThanOrEqual(18);
    expect(actions.y-reach.y-reach.height).toBeLessThanOrEqual(18);
    expect(Math.abs(leftColumn.width-rightColumn.width)).toBeLessThan(2);
    expect(Math.abs(leftColumn.y+leftColumn.height/2-rightColumn.y-rightColumn.height/2)).toBeLessThan(2);
    const band = (await page.locator('[data-band]').boundingBox())!;
    expect(band.height).toBeLessThan(page.viewportSize()!.height*.10);
    // Keep the title clear of the face in the supplied portrait.
    expect(left.x+left.width).toBeLessThan(figure.x+figure.width*.36);
    expect(right.x).toBeGreaterThan(figure.x+figure.width*.69);
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});

test('case bars stay attached and chapter text never covers the demos',async ({page})=>{
  await page.goto('/work/needle');
  const mast=page.locator('[data-mast]'), nav=page.locator('.pnav');
  const gap=async()=>{const a=(await mast.boundingBox())!,b=(await nav.boundingBox())!;return Math.abs(b.y-a.y-a.height);};
  await expect.poll(gap).toBeLessThan(2);
  const head=page.locator('[data-reader-head="case"]').first();
  await expect(head).toBeAttached();
  await head.scrollIntoViewIfNeeded();
  await expect.poll(gap).toBeLessThan(2);
  await expect(page.locator('[data-reader-head="case"][data-reader-held]')).toHaveCount(0);
  await expect(head).toHaveCSS('position','relative');
  const fontSize=await head.locator('h2').evaluate(el=>parseFloat(getComputedStyle(el).fontSize));
  expect(fontSize).toBeLessThanOrEqual(48);
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect.poll(gap).toBeLessThan(2);
});
