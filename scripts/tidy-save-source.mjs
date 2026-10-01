import fs from 'node:fs/promises';
import path from 'node:path';
const paths = ['src/styles/tokens.css','src/routes/+layout.svelte','src/lib/components/experience/Header.svelte','src/lib/components/experience/Hero.svelte','src/lib/components/experience/hero/PortraitCard.svelte','src/lib/components/experience/footer/LineMFooter.svelte','src/lib/components/experience/footer/LineMFooter.module.css','src/lib/components/experience/work/WorkSection.svelte','src/lib/components/experience/work/ProjectIndex.svelte','src/lib/components/experience/work/Stage.svelte','src/lib/components/experience/work/stages/F24.svelte','src/lib/components/experience/work/stages/SecondVoice.svelte','src/lib/components/experience/work/stages/VideoLoop.svelte','src/lib/components/experience/work/stages/LeuFlowLoop.svelte'];
for (const file of paths) {
  const target = path.join('artifacts/tidy/before-source',file);
  await fs.mkdir(path.dirname(target),{recursive:true});
  await fs.copyFile(file,target,fs.constants.COPYFILE_EXCL);
}
