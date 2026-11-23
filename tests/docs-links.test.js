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
  assert.match(config, /translations/);
  assert.match(config, /translated_images/);
  assert.match(config, /node_modules/);
  assert.match(config, /403/);
  assert.match(config, /exclude_loopback = true/);
  assert.match(workflow, /lycheeverse\/lychee-action/);
  assert.match(workflow, /--config \.lychee\.toml/);
  assert.match(workflow, /--root-dir/);
});

test('English pages replace the remaining 404s from the link reports', () => {
  const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
  assert.match(readme, /https:\/\/github\.com\/microsoft\/Web-Dev-For-Beginners\)/);
  assert.doesNotMatch(readme, /Web-Dev-For-Beginners\/stargazers/);
  assert.doesNotMatch(readme, /Web-Dev-For-Beginners\/watchers/);
  assert.match(readme, /https:\/\/github\.com\/microsoft\/IoT-For-Beginners/);
  assert.doesNotMatch(readme, /aka\.ms\/iot-beginners/);

  const forms = fs.readFileSync(path.join(root, '7-bank-project/2-forms/README.md'), 'utf8');
  assert.match(forms, /https:\/\/codepen\.io\//);
  assert.doesNotMatch(forms, /https:\/\/codepen\.com/);

  const chat = fs.readFileSync(path.join(root, '9-chat-project/README.md'), 'utf8');
  assert.match(
    chat,
    /https:\/\/docs\.github\.com\/en\/github-models\/use-github-models\/prototyping-with-ai-models/
  );
  assert.doesNotMatch(chat, /gpt-4o-mini\/playground/);

  const assignment = fs.readFileSync(
    path.join(root, '5-browser-extension/2-forms-browsers-local-storage/assignment.md'),
    'utf8'
  );
  assert.match(assignment, /https:\/\/nummers\.eu\/api/);
  assert.match(assignment, /https:\/\/zenquotes\.io\//);
  assert.doesNotMatch(assignment, /numbersapi\.com/);
  assert.doesNotMatch(assignment, /quotable\.io/);
});

test('the carbon lesson no longer sorts the color scale in place', () => {
  const lesson = fs.readFileSync(
    path.join(root, '5-browser-extension/3-background-tasks-and-performance/README.md'),
    'utf8'
  );
  assert.match(lesson, /closestIndex/);
  assert.doesNotMatch(lesson, /co2Scale\.sort/);
});
