import {expect, test} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {openPortfolioHome} from '../helpers/portfolio';

for (const width of [1920, 1440, 1280, 1024, 834, 390, 320]) {
  test(`F24 ownership is visible, readable and linked at ${width}px`, async ({page}, testInfo) => {
    await page.setViewportSize({width, height:1000});
    await page.emulateMedia({reducedMotion:'reduce'});
    const errors: string[] = [];
    page.on('pageerror', error=>errors.push(error.message));
    await openPortfolioHome(page);
    await expect(page.locator('.experience')).toHaveText('Built a product used by hundreds of companies.');
    const hero = await page.locator('.content-card').evaluate(el=> {
      const card=el.getBoundingClientRect(), top=el.querySelector('.top-group')!.getBoundingClientRect(), bottom=el.querySelector('.bottom-group')!.getBoundingClientRect();
      return {overlap:top.bottom-bottom.top, clipped:bottom.bottom-card.bottom};
    });
    expect(hero.overlap).toBeLessThanOrEqual(width >= 1024 ? -9.6 : -12);
    expect(hero.clipped).toBeLessThanOrEqual(width >= 1024 ? -16 : -20);
    await page.screenshot({path:testInfo.outputPath(`home-${width}.png`)});
    await page.locator('.project-index button').filter({hasText:'F24'}).click();
    const stage=page.locator('.stage[data-project="f24"]');
    await expect(stage).toContainText('Built a product used by hundreds of companies.');
    await expect(stage.locator('.decision-body')).toContainText('Built modular frontend architecture');
    const card=stage.locator('.card-b');
    expect(await card.evaluate(el=>el.scrollHeight-el.clientHeight)).toBeLessThanOrEqual(1);
    const footer=await stage.locator('.decision-footer').boundingBox(), tags=await stage.locator('.tags').boundingBox();
    expect(footer!.y).toBeGreaterThanOrEqual(tags!.y+tags!.height);
    await stage.screenshot({path:testInfo.outputPath(`f24-stage-${width}.png`)});
    await page.getByRole('link',{name:'Explore my work',exact:true}).click();
    await expect(page).toHaveURL(/\/work\/f24#team$/);
    await expect(page.getByRole('heading', {name:'A team product, and the contribution to it.'})).toBeInViewport();
    await expect(page.locator('#team')).toContainText('backend');
    await expect(page.locator('.specs2')).toContainText('Companies using the product');
    await expect(page.locator('#decisions')).toContainText('API and domain layer');
    await expect(page.locator('#migration')).toContainText('Svelte into React');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBe(0);
    await page.screenshot({path:testInfo.outputPath(`f24-impact-${width}.png`)});
    await page.evaluate(()=>scrollTo(0,0));
    await page.screenshot({path:testInfo.outputPath(`f24-page-${width}.png`)});
    if (width===1440 || width===390) expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
    expect(errors).toEqual([]);
  });
}
