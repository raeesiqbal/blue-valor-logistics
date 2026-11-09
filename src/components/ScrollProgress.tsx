import { useEffect, useState } from 'react';

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReducedMotion(preference.matches);
    preference.addEventListener('change', change);
    return () => preference.removeEventListener('change', change);
  }, []);
  useEffect(() => {
    if (reducedMotion) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.max(0, Math.min(1, window.scrollY / max)) : 0);
    };
    const update = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [reducedMotion]);
  if (reducedMotion) return null;
  return <div aria-hidden="true" className="fixed bottom-0 left-0 right-0 z-[60] h-[3px] bg-[#0a0e14]/20">
    <div className="absolute inset-0 origin-left bg-accent" style={{ transform: `scaleX(${progress})` }} />
    <svg viewBox="0 0 76 28" fill="none" className="absolute bottom-0 h-7 w-[76px] text-[#0A0E14]"
      style={{ left: `calc(38px + (100% - 76px) * ${progress})`, transform: 'translateX(-50%)' }} aria-hidden="true">
      <g transform="translate(-0.5 0)" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
        <rect x="2" y="3" width="47" height="17" rx="1.5" fill="#62c0de" />
        <path d="M49 20h5V9h9l8 8v6H48" fill="#3b82bb" />
        <path d="M57 11h5l5 6H57z" fill="#e7f7fc" />
        <path d="M7 20v3h42M52 20h4M69 20h3M9 6h33" />
        <circle cx="13" cy="23" r="3.5" fill="#0A0E14" />
        <circle cx="22" cy="23" r="3.5" fill="#0A0E14" />
        <circle cx="45" cy="23" r="3.5" fill="#0A0E14" />
        <circle cx="64" cy="23" r="3.5" fill="#0A0E14" />
      </g>
    </svg>
  </div>;
}
