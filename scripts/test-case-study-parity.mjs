import {spawnSync} from 'node:child_process';
import path from 'node:path';
const result=spawnSync(process.execPath,['node_modules/@playwright/test/cli.js','test','-c','tests/case-studies/tests/parity/playwright.parity.config.ts','--workers=1',...process.argv.slice(2)],{stdio:'inherit',env:{...process.env,PARITY_REF_DIR:path.resolve('tests/case-studies/reference'),PARITY_IMPL_BASE:'http://127.0.0.1:4187',PARITY_IMPL_HIDE:'#top,.contact,[data-bookmark-rail],.ask-floating'}});
process.exit(result.status??1);
