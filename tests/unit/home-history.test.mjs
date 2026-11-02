import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { patchHomeHistory } from '../../scripts/patch-home-history.mjs';
const html = patchHomeHistory(readFileSync('release/home.html', 'utf8'));
test('user section navigation adds history without replacing the starting URL', () => {
  const calls=[];
  const heading={setAttribute(){},focus(){}};
  const element={querySelector(){return heading;}};
  const source=html.slice(html.indexOf(' function navigate('),html.indexOf(" all('a[href^=\"#\"]')"));
  const context={document:{getElementById:()=>element},panels:[],galleryTween:null,indexButtons:[],navigation:{offsetHeight:86},layoutTop:()=>500,scrollToPosition(){},updateNavigation(){},history:{pushState:(...args)=>calls.push(['push',...args]),replaceState:(...args)=>calls.push(['replace',...args])},location:{hash:''}};
  vm.runInNewContext(source+"\nnavigate('#about',true,true);",context);
  assert.deepEqual(calls,[['push',null,'','#about']]);
});
