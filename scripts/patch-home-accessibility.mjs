import assert from 'node:assert/strict';

// Applied after the authored project integrations so fallback links, previews
// and dynamically rendered dialog actions all retain their visible labels.
export function patchHomeAccessibility(html) {
  let caseActions = 0;
  html = html.replace(/aria-label="Read ([^"]+?) case study([^"]*)"/g, (_, project, context) => {
    caseActions++;
    return `aria-label="${context ? 'View' : 'Read'} case study — ${project}${context}"`;
  });
  assert.ok(caseActions >= 12, 'Expected the six reviewed project actions and previews');
  html = html.replace(/aria-label="Open ([^"]+?) app in a new tab"/g, 'aria-label="Open app — $1 (new tab)"');
  // Keep the existing translation and scroll timing. Readable copy should not
  // wait for the visitor to scroll farther before reaching its authored colour.
  const fade = "gsap.fromTo(block,{y:20,opacity:.2},{y:0,opacity:1,ease:'power2.out'";
  assert.equal(html.split(fade).length, 2, 'Expected one supporting-copy entrance');
  html = html.replace(fade, "gsap.fromTo(block,{y:20},{y:0,ease:'power2.out'");
  const mobileFade = "gsap.fromTo(el.querySelectorAll('.project-top > div:first-child > *, .project-actions'),{y:22,opacity:.2},{y:0,opacity:1,";
  assert.equal(html.split(mobileFade).length, 2, 'Expected one project-copy entrance');
  html = html.replace(mobileFade, "gsap.fromTo(el.querySelectorAll('.project-top > div:first-child > *, .project-actions'),{y:22},{y:0,");
  html=html.replace("gsap.set(label, { visibility: 'visible' });\n    gsap.to(label, { opacity: 1, duration: 0.3, overwrite: 'auto' });", "gsap.set(cursor, { opacity: 1 });\n    gsap.set(label, { visibility: 'visible', opacity: 1 });");
  html=html.replace("gsap.to(label, { opacity: 0, duration: 0.2, overwrite: 'auto', onComplete: () => { if (!isOpen) gsap.set(label, { visibility: 'hidden' }); } });", "gsap.set(label, { opacity: 0, visibility: 'hidden' });");
  return html;
}
