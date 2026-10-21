export type Point = { x: number; y: number };
export const SCROLLBAR_EDGE_INSET = 12;
export type Pose = Point & { angle: number; vx: number; vy: number; va: number };
export type Geometry = { origin: Point; stops: Point[]; width: number; height: number; maximum: number; footerTop: number; footerBottom: number; mobile: boolean };
export const clamp = (n: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n));
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (t: number) => { t = clamp(t); return t * t * (3 - 2 * t); };
export const smoother = (t: number) => { t=clamp(t);return t*t*t*(t*(t*6-15)+10); };
export function inverseSmoother(value: number) {
  if(value<=0)return 0;if(value>=1)return 1;
  let a=0,b=1;for(let i=0;i<22;i++){const m=(a+b)/2;if(smoother(m)<value)a=m;else b=m;}return(a+b)/2;
}
export const still = (p: Point, angle = 0): Pose => ({ ...p, angle, vx: 0, vy: 0, va: 0 });

/** Clearance around the actual oriented bodies, including a short lead-in.
 * A ring contracts/fades before contact and reforms once the last car clears. */
export function stationVisibility(station: Point, cars: Pose[], length: number, height: number) {
  let distance=Infinity;
  for(const car of cars){
    const angle=car.angle*Math.PI/180,cos=Math.cos(angle),sin=Math.sin(angle);
    for(const ahead of [0,.12]){
      const x=station.x-car.x-car.vx*ahead,y=station.y-car.y-car.vy*ahead;
      const dx=Math.max(0,Math.abs(x*cos+y*sin)-length/2);
      const dy=Math.max(0,Math.abs(-x*sin+y*cos)-height/2);
      distance=Math.min(distance,Math.hypot(dx,dy));
    }
  }
  return smooth((distance-16)/28);
}

/** Layout-only arc table. No DOM/SVG measurements in the animation loop. */
export function approach(g: Geometry) {
  const edge = g.width - SCROLLBAR_EDGE_INSET, exit = g.origin.x - (g.mobile ? 27 : 52);
  // Reserve space for the rotated carriage body, not just its centerline.
  const radius = Math.max(g.mobile ? 21 : 25, Math.min(g.mobile ? 47 : 86, exit - (g.mobile ? 18 : 24)));
  const y = g.origin.y, bend = y - radius * 2, upper = Math.min(bend-36,y-(g.mobile?154:196));
  const span=edge-exit,firstBend=Math.min(g.mobile?70:130,(edge-Math.max(g.mobile?16:24,exit-50))*.25);
  let point = { x: edge, y: y - (g.mobile ? 440 : 560) };
  let path=`M${point.x},${point.y}`;
  const points = [{ ...point, distance: 0 }];
  let length = 0;
  function curve(b: Point, c: Point, d: Point) {
    path+=` C${b.x},${b.y} ${c.x},${c.y} ${d.x},${d.y}`;
    const a = point;
    for (let i = 1; i <= 120; i++) {
      const t = i / 120, u = 1 - t;
      const p = { x: u*u*u*a.x + 3*u*u*t*b.x + 3*u*t*t*c.x + t*t*t*d.x, y: u*u*u*a.y + 3*u*u*t*b.y + 3*u*t*t*c.y + t*t*t*d.y };
      length += Math.hypot(p.x - point.x, p.y - point.y); points.push({ ...p, distance: length }); point = p;
    }
  }
  function line(p:Point){path+=` L${p.x},${p.y}`;length+=Math.hypot(p.x-point.x,p.y-point.y);point=p;points.push({...p,distance:length});}
  curve({x:edge,y:upper},{x:edge-firstBend*.5,y:upper},{x:edge-firstBend,y:upper});
  curve({x:edge-span*.32,y:upper},{x:edge-span*.40,y:bend},{x:edge-span*.61,y:bend});
  line({x:exit,y:bend});
  const turnStart=length;
  curve({x:exit-radius*.66,y:bend},{x:exit-radius,y:bend},{x:exit-radius,y:y-radius});
  curve({x:exit-radius,y},{x:exit-radius*.66,y},{x:exit,y});
  line(g.origin);
  function at(d: number): Point & { angle: number } {
    if(d <= 0) return {x:edge,y:points[0].y+d,angle:90};
    if(d >= length) return {x:g.origin.x+d-length,y,angle:0};
    let lo=0,hi=points.length-1;
    while(hi-lo>1){const m=(lo+hi)>>1;if(points[m].distance<d)lo=m;else hi=m;}
    const a=points[lo],b=points[hi],t=(d-a.distance)/(b.distance-a.distance || 1);
    let angle=Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI;if(angle<0)angle+=360;
    return {x:mix(a.x,b.x,t),y:mix(a.y,b.y,t),angle};
  }
  // Match the real 44px scroll thumb inside its 12px top/bottom hit area.
  const top=34,bottom=g.height-34,travel=bottom-top;
  const start=(points[0].y-top)/(1+travel/Math.max(1,g.maximum));
  const end=Math.min(g.maximum-18,Math.max(start+400,g.origin.y-g.height*(g.mobile?.47:.62)));
  return { length, at, start, end:Math.max(start+1,end),turnStart,path,edge,top,bottom,travel };
}

