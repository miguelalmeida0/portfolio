import test from 'node:test';
import assert from 'node:assert/strict';
import { loadLocalTs } from '../../scripts/lib/load-local-ts.mjs';
const { createLineService } = await loadLocalTs('src/lib/components/experience/footer/service.ts');
const { createJourneyController } = await loadLocalTs('src/lib/components/experience/footer/journey-controller.ts');

test('contact bindings publish the latest intent before the visual host attaches',()=>{
  const service=createLineService();let state;service.subscribe(value=>state=value);
  for(const i of [0,2,1,3]){service.aim(i,'focus');assert.equal(state.requested,i);}
  const controller=createJourneyController();service.attach(controller,()=>{});
  assert.equal(controller.snapshot().desiredStop,3);
  assert.equal(state.requested,3);assert.equal(state.at,-1);
});

test('cleanup from a replaced host cannot detach the active controller',()=>{
  const service=createLineService(),old=createJourneyController(),current=createJourneyController();
  const detachOld=service.attach(old,()=>{});service.attach(current,()=>{});detachOld();
  service.aim(2,'pointer');assert.equal(current.snapshot().desiredStop,2);
  assert.equal(old.snapshot().desiredStop,-1);
});
