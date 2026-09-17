import { readFile, writeFile } from 'node:fs/promises';
import { loadLocalTs } from './lib/load-local-ts.mjs';
const file = 'src/lib/content/case-studies.ts';
const { caseStudies } = await loadLocalTs(file);
Object.assign(caseStudies.find(x=>x.slug==='mirror-ai'), {
 type: 'Independent project · product design & engineering',
 thesis: 'Point to what you want to understand.',
 role: 'Product design · frontend engineering · local model integration',
 timeline: 'Independent local-first prototype',
 stack: 'TypeScript · Vite · browser workers · IndexedDB · COCO-SSD · Florence-2 · SAM · Tesseract · Ollama',
 mediaId: 'mirror-ai-home', artifactCaption: 'Mirror AI · image and text assistant',
 problem: 'I built a local-first assistant that lets you explore an image directly: select a subject, ask about it, and correct what the model gets wrong. A contour reveals the subject under the pointer; selecting it opens a crop, interpretation, and focused questions while the original image stays central.',
 contribution: 'I built the image-first interaction, contextual inspector, keyboard and mobile selection, local model integration, scene caching, asynchronous state handling, correction workflows, and Eval Lab.',
 technicalSignal: 'Once a region is mapped, hovering and selecting reads the local scene map. It does not ask the model to think again.',
 status: 'Working local-first prototype. Recognition quality and cold-start speed vary by image, model, and hardware.',
 keyFlows: ['Prepare image', 'Build interactive map', 'Identify regions', 'Reconcile evidence', 'Inspect or correct'],
 constraints: ['Geometry and semantic identity are different evidence.', 'User corrections must survive later weaker model results.', 'Pointer interaction must stay responsive while models work.'],
 technicalDecisions: ['Cache versioned scene geometry and semantics.', 'Run detection and image processing in browser workers.', 'Reconcile evidence without overwriting stronger identities or corrections.'],
 designDecisions: ['Keep the image central and the selected subject visible.', 'Expose uncertainty instead of unsupported specificity.', 'Capture mistakes as reviewable Eval Lab cases.'],
 alternatives: [
  { title:'Wait for every model to finish', body:'Simplifies the final presentation, but makes selection wait on slow or disagreeing semantic results.' },
  { title:'Separate interaction from identification', body:'Expose mapped regions immediately. Let semantic readings arrive progressively, with uncertainty and evidence-merging rules.' }
 ],
 decision: 'I separated spatial geometry, semantic identity, and corrections in a versioned scene manifest. Known-region interactions use cached state; incoming model results pass arbitration rules before changing an identity.',
 tradeoff: 'The interface must communicate incomplete identification. Local inference avoids a paid API requirement in the core path, but needs model downloads, memory, and suitable hardware. Saved-scene playback gives repeatable presentation, not a cold-start benchmark.',
 behavior: [
  {state:'Wrong identity',before:'A detector locates a region but assigns the wrong category.',after:'Retain its output as evidence and reconcile independent semantic readings.'},
  {state:'Disagreement',before:'Models disagree or remain inconclusive.',after:'Preserve uncertainty instead of forcing a precise label.'},
  {state:'Late result',before:'Weaker evidence arrives after a stronger identity.',after:'Apply evidence-merging rules; reject stale runs.'},
  {state:'Correction',before:'The user challenges an interpretation.',after:'Preserve append-only correction history and give the correction precedence.'},
  {state:'Missing region',before:'The initial map misses an area.',after:'Allow deliberate region selection and targeted analysis.'},
  {state:'Wrong answer',before:'A response does not match the image.',after:'Capture context and expected behaviour as an Eval Lab regression case.'}
 ],
 outcome:'The supplied project handoff reports 49 passing unit/component tests across coordinate transforms, cache versions, selection, correction precedence, concurrent results, and segmentation handling. A retained cinematic report records 630 samples with no detected popup gaps, duplicates, or hover-label overflow.',
 conditions:'The 49-test run is reported by the project handoff; retained browser reports are separate historical evidence. These checks are not production load tests or a model-accuracy score. Recognition and cold starts vary: a fresh-profile giraffe experiment remained a generic uncertain animal. Core analysis uses browser/local Ollama inference; model downloads need network access. Scene manifests and compressed failure images are saved locally. Creating a regression case does not retrain the model or prove a fix.',
 limitations:['Recognition quality and cold-start speed remain variable.', 'Optional neural speech requires additional dependencies.', 'Some separate backend capabilities remain scaffolded.'],
 lesson:'Keep interaction responsive while models work, and retain enough evidence to challenge their answers.',
 nextQuestion:'How can difficult real-model cases improve without losing uncertainty or correction history?',
 sectionTitles:{problem:'The image becomes the interface.',responsibility:'What I built',alternatives:'The outline can be right while the answer is wrong.',behavior:'When models disagree',result:'What I verified—and what remains uncertain.'}
});
let source=await readFile(file,'utf8');
const start=source.indexOf('export const caseStudies: CaseStudy[] = '), end=source.indexOf('\nexport const flagshipStudy');
await writeFile(file,source.slice(0,start)+'export const caseStudies: CaseStudy[] = '+JSON.stringify(caseStudies,null,2)+';\n'+source.slice(end).replace("['camera-harness', 'ghostwriter']", "['camera-harness', 'ghostwriter', 'mirror-ai']"));
