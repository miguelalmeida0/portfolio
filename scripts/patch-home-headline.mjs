// Patch the published self-contained homepage, not the Svelte fallback route.
// The mobile hero is added earlier by patchHomeMobile; both copies must agree.
const headline = "I build the interfaces teams rely on when seconds matter.";
const edits = [
  ['desktop headline', "<p class=\"hero-role\">Frontend engineer &amp; design engineer</p>", '<p class="hero-role">' + headline + '</p>'],
  ['mobile headline', "<h1 class=\"mobile-role\"><span class=\"role-pair\"><span>Frontend</span> <span>engineer</span></span><span class=\"role-pair\"><span>&amp; design</span> <span>engineer.</span></span></h1>", "<h1 class=\"mobile-role\"><span class=\"role-pair\">I build the interfaces</span> <span class=\"role-pair\">teams rely on</span> <span class=\"role-pair\">when seconds matter.</span></h1>"],
  ['search description', "<meta name=\"description\" content=\"Miguel Almeida, frontend engineer and design engineer in Berlin. React, TypeScript, Svelte. Professional work at F24 and independent products you can try.\">", '<meta name="description" content="' + headline + ' Miguel Almeida is a frontend engineer and product designer in Berlin.">'],
  ['responsive headline fit', '</head>', "<style id=\"home-value-headline-style\">@media(max-width:767px){.hero .hero-name .mobile-role{font-size:clamp(30px,8.2vw,54px);line-height:1.11;letter-spacing:-.04em;text-wrap:balance}.hero .mobile-role .role-pair{white-space:normal}}</style>" + '</head>']
];

export function patchHomeHeadline(html) {
  for (const [name, before, after] of edits) {
    if (html.split(before).length !== 2) {
      throw new Error('Unexpected homepage source for ' + name);
    }
    html = html.replace(before, after);
  }
  return html;
}
