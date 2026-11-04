# AI usage

**Tool:** Claude Code (Anthropic), run as an agent in the local project directory.

## Phases

1. **Diagnostic audit.** Prompt saved at `C:\Users\alexe\Downloads\prompt1-audit.md`, outside the repository. Output: `AUDIT.md`.
2. **Secret removal.** Requested by the participant after the audit. Commit `9b5f2a2`.
3. **Stabilization.** Prompt saved at `C:\Users\alexe\Downloads\prompt2-improve.md`, outside the repository. It asks for a short plan, then implementation; no deleted or skipped tests and no weakened assertions; no extra retries or timeouts; a change log and this file; no commits or pushes.

## Significant AI-assisted changes

- Credentials moved to the environment; generated files untracked.
- 10 failing tests corrected against the documentation, recorded page snapshots and a recorded trace.
- `pages/login.page.ts`, `pages/app.page.ts`, `tests/fixtures.ts`, `tsconfig.json`.
- Config and CI changes listed in `docs/competition-changes.md`.

## Verification

- The AI ran `tsc --noEmit`, `--list`, and the tests that need no login, with dummy values.
- The AI does not use live credentials, so it did not run the tests that sign in or use the API key. The participant set the secrets and ran or triggered those runs.

## Human decisions

- The participant supplied the credentials, added GitHub Secrets, enabled Actions on the fork, and created `.env`.
- The participant asked for the `baseline` branch and chose the work order: fix the failures, add API and MCP checks, run the series, write the documents.
- A Stonewake representative allowed security testing during the final.
