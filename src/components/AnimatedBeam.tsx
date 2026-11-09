import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../lib/i18n';
import { getMapFrame } from '../lib/map-preview-options';

/*
 * ══════════════════════════════════════════════════════════════════
 * ROUTE NETWORK — traced from user's marked-up reference image
 * (attached_assets/image_1784289460425.png)
 *
 * Coordinate mapping (1024×617 reference image → SVG viewBox 0 0 1200 600,
 * accounting for bg-cover crop at 1920px: visible SVG y ≈ 106–494):
 *   SVG_x = ref_x × 1.172
 *   SVG_y = 106.25 + ref_y × 0.628
 *
 * ENTRY/EXIT points (orange dots, extended ~40u past visible edge so
 * trucks enter/leave fully off-screen):
 *   E1 top-left-ctr (297,75)   E2 left-upper (-40,140)  E3 top-ctr (668,70)
 *   E4 top-ctr-rt   (733,70)   E5 top-right  (1090,70)  E6 left-mid (-40,268)
 *   E7 right-mid  (1240,332)   E8 bottom-lctr (500,530) E9 bottom-ctr (698,530)
 *
 * HUB points (white dots — trucks FADE OUT on arrival):
 *   H1 center (527,331)   H2 lower-ctr (671,430)
 *   H3 lower-rt (911,409) H4 bottom-rt (1015,478)
 *
 * Trucks are NOT locked to one road: each truck is randomly assigned a
 * route; on completion it respawns on another random unused route.
 * Speed is constant (~28 svg-units/s ⇒ ≈18–21 s for the long routes).
 * ══════════════════════════════════════════════════════════════════
 */

type Route = { id: string; d: string; hub: boolean };

const ROUTES: Route[] = [
  // ── BLUE left S-curve · E1 ⇄ E8 ──
  { id: 'blue-left-s', hub: false, d: 'M 297,75 C 290,115 265,170 235,210 C 215,237 205,250 210,270 C 218,300 260,325 320,355 C 380,385 440,415 468,445 C 485,465 495,495 500,530' },
  { id: 'blue-left-n', hub: false, d: 'M 500,530 C 495,495 485,465 468,445 C 440,415 380,385 320,355 C 260,325 218,300 210,270 C 205,250 215,237 235,210 C 265,170 290,115 297,75' },
  // ── PURPLE upper-left diagonal · E1 ⇄ E6 ──
  { id: 'purple-left-w', hub: false, d: 'M 297,75 C 293,100 285,125 268,145 C 235,183 180,210 120,235 C 75,252 30,262 -40,268' },
  { id: 'purple-left-e', hub: false, d: 'M -40,268 C 30,262 75,252 120,235 C 180,210 235,183 268,145 C 285,125 293,100 297,75' },
  // ── RED left sweep · E2 ⇄ E8 ──
  { id: 'red-left-se', hub: false, d: 'M -40,140 C -10,145 30,155 70,172 C 150,205 230,255 310,305 C 380,348 440,390 470,430 C 488,455 496,490 500,530' },
  { id: 'red-left-nw', hub: false, d: 'M 500,530 C 496,490 488,455 470,430 C 440,390 380,348 310,305 C 230,255 150,205 70,172 C 30,155 -10,145 -40,140' },
  // ── YELLOW center drop · E3 → H1 (hub: fade) ──
  { id: 'yellow-hub1', hub: true, d: 'M 668,70 C 662,95 650,125 630,150 C 605,180 570,200 548,225 C 532,243 527,265 527,290 C 527,307 527,320 527,331' },
  // ── GREEN hook: down east vertical, west along y=241, south to hub · E4 → H1 (hub: fade) ──
  { id: 'green-hook-hub1', hub: true, d: 'M 733,70 C 742,85 752,100 765,118 C 785,145 805,160 809,190 C 811,208 812,222 805,232 C 798,241 780,241 755,241 C 690,241 610,241 565,241 C 545,241 533,250 529,268 C 526,285 527,310 527,331' },
  // ── GREEN upper-right hook · E5 ⇄ E7 ──
  { id: 'green-right-se', hub: false, d: 'M 1090,70 C 1080,90 1060,120 1030,150 C 990,190 955,205 950,235 C 947,258 975,262 1020,272 C 1080,285 1140,300 1240,332' },
  { id: 'green-right-nw', hub: false, d: 'M 1240,332 C 1140,300 1080,285 1020,272 C 975,262 947,258 950,235 C 955,205 990,190 1030,150 C 1060,120 1080,90 1090,70' },
  // ── RED right S-curve · E4 ⇄ E9 ──
  { id: 'red-right-s', hub: false, d: 'M 733,70 C 738,95 755,130 772,170 C 795,225 815,260 818,300 C 820,335 800,370 770,400 C 740,430 715,450 705,475 C 698,495 698,512 698,530' },
  { id: 'red-right-n', hub: false, d: 'M 698,530 C 698,512 698,495 705,475 C 715,450 740,430 770,400 C 800,370 820,335 818,300 C 815,260 795,225 772,170 C 755,130 738,95 733,70' },
  // ── BLUE right diagonal · E4 → E7 ──
  { id: 'blue-right-diag', hub: false, d: 'M 733,70 C 745,95 765,125 795,155 C 850,208 910,240 975,262 C 1050,287 1130,305 1240,332' },
  // ── RED branch off right S-curve to lower-right hub · E4 → H3 (hub: fade) ──
  { id: 'red-branch-hub3', hub: true, d: 'M 733,70 C 738,95 755,130 772,170 C 792,215 810,250 822,285 C 838,330 865,365 890,390 C 900,400 908,405 911,409' },
  // ── PURPLE lower-right river road · E7 → H4 (hub: fade) ──
  { id: 'purple-hub4', hub: true, d: 'M 1240,332 C 1180,325 1120,340 1075,362 C 1040,380 1015,405 1005,432 C 1000,450 1008,465 1015,478' },
  // ── Bottom arm up to lower-center hub · E8 → H2 (hub: fade) ──
  { id: 'bottom-arm-hub2', hub: true, d: 'M 500,530 C 498,512 500,495 515,482 C 540,460 590,447 630,438 C 650,434 663,432 671,430' },
];

