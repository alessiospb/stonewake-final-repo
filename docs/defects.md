# Product defects

An item without a SpiraTest ID is a candidate.

## D-01

**SpiraTest ID:** [84](https://itac.spiraservice.net/30/Incident/84.aspx)

**Name of incident:** EDD Dossiers page opens by direct URL although the module is missing from the team's sidebar

**Description:** For team itac-6 the sidebar has no EDD Dossiers entry, but opening /dossiers directly shows the full EDD Dossiers page with an active New dossier button. The navigation and the route disagree about whether the team has this module.

**Steps to Reproduce:**
1. Sign in to https://app.stonewake.ai as a member of team itac-6.
2. Check the sidebar: there is no EDD Dossiers entry.
3. Open https://app.stonewake.ai/dossiers directly in the address bar.

**Expected Results:** The dashboard is consistent about whether the team has EDD Dossiers: either the sidebar shows the entry and the page works, or the section is not available to the team. The documentation says the sidebar entry exists "for every team whose workspace holds the dossiers module" (EDD dossiers) and that a team's module set "is trimmed to what that desk needs, and the trim applies everywhere, so the dashboard navigation, downloads, and the built-in guide describe only what the team actually has" (Enterprise onboarding). It does not state how a direct URL must behave, so that part is our reading of the documentation.

**Actual Results:** The sidebar has no EDD Dossiers entry, and /dossiers opens the full page: the EDD Dossiers heading, the text "No dossiers yet" and an active New dossier button.

**Any Additional information:**
- Environment: live product, team itac-6, Chromium (Playwright 1.64.1), 2026-11-04.
- Found by the automated test "ui 11 dossiers module is not offered" in a local run with zero retries.
- Two possible causes: the module is off and the route is not protected, or the module is on and the sidebar entry is missing. It is not confirmed which one applies to team itac-6.
- New dossier was not clicked, so it is not known whether a dossier can actually be created.
- Attach the failure screenshot from the test run.

**Priority:** Medium

**Severity:** Medium. A feature hidden from the team stays reachable, but no data exposure or wrong result was observed.

## D-02

**SpiraTest ID:** pending

**Name of incident:** MCP server lists 40 tools, while the documentation says 38 and omits search and fetch

**Description:** The MCP guide states "Thirty-eight read only tools" and lists 38 names. The live tools/list answer has 40 tools. The two extra tools, search and fetch, are not documented, and both read workspace data.

**Steps to Reproduce:**
1. Send {"jsonrpc":"2.0","id":1,"method":"tools/list"} by POST to https://mcp.stonewake.ai/ (no key is needed).
2. Count the tools in the answer.
3. Compare the names with the tool list on https://docs.stonewake.ai/mcp.

**Expected Results:** The documentation and the server agree on the number and names of the tools.

**Actual Results:** The server lists 40 tools. All 38 documented tools are present, and search and fetch are not documented.

**Any Additional information:**
- Checked on 2026-11-04 against the live server and the live documentation page.
- Found by the automated test "lists the 38 read-only tools".
- Both tools are marked read-only. search refuses a call without a key with code -32001.
- This is a documentation mismatch: no wrong tool behavior was observed.

**Priority:** Low

**Severity:** Low. Documentation only: the tools themselves were not seen to misbehave.
