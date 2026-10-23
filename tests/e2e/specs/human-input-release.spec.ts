import {test,expect} from '@playwright/test';

test('reviewed homepage opens immediately with recruiter contact links',async({page})=>{
 await page.goto('/');
 await expect(page.getByRole('heading',{name:'Miguel Almeida',exact:true})).toBeVisible();
 await expect(page.locator('.brand-logo')).toBeVisible();
 await expect(page.locator('.nav').getByRole('link',{name:'View CV'})).toHaveAttribute('href',/\/cv\/pdf$/);
 await expect(page.getByRole('link',{name:'Get in touch',exact:true})).toHaveAttribute('href',/^mailto:/);
});

test('project navigation, animated preview and case dialog remain usable',async({page})=>{
 await page.goto('/');
 await page.getByRole('link',{name:'Work',exact:true}).click();
 await page.getByRole('button',{name:'Second Voice',exact:true}).click();
 await expect(page.locator('#second-voice')).toBeInViewport();
 await page.getByRole('button',{name:'Read Second Voice case study',exact:true}).click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await expect(page.getByRole('dialog').getByRole('link',{name:/Open Second Voice app/})).toHaveAttribute('href','https://secondvoice.miguelalmeida.xyz/');
 await page.keyboard.press('Escape');
 await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('footer keyboard contacts and scrollbar work on a narrow screen',async({page})=>{
 await page.setViewportSize({width:320,height:800});
 await page.goto('/');
 await page.locator('#contact').scrollIntoViewIfNeeded();
 await expect(page.locator('#contact').getByRole('link',{name:'Email Miguel',exact:true})).toBeVisible();
 await page.locator('#contact').getByRole('button',{name:'Copy email',exact:true}).focus();
 await expect(page.locator('#contact').getByRole('button',{name:'Copy email',exact:true})).toBeFocused();
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
 expect(overflow).toBe(false);
 await page.getByRole('link',{name:/Back to top/}).click();
 await expect(page.getByRole('heading',{name:'Miguel Almeida',exact:true})).toBeInViewport();
});

test('reduced motion preserves project previews and all existing public routes',async({page,request})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');
 await expect(page.locator('.sv-result')).toContainText('Rain arrived');
 for(const path of ['/story','/cv','/cv/pdf','/work/f24','/work/needle','/work/second-voice','/work/leu']){
  const response=await request.get(path);expect(response.status(),path).toBe(200);
 }
 const pdf=await request.get('/files/miguel-almeida-cv.pdf');
 expect(pdf.headers()['content-type']).toContain('application/pdf');
});
