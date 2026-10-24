// Until the self-contained homepage is regenerated, patch only the reviewed
// navigation visibility rule. Fail the build if source changes unexpectedly.
export function patchHomeNav(html) {
  const edits = [
    [
      'desktop surface',
      '.nav-scrolled .nav{background:var(--paper);border-color:var(--line)}',
      '.nav-scrolled .nav{background:#fff;border-color:var(--line)}'
    ],
    [
      'transparent surface transition',
      'body:not(.nav-scrolled) .nav{background:transparent;border-bottom-color:transparent;transition:none}',
      'body:not(.nav-scrolled) .nav{background:transparent;border-bottom-color:transparent}'
    ],
    [
      'mobile surface',
      ' .nav-scrolled .nav{background:var(--paper)}',
      ' .nav-scrolled .nav{background:#fff}'
    ],
    [
      'surface comment',
      '/* Keep the navigation transparent until the pink sheet has fully cleared. */',
      '/* Keep the masthead transparent while the hands are safely below it. */'
    ],
    [
      'surface visibility function',
      ' function updateNavSurface(){',
      ` function shouldShowNavSurface(pinkBottom, navBottom, handHeight, handsVisible){
  // The hands rise into the masthead before the pink paper's edge reaches it.
  // Account for their anchor height and allow the navbar time to fade to white.
  const lead=handsVisible?handHeight*.79+32:0;
  return pinkBottom<=navBottom+lead;
 }
 function updateNavSurface(){`
    ],
    [
      'surface visibility call',
      "  document.body.classList.toggle('nav-scrolled',pinkBottom<=0);",
      "  document.body.classList.toggle('nav-scrolled',shouldShowNavSurface(pinkBottom,navigation.getBoundingClientRect().bottom,layout.handHeight,motion));"
    ]
  ];

  for (const [name, before, after] of edits) {
    const oldCount = html.split(before).length - 1;
    const newCount = html.split(after).length - 1;
    if (oldCount === 1 && newCount === 0) {
      html = html.replace(before, after);
    } else if (newCount === 1 && (oldCount === 0 || (name === 'surface visibility function' && oldCount === 1))) {
      // The injected helper precedes the original updateNavSurface() function,
      // so that one old declaration still exists in the patched result.
      continue;
    } else {
      throw new Error(`Unexpected homepage nav source for ${name}: old=${oldCount} new=${newCount}`);
    }
  }
  return html;
}
