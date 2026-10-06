import { expect, test } from '@playwright/test';

for (const reduced of [false, true]) test(`one trackpad gesture advances one chapter reduced=${reduced}`, async ({ browser }) => {
  const context = await browser.newContext({viewport:{width:1440,height:900},reducedMotion:reduced?'reduce':'no-preference'});
  const page = await context.newPage();
  await page.goto(`${process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4398'}/story`);
  const picker=page.getByRole('button',{name:'Choose a chapter',exact:true});
  const sections=page.locator('[data-story-section]');
  await expect(picker).toBeEnabled();
  await picker.click();
  await page.locator('#story-chapters button').first().click();
  await expect(sections.first()).toBeFocused();
  await page.mouse.move(1100,450);
  // A single macOS-style fling keeps delivering a decaying tail after travel ends.
  const fling = async (direction:number) => {
    for(const delta of [640,420,280,190,125,85,58,39,26,18,12,8,5,3,2,1]) {
      await page.mouse.wheel(0,direction*delta);
      await page.waitForTimeout(100);
    }
  };
  await fling(1);
  await expect(sections.nth(1)).toHaveAttribute('data-current');
  // Once that gesture has ended, a distinct gesture must advance normally.
  await page.waitForTimeout(400);
  await fling(1);
  await expect(sections.nth(2)).toHaveAttribute('data-current');
  await fling(-1);
  await expect(sections.nth(1)).toHaveAttribute('data-current');
  await context.close();
});

