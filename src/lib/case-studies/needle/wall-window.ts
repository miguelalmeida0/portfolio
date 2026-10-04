// Same row-window calculation as the pinned Needle release's wall-window.js.
export function wallWindow(count: number, columns: number, rowHeight: number, height: number, scrollTop: number) {
  const rows = Math.ceil(count / columns);
  const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - 1);
  const endRow = Math.min(rows, Math.ceil((scrollTop + height) / rowHeight) + 1);
  return { startRow, endRow, start: startRow * columns, end: Math.min(count, endRow * columns) };
}
