import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

export function patchCaseNavigation(html, source) {
  if (html.includes('/* case-navigation-v1 */')) return html;
  const match = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)]
    .find(([,attrs,body]) => !attrs.includes('application/json') && body.includes('function openCase('));
  assert.ok(match,'Expected the current Compact index case controller');
  const original = match[2];
  let script = original;
  const replace = (before,after) => {
    assert.equal(script.split(before).length,2,'Case navigation source changed: '+before.slice(0,75));
    script = script.replace(before,after);
  };
  replace("    dialog.classList.toggle('instant',instant);const revision=++caseRevision;casePhase='opening';", "    if(!caseNavigation.enter(index,trigger))return false;\n    dialog.classList.toggle('instant',instant);const revision=++caseRevision;casePhase='opening';");
  replace("    if(!dialog.open||casePhase==='closing')return;\n    const revision=++caseRevision;casePhase='closing';", "    if(!dialog.open||casePhase==='closing')return;\n    if(caseNavigation.leave(after,destination))return;\n    const revision=++caseRevision;casePhase='closing';");
  replace("    if(casePhase==='closing'||casePhase==='swapping')return;\n    const revision=++caseRevision;casePhase='swapping';", "    if(casePhase==='closing'||casePhase==='swapping')return;\n    if(!caseNavigation.enter(index))return;\n    const revision=++caseRevision;casePhase='swapping';");
  replace("  dialog.addEventListener('close',", "  /* case-navigation-v1 */\n" + source.replace('export function createCaseNavigation','function createCaseNavigation') + "\n  const caseNavigation=createCaseNavigation({studies,dialog,open:index=>openCase(index,null,true),close:(after,destination)=>closeCase(false,after,destination)});\n  dialog.addEventListener('close',");
  replace("function returnHome(e){e.preventDefault();caseInput(e);closeCase(false,()=>{$('#top-nav .brand').focus({preventScroll:true});},'#top');}", "function returnHome(e){e.preventDefault();caseInput(e);closeCase();}");
  replace("  const initialCase=location.hash.startsWith('#case/')?studies.findIndex(c=>c.id===location.hash.slice(6)):-1;\n  if(initialCase>=0)openCase(initialCase,null);", "  caseNavigation.start();");
  replace('id="csBack" href="#top" style="--d:0">Back to home', 'id="csBack" href="/#work" style="--d:0"><span aria-hidden="true">&lt;</span> Back to home');
  replace('href="#footer" id="csContact"','href="/#footer" id="csContact"');
  html = html.replace(match[0], () => '<script' + match[1] + '>' + script + '</script>');
  html = html.replace('id="csHome" href="#top"', 'id="csHome" href="/#work"');
  html = html.replace(/href="#case\/(morrow|second-voice|leu|needle|f24)"/g,'href="/case/$1/"');
  const hash = value => createHash('sha256').update(value).digest('base64');
  const previousHash = 'sha256-' + hash(original);
  assert.ok(html.includes(previousHash),'Original case script must be covered by CSP');
  return html.replaceAll(previousHash,'sha256-' + hash(script));
}

export function caseStudyDocument(html, study) {
  assert.match(study.id,/^(morrow|second-voice|leu|needle|f24)$/);
  const title = study.shortName + ' · Miguel Almeida';
  const url = 'https://miguelalmeida.is-a.dev/case/' + study.id + '/';
  return html.replace(/<title>[^<]*<\/title>/,'<title>'+title+'</title>')
    .replace(/(<link rel="canonical" href=")[^"]+/, '$1'+url)
    .replace(/(<meta property="og:url" content=")[^"]+/, '$1'+url)
    .replace(/(<meta property="og:title" content=")[^"]+/, '$1'+title);
}
