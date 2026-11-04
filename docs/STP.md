# STP: Stonewake test automation

**Status: Updated before submission.** Sections 2-9 keep the initial plan; section 10 records what changed.
- **Date:** 2026-11-04, during the ITAC 2026 final.
- **Scope:** the live Stonewake product (dashboard, API, MCP server) in the team workspace `itac-6`, and this Playwright suite with its CI.
- **Baseline:** `AUDIT.md` (commit `b4f92c9`, branch `baseline`).

## 1. Document status and purpose

This plan guides stabilization, exploration, automation, CI verification and delivery. Baseline facts come from the audit. Everything planned here is not a result: actual results go into the separate STR. Written with prompt P02-STP v1.3, after the audit and once stabilization had started.

## 2. Product and test context

**Product.** Stonewake is a business and financial intelligence platform for export finance teams, with a dashboard, a read-only API and a read-only MCP server.

**Sources of requirements**
- **Confirmed:** the organizers' scope message and https://docs.stonewake.ai, including the OpenAPI file.
- **Assumption to validate:** the dossiers module is not assigned to team `itac-6`.
- **Unknown:** performance limits, what a public report may show, whether team members share data.

**Automation at baseline**
- Playwright 1.64.1 and TypeScript, Chromium only, headless.
- 20 tests in two files, no page objects, credentials in code.
- `npm test`. GitHub Actions workflow `playwright.yml`, HTML report as an artifact.

**Environment dependencies:** live product with data that can change, a shared daily quota, 120 requests per minute per key (`RateLimit-Policy`), an API key that expires on 2026-11-13.

## 3. Test objectives and scope

**Objectives:** correct CI signaling, reliable isolation and synchronization, maintainable tests, meaningful coverage, reproducible stability evidence.

**In scope:** the six workflows named by the organizers, and the rest of the product by risk:
1. Deal Book: search, filters, deal with briefing and sources, export.
2. Screenings: screen a company, read the result with sources.
3. Network and Institutions: profile, financing, ownership chain.
4. Countries: risk score and indicators.
5. Monitoring and Portfolio: add a company, follow updates.
6. The same data through the API and MCP.

Security testing is in scope: a Stonewake representative allowed it during the final. Performance testing is in scope on the day.

**Limits**
- No denial of service, no other customers' data, no third-party providers.
- Load beyond the normal rate limits needs agreed ceilings.
- Not configured: browsers other than Chromium. No requirement excludes them; they are deferred.
- Write actions that leave permanent records (screenings, reviews, dossiers) run only when they add clear value.

## 4. Initial assessment and key risks

The audit (`AUDIT.md`) recorded 10 passed and 10 failed of 20 tests. Four risks shape this plan: exposed credentials, expectations that no longer match the product, thin coverage of the main workflows, and live shared data that can change results between runs. No product defect was confirmed by the audit. Later candidates are tracked separately.

## 5. Test strategy

- **Stabilization.** Fix root causes with web-first assertions, role and label locators, per-test sign-in through a fixture, and data read from the API rather than fixed values. Separate browser contexts do not isolate the backend: the workspace is shared across tests and runs.
- **Exploratory testing.** Short charters from §6. Record observations, steps and candidate scenarios. Automate a behavior only once it is understood.
- **Automation expansion.** First the confirmed workflows, then negative and boundary cases from the documentation: API contract, validation refusals, read-only behavior, and the same values across UI, API and MCP.
- **Regression.** Run affected tests after each significant fix, and the full suite before the stability campaign.
- **CI and reporting.** A failed test fails CI. Keep useful artifacts and publish a report that opens without login. Traces stay out of public output because they can hold session data. CI is not broken on purpose to show a red run.

## 6. Coverage priorities

