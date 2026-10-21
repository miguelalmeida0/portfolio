import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { assertPromotion } from './lib/release-identity.mjs';

// A local verification tool only. GitHub required-check rules enforce remote promotion.
const file=process.argv[2];
if(!file) throw new Error('Usage: node scripts/verify-promotion.mjs ACCEPTANCE.json');
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
assertPromotion({head:git('rev-parse','HEAD'),test:git('rev-parse','test'),dirty:Boolean(git('status','--porcelain')),proof:JSON.parse(readFileSync(file,'utf8'))});
execFileSync('git',['merge-base','--is-ancestor','main','HEAD']);
console.log('Local candidate verification passed. This command does not merge, push or deploy. Verify required GitHub checks and owner approval before promotion.');
