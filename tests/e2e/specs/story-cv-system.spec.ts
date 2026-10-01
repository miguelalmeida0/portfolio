import { expect, test } from '@playwright/test';
import { openPortfolioHome } from '../helpers/portfolio';

const sizes = [[1440,1020],[1366,768],[1280,800],[1024,768],[834,1112],[430,932],[393,852],[390,844],[375,812]];
for (const [width,height] of sizes) {
  test('Story and CV hierarchy and geometry at '+width+'×'+height, async ({page}) => {
    await page.setViewportSize({width,height});
    for (const route of ['/story','/cv']) {
      const errors: string[]=[];
      page.on('pageerror', error=>errors.push(error.message));
      const response=await page.goto(route);
      expect(response?.status()).toBe(200);
      await page.evaluate(()=>document.fonts.ready);
      await expect(page).toHaveTitle(route==='/story'?'Story | Miguel Almeida':'CV — Miguel Almeida');
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('vite-error-overlay')).toHaveCount(0);
      await expect(page.locator('[data-identity-avatar]')).toHaveCount(0);
      const header=page.locator('#portfolio-content > header');
      await expect(header).toHaveClass(/wind-header/);
      const gutter=width>=1280?120:width>=768?64:20;
      const box=await header.boundingBox();
      expect(box!.x).toBe(gutter);
      expect(box!.height).toBe(width>=768?84:76);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(0);
      const article=await page.locator('.profile-page').boundingBox();
      expect(article!.x).toBe(gutter);
      expect(article!.width).toBe(width-2*gutter);
      if(route==='/story') {
        await expect(page.locator('h1')).toHaveText('I started in UX.Then built the frontend.');
        await expect(page.getByRole('heading',{name:'Path so far'})).toBeVisible();
        await expect(page.locator('.story-chapter')).toHaveCount(3);
        const path=await page.locator('.story-path').boundingBox();
        expect(path!.y+path!.height).toBeLessThan(height*(width<768?1.5:1));
      } else {
        await expect(page.locator('.cv-stack')).toContainText('JavaScript · React');
        await expect(page.locator('.cv-stack')).toContainText('Svelte · TypeScript');
        await expect(page.locator('.cv-summary')).toContainText('Four years at F24');
        for(const skill of ['JavaScript','React','Svelte','TypeScript','Playwright','Accessibility','Design systems'])
          await expect(page.locator('.cv-skills').getByText(skill,{exact:true})).toBeVisible();
        const download=await page.getByRole('link',{name:'Open CV PDF'}).boundingBox();
        expect(download!.y+download!.height).toBeLessThan(height);
      }
      expect(errors).toEqual([]);
    }
  });
}
test('CV opens a PDF in a new tab and email uses mailto',async({page,request,context})=>{
  await page.goto('/cv');
  const link=page.getByRole('link',{name:'Open CV PDF'});
  await expect(link).toHaveAttribute('target','_blank');
  await expect(link).not.toHaveAttribute('download');
  const response=await request.get('/portfolio.pdf');
  expect(response.status()).toBe(200);
  expect((await response.body()).subarray(0,5).toString()).toBe('%PDF-');
  await context.route('**/portfolio.pdf', route => route.fulfill({ contentType: 'text/html', body: '<h1>PDF destination</h1>' }));
  const next=page.waitForEvent('popup');
  await link.click();
  const popup=await next;
  await expect(popup).toHaveURL(/\/portfolio.pdf$/);
  await popup.close();
  await expect(page).toHaveURL(/\/cv$/);
  await expect(page.locator('.cv-email')).toHaveAttribute('href','mailto:miguelalmeida1592@gmail.com');
  await page.keyboard.press('Tab');
  await link.focus();
  expect(await link.evaluate(el=>getComputedStyle(el).outlineStyle)).toBe('solid');
});

for(const width of [1440,390]) {
  test('shared navigation, history and stable header at '+width,async({page})=>{
    await page.setViewportSize({width,height:width===390?844:1020});
    await openPortfolioHome(page);
    const header=page.locator('#portfolio-content > header');
    const initial=await header.boundingBox();
    // Record every rendered frame, including the route transition.
    await page.evaluate(()=>{
      (window as any).__headerFrames=[];
      const sample=()=>{
        const h=document.querySelector('#portfolio-content > header')!;
        const r=h.getBoundingClientRect();
        (window as any).__headerFrames.push({path:location.pathname,x:r.x,height:r.height,old:!h.classList.contains('wind-header'),avatar:!!h.querySelector('[data-identity-avatar]')});
        requestAnimationFrame(sample);
      };sample();
    });
    async function nav(label:string,mobileLabel:string,path:string){
      if(path==='/'){
        await page.locator('[data-identity-home]').click();
      }else if(width<720){
        await page.getByRole('button',{name:'Menu',exact:true}).click();
        await page.getByRole('navigation',{name:'Mobile navigation'}).getByRole('link',{name:mobileLabel,exact:true}).click();
      }else{
        await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:label,exact:true}).click();
      }
      await expect(page).toHaveURL(new RegExp(path==='/'?'/$':path+'$'));
      await expect(page.locator('[data-route-veil]')).toHaveAttribute('data-phase','idle');
      await expect(page.locator('#portfolio-content')).not.toHaveAttribute('inert','');
      await expect(page.locator('[data-route-veil]')).toBeHidden();
      expect(await header.boundingBox()).toEqual(initial);
    }
    await nav('Story','Story','/story');
    await nav('CV','CV','/cv');
    await nav('Home','Home','/');
    await page.goBack();
    await expect(page).toHaveURL(/\/cv$/);
    await expect(page.locator('h1')).toHaveText('Miguel Almeida.');
    await expect(page.locator('[data-route-veil]')).toHaveAttribute('data-phase','idle');
    await page.goForward();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('#intro-heading')).toBeVisible();
    await expect(page.locator('[data-route-veil]')).toHaveAttribute('data-phase','idle');
    const frames=await page.evaluate(()=>(window as any).__headerFrames);
    expect(frames.filter((f:any)=>f.old||f.avatar||f.x!==initial!.x||f.height!==initial!.height)).toEqual([]);
    await page.goto('/story');
    await page.getByRole('link',{name:'Read the production decision'}).click();
    await expect(page).toHaveURL(/\/work\/f24#production-decision$/);
    await expect(page.locator('#production-decision')).toBeVisible();
  });
}