for (const [width, height] of [[1920,1080],[1440,900],[1280,800],[1440,685],[768,1024],[390,844],[375,812]]) for (const reduced of [false,true]) {
  test(`paced Story ${width}x${height} reduced=${reduced}`, async ({ browser }) => {
    test.setTimeout(90000);
    const context = await browser.newContext({viewport:{width,height},hasTouch:width<768,isMobile:width<768,reducedMotion:reduced?'reduce':'no-preference'});
    const page = await context.newPage();
    const errors: string[] = [];
    page.on('pageerror', e=>errors.push(e.message));
    await page.goto(`${process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4398'}/story`);
    const dock = page.getByRole('navigation',{name:'Story navigation',exact:true});
    const picker = dock.getByRole('button',{name:'Choose a chapter',exact:true});
    const sections = page.locator('[data-story-section]');
    const exits = page.getByRole('navigation',{name:'Story exits',exact:true});
    const overflow = () => page.evaluate(()=>document.documentElement.scrollWidth > innerWidth);
    await expect(picker).toBeEnabled();
    await page.evaluate(()=>document.fonts.ready);
    await picker.click();
    await page.locator('#story-chapters button').first().click();
    await expect(sections.first()).toBeFocused();
    await expect.poll(overflow).toBe(false);
    if (width>=1100) {
      for (let i=1; i<=8; i++) {
        await page.mouse.move(width*.75,height*.5);
        await page.mouse.wheel(0,4000);
        if (i===1 && !reduced) {
          for (let j=0;j<4;j++) { await page.waitForTimeout(40); await page.mouse.wheel(0,1200); }
        }
        await expect(sections.nth(i)).toHaveAttribute('data-current');
        const alignment = await page.evaluate(()=>{
          const visual=document.querySelector('.story-visual')!.getBoundingClientRect();
          const text=document.querySelector('[data-story-section][data-current]')!.getBoundingClientRect();
          const stage=document.querySelector('.scene-stage')!.getBoundingClientRect();
          return {centers:Math.abs(visual.top+visual.height/2-text.top-text.height/2),art:Math.abs(stage.top+stage.height/2-visual.top-visual.height/2)};
        });
        expect(alignment.centers).toBeLessThan(2);
        expect(alignment.art).toBeLessThan(2);
        await expect(exits.getByRole('link',{name:'← Home',exact:true})).toBeInViewport();
        await expect(exits.getByRole('button',{name:'↑ Back',exact:true})).toBeInViewport();
        if(i===2) await page.screenshot({path:`artifacts/portfolio-corrections/steps/${width}-${height}-${reduced}-centered.png`});
        if (i<8) await page.waitForTimeout(210);
      }
    } else {
      // Touch on a tall chapter advances a readable segment, not the entire page.
      if(width<768) {
        const cdp=await context.newCDPSession(page);
        const before=await page.evaluate(()=>scrollY);
        await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:width*.5,y:600}]});
        for(let y=580;y>=300;y-=40) {
          await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:width*.5,y}]});
          await page.waitForTimeout(16);
        }
        await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
        await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(before+50);
        await expect(sections.first()).toHaveAttribute('data-current');
        await cdp.detach();
      }
      for(let i=1;i<=8;i++) {
        await dock.getByRole('button',{name:'Next chapter',exact:true}).click();
        await expect(sections.nth(i)).toBeFocused();
        await expect(sections.nth(i)).toHaveAttribute('data-current');
        await expect(dock.getByRole('link',{name:'Home',exact:true})).toBeInViewport();
      }
    }
    const summary=page.locator('.short-version');
    const root=page.locator('.story-split');
    if(!reduced) {
      await expect(root).toHaveAttribute('data-story-holding');
      const held=await page.evaluate(()=>scrollY);
      for(let j=0;j<5;j++) { await page.mouse.wheel(0,2400); await page.waitForTimeout(120); }
      expect(Math.abs(await page.evaluate(()=>scrollY)-held)).toBeLessThan(2);
      await expect(summary.locator('li').last()).toHaveCSS('opacity','1');
      await expect(root).not.toHaveAttribute('data-story-holding');
    } else await expect(root).not.toHaveAttribute('data-story-holding');
    await expect(summary).toHaveClass(/complete/);
    if(width<768) {
      const actions=(await summary.locator('.short-actions').boundingBox())!;
      const nav=(await dock.boundingBox())!;
      expect(actions.y+actions.height).toBeLessThan(nav.y-8);
    }
    await page.screenshot({path:`artifacts/portfolio-corrections/steps/${width}-${height}-${reduced}-reward.png`});
    const beforeRelease=await page.evaluate(()=>scrollY);
    await page.mouse.move(width*.75,height*.5);
    await page.mouse.wheel(0,550);
    await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(beforeRelease+100);
    // Explicit Back interrupts a fresh reward, then Home can leave during its hold.
    await picker.click();
    await page.locator('#story-chapters button').nth(7).click();
    await expect(sections.nth(7)).toBeFocused();
    await dock.getByRole('button',{name:'Next chapter',exact:true}).click();
    await expect(sections.nth(8)).toBeFocused();
    await exits.getByRole('button',{name:'↑ Back',exact:true}).click();
    await expect(sections.nth(7)).toBeFocused();
    await dock.getByRole('button',{name:'Next chapter',exact:true}).click();
    await expect(sections.nth(8)).toBeFocused();
    await exits.getByRole('link',{name:'← Home',exact:true}).click();
    await expect(page).toHaveURL(/\/#top$/);
    await expect(page.locator('#portfolio-content[data-homepage]')).toHaveCount(1);
    await expect(dock).toHaveCount(0);
    await expect(page.locator('html')).not.toHaveAttribute('data-route-transition','active');
    await page.goBack();
    await expect(picker).toBeEnabled();
    if(width===1920) {
      await picker.click();
      await page.locator('#story-chapters button').first().click();
      await expect(sections.first()).toBeFocused();
      await page.keyboard.press('PageDown');
      await expect(sections.nth(1)).toHaveAttribute('data-current');
      await page.keyboard.press('PageUp');
      await expect(sections.first()).toHaveAttribute('data-current');
    }
    await page.setViewportSize({width:width<1100?1280:390,height:844});
    await expect(page.locator('.story-panel.inline')).toHaveCount(width<1100?0:8);
    await expect.poll(overflow).toBe(false);
    expect(errors).toEqual([]);
    await context.close();
  });
}
