# Competition changes

Finding IDs come from `AUDIT.md`. No secrets or test data are recorded here.

| ID | Category | Problem | Root Cause | Files Changed | Fix | Verification |
|---|---|---|---|---|---|---|
| C-01 (F1, F2, F4) | Security | Password and API key public in code and `.env`; generated files tracked | Credentials hard-coded, weak `.gitignore` | `tests/*`, `.gitignore`, `.env.example`, `playwright.yml`, `playwright.config.ts` | Credentials read from the environment or GitHub Secrets; `.env`, `node_modules`, reports and traces untracked | CI run 41865680927 signed in with the participant's account |
| C-02 (F3) | Environment | `npx playwright` failed on Windows | Committed `node_modules` symlinks | Repository | `node_modules` untracked, reinstalled with `npm ci` | `npx playwright test --list` finds 20 tests |
| C-03 (F5) | Correctness | `api 1, 2, 5, 9, 10` failed | Wrong path, auth scheme, field name, expected values | `tests/api.spec.ts` | `/health`, `Bearer`, `items`, `iso2` `DE`, search limit 25, as documented | Local run: all 10 API tests passed |
| C-04 (F6) | Locators | `ui 1, 3, 6, 7, 10` failed | Outdated selectors, labels and URLs | `tests/ui.spec.ts`, `pages/login.page.ts` | Role locators, `EDD Dossiers`, `/deals/`, `tile-not_assessed` (id read from the recorded trace) | Local run: all passed |
| C-05 (F7) | Sync | 3 fixed sleeps | `waitForTimeout` | `tests/ui.spec.ts` | Waits for URL and elements | Local run passed |
| C-06 (F8, F12) | Structure | Login copied 8 times, no page objects | No fixtures | `tests/fixtures.ts`, `pages/*` | `app` fixture signs in per test; small page objects; `const`; relative URLs | `tsc --noEmit` passed |
| C-07 (F9, F15) | Config | No `retries`, `forbidOnly`, `baseURL`; traces unsafe for a public report | Minimal config | `playwright.config.ts` | `retries: 0`, `forbidOnly`, `api` and `ui` projects, no traces on CI | `--list` passed |
| C-08 (F14) | CI | Runs could cancel each other | `cancel-in-progress: true` | `playwright.yml` | Set to `false`, moved to the job, added `--retries=0` | Five-run series |
| C-11 | Coverage | No API contract or MCP checks | Gaps in `AUDIT.md` section D | `tests/api-contract.spec.ts`, `tests/api-mcp.spec.ts` | 53 new tests: paging, validation, read-only routes, credentials, rate limit headers, deals, countries, nodes, hostile search input, MCP refusals, MCP vs API | Local run: passed, except the D-02 skip |
| C-12 (F14) | Reporting | No public report | Report kept as an artifact only | `playwright.yml`, `scripts/build-pages-site.mjs` | Pages index of all runs of a commit, each with its report, published through the `gh-pages` branch because deployments stayed `waiting` on the `github-pages` environment; docs-only pushes start no run | Public page shows 5 of 5 |
| C-13 | Coverage | Deal Book paging and export, Screenings, Scoring, Network, Monitoring had thin UI coverage | Gaps in `AUDIT.md` section D | `tests/ui.spec.ts` | `ui 12`-`ui 19`, none of which saves anything in the workspace | Local run: passed |
| C-10 | Environment | `ui 6` failed on `EDD Dossiers` under the team's account | Modules are set per team; the participant confirmed that team `itac-6` does not hold this module | `tests/ui.spec.ts` | Link removed from `ui 6`; new `ui 11` asserts it is not offered and `/dossiers` does not open the section | `ui 6` passed; `ui 11` failed, see D-01 |
| C-09 (F13, F16) | Tooling | `console.log` of identity data; no type check | Missing TypeScript setup | `tests/api.spec.ts`, `tsconfig.json`, `package.json` | Log removed; TypeScript, `strict`, `typecheck` script added | `tsc --noEmit` passed |

## Not done / deferred

- F10: `ui 7` still requires a `Briefing` heading. The documentation says a briefing can be null, so this may depend on the first deal. Decide after a full run.
- F11: `ui 9` keeps the fixed id `/entities/4`. It passes today.
- Locators in `ui 8` and `ui 9` stay as CSS: the tests pass, and replacements could not be verified without signing in.
- `storageState` was not used. It could not be verified here, and `ui.spec.ts` runs serially on one worker.
- F17: README.

## Skipped tests

Both tests keep their original assertions. Whether Stonewake confirms the defects is still open.

| Test | Defect | SpiraTest ID |
|---|---|---|
| `ui 11 dossiers module is not offered` | D-01 | [84](https://itac.spiraservice.net/30/Incident/84.aspx) |
| `lists the 38 read-only tools` | D-02 | [88](https://itac.spiraservice.net/30/Incident/88.aspx) |

## Unresolved and risks

- Exposed credentials stay in git history and in the `baseline` branch until the organizers rotate them.
- Application defects: D-01, D-02, SW-01 and SW-02 in `docs/defects.md`, SpiraTest incidents 84, 88, 85 and 87. Also D-02. Both tests are skipped, see above.
- Verification: the participant's local run on 2026-11-04 gave 80 passed, 2 skipped, 0 failed, zero retries, 1.5 min, 82 tests. CI run 41877141332 on the earlier 74-test commit: 72 passed, 2 skipped, 51.8 s. The AI does not sign in to the live product, so it ran only the tests that need no login.
- The API key expires on 2026-11-13.
