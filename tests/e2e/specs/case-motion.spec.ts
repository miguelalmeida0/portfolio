import {test,expect} from '@playwright/test';

const cases = [
 ['Morrow','morrow','Show respondent preview'],
 ['Second Voice','second-voice','Accept rewrite'],
 ['Leu','leu','Return to source passage'],
 ['Needle','needle','Inspect Queen Louise'],
 ['F24','f24','Retry save']
] as const;

for (const [name,slug,action] of cases) {
 test(`${name}: playable figure, unchanged preview, clean close`,async({page}) => {
  await page.goto('/');
  const opener = page.locator(`.cs-open[href="#case/${slug}"]`).first();
  // F24 uses the same delegated case opener as the four projects.
  await opener.click();
  const figure = page.locator('.case-motion');
  await expect(figure).toHaveAttribute('data-scene',slug);
  await expect(page.locator('.cs-vwrap')).toBeVisible();
  await figure.getByRole('button',{name:'Replay',exact:true}).click();
  await expect(figure).toHaveAttribute('data-motion','playing');
  await figure.getByRole('button',{name:'Pause',exact:true}).click();
  const progress=figure.getByRole('slider');
  const paused=await progress.inputValue();
  await page.waitForTimeout(150);
  expect(await progress.inputValue()).toBe(paused);
  await progress.press('Home');
  await expect(progress).toHaveValue('0');
  await progress.press('End');
  await expect(progress).toHaveValue('1000');
  await figure.getByRole('button',{name:action,exact:true}).click();
  await page.getByRole('button',{name:'Close case study',exact:true}).click();
  await expect(figure).toHaveCount(0);
  expect(await page.evaluate(() => document.getAnimations().filter(a => (a.effect as KeyframeEffect)?.target instanceof Element && ((a.effect as KeyframeEffect).target as Element).closest('.case-motion')).length)).toBe(0);
 });
}

test('F24 retry preserves an edited title',async({page}) => {
 await page.goto('/');
 await page.locator('.cs-open[href="#case/f24"]').first().click();
 await page.getByRole('textbox',{name:'Demo incident title'}).fill('Customer notification delayed');
 await page.getByRole('button',{name:'Replay failed save',exact:true}).click();
 await page.getByRole('button',{name:'Retry save',exact:true}).click();
 await page.getByRole('slider',{name:'Animation progress'}).press('End');
 await expect(page.getByRole('textbox',{name:'Demo incident title'})).toHaveValue('Customer notification delayed');
 await expect(page.locator('.case-motion').getByRole('status')).toHaveText('Changes saved. Your edits are preserved.');
 await expect(page.locator('.cm-success')).toHaveCSS('opacity','1');
 await expect(page.locator('.cm-failure')).toHaveCSS('opacity','0');
});

test('reduced motion gives complete figures without playback',async({page}) => {
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');
 for(const [,slug] of cases) {
  await page.locator(`.cs-open[href="#case/${slug}"]`).first().click();
  const figure=page.locator('.case-motion');
  await expect(figure).toHaveAttribute('data-motion','reduced');
  await expect(figure.getByRole('slider')).toHaveValue('1000');
  await expect(figure.getByRole('button',{name:'Replay',exact:true})).toBeDisabled();
  await page.getByRole('button',{name:'Close case study',exact:true}).click();
 }
});

test('mobile figures stay inside the case study',async({page}) => {
 await page.setViewportSize({width:390,height:844});
 await page.goto('/');
 for(const [,slug] of cases) {
  await page.locator(`.cs-open[href="#case/${slug}"]`).first().click();
  await page.getByRole('slider',{name:'Animation progress'}).press('End');
  const bounds=await page.locator('.case-motion').evaluate(el => {
   const r=el.getBoundingClientRect();
   return {left:r.left,right:r.right,width:document.documentElement.clientWidth,overflow:el.scrollWidth>el.clientWidth};
  });
  expect(bounds.left).toBeGreaterThanOrEqual(0);
  expect(bounds.right).toBeLessThanOrEqual(bounds.width);
  expect(bounds.overflow).toBe(false);
  await page.getByRole('button',{name:'Close case study',exact:true}).click();
 }
});

 test('returning to a source does not restart completed text tracks',async({page}) => {
 await page.goto('/');
 await page.locator('.cs-open[href="#case/leu"]').first().click();
 await page.getByRole('button',{name:'Return to source passage',exact:true}).click();
 await page.waitForTimeout(300);
 await expect(page.locator('.cm-passage-highlight')).toHaveCSS('clip-path','inset(0px)');
 for (const word of await page.locator('.cm-reading-question .cm-word-mask > span').all()) {
  await expect(word).toHaveCSS('transform','matrix(1, 0, 0, 1, 0, 0)');
 }
});

test('the existing global motion switch governs new figures',async({page}) => {
 await page.goto('/');
 await page.getByRole('button',{name:'Pause motion',exact:true}).click();
 await page.locator('.cs-open[href="#case/morrow"]').first().click();
 await expect(page.locator('.case-motion')).toHaveAttribute('data-motion','paused');
 await expect(page.getByRole('button',{name:'Replay',exact:true})).toBeDisabled();
 await expect(page.getByRole('slider',{name:'Animation progress'})).toHaveValue('1000');
});

test('scrolling away suspends playback and returning resumes it',async({page}) => {
 await page.goto('/');
 await page.locator('.cs-open[href="#case/morrow"]').first().click();
 const figure=page.locator('.case-motion');
 await figure.getByRole('button',{name:'Replay',exact:true}).click();
 await page.locator('#csTitle').scrollIntoViewIfNeeded();
 await expect(figure).toHaveAttribute('data-motion','still');
 const before=await figure.getByRole('slider').inputValue();
 await page.waitForTimeout(150);
 expect(await figure.getByRole('slider').inputValue()).toBe(before);
 await figure.locator('.cm-stage').scrollIntoViewIfNeeded();
 await expect(figure).toHaveAttribute('data-motion','playing');
});
