const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { parseBalance } = require('./balance.js');

test('empty opening balance becomes zero and invalid values are rejected', () => {
  assert.deepEqual(parseBalance(''), { ok: true, value: 0 });
  assert.deepEqual(parseBalance(undefined), { ok: true, value: 0 });
  assert.deepEqual(parseBalance('100.5'), { ok: true, value: 100.5 });
  assert.deepEqual(parseBalance('-20'), { ok: true, value: -20 });
  assert.equal(parseBalance('abc').ok, false);
  assert.match(parseBalance('abc').error, /number/i);
});

test('the bank register form uses parseBalance instead of coercing invalid amounts to zero', () => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const app = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
  assert.match(html, /src="balance\.js"/);
  assert.match(app, /parseBalance\(/);
  assert.doesNotMatch(app, /Number\(data\.balance \|\| 0\) \|\| 0/);
});
