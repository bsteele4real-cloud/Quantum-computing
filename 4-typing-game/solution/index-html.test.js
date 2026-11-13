const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

test('the typing page has a single body and loads the game scripts in order', () => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  assert.equal((html.match(/<body\b/gi) || []).length, 1);
  assert.equal((html.match(/<\/body>/gi) || []).length, 1);
  assert.equal((html.match(/<h1\b/gi) || []).length, 1);

  const dateAt = html.indexOf('id="current-date"');
  const logicAt = html.indexOf('./typing-logic.js');
  const gameAt = html.indexOf('./index.js');
  const bodyEnd = html.lastIndexOf('</body>');
  assert.ok(dateAt > 0 && dateAt < bodyEnd);
  assert.ok(logicAt > 0 && logicAt < gameAt && gameAt < bodyEnd);
});
