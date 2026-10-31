import {test,expect} from '@playwright/test';

test('Bollard joins the project index and opens an accessible fictional case study',async({page})=>{
 await page.goto('/#bollard');
 await expect(page.locator('.project')).toHaveCount(6);
 await expect(page.locator('[data-project="4"]')).toHaveAttribute('aria-controls','bollard');
 const project=page.locator('#bollard');
 await expect(project.getByRole('link',{name:'Open Bollard app in a new tab'})).toHaveAttribute('href','https://bollard-nine.vercel.app/today');
 await project.locator('.project-shot').click();
 const dialog=page.getByRole('dialog');
 await expect(dialog).toBeVisible();
 await expect(dialog.getByRole('heading',{name:'Bollard',exact:true})).toBeVisible();
 await expect(dialog).toContainText('+€62/t');await expect(dialog).toContainText('+€23/t');
 await expect(dialog).toContainText('€1.19M');await expect(dialog).toContainText('hypothetical estimate');
 await expect(dialog.getByRole('link',{name:'Open Bollard app in a new tab'})).toHaveAttribute('href','https://bollard-nine.vercel.app/today');
 await page.keyboard.press('Escape');await expect(dialog).not.toBeVisible();
});

test('Bollard uses its static poster for reduced motion',async({page,isMobile})=>{
 test.skip(isMobile,'Mobile uses gentle canvas playback');
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/#bollard');
 await expect(page.locator('#bollard .project-cover')).toBeVisible();
 await expect(page.locator('#bollard-film')).toBeHidden();
 await expect(page.locator('[data-bollard-toggle]')).toBeHidden();
 expect(await page.locator('#bollard-film').evaluate((video:HTMLVideoElement)=>video.paused)).toBe(true);
});

test('Bollard case content remains available without JavaScript',async({browser,baseURL})=>{
 const context=await browser.newContext({javaScriptEnabled:false,baseURL});
 const page=await context.newPage();
 await page.goto('/#bollard');
 const fallback=page.locator('.bollard-case-fallback');
 await fallback.getByText('Read Bollard case study',{exact:true}).click();
 await expect(fallback).toContainText('+€62/t');
 await expect(fallback).toContainText('+€23/t');
 await expect(fallback).toContainText('hypothetical estimate');
 await expect(page.locator('a[href="https://miguelalmeida.is-a.dev/work/bollard"]')).toHaveCount(0);
 await context.close();
});
