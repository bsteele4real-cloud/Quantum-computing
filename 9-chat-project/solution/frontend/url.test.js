const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { joinUrl } = require('./url.js');

test('joinUrl keeps a single slash between the host and the path', () => {
  assert.equal(
    joinUrl('https://example-5000.app.github.dev/', '/hello'),
    'https://example-5000.app.github.dev/hello'
  );
  assert.equal(
    joinUrl('http://127.0.0.1:5000', 'hello'),
    'http://127.0.0.1:5000/hello'
  );
});

test('the chat client uses joinUrl and shows the API error detail', () => {
  const source = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
  assert.match(source, /joinUrl\(BASE_URL,\s*'\/hello'\)/);
  assert.match(source, /errBody\.detail/);
});
