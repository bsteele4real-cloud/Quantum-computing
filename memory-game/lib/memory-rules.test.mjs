import test from 'node:test';
import assert from 'node:assert/strict';
import { clickCard, clearMismatch, isValidGridSize, shouldStartMismatchTimer } from './memory-rules.mjs';

const cards = [
  { id: 0, number: 1 },
  { id: 1, number: 1 },
  { id: 2, number: 2 },
  { id: 3, number: 2 },
];

function fresh() {
  return { cards, flipped: [], selectedPairs: [], disabled: false, won: false };
}

test('matching every pair wins, and matched cards cannot be counted twice', () => {
  let state = fresh();
  state = clickCard(state, 0);
  state = clickCard(state, 1);
  assert.deepEqual(state.selectedPairs, [0, 1]);
  assert.equal(state.won, false);

  state = clickCard(state, 0);
  state = clickCard(state, 1);
  assert.deepEqual(state.selectedPairs, [0, 1]);
  assert.equal(state.won, false);

  state = clickCard(state, 2);
  state = clickCard(state, 3);
  assert.equal(state.won, true);
  assert.equal(state.selectedPairs.length, cards.length);
});

test('a mismatch locks the board until it is cleared', () => {
  const opened = clickCard(fresh(), 0);
  const locked = clickCard(opened, 2);
  assert.equal(shouldStartMismatchTimer(opened, locked), true);
  assert.deepEqual(locked.flipped, [0, 2]);
  assert.equal(locked.disabled, true);
  assert.equal(locked.won, false);

  const ignored = clickCard(locked, 1);
  assert.equal(ignored, locked);
  assert.equal(shouldStartMismatchTimer(locked, ignored), false);

  const cleared = clearMismatch(locked);
  assert.deepEqual(cleared.flipped, []);
  assert.equal(cleared.disabled, false);
});

test('grid size must be an even integer from 2 to 10', () => {
  assert.equal(isValidGridSize(4), true);
  assert.equal(isValidGridSize(10), true);
  assert.equal(isValidGridSize(3), false);
  assert.equal(isValidGridSize(1), false);
  assert.equal(isValidGridSize(12), false);
});
