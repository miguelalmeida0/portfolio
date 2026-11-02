import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {patchPreviewControls} from '../../scripts/patch-preview-controls.mjs';
test('animated artwork remains intact outside the named preview button',()=>{
 const html=patchPreviewControls(readFileSync('release/home.html','utf8'));
 const buttons=[...html.matchAll(/<button class="project-preview-action"[^>]*>([\s\S]*?)<\/button>/g)];
 assert.equal(buttons.length,3);
 for(const [,content] of buttons){assert.match(content,/View case study/);assert.doesNotMatch(content,/project-scene|scene-world/);}
 assert.equal((html.match(/class="project-scene /g)||[]).length,3);
});
