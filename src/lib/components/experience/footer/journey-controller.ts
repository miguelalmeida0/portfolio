import { approach, clamp, mix, smooth, smoother, inverseSmoother, still, transfer, dockTransfer, stationVisibility, SCROLLBAR_EDGE_INSET, type Geometry, type Pose } from './journey-geometry';
export type StopIndex = 0 | 1 | 2 | 3;
export type ScrollSample = { documentY: number; viewportHeight: number; timeMs: number };
const ORDER: StopIndex[] = [0,1,2,3,2,1];

/** Pure motion owner. The host provides one clock; no timers or DOM dependencies. */
export function createJourneyController() {
  let geometry: Geometry, route: ReturnType<typeof approach>;
  let cars: Pose[] = [], owner: 'scroll'|'manual'|'auto' = 'scroll';
  let desiredStop = -1, at = -1, doors = 0, paused = false, visible = false, reduced = false, destroyed = false;
  let originVisited = false, scroll = 0, distance = 0, velocity = 0, last: number | undefined;
  let clock = 0, settled = 0, next = 0, scheduledAt: number | null = null;
  let bridge: { sample: ReturnType<typeof transfer>; from: Pose[]; start: number; duration: number; returning: boolean } | undefined;
  let morph = 0, trainScale = 1;
  let filteredY=0;
  let pinnedByLayout=false;
  // Keep the unmorphed scrollbar seam intact, then form a smaller sidebar train.
  const scale = () => mix(1, geometry.mobile ? .46 : .62, morph);
  const footerScale = () => geometry.mobile ? .66 : 1;
  const scrollScale = (d = distance) => mix(scale(),footerScale(),smooth(d/route.length/.35));
  function parked(index = desiredStop) {
    const point = index >= 0 && !geometry.mobile ? geometry.stops[index] : geometry.origin;
    return [0,1,2].map(i=>still({x:point.x+(1-i)*40*footerScale(),y:point.y},0));
  }
  function scrollTarget() { return pinnedByLayout?0:route.length * smoother((filteredY-route.start)/(route.end-route.start)); }
  function scrollCars(d: number, poseScale = trainScale) {
    const release=smooth(inverseSmoother(clamp(d/route.length))/.20),p=clamp(filteredY/Math.max(1,geometry.maximum));
    // The native 44px thumb is centered 34px from each viewport edge.
    // Morph size around that same center; do not introduce a second rail.
    const railY=scroll+34+p*(geometry.height-68);
    const size=mix(44/3,36,morph),gap=mix(0,4,morph);
    return [0,1,2].map(i=>{
      const offset=(i-1)*(size+gap)*poseScale,point=route.at(d-offset);
      return still({x:mix(geometry.width-SCROLLBAR_EDGE_INSET,point.x,release),y:mix(railY-offset,point.y,release)},mix(90,point.angle,release));
    });
  }
  function replan(to: Pose[], returning = false) {
    const docking=!returning && owner!=='scroll';
    const duration=clamp(Math.hypot(to[1].x-cars[1].x,to[1].y-cars[1].y)/(docking?480:600), docking?1.35:.8, 2.6);
    bridge={sample:(docking?dockTransfer:transfer)(cars,to,duration),from:cars.map(p=>({...p})),start:clock,duration,returning};settled=0;at=-1;scheduledAt=null;
  }
  function choose(i: number) { desiredStop=i; if(!reduced && !geometry.mobile)replan(parked()); }
  function reverseToScroll() {
    if(owner==='scroll'){desiredStop=-1;return;}
    if(owner==='manual')paused=true;
    owner='scroll';desiredStop=-1;at=-1;originVisited=false;scheduledAt=null;
    if(reduced)return;
    filteredY=scroll;
    distance=scrollTarget();
    // Keep all rendered poses and derivatives. Rejoin even if the user stops
    // scrolling immediately after the footer leaves the viewport.
    replan(scrollCars(distance),true);
  }
  const api = {
    setGeometry(g: Geometry) {
      if(destroyed)return;
      if(geometry && JSON.stringify(g)===JSON.stringify(geometry))return;
      const initial=!geometry,changedMode=geometry && geometry.mobile!==g.mobile;
      const wasOnSidebar=!!geometry && !reduced && owner==='scroll' && !bridge && distance<.01;
      geometry=g;route=approach(g);
      // A layout bridge reconciles to the new canonical path. Do not restore
      // a distance offset measured against the old rail after that bridge ends.
      if(initial){
        filteredY=scroll;distance=scrollTarget();morph=smooth((scroll/Math.max(1,g.maximum)-.025)/.595);
        trainScale=reduced?footerScale():scrollScale();cars=reduced?parked(-1):scrollCars(distance);
        // Contact focus can precede the first ResizeObserver/rAF measurement.
        // Its selection is already authoritative; initialize the visible pose
        // and steer from it during this first render, without an origin gate.
        if(g.mobile)owner='scroll';
        else if(desiredStop>=0&&!reduced)replan(parked());
      }
      else if(reduced){
        cars=parked(-1);trainScale=footerScale();bridge=undefined;
        // A static resize still changes the service policy. Retire desktop
        // roaming before motion can be re-enabled in the compact layout.
        if(changedMode){
          if(owner==='manual')paused=true;
          owner='scroll';desiredStop=-1;at=-1;scheduledAt=null;
        }
      }
      else if(wasOnSidebar){
        // Resize is layout, not travel. Anchor to the same thumb coordinates
        // immediately, even if reflow moves the footer beneath this scroll.
        pinnedByLayout=true;filteredY=scroll;distance=0;velocity=0;
        morph=smooth((scroll/Math.max(1,g.maximum)-.025)/.595);trainScale=scrollScale();cars=scrollCars(0);
        originVisited=false;scheduledAt=null;settled=0;doors=0;
      }
      else if(changedMode){
        // Mobile has no roaming service. Rejoin the actual scroll pose and retire
        // the desktop target; completion must use the new route distance.
        if(owner==='manual')paused=true;
        owner='scroll';desiredStop=-1;at=-1;scheduledAt=null;
        replan(scrollCars(scrollTarget()),true);
      }
      else replan(owner==='scroll'?scrollCars(scrollTarget()):parked(),owner==='scroll');
    },
    requestStop(i: StopIndex, _source: 'pointer'|'focus'|'activate') {
      if(destroyed || !Number.isInteger(i) || i<0 || i>3)return;
      if(!geometry){desiredStop=i;owner='manual';scheduledAt=null;return;}
      // Compact layouts select real contacts without a roaming service. Giving
      // them manual ownership freezes the scroll morph and feeds the narrow
      // segment spacing back into it, permanently collapsing the carriages.
      if(geometry.mobile){desiredStop=i;scheduledAt=null;return;}
      if(owner==='manual' && desiredStop===i)return;
      pinnedByLayout=false;owner='manual';scheduledAt=null;choose(i);velocity=0;
    },
    updateScroll(input: ScrollSample) {
      if(destroyed)return;
      // Lenis/native scrolling changes the camera, never an explicit contact
      // request. The host releases ownership only once the footer is out of
      // view AND keyboard focus is elsewhere (setVisible).
      if(input.documentY!==scroll)pinnedByLayout=false;
      scroll=input.documentY;
    },
    setVisible(value: boolean, focusWithin = false) {
      if(destroyed)return;visible=value;
      if(!value){scheduledAt=null;if(!focusWithin)reverseToScroll();}
    },
    pauseAuto() { paused=true;scheduledAt=null; },
    resumeAuto() { if(destroyed)return;paused=false;owner=desiredStop>=0?'auto':'scroll';scheduledAt=null; },
    setReducedMotion(value: boolean) {
      if(value===reduced)return;reduced=value;bridge=undefined;scheduledAt=null;doors=0;at=-1;velocity=0;
      if(geometry){
        distance=scrollTarget();
        if(value){cars=parked(-1);trainScale=footerScale();}
        else replan(owner==='scroll'||geometry.mobile?scrollCars(distance):parked(),owner==='scroll'||geometry.mobile);
      }
    },
    suspend() { last=undefined;scheduledAt=null; },
    resumeClock(nowMs: number) { last=nowMs; },
    step(nowMs: number) {
      if(destroyed || !geometry)return;
      if(last===undefined){last=nowMs;return;}
      const dt=Math.max(0,(nowMs-last)/1000);last=nowMs;
      if(dt===0){if(owner==='scroll'&&!bridge&&!reduced)cars=scrollCars(distance);return;}
      clock+=dt;
      if(reduced)return;
      // Keep the camera tied to native/Lenis scroll. Only the decorative train's
      // path distance has inertia; scrolling itself is never filtered here.
      filteredY=scroll;
      const goalScale=owner==='scroll'?scrollScale():footerScale();
      trainScale=mix(trainScale,goalScale,1-Math.exp(-dt*8));
      if(owner==='scroll')morph=smooth((clamp(filteredY/Math.max(1,geometry.maximum))-.025)/.595);
      let stopped=false;
      if(bridge){
        cars=bridge.returning
          ?transfer(bridge.from,scrollCars(scrollTarget()),bridge.duration)(clock-bridge.start)
          :bridge.sample(clock-bridge.start);
        if(clock-bridge.start>=bridge.duration){const returning=bridge.returning;bridge=undefined;if(returning){distance=scrollTarget();velocity=0;}else stopped=true;}
      } else if(owner==='scroll' || geometry.mobile) {
        const target=scrollTarget();
        // Exact critically damped response, independent of refresh rate. A fast
        // wheel/key jump cannot skip the bend or snap straight onto the origin.
        const omega=6,error=distance-target,decay=Math.exp(-omega*dt);
        const impulse=(velocity+omega*error)*dt;
        distance=target+(error+impulse)*decay;
        velocity=(velocity-omega*impulse)*decay;
        if(Math.abs(distance-target)<.01 && Math.abs(velocity)<.05){distance=target;velocity=0;}
        trainScale=scrollScale();
        cars=scrollCars(distance);
        // Differentiate path travel only. Document scroll is a camera offset,
        // not momentum to inject into a later Hermite transfer on resize/hover.
        const behind=scrollCars(distance-.5,scrollScale(distance-.5)),ahead=scrollCars(distance+.5,scrollScale(distance+.5));
        cars=cars.map((p,i)=>{
          const turn=((ahead[i].angle-behind[i].angle+540)%360)-180;
          const vx=(ahead[i].x-behind[i].x)*velocity,vy=(ahead[i].y-behind[i].y)*velocity;
          return {...p,vx,vy,va:clamp(turn*velocity,-600,600)};
        });
        stopped=distance===route.length && target===route.length && Math.abs(velocity)<.1;
        if(target<route.length){originVisited=false;scheduledAt=null;}
      } else stopped=true;
      if(owner!=='scroll'){
        const separation=Math.min(...cars.slice(1).map((p,i)=>Math.hypot(p.x-cars[i].x,p.y-cars[i].y)));
        trainScale=Math.min(trainScale,separation/(44/3));
        const spacing=separation/trainScale;
        // Couple the visual morph to articulated spacing; a synchronous contact
        // request must not grow the thumb segments beyond their couplings.
        morph=Math.min(mix(morph,1,1-Math.exp(-dt*8)),clamp((spacing-44/3)/(40-44/3)));
      }
      settled=stopped?settled+dt:0;
      if(stopped && settled>.2){if(owner==='scroll')originVisited=true;else if(!geometry.mobile)at=desiredStop;}
      const doorGoal=stopped && settled>.2 && visible?1:0;
      doors=mix(doors,doorGoal,1-Math.exp(-dt/(doorGoal?.20:.095)));if(Math.abs(doors-doorGoal)<.002)doors=doorGoal;
      const autoAllowed=visible && !geometry.mobile && owner!=='manual' && !paused;
      if(autoAllowed && stopped && settled>.2 && scheduledAt===null)scheduledAt=clock+3.6;
      if(autoAllowed && scheduledAt!==null && clock>=scheduledAt){owner='auto';choose(ORDER[next++%ORDER.length]);}
    },
    snapshot() { return {owner,desiredStop,at,doors,paused,visible,reduced,originVisited,morph,scale:trainScale,stationVisibility:geometry?[geometry.origin,...geometry.stops].map(p=>stationVisibility(p,cars,mix(16,36,morph)*trainScale,mix(5,22,morph)*trainScale)):[],travel:route?inverseSmoother(clamp(distance/route.length)):0,path:route?.path??'',pathLength:route?.length??0,distance,onScrollbar:owner==='scroll'&&!bridge&&distance<.01&&!reduced,mobile:geometry?.mobile??false,cars:cars.map(p=>({...p})),scheduledAt,phase:bridge?'transfer':at>=0?'arrived':originVisited?'origin':'approach'}; },
    needsFrame() { return !destroyed && !reduced && (!!bridge || filteredY!==scroll || Math.abs(velocity)>.01 || (owner==='scroll' && Math.abs(distance-scrollTarget())>.01) || (visible && ((owner!=='scroll'||scrollTarget()===route.length) && settled<.25 || doors>0 && doors<1 || scheduledAt!==null))); },
    destroy() { destroyed=true;bridge=undefined;scheduledAt=null; }
  };
  return api;
}
export type JourneyController = ReturnType<typeof createJourneyController>;
