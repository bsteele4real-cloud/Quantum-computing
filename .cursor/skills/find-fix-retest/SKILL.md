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

## Link checks with lychee

Keep this procedure free of tokens, private hostnames, and one-off issue text.

1. A filed link report is often truncated near 65,000 characters. Re-run the checker on the English sources. Do not treat the issue body as the full list.
2. Exclude generated translation trees, `node_modules`, and build output (`dist`, `.next`). Exclude loopback addresses so lesson links to `localhost` are not failures. Accept `403` and `429`. Pass an absolute `--root-dir` (the checkout path) so root-relative links resolve inside the repo.

```bash
lychee --config .lychee.toml --root-dir "$PWD" --no-progress './**/*.md' './**/*.html'
```

3. Known false positives. Leave these alone:
   - Docsify navbars link `./README` and `./README.<lang>` with no `.md`. The site resolves those through aliases. Adding `.md` to quiet the checker can break the navbar.
   - With `--root-dir` set to the repo root, an app's `/favicon.ico` (or any other public-root asset) is looked up at the repo root. If the file lives in that app's public directory, the link is valid for the app.
   - `403` and `429` from a host that challenges bots, connection failures, and timeouts are not `404`s.
4. Change a URL only after a request that follows redirects. Keep the replacement when the final page is the one the sentence describes. A short link that returns 200 and lands on a generic homepage is still broken.
5. Edit the English source. Leave generated translations for the translator.

## npm audit triage

1. Audit each directory that has its own lockfile. Never use `npm audit fix --force`.
2. Run `npm audit fix`, then once more if the report still says a fix is available and the tree changes. If the next run says the tree is up to date while findings remain, the parent range will not allow the fix. Record those findings.
3. An exact version in `package.json` does not move until you change it. When an advisory names a fixed release in the same major, set the direct dependency to that release or a newer one in the same major, reinstall, and re-audit.
4. Compare a dependency bot's proposed version with the advisory's fixed version before copying it. The bot's pin can still sit inside the vulnerable range. Use the fixed same-major release.
5. Skip a semver-major toolchain bump when install fails on peer dependencies, or when the new major increases the audit count. Stay on the current major and say so.
6. If a registry tarball checksum does not match the published integrity, leave that lockfile unchanged. Do not disable integrity checks.
7. Re-run that project's lint, test, and build. A lockfile refresh can turn an old `/* global name */` comment into a redeclare once the linter already knows that global. Remove the comment in that case.

## Request-time secrets and CORS

1. Do not read a required secret at import time. Import has to succeed so a health route can start with the variable unset.
2. Read the secret inside the handler. If it is missing, raise one error whose message names the variable and no other secret. Map that error to a client-visible `503` with that message. Reject an empty body before the secret check.
3. Load a local env file only when the dotenv library is installed. A missing library must not crash import when the variable is already in the process environment.
4. CORS uses an explicit origin list from an environment variable, with a small default of local dev origins. If the list contains `*`, set credentials off. Never send a wildcard origin together with credentials. Turn credentials on only for an explicit list, and only when a separate flag asks for them.
5. Test with the variable unset: import succeeds, the health route returns 200, the protected route returns 503 and names the variable, and credentials are off whenever `*` is in the origin list.
