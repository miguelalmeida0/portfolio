import assert from 'node:assert/strict';

export function patchHomeHistory(html) {
  const edits = [
    [' function navigate(hash,instant){', ' function navigate(hash,instant,push=false){'],
    ["title.focus({preventScroll:true});history.replaceState(null,'',hash);updateNavigation();", "title.focus({preventScroll:true});if(push&&location.hash!==hash)history.pushState(null,'',hash);updateNavigation();"],
    ['navigate(hash,e.detail===0);', 'navigate(hash,e.detail===0,true);'],
    ["navigate('#about',true);return;", "navigate('#about',true,true);return;"],
    ["else closeCase(false);});", "else {closeCase(false);if(!location.hash)navigate('#home',true);}});"],
  ];
  for (const [before, after] of edits) {
    assert.equal(html.split(before).length, 2, `Unexpected navigation source: ${before}`);
    html = html.replace(before, after);
  }
  return html;
}
