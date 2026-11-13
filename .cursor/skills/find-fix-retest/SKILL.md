---
name: find-fix-retest
description: Find real bugs from the repo and its open GitHub issues, fix them in small tested steps, and leave a draft pull request plus CI. Use for a find-fix-retest loop, curriculum or sample-app bug hunts, "fix the open issues", or when the user wants a reusable check workflow and a skill for the next run.
---

# Find, fix, retest

Work in rounds. Stop at five rounds, or sooner when nothing high-value is left. Do not merge, push to the default branch, force-push, deploy, or create accounts. Do not close, comment on, or relabel issues. Reference them as `Refs #N`.

## Round

1. **Find.** Read open GitHub issues (skip pull requests unless one is the bug). Run the checks that already exist: `npm test`, project `npm run lint`, and `npm run build` where a project has them. Search runnable code for logic bugs, broken install steps, missing tests, and docs that disagree with the code. Ignore generated translations until the English source is fixed. Reach your own conclusion before editing.
2. **Fix.** One defect at a time. Keep the change small enough to explain. Prefer a pure function the test can import over a browser-only script. Do not fill in starter folders that are supposed to be incomplete (`start/`, `your-work/`). A same-major dependency bump in a starter `package.json` is in scope when the finished project gets the same bump.
3. **Test.** Add or repair a test that fails on the old behavior. Run it. If install is part of the bug, `npm ci` must succeed.
4. **Repeat.** Re-run the suite. The next round starts from whatever the suite or a fresh read still gets wrong.

## Checks to leave behind

If the repo has no workflow that runs lint and tests on push and pull request, add one. Prefer Node's built-in test runner when the code is plain JavaScript. Root `package.json` should grow a `test` script that runs every new test file, and a `pretest` that installs the project those tests import.

A link-checker workflow that files an issue for every translated copy and every bot `403` should exclude `translations/` and accept `403` and `429`. Also exclude loopback addresses so lesson links to `localhost` are not failures, and pass an absolute `--root-dir` so root-relative doc links resolve inside the checkout. Real `404`s in the English source still need a checked replacement URL before the link changes.

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
cd 9-chat-project/solution/backend/python && python -m unittest test_api.py
```

`npm test` installs the bank API first. The bank lockfile must be valid JSON, match `package.json`, and carry registry integrity hashes. `npm ci` is the proof. The chat tests need `openai`, `fastapi`, `uvicorn`, `python-dotenv`, and `httpx`.

High-value places already have tests: bank transactions and dates, carbon-extension color, typing game, memory rules, space-game movement, quiz locale selection, the English doc links, the docs homepage script, and the chat API token and CORS behavior.

## Link, audit, and request-time secrets

These steps are generic. Keep them free of tokens, hostnames from a private environment, and one-off issue text.

**Links.** A link-checker issue is often truncated near 65,000 characters, so re-run the checker on the English sources instead of treating the issue body as complete. Ignore generated `translations/` copies. Request each candidate replacement and follow redirects. Keep the replacement only when the final page is the one the sentence describes. A short link that returns 200 and lands on a generic homepage is still broken. A `403` or `429` from a bot challenge is not a `404`.

**npm audit.** Audit each project that has a lockfile. Apply `npm audit fix` without `--force`, then run it once more if the report still says a fix is available. Exact versions stay put until `package.json` changes. When an advisory names a fixed release in the same major, set the dependency to that release or a newer release in that major, then re-audit. A dependency-update pull request can still be inside the vulnerable range, so compare its version with the advisory before copying it. Skip a semver-major toolchain bump when install or lint fails, and write down what remains. If the registry tarball does not match its published checksum, leave that project unchanged and name the package. Do not turn off integrity checks.

**Secrets and CORS.** Read a required token when the request runs, not at import, so a health check can start. Raise one clear error the handler can return to the client. For browser CORS, keep an explicit origin list in an environment variable. If that list contains `*`, leave credentials off. Do not combine a wildcard origin with credentials.
