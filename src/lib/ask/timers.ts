export function timers() {
  const pending = new Set<ReturnType<typeof setTimeout>>();
  return {
    after(ms: number, fn: () => void) { const id = setTimeout(() => { pending.delete(id); fn(); }, ms); pending.add(id); },
    clear() { pending.forEach(clearTimeout); pending.clear(); },
    get size() { return pending.size; }
  };
}