/** Cubic Hermite transfer: every carriage keeps its rendered pose and derivative. */
export function transfer(from: Pose[], to: Pose[], seconds: number) {
  // Abrupt scroll release can legitimately have a high instantaneous derivative.
  // Keep that derivative at t=0, but brake its displacement contribution quickly
  // instead of carrying it through the entire transfer and throwing cars offscreen.
  const speed=Math.max(...from.map(p=>Math.hypot(p.vx,p.vy)));
  const braking=speed>600?Math.min(.18,180/speed):Infinity;
  const ends = to.map((p,i)=>({...p,angle:from[i].angle+((p.angle-from[i].angle+540)%360)-180}));
  const relative = from.map((p,i)=>{
    const dx=p.x-from[1].x,dy=p.y-from[1].y,dvx=p.vx-from[1].vx,dvy=p.vy-from[1].vy;
    const r=Math.hypot(dx,dy),angle=Math.atan2(dy,dx);
    const tx=to[i].x-to[1].x,ty=to[i].y-to[1].y;
    const targetAngle=angle+Math.atan2(Math.sin(Math.atan2(ty,tx)-angle),Math.cos(Math.atan2(ty,tx)-angle));
    return {r,angle,targetR:Math.hypot(tx,ty),targetAngle,vr:r?(dx*dvx+dy*dvy)/r:0,va:r?(dx*dvy-dy*dvx)/(r*r):0};
  });
  return (elapsed: number): Pose[] => {
    if(elapsed<=0)return from.map(p=>({...p}));
    const t=clamp(elapsed/seconds),t2=t*t,t3=t2*t;
    const elapsedClamped=t*seconds,decay=Math.exp(-elapsedClamped/braking);
    const axis=(a:number,b:number,v:number) => (2*t3-3*t2+1)*a+(t3-2*t2+t)*seconds*v*decay+(-2*t3+3*t2)*b;
    const velocity=(a:number,b:number,v:number) => ((6*t2-6*t)*a+(-6*t2+6*t)*b)/seconds+v*decay*((3*t2-4*t+1)-(t3-2*t2+t)*seconds/braking);
    const middle=from[1],end=ends[1];
    const x=axis(middle.x,end.x,middle.vx),y=axis(middle.y,end.y,middle.vy);
    const vx=velocity(middle.x,end.x,middle.vx),vy=velocity(middle.y,end.y,middle.vy);
    return from.map((p,i)=>{
      const q=ends[i],r=relative[i];
      // Interpolate articulated offsets in polar coordinates: a 90-degree turn
      // rotates the couplings rather than shrinking their Cartesian chord.
      const radius=axis(r.r,r.targetR,r.vr),angle=axis(r.angle,r.targetAngle,r.va);
      const radialV=velocity(r.r,r.targetR,r.vr),angularV=velocity(r.angle,r.targetAngle,r.va);
      const cos=Math.cos(angle),sin=Math.sin(angle);
      return {x:x+radius*cos,y:y+radius*sin,angle:axis(p.angle,q.angle,p.va),vx:vx+radialV*cos-radius*sin*angularV,vy:vy+radialV*sin+radius*cos*angularV,va:velocity(p.angle,q.angle,p.va)};
    });
  };
}

/** A contact diversion joins the rail before stopping. Arc-length offsets make
 * the three existing cars follow the bend instead of falling as a rigid group. */