const SPEED = 28;      // svg units / second — steady highway cruise (≈18–21 s on long routes)
const MIN_DUR = 7;     // s — floor so short hub arms don't flash by
const FADE_OUT = 1.2;  // s — smooth fade at hub arrival
const FADE_IN = 0.4;   // s — soft entry (paths already start off-screen)

const TRUCKS = [
  { id: 'r', fill: '#EF4444', dark: '#991B1B' },
  { id: 'g', fill: '#22C55E', dark: '#14532D' },
  { id: 'p', fill: '#A855F7', dark: '#581C87' },
  { id: 'y', fill: '#EAB308', dark: '#78350F' },
] as const;

// Shared truck silhouette — side-profile semi-truck built from rects.
// origin (0,0) = truck centre; rotation keeps it tangent to the road.
const TruckBody = ({ fill, dark, win }: { fill: string; dark: string; win: string }) => (
  <>
    {/* trailer */}
    <rect x="-18" y="-5.5" width="19" height="11" rx="1.5" fill={fill} />
    {/* cab */}
    <rect x="1" y="-5.5" width="13" height="11" rx="2" fill={fill} />
    {/* windshield */}
    <rect x="11" y="-4" width="3" height="8" rx="0.5" fill={win} />
    {/* cab shadow */}
    <rect x="1" y="-3.5" width="3" height="7" rx="0.5" fill="rgba(0,0,0,0.15)" />
    {/* trailer wheels */}
    <rect x="-16" y="5.5" width="5" height="2.5" rx="1" fill={dark} />
    <rect x="-9" y="5.5" width="5" height="2.5" rx="1" fill={dark} />
    {/* cab wheels */}
    <rect x="3" y="5.5" width="4" height="2.5" rx="1" fill={dark} />
    {/* mirrored top wheels */}
    <rect x="-16" y="-8" width="5" height="2.5" rx="1" fill={dark} />
    <rect x="-9" y="-8" width="5" height="2.5" rx="1" fill={dark} />
    <rect x="3" y="-8" width="4" height="2.5" rx="1" fill={dark} />
  </>
);

