import {test,expect} from '@playwright/test';
test('mobile first paint has stacked readable copy before JavaScript',async({browser,baseURL})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
 const page=await context.newPage();await page.goto(new URL('/',baseURL).href);
 const left=(await page.locator('.mah-col--left').boundingBox())!,right=(await page.locator('.mah-col--right').boundingBox())!;
 expect(right.y).toBeGreaterThanOrEqual(left.y+left.height);
 for(const box of [left,right]){expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(390);}
 await context.close();
});
test('cold mobile hydration keeps layout shift below 0.1',async({page,context,browserName})=>{
 test.skip(browserName!=='chromium','Layout Shift API and CDP network throttling');
 test.setTimeout(45000);await page.setViewportSize({width:390,height:844});
 const cd=await context.newCDPSession(page);await cd.send('Network.enable');await cd.send('Network.setCacheDisabled',{cacheDisabled:true});
 await cd.send('Network.emulateNetworkConditions',{offline:false,latency:60,downloadThroughput:1125000,uploadThroughput:187500});
 await cd.send('Emulation.setCPUThrottlingRate',{rate:4});
 await page.addInitScript(()=>{(window as any).auditCLS=0;new PerformanceObserver(list=>{for(const e of list.getEntries() as any[])if(!e.hadRecentInput)(window as any).auditCLS+=e.value;}).observe({type:'layout-shift',buffered:true});});
 await page.goto('/');await expect(page.locator('.mah[data-renderer]')).toBeVisible({timeout:30000});await page.waitForTimeout(1500);
 expect(await page.evaluate(()=>(window as any).auditCLS)).toBeLessThan(.1);
});
