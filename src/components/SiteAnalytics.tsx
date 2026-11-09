import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { analyticsSettings } from '../lib/analytics-settings';
import { getPageTitle } from '../lib/page-titles';

declare global {
  interface Window {
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[][] };
  }
}

const publicPages = new Set([
  '/', '/services', '/services/refrigerated-freight', '/services/dry-van-freight',
  '/services/flatbed-freight', '/shippers', '/carriers', '/about', '/contact',
  '/quote', '/privacy-policy', '/terms',
]);
let initialized = false;

function loadScript(id: string, src: string) {
  if (document.getElementById(id)) return;
  const script = document.createElement('script');
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

function initialize() {
  if (initialized) return;
  initialized = true;
  const { clarityProjectId } = analyticsSettings;
  if (/^[a-z0-9]{5,}$/i.test(clarityProjectId)) {
    window.clarity ??= Object.assign((...args: unknown[]) => {
      window.clarity!.q!.push(args);
    }, { q: [] as unknown[][] });
    loadScript('blue-valor-clarity', `https://www.clarity.ms/tag/${encodeURIComponent(clarityProjectId)}`);
  }
}

export function SiteAnalytics() {
  const [location] = useLocation();
  const frame = useRef<HTMLIFrameElement>(null);
  const frameReady = useRef(false);
  const pendingConversions = useRef<object[]>([]);
  const gaEnabled = analyticsSettings.gaPrivacySettingsConfirmed && /^G-[A-Z0-9]{5,}$/.test(analyticsSettings.gaMeasurementId);
  useLayoutEffect(() => {
    document.title = getPageTitle(location);
    window.dispatchEvent(new CustomEvent('blue-valor-page-route', { detail: location }));
  }, [location]);
  const sendPageView = () => {
    const candidate = location.split(/[?#]/)[0].replace(/\/$/, '') || '/';
    if (candidate === '/map-preview') return;
    const page = publicPages.has(candidate) ? candidate : '/404';
    frame.current?.contentWindow?.postMessage({
      type: 'blue-valor-page-view',
      measurementId: analyticsSettings.gaMeasurementId,
      path: page,
      base: import.meta.env.BASE_URL.replace(/\/$/, ''),
      debug: import.meta.env.DEV,
    }, window.location.origin);
  };
  useEffect(() => {
    initialize();
    sendPageView();
  }, [location]);
  useEffect(() => {
    const onReady = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow ||
          event.data?.type !== 'blue-valor-analytics-ready') return;
      frameReady.current = true;
      for (const message of pendingConversions.current.splice(0)) {
        frame.current?.contentWindow?.postMessage(message, window.location.origin);
      }
    };
    const onConversion = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      if (!gaEnabled || !detail || !['quote_request', 'contact_request'].includes(detail.name)) return;
      const message = detail.name === 'quote_request'
        ? { type: 'blue-valor-conversion', name: 'quote_request', equipment: ['reefer', 'dryvan', 'flatbed'].includes(detail.equipment) ? detail.equipment : 'not set' }
        : { type: 'blue-valor-conversion', name: 'contact_request' };
      if (frameReady.current) frame.current?.contentWindow?.postMessage(message, window.location.origin);
      else pendingConversions.current.push(message);
    };
    window.addEventListener('message', onReady);
    window.addEventListener('blue-valor-conversion', onConversion);
    return () => {
      window.removeEventListener('message', onReady);
      window.removeEventListener('blue-valor-conversion', onConversion);
    };
  }, [gaEnabled]);
  // The isolated document has no forms or SPA history changes. Google cannot
  // automatically collect this page's form destinations or duplicate its routes.
  // It receives only validated public paths through the message above.
  return gaEnabled ? <iframe
    ref={frame}
    src={`${import.meta.env.BASE_URL}analytics-frame.html`}
    title="Site analytics"
    referrerPolicy="no-referrer"
    hidden
    aria-hidden="true"
    tabIndex={-1}
    onLoad={() => {
      frameReady.current = false;
      sendPageView();
    }}
  /> : null;
}
