# AI materials

The prompts and intermediate results of the AI-assisted work. The final outputs are in `AUDIT.md` and `docs/`. These files are a record and are not part of the test suite.

## Tools

| Tool | Used for |
|---|---|
| ChatGPT | Planning in advance of the final |
| Claude Code (Anthropic) | Audit, stabilization, new tests, CI, documents |
| Codex | Manual exploratory testing of the live product, the list of automation scenarios, bug reports SW-01 and SW-02 |

## Prompts

| File | Phase | Result |
|---|---|---|
| [prompt1-audit.md](prompt1-audit.md) | Diagnostic audit | [AUDIT.md](../AUDIT.md) |
| [prompt2-improve.md](prompt2-improve.md) | Stabilization | [docs/competition-changes.md](../docs/competition-changes.md) |

## Intermediate results

| File | Source | Contents |
|---|---|---|
| [results/codex-exploratory-report.md](results/codex-exploratory-report.md) | Codex | Two manual runs, translated into English |
| [results/codex-automation-scenarios.md](results/codex-automation-scenarios.md) | Codex | Scenario list, translated into English |
| [results/codex-bug-reports.md](results/codex-bug-reports.md) | Codex | Bug reports SW-01 and SW-02 |
| [results/local-run-82-tests.md](results/local-run-82-tests.md) | Local run | Full local run before the series |

The Codex reports are edited to the findings the participant confirmed. Screenshots and the exported workbook from the manual runs are not published here, because they show product data.
