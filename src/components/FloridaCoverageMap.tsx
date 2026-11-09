import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useI18n } from '../lib/i18n';

// Longitude/latitude boundary supplied in the user's map.
const FLORIDA_BOUNDARY: [number, number][] = [
  [-87.6372, 30.9975], [-85.0041, 31.0030], [-82.0420, 30.3571],
  [-81.9325, 30.5050], [-81.4833, 30.7132], [-81.4011, 30.3232],
  [-81.2587, 29.8028], [-80.7712, 28.6186], [-80.0592, 26.8584],
  [-80.0921, 26.0148], [-80.1250, 25.7781], [-80.3331, 25.2358],
  [-80.4974, 25.1317], [-81.1109, 25.1153], [-81.1273, 25.3289],
  [-81.3738, 25.8438], [-81.8285, 26.5176], [-82.2612, 26.7915],
  [-82.4365, 27.2407], [-82.7213, 27.6461], [-82.5186, 27.9747],
  [-82.8473, 28.1007], [-82.6775, 28.9113], [-83.5484, 29.5467],
  [-84.0907, 30.1055], [-84.3427, 30.0123], [-84.5837, 29.8973],
  [-85.3067, 29.6782], [-85.3998, 29.9083], [-85.7175, 30.1548],
  [-86.4131, 30.3739], [-86.7801, 30.3958], [-87.3169, 30.3411],
  [-87.5250, 30.2753], [-87.6372, 30.9975],
];

export default function FloridaCoverageMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tileError, setTileError] = useState(false);
  const { language } = useI18n();
  const spanish = language === 'es';

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const map = L.map(container, {
      center: [27.9944, -81.7603],
      zoom: 6,
      minZoom: 4,
      maxZoom: 12,
      scrollWheelZoom: false,
      zoomAnimation: !reduceMotion,
      fadeAnimation: !reduceMotion,
    });
    const basemapPane = map.createPane('dark-basemap');
    basemapPane.style.zIndex = '200';
    basemapPane.style.filter = 'invert(1) hue-rotate(180deg) brightness(0.75) saturate(0.4)';
    const tiles = L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        pane: 'dark-basemap',
        maxNativeZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
    ).addTo(map);
    tiles.on('tileerror', () => setTileError(true));

    const floridaBoundary = {
      type: 'Feature' as const,
      properties: { name: 'Florida' },
      geometry: { type: 'Polygon' as const, coordinates: [FLORIDA_BOUNDARY] },
    };
    const boundary = L.geoJSON(floridaBoundary, {
      style: {
        color: '#00ffff',
        weight: 3,
        opacity: 0.8,
        fillColor: '#00ffff',
        fillOpacity: 0.08,
      },
    }).addTo(map);

    const resize = () => {
      map.invalidateSize({ animate: false });
      // Keep the whole state visible, including the panhandle on narrow screens.
      map.fitBounds(boundary.getBounds(), { padding: [24, 24], maxZoom: 6, animate: false });
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    return () => {
      observer.disconnect();
      tiles.off();
      map.remove();
    };
  }, []);

  return (
    <div className="relative isolate overflow-hidden rounded-2xl border border-[#1a2744] bg-[#0b111e] shadow-2xl">
      <div
        ref={containerRef}
        role="region"
        aria-label={spanish ? 'Mapa interactivo de cobertura de Florida' : 'Interactive Florida coverage map'}
        className="relative z-0 h-[600px] w-full !bg-[#0b111e]"
      />
      {tileError && (
        <p role="status" className="absolute bottom-8 left-3 right-3 z-[500] rounded bg-[#0b111e]/95 p-3 text-sm text-white">
          {spanish
            ? 'No se pudieron cargar algunas partes del mapa. Recargue la página para volver a intentarlo.'
            : 'Some map tiles could not load. Refresh the page to try again.'}
        </p>
      )}
    </div>
  );
}
