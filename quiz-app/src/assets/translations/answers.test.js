import test from 'node:test';
import assert from 'node:assert/strict';
import { isCorrectAnswer } from './answers.js';

test('correct answers may be a boolean or the string true', () => {
  assert.equal(isCorrectAnswer(true), true);
  assert.equal(isCorrectAnswer('true'), true);
  assert.equal(isCorrectAnswer('TRUE'), true);
  assert.equal(isCorrectAnswer(false), false);
  assert.equal(isCorrectAnswer('false'), false);
  assert.equal(isCorrectAnswer(1), false);
  assert.equal(isCorrectAnswer('yes'), false);
});
