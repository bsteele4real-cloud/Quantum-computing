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

test('the chat client defaults to the local lesson API, not a leftover Codespace host', () => {
  const source = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
  assert.match(source, /const BASE_URL = "http:\/\/localhost:5000"/);
  assert.doesNotMatch(source, /app\.github\.dev/);
  const page = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  assert.match(page, /http:\/\/localhost:5000\/hello/);
});

test('the chat client wires theme toggle and clear chat', () => {
  const source = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
  const styles = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8');
  assert.match(source, /getElementById\('themeToggle'\)/);
  assert.match(source, /getElementById\('clearChat'\)/);
  assert.match(source, /data-theme/);
  assert.match(source, /Chat cleared/);
  assert.match(styles, /\[data-theme="light"\]/);
});
