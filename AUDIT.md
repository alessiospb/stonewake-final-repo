# Diagnostic Audit: Stonewake Playwright Suite

Date: 2026-11-04. Repository: fork `alessiospb/stonewake-final-repo`, audited commit `b4f92c9` (branch `baseline`). The audit changed no project files; this report was added to the repository afterwards.

**Evidence labels.** *Recorded*: the organizers' run stored in the repository (2026-11-04 08:04 UTC) and their CI run 41801799233. *Observed*: run during this audit. *Static*: code reading only. *Inferred*: a likely cause not confirmed at runtime.

**Limitation.** The AI did not run the full suite locally, because most tests sign in to the live product and it does not use live credentials. The full suite was run later on GitHub Actions with the participant's own account (see section B).

## A. Executive Summary

**Health: poor, but small and fixable.** 10 of 20 tests fail in both the recorded local run and in CI, and every cause found so far looks like a test defect. No application defect is confirmed.

**Main risks**
1. **Exposed credentials.** A password and an API key are public in the code and in `.env`, and remain in git history and forks.
2. **Outdated expectations.** Paths, a schema, selectors and labels no longer match the product or its documentation.
3. **No structure.** Login is copied 8 times, URLs are hard-coded 68 times, and there is no page object, fixture or environment config.
4. **Unsafe reporting.** Traces and reports are committed, and traces can hold session data. Publishing them as they are would leak it.
5. **Thin coverage.** Export, screening results, financing, ownership, monitoring and MCP have no tests.

**Immediate actions:** remove secrets from code and git tracking, move config to environment variables and CI secrets, fix the 10 failures, share one login, then add coverage.

## B. Baseline Results

| Metric | Result |
|---|---|
| Discovered tests | 20 in 2 files, 10 API and 10 UI (observed, `--list`) |
| Passed | 10 (recorded, local and CI) |
| Failed | 10 (recorded, the same 10 tests in local and CI) |
| Skipped | 0 |
| Execution time | 127.2 s local, 2.4 min CI (recorded), 2 workers, no retries configured |
| Own CI run, participant's account | [41865680927](https://github.com/alessiospb/stonewake-final-repo/actions/runs/41865680927), commit `9b5f2a2` (test logic unchanged, credentials moved to the environment): 10 passed, 10 failed, 2.3 min. The same 10 tests failed |
| Observed live, no login needed | 4 tests: `api 3`, `api 4`, `ui 4` passed; `api 1` failed with 404, as recorded |
| Environment status | Playwright 1.64.1, Node 22.14.0. No TypeScript package or `tsconfig.json`, so `tsc` cannot run. `npx playwright` fails on this Windows checkout (F3) |

**Failure classification**

| Test | Error (recorded) | Class | Cause |
|---|---|---|---|
| api 1 health | 404 | Test defect | Calls `/v1/health`; documentation says `/health` |
| api 2 me | 401 | Test defect | Sends `Token`; documentation requires `Bearer` |
| api 5 portfolio list | `b.data` is not an array | Test defect | OpenAPI field is `items` |
| api 9 countries | expected `GE`, received `DE` | Test defect | Wrong expected code: `DE` is correct for Germany |
| api 10 search | expected limit 50, received 25 | Test defect | Documentation and OpenAPI say 25 |
| ui 1 login ok | timeout on `#email` | Test defect (inferred) | Selector not found; snapshot shows a textbox labelled Email |
| ui 3 terms checkbox | 30 s timeout | Test defect (inferred) | Calls `check()` on an `aria-hidden` input, while other tests click `button[role="checkbox"]` |
| ui 6 sidebar | timeout on `EDD Dossier` | Test defect | Snapshot shows the link `EDD Dossiers` |
| ui 7 deal book search | no `/deal/` links | Test defect | Snapshot shows `/deals/<id>` |
| ui 10 portfolio | no `tile-not-assessed` | Unconfirmed | The snapshot shows the label with count 0. Either the test id differs or the tile has none; check in the browser |

