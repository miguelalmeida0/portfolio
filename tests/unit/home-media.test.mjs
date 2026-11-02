import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
import {externalizePointingHand} from '../../scripts/home-media.mjs';
const original=readFileSync('release/home.html','utf8');
const result=externalizePointingHand(original);
test('externalized hand retains every original image byte',()=>{
 const originalBytes=Buffer.from(original.match(/const POINT_HAND_IMAGE="data:image\/png;base64,([A-Za-z0-9+/=]+)";/)[1],'base64');
 assert.deepEqual(result.bytes,originalBytes);
 assert.equal(createHash('sha256').update(result.bytes).digest('hex'),result.hash);
 assert.ok(original.length-result.html.length>1800000);
});
test('phone startup does not request decorative hand photos; desktop resize loads them',()=>{
 const source=result.html.slice(result.html.indexOf('function createPointingHand('),result.html.indexOf('\n(()=>{',result.html.indexOf('function createPointingHand(')));
 const fn=source.slice(0,source.indexOf('\n}')+2);
 const requested=[];let onChange;
 const ctx={POINT_HAND_IMAGE:result.path,getComputedStyle:()=>({backgroundImage:'url(grip.png)'}),matchMedia:()=>({matches:false,addEventListener:(_event,fn)=>onChange=fn}),Image:class {classList={add(){}};setAttribute(){};set src(value){requested.push(value);}},};
 const hand=vm.runInNewContext(fn+';createPointingHand({});',ctx);
 assert.equal(typeof hand.render,'function');assert.deepEqual(requested,[]);
 onChange();assert.deepEqual(requested,['grip.png',result.path]);
});
