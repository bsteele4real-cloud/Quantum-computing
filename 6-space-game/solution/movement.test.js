const test = require('node:test');
const assert = require('node:assert/strict');
const { stepPlayerMotion } = require('./movement');

test('cardinal movement faces the direction of travel', () => {
  const start = -Math.PI / 2;
  const right = stepPlayerMotion(1, 0, 240, start);
  assert.ok(Math.abs(right.angle - 0) < 1e-10);
  assert.ok(Math.abs(right.vx - 240) < 1e-10);
  assert.equal(right.vy, 0);

  const up = stepPlayerMotion(0, -1, 240, 0);
  assert.ok(Math.abs(up.angle - (-Math.PI / 2)) < 1e-10);
  assert.ok(Math.abs(up.vy - (-240)) < 1e-10);
});

test('a stopped ship keeps its angle and diagonal speed stays at accel', () => {
  const still = stepPlayerMotion(0, 0, 240, 0.3);
  assert.equal(still.vx, 0);
  assert.equal(still.vy, 0);
  assert.equal(still.angle, 0.3);

  const diagonal = stepPlayerMotion(1, 1, 240, 0);
  assert.ok(Math.abs(Math.hypot(diagonal.vx, diagonal.vy) - 240) < 1e-8);
});
