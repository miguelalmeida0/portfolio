import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {patchHomeMobile} from '../../scripts/patch-home-mobile.mjs';
import {patchMorrowPortfolio} from '../../scripts/patch-home-morrow.mjs';
import {patchHomeAccessibility} from '../../scripts/patch-home-accessibility.mjs';
test('Open hint enters at full contrast while its circular cursor still animates',()=>{
 const html=patchHomeAccessibility(patchMorrowPortfolio(patchHomeMobile(readFileSync('release/home.html','utf8'))));
 const start=html.indexOf('function initOpenCursor('),source=html.slice(start,html.indexOf('\n}\n',start)+3);
 const events={},calls=[],label={},cursor={querySelector:()=>label},target={contains:()=>false};
 const quick=()=>Object.assign(()=>{},{tween:{progress(){}}});
 const context={cursor,document:{querySelector:()=>cursor,documentElement:{addEventListener(){},removeEventListener(){}},addEventListener:(event,handler)=>events[event]=handler},matchMedia:q=>({matches:!q.includes('prefers-reduced-motion')}),addEventListener(){},gsap:{quickTo:quick,to:(el,props)=>calls.push({kind:'tween',el,props}),set:(el,props)=>calls.push({kind:'set',el,props})}};
 vm.runInNewContext(source+'\ninitOpenCursor({cursor});',context);
 events.pointerover({target:{closest:()=>target},relatedTarget:null});
 assert.ok(calls.some(c=>c.kind==='set'&&c.el===label&&c.props.opacity===1));
 assert.ok(calls.some(c=>c.kind==='tween'&&c.el===cursor&&c.props.width===44));
 assert.equal(calls.some(c=>c.kind==='tween'&&c.el===label),false);
});
