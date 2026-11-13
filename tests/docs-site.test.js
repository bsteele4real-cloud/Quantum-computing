const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const htmlPath = path.join(__dirname, '../index.html');

test('the docs homepage is valid HTML with scripts the browser can parse', () => {
  const html = fs.readFileSync(htmlPath, 'utf8');
  assert.match(html, /^<!DOCTYPE html>/);
  assert.match(html, /<link rel="stylesheet" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/6\.4\.2\/css\/all\.min\.css">/);
  assert.doesNotMatch(html, /<script[^>]*>[\s\S]*<link /);
  assert.match(html, /src="https:\/\/cdn\.jsdelivr\.net\/npm\/docsify\/lib\/docsify\.min\.js"/);

  const scripts = [...html.matchAll(/<script type="text\/javascript">([\s\S]*?)<\/script>/g)].map((match) => match[1]);
  assert.equal(scripts.length, 2);
  for (const source of scripts) {
    const file = path.join(os.tmpdir(), `docs-site-${Math.random().toString(16).slice(2)}.js`);
    fs.writeFileSync(file, source);
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
    fs.unlinkSync(file);
  }
});
