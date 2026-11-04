# Stonewake: scenarios for automation

Codex output, translated into English. Date: 2026-11-04. This is a test specification, not a finished or executed automated suite. P0 is smoke and access, P1 is main regression, P2 is additional regression.

Use a dedicated test team, stable fixtures and CI secrets. Do not put a password in code, traces, video or reports. Conditions for sign-in checks must be agreed in advance with the test account owner.

## Scenarios checked directly in exploration

| ID / priority | Preconditions | Steps | Expected result |
|---|---|---|---|
| AUTH-01 P0 | New session, not signed in | Open / | Redirect to /login; the form is available |
| AUTH-02 P1 | /login | Fill Email and Password, do not accept the terms | Sign in and magic link are disabled; after accepting, the buttons are available |
| AUTH-03 P0 | Allowed conditions, valid secrets | Sign in | Deal Book opens; user, team and protected content are visible |
| RESET-01 P1 | /login/reset | Submit the empty form | Email invalid, focus on the field, nothing is sent |
| DEAL-01 P0 | Signed in, Tuaspring fixture | Search Tuaspring, wait for results | The expected deal is found, and the page with the right ID opens |
| DEAL-02 P1 | More than 50 deals | Next | Range 51-100, Previous available, rows changed |
| DEAL-03 P1 | Second page | Search a unique missing string | No matching deals; Export disabled; no old rows or wrong range |
| DEAL-04 P1 | Empty result of DEAL-03 | Clear the search | Field cleared, list restored |
| DEAL-05 P1 | Known deal | Compare the list with the deal page | ID, country, amount and relevance score match; check stage and financing window by an agreed mapping table |
| SOURCE-01 P1 | Deal page with one visible update | Click 1 source | The dialog of this update opens at once with a quote and View at source; currently SW-01 |
| SOURCE-02 P1 | Tuaspring history | Compare normalized text, date, status and amount of all updates | No unexplained identical blocks; currently SW-02 |
| SOURCE-03 P1 | Open dialog | Close | Dialog gone, deal page available |
| FILE-01 P1 | Stable deal page | Wait for download, click Download report | PDF download with the deal name finishes; content checked separately in FILE-02 |
| COUNTRY-01 P1 | /countries | Search Singapore | One country, filtered region summary of 1 deal and $14m for this fixture |
| COUNTRY-02 P1 | COUNTRY-01 | Click the deal count | Deal Book has the SGP filter and the Singapore deal |
| INST-01 P1 | /entities | Non-existent search | No matching institutions and a hint to adjust the search |
| INST-02 P1 | /entities | Clear the search; Country Japan | Every row is Japan; JBIC, NEXI, JICA present for this fixture |
| MON-01 P2 | Team without research sources | /monitoring | Correct empty state and links to Following and Portfolio |
| PORT-01 P1 | Stable portfolio | Read the summary and the table | Sum of categories = active exposures; for the current fixture 1+11+13=25 |
| SCREEN-01 P1 | /screenings | New screening without filling it in | Start screening disabled; required fields and purpose available |
| SCREEN-02 P1 | Open form | Cancel | Dialog closed, no screening created |
| SCORE-01 P1 | /scoring, original profile | Freshness=-1 | Message about range 0-100; Preview and Save disabled; active profile unchanged |
| NET-01 P1 | /network | Search Siemens | Results with name, country and LEI; with many results, a prompt to refine |
| NET-02 P1 | NET-01 | View network for Siemens AG | The right node, graph and table open; limits on shown relations are stated |

## Additional scenarios, not yet run

