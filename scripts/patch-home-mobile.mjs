import { readFileSync } from 'node:fs';

// Keep the reviewed self-contained release and the responsive additions separate.
// Both development and production run the same fail-closed transformation.
export function patchHomeMobile(html) {
  if (html.includes('id="role-first-mobile"')) return html;
  const replace = (before, after) => {
    if (html.split(before).length !== 2) throw new Error(`Unexpected mobile homepage source: ${before.slice(0, 90)}`);
    html = html.replace(before, after);
  };
  const arrow = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 15 15 5M5 5h10v10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  // Equal icon from Lucide (@lucide/svelte), ISC licence. Portfolio arrows reuse its existing asset.
  const menuIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" x2="19" y1="9" y2="9"/><line x1="5" x2="19" y1="15" y2="15"/></svg>';
  replace('</svg></a><div class="nav-end">', '</svg><span class="brand-name" aria-hidden="true">Miguel Almeida</span></a><div class="nav-end">');
  replace('</div></div></nav>\n<main>', `</div></div><details class="mobile-menu"><summary>Menu ${menuIcon}</summary><div class="mobile-menu-panel"><a href="#work">Work</a><a href="#about">About</a><a href="https://miguelalmeida.is-a.dev/cv/pdf" target="_blank" rel="noopener">View CV</a><a href="mailto:miguelalmeida1592@gmail.com">Get in touch</a></div></details></nav>\n<main>`);
  replace('</span></span></h1></div>', '</span></span></h1><h1 class="mobile-role"><span class="role-pair"><span>Frontend</span> <span>engineer</span></span><span class="role-pair"><span>&amp; design</span> <span>engineer.</span></span></h1></div>');
  replace('<span class="hero-stack"> · React', '<span class="hero-stack"><span class="stack-divider"> · </span>React');
  replace(' </div>\n </div>\n\n<div class="hand left"', ` </div><div class="hero-actions"><a class="button" href="https://miguelalmeida.is-a.dev/cv/pdf" target="_blank" rel="noopener">View CV ${arrow}</a><a class="button solid" href="mailto:miguelalmeida1592@gmail.com">Get in touch ${arrow}</a></div>\n </div>\n\n<div class="hand left"`);
  replace('<p>F24 and four independent projects.</p></div>', '<p>F24 and four independent projects.</p><span class="work-count" aria-label="Five projects">01—05</span></div>');
  // Public case-study routes remain available when script execution is disabled.
  let caseLinks = 0;
  html = html.replace(/(<button class="button" type="button" data-case="([^"]+)" aria-label="Read ([^"]+) case study">)Read case study<\/button>/g, (_, open, id, title) => {
    caseLinks++;
    if (id === 'bollard') {
      const data = JSON.parse(html.match(/^const CASE_DATA=(.*);$/m)[1])[id];
      return `${open}Read case study</button><noscript><details class="bollard-case-fallback"><summary>Read Bollard case study</summary><p>${data.summary}</p>${data.sections.map(([heading, text])=>`<section><h4>${heading}</h4><p>${text}</p></section>`).join('')}</details></noscript>`;
    }
    return `${open}Read case study <span class="mobile-case-arrow">${arrow}</span></button><a class="project-case-fallback" href="https://miguelalmeida.is-a.dev/work/${id}" aria-label="Read ${title} case study">Read case study</a>`;
  });
  if (caseLinks !== 5) throw new Error(`Expected five case-study actions, found ${caseLinks}`);
  // Phone films must never select the tablet/desktop layout. Height cannot
  // disable the original gallery on laptops with browser chrome or DevTools.
  replace("const reduced=matchMedia('(prefers-reduced-motion:reduce)'),wide=matchMedia('(min-width:901px) and (min-height:720px)');", "const mobileLayout=matchMedia('(max-width:767px)');\n const reduced=matchMedia('(prefers-reduced-motion:reduce)'),wide=matchMedia('(min-width:768px)');");
  let films = readFileSync(new URL('../release/mobile-project-films.js', import.meta.url), 'utf8');
  const assets = JSON.parse(readFileSync(new URL('../release/needle-film-assets.json', import.meta.url), 'utf8'));
  const assetSlot = 'const NEEDLE_FILM_ART = [];';
  if (films.split(assetSlot).length !== 2 || assets.length !== 6) throw new Error('Unexpected Needle film asset contract');
  films = films.replace(assetSlot, `const NEEDLE_FILM_ART = ${JSON.stringify(assets)};`);
  replace('function createProjectScenes(panels){', `${films}\nfunction createProjectScenes(panels){`);
  replace('const projectScenes=createProjectScenes(panels),galleryClock=', 'const mobileFilms=createMobileProjectFilms(panels),projectScenes=createProjectScenes(panels),galleryClock=');
  replace(' function setupMotion(){', ' function setupMotion(){\n  mobileFilms.stop();');
  replace("restoreTarget=project.querySelector('[data-case]');", "restoreTarget=project.querySelector(mobileLayout.matches?'.project-shot':'[data-case]');");
  // Extend the cream underneath the pink sheet; its curve owns the visible
  // seam. Shared corner coordinates prevent a detached tip, and the overlap
  // prevents antialiasing cracks between two separately painted SVG paths.
  replace('d="M0 0H1600L735 82Q695 87 660 134L0 16Z"', 'd="M0 0H1600L704 86L708 145H0Z"');
  // The portrait moves during its entrance. Clip all four illustration layers
  // together so the body cannot peek below the foreground's SVG viewport.
  replace('<svg class="footer-paper"', '<div class="footer-illustration" aria-hidden="true"><svg class="footer-paper"');
  replace('  <div class="footer-contact-main">', '  </div>\n  <div class="footer-contact-main">');
  replace(' function measureHero(){', ` function measureHero(){
  if(mobileLayout.matches){
   layout={w:hero.clientWidth,h:hero.clientHeight,handWidth:0,handHeight:0};
   return;
  }`);
  replace(' function updateNavSurface(){', ` function updateNavSurface(){
  if(mobileLayout.matches){
   const bottom=hero.getBoundingClientRect().bottom;
   document.body.classList.toggle('nav-scrolled',bottom<=navigation.getBoundingClientRect().bottom+64);
   return;
  }`);
  replace("  motion=hasGSAP&&!reduced.matches;window.motionEnabled=motion;", `  if(mobileLayout.matches){
   motion=false;window.motionEnabled=false;
   document.body.classList.remove('pause-motion');
   galleryClock.u=0;track.style.removeProperty('transform');
   panels.forEach(el=>el.querySelector('.project-shot').style.removeProperty('transform'));
   projectScenes.reset(true);mobileFilms.sync();measureHero();updateNavigation();
   return;
  }
  motion=hasGSAP&&!reduced.matches;window.motionEnabled=motion;`);
  const css = readFileSync(new URL('../release/mobile-role.css', import.meta.url), 'utf8') + '\n' + readFileSync(new URL('../release/mobile-project-films.css', import.meta.url), 'utf8');
  const js = readFileSync(new URL('../release/mobile-role.js', import.meta.url), 'utf8');
  const bollardFilm = readFileSync(new URL('../docs/motion/bollard/film.js', import.meta.url), 'utf8').split('// Motion study bootstrap.')[0];
  replace('<script id="bollard-motion-controller">', `<script>${bollardFilm}</script><script id="bollard-motion-controller">`);
  replace('</head>', `<style id="role-first-mobile">${css}</style></head>`);
  replace('</body></html>', `<noscript><style>.project-actions [data-case]{display:none!important}.project-case-fallback{display:inline-flex;min-height:44px;align-items:center;padding:8px 0}@media(max-width:767px){.project-case-fallback{grid-area:4/1/auto/-1;justify-self:start;font-size:15px}#f24 .project-case-fallback{grid-area:2/2;font-size:12px}}</style></noscript><script>${js}</script></body></html>`);
  return html;
}
