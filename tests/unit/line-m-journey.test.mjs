import test from 'node:test';
import assert from 'node:assert/strict';
import { loadLocalTs } from '../../scripts/lib/load-local-ts.mjs';
import { existsSync } from 'node:fs';
const path = 'src/lib/components/experience/footer/journey-controller.ts';
const module = existsSync(path) ? await loadLocalTs(path) : {};
const math = await loadLocalTs('src/lib/components/experience/footer/journey-geometry.ts');
const geometry = { origin:{x:160,y:900}, stops:[320,550,780,1010].map(x=>({x,y:900})), width:1440,height:1000,maximum:2000,footerTop:450,footerBottom:1100,mobile:false };
const make = () => {
  assert.equal(typeof module.createJourneyController, 'function', 'shared interruptible journey controller must exist');
  const c=module.createJourneyController(); c.setGeometry(geometry);c.setVisible(true);c.updateScroll({documentY:0,viewportHeight:1000,timeMs:0});c.step(0);return c;
};
const advance=(c,from,to,hz=60)=>{for(let t=from+1000/hz;t<=to+.001;t+=1000/hz)c.step(t);};
test('contact_intent_before_first_measurement_is_synchronous_and_latest_wins',()=>{
  const c=module.createJourneyController();
  for(const i of [0,2,1,3]){
    c.requestStop(i,'pointer');
    assert.equal(c.snapshot().desiredStop,i,'selection must not wait for layout');
  }
  c.setGeometry(geometry);c.setVisible(true);c.step(0);
  const before=c.snapshot();c.step(1000/60);const after=c.snapshot();
  assert.equal(after.owner,'manual');assert.equal(after.desiredStop,3);
  assert.notDeepEqual(after.cars,before.cars,'first rendered frame begins the requested transfer');
  assert.equal(after.originVisited,false,'no compulsory origin arrival');
  advance(c,1000/60,4000);assert.equal(c.snapshot().at,3);
});
test('first_measurement_respects_mobile_and_reduced_motion_after_early_contact',()=>{
  for(const mobile of [true,false]){
    const c=module.createJourneyController();c.setReducedMotion(true);c.requestStop(2,'focus');
    c.setGeometry({...geometry,mobile});c.setVisible(true);c.step(0);
    const before=c.snapshot();advance(c,0,5000);
    assert.equal(c.snapshot().desiredStop,2);
    assert.equal(c.snapshot().at,-1);assert.deepEqual(c.snapshot().cars,before.cars);
    assert.equal(c.snapshot().scheduledAt,null);
  }
});
test('reduced_motion_breakpoint_resize_keeps_body_scale_and_couplings_consistent',()=>{
  const c=make();c.setReducedMotion(true);
  for(const [mobile,width,scale] of [[true,390,.66],[false,1440,1],[true,899,.66]]){
    c.setGeometry({...geometry,mobile,width});
    const s=c.snapshot();assert.equal(s.scale,scale);
    assert.ok(Math.abs(s.cars[0].x-s.cars[2].x-80*scale)<.001);
    assert.equal(s.at,-1);assert.equal(c.needsFrame(),false);
  }
});
test('restoring_motion_after_reduced_mobile_resize_retires_desktop_roaming',()=>{
  const c=make();c.requestStop(2,'focus');c.setReducedMotion(true);
  c.setGeometry({...geometry,mobile:true,width:390});
  assert.equal(c.snapshot().owner,'scroll');
  c.setReducedMotion(false);
  c.updateScroll({documentY:2000,viewportHeight:1000,timeMs:0});advance(c,0,10000);
  const s=c.snapshot();
  assert.equal(s.owner,'scroll');assert.equal(s.phase,'origin');
  assert.equal(s.at,-1);assert.equal(s.scheduledAt,null);
  assert.equal(c.needsFrame(),false);
  assert.ok(s.morph>.999);assert.ok(Math.abs(s.scale-.66)<.001);
});
test('narrow_contact_intent_never_traps_the_train_in_its_scrollbar_morph',()=>{
  for(const source of ['pointer','focus','activate'])for(const enteredAt of [0,100,400,900,2500]){
    const c=module.createJourneyController();
    c.setGeometry({...geometry,width:860,mobile:true,origin:{x:108,y:900}});
    c.setVisible(true);c.step(0);
    c.updateScroll({documentY:2000,viewportHeight:1000,timeMs:0});
    advance(c,0,enteredAt);
    c.requestStop(0,source);
    assert.equal(c.snapshot().desiredStop,0,'contact intent is still immediate');
    c.updateScroll({documentY:2000,viewportHeight:1000,timeMs:enteredAt});
    advance(c,enteredAt,enteredAt+5000);
    const s=c.snapshot();
    assert.ok(s.morph>.999,`${source} at ${enteredAt}ms left a collapsed train: ${s.morph}`);
    assert.equal(s.owner,'scroll','narrow layouts have no manual roaming service');
    assert.equal(s.originVisited,true);assert.equal(s.at,-1,'no false contact arrival');
    assert.equal(s.scheduledAt,null);
    assert.ok(Math.abs(s.cars[0].x-s.cars[2].x-80*.66)<.01);
  }
});
test('narrow_contact_selection_releases_only_after_footer_and_focus_leave',()=>{
  const c=module.createJourneyController();c.setGeometry({...geometry,width:860,mobile:true});c.step(0);
  c.setVisible(true);c.requestStop(2,'focus');c.updateScroll({documentY:500,viewportHeight:1000,timeMs:0});advance(c,0,2000);
  assert.equal(c.snapshot().desiredStop,2);
  c.setVisible(false,true);assert.equal(c.snapshot().desiredStop,2,'retained contact focus keeps selection');
  c.setVisible(false,false);assert.equal(c.snapshot().desiredStop,-1,'offscreen un-focused footer relinquishes selection');
});
test('mobile_entry_bend_keeps_the_whole_body_inside_the_viewport',()=>{
  for(const width of [320,390,532,768,899]){
    const route=math.approach({...geometry,width,mobile:true,origin:{x:64,y:900}});
    assert.equal(route.at(route.length-40*.66).angle,0,'rear carriage finishes the bend before parking');
    for(let d=route.turnStart;d<=route.length;d+=.5){
      const p=route.at(d),angle=p.angle*Math.PI/180;
      const halfWidth=(Math.abs(Math.cos(angle))*36+Math.abs(Math.sin(angle))*22)*.66/2;
      assert.ok(p.x-halfWidth>=6,`car body clips the mobile bend at ${width}px: ${p.x-halfWidth}`);
    }
  }
});
test('entry_renderer_keeps_one_train_without_exposing_its_geometry_as_a_stroke',async()=>{
  const {createJourneyRenderer}=await loadLocalTs('src/lib/components/experience/footer/journey-renderer.ts');
  class Element {
    children=[];attributes={};parent=null;
    constructor(tag){this.tag=tag;}
    setAttribute(k,v){this.attributes[k]=v;}
    appendChild(el){el.remove();el.parent=this;this.children.push(el);}
    remove(){if(this.parent)this.parent.children=this.parent.children.filter(el=>el!==this);this.parent=null;}
  }
  const previous=globalThis.document;
  try{
    globalThis.document={createElementNS:(_,tag)=>new Element(tag)};
    const svg=new Element('svg'),renderer=createJourneyRenderer(svg),c=make();
    const all=el=>[el,...el.children.flatMap(all)];
    c.updateScroll({documentY:400,viewportHeight:1000,timeMs:0});
    for(const time of [17,100,300,700]){
      c.step(time);renderer.render(c.snapshot(),400);
      assert.equal(all(svg).filter(el=>el.attributes.stroke && Number(el.attributes.opacity??1)>0).length,0,'no detached guide or trailing purple line');
      assert.equal(all(svg).filter(el=>'data-car' in el.attributes).length,3);
    }
    renderer.destroy();assert.equal(svg.children.length,0);
  }finally{globalThis.document=previous;}
});
test('stationary_sidebar_resize_anchors_immediately_without_starting_a_journey',()=>{
  const g={...geometry,origin:{x:160,y:5000},maximum:5000,footerTop:4600,footerBottom:5600};
  const c=module.createJourneyController();c.setGeometry(g);c.step(0);c.updateScroll({documentY:800,viewportHeight:1000,timeMs:0});advance(c,0,3000);
  for(const width of [1024,899,532,1920]){
    // Reflow can bring the contact approach underneath the current scroll.
    c.setGeometry({...g,width,mobile:width<900,origin:{x:100,y:900},maximum:2000,footerTop:450,footerBottom:1100});
    assert.equal(c.snapshot().onScrollbar,true,'layout is not travel intent');
    assert.ok(c.snapshot().cars.every(p=>Math.abs(p.x-(width-12))<.001),'all cars anchor to the new edge in the layout frame');
    const poses=c.snapshot().cars.map(({x,y,angle})=>({x,y,angle}));advance(c,3000,5000);assert.deepEqual(c.snapshot().cars.map(({x,y,angle})=>({x,y,angle})),poses,'no trailing resize animation');
    assert.equal(c.needsFrame(),false,'stationary sidebar sleeps after layout');
    c.resumeClock(3000);
  }
  c.updateScroll({documentY:801,viewportHeight:1000,timeMs:5000});c.step(5017);
  assert.ok(c.snapshot().distance>0,'actual scrolling resumes the approach');
});
test('contact_transfer_merges_onto_rail_before_a_soft_horizontal_arrival',()=>{
  assert.equal(typeof math.dockTransfer,'function');
  const from=[0,1,2].map(i=>({x:1300,y:500+(1-i)*30,angle:90,vx:0,vy:160,va:0}));
  const to=[0,1,2].map(i=>math.still({x:780+(1-i)*40,y:760}));
  const sample=math.dockTransfer(from,to,2.2);
  assert.deepEqual(sample(0),from,'no pose or derivative reset');
  let rolled=false,articulated=false;
  for(let t=.02;t<2.2;t+=.02){const cars=sample(t),center=cars[1];
    if(Math.abs(center.y-760)<.1 && Math.abs(center.x-780)>15)rolled=true;
    if(Math.abs(cars[0].angle-cars[2].angle)>4)articulated=true;
    for(let i=0;i<2;i++)assert.ok(Math.hypot(cars[i].x-cars[i+1].x,cars[i].y-cars[i+1].y)>25,'couplings stay separated');
  }
  assert.ok(rolled,'merge onto rail with travel left before stopping');
  assert.ok(articulated,'carriages follow the bend individually');
  assert.deepEqual(sample(2.2),to);
  assert.ok(Math.hypot(sample(2.19)[1].vx,sample(2.19)[1].vy)<2,'quiet braking at the platform');
});
test('early_hover_during_a_fast_bend_has_no_carriage_rotation_whip',()=>{
  const g={...geometry,origin:{x:160,y:3000},stops:geometry.stops.map(p=>({...p,y:3000})),maximum:3200,footerTop:2600,footerBottom:3600};
  const c=module.createJourneyController();c.setGeometry(g);c.step(0);c.updateScroll({documentY:3200,viewportHeight:1000,timeMs:0});
  for(let t=17;t<=119;t+=17)c.step(t);c.requestStop(3,'pointer');let previous=c.snapshot().cars;
  for(let t=136;t<3000;t+=17){c.step(t);const cars=c.snapshot().cars;
    for(let i=0;i<3;i++){const angle=((cars[i].angle-previous[i].angle+540)%360)-180;assert.ok(Math.abs(angle)<18,`car ${i} turns ${angle} degrees at ${t}ms`);}
    previous=cars;
  }
  assert.equal(c.snapshot().at,3);
});
test('curved_diversions_remain_continuous_across_all_stops_and_entry_phases',()=>{
  const g={...geometry,origin:{x:160,y:3000},stops:geometry.stops.map(p=>({...p,y:3000})),maximum:3200,footerTop:2600,footerBottom:3600};
  for(const enteredAt of [0,51,119,255,510,850,1500])for(const stop of [0,1,2,3]){
    const c=module.createJourneyController();c.setGeometry(g);c.step(0);c.updateScroll({documentY:3200,viewportHeight:1000,timeMs:0});
    for(let t=17;t<=enteredAt;t+=17)c.step(t);c.requestStop(stop,'pointer');let previous=c.snapshot().cars;
    for(let t=enteredAt+17;t<enteredAt+4000;t+=17){c.step(t);const cars=c.snapshot().cars;
      for(let i=0;i<3;i++){
        assert.ok(Math.hypot(cars[i].x-previous[i].x,cars[i].y-previous[i].y)<90,`pose jump: entry ${enteredAt}, stop ${stop}, car ${i}, time ${t}`);
        assert.ok(Math.abs(((cars[i].angle-previous[i].angle+540)%360)-180)<24,`rotation jump: entry ${enteredAt}, stop ${stop}, car ${i}, time ${t}`);
      }previous=cars;
    }
    assert.equal(c.snapshot().at,stop);
  }
});
test('sidebar_morph_keeps_the_native_scroll_thumb_center',()=>{
  for(const width of [532,1440])for(const y of [0,80,400,1000,1700]){
    const g={...geometry,width,mobile:width<900,origin:{x:160,y:5000},maximum:5000,footerTop:4600,footerBottom:5600};
    const c=module.createJourneyController();c.setGeometry(g);c.step(0);c.updateScroll({documentY:y,viewportHeight:1000,timeMs:0});advance(c,0,3000);
    const s=c.snapshot();assert.equal(s.onScrollbar,true);
    assert.ok(Math.abs(s.cars[1].x-(width-12))<.001,'same horizontal center throughout morph');
    assert.ok(Math.abs(s.cars[1].y-y-(34+y/5000*932))<.001,'same vertical center throughout morph');
  }
});
test('sidebar_train_grows_continuously_as_it_enters_contact',()=>{
  const g={...geometry,origin:{x:160,y:3000},stops:geometry.stops.map(p=>({...p,y:3000})),maximum:3200,footerTop:2600,footerBottom:3600};
  const c=module.createJourneyController();c.setGeometry(g);c.pauseAuto();c.step(0);
  c.updateScroll({documentY:1800,viewportHeight:1000,timeMs:0});advance(c,0,3000);
  const sidebar=c.snapshot();assert.equal(sidebar.onScrollbar,true);
  assert.ok(sidebar.scale<.7,'sidebar convoy is visibly smaller than the contact convoy');
  c.updateScroll({documentY:3200,viewportHeight:1000,timeMs:3000});
  let prior=sidebar.scale,sawGrowth=false;
  for(let t=3017;t<6000;t+=17){c.step(t);const s=c.snapshot();assert.ok(Math.abs(s.scale-prior)<.08,'scale changes without a pop');if(s.distance>0 && s.travel<.7 && s.scale>sidebar.scale+.1)sawGrowth=true;prior=s.scale;}
  assert.ok(sawGrowth,'growth accompanies entry, before the final docking bend');
  assert.ok(Math.abs(c.snapshot().scale-1)<.001,'contact retains the approved full size');
});
test('native_scroll_is_not_inherited_as_ballistic_train_velocity',()=>{
  const g={...geometry,origin:{x:160,y:3000},stops:geometry.stops.map(p=>({...p,y:3000})),maximum:3200};
  const c=module.createJourneyController();c.setGeometry(g);c.step(0);c.updateScroll({documentY:10,viewportHeight:1000,timeMs:17});c.step(17);
  assert.equal(c.snapshot().cars[1].vy,0,'camera motion before path departure is not train momentum');
  c.setGeometry({...g});c.step(217);assert.ok(c.snapshot().cars.every(p=>p.y<4000),'repeated measurements must not launch cars beyond the document');
});
test('early_retarget_brakes_high_release_velocity_without_ballistic_overshoot',()=>{
  const g={...geometry,origin:{x:160,y:3000},stops:geometry.stops.map(p=>({...p,y:3000})),maximum:3200,footerTop:2600,footerBottom:3600};
  const c=module.createJourneyController();c.setGeometry(g);c.step(0);c.updateScroll({documentY:3200,viewportHeight:1000,timeMs:0});
  for(let t=17;t<=170;t+=17)c.step(t);
  const before=c.snapshot().cars;c.requestStop(2,'pointer');assert.deepEqual(c.snapshot().cars,before);
  for(let t=187;t<3200;t+=17){c.step(t);assert.ok(c.snapshot().cars.every(p=>p.y>Math.min(...before.map(p=>p.y))-100 && p.y<3700),'fast release brakes before crossing unrelated UI');}
  assert.equal(c.snapshot().at,2);
});
test('unchanged_measurement_keeps_the_same_approach_and_derivatives',()=>{
  const c=make();c.updateScroll({documentY:800,viewportHeight:1000,timeMs:0});advance(c,0,700);const before=c.snapshot();
  c.setGeometry({...geometry,stops:geometry.stops.map(p=>({...p}))});assert.deepEqual(c.snapshot(),before);
});
test('station_circles_yield_before_contact_and_regenerate_after_passage',()=>{
  assert.equal(typeof math.stationVisibility,'function');
  const poses=x=>[0,1,2].map(i=>math.still({x:x+i*47.2,y:900}));
  const station={x:320,y:900};
  assert.equal(math.stationVisibility(station,poses(320),42.48,25.96),0);
  assert.equal(math.stationVisibility(station,poses(500),42.48,25.96),1);
  const approaching=math.stationVisibility(station,poses(175),42.48,25.96);
  assert.ok(approaching>0 && approaching<1,'ring eases out ahead of the train');
  assert.equal(math.stationVisibility(station,poses(320).map(p=>({...p,y:650})),42.48,25.96),1,'passing on the upper bend does not hide station circles');
});
test('approach_shares_the_actual_scroll_thumb_seam_and_broad_final_bend',()=>{
  const route=math.approach(geometry);
  assert.equal(route.at(0).x,1428,'departure shares the scrollbar center 12px from the right');
  assert.equal(route.at(route.turnStart).x,108);
  assert.equal(route.at(route.turnStart).y,732);
  assert.ok(Math.abs(route.at(0).y-(route.start+34+route.start/geometry.maximum*(geometry.height-68)))<.001,'departure starts at the real thumb center');
  assert.equal(route.end,route.start+400);
});
test('resize_during_station_return_does_not_restore_a_stale_path_offset',()=>{
  for(const mobile of [false,true]){
    const c=make();c.updateScroll({documentY:800,viewportHeight:1000,timeMs:0});c.requestStop(3,'pointer');advance(c,0,5000);
    c.updateScroll({documentY:500,viewportHeight:1000,timeMs:5000});c.setVisible(false);c.step(5017);
    c.setGeometry({...geometry,width:mobile?899:1024,mobile,origin:{x:100,y:880},stops:[250,450,650,850].map(x=>({x,y:880}))});
    let previous=c.snapshot().cars;
    for(let t=5034;t<10000;t+=17){c.step(t);const now=c.snapshot().cars;assert.ok(now.every((p,i)=>Math.hypot(p.x-previous[i].x,p.y-previous[i].y)<40),'resize completion keeps every carriage continuous');previous=now;}
  }
});
test('reverse_during_early_hover_has_no_rejoin_snap',()=>{
  const c=make();c.updateScroll({documentY:800,viewportHeight:1000,timeMs:0});c.requestStop(3,'pointer');advance(c,0,300);
  let previous=c.snapshot().cars;
  for(let t=317;t<12000;t+=17){c.updateScroll({documentY:Math.max(0,800-(t-300)/14),viewportHeight:1000,timeMs:t});c.step(t);const now=c.snapshot().cars;assert.ok(now.every((p,i)=>Math.hypot(p.x-previous[i].x,p.y-previous[i].y)<25),`rejoin at ${t}`);previous=now;}
});
test('early_contact_morph_never_grows_cars_beyond_their_spacing',()=>{
  const c=make();c.requestStop(3,'pointer');
  for(let t=17;t<1500;t+=17){c.step(t);const s=c.snapshot();for(let i=0;i<2;i++)assert.ok(math.mix(44/3,36,s.morph)*s.scale <= Math.hypot(s.cars[i].x-s.cars[i+1].x,s.cars[i].y-s.cars[i+1].y)+.01,'cars do not overlap during morph');}
});
test('pre_dock_request_takes_ownership_synchronously',()=>{
  const c=make(),before=c.snapshot();assert.notEqual(before.phase,'arrived');c.requestStop(2,'pointer');
  assert.equal(c.snapshot().owner,'manual');assert.equal(c.snapshot().desiredStop,2);assert.deepEqual(c.snapshot().cars,before.cars);
  c.step(1000/60);assert.notDeepEqual(c.snapshot().cars,before.cars);advance(c,1000/60,5000);assert.equal(c.snapshot().at,2);assert.equal(c.snapshot().originVisited,false);
});
test('door_and_dwell_do_not_gate_manual_intent',()=>{
  const c=make();c.requestStop(0,'focus');advance(c,0,5000);assert.equal(c.snapshot().at,0);assert.ok(c.snapshot().doors>.9);
  const before=c.snapshot();c.pauseAuto();c.requestStop(3,'pointer');assert.equal(c.snapshot().desiredStop,3);assert.deepEqual(c.snapshot().cars,before.cars);
  c.step(5017);assert.notDeepEqual(c.snapshot().cars,before.cars);assert.ok(c.snapshot().doors<before.doors);
});
test('latest_request_cancels_stale_arrival',()=>{
  const c=make();for(const [j,i] of [0,2,1,3].entries()){c.requestStop(i,'pointer');c.step((j+1)*17);}
  advance(c,68,9000);assert.equal(c.snapshot().desiredStop,3);assert.equal(c.snapshot().at,3);assert.equal(c.snapshot().scheduledAt,null);
});
test('repeat_same_stop_does_not_restart',()=>{
  const c=make();c.requestStop(2,'pointer');c.step(500);const a=c.snapshot();c.requestStop(2,'focus');assert.deepEqual(c.snapshot(),a);
});
test('scroll_tick_cannot_replace_manual_target',()=>{
  const c=make();c.requestStop(2,'pointer');c.updateScroll({documentY:15,viewportHeight:1000,timeMs:17});c.step(17);
  assert.equal(c.snapshot().desiredStop,2);assert.equal(c.snapshot().owner,'manual');
});
test('replan_preserves_rendered_pose_and_velocity_for_all_carriages',()=>{
  const c=make();c.requestStop(3,'pointer');advance(c,0,500);const before=c.snapshot();c.requestStop(0,'focus');assert.deepEqual(c.snapshot().cars,before.cars);
  c.step(500);assert.deepEqual(c.snapshot().cars,before.cars);advance(c,500,5000);assert.equal(c.snapshot().at,0);
});
test('fixed_step_60_and_120_hz_converge_and_resize_is_continuous',()=>{
  const a=make(),b=make();for(const c of [a,b])c.requestStop(3,'pointer');advance(a,0,1200,60);advance(b,0,1200,120);
  for(let i=0;i<3;i++)assert.ok(Math.hypot(a.snapshot().cars[i].x-b.snapshot().cars[i].x,a.snapshot().cars[i].y-b.snapshot().cars[i].y)<.5);
  const before=a.snapshot().cars;a.setGeometry({...geometry,origin:{x:100,y:880},stops:[250,450,650,850].map(x=>({x,y:880})),width:1024,height:768});
  assert.deepEqual(a.snapshot().cars,before);advance(a,1200,6000);assert.equal(a.snapshot().at,3);assert.ok(a.snapshot().cars.every(p=>Number.isFinite(p.x+p.y+p.vx+p.vy)));
});
test('reduced_hidden_and_destroy_cancel_automatic_work',()=>{
  const c=make();c.requestStop(1,'activate');c.setReducedMotion(true);const before=c.snapshot().cars;advance(c,0,10000);assert.deepEqual(c.snapshot().cars,before);assert.equal(c.snapshot().scheduledAt,null);
  c.setVisible(false);const hidden=c.snapshot();c.destroy();c.requestStop(2,'pointer');assert.equal(c.snapshot().desiredStop,hidden.desiredStop);
});
test('manual_next_frame_differs_from_uninterrupted_approach',()=>{
  const a=make(),b=make();for(const c of [a,b]){c.updateScroll({documentY:400,viewportHeight:1000,timeMs:0});advance(c,0,300);}
  assert.deepEqual(a.snapshot().cars,b.snapshot().cars);a.requestStop(3,'pointer');a.step(317);b.step(317);
  assert.ok(Math.hypot(a.snapshot().cars[1].x-b.snapshot().cars[1].x,a.snapshot().cars[1].y-b.snapshot().cars[1].y)>.05);
});
test('settled_partial_approach_sleeps_until_scroll_or_manual_intent',()=>{
  const c=make();advance(c,0,5000);assert.equal(c.needsFrame(),false);
});
test('return_to_scroll_completes_without_restarting_each_frame',()=>{
  const c=make();c.requestStop(3,'pointer');advance(c,0,700);c.setVisible(false);
  for(let t=717;t<6000;t+=17){c.updateScroll({documentY:0,viewportHeight:1000,timeMs:t});c.step(t);}
  assert.equal(c.snapshot().owner,'scroll');assert.equal(c.snapshot().phase,'approach');assert.equal(c.needsFrame(),false);
});
test('automatic_origin_arrival_is_soft_and_dwell_is_3600ms',()=>{
  const c=make();c.updateScroll({documentY:800,viewportHeight:1000,timeMs:0});
  let previous=c.snapshot(),last=-1,seen=[];
  for(let t=17;t<42000;t+=17){c.step(t);const s=c.snapshot();if(s.at!==last && s.at>=0){seen.push(s.at);last=s.at;}
    if(!previous.originVisited && s.originVisited){assert.ok(Math.hypot(s.cars[1].x-previous.cars[1].x,s.cars[1].y-previous.cars[1].y)<.1);assert.equal(s.desiredStop,-1);}
    previous=s;
  }
  assert.deepEqual(seen.slice(0,6),[0,1,2,3,2,1]);
});
test('approach_tangent_never_wraps_into_a_retarget_spin',()=>{
  const c=make();c.updateScroll({documentY:800,viewportHeight:1000,timeMs:0});
  for(let t=17;t<=1054;t+=17)c.step(t);
  assert.ok(c.snapshot().cars.every(p=>Math.abs(p.va)<1000));
  const before=c.snapshot().cars;c.requestStop(3,'pointer');
  for(let t=1071;t<4000;t+=17){c.step(t);assert.ok(c.snapshot().cars.every((p,i)=>Math.abs(p.angle-before[i].angle)<360));}
});
test('reduced_motion_reenable_never_claims_arrival_at_the_origin',()=>{
  const c=make();c.updateScroll({documentY:800,viewportHeight:1000,timeMs:0});c.requestStop(3,'pointer');advance(c,0,5000);
  c.setReducedMotion(true);c.setReducedMotion(false);advance(c,5000,9000);
  assert.equal(c.snapshot().at,3);assert.ok(Math.abs(c.snapshot().cars[1].x-1010)<.1);
});
test('breakpoint_during_manual_arrival_rejoins_without_end_of_bridge_snap',()=>{
  const c=make();c.requestStop(3,'pointer');advance(c,0,5000);
  const before=c.snapshot();c.setGeometry({...geometry,width:899,mobile:true});assert.deepEqual(c.snapshot().cars,before.cars);
  let prior=c.snapshot().cars;
  for(let t=5017;t<12000;t+=17){c.step(t);const now=c.snapshot().cars;assert.ok(now.every((p,i)=>Math.hypot(p.x-prior[i].x,p.y-prior[i].y)<35));prior=now;}
});
test('turning_transfer_keeps_carriages_apart',()=>{
  const from=[0,1,2].map(i=>({x:1400,y:100+(1-i)*40,angle:90,vx:0,vy:0,va:0}));
  const to=[0,1,2].map(i=>({x:800+(1-i)*40,y:700,angle:0,vx:0,vy:0,va:0}));
  const sample=math.transfer(from,to,2);
  assert.deepEqual(sample(0),from);
  for(let t=0;t<=2;t+=1/60){const p=sample(t);for(let i=0;i<2;i++)assert.ok(Math.hypot(p[i].x-p[i+1].x,p[i].y-p[i+1].y)>38);}
});
test('scrollbar_pose_tracks_scroll_even_in_a_same_timestamp_frame',()=>{
  const c=make();const y=c.snapshot().cars[1].y;c.updateScroll({documentY:10,viewportHeight:1000,timeMs:0});c.step(0);
  assert.ok(c.snapshot().cars[1].y>=y+10,'document scroll compensation is immediate');
  c.step(17);assert.ok(c.snapshot().cars[1].y>y+10,'reference visual filter advances on the next frame');
});
test('manual_departure_after_footer_reentry_requires_explicit_resume',()=>{
  const c=make();c.requestStop(0,'pointer');advance(c,0,5000);c.setVisible(false);advance(c,5000,9000);
  c.updateScroll({documentY:800,viewportHeight:1000,timeMs:9000});c.setVisible(true);advance(c,9000,25000);
  assert.equal(c.snapshot().desiredStop,-1);assert.equal(c.snapshot().scheduledAt,null);
  c.resumeAuto();advance(c,25000,30000);assert.equal(c.snapshot().desiredStop,0);
});
test('ordinary_upward_scroll_cannot_cancel_manual_intent',()=>{
  const c=make();c.updateScroll({documentY:500,viewportHeight:1000,timeMs:0});c.step(17);
  c.requestStop(2,'pointer');
  for(let i=1;i<=8;i++){c.updateScroll({documentY:500-i*3,viewportHeight:1000,timeMs:17+i*17});c.step(17+i*17);}
  assert.equal(c.snapshot().owner,'manual');assert.equal(c.snapshot().desiredStop,2);
  advance(c,153,5000);assert.equal(c.snapshot().at,2);
});
test('approved_convoy_stays_116px_at_arrival',()=>{
  const c=make();c.requestStop(1,'pointer');advance(c,0,5000);
  const s=c.snapshot();assert.ok(Math.abs(s.cars[0].x-s.cars[2].x+36*s.scale-116)<.1);
});
test('footer_exit_rejoins_without_needing_another_scroll_event',()=>{
  const c=make();c.requestStop(3,'pointer');advance(c,0,5000);
  const before=c.snapshot().cars;c.setVisible(false);assert.deepEqual(c.snapshot().cars,before);
  let previous=before;
  for(let t=5017;t<10000;t+=17){c.step(t);const poses=c.snapshot().cars;assert.ok(poses.every((p,i)=>Math.hypot(p.x-previous[i].x,p.y-previous[i].y)<35),'continuous exit bridge');previous=poses;}
  assert.equal(c.snapshot().onScrollbar,true);assert.equal(c.needsFrame(),false);
});
test('focus_keeps_manual_intent_when_footer_is_outside_viewport',()=>{
  const c=make();c.requestStop(1,'focus');c.setVisible(false,true);c.updateScroll({documentY:0,viewportHeight:1000,timeMs:17});c.step(17);
  assert.equal(c.snapshot().owner,'manual');assert.equal(c.snapshot().desiredStop,1);
});
test('fast_scroll_release_decelerates_into_origin_instead_of_teleporting',()=>{
  const c=make();c.pauseAuto();const before=c.snapshot().cars;
  c.updateScroll({documentY:800,viewportHeight:1000,timeMs:17});c.step(17);
  assert.ok(c.snapshot().distance<c.snapshot().pathLength*.1,'first frame begins the approach, not its final pose');
  let previous=c.snapshot(),tail=[];
  for(let t=34;t<6000;t+=17){c.step(t);const s=c.snapshot();if(s.distance>s.pathLength*.98)tail.push(Math.hypot(s.cars[1].x-previous.cars[1].x,s.cars[1].y-previous.cars[1].y));previous=s;}
  assert.ok(tail.length>10);assert.ok(tail.at(-1)<.01);assert.ok(c.snapshot().originVisited);
  assert.notDeepEqual(c.snapshot().cars,before);
});
test('approach_60_and_120_hz_agree_and_reverse_rejoins_without_a_snap',()=>{
  const a=make(),b=make();for(const c of [a,b]){c.pauseAuto();c.updateScroll({documentY:800,viewportHeight:1000,timeMs:0});}
  advance(a,0,1000,60);advance(b,0,1000,120);
  assert.ok(Math.abs(a.snapshot().distance-b.snapshot().distance)<.01);
  const before=a.snapshot().cars;a.updateScroll({documentY:0,viewportHeight:1000,timeMs:1000});assert.deepEqual(a.snapshot().cars,before);
  advance(a,1000,7000);assert.equal(a.snapshot().onScrollbar,true);assert.equal(a.needsFrame(),false);
});
test('manual_arrival_retires_the_interrupted_scroll_velocity_and_sleeps',()=>{
  const c=make();c.updateScroll({documentY:400,viewportHeight:1000,timeMs:0});c.step(17);c.requestStop(2,'pointer');
  advance(c,17,10017);assert.equal(c.snapshot().at,2);assert.equal(c.needsFrame(),false);
});
test('all_stops_and_input_sources_interrupt_every_active_phase',()=>{
  for(const phase of ['approach','origin','transit','doors','dwell','paused']){
    for(const source of ['pointer','focus','activate'])for(const stop of [0,1,2,3]){
      const c=make();let time=0;
      if(phase==='origin'||phase==='dwell'){c.updateScroll({documentY:800,viewportHeight:1000,timeMs:0});advance(c,0,3500);time=3500;}
      if(phase==='transit'||phase==='doors'||phase==='paused'){
        c.requestStop((stop+1)%4,'pointer');time=phase==='transit'?500:5000;advance(c,0,time);
      }
      if(phase==='paused')c.pauseAuto();
      const before=c.snapshot().cars;c.requestStop(stop,source);
      assert.equal(c.snapshot().owner,'manual');assert.equal(c.snapshot().desiredStop,stop);assert.equal(c.snapshot().scheduledAt,null);
      assert.deepEqual(c.snapshot().cars,before,'event turn preserves every pose and derivative');
      c.step(time+1000/60);assert.notDeepEqual(c.snapshot().cars,before,'next frame uses replacement trajectory');
      advance(c,time+1000/60,time+6000);assert.equal(c.snapshot().at,stop);
    }
  }
});
test('retarget_inherits_actual_rendered_approach_velocity',()=>{
  const c=make();c.updateScroll({documentY:800,viewportHeight:1000,timeMs:0});advance(c,0,200);
  const before=c.snapshot().cars;c.step(200.01);const after=c.snapshot().cars;
  const actual=after.map((p,i)=>({vx:(p.x-before[i].x)/.00001,vy:(p.y-before[i].y)/.00001}));
  c.requestStop(2,'pointer');
  for(let i=0;i<3;i++)assert.ok(Math.hypot(c.snapshot().cars[i].vx-actual[i].vx,c.snapshot().cars[i].vy-actual[i].vy)<5,'snapshot velocity matches rendered displacement, not an arbitrary cap');
});
test('a_scroll_reversal_turning_point_does_not_sleep_before_reaching_its_target',()=>{
  const c=make();c.pauseAuto();c.updateScroll({documentY:800,viewportHeight:1000,timeMs:0});
  for(let t=17;t<=1700;t+=17)c.step(t);
  c.updateScroll({documentY:555.117951,viewportHeight:1000,timeMs:1700});c.step(1717);
  assert.equal(c.needsFrame(),true,'zero velocity at a turning point is not arrival');
  advance(c,1717,7717);assert.equal(c.needsFrame(),false);
});
