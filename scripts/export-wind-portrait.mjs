import sharp from 'sharp';
// Existing, transparent footer source. No generated face or screenshot crop.
const source = 'static/images/miguel-contact-editorial.webp';
for (const [name, width, height] of [['527',527,500],['1054',1054,1000],['tablet',1790,760]]) {
  const png = await sharp(source).resize(width,height,{
    fit:'contain', background:{r:0,g:0,b:0,alpha:0}
  }).png().toBuffer();
  await sharp(png).avif({quality:85,effort:6}).toFile(`static/images/wind-portrait-${name}.avif`);
  await sharp(png).webp({quality:95}).toFile(`static/images/wind-portrait-${name}.webp`);
  if (name === '1054') await sharp(png).toFile('static/images/wind-portrait-1054.png');
}
