import {test,expect} from '@playwright/test';

test('Bollard joins the project index and opens an accessible fictional case study',async({page})=>{
 await page.goto('/#bollard');
 await expect(page.locator('.project')).toHaveCount(5);
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

test('Bollard uses its static poster for reduced motion',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/#bollard');
 await expect(page.locator('#bollard .project-cover')).toBeVisible();
 await expect(page.locator('#bollard-film')).toBeHidden();
 await expect(page.locator('[data-bollard-toggle]')).toBeHidden();
 expect(await page.locator('#bollard-film').evaluate((video:HTMLVideoElement)=>video.paused)).toBe(true);
});

test('global mobile pause also stops and resumes Bollard',async({page,isMobile})=>{
 test.skip(!isMobile,'Shared motion control is mobile only');
 await page.goto('/#bollard');
 await expect(page.locator('#bollard-film')).toBeVisible();
 const global=page.locator('[data-film-toggle]');
 await global.click();
 await expect(page.locator('#bollard-film')).toBeHidden();
 await expect(page.locator('#bollard .project-cover')).toBeVisible();
 await global.click();
 await page.locator('#bollard .project-shot').scrollIntoViewIfNeeded();
 await expect(page.locator('#bollard-film')).toBeVisible();
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
