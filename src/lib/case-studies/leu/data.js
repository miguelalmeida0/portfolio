const CONCEPTS = {
  tilt:{name:'axial tilt'}, angle:{name:'sun angle'}, daylength:{name:'day length'},
  energy:{name:'energy per m²'}, seasons:{name:'seasons'}, distance:{name:'orbital distance'}
};
const PASSAGES = [
  {id:'p1', n:'¶1', text:"Earth's axis is tilted about 23.4° relative to its orbit and keeps pointing the same way in space all year, so each hemisphere spends half the orbit leaning toward the Sun.",
   concepts:['tilt','seasons'], claim:'A fixed axial tilt makes each hemisphere lean sunward for half the year.',
   edge:['axial tilt','changes','sun angle and day length'],
   act:{type:'Recall', prompt:"What stays the same about Earth's axis through the year?"},
   answers:[
     {t:'Its tilt and the direction it points in space, so each hemisphere leans toward the Sun for half the orbit.', read:['the axis keeps its tilt and direction','each hemisphere leans sunward for half the year'], checks:[[1,'Conclusion supported by ¶1'],[1,'Reason supported by ¶1']], v:'credit'},
     {t:"It always points the same way, because the Sun's gravity holds it in place.", tag:'Right conclusion, unsupported reason', read:['the axis keeps pointing the same way',"the Sun's gravity holds it in place"], checks:[[1,'Conclusion supported by ¶1'],[0,'Reason not found in the source']], v:'ask'},
     {t:'Nothing. The axis flips between summer and winter.', read:['the axis flips','none given'], checks:[[0,'Conclusion contradicts ¶1'],[0,'No reason given']], v:'none'}
   ]},
  {id:'p2', n:'¶2', text:'When a hemisphere leans toward the Sun, sunlight arrives at a steeper angle and days are longer, so each square metre receives more energy. That is summer.',
   concepts:['angle','daylength','energy'], claim:'Steeper sunlight and longer days raise the energy each square metre receives.',
   edge:['sun angle','concentrates','energy per m²'],
   act:{type:'Teach it back', prompt:'In your own words: why is it summer in the northern hemisphere in July?'},
   answers:[
     {t:'The north leans toward the Sun, so light hits more directly and days are longer, which delivers more energy per square metre.', read:['the north gets more energy in July','steeper light and longer days'], checks:[[1,'Conclusion supported by ¶2'],[1,'Reason consistent with the claim']], v:'credit'},
     {t:"It's warmer in July because Earth is closer to the Sun then.", tag:'Right conclusion, wrong reason', read:['the north is warmer in July','Earth is closer to the Sun'], checks:[[1,'Conclusion supported by ¶2'],[0,'Reason contradicts ¶3: Earth is closest to the Sun in January']], v:'ask'},
     {t:'The Sun burns hotter in summer.', read:['the Sun itself gets hotter','none given'], checks:[[0,'Conclusion not in the source'],[0,'No reason given']], v:'none'}
   ]},
  {id:'p3', n:'¶3', text:"Earth's distance from the Sun changes only slightly over the year, and Earth is closest to the Sun in early January, during northern winter.",
   concepts:['distance','seasons'], claim:'Orbital distance does not explain the seasons.',
   edge:['orbital distance','does not drive','seasons'],
   act:{type:'Predict', prompt:'If distance caused the seasons, what would both hemispheres experience in January?'},
   answers:[
     {t:"Summer at the same time, because both would be closest to the Sun. They don't, so distance isn't the cause.", read:['both hemispheres would have summer together','both are closest to the Sun at once'], checks:[[1,'Conclusion follows from ¶3'],[1,'Reason consistent with the claim']], v:'credit'},
     {t:'Both would get summer, because January is when the Sun is most active.', tag:'Right conclusion, unsupported reason', read:['both hemispheres would get summer','the Sun is most active in January'], checks:[[1,'Conclusion follows from ¶3'],[0,'Reason not found in the source']], v:'ask'},
     {t:'The northern hemisphere would be colder.', read:['the north would be colder','none given'], checks:[[0,'Conclusion contradicts the premise'],[0,'No reason given']], v:'none'}
   ]}
];
const VERDICT = {
  credit:{cls:'credit', text:'Credit. Evidence recorded.', state:'evidence', label:'credited'},
  ask:{cls:'ask', text:'Ask a follow-up. No mastery.', state:'weak', label:'weak reasoning'},
  none:{cls:'none', text:'No credit. Return to the passage.', state:'missed', label:'not credited'}
};
const STATE_LABEL = {unseen:'not studied', evidence:'credited', weak:'weak reasoning, follow-up queued', missed:'not credited'};
const NW = 172, NH = 54;
const GN = {
  tilt:{x:180,y:50,src:'¶1'}, distance:{x:430,y:50,src:'¶3'},
  angle:{x:100,y:172,src:'¶2'}, daylength:{x:300,y:172,src:'¶2'},
  energy:{x:200,y:294,src:'¶2'}, seasons:{x:200,y:408,src:'¶1'}
};
const GE = [
  {a:'tilt', b:'angle', l:'changes'},
  {a:'tilt', b:'daylength', l:'changes'},
  {a:'angle', b:'energy', l:'concentrates', bx:-22},
  {a:'daylength', b:'energy', l:'adds hours to', bx:22},
  {a:'energy', b:'seasons', l:'drives'},
  {a:'distance', b:'seasons', l:'does not drive', neg:true}
];
const STATE_SHORT = {evidence:'credited', weak:'weak reasoning', missed:'not credited'};
const NODES = [
  ['Source passage', 'The exact text, page and passage identity.'],
  ['Concepts and claims', 'What the passage defines and asserts.'],
  ['Relationship', 'A typed edge in the concept graph.'],
  ['Learning activity', 'Chosen from structure, then worded.'],
  ['Learner response', 'An answer to judge.'],
  ['Judgement', 'Model reads, code checks, judge decides.'],
  ['Learner state', 'What future study will use.']
];
const XV = {
  page:{
    html:`<div class="mini"><p class="lbl">EARTH SCIENCE</p><div class="rh"><span>Earth Science Notes</span><span>p. 12</span></div><h4>Why seasons happen</h4>
      <div class="cols"><p>Earth's axis is tilted about 23.4° relative to its orbit and keeps pointing the same way in space all year.</p><p>Earth's distance from the Sun changes only slightly, and Earth is closest to the Sun in early January.</p></div></div>`,
    notes:[['Looks fine.','Letter-spaced label, running header, heading and two columns. A person reads this correctly without effort.'],['Visual layout is the input, not the reading order.','PDFKit returns strings positioned on a page. It does not return headings, paragraphs or the order a person reads them in.']]
  },
  raw:{
    html:`<pre class="raw">E A R T H   S C I E N C E<sup>1</sup>
<mark>Earth Scienc Note</mark> p. 12<sup>2</sup><sup>3</sup>
<mark>Why season happe</mark><sup>2</sup>
Earth's axis is tilted about 23.4° rel  Earth's distance from the Sun<sup>4</sup>
ative to its orbit and keeps pointing   changes only slightly, and Earth is
the same way in space all year.         closest to the Sun in early January.</pre>`,
    notes:[['1','Explicit spaces in letter-spaced labels interfered with geometric grouping.'],['2','Characters dropped from titles and headings, the same failure seen on real documents.'],['3','Running headers entered the text as if they were content.'],['4','Blocks joined across columns, so sentences interleaved.']]
  },
  canon:{
    html:`<ul class="blocks">
      <li><code>p12·label</code><span class="x">EARTH SCIENCE<small>decoration, excluded</small></span></li>
      <li><code>p12·header</code><span class="x">Earth Science Notes, p. 12<small>running header, excluded</small></span></li>
      <li><code>p12·h1</code><span>Why seasons happen<small>heading</small></span></li>
      <li><code>p12·¶1</code><span>Earth's axis is tilted about 23.4° relative to its orbit and keeps pointing the same way in space all year.</span></li>
      <li><code>p12·¶3</code><span>Earth's distance from the Sun changes only slightly, and Earth is closest to the Sun in early January.</span></li></ul>`,
    notes:[['Change.','Move source ownership into a reconstruction pipeline: geometry-aware extraction, line grouping, block classification and page reconstruction. Keep stable passage identities and canonical whitespace.'],['Why identities matter.','Every concept, question, judgement and learner record cites a passage id. Return-to-source lands on that id, not on a page guess.'],['What tests missed.','V25 could pass 243/243 core tests while native reconstruction, Study/Lens handoff and gestures still had integration problems. Old persisted extraction could also outlive a parser fix.']]
  }
};
const STAGES = [
  {nm:'PDF', ds:'Visual layout is the input, not the reading order.', out:'glyphs with positions', tag:'Input', p:['A PDF stores positioned glyphs. Reading order, headings and paragraphs have to be reconstructed.'], warn:'PDF is not clean text.'},
  {nm:'Canonical source', ds:'Reconstruct text; retain page and passage identity.', out:'passages with stable ids', tag:'Ground truth', p:['Every later stage cites a passage id. Source return is part of the trust model, not a navigation detail: it has to restore the exact document, page, passage, selection and learning context.']},
  {nm:'Concepts and claims', ds:'Separate definitions, relationships and mnemonic material.', out:'a typed concept graph', tag:'Structure', p:['The Concept Graph replaced the earlier Trails idea. Edges are typed relationships between concepts, not a visual graph drawn because graphs look sophisticated.'], graph:true},
  {nm:'Questions', ds:'Build teaching context; reject invalid candidates.', out:'one learning activity', tag:'Learning intent', p:['Deterministic routing picks what to study and which activity fits: recall, explain, teach it back, predict. Language generation words it last, and invalid candidates are rejected.']},
  {nm:'Learner response', ds:'Read the conclusion and its reason separately.', out:'a conclusion and its reason', tag:'Interpretation', p:['A learner can reach the right answer for the wrong reason. Reading the answer as one blob hides that.']},
  {nm:'Judgement', ds:'Check interpretation before granting learning credit.', out:'credit, a follow-up or a rejection', tag:'Decision', p:['Models interpret language. Deterministic checks decide what counts. The model is not allowed to grant mastery directly.']},
  {nm:'Learner memory', ds:'Persist evidence that will influence future study.', out:'evidence per concept', tag:'State', p:['UI progress and animation cannot assume a save succeeded. History vanishing after relaunch, duplicate follow-ups after failed saves and silent progress resets all came from that assumption.'], warn:'A mistake written here survives the answer that caused it.'}
];
const INV = [
  ['Leaving the source could lose the way back.', [['Observed','Travelling from a passage into learning or help flows did not always restore where the learner had been.'],['What it changed','Return-to-source has to preserve the exact document, page, passage, selection, context and learning state. It is part of Leu\'s trust model, not a navigation detail.']]],
  ['The interface assumed saves succeeded.', [['Observed','Source-help history disappeared after relaunch. Failed saves produced duplicate follow-ups. Progress reset silently. Empty cloud operations reported success.'],['What it changed','UI progress and animation stopped assuming persistence succeeded. State and persistence responsibilities were separated.']]],
  ['PDFKit and SwiftUI are two interaction systems.', [['Observed','Broken PDF swipes, unclear gesture ownership, selection behaviour, synchronising SwiftUI state with PDFKit, keeping source position, and the Contents location being lost.'],['Constraint','A seamless reading surface had to be built from two systems that do not share an interaction model.']]],
  ['Native verification could not always run.', [['Observed','Dozens of XCTest files were included in the app target. File writes were restricted, Swift macros caused problems and Simulator access was blocked. Later: simulator discovery, XCUITest flakiness and accessibility-state mismatches.'],['Constraint','This is why the results on this page separate development measurements from unfinished native and device gates.']]],
  ['Offline intelligence is a distribution problem.', [['Observed','Model packaging, binary size, code signing, hardware capability differences, performance across Apple devices and fallback behaviour.'],['Constraint','Running a model locally is the easy sentence. Shipping it to different devices is the work.']]],
  ['Robotic speech was not good enough.', [['Observed','Robotic text-to-speech was a recurring quality issue. Voice was useful for learning interactions, but having speech output was not enough.']]]
];

export { CONCEPTS, PASSAGES, VERDICT, STATE_LABEL, NW, NH, GN, GE, STATE_SHORT, NODES, XV, STAGES, INV };
