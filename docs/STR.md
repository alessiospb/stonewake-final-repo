# STR: Stonewake test automation

The record of actual execution results for the ITAC 2026 final, 2026-11-04. The plan is in [STP.md](STP.md).

| | |
|---|---|
| Result | 5 consecutive green GitHub Actions runs, 80 passed, 0 failed, 2 skipped each, `--retries=0` |
| Tested commit | `3131450348be7eeeb8d2e525583f88ec650c0dda` |
| Public report | https://alessiospb.github.io/stonewake-final-repo/ |
| Environment | Live product, team `itac-6`, Playwright 1.64.1, Chromium, Node.js 22, `ubuntu-latest`, 2 workers |

## 1. Stability evidence

Workflow `Playwright Tests`, step `npx playwright test --retries=0`. Run 1 came from the push, runs 2-5 from `workflow_dispatch`, each started after the tests of the previous run had finished. Every run is attempt 1. Times are the `test` job (UTC). Counts come from the Playwright summary in each job log.

| Run | Run ID | Trigger | Start | End | Result | Passed | Failed | Flaky | Skipped | Test time | Report |
|---|---|---|---|---|---|---:|---:|---:|---:|---:|---|
| 1 | [41880929553](https://github.com/alessiospb/stonewake-final-repo/actions/runs/41880929553) | push | 17:50:21 | 17:54:10 | success | 80 | 0 | 0 | 2 | 1.8 min | [report](https://alessiospb.github.io/stonewake-final-repo/runs/41880929553/index.html) |
| 2 | [41881594540](https://github.com/alessiospb/stonewake-final-repo/actions/runs/41881594540) | workflow_dispatch | 17:54:22 | 17:56:14 | success | 80 | 0 | 0 | 2 | 1.5 min | [report](https://alessiospb.github.io/stonewake-final-repo/runs/41881594540/index.html) |
| 3 | [41881951911](https://github.com/alessiospb/stonewake-final-repo/actions/runs/41881951911) | workflow_dispatch | 17:56:28 | 17:58:59 | success | 80 | 0 | 0 | 2 | 1.7 min | [report](https://alessiospb.github.io/stonewake-final-repo/runs/41881951911/index.html) |
| 4 | [41882442057](https://github.com/alessiospb/stonewake-final-repo/actions/runs/41882442057) | workflow_dispatch | 17:59:16 | 18:01:30 | success | 80 | 0 | 0 | 2 | 1.7 min | [report](https://alessiospb.github.io/stonewake-final-repo/runs/41882442057/index.html) |
| 5 | [41882997402](https://github.com/alessiospb/stonewake-final-repo/actions/runs/41882997402) | workflow_dispatch | 18:02:16 | 18:04:06 | success | 80 | 0 | 0 | 2 | 1.4 min | [report](https://alessiospb.github.io/stonewake-final-repo/runs/41882997402/index.html) |

After the series, only documentation changed. Such commits do not start a run.

## 2. From baseline to final

| | Baseline (`b4f92c9`) | Final (`3131450`) |
|---|---|---|
| Tests | 20 | 82 |
| Passed | 10 | 80 |
| Failed | 10 | 0 |
| Skipped | 0 | 2 |
| Credentials in code | Yes | No |
| Public report of every run | No | Yes |

The 10 baseline failures were test defects: wrong path, auth scheme, field name and expected values, and outdated selectors. Details are in [competition-changes.md](competition-changes.md).

## 3. Coverage delivered

| Area | Automated |
|---|---|
| Sign-in | Login, wrong password, terms checkbox, redirects, logout |
| Deal Book | Search, open a deal, next page, empty search and Export, clearing, PDF report; API filter, sort, hidden deals, list vs detail |
| Screenings | New screening form and cancel, list envelope. No screening was started |
| Network and Institutions | Institution search and country filter, Network search; API company, network, ownership chain, financing |
| Countries | Search, detail, not found; API score range, index vs detail |
| Monitoring and Portfolio | Tabs, Monitor a name button, tiles, summary totals, open a company. Nothing was added |
| API | Paging, validation refusals, read-only routes, credentials, rate limit headers, deprecated routes, hostile search input |
| MCP | Keyless refusals, JSON-RPC errors, foreign Origin; portfolio, country and deal book compared with the API |

## 4. Defects

Details: [defects.md](defects.md).

| ID | SpiraTest | Incident | Priority | Automated |
|---|---|---|---|---|
| D-01 | [84](https://itac.spiraservice.net/30/Incident/84.aspx) | EDD Dossiers page opens by direct URL although the module is missing from the team's sidebar | Medium | Yes, skipped |
| D-02 | [88](https://itac.spiraservice.net/30/Incident/88.aspx) | MCP server lists 40 tools, while the documentation says 38 | Low | Yes, skipped |
| SW-01 | [85](https://itac.spiraservice.net/30/Incident/85.aspx) | "1 source" expands the update history instead of opening the source | Medium | No |
| SW-02 | [87](https://itac.spiraservice.net/30/Incident/87.aspx) | Expanded Updates section displays two identical update blocks | Medium | No |

**Skipped tests**
- `ui 11 dossiers module is not offered`: D-01, incident 84.
- `lists the 38 read-only tools`: D-02, incident 88.

Both keep their original assertions. Stonewake has not yet confirmed D-01 or D-02. D-01 also rests on the team's assumption that the module is not assigned to `itac-6`.

## 5. Limitations and residual risks

- **Security testing is limited.** Read-only checks only: refusals, read-only behavior, credential handling and hostile search input. Cross-team access could not be tested with one account.
- **Performance was not tested.** Only run durations are known. The limits for load testing were not agreed.
- **Write workflows are not automated.** Starting a screening and adding a company leave permanent records, so they were checked only up to the form.
- **Export content is not checked.** The PDF download is checked by its file name only; Excel export is not automated.
- **Browsers:** Chromium only.
- **A failing run on CI** was seen on the original code, not on the final code. No run was broken on purpose.
- **Exposed credentials** from the original repository stay in git history and in the `baseline` branch until their owner rotates them.
- **Live data:** the suite ran on a changing product, and tests with fixed values (`ui 9`, `ui 7` Briefing) can fail if the data changes.
- **Report retention:** run artifacts expire after 14 days. The public page keeps the copies it has published.
- **API key** expires on 2026-11-13, so the API and MCP tests that use it will fail after that date.
