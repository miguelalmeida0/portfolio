// node scripts/media/render-leu-film.mjs <2880x1800 product capture directory>
// Requires ffmpeg. Sources come from capture-leu-product.mjs, never the old video.
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
const source = path.resolve(process.argv[2] || '.cache/leu-film/source');
const work = path.resolve('.cache/leu-film/render');fs.mkdirSync(work,{recursive:true});
const target = path.resolve('static/projects/leu/leu-film-20261009-1440p');
const scenes = [
 ['home','Your place is still here.'], ['library','Your books, together.'],
 ['read','Stay with the thought.'], ['explain','A little clarity, right beside the page.'],
 ['words','Tell it to a curious friend.'], ['explore','Follow an idea across your books.'],
 ['trails','Every step leads back to a passage.'], ['home','A quieter way to understand.']
];
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
const page=await browser.newPage({viewport:{width:2560,height:1440},deviceScaleFactor:1});
const font=fs.readFileSync('static/fonts/case-studies/figtree-latin-wght-normal.woff2').toString('base64');
for(let i=0;i<scenes.length;i++){
 const [name,title]=scenes[i];
 const image=fs.readFileSync(path.join(source,name+'.png')).toString('base64');
 await page.setContent(`<style>@font-face{font-family:Figtree;src:url(data:font/woff2;base64,${font}) format('woff2');font-weight:300 900}*{box-sizing:border-box}html,body{margin:0;width:2560px;height:1440px;background:#eff3e3;color:#0b2b22}h1{margin:0;position:absolute;top:64px;left:120px;right:120px;font:800 78px/1.15 Figtree,sans-serif;letter-spacing:-.03em;text-align:center}.screen{position:absolute;left:320px;top:210px;width:1920px;height:1200px;overflow:hidden;border-radius:20px}.screen img{display:block;width:1920px;height:1200px}</style><h1>${title}</h1><div class="screen"><img src="data:image/png;base64,${image}"></div>`);
 await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));});
 await page.screenshot({path:path.join(work,`scene-${i}.png`)});
}
await browser.close();
const run=(args)=>new Promise((resolve,reject)=>{const child=spawn('ffmpeg',['-y','-v','error',...args],{stdio:'inherit'});child.on('error',reject);child.on('exit',code=>code===0?resolve():reject(new Error(`ffmpeg exited ${code}`)));});
for(let i=0;i<scenes.length;i++){
 await run(['-loop','1','-framerate','30','-i',path.join(work,`scene-${i}.png`),'-t','5','-vf','fade=t=in:st=0:d=0.2:color=0xeff3e3,fade=t=out:st=4.8:d=0.2:color=0xeff3e3,format=yuv420p','-c:v','libx264','-crf','17','-preset','medium','-threads','4','-an',path.join(work,`scene-${i}.mp4`)]);
 console.log(`Encoded ${scenes[i][0]} at 2560×1440`);
}
fs.writeFileSync(path.join(work,'scenes.txt'),scenes.map((_,i)=>`file 'scene-${i}.mp4'`).join('\n'));
await run(['-f','concat','-safe','0','-i',path.join(work,'scenes.txt'),'-c','copy','-movflags','+faststart',target+'.mp4']);
await run(['-i',target+'.mp4','-c:v','libvpx-vp9','-b:v','0','-crf','24','-cpu-used','4','-row-mt','1','-threads','4','-an',target+'.webm']);
await sharp(path.join(work,'scene-0.png')).jpeg({quality:95,chromaSubsampling:'4:4:4'}).toFile(target+'-poster.jpg');
console.log('40-second 1440p loop and matching sharp poster complete.');
