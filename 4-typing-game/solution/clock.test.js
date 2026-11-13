const test = require('node:test');
const assert = require('node:assert/strict');
const { formatClock } = require('./clock');

test('midnight and noon stay at 12, and 13:05 is 1:05 PM', () => {
  assert.equal(formatClock(new Date(2020, 0, 2, 0, 5)).time, '12:05 AM');
  assert.equal(formatClock(new Date(2020, 0, 2, 12, 0)).time, '12:00 PM');
  assert.equal(formatClock(new Date(2020, 0, 2, 13, 5)).time, '1:05 PM');
  assert.equal(formatClock(new Date(2020, 0, 2, 13, 5)).date, '02/01/2020');
});
