# Stonewake Test Automation

API, MCP and UI tests for **Stonewake**, written with [Playwright](https://playwright.dev) and TypeScript. This fork is the team's work for the ITAC 2026 final.

- **App:** https://app.stonewake.ai
- **API:** https://api.stonewake.ai
- **Documentation:** https://docs.stonewake.ai (quickstart, API reference and OpenAPI spec)

## Results and documents

| | |
|---|---|
| Public test report | https://alessiospb.github.io/stonewake-final-repo/ (all runs of the current commit) |
| CI runs | https://github.com/alessiospb/stonewake-final-repo/actions |
| Test results (STR) | [docs/STR.md](docs/STR.md) |
| Test plan (STP) | [docs/STP.md](docs/STP.md) |
| Diagnostic audit | [AUDIT.md](AUDIT.md) |
| Changes | [docs/competition-changes.md](docs/competition-changes.md) |
| Product defects | [docs/defects.md](docs/defects.md) |
| AI prompts and intermediate results | [ai/](ai/README.md) |
| Original project | branch [`baseline`](https://github.com/alessiospb/stonewake-final-repo/tree/baseline) |

## Running the tests

Needs Node.js 22 and a Stonewake account with an API key.

```sh
npm ci
npx playwright install chromium
cp .env.example .env    # then fill in your own values; .env is git-ignored
npx playwright test --retries=0
```

- `npx playwright test --project=api`: API and MCP tests only.
- `npx playwright test --project=ui`: dashboard tests only.
- `npm run typecheck`: TypeScript check.
- `npx playwright show-report`: the HTML report.

On CI the credentials come from the GitHub Secrets `STONEWAKE_EMAIL`, `STONEWAKE_PASSWORD` and `STONEWAKE_API_KEY`. Never commit real values.

## Structure

| Path | Purpose |
|---|---|
| `tests/api.spec.ts` | Original API tests, corrected |
| `tests/api-contract.spec.ts` | API contract, validation, read-only rules, credentials, hostile input |
| `tests/api-mcp.spec.ts` | MCP server, and MCP compared with the API |
| `tests/ui.spec.ts` | Dashboard tests; run on one worker because they share one account |
| `tests/fixtures.ts`, `pages/` | Sign-in fixture and page objects |
| `scripts/build-pages-site.mjs` | Builds the public index of all runs of a commit |

Tests that would leave permanent records in the shared workspace, such as starting a screening, are not automated. Two tests are skipped for product defects, with their SpiraTest incidents, see [docs/defects.md](docs/defects.md).

## Self-healing demonstration

Branch [`demo/self-healing`](https://github.com/alessiospb/stonewake-final-repo/tree/demo/self-healing) puts an original broken selector back on purpose. Its workflow runs the tests, lets Claude Code repair the failure, verifies the change and opens [pull request #1](https://github.com/alessiospb/stonewake-final-repo/pull/1). The branch is not merged, so the red run on it is expected. See [docs/STR.md](docs/STR.md), sections 6 and 7.

## AI usage

**Tools**
- ChatGPT: planning in advance of the final.
- Claude Code (Anthropic): audit, stabilization, new tests, CI and documents, as an agent in this repository.
- Codex: manual exploratory testing, the list of automation scenarios, bug reports.

**Main prompts**
- Diagnostic audit: `prompt1-audit.md`.
- Stabilization: `prompt2-improve.md`.
- Test plan: `prompt-stp-v1.3.md` (P02-STP v1.3).

The audit and stabilization prompts and the intermediate results are in [ai/](ai/README.md). Details are in [docs/ai-usage.md](docs/ai-usage.md).

**AI-created or AI-modified parts:** `AUDIT.md`, all documents in `docs/`, this README, the fixes to the original tests, the new tests, page objects, fixtures, configuration, the workflow and `scripts/build-pages-site.mjs`.

**Human parts:** the participant chose the work order and scope, supplied credentials and secrets, ran the tests that sign in, reviewed the defects and registered them in SpiraTest.
