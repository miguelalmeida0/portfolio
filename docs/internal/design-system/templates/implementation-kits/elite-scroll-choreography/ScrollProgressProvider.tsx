import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type ScrollProgress = { progress: number; reducedMotion: boolean };
const ScrollProgressContext = createContext<ScrollProgress>({ progress: 0, reducedMotion: false });

export function ScrollProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(media.matches);
    const updateScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setProgress(Math.min(1, Math.max(0, window.scrollY / max)));
    };
    updateMotion(); updateScroll();
    media.addEventListener?.('change', updateMotion);
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll);
    return () => {
      media.removeEventListener?.('change', updateMotion);
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, []);

  const value = useMemo(() => ({ progress, reducedMotion }), [progress, reducedMotion]);
  return <ScrollProgressContext.Provider value={value}>{children}</ScrollProgressContext.Provider>;
}

export function useScrollProgress() { return useContext(ScrollProgressContext); }