export function dockTransfer(from: Pose[], to: Pose[], seconds: number) {
  const start=from[1],end=to[1],dx=end.x-start.x,dy=end.y-start.y;
  if(Math.abs(dy)<12 && from.every(p=>Math.abs(Math.sin(p.angle*Math.PI/180))<.12))return transfer(from,to,seconds);
  const direction=dx<0?-1:1,distance=Math.hypot(dx,dy);
  const run=clamp(Math.abs(dx)*.22,72,120),lead=clamp(distance*.22,36,110);
  const heading=start.angle*Math.PI/180;
  const speedAtEntry=Math.hypot(start.vx,start.vy);
  const headingSign=Math.cos(heading)*dx+Math.sin(heading)*dy<0?-1:1;
  // Use actual travel momentum, not carriage facing: a train can reverse.
  // Reversing this tangent at a fast bend creates a cusp and a rotation whip.
  const tangent=speedAtEntry>40?{x:start.vx/speedAtEntry,y:start.vy/speedAtEntry}:{x:Math.cos(heading)*headingSign,y:Math.sin(heading)*headingSign};
  const merge={x:end.x-direction*run,y:end.y};
  const b={x:start.x+tangent.x*lead,y:start.y+tangent.y*lead};
  const c={x:merge.x-direction*lead,y:merge.y};
  const points=[{x:start.x,y:start.y,distance:0}];
  let length=0;
  for(let i=1;i<=120;i++){
    const t=i/120,u=1-t,previous=points[points.length-1];
    const x=u*u*u*start.x+3*u*u*t*b.x+3*u*t*t*c.x+t*t*t*merge.x;
    const y=u*u*u*start.y+3*u*u*t*b.y+3*u*t*t*c.y+t*t*t*merge.y;
    length+=Math.hypot(x-previous.x,y-previous.y);points.push({x,y,distance:length});
  }
  const bendLength=length;length+=run;
  function at(d:number){
    if(d<=0)return{x:start.x+tangent.x*d,y:start.y+tangent.y*d};
    if(d>=bendLength)return{x:merge.x+direction*(d-bendLength),y:end.y};
    let lo=0,hi=points.length-1;while(hi-lo>1){const m=(lo+hi)>>1;if(points[m].distance<d)lo=m;else hi=m;}
    const a=points[lo],b=points[hi],t=(d-a.distance)/(b.distance-a.distance||1);
    return{x:mix(a.x,b.x,t),y:mix(a.y,b.y,t)};
  }
  const speed=Math.max(...from.map(p=>Math.hypot(p.vx,p.vy))),braking=speed>600?Math.min(.18,180/speed):.18;
  function poses(elapsed:number){
    const t=clamp(elapsed/seconds),travel=smoother(t)*length,join=smoother(t/.42);
    const center=at(travel),inertia=elapsed*Math.pow(1-t,3)*Math.exp(-elapsed/braking);
    return from.map((p,i)=>{
      const offset=(to[i].x-end.x)*direction,car=at(travel+offset);
      // Turn each body progressively as its own bogie enters the merge. Using
      // an instantaneous cubic tangent here can whip at a tight turning point.
      const angle=p.angle+((to[i].angle-p.angle+540)%360)-180;
      const alignment=smoother((travel+offset)/bendLength)*join;
      const initialAngle=Math.atan2(p.y-start.y,p.x-start.x),railAngle=Math.atan2(car.y-center.y,car.x-center.x);
      const couplingAngle=initialAngle+Math.atan2(Math.sin(railAngle-initialAngle),Math.cos(railAngle-initialAngle))*join;
      const radius=mix(Math.hypot(p.x-start.x,p.y-start.y),Math.hypot(car.x-center.x,car.y-center.y),join);
      return{x:center.x+radius*Math.cos(couplingAngle)+p.vx*inertia,
        y:center.y+radius*Math.sin(couplingAngle)+p.vy*inertia,
        angle:mix(p.angle,angle,alignment)+p.va*inertia};
    });
  }
  return(elapsed:number):Pose[]=>{
    if(elapsed<=0)return from.map(p=>({...p}));
    if(elapsed>=seconds)return to.map(p=>({...p}));
    const step=Math.min(.0001,elapsed,seconds-elapsed),before=poses(elapsed-step),after=poses(elapsed+step);
    return poses(elapsed).map((p,i)=>({...p,vx:(after[i].x-before[i].x)/(2*step),vy:(after[i].y-before[i].y)/(2*step),va:(after[i].angle-before[i].angle)/(2*step)}));
  };
}
