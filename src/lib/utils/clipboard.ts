const copyWithTextarea = (value: string) => {
  if (typeof document === 'undefined') {
    return false;
  }

  const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', 'true');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  textarea.style.top = '0';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  try {
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
    activeElement?.focus();
  }
};

export const copyText = async (value: string) => {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const clipboardWrite = navigator.clipboard.writeText(value).then(
      () => true,
      () => false
    );

    if (copyWithTextarea(value)) return true;

    try {
      return await Promise.race([
        clipboardWrite,
        new Promise<false>((resolve) => {
          timeout = setTimeout(() => resolve(false), 600);
        })
      ]);
    } finally {
      if (timeout) clearTimeout(timeout);
    }
  }

  return copyWithTextarea(value);
};
