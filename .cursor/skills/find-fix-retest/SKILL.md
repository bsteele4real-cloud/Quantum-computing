---
name: find-fix-retest
description: Find real bugs from the repo and its open GitHub issues, fix them in small tested steps, and leave a draft pull request plus CI. Use for a find-fix-retest loop, curriculum or sample-app bug hunts, "fix the open issues", or when the user wants a reusable check workflow and a skill for the next run.
---

# Find, fix, retest

Work in rounds. Stop at five rounds, or sooner when nothing high-value is left. Do not merge, push to the default branch, force-push, deploy, or create accounts. Do not close, comment on, or relabel issues. Reference them as `Refs #N`.

## Round

1. **Find.** Read open GitHub issues (skip pull requests unless one is the bug). Run the checks that already exist: `npm test`, project `npm run lint`, and `npm run build` where a project has them. Search runnable code for logic bugs, broken install steps, missing tests, and docs that disagree with the code. Ignore generated translations until the English source is fixed. Reach your own conclusion before editing.
2. **Fix.** One defect at a time. Keep the change small enough to explain. Prefer a pure function the test can import over a browser-only script. Do not "fix" starter folders that are supposed to be incomplete (`start/`, `your-work/`).
3. **Test.** Add or repair a test that fails on the old behavior. Run it. If install is part of the bug, `npm ci` must succeed.
4. **Repeat.** Re-run the suite. The next round starts from whatever the suite or a fresh read still gets wrong.

## Checks to leave behind

If the repo has no workflow that runs lint and tests on push and pull request, add one. Prefer Node's built-in test runner when the code is plain JavaScript. Root `package.json` should grow a `test` script that runs every new test file, and a `pretest` that installs the project those tests import.

A link-checker workflow that files an issue for every translated copy and every bot `403` should exclude `translations/` and accept `403` and `429`. Real `404`s in the English source still need a checked replacement URL before the link changes.

## Report

The draft pull request body uses this outline:

- **LOOP** rounds used / 5
- **FIXED** each item, its issue ref when one applies, and the test that covers it
- **OPEN** what you found and did not change, and why
- **CHECKS** commands and results
- **BLOCKED ON OWNER** secrets, publishing, merging, or closing issues
- **How to run the checks yourself**

Do not write `Fixes #N` or `Closes #N`. That closes the issue.

## This curriculum

From the repo root:

```bash
npm test
cd 7-bank-project/api && npm ci && npm run lint && npm test
cd 5-browser-extension/solution && npm ci && npm test && npm run build
```

`npm test` installs the bank API first. The bank lockfile must be valid JSON, match `package.json`, and carry registry integrity hashes. `npm ci` is the proof.

High-value places already have tests: bank transactions and dates, carbon-extension color, typing game, memory rules, space-game movement, quiz locale selection, and the English doc links.
