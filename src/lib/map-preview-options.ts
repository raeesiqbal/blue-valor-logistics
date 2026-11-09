export const MAP_FRAMING_OPTIONS = [
  { id: 'full', label: 'Full map (stretched)', framing: 'stretch', zoom: 1 },
  { id: 'earlier', label: 'Earlier image crop', framing: 'cover', zoom: 1 },
  { id: 'slight', label: 'Slightly closer', framing: 'cover', zoom: 1.15 },
  { id: 'closer', label: 'Closer', framing: 'cover', zoom: 1.3 },
  { id: 'close', label: 'Close-up', framing: 'cover', zoom: 1.5 },
  { id: 'tight', label: 'Tight close-up', framing: 'cover', zoom: 1.8 },
] as const;

export type MapFramingOption = (typeof MAP_FRAMING_OPTIONS)[number];

/** Crop artwork and road routes as one frame, without changing foreground text. */
export function getMapFrame(
  container: { width: number; height: number },
  framing: 'stretch' | 'cover' = 'stretch',
  zoom = 1,
) {
  if (framing === 'stretch') {
    return { width: container.width * zoom, height: container.height * zoom };
  }
  const width = Math.max(container.width, container.height * 1586 / 992) * zoom;
  return { width, height: width * 992 / 1586 };
}
