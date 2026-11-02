import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {caseFocusScript} from '../../scripts/patch-case-focus.mjs';
for(const reverse of [false,true]) test(`case dialog wraps ${reverse?'reverse':'forward'} Tab without reaching the document`,()=>{
 const first={tabIndex:0,getClientRects:()=>[{}],focus(){active=first;}},last={tabIndex:0,getClientRects:()=>[{}],focus(){active=last;}};
 let handler,active=reverse?first:last,prevented=false;
 const dialog={open:true,querySelectorAll:()=>[first,last],addEventListener:(name,fn)=>{handler=fn;}};
 const document={querySelector:()=>dialog,get activeElement(){return active;}};
 vm.runInNewContext(caseFocusScript,{document,getComputedStyle:()=>({visibility:'visible'})});
 handler({key:'Tab',shiftKey:reverse,preventDefault(){prevented=true;}});
 assert.equal(prevented,true);assert.equal(active,reverse?last:first);
});