## C. Findings

| ID | Pri | Category | File:Line | Problem | Evidence | Recommended Fix | Est. |
|---|---|---|---|---|---|---|---|
| F1 | P0 | Security | `tests/ui.spec.ts:3-4`, `tests/api.spec.ts:3`, `.env` | Password and live API key in a public repository | Static | Use environment variables; `git rm --cached .env`; organizers must rotate, because history keeps them | 10 m |
| F2 | P0 | Security | `.gitignore`, `playwright-report/`, `test-results/` | `.env`, `node_modules`, reports and traces are tracked; `.gitignore` has none of them | Static | Untrack them and fix `.gitignore` | 5 m |
| F3 | P0 | Environment | `node_modules/.bin/*` | Committed symlinks become text files on Windows (`core.symlinks=false`), so `npx playwright` runs another copy and fails with "did not expect test() to be called" | Observed. Works through `node node_modules/@playwright/test/cli.js` | Untrack `node_modules`, reinstall with `npm ci` | 3 m |
| F4 | P0 | CI | `.github/workflows/playwright.yml:28` | No secrets passed; once secrets leave the code, CI cannot sign in | Static | Pass `STONEWAKE_*` from GitHub Secrets | 5 m |
| F5 | P1 | Correctness | `tests/api.spec.ts:6,17,73,78,168,199` | Five API tests contradict the documentation | Recorded | Fix as in section B | 10 m |
| F6 | P1 | Locators | `tests/ui.spec.ts:12,44,105,123` | Outdated or wrong selectors | Recorded | Use role and label locators | 10 m |
| F7 | P1 | Sync | `tests/ui.spec.ts:8,120,144` | Three `waitForTimeout` calls (2 s, 3 s, 1 s) | Static | Wait for state with web-first assertions | 5 m |
| F8 | P1 | Isolation | `tests/ui.spec.ts`, 8 login blocks | One account logs in repeatedly in parallel; `ui 5` signs out, and whether that ends other sessions is unknown | Static | Log in once with `storageState`; run sign-out last with its own session | 15 m |
| F9 | P1 | Reliability | `playwright.config.ts` | Retries are not stated; `forbidOnly` is missing; no `baseURL` | Static | `retries: 0`, `forbidOnly`, `baseURL` | 3 m |
| F10 | P1 | Assertion | `tests/ui.spec.ts:131` | Requires `Briefing`, but documentation says a briefing can be null, so results depend on data | Static | Assert only what every deal has, or pick a deal with a briefing via the API | 5 m |
| F11 | P1 | Data | `tests/ui.spec.ts:170`, `tests/api.spec.ts:168` | Fixed ids and values on live data (`/entities/4`, `.first()` rows) | Static | Read the expected data from the API or assert rules | 10 m |
| F12 | P2 | Structure | both specs | No page object or fixtures; 68 hard-coded URLs; `var`; XPath; `any` | Static | Small page objects and a fixture, `baseURL`, `const` | 30 m |
| F13 | P2 | Diagnostics | `tests/api.spec.ts:20` | `console.log` prints identity data into CI logs | Static | Remove | 1 m |
| F14 | P2 | CI | `.github/workflows/playwright.yml:11,31-34` | `cancel-in-progress: true` can cancel series runs; no `--retries=0`; no public report; `test-results` is not uploaded | Static | Disable cancel, add `--retries=0`, publish a report | 20 m |
| F15 | P2 | Reporting | `playwright.config.ts` | `trace: 'retain-on-failure'` would put session data into a public report | Static (inferred risk) | No traces in public output; screenshots reviewed | 5 m |
| F16 | P2 | Tooling | repo root | No `tsconfig.json`, no TypeScript, no typecheck | Observed | Add both and a `typecheck` script | 5 m |
| F17 | P3 | Docs | `README.md` | Missing run instructions and the required AI disclosure | Static | Update before submission | 10 m |

## D. Test Coverage Gaps

