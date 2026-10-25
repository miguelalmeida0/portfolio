import {readFileSync} from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {patchHomeNav} from '../../scripts/patch-home-nav.mjs';
import {patchHomeMobile} from '../../scripts/patch-home-mobile.mjs';

for(const [width,height] of [[1600,1000],[1363,681],[768,550],[393,417],[320,340]])test(`footer ${width}: paper remains continuous through its curled corner`, async()=>{
 const original=readFileSync(new URL('../../release/home.html',import.meta.url),'utf8');
 const html=patchHomeMobile(patchHomeNav(original));
 const paper=html.match(/<svg class="footer-paper"[\s\S]*?<\/svg>/)?.[0];
 assert.ok(paper,'Footer paper illustration is present');
 const svg=paper.replace('<svg ',`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" `)
  .replace('<defs>','<rect width="1600" height="1000" fill="#102d88"/><defs>');
 const {data,info}=await sharp(Buffer.from(svg)).raw().toBuffer({resolveWithObject:true});
 let exposedBackground=0;
 // Both sheets occupy this region; blue pixels here are a tear in their seam.
 for(let y=Math.ceil(75*height/1000);y<Math.floor(160*height/1000);y++)for(let x=Math.ceil(550*width/1600);x<Math.floor(703*width/1600);x++){
  const i=(y*info.width+x)*info.channels;
  // Pink, cream and the warm crease shade all have more red than blue.
  // Include blue-tinted antialiasing cracks, not only fully exposed ink pixels.
  if(data[i+2]>data[i])exposedBackground++;
 }
 assert.equal(exposedBackground,0,'Blue background must not show between the cream and pink edges');
});
