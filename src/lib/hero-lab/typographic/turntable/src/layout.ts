import { GEOMETRY } from './config';

export interface LayoutResult {
  wide: boolean;
  /** Word font size, px. */
  fontSize: number;
  /** Word top, px from the header top. */
  wordTop: number;
  /** Photo frame height, px. */
  photoHeight: number;
  /** Width of the two copy columns (wide layout), px. */
  columnWidth: number;
  /** Height of the picture area (narrow layout), px. */
  stageHeight: number;
  gutter: number;
}

/**
 * All geometry derives from the header's own width and height, the word's measured width
 * (`perPx`: width at 1px font size) and its cap-height ratio.
 */
export function computeLayout(width: number, height: number, viewportH: number, perPx: number, capRatio: number, gutter: number, copyHeight = 0): LayoutResult {
  const aspect = GEOMETRY.photoW / GEOMETRY.photoH;
  if (width >= GEOMETRY.wideMin) {
    const g = GEOMETRY.wide;
    const targetHeight = Math.max(g.stageMin, Math.min(g.stageMax, height * g.stageRatio));
    const fontSize = Math.min((width * g.wordWidthFit) / perPx, targetHeight * g.wordHeightFit);
    const wordTop = Math.max(g.wordTopMin, targetHeight * g.wordTopRatio);
    const photoHeight = Math.min(
      targetHeight - (wordTop + fontSize * capRatio * g.headOverlap),
      (width - 2 * (gutter + g.colMin + g.colGap)) / aspect,
    );
    const columnWidth = Math.max(g.colMin, Math.min(g.colMax, (width - photoHeight * aspect) / 2 - gutter - g.colGap));
    // Once the photo reaches the space between the columns, stop extending the
    // stage too: otherwise tall windows separate the head from the headline.
    const stageHeight = Math.max(g.stageMin, photoHeight + wordTop + fontSize * capRatio * g.headOverlap);
    return { wide: true, fontSize, wordTop, photoHeight, columnWidth, stageHeight, gutter };
  }
  const n = GEOMETRY.narrow;
  const side = Math.max(n.gutterMin, width * n.gutterRatio);
  const wordTop = n.wordTop;
  // Reserve the actual copy height. Short windows scroll rather than crushing
  // the portrait; tall tablets do not stretch it into an oversized poster.
  const stageHeight = Math.max(Math.min(width * n.stageMinW, n.stageMin),
    Math.min(height * n.totalHeightRatio - copyHeight, width * n.stageMaxW, viewportH * n.stageMaxVh, n.stageMax));
  const fontSize = Math.min((width - 2 * side) / perPx, stageHeight * .4);
  const photoHeight = Math.min(stageHeight - (wordTop + fontSize * capRatio * n.headOverlap), width / aspect);
  return { wide: false, fontSize, wordTop, photoHeight, columnWidth: 0, stageHeight, gutter };
}
