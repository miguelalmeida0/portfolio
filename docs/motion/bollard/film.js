const c=document.querySelector('canvas'),ctx=c.getContext('2d');
const C={paper:'#f5f5ef',ink:'#20231f',muted:'#686c65',blue:'#3937f5',amber:'#b17b28',line:'#d9dcd3'};
const clamp=v=>Math.max(0,Math.min(1,v));
const ease=v=>{v=clamp(v);return v*v*v*(v*(v*6-15)+10)};
const phase=(t,a,b)=>ease((t-a)/(b-a));
const mix=(a,b,p)=>a+(b-a)*p;
function text(s,x,y,size=32,color=C.ink,weight=450,align='left'){ctx.fillStyle=color;ctx.font=`${weight} ${size}px Figtree`;ctx.textAlign=align;ctx.fillText(s,x,y);}
function line(x,y,x2,y2,color=C.line,w=2){ctx.strokeStyle=color;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.stroke()}
function rect(x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke()}}
function dot(x,y,r,fill,stroke){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.lineWidth=2;ctx.strokeStyle=stroke;ctx.stroke()}}
function group(alpha,x,y,fn){ctx.save();ctx.globalAlpha*=clamp(alpha);ctx.translate(x,y);fn();ctx.restore()}
function draw(t){
 ctx.clearRect(0,0,1200,900);ctx.fillStyle=C.paper;ctx.fillRect(0,0,1200,900);
 const a=phase(t,3.1,4.2),b=phase(t,7.3,8.5),d=phase(t,11.7,13),r=phase(t,16.5,18);
 // A shared typographic anchor carries the request into the cost comparison.
 group((1-b)*(1-r),-1200*b,-20*a,()=>{
 text('Nordstahl’s request',80,230,38,C.muted);
 text('+€62',mix(70,80,a),mix(500,405,a),mix(220,126,a),C.ink,550);
 text('/t',mix(625,412,a),mix(500,405,a),mix(72,48,a),C.muted);
 group(1-phase(t,3.1,3.45),0,22*(1-phase(t,0,1.2)),()=>{text('A price increase needs a reason.',80,610,42);text('Bollard puts the evidence beside it.',80,668,32,C.muted)});
 group(phase(t,3.6,4.2),0,40*(1-a),()=>{
 line(595,260,595,600);
 text('Supported by costs',660,250,32,C.muted);
 text('+€23',650,405,126,C.blue,550);text('/t',990,405,48,C.blue);
 rect(80,460,430,12,6,'#d7d9d0');rect(660,460,430*23/62,12,6,C.blue);
 text('12 months of market evidence',80,590,38,C.ink,500);
 ['Ore','Coal','Gas','Power','Carbon'].forEach((s,i)=>{const k=phase(t,4.4+i*.14,5.2+i*.14);group(k,0,18*(1-k),()=>{dot(96+i*215,655,6,C.blue);text(s,116+i*215,665,30,C.muted)})});
 });
 });
 // Evidence becomes the decision surface; labels match the real product.
 group(b*(1-d)*(1-r),1200*(1-b)-1200*d,0,()=>{
 text('A counterproposal you can explain.',80,235,48,C.ink,500);
 rect(80,302,1040,385,28,'#fff',C.line);
 text('NORDSTAHL · COUNTERPROPOSAL',122,364,26,C.muted,550);
 text('Counter at +€23/t.',122,450,76,C.ink,550);
 text('Keep the quarterly index.',122,514,42,C.muted);
 line(122,555,1078,555);
 text('Your decision. Before anything moves.',122,627,30,C.ink);
 const p=phase(t,10.2,10.65);rect(900,580,178,68,16,p>.5?C.ink:C.blue);
 text('Approve',989,625,30,'#fff',550,'center');
 // An understated cursor shows the approval is an explicit human action.
 const enter=phase(t,9.1,10.15);ctx.save();ctx.translate(mix(1160,1035,enter),mix(770,626,enter));ctx.scale(1-.12*p,1-.12*p);ctx.fillStyle=C.ink;ctx.strokeStyle='white';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,36);ctx.lineTo(10,26);ctx.lineTo(18,42);ctx.lineTo(27,37);ctx.lineTo(19,22);ctx.lineTo(33,21);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
 });
 // Dots retain the app's savings language, without pretending this is a realised result.
 group(d*(1-r),1200*(1-d)-1200*r,0,()=>{
 text('A stronger position at the table.',80,230,48,C.ink,500);
 text('€1.19M',75,410,144,C.blue,550);
 text('Modelled annual opportunity',80,474,34,C.muted);
 const count=66;
 for(let i=0;i<count;i++){let row=Math.floor(i/11),col=i%11;let u=phase(t,12.3+i*.018,13.9+i*.018);let ang=i*2.399963;let rr=150*Math.sqrt(i/count);dot(mix(900+Math.cos(ang)*rr,105+col*96,u),mix(390+Math.sin(ang)*rr,562+row*32,u),mix(5,8,u),i<24?C.blue:'#dedfd6');}
 text('Evidence first. Human approval always.',80,802,34,C.ink,500);
 });
 // Return through the same cost request: loop endpoints share an identical composition.
 if(r>0) group(r,1200*(1-r),0,()=>{text('Nordstahl’s request',80,230,38,C.muted);text('+€62',70,500,220,C.ink,550);text('/t',625,500,72,C.muted);text('A price increase needs a reason.',80,632,42);text('Bollard puts the evidence beside it.',80,690,32,C.muted)});
 text('Bollard',80,96,39,C.ink,650);text('THE NEGOTIATION',1120,94,23,C.muted,550,'right');line(80,135,1120,135);
 text('Fictional procurement scenario',80,856,24,C.muted);text('01 — 04',1120,856,24,C.muted,450,'right');
}
document.fonts.load('500 40px Figtree').then(()=>{const proxy={t:0};const tl=gsap.timeline({paused:true});tl.to(proxy,{t:18,duration:18,ease:'none',onUpdate:()=>draw(proxy.t)},0);window.__timelines=window.__timelines||{};window.__timelines.main=tl;draw(0)});
