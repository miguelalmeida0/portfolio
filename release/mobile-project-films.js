// Each film is a deterministic composition of time. GSAP owns the clock;
// visibility, dialog and user preferences decide which clocks may run.
const MOBILE_FILM_DURATION = [8.8, 8.4, 8.8, 10];
const filmClamp = n => Math.max(0, Math.min(1, n));
const filmPhase = (a, b, t) => filmClamp((t - a) / (b - a));
const filmEase = (a, b, t) => { const n = filmPhase(a, b, t); return n * n * (3 - 2 * n); };

function mobileFilmPlayback({mobile, hidden, dialog, paused, ratios}) {
  if (!mobile || hidden || dialog || paused) return [];
  // Two small previews can be fully visible together. Neither should freeze
  // simply because an earlier project has the same viewport coverage.
  return ratios.flatMap((ratio, i) => ratio > .18 ? [i] : []);
}

function mobileFilmFrame(id, seconds) {
  const i = ['needle', 'f24', 'second-voice', 'leu'].indexOf(id);
  const p = ((seconds % MOBILE_FILM_DURATION[i]) + MOBILE_FILM_DURATION[i]) % MOBILE_FILM_DURATION[i] / MOBILE_FILM_DURATION[i];
  if (id === 'needle') {
    const poses = [
      [[54,230,-15,1.3,1],[274,198,4,1.65,1],[486,230,16,1.3,1]],
      [[80,224,-7,1.4,1],[270,192,0,1.8,1],[464,224,7,1.4,1]],
      [[94,256,-18,.9,.4],[254,170,-3,2.2,1],[482,256,18,.9,.4]],
      [[144,242,-20,1.25,1],[274,198,4,1.65,1],[400,242,20,1.25,1]],
      [[54,230,-15,1.3,1],[274,198,4,1.65,1],[486,230,16,1.3,1]]
    ];
    const part = Math.min(3, Math.floor(p * 4)), u = filmEase(0, 1, p * 4 - part);
    return {p, cards: poses[part].map((a,j) => a.map((n,k) => n + (poses[part+1][j][k]-n)*u))};
  }
  if (id === 'f24') {
    const exit = 1-filmEase(.95,1,p), saved = filmEase(.83,.9,p)*exit;
    return {p, typed: Math.round(20*filmPhase(.025,.22,p)*exit), route:filmPhase(.23,.39,p),
      dry:filmEase(.31,.4,p)*exit, error:filmEase(.45,.5,p)*(1-filmEase(.67,.72,p)), saved,
      busy:(p>=.37&&p<.47)||(p>=.73&&p<.85), retry:p>=.5&&p<.73,
      press:Math.sin(Math.PI*filmPhase(.34,.4,p)) + Math.sin(Math.PI*filmPhase(.7,.76,p))};
  }
  if (id === 'second-voice') {
    const travel = filmEase(.08,.29,p), clear = 1-filmEase(.88,.98,p);
    return {p, travel, ghost:filmEase(.05,.09,p)*(1-filmEase(.27,.31,p)), clear,
      words:Array.from({length:13},(_,j)=>filmEase(.265+j*.014,.325+j*.014,p)*clear)};
  }
  const open = filmEase(.04,.25,p)*(1-filmEase(.78,.98,p));
  return {p, open, leaf:-166*open, roomScale:1.045-.045*open, light:.1+.12*open};
}