export function AnimatedBeam({ height = 1050, framing = 'stretch', zoom = 1 }: {
  height?: number;
  framing?: 'stretch' | 'cover';
  zoom?: number;
} = {}) {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mapSize, setMapSize] = useState({ width: 1200, height });
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const truckRefs = useRef<(SVGGElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      // Fit the complete map frame to the section. The raster and route SVG
      // share this exact frame so the animated trucks stay registered to roads.
      setMapSize({ width, height });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lens = ROUTES.map((_, i) => {
      try {
        return pathRefs.current[i]?.getTotalLength() ?? 0;
      } catch {
        return 0;
      }
    });
    if (lens.every(l => l === 0)) return; // paths not measurable — bail

    type TruckState = { route: number; dur: number; t0: number; phase: 'drive' | 'wait' };

    const pickRoute = (exclude: number[]): number => {
      const avail = ROUTES.map((_, i) => i).filter(i => !exclude.includes(i) && lens[i] > 0);
      if (avail.length > 0) return avail[Math.floor(Math.random() * avail.length)];
      // Degenerate fallback (many paths unmeasurable): reuse any measurable route.
      // At least one exists — the effect bails earlier if all lengths are 0.
      const measurable = ROUTES.map((_, i) => i).filter(i => lens[i] > 0);
      return measurable[Math.floor(Math.random() * measurable.length)];
    };

    // Initial: 4 distinct routes, trucks staggered mid-route for instant screen presence
    const trucks: TruckState[] = [];
    for (let i = 0; i < TRUCKS.length; i++) {
      const route = pickRoute(trucks.map(t => t.route));
      trucks.push({ route, dur: Math.max(lens[route] / SPEED, MIN_DUR), t0: 0, phase: 'drive' });
    }

    let raf = 0;
    let inited = false;

    const step = (now: number) => {
      if (!inited) {
        trucks.forEach(ts => {
          ts.t0 = now - (0.15 + Math.random() * 0.5) * ts.dur * 1000;
        });
        inited = true;
      }

      trucks.forEach((ts, i) => {
        const g = truckRefs.current[i];
        const path = pathRefs.current[ts.route];
        if (!g || !path) return;

        if (ts.phase === 'wait') {
          if (now < ts.t0) {
            g.setAttribute('opacity', '0');
            return;
          }
          ts.phase = 'drive';
        }

        const p = (now - ts.t0) / (ts.dur * 1000);
        if (p >= 1) {
          // Route finished — respawn on a random route not in use by any truck
          const others = trucks.filter((_, j) => j !== i).map(t => t.route);
          const next = pickRoute([ts.route, ...others]);
          ts.route = next;
          ts.dur = Math.max(lens[next] / SPEED, MIN_DUR);
          ts.t0 = now + 400 + Math.random() * 1200; // brief gap before re-entry
          ts.phase = 'wait';
          g.setAttribute('opacity', '0');
          return;
        }

        const len = lens[ts.route];
        const dist = p * len;
        const pt = path.getPointAtLength(dist);
        const a = path.getPointAtLength(Math.max(0, dist - 1.5));
        const b = path.getPointAtLength(Math.min(len, dist + 1.5));
        const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
        g.setAttribute('transform', `translate(${pt.x} ${pt.y}) rotate(${ang})`);

        // Opacity: soft fade-in on entry; smooth fade-out approaching a hub
        const tSec = (now - ts.t0) / 1000;
        let op = Math.min(1, tSec / FADE_IN);
        if (ROUTES[ts.route].hub) {
          const remain = ts.dur - tSec;
          op = Math.min(op, Math.max(0, remain / FADE_OUT));
        }
        g.setAttribute('opacity', op.toFixed(3));
      });

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div id="freight-map" ref={containerRef} style={{ height }} className="relative w-full scroll-mt-16 overflow-hidden flex items-center justify-center bg-[#0B1929]">

      {/* Keep the image and routes in one frame so zooming preserves alignment. */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={getMapFrame(mapSize, framing, zoom)}>
      <div
        className="absolute inset-0 bg-[length:100%_100%] bg-center"
        style={{
          backgroundImage: "url(/citymap.png)",
          filter: "grayscale(1) invert(1) brightness(0.86) contrast(1.14)",
        }}
      />
      <div className="absolute inset-0 bg-[#0B1929]/42" />

      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 -75.284 1200 750.568"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="mapGlow" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#219EBC" stopOpacity="0.18" />
            <stop offset="70%" stopColor="#219EBC" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#219EBC" stopOpacity="0" />
          </radialGradient>
          {(['r', 'g', 'p', 'y'] as const).map(id => (
            <filter key={id} id={`glow-${id}`} x="-150%" y="-150%" width="400%" height="400%">
              <feGaussianBlur stdDeviation="3.5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          ))}
        </defs>

        <rect width="1200" height="600" fill="url(#mapGlow)" />

        {/* Invisible route geometry — measured via getPointAtLength each frame */}
        {ROUTES.map((r, i) => (
          <path
            key={r.id}
            ref={el => { pathRefs.current[i] = el; }}
            d={r.d}
            fill="none"
            stroke="none"
          />
        ))}

        {/* 4 trucks — positions driven by the rAF loop above */}
        {TRUCKS.map((t, i) => (
          <g
            key={t.id}
            ref={el => { truckRefs.current[i] = el; }}
            filter={`url(#glow-${t.id})`}
            opacity="0"
          >
            <TruckBody fill={t.fill} dark={t.dark} win="rgba(255,255,255,0.35)" />
          </g>
        ))}
      </svg>
      </div>

      {/* Section headline + body */}
      <div className="relative z-10 text-center px-4 max-w-3xl">
        <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 uppercase tracking-tight">
          {t('beamHeadline')}
        </h2>
        <p className="text-lg md:text-xl text-gray-300 font-sans leading-relaxed">
          {t('beamBody')}
        </p>
      </div>
    </div>
  );
}
