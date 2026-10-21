/**
 * Fragment shader for the body turn.
 *
 * Model: every row of the figure is an ellipse — round at the head (depth 0.92 × width),
 * flatter at the torso (0.5 × width) — whose width and centre follow the silhouette profile.
 * The ellipse rotates about the vertical axis. For each screen pixel we solve which point of the
 * ellipse faces the camera; front-hemisphere points sample the front photo, back-hemisphere
 * points sample the back photo. Nothing is cross-faded except a hair-thin join at the sides.
 *
 * Relighting: a point is shaded by how it faces the key light now, divided by how it faced the
 * light when it was photographed, so at rest the photos are reproduced exactly.
 * Motion blur: five taps along x, scaled by how fast that row is turning at this instant.
 * The head leads the shoulders without shearing the torso (delay only changes across the neck).
 */
export const VERTEX_SHADER = `attribute vec2 p;varying vec2 v;
void main(){v=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}`;

export const FRAGMENT_SHADER = `precision highp float;
varying vec2 v;
uniform sampler2D tF,tB,pF,pB;
uniform float a0,pr,lead,blur,lx,amb;
const float PI=3.14159265;
float dec(vec2 h){return (h.x*65280.+h.y*255.)/65535.;}
vec2 worldNormal(float th,float a,float R,float D){
  vec2 n=normalize(vec2(sin(th)/R,cos(th)/D));
  return vec2(n.x*cos(a)+n.y*sin(a),-n.x*sin(a)+n.y*cos(a));
}
float lit(vec2 w){vec2 L=normalize(vec2(lx,1.));return amb+(1.-amb)*max(dot(w,L),0.);}
void main(){
  float y=v.y;
  /* per-row progress: head rows lead, torso rows follow, neck blends */
  float q=clamp(pr*(1.+lead)-lead*smoothstep(.27,.45,y),0.,1.);
  float e=q<.5?4.*q*q*q:1.-pow(-2.*q+2.,3.)/2.;
  float de=q<.5?12.*q*q:3.*pow(2.-2.*q,2.);
  float rb=blur*de/1.5;
  float a=a0+PI*e, turning=sin(PI*e);
  vec4 F=texture2D(pF,vec2(y,.5)),B=texture2D(pB,vec2(y,.5));
  float cF=dec(F.rg),hF=dec(F.ba),cB=dec(B.rg),hB=dec(B.ba);
  float t=.5-.5*cos(a);
  float c=mix(cF,cB,t),R=max(mix(hF,hB,t),.003);
  float D=R*mix(.92,.5,smoothstep(.16,.32,R));
  float ca=cos(a),sa=sin(a);
  float A=sqrt(R*R*ca*ca+D*D*sa*sa),del=atan(D*sa,R*ca);
  float band=.0001+.06*turning;
  vec4 acc=vec4(0.);
  for(int i=0;i<5;i++){
    float x=v.x+(float(i)-2.)*.5*rb;
    float s=(x-c)/A;
    if(abs(s)<1.){
      float uu=asin(s),th=uu-del;
      if(-R*sin(th)*sa+D*cos(th)*ca<0.)th=PI-uu-del;
      th=mod(th+PI,2.*PI)-PI;
      float sq=1.-.12*turning;
      float xF=cF+hF*sq*sin(th),xB=cB-hB*sq*sin(th);
      vec4 f=abs(xF-.5)<.5?texture2D(tF,vec2(xF,y)):vec4(0.);
      vec4 b=abs(xB-.5)<.5?texture2D(tB,vec2(xB,y)):vec4(0.);
      float L=lit(worldNormal(th,a,R,D));
      f.rgb*=clamp(L/lit(worldNormal(th,0.,R,D)),.42,1.06);
      b.rgb*=clamp(L/lit(worldNormal(th,PI,R,D)),.42,1.06);
      float ct=cos(th);
      vec4 col=mix(b,f,smoothstep(-band,band,ct));
      /* both photos run out at the sides of the body: fill there from the other view, never in the face */
      vec4 other=ct>0.?b:f;
      col+=(1.-col.a)*other*turning*(1.-smoothstep(.15,.6,abs(ct)));
      acc+=col;
    }
  }
  gl_FragColor=acc/5.;
}`;
