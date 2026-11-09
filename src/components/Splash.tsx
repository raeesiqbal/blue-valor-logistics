import { useEffect, useState } from 'react';
import { Truck } from 'lucide-react';

export function Splash() {
  const [show, setShow] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('bk_splash_seen');
    if (!hasSeenSplash) {
      setShow(true);
      sessionStorage.setItem('bk_splash_seen', 'true');
      
      const fadeTimer = setTimeout(() => {
        setFadingOut(true);
      }, 2500);
      
      const hideTimer = setTimeout(() => {
        setShow(false);
      }, 3000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
    return undefined;
  }, []);

  if (!show) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-[#0A0E14] flex flex-col items-center justify-center transition-opacity duration-500 cursor-pointer ${fadingOut ? 'opacity-0' : 'opacity-100'}`}
      onClick={() => {
        setFadingOut(true);
        setTimeout(() => setShow(false), 500);
      }}
      data-testid="splash-screen"
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative text-white glint-effect p-4">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="splash-grille opacity-0">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <path d="M3 9h18"></path>
            <path d="M3 15h18"></path>
            <path d="M9 3v18"></path>
            <path d="M15 3v18"></path>
          </svg>
        </div>
        
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both text-center">
          <div className="text-4xl md:text-6xl font-display font-bold tracking-tight flex items-center gap-2">
            <img src="/blue-valor-logo.png" alt="Blue Valor Logistics" className="w-[250px] md:w-[360px] h-auto" />
          </div>
          <p className="font-script text-accent italic text-xl mt-2">Always Moving. Always Delivering.</p>
        </div>
      </div>
    </div>
  );
}
