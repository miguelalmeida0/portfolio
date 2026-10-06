import { expect, test } from '@playwright/test';

test('Story leaves wheel input under native browser control', async ({ page }) => {
  await page.addInitScript(() => {
    (window as any).storyWheel = [];
    window.addEventListener('wheel', event => setTimeout(() => {
      (window as any).storyWheel.push({ prevented: event.defaultPrevented });
    }, 0), { capture: true });
  });
  await page.goto('/story');
  await page.getByRole('link', {name:'Back to home',exact:true}).waitFor();
  await page.waitForFunction(() => document.querySelector('[data-story-ready]') || document.querySelector<HTMLButtonElement>('button[aria-label="Choose a chapter"]')?.disabled === false);
  await page.mouse.move(1000,400);
  await page.mouse.wheel(0,120);
  await expect.poll(() => page.evaluate(() => (window as any).storyWheel.length)).toBeGreaterThan(0);
  expect(await page.evaluate(() => (window as any).storyWheel)).toEqual([{prevented:false}]);
});

for (const [width,height] of [[1440,900],[1280,800],[768,1024],[390,844],[375,812]]) for (const reduced of [false,true]) {
  test(`editorial Story ${width}x${height} reduced=${reduced}`, async ({browser}) => {
    const context = await browser.newContext({viewport:{width,height},isMobile:width<600,hasTouch:width<600,reducedMotion:reduced?'reduce':'no-preference',permissions:['clipboard-read','clipboard-write']});
    const page = await context.newPage();
    const errors:string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => {
      (window as any).storyInputs = [];
      for (const type of ['wheel','touchmove','keydown']) window.addEventListener(type, event => setTimeout(() => {
        (window as any).storyInputs.push({type,prevented:event.defaultPrevented});
      },0),{capture:true,passive:true});
    });
    await page.goto('/story');
    await expect(page.locator('[data-story-ready]')).toBeVisible();
    await expect(page.locator('h1')).toHaveText('The story behind the work.');
    await expect(page.locator('[data-story-scene]')).toHaveCount(8);
    await expect(page.locator('[data-story-scene][inert]')).toHaveCount(0);
    await expect(page.locator('.story-progress,.story-visual')).toHaveCount(0);
    const back = page.getByRole('link',{name:'Back to home',exact:true});
    await expect(back).toBeInViewport();
    await page.evaluate(()=>document.fonts.ready);
    await page.screenshot({path:`artifacts/portfolio-corrections/native/${width}-${reduced}-intro.png`,fullPage:false});
    const index = page.getByRole('navigation',{name:'Story chapters'});
    await index.getByRole('link',{name:'01 Hello',exact:true}).click();
    await expect(page.locator('#story-hi')).toBeFocused();
    await page.mouse.move(width*.65,height*.5);
    const y = await page.evaluate(()=>scrollY);
    await page.mouse.wheel(0,120);
    await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(y+40);
    await page.waitForTimeout(350);
    expect(await page.evaluate(start=>scrollY-start,y)).toBeLessThan(200);
    await page.keyboard.press('PageDown');
    await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(y+200);
    // Touch drags remain native; there is no snapping to a chapter boundary.
    if(width<600) {
      const cdp=await context.newCDPSession(page);
      const before=await page.evaluate(()=>scrollY);
      await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:width*.5,y:600}]});
      for(let next=580;next>=360;next-=40) await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:width*.5,y:next}]});
      await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
      await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(before+50);
      await cdp.detach();
    }
    for(const id of ['ux','build','f24','fail','own','love','care']) {
      await index.locator(`a[href="#story-${id}"]`).click();
      const section=page.locator(`#story-${id}`);
      await expect(section).toBeFocused();
      await expect(back).toBeInViewport();
      const box=(await section.boundingBox())!;
      expect(box.y).toBeGreaterThan(50);
      expect(box.y).toBeLessThan(150);
      const scene=section.locator('[data-story-scene]');
      expect(await scene.evaluate(node=>getComputedStyle(node).opacity)).toBe('1');
      expect(await scene.evaluate(node=>node.scrollHeight>node.clientHeight+2 && ['auto','scroll'].includes(getComputedStyle(node).overflowY))).toBe(false);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
    }
    await page.screenshot({path:`artifacts/portfolio-corrections/native/${width}-${reduced}-chapter.png`});
    await index.getByRole('link',{name:'The short version',exact:true}).click();
    await expect(page.locator('.short-version li')).toHaveCount(8);
    for(const line of await page.locator('.short-version li').all()) expect(await line.evaluate(node=>getComputedStyle(node).opacity)).toBe('1');
    await expect(back).toBeInViewport();
    const endY=await page.evaluate(()=>scrollY);
    await page.mouse.move(width*.65,height*.5);
    await page.mouse.wheel(0,300);
    await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(endY+100);
    await page.locator('[data-story-copy]').click();
    await expect(page.locator('[data-story-copy]')).toContainText('Copied');
    expect(await page.evaluate(()=>navigator.clipboard.readText())).toContain('Miguel Almeida');
    await page.screenshot({path:`artifacts/portfolio-corrections/native/${width}-${reduced}-summary.png`});
    expect(await page.evaluate(()=> (window as any).storyInputs.filter((event:any)=>event.prevented))).toEqual([]);
    await back.click();
    await page.waitForURL('**/#top');
    await page.goBack();
    await expect(page.locator('[data-story-ready]')).toBeVisible();
    await page.reload();
    await expect(page.locator('.short-version')).toBeVisible();
    await page.setViewportSize({width:width<600?844:390,height:width<600?390:844});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
    await expect(back).toBeInViewport();
    expect(errors).toEqual([]);
    await context.close();
  });
}

