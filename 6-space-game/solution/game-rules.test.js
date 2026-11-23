const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { circlesOverlap, rankScores, readScoreList, writeScoreList } = require('./game-rules.js');

test('circles overlap when their radii meet and not when they only touch the edge', () => {
  assert.equal(circlesOverlap(0, 0, 5, 6, 0, 2), true);
  assert.equal(circlesOverlap(0, 0, 5, 7, 0, 2), false);
  assert.equal(circlesOverlap(0, 0, 5, 10, 0, 5), false);
  assert.equal(circlesOverlap(0, 0, 5, 9.9, 0, 5), true);
});

test('rankScores drops non-numeric rows, sorts by score, and keeps ten entries', () => {
  const ranked = rankScores([
    { initials: 'AAA', score: 10 },
    { initials: 'BBB', score: 'not a number' },
    { initials: 'CCC', score: 30 },
    { initials: 'DDD', score: 20 },
    null,
    { score: 5 },
  ]);
  assert.deepEqual(ranked.map((row) => row.score), [30, 20, 10, 5]);
  assert.equal(ranked[3].initials, 'YOU');
  const many = rankScores(Array.from({ length: 15 }, (_, i) => ({ initials: 'P', score: i })));
  assert.equal(many.length, 10);
  assert.equal(many[0].score, 14);
});

test('score storage ignores corrupt JSON and can record a new score', () => {
  const store = {
    data: { spaceGameScores: '{not json' },
    getItem(key) { return this.data[key]; },
    setItem(key, value) { this.data[key] = value; },
  };
  assert.deepEqual(readScoreList(store), []);
  const next = writeScoreList(store, 42, 'ME');
  assert.equal(next[0].score, 42);
  assert.equal(next[0].initials, 'ME');
  assert.equal(readScoreList(store).length, 1);
});

test('the space game uses the shared collision and score helpers', () => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const app = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
  assert.match(html, /src="game-rules\.js"/);
  assert.match(app, /circlesOverlap\(/);
  assert.match(app, /writeScoreList\(/);
  assert.match(app, /readScoreList\(/);
});