| ID / priority | Preconditions | Steps | Expected result |
|---|---|---|---|
| AUTH-04 P1 | Test account | One sign-in with a wrong password | Clear error, no protected data; no repeated guessing |
| AUTH-05 P0 | Signed in | Reload; then Sign out; open a protected URL | The session survives reload; after logout protected data is unavailable |
| AUTH-06 P0 | Two test accounts or teams | Open known IDs of the other team | No data leak; 403, 404 or a safe state by contract |
| RESET-02 P1 | Test mailbox | Wrong format; registered and unknown email | Wrong format blocked; safe answers; test mail delivered only in the approved scenario |
| DEAL-06 P1 | Fixtures of different sectors and regions | Search + sector + region + window | Every row meets all filters; paging resets |
| DEAL-07 P1 | At least 3 pages | Next to the last page, Previous; change a filter | Correct bounds, Next disabled on the last page, no duplicate IDs across pages |
| DEAL-08 P1 | Test deals only | Follow, check Following, reload, undo | State is consistent across list, deal page and Following, and is kept |
| DEAL-09 P1 | Test deals with restore | Dismiss with a reason, Dismissed filter, restore | The deal leaves Open, the reason is kept, restore returns the record |
| FILE-02 P1 | FILE-01 | Check the PDF with a parser | File is not empty, valid, has the name, key facts and sources; generation errors are not masked by an HTML download |
| FILE-03 P1 | Small filtered result | Export the list | Valid format, only filtered records, values, currency and encoding correct |
| FILE-04 P2 | Known deal page | Download deck | The deck opens, matches the deal, sources present |
| TEND-01 P1 | Fixture of 241 matches | Next, Previous, change status | Ranges 1-200 and 201-241, no losses or duplicates |
| TEND-02 P1 | Test tender | Why this match | The explanation matches the profile and tender |
| TEND-03 P1 | Disposable test tender | Add to Deal Book twice, or double click | One deal, correct status, repeat protected from a duplicate |
| IMPORT-01 P1 | Dedicated environment, test CSV files | Valid import; wrong headers; empty file; duplicates | Clear per-row errors, count report, no silent partial damage or duplicates |
| SCORE-02 P1 | Test profile | Values -1/0/100/101; factors -0.01/0/1/1.01; sum 99/100/101 | Bounds are validated; Preview and Save only with valid values and sum 100 |
| SCORE-03 P1 | Test team | Preview a valid profile | The effect is shown; active scores do not change until Activate |
| SCREEN-03 P1 | Test environment with a cost limit | Valid Organization, Country or Person + purpose | One task, progress statuses, result with sources; double submit creates no duplicate |
| NET-03 P1 | Fixture of historical links | Current, All history, As of; min ownership | Graph and table agree, dates and shares match the fixture |
| A11Y-01 P1 | Main pages | Only Tab, Enter, Escape; dialogs | Logical focus, accessible names, focus return, no traps outside dialogs |
| RESP-01 P1 | Real viewports 390×844, 768×1024, desktop | Sign-in, navigation, tables, source dialog | Fields and actions available; no clipping; table horizontal scroll controlled |
| I18N-01 P2 | Test profile | English, Deutsch, reload | Interface and dates agree; language kept by contract |
| TEAM-01 P0 | Access to two test teams | Switch team on a list or deal page | Data and filters update, the cache shows no other team |

## Implementation notes

### Addition after run 2

The manual run confirmed DEAL-08 (Follow, reload, Unfollow), TEND-02, and parts of DEAL-06, TEND-01, SCORE-02, SCORE-03 and FILE-03. These rows remain a specification for automated tests, but are no longer fully unchecked by hand. No automation code was created at that point.

| ID / priority | Preconditions and steps | Expected result, or fact of the run |
|---|---|---|
| DEAL-10 P1 | Renewables + Europe, Order Name; open Calik and Back | Three deals Calik, Elyse, Solar; filters and order kept; passed by hand |
| DEAL-11 P1 | Renewables + Europe + Financing open | Only Serbia for the current fixture; passed by hand |
| FOLLOW-01 P1 | Follow a name, enter spaces | Submit disabled; passed by hand |
| TEND-04 P1 | New profile, empty form; then Name only | Name is required; then CPV and NUTS validation; no profile created; passed by hand |
| COUNTRY-03 P1 | Singapore detail, Show them | One active and three held back, all SGP; passed by hand |
| INST-03 P1 | JBIC catalog to detail | Live deals = 13 in both places for the current fixture; passed by hand |
| FILE-05 P1 | Export of one active SGP | XLSX intact; Deals one row, SGP, 14400000 USD, score 71; Sources linked to the deal; passed by hand |
| FILE-06 P2 | Check Sources!B2 | Typographic apostrophe kept as U+2019, no replacement character; passed by hand |
| SCORE-04 P1 | Freshness=11 with other original weights, then Discard | Sum 101 blocks Preview and Save; Discard returns 100; passed by hand |
| SCORE-05 P1 | Preview of the original profile | Finishes, shown old and new score and rank are equal, the profile is not activated; passed by hand |

Clarify SOURCE-02 as a UI check: no identical summary or history blocks. No exact duplicate was found in the XLSX Developments; do not claim duplicate storage.

FILE-03 is so far confirmed for Deals of active Singapore. Full filter compliance of the supporting tabs and export with held=shown need a separate test.

- Playwright: getByRole and getByLabel locators, a unique deal ID from a fixture. For repeated buttons, first narrow the locator to the container of the update or row.
- Wait for a concrete result (heading, row, dialog, download), not a sleep. Search is asynchronous: right after typing, the old results stay visible for a moment.
- The numbers 146, 241, 25 and dates in current production are observations, not a stable contract. In regression, take the expected numbers from fixtures.
- UI smoke for each release: AUTH-01, AUTH-03, DEAL-01, SOURCE-01, COUNTRY-02, INST-02, PORT-01, NET-02.
- Run suites that write data in isolation and in sequence on a shared team. Define the allowed teardown in advance for data recovery.
- Separate document, mail, paid and multi-user checks from the fast smoke.