test('all eight examples work independently of scrolling and respect reduced motion',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/story');
  await expect(page.locator('[data-story-ready]')).toBeVisible();
  await page.getByRole('button',{name:'For an engineer',exact:true}).click();
  await expect(page.locator('[data-story-scene="hi"]')).toContainText('TypeScript · React · Svelte');
  await page.getByRole('button',{name:'Ask what they need',exact:true}).click();
  await expect(page.locator('[data-story-scene="ux"] .revealed')).toHaveCount(3);
  await page.getByRole('button',{name:'Couldn’t refresh',exact:true}).click();
  await expect(page.locator('[data-story-scene="build"]')).toContainText('Showing what you had');
  await page.getByRole('button',{name:'Trigger an alarm',exact:true}).click();
  await expect(page.locator('[data-story-scene="f24"]')).toContainText('Sent once');
  await page.getByRole('button',{name:'Drop the connection',exact:true}).click();
  await expect(page.locator('[data-story-scene="fail"]')).toContainText('Showing the rows');
  await page.getByRole('button',{name:'Race two filters',exact:true}).click();
  await expect(page.locator('[data-story-scene="fail"]')).toContainText('Ignored an out-of-date answer');
  await page.getByRole('button',{name:'Close details by keyboard',exact:true}).click();
  await expect(page.getByRole('button',{name:'Template details',exact:true})).toBeFocused();
  await page.getByRole('button',{name:'Template details',exact:true}).click();
  await page.getByRole('button',{name:'Close details',exact:true}).press('Escape');
  await expect(page.getByRole('button',{name:'Template details',exact:true})).toBeFocused();
  await page.getByRole('button',{name:'Rewrite a sentence',exact:true}).click();
  await expect(page.locator('[data-story-scene="own"]')).toContainText('Every change is marked');
  await page.getByRole('button',{name:'Send a request',exact:true}).click();
  await expect(page.locator('[data-story-scene="love"]')).toContainText('The server finally answers');
  await page.getByRole('button',{name:'Send a bad field',exact:true}).click();
  await expect(page.locator('[data-story-scene="care"]')).toContainText('Time unavailable');
  await page.getByRole('button',{name:'Send a good response',exact:true}).click();
  await expect(page.locator('[data-story-scene="care"]')).not.toContainText('Time unavailable');
});

test('Story reading and chapter links work without JavaScript',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page=await context.newPage();
  await page.goto('/story');
  await expect(page.locator('[data-story-section]')).toHaveCount(9);
  await page.getByRole('navigation',{name:'Story chapters'}).getByRole('link',{name:'The short version',exact:true}).click();
  await expect(page.locator('#story-summary')).toBeInViewport();
  await expect(page.getByRole('link',{name:'Back to home',exact:true})).toBeInViewport();
  await context.close();
});

test('F24 case study uses the uncropped presentation group photo',async({page})=>{
  await page.goto('/work/f24#team');
  const photo=page.locator('#team img');
  await photo.scrollIntoViewIfNeeded();
  await expect(photo).toHaveAttribute('src','/projects/f24/hackathon.webp');
  await photo.evaluate((image:HTMLImageElement)=>image.decode());
  const dimensions=await photo.evaluate((image:HTMLImageElement)=>({ratio:image.getBoundingClientRect().width/image.getBoundingClientRect().height,natural:image.naturalWidth/image.naturalHeight,transform:getComputedStyle(image).transform}));
  expect(Math.abs(dimensions.ratio-dimensions.natural)).toBeLessThan(.01);
  expect(dimensions.transform).toBe('none');
  await page.screenshot({path:'artifacts/portfolio-corrections/native/f24-presentation.png'});
});
