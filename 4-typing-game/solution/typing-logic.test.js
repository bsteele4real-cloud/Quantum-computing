const test = require('node:test');
const assert = require('node:assert/strict');
const { createTypingState, reduceTyping } = require('./typing-logic');

const quote = 'one two';

test('finishes on the last word and can be restarted from a fresh state', () => {
  let state = createTypingState(quote);
  state = reduceTyping(state, 'one ');
  assert.equal(state.wordIndex, 1);
  assert.equal(state.input, '');
  assert.equal(state.finished, false);

  state = reduceTyping(state, 'two');
  assert.equal(state.finished, true);
  assert.equal(state.disabled, true);
  assert.equal(state.error, false);

  const again = createTypingState(quote);
  assert.equal(again.disabled, false);
  assert.equal(again.finished, false);
  assert.equal(again.wordIndex, 0);
});

test('a trailing space on the last word finishes instead of walking off the quote', () => {
  let state = createTypingState(quote);
  state = reduceTyping(state, 'one ');
  state = reduceTyping(state, 'two ');
  assert.equal(state.finished, true);
  assert.equal(state.wordIndex, 1);
  assert.equal(state.words[state.wordIndex], 'two');
});

test('a corrected prefix clears the error flag', () => {
  let state = createTypingState(quote);
  state = reduceTyping(state, 'x');
  assert.equal(state.error, true);
  assert.equal(state.message, 'error');

  state = reduceTyping(state, 'o');
  assert.equal(state.error, false);
  assert.equal(state.message, 'progress');
});
