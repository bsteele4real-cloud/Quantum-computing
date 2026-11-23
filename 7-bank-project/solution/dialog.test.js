const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { setDialogOpen } = require('./dialog.js');

function fakeDialog(hidden = true) {
  const classes = new Set(hidden ? [] : ['show']);
  return {
    hidden,
    classList: {
      add: (name) => classes.add(name),
      remove: (name) => classes.delete(name),
      contains: (name) => classes.has(name),
    },
  };
}

test('opening the dialog clears hidden and adds show', () => {
  const dialog = fakeDialog(true);
  setDialogOpen(dialog, true);
  assert.equal(dialog.hidden, false);
  assert.equal(dialog.classList.contains('show'), true);
});

test('closing the dialog sets hidden and removes show', () => {
  const dialog = fakeDialog(false);
  dialog.classList.add('show');
  setDialogOpen(dialog, false);
  assert.equal(dialog.hidden, true);
  assert.equal(dialog.classList.contains('show'), false);
});

test('the bank page loads the helper and does not rebind dismiss handlers on each open', () => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const app = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
  assert.match(html, /src="dialog\.js"/);
  assert.match(app, /setDialogOpen\(dialog,\s*true\)/);
  assert.match(app, /setDialogOpen\(dialog,\s*false\)/);
  assert.match(app, /querySelectorAll\('#transactionDialog \[data-dismiss\]'\)/);
  assert.doesNotMatch(app, /backdrop\.addEventListener\('click', onDialogDismissClick\)/);
});
