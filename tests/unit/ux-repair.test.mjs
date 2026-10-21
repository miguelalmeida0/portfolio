import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {loadLocalTs} from '../../scripts/lib/load-local-ts.mjs';
import * as diffModule from '../../src/lib/case-studies/second-voice/diff.js';
const load = async path => { assert.ok(fs.existsSync(path), 'required behavior helper exists: '+path); return loadLocalTs(path); };
test('route labels resolve real project names and unknown routes stay unnamed', async()=>{
 const {destinationLabel}=await load('src/lib/navigation/destination-label.ts');
 for(const [path,label] of [['/','Home'],['/#work','Work'],['/story','Story'],['/cv','CV'],['/work/f24','F24'],['/work/second-voice','Second Voice'],['/work/needle','Needle'],['/hero-lab/typographic/story','Story'],['/hero-lab/typographic#work','Work'],['/future',undefined],['/work/missing',undefined]]) assert.equal(destinationLabel(new URL(path,'https://portfolio.test')),label,path);
});
test('citation mapping preserves fragments/query and never rewrites external destinations',async()=>{
 const {directionHref}=await load('src/lib/navigation/direction-href.ts');
 const current='/work/f24';
 assert.equal(directionHref('/cv?source=ask#experience',current),'/cv?source=ask#experience');
 assert.equal(directionHref('/story#start','/hero-lab/typographic'),'/story#start');
 assert.equal(directionHref('https://other.test/cv',current),'https://other.test/cv');
 assert.equal(directionHref('/cv/pdf',current),'/cv/pdf');
 assert.equal(directionHref('/cv','/story'),'/cv');
});
test('project tour visits each case once then returns to work',async()=>{
 const {nextProject}=await load('src/lib/navigation/project-tour.ts');
 let slug='f24'; const visited=[];
 for(let i=0;i<5;i++){visited.push(slug);const next=nextProject(slug,true);if(i===4)assert.equal(next.href,'/#work');else slug=next.href.split('/').pop();}
 assert.deepEqual(visited,['f24','needle','second-voice','leu','flow']);
});
test('diff modes expose one coherent sentence and explicit change descriptions',()=>{
 assert.equal(typeof diffModule.accessibleDiff,'function');
 const ops=diffModule.diff('A quiet room.','A bright room.');
 assert.equal(diffModule.accessibleDiff(ops,'original'),'A quiet room.');
 assert.equal(diffModule.accessibleDiff(ops,'rewrite'),'A bright room.');
 assert.match(diffModule.accessibleDiff(ops,'marked'),/Removed: quiet/);
 assert.match(diffModule.accessibleDiff(ops,'marked'),/Added: bright/);
});
test('Ask requires a modifier and never claims an editable target',async()=>{
 const {isAskShortcut}=await load('src/lib/ask/shortcut.ts');
 const target={closest:()=>null};
 assert.equal(isAskShortcut({key:'/',target}),false);
 assert.equal(isAskShortcut({key:'/',ctrlKey:true,target}),true);
 assert.equal(isAskShortcut({key:'/',metaKey:true,target}),true);
 assert.equal(isAskShortcut({key:'/',ctrlKey:true,target:{closest:()=>({})}}),false);
});
test('ready answer announcement does not wait for or repeat with decorative quote animation',async()=>{
 const {answerAnnouncement}=await load('src/lib/ask/announcement.ts');
 const view={error:undefined,loading:false,complete:false,refusal:false,knowledge:{paragraphs:['A ready answer.'],bullets:['Evidence.'],conversational:false},fragments:[]};
 assert.equal(answerAnnouncement(view,'Footer.','Refusal.'),'A ready answer. Evidence. Footer.');
 assert.equal(answerAnnouncement({...view,complete:true,fragments:[{quoted:true}]},'Footer.','Refusal.'),answerAnnouncement(view,'Footer.','Refusal.'));
});

