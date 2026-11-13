const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

test('the bank API lockfile is valid JSON and matches package.json', () => {
  const dir = path.join(__dirname, '../7-bank-project/api');
  const lock = JSON.parse(fs.readFileSync(path.join(dir, 'package-lock.json'), 'utf8'));
  const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
  const root = lock.packages[''];

  assert.equal(lock.lockfileVersion >= 1, true);
  assert.deepEqual(root.dependencies, pkg.dependencies);
  assert.deepEqual(root.devDependencies, pkg.devDependencies);

  const serveStatic = lock.packages['node_modules/serve-static'];
  assert.equal(serveStatic.dependencies.send, '0.19.0');
  assert.equal(serveStatic.dependencies['define-data-property'], undefined);
});
