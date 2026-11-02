import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {compile} from 'svelte/compiler';
import {render} from 'svelte/server';
const dir=new URL('../../.cache/a11y-links/',import.meta.url);
await mkdir(dir,{recursive:true});
const source=await readFile('src/lib/components/CvLinks.svelte','utf8');
await writeFile(new URL('CvLinks.mjs',dir),compile(source,{generate:'server',filename:'CvLinks.svelte'}).js.code);
const {default:CvLinks}=await import(new URL('CvLinks.mjs',dir));
test('equivalent CV links preserve the exact PDF destination and human label',()=>{
 const html=render(CvLinks,{props:{links:[{href:'https://github.com/miguelalmeida0',label:'GitHub'},{href:'mailto:miguelalmeida1592@gmail.com',label:'Email'}]}}).body;
 assert.match(html,/href="https:\/\/github.com\/miguelalmeida0"/);
 assert.match(html,/>GitHub<\/a>/);
 assert.match(html,/href="mailto:miguelalmeida1592@gmail.com"/);
 assert.match(html,/target="_blank" rel="noopener noreferrer"/);
});
