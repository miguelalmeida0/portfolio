import { dev } from '$app/environment';
import { filterSteps, validateStep } from './plan';
import { sourceElement, sourceMap, sourceText } from './registry';
import { timers } from './timers';
import type { Fragment } from './types';

export function answerSequence(steps: unknown, free: boolean, reduced: boolean, update: (fragments: Fragment[], complete: boolean) => void) {
  const schedule = timers();
  let fragments: Fragment[] = [];
  const dropped = (step: unknown) => { if (dev) console.warn('[ask] dropped ungrounded step', step); };
  const validated = filterSteps(steps, sourceMap(), free, dropped);
  let elapsed = 0;
  validated.forEach(step => {
    const leadAt = elapsed;
    const quoteAt = elapsed + (step.lead ? 600 : 120);
    const quote = () => {
      // Revalidate at the actual render boundary: a source may have changed since the request.
      if (!validateStep(step, sourceText(step.source))) {
        dropped(step); fragments = fragments.filter(fragment => fragment.step !== step); update([...fragments], false); return;
      }
      const number = fragments.filter(fragment => fragment.quoted).length + 1;
      if (fragments.some(fragment => fragment.step === step)) fragments = fragments.map(fragment => fragment.step === step ? { step, number, quoted: true } : fragment);
      else fragments = [...fragments, { step, number, quoted: true }];
      const el = sourceElement(step.source)!;
      el.classList.add('is-quoted');
      const flag = document.createElement('span'); flag.className = 'ask-flag'; flag.setAttribute('aria-hidden', 'true'); flag.textContent = String(number); el.append(flag);
      update([...fragments], false);
    };
    if (reduced) quote();
    else {
      schedule.after(leadAt, () => {
        if (!validateStep(step, sourceText(step.source))) return;
        fragments.push({ step, number: 0, quoted: false }); update([...fragments], false);
      });
      schedule.after(quoteAt, quote);
    }
    elapsed = quoteAt + 1050;
  });
  const finish = () => update(fragments.filter(fragment => fragment.quoted), true);
  if (reduced || !validated.length) finish(); else schedule.after(elapsed, finish);
  return () => schedule.clear();
}

export function clearQuotes() {
  document.querySelectorAll('.is-quoted, .is-asked').forEach(el => el.classList.remove('is-quoted', 'is-asked'));
  document.querySelectorAll('.ask-flag').forEach(el => el.remove());
}