function createMobileProjectFilms(panels) {
  const button = document.querySelector('[data-film-toggle]');
  const mobile = matchMedia('(max-width:900px)'), reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const dialog = document.querySelector('#case-dialog');
  if (!window.gsap || !window.IntersectionObserver || !button) return {sync(){}, stop(){}};
  const playRequested = new URLSearchParams(location.search).get('motion') === 'play';
  let enabled = false, paused = false, motionAllowed = playRequested;
  try {
    paused = !playRequested && sessionStorage.getItem('portfolio-previews-paused') === 'true';
    motionAllowed ||= sessionStorage.getItem('portfolio-previews-motion-allowed') === 'true';
    if (playRequested) {
      sessionStorage.setItem('portfolio-previews-paused','false');
      sessionStorage.setItem('portfolio-previews-motion-allowed','true');
    }
  } catch {}
  const scenes = panels.map((panel,i) => {
    const host=panel.querySelector('.project-scene'), $=s=>host.querySelector(s);
    const stillCards=panel.id==='needle'?mobileFilmFrame('needle',0).cards:null;
    // These are visual layers inside the existing semantic preview button.
    if (panel.id==='second-voice') {
      const transfer=document.createElement('span'); transfer.className='sv-transfer';transfer.textContent='Rain';
      $('.scene-world').append(transfer);
    }
    if (panel.id==='leu') {
      const glow=document.createElement('span');glow.className='leu-window-glow';
      $('.leu-arch').append(glow);
      const leaf=document.createElement('span');leaf.className='leu-leaf';
      leaf.innerHTML='<span class="leu-leaf-rule"></span><span class="leu-leaf-copy">Your next chapter can wait.<br><em>Take a minute here.</em></span><span class="leu-leaf-page">leu.</span>';
      $('.scene-world').append(leaf);
    }
    if (panel.id==='f24') {
      const tick=document.createElementNS('http://www.w3.org/2000/svg','svg');
      tick.setAttribute('viewBox','0 0 24 24');tick.setAttribute('class','film-check');
      tick.innerHTML='<path d="m5 12 5 5 9-10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
      $('.rule-success i').append(tick);
    }
    const owned=[...host.querySelectorAll('.art-orbit,.needle-search,.rule-typed,.demo-caret,.rule-error,.rule-success,.rule-save,.rule-status,.save-copy,.save-spinner,.save-check,.rule-preview,.dry-copy,.preview-check,.preview-dot,.rule-recipient,.rule-connector,.sv-dark,.sv-draft-side,.sv-rewrite-side,.sv-result>span,.sv-author,.sv-strength-dot,.sv-transfer,.sv-seam,.leu-room,.leu-arch,.leu-scene-copy,.leu-leaf,.leu-window-glow')];
    let baseline=[];
    const save=()=>{baseline=owned.map(el=>[el,el.getAttribute('style')]);};
    const restore=()=>baseline.forEach(([el,style])=>style===null?el.removeAttribute('style'):el.setAttribute('style',style));
    const transform=(selector,value)=>$(selector).style.transform=value;
    const opacity=(selector,value)=>$(selector).style.opacity=value;
    const text=(selector,value)=>{const el=$(selector);if(el.textContent!==value)el.textContent=value;};
    const render=t=>{
      const f=mobileFilmFrame(panel.id,t);host.dataset.filmTime=t.toFixed(3);
      // Reduced motion changes the composition, not whether it autoplays.
      // Gentle previews use opacity only: no page turns, travel or zoom.
      const gentle=reduced.matches&&!motionAllowed;
      const move=(selector,value)=>transform(selector,gentle?'none':value);
      if(panel.id==='needle') {
        const cards=gentle?stillCards:f.cards;
        [0,1,4].forEach((n,j)=>{
          const el=$(`[data-orbit="${n}"]`),[x,y,angle,scale,alpha]=cards[j];
          el.style.setProperty('--film-transform',`translate3d(${x}px,${y}px,0) rotate(${angle}deg) rotateY(${-angle*.6}deg) scale(${scale})`);
          el.style.opacity=gentle?.45+.55*(.5+.5*Math.cos((f.p*2-j/3)*Math.PI*2)):alpha;
        });
      } else if(panel.id==='f24') {
        text('.rule-typed','Severity is Critical'.slice(0,gentle?20:f.typed));
        opacity('.demo-caret',!gentle&&f.typed<20?1:0);opacity('.rule-error',f.error);opacity('.rule-success',f.saved);
        move('.rule-error',`translateY(${8*(1-f.error)}px)`);move('.rule-success',`translateY(${8*(1-f.saved)}px)`);
        move('.rule-save',`scale(${1-.06*f.press})`);
        $('.rule-save').style.background=f.saved>.8?'#346747':'#244f8e';
        text('.save-copy',f.saved>.8?'Saved':f.busy?'Saving…':f.retry?'Try again':'Save rule');
        text('.rule-status',f.saved>.8?'Saved':f.busy?'Saving…':'Editing');
        $('.save-spinner').style.display=f.busy?'block':'none';$('.save-check').style.display=f.saved>.8?'block':'none';
        $('.rule-success').style.setProperty('--film-check',1-f.saved);
        $('.rule-connector').style.setProperty('--signal-y',`${f.route*30}px`);
        $('.rule-connector').style.setProperty('--signal-alpha',!gentle&&f.route>0&&f.route<1?1:0);
        $('.rule-recipient').style.borderColor=f.dry>.8?'#6c9871':'#d4dce8';
        opacity('.rule-preview',gentle?.2+.8*(.5-.5*Math.cos(f.p*4*Math.PI)):f.dry);move('.rule-preview',`translateY(${12*(1-f.dry)}px)`);
        opacity('.preview-check',f.dry);text('.dry-copy','Condition matched · no notification sent');
        $('.preview-dot').style.background='#408452';
      } else if(panel.id==='second-voice') {
        transform('.sv-dark','none');transform('.sv-draft-side','none');transform('.sv-rewrite-side','none');
        move('.sv-transfer',`translate3d(${90+260*f.travel}px,${330-65*Math.sin(f.travel*Math.PI)}px,0) rotate(${-8*Math.sin(f.travel*Math.PI)}deg)`);
        opacity('.sv-transfer',f.ghost);$('.sv-transfer').style.color=f.travel>.885?'#eceee0':'#293d32';
        [...host.querySelectorAll('.sv-result>span')].forEach((el,j)=>{
          const r=gentle?.2+.8*Math.sin(f.p*2*Math.PI)**2:f.words[j];el.style.opacity=r;el.style.transform=gentle?'none':`translateY(${24*(1-r)}px) rotate(${2*(1-r)}deg)`;
        });
        opacity('.sv-author',filmEase(.53,.62,f.p)*f.clear);
        move('.sv-strength-dot',`translateX(${-140+240*filmEase(.1,.57,f.p)*f.clear}px)`);
        move('.sv-seam',`scaleY(${.25+.75*filmEase(.04,.3,f.p)*f.clear})`);
      } else {
        move('.leu-leaf',`perspective(1000px) rotateY(${f.leaf}deg)`);
        opacity('.leu-leaf',1-filmEase(80,105,-f.leaf));
        move('.leu-room',`scale(${f.roomScale})`);transform('.leu-arch','none');
        opacity('.leu-window-glow',.08+.52*(.5-.5*Math.cos(f.p*4*Math.PI)));
        transform('.leu-scene-copy','none');opacity('.leu-scene-copy',1);
      }
    };
    const clock={t:0};
    const timeline=gsap.to(clock,{t:MOBILE_FILM_DURATION[i],duration:MOBILE_FILM_DURATION[i],repeat:-1,ease:'none',paused:true,onUpdate:()=>render(clock.t)});
    return {host,clock,timeline,render,save,restore,ratio:0};
  });
  const update=()=>{
    const active=enabled?mobileFilmPlayback({mobile:mobile.matches,hidden:document.hidden,dialog:dialog.open,paused,ratios:scenes.map(s=>s.ratio)}):[];
    scenes.forEach((scene,i)=>{
      const playing=active.includes(i);
      scene.host.dataset.filmPlaying=String(playing);
      scene.timeline.paused(!playing);
    });
    const blocked=paused;
    button.setAttribute('aria-pressed',String(blocked));button.querySelector('span').textContent=blocked?'Play motion':'Pause motion';
    button.setAttribute('aria-label',blocked?'Play project preview animations':'Pause project preview animations');
    button.title=reduced.matches&&!motionAllowed?'Reduced motion: previews use gentle fades.':'';
  };
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{const scene=scenes.find(s=>s.host===entry.target);if(scene)scene.ratio=entry.isIntersecting?entry.intersectionRatio:0;});
    update();
  },{threshold:[0,.18,.3,.45,.6,.75,.9,1],rootMargin:'-72px 0px 0px 0px'});
  scenes.forEach(s=>observer.observe(s.host));
  button.addEventListener('click',()=>{
    paused=!paused;
    try{
      sessionStorage.setItem('portfolio-previews-paused',String(paused));
      sessionStorage.setItem('portfolio-previews-motion-allowed',String(motionAllowed));
    }catch{}
    sync();
  });
  document.addEventListener('visibilitychange',update);
  new MutationObserver(update).observe(dialog,{attributes:true,attributeFilter:['open']});
  const stop=()=>{
    enabled=false;button.hidden=true;
    scenes.forEach(s=>{s.timeline.pause();s.host.classList.remove('mobile-film','film-opt-in');delete s.host.dataset.filmPlaying;s.restore();});
  };
  const sync=()=>{
    if(!mobile.matches){stop();update();return;}
    button.hidden=false;
    if(!enabled){
      enabled=true;
      scenes.forEach(s=>{s.save();s.host.classList.add('mobile-film');s.render(s.clock.t);});
    }
    scenes.forEach(s=>s.host.classList.toggle('film-opt-in',motionAllowed));update();
  };
  mobile.addEventListener('change',sync);
  reduced.addEventListener('change',()=>{
    if(reduced.matches){
      motionAllowed=false;
      try{sessionStorage.removeItem('portfolio-previews-motion-allowed');}catch{}
    }
    sync();
  });
  addEventListener('pagehide',()=>scenes.forEach(s=>s.timeline.pause()));
  addEventListener('pageshow',update);
  return {sync,stop};
}
