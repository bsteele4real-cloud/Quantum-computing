const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { preferredTheme, applyTheme, toggleTheme } = require('./theme.js');

function fakeDoc(theme) {
  const attrs = { 'data-theme': theme };
  const btnAttrs = {};
  return {
    documentElement: {
      getAttribute: (name) => attrs[name],
      setAttribute: (name, value) => { attrs[name] = value; },
    },
    getElementById: (id) => (id === 'themeToggle' ? {
      setAttribute: (name, value) => { btnAttrs[name] = value; },
      attrs: btnAttrs,
    } : null),
    attrs,
    btnAttrs,
  };
}

function fakeStorage(initial) {
  const data = { ...initial };
  return {
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => { data[key] = value; },
    data,
  };
}

test('preferredTheme uses a saved value, then the system preference', () => {
  assert.equal(preferredTheme(fakeStorage({ bankTheme: 'dark' })), 'dark');
  assert.equal(preferredTheme(fakeStorage({}), () => ({ matches: true })), 'dark');
  assert.equal(preferredTheme(fakeStorage({}), () => ({ matches: false })), 'light');
});

test('toggleTheme flips light and dark and updates the button label', () => {
  const doc = fakeDoc('light');
  const storage = fakeStorage();
  assert.equal(toggleTheme(doc, storage), 'dark');
  assert.equal(doc.attrs['data-theme'], 'dark');
  assert.equal(storage.data.bankTheme, 'dark');
  assert.equal(doc.btnAttrs['aria-pressed'], 'true');
  assert.equal(toggleTheme(doc, storage), 'light');
});

test('the bank dashboard theme toggle is wired and CSS honors data-theme', () => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const app = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8');
  assert.match(html, /src="theme\.js"/);
  assert.match(app, /toggleTheme\(/);
  assert.match(css, /html\[data-theme="dark"\]/);
  assert.match(css, /html\[data-theme="light"\]/);
});
