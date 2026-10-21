import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {gsap} from 'gsap';
const compile=path=>ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const config={};vm.runInNewContext(compile('src/lib/hero-lab/typographic/turntable/src/config.ts'),{exports:config});
function element(){
 const node={children:[],style:{setProperty(){},width:''},classList:{add(){}},scaleX:1,color:'',width:0,
  appendChild(child){this.children.push(child);return child;},append(...children){this.children.push(...children);},getBoundingClientRect(){return {width:100};}};
 Object.defineProperty(node,'innerHTML',{set(){node.children=[];}});return node;
}
const module={};vm.runInNewContext(compile('src/lib/hero-lab/typographic/turntable/src/split-word.ts'),{
 exports:module,require:name=>({'gsap':{gsap},'./config':config})[name],document:{createElement:element}
});
// Real GSAP and SplitWord lifecycle; DOM painting is inert, not visually verified.
test('destroying split letters settles callers waiting for the current glyphs',async()=>{
 const word=new module.SplitWord(element(),element());
 try{
  word.build('FRONTEND');word.fit('FRONTEND',200,1200);
  word.swap(word.cells[0],'F','D','#000','#fff');
  let settled=false;word.settled().then(()=>settled=true);
  word.destroy();for(let i=0;i<5;i++)await Promise.resolve();
  assert.equal(settled,true);
 }finally{word.destroy();gsap.ticker.sleep();}
});
