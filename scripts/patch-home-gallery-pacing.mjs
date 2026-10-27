// Keep the reviewed self-contained homepage untouched. Only lengthen the
// existing horizontal gallery's reading interval; do not intercept input,
// add snapping, or alter the phone/reduced-motion document flow.
const original = "end:()=>'+='+Math.max(3600,innerHeight*5.2),pin:true,scrub:.55";
const longer = "end:()=>'+='+Math.max(4800,innerHeight*7),pin:true,scrub:.55";

export const galleryTravel = viewportHeight => Math.max(4800, viewportHeight * 7);

export function patchHomeGalleryPacing(html) {
  if (html.split(original).length !== 2 || !html.includes("id:'human-gallery'")) {
    throw new Error('Unexpected homepage project-gallery scroll source');
  }
  return html.replace(original, longer);
}
