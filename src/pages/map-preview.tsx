import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { AnimatedBeam } from '../components/AnimatedBeam';
import { MAP_FRAMING_OPTIONS, type MapFramingOption } from '../lib/map-preview-options';
import './map-preview.css';

const HEIGHT_OPTIONS = [
  { height: 620, label: 'Earlier banner' },
  { height: 450, label: 'Compact panoramic' },
  { height: 550, label: 'Short' },
  { height: 650, label: 'Balanced' },
  { height: 750, label: 'Tall' },
  { height: 900, label: 'Current homepage' },
  { height: 1050, label: 'Previous tall height' },
] as const;

type MapHeight = (typeof HEIGHT_OPTIONS)[number]['height'];
const DEFAULT_HEIGHT: MapHeight = 900;
const DEFAULT_VIEW: MapFramingOption['id'] = 'earlier';

function selectionFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const requestedHeight = Number(params.get('height'));
  const height = HEIGHT_OPTIONS.find((option) => option.height === requestedHeight)?.height ?? DEFAULT_HEIGHT;
  const requestedView = params.get('view');
  const view = MAP_FRAMING_OPTIONS.find((option) => option.id === requestedView)?.id ?? DEFAULT_VIEW;
  return { height, view };
}

export default function MapPreview() {
  const [selection, setSelection] = useState(selectionFromUrl);
  const { height, view } = selection;
  const selected = HEIGHT_OPTIONS.find((option) => option.height === height) ?? HEIGHT_OPTIONS[0];
  const selectedView = MAP_FRAMING_OPTIONS.find((option) => option.id === view) ?? MAP_FRAMING_OPTIONS[1];

  useEffect(() => {
    const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const previousRobots = robots?.content;
    const createdRobots = !robots;
    const robotsTag = robots ?? document.createElement('meta');
    robotsTag.name = 'robots';
    robotsTag.content = 'noindex, nofollow';
    if (createdRobots) document.head.appendChild(robotsTag);

    const syncSelection = () => setSelection(selectionFromUrl());
    window.addEventListener('popstate', syncSelection);
    return () => {
      window.removeEventListener('popstate', syncSelection);
      if (createdRobots) robotsTag.remove();
      else if (previousRobots !== undefined) robotsTag.content = previousRobots;
    };
  }, []);

  const updateSelection = (next: { height: MapHeight; view: MapFramingOption['id'] }) => {
    setSelection(next);
    const url = new URL(window.location.href);
    url.searchParams.set('height', String(next.height));
    url.searchParams.set('view', next.view);
    window.history.pushState(window.history.state, '', url);
  };

  const selectHeight = (nextHeight: MapHeight) => updateSelection({ height: nextHeight, view });
  const selectView = (nextView: MapFramingOption['id']) => updateSelection({ height, view: nextView });

  return (
    <div className="map-preview-page">
      <header className="map-preview-header">
        <div className="map-preview-header-inner">
          <div className="map-preview-brandline">
            <span className="map-preview-mark" aria-hidden="true">BV</span>
            <span>Blue Valor Logistics</span>
            <span className="map-preview-private">Design preview</span>
          </div>

          <div className="map-preview-intro">
            <div>
              <p className="map-preview-kicker">Road map comparison</p>
              <h1>Find the right frame.</h1>
              <p className="map-preview-description">
                Compare image framing first, then tune the section height. The raster map and
                animated routes zoom and crop together; centered copy stays fixed.
              </p>
            </div>
            <Link href="/" className="map-preview-home-link" data-testid="link-homepage">
              Back to homepage
              <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <section className="map-preview-controls" aria-label="Map preview settings">
            <div className="map-preview-control-heading">
              <div>
                <h2 id="map-preview-framing">01 / Image framing</h2>
                <p>Closer views make roads bigger and leave fewer visible lines.</p>
              </div>
              <p className="map-preview-current" aria-live="polite" data-testid="selected-map-state">
                <span className="map-preview-current-dot" aria-hidden="true" />
                Showing <strong>{selectedView.label}</strong><span className="map-preview-readout-divider">/</span>
                <strong>{selected.height}px</strong>
              </p>
            </div>

            <div className="map-preview-options map-preview-framing-options" role="group" aria-labelledby="map-preview-framing">
              {MAP_FRAMING_OPTIONS.map((option, index) => {
                const isSelected = option.id === view;
                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`map-preview-option map-preview-framing-option${isSelected ? ' is-selected' : ''}`}
                    onClick={() => selectView(option.id)}
                    aria-pressed={isSelected}
                    aria-label={`Framing ${index + 1}: ${option.label}, ${option.zoom === 1 ? 'original scale' : `${option.zoom} times zoom`}`}
                    data-testid={`button-map-view-${option.id}`}
                  >
                    <span className="map-preview-option-top">
                      <span className="map-preview-option-number">0{index + 1}</span>
                      {isSelected && <span className="map-preview-reference">Selected</span>}
                    </span>
                    <strong className="map-preview-framing-zoom">{option.zoom === 1 ? '1×' : `${option.zoom}×`}</strong>
                    <span className="map-preview-option-label">{option.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="map-preview-height-heading">
              <div>
                <h2 id="map-preview-height">02 / Section height</h2>
                <p>Height changes the visible banner area, not the framing choice.</p>
              </div>
            </div>
            <div className="map-preview-height-options" role="group" aria-labelledby="map-preview-height">
              {HEIGHT_OPTIONS.map((option) => {
                const isSelected = option.height === height;
                return (
                  <button
                    key={option.height}
                    type="button"
                    className={`map-preview-height-option${isSelected ? ' is-selected' : ''}`}
                    onClick={() => selectHeight(option.height)}
                    aria-pressed={isSelected}
                    aria-label={`${option.height} pixels, ${option.label}`}
                    data-testid={`button-map-height-${option.height}`}
                  >
                    <strong>{option.height}<span>px</span></strong>
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="map-preview-notice" role="note" data-testid="preview-only-notice">
              <span className="map-preview-notice-icon" aria-hidden="true">i</span>
              <p>
                Preview only. The homepage remains unchanged. Share this link to keep both choices:
                {` ?height=${height}&view=${view}`}.
              </p>
            </div>
          </section>
        </div>
      </header>

      <section className="map-preview-live" aria-label={`Live map preview, ${selectedView.label}, ${height} pixels`}>
        <AnimatedBeam height={selected.height} framing={selectedView.framing} zoom={selectedView.zoom} />
      </section>
    </div>
  );
}
