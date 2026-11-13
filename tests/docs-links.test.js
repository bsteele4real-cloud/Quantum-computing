const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

test('English lessons link to the current Konsole and Narrator docs', () => {
  const intro = fs.readFileSync(
    path.join(root, '1-getting-started-lessons/1-intro-to-programming-languages/README.md'),
    'utf8'
  );
  assert.match(intro, /https:\/\/docs\.kde\.org\/stable_kf6\/en\/konsole\/konsole\/index\.html/);
  assert.doesNotMatch(intro, /docs\.kde\.org\/trunk5\/en\/konsole/);

  const accessibility = fs.readFileSync(
    path.join(root, '1-getting-started-lessons/3-accessibility/README.md'),
    'utf8'
  );
  assert.match(
    accessibility,
    /https:\/\/support\.microsoft\.com\/en-us\/accessibility\/windows\/narrator\/complete-guide-to-narrator/
  );
  assert.doesNotMatch(accessibility, /complete-guide-to-narrator-e4397a0d/);
});

test('the link checker skips translated copies and bot 403 responses', () => {
  const config = fs.readFileSync(path.join(root, '.lychee.toml'), 'utf8');
  const workflow = fs.readFileSync(path.join(root, '.github/workflows/links.yml'), 'utf8');
  assert.match(config, /exclude_path = \["translations", "translated_images"\]/);
  assert.match(config, /403/);
  assert.match(workflow, /lycheeverse\/lychee-action/);
  assert.match(workflow, /--config \.lychee\.toml/);
});

test('the carbon lesson no longer sorts the color scale in place', () => {
  const lesson = fs.readFileSync(
    path.join(root, '5-browser-extension/3-background-tasks-and-performance/README.md'),
    'utf8'
  );
  assert.match(lesson, /closestIndex/);
  assert.doesNotMatch(lesson, /co2Scale\.sort/);
});
