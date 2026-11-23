const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const source = fs.readFileSync(path.join(__dirname, 'MemoryGame.jsx'), 'utf8');

test('the grid size input is labeled and steps by two', () => {
  assert.match(source, /htmlFor=["']gridSize["']/);
  assert.match(source, /id=["']gridSize["']/);
  assert.match(source, /step=["']2["']/);
  assert.match(source, /id=["']gridSizeError["']/);
  assert.match(source, /role=["']alert["']/);
});

test('memory cards are keyboard-accessible buttons with labels', () => {
  assert.match(source, /<button/);
  assert.match(source, /type=["']button["']/);
  assert.match(source, /aria-label=\{label\}/);
  assert.match(source, /aria-pressed=\{flippedCard\}/);
  assert.match(source, /role=["']group["']/);
  assert.doesNotMatch(source, /<div\s+key=\{card\.id\}\s+onClick/);
});

test('winning is announced to assistive technology', () => {
  assert.match(source, /role=["']status["']/);
  assert.match(source, /aria-live=["']polite["']/);
});
