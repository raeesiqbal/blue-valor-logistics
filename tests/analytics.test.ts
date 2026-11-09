import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import { submitTrackedQuote } from '../src/lib/analytics-events';
import { getPageTitle, pageTitles } from '../src/lib/page-titles';

test('a quote emits only after success, with only the allowlisted equipment', async () => {
  const target = new EventTarget();
  Object.defineProperty(globalThis, 'window', { value: target, configurable: true });
  const events: unknown[] = [];
  target.addEventListener('blue-valor-conversion', event => events.push((event as CustomEvent).detail));
  let finish!: (value: string) => void;
  const submission = new Promise<string>(resolve => { finish = resolve; });
  const pending = submitTrackedQuote(submission, 'reefer');
  assert.equal(events.length, 0);
  finish('email sent');
  assert.equal(await pending, 'email sent');
  assert.deepEqual(events, [{ name: 'quote_request', equipment: 'reefer' }]);
  await assert.rejects(submitTrackedQuote(Promise.reject(new Error('email failed')), 'flatbed'));
  assert.equal(events.length, 1);
  for (const equipment of ['dryvan', 'flatbed', '', 'unrecognized']) {
    await submitTrackedQuote(Promise.resolve(), equipment);
  }
  assert.deepEqual(events.slice(1), ['dryvan', 'flatbed', 'not set', 'not set'].map(equipment => ({
    name: 'quote_request', equipment,
  })));
});

function analyticsFrame() {
  let receive!: (event: unknown) => void;
  const ready: unknown[] = [];
  const parent = { postMessage: (data: unknown) => ready.push(data) };
  const window = {
    parent, location: { origin: 'https://example.test' }, dataLayer: [] as IArguments[],
    addEventListener: (_: string, listener: typeof receive) => { receive = listener; },
  };
  const document = { title: '', head: { appendChild() {} }, createElement: () => ({}) };
  const html = readFileSync(new URL('../public/analytics-frame.html', import.meta.url), 'utf8');
  const script = html.match(/<script>([\s\S]*?)<\/script>/)![1];
  vm.runInNewContext(script, { window, document });
  return {
    document, ready,
    send: (data: unknown) => receive({ origin: window.location.origin, source: parent, data }),
    calls: () => JSON.parse(JSON.stringify(window.dataLayer.map(args => Array.from(args)))) as unknown[][],
  };
}

const view = (path: string) => ({
  type: 'blue-valor-page-view', measurementId: 'G-TEST12345', path, base: '', debug: false,
});

test('early quote conversions are queued, not dropped, until GA is configured', () => {
  const frame = analyticsFrame();
  frame.send({ type: 'blue-valor-conversion', name: 'quote_request', equipment: 'reefer', ignored: 'never sent' });
  assert.equal(frame.calls().length, 0);
  frame.send(view('/quote'));
  const conversions = frame.calls().filter(call => call[1] === 'quote_request');
  assert.deepEqual(conversions, [['event', 'quote_request', { equipment: 'reefer' }]]);
  assert.equal(frame.ready.length, 1);
  // A cached iframe can announce load after the first page-view message.
  frame.send(view('/quote'));
  assert.equal(frame.ready.length, 2);
  assert.equal(frame.calls().filter(call => call[1] === 'page_view').length, 1);
  assert.equal(frame.calls().filter(call => call[1] === 'quote_request').length, 1);
  frame.send({ type: 'blue-valor-conversion', name: 'contact_request', email: 'ignored' });
  assert.deepEqual(frame.calls().at(-1), ['event', 'contact_request']);
});

test('every public page records its exact distinct title and a query-free location', () => {
  const frame = analyticsFrame();
  for (const path of [...Object.keys(pageTitles).filter(path => !['/banner-preview', '/shippers/admin'].includes(path)), '/404']) {
    frame.send(view(path));
    const payload = frame.calls().filter(call => call[1] === 'page_view').at(-1)![2] as Record<string, string>;
    assert.equal(payload.page_title, getPageTitle(path));
    assert.equal(frame.document.title, getPageTitle(path));
    assert.equal(payload.page_location, `https://example.test${path}`);
  }
  const count = frame.calls().length;
  frame.send(view('/quote?private=value'));
  assert.equal(frame.calls().length, count);
  assert.equal(getPageTitle('/contact?private=value#form'), 'Contact | Blue Valor Logistics');
});

test('favicon contains the required two ICO sizes and all PNG dimensions', () => {
  const ico = readFileSync(new URL('../public/favicon.ico', import.meta.url));
  assert.equal(ico.readUInt16LE(2), 1);
  assert.equal(ico.readUInt16LE(4), 2);
  assert.equal(ico[6], 16);
  assert.equal(ico[22], 32);
  for (const [file, size] of [
    ['favicon-32x32.png', 32], ['apple-touch-icon.png', 180],
    ['android-chrome-192x192.png', 192], ['android-chrome-512x512.png', 512],
  ] as const) {
    const png = readFileSync(new URL(`../public/${file}`, import.meta.url));
    assert.equal(png.readUInt32BE(16), size);
    assert.equal(png.readUInt32BE(20), size);
  }
});
