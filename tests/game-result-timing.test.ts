import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resultHoldMs, RESULT_FADE_MS } from '../src/lib/game-result-timing';

test('loss holds for three seconds after the slam and rock', () => {
  assert.equal(resultHoldMs('blue', false), 4500);
  assert.equal(resultHoldMs('blue', false) + RESULT_FADE_MS, 5000);
});

test('reduced-motion loss holds after a fade only', () => {
  assert.equal(resultHoldMs('blue', true), 3200);
  assert.equal(resultHoldMs('blue', true) + RESULT_FADE_MS, 3700);
});

test('draw and visitor win keep their requested hold and exit timings', () => {
  for (const reducedMotion of [false, true]) {
    assert.equal(resultHoldMs('draw', reducedMotion), 3000);
    assert.equal(resultHoldMs('visitor', reducedMotion), 5000);
  }
  assert.equal(RESULT_FADE_MS, 500);
});
