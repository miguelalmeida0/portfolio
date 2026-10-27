import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

export function buildIdentity({sha, dirty, now = new Date(), deploymentSha}) {
  if (!/^[a-f0-9]{40}$/.test(sha)) throw new Error('Build identity requires a full commit SHA.');
  if (deploymentSha && deploymentSha !== sha) throw new Error('Deployment revision does not match the checked-out commit.');
  return Object.freeze({schemaVersion:1, commit:sha, builtAt:now.toISOString(), dirty:Boolean(dirty)});
}
export function currentBuildIdentity(reuse = true) {
  // The original footer embeds a 2.3 MB PNG; its restoration diff exceeds
  // Node's default 1 MB stdout buffer during local build verification.
  const git = (...args) => execFileSync('git',args,{encoding:'utf8',maxBuffer:32*1024*1024}).trim();
  const sha=git('rev-parse','HEAD'), dirty=Boolean(git('status','--porcelain'));
  if (!reuse) return buildIdentity({sha,dirty,deploymentSha:process.env.CF_PAGES_COMMIT_SHA});
  const digest=createHash('sha256').update(sha).update(git('diff','HEAD','--binary'));
  for(const file of git('ls-files','--others','--exclude-standard','-z').split('\0').filter(Boolean).sort()) digest.update(file).update(readFileSync(file));
  const signature=digest.digest('hex');
  // Kit loads the Vite config again for its client build. A process-wide capture
  // survives those module URLs; source edits between stages invalidate the build.
  const key=Symbol.for('portfolio.build.identity');
  const cached=globalThis[key];
  const info=buildIdentity({sha,dirty,deploymentSha:process.env.CF_PAGES_COMMIT_SHA,now:cached?new Date(cached.info.builtAt):new Date()});
  if(cached) {
    if(cached.signature!==signature || cached.info.commit!==sha || cached.info.dirty!==dirty) throw new Error('Checkout changed during the build. Start a new build from one revision.');
    return cached.info;
  }
  globalThis[key]={signature,info};
  return info;
}
export function assertPromotion({head, test, dirty, proof}) {
  if (dirty) throw new Error('The candidate checkout must be clean.');
  if (head !== test || !/^[a-f0-9]{40}$/.test(head)) throw new Error('HEAD must be the exact local test candidate.');
  if (proof?.commit !== head) throw new Error('Acceptance belongs to a different commit.');
  if (proof.environment !== 'cloudflare-production-build') throw new Error('Acceptance must exercise the Cloudflare production build.');
  const required = ['types','unit','build','routes','chromium','webkit','accessibility','responsive'];
  if (required.some(key=>proof.checks?.[key] !== true)) throw new Error('Required acceptance is incomplete.');
  if (proof.reviewed !== true) throw new Error('An owner review is required.');
}
