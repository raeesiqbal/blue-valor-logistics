import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getMapFrame, MAP_FRAMING_OPTIONS } from '../src/lib/map-preview-options';

test('homepage defaults retain the exact full section frame', () => {
  for (const width of [390, 1440, 1920]) {
    assert.deepEqual(getMapFrame({ width, height: 1050 }), { width, height: 1050 });
  }
});

test('earlier centered cover crop matches the source image proportions', () => {
  for (const container of [{ width: 1920, height: 620 }, { width: 390, height: 620 }]) {
    const frame = getMapFrame(container, 'cover');
    assert.ok(frame.width >= container.width);
    assert.ok(frame.height >= container.height);
    assert.ok(Math.abs(frame.width / frame.height - 1586 / 992) < 1e-10);
  }
});

test('each zoom increases image and route frame together without changing section size', () => {
  const container = { width: 1440, height: 620 };
  const base = getMapFrame(container, 'cover');
  for (const option of MAP_FRAMING_OPTIONS.filter(option => option.framing === 'cover')) {
    const frame = getMapFrame(container, option.framing, option.zoom);
    assert.ok(Math.abs(frame.width - base.width * option.zoom) < 1e-8);
    assert.ok(Math.abs(frame.height - base.height * option.zoom) < 1e-8);
  }
  assert.deepEqual(container, { width: 1440, height: 620 });
});
