import { ReactNode, useLayoutEffect, type MouseEvent } from 'react';
import { useLocation } from 'wouter';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { FloatingStack } from '../FloatingStack';
import { ScrollProgress } from '../ScrollProgress';

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const followSectionLink = (event: MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href*="#"]') : null;
    if (!anchor) return;
    const url = new URL(anchor.href);
    if (url.origin !== window.location.origin || !url.hash) return;
    // Wouter handles page changes; also honor section links on the current page.
    requestAnimationFrame(() => {
      if (url.pathname === window.location.pathname) {
        document.getElementById(decodeURIComponent(url.hash.slice(1)))?.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    });
  };
  useLayoutEffect(() => {
    // Honor explicit section links while ordinary page navigation starts at top.
    const section = window.location.hash
      ? document.getElementById(decodeURIComponent(window.location.hash.slice(1)))
      : null;
    if (section) {
      section.scrollIntoView({ behavior: 'instant', block: 'start' });
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location]);

  return (
    <div onClickCapture={followSectionLink} className="min-h-[100dvh] flex flex-col bg-background selection:bg-accent selection:text-[#0A0E14]">
      <Navbar />
      <main className="flex-1 flex flex-col w-full">
        {children}
      </main>
      <Footer />
      <FloatingStack />
      <ScrollProgress />
    </div>
  );
}
