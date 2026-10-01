import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
const browser = await chromium.launch();
const results = [];
try {
  for (const width of [1920,1440,1280,1024,768,390,320]) {
    const context = await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
    const page = await context.newPage();
    await page.addInitScript(()=>sessionStorage.setItem('seen-intro','true'));
    await page.goto('http://127.0.0.1:4173/');
    await page.waitForFunction(()=>!document.querySelector('[data-ask-trigger]')?.disabled);
    await page.evaluate(()=>document.fonts.ready);
    const geometry = await page.evaluate(()=>{
      const r=s=>document.querySelector(s).getBoundingClientRect();
      const work=r('#work'), h=r('footer h2'), board=r('[data-board]'), row=r('[data-project-row]'), cap=r('[data-stage-caption]'), meta=r('[data-index-meta]'), frame=r('[data-stage-frame]');
      return {overflow:document.documentElement.scrollWidth-innerWidth, contactGap:h.top-work.bottom, boardRight:board.right, titleBoard:h.top-board.top,rowCaption:row.top-cap.top,metaFrame:meta.bottom-frame.bottom,frame:frame.toJSON(),heroGap:r('.bottom-group').top-r('.top-group').bottom};
    });
    const projects=[];
    for(let i=0;i<4;i++) {
      await page.locator('[data-project-row]').nth(i).click();
      await page.waitForTimeout(850);
      const axes=width===1440 ? await new AxeBuilder({page}).analyze() : null;
      projects.push({id:await page.locator('#work').getAttribute('data-project'),frame:await page.locator('[data-stage-frame]').boundingBox(),violations:axes?.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
    }
    results.push({width,geometry,projects}); console.log(width,JSON.stringify(geometry),JSON.stringify(projects.map(p=>({id:p.id,h:p.frame.height,violations:p.violations}))));
    await context.close();
  }
  await fs.writeFile('artifacts/tidy/inspection.json',JSON.stringify(results,null,2));
}finally{await browser.close();}