**Confirmed** comes from the organizers' list or the public documentation. Depth was judged from the 20 tests only.

| Feature | Existing | Missing scenarios | Pri |
|---|---|---|---|
| Deal Book | Empty search, open a deal | Filters, sorting, briefing and sources, Excel export, UI vs API values, `include_hidden` | P1 |
| Screenings | Sidebar link only | Read a result with sources (viewer); starting a screening needs analyst | P1 |
| Network and Institutions | Institution search | Company profile, financing, ownership chain, Network CSV export | P1 |
| Countries | Search, score range | Indicators and sources, UI vs API score, Not scored rule, list export | P1 |
| Monitoring and Portfolio | Tiles, summary totals | Add a company and follow updates (role and cleanup needed), statuses, reviews due | P1 |
| MCP | None | `tools/list`, key refusal `-32001`, argument errors `-32602`, Origin 403, same data as the API | P1 |
| API contract | 8 routes | Pagination, `extra_forbidden`, lowercase closed values, rate limit headers, deprecated routes, two id spaces | P1 |
| Security (safe, read-only) | 401 checks | Cross-team id reads, key in the wrong place, public page headers; no DoS, no other customers' data | P2 |
| Performance | None | Light response time budget inside the limits; load only with agreed ceilings | P2 |
| Accessibility | None | Known gaps are listed in the documentation; optional check | P3 |

## E. Improvement Plan

| # | Change | Why | Time | Depends on | Verify |
|---|---|---|---|---|---|
| 1 | F1–F4: remove secrets, fix `.gitignore`, env config, CI secrets | Blocks everything and is a live leak | 20 m | User adds secrets | Search finds no secret in tracked files; CI signs in |
| 2 | F9, F16: config and TypeScript | Honest signal, type checks | 8 m | 1 | `tsc --noEmit`, `--list` |
| 3 | F5: fix API tests | Five failures, quick | 10 m | 1 | CI: 10/10 API |
| 4 | F6–F8, F10–F12: login setup, page objects, UI fixes | Removes the rest of the failures and repetition | 45 m | 1, 2 | CI: 10/10 UI, repeat for flakiness |
| 5 | Add coverage in the section D order | Main value of the suite | 40 m | 3, 4 | CI green, repeated |
| 6 | F14, F15: CI series and safe public report | Required evidence | 20 m | 1 | Link opens without login, no traces |
| 7 | Five consecutive runs without retries | Required evidence | 15 m | Code freeze | Run IDs, SHA and counts recorded |
| 8 | STP update, STR, change log, README AI section, SpiraTest, Jam video | Mandatory deliverables | 30 m | 7 | All links open without login |

## F. Quick Wins

- Fix the five API failures (F5).
- Fix `EDD Dossiers`, `/deals/` and the `Email` locator (F6).
- Remove `console.log` (F13).
- Fix `.gitignore` and untrack `node_modules`, reports and traces (F2, F3).
- Set `retries: 0` and `forbidOnly` (F9).

## G. Risks and Open Questions

- **Not verified:** the full suite with credentials; flakiness (no repeat runs); `ui 10`; `ui 3` and `ui 1` root causes; dashboard role of the user's account.
- **Key expiry:** the API key expires 2026-11-13.
- **Sign-out:** does it end other sessions of the same account?
- **Shared state:** workspace and daily quota are shared. Screening and review records cannot be deleted, so write tests need care.
- **Live data changes:** the changelog shows many product changes per day. Tests should assert rules, not fixed values.
- **For organizers:** rotating the exposed credentials; limits for performance testing; what a public report may contain; whether team members share the workspace.
- **Security testing:** a Stonewake representative allowed it without restrictions during the final (2026-11-04). DoS, other customers' data and third-party providers stay excluded.

## H. Suggested Next Action

Do step 1: remove secrets from code and tracking, move config to environment variables, and pass GitHub Secrets to CI. Everything else depends on it.

**Status:** step 1 done in `9b5f2a2`.
