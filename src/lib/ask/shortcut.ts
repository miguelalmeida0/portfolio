/** A modified shortcut avoids accidental activation from printable input. */
export function isAskShortcut(event: KeyboardEvent): boolean {
  const target = event.target as HTMLElement | null;
  const path = event.composedPath?.() ?? [target];
  return event.key === '/' && Boolean(event.ctrlKey || event.metaKey) && !event.altKey &&
    !target?.ownerDocument?.querySelector('dialog:modal') &&
    !path.some(node => (node as HTMLElement | null)?.closest?.('input, textarea, select, [contenteditable]:not([contenteditable="false"])'));
}

