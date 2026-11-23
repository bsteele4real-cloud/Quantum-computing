const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

test('the bank solution loads Font Awesome from the CDN', () => {
  const html = fs.readFileSync(path.join(root, '7-bank-project/solution/index.html'), 'utf8');
  assert.match(
    html,
    /https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/6\.5\.1\/css\/all\.min\.css/
  );
  assert.doesNotMatch(html, /assets\/fontawesome\/css\/all\.min\.css/);
});

test('the space game Font Awesome integrity matches the CDN file', () => {
  const html = fs.readFileSync(path.join(root, '6-space-game/solution/index.html'), 'utf8');
  assert.match(
    html,
    /integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U\/M7pSPA\/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg=="/
  );
  assert.doesNotMatch(html, /sha512-bWn0gM3Yx6w5OV6v4p/);
});