| Area | Current evidence of coverage | Gap or exploration charter | Risk | Proposed action |
|---|---|---|---|---|
| Deal Book | Search, open a deal, API list and detail | Filters in the UI, sources, Excel export, UI vs API values | High | Automate filters; explore export |
| Screenings | Page opens, list envelope | No screening exists yet. Charter: run one, read the result and sources | High | One deliberate screening, then read-only checks |
| Network, Institutions | Institution search, node routes answer | Financing and ownership content; Network view is a canvas | High | Check through API data and CSV export |
| Countries | Score range, index vs detail | Indicators, Not scored rule, UI vs API score | Medium | Automate the UI vs API check |
| Monitoring, Portfolio | Tiles, summary totals | Add a company, updates, cleanup after the test | High | Explore first: removal needs a reason and stays in history |
| API, MCP, security | Contract, refusals, keyless MCP | Cross-team ids, session handling, response headers. Performance: Unknown | High | Add safe checks; light timing only |

## 7. Defect management and skip policy

- **Classify first:** automation defect, product defect, environment or configuration issue, or unconfirmed.
- **Confirmed product defects** go to SpiraTest with steps, expected and actual results, and evidence. Local records are in `docs/defects.md`.
- **Skips.** Per the organizers' clarification, a test failing because of a confirmed product defect may be `skipped`. It needs the real SpiraTest reference and a clear reason, and the test and assertion stay unchanged. Without an ID the case is tracked as pending, and no ID is invented.
- **Never** skip for flaky automation, uncertain causes, convenience or CI cosmetics. Never weaken assertions, delete failing tests, swallow errors or use `continue-on-error`.
- **Current state:** two tests are skipped, with SpiraTest incidents 84 and 88 (`docs/defects.md`).
- Final reporting lists every skipped test with its defect reference.

## 8. Entry, exit and stability criteria

- **Entry (met):** repository and product accessible, audit and baseline available.
- **Exit from stabilization:** targeted verification done, remaining failures classified, CI fails on a failing test.
- **Stability evidence:** five consecutive green runs of the same tests, commit and configuration, preferably on GitHub Actions, with `--retries=0`. Record the commit SHA, run IDs and URLs, passed, failed and skipped counts, and limitations. Counts come from the Playwright output, because a green workflow alone is not proof. Any code change restarts the series.
- **Links:** every final link opens without login. The final STP and the STR reflect actual outcomes.

## 9. Execution plan and stopping rules

The team's own budget, not an organizer mandate:

| Phase | Time |
|---|---|
| Audit | ~10 min (done) |
| STP | ≤5 min |
| Stabilization | ~35 min |
| Coverage | ~25 min |
| Code freeze | by ~90 min |
| CI verification, documentation, video, submission | the rest, overlapping, with a final 15-minute buffer |

**Mandatory deliverables**
- public GitHub repository;
- GitHub Actions run link;
- public test report (GitHub Pages is one option);
- updated STP and issue and change documentation;
- product defects in SpiraTest;
- project tutorial video through a Jam.dev link;
- README disclosure of AI tools, main prompts and AI-made parts.

P0 and P1 work comes first. Docker, visual testing, integrations, self-healing and large refactors are deferred if they threaten delivery.

**Open Questions / Assumptions**
- Should team `itac-6` hold the dossiers module? Assumed: no.
- What may a public report show? Assumed: no traces.
- What load is allowed for performance testing? Assumed: within normal limits.
- Do team members share the workspace, and is data reset? Assumed: shared, not reset.

## 10. Final updates

Actual results are in the separate STR, [STR.md](STR.md). Compared with this plan:

- **Scope and coverage:** 82 tests. Screenings and Monitoring are covered up to the form and page level, and nothing that leaves a permanent record was automated.
- **Changes:** [competition-changes.md](competition-changes.md).
- **Defects:** four in SpiraTest, incidents 84, 85, 87 and 88, in [defects.md](defects.md).
- **Skipped tests:** two, for incidents 84 and 88, with their assertions unchanged.
- **Verification:** five consecutive green CI runs on `3131450`, listed in the STR.
- **Residual risks:** listed in the STR. Performance was not tested, and security testing stayed read-only.
- **Deviations:** code freeze at about 1:45; the report is published through the `gh-pages` branch.
- **Open questions:** the dossiers module and the limits of a public report stayed unanswered, and the assumptions in section 9 were used.
