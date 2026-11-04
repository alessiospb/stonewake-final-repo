# Stonewake: exploratory testing

Codex manual run, translated into English. Date: 2026-11-04. URL: https://app.stonewake.ai/. Account supplied by the participant, team itac-6, language English. No password is stored in this report.

Environment: Codex built-in browser, actual size 1280×720. This is an exploratory UI run, not a full regression and not a security audit.

## Result

Two runs found 2 reproducible observations on the Tuaspring deal page: an ambiguous "1 source" action and identical update blocks in the UI. They may share a cause; independent causes were not established. No blocking defects were found in the scenarios run.

### SW-01: "1 source" expands updates instead of opening the source

Priority: P2, UX and functionality. Reproduced twice, including after opening the deal page directly.

Precondition: signed in, team itac-6.

1. Open https://app.stonewake.ai/deals/b07cef67dbdc.
2. Updates shows one update and a "1 source" button.
3. Click "1 source".

Actual: five updates and five buttons with the same name appear. The first is marked expanded; no source window opens. Clicking the second button opens a dialog with a quote and a link.

Expected: "1 source" opens the source of that update at once. If the action is meant to show the history, it should have its own clear name and an update count.

### SW-02: two identical blocks in Updates (UI)

Priority: P2, history display. Reproduced twice after expanding the history. Second run clarification: the XLSX has four developments with no exact duplicate. Duplicate storage is not proven; the UI may show a summary and the first history entry together.

1. Do SW-01, steps 1-3.
2. Compare the first two updates.

Actual: the first two blocks have the same wording about NEXI insurance for the US$14.4 million JBIC buyer's credit, one status Cover in principle, Published 3 Nov 2026, US$14.4 million and Verified. The user sees no difference between the events.

Expected: one event, or a clear difference between summary, versions and sources. Two identical blocks are not shown as independent updates.

## Coverage performed

| Area | Check | Result |
|---|---|---|
| Authentication | Guest redirect to login; both buttons blocked until terms are accepted; data entry; sign-in after the user's separate consent | Passed |
| Recovery | Empty Send link form | Browser Email requirement fires; no mail sent |
| Deal Book | Search Tuaspring, open the deal | Passed |
| Deal Book | Next: 1-50 to 51-100 of 146 | Passed |
| Deal Book | Non-existent search from the second page | No matching deals and Clear the search shown; Export disabled |
| Deal Book | Clear the search | Returns to the list |
| Deal page | Amount $14m, Singapore, parties, score 71 | Shown; score and amount match the list |
| Deal page | Expanding a source | SW-01, SW-02; quote dialog reachable through the second button |
| Deal page | Download report | PDF downloaded; content not checked |
| Tenders | Matches load | 241 matches, 1-200, Next; paging details not checked |
| Countries | Search Singapore | One country; the region shows 1 of 56, 1 deal, $14m |
| Countries | Click the Singapore deal count | Opens Deal Book with Singapore selected and the right deal |
| Institutions | Non-existent search | No matching institutions |
| Institutions | Clear the search and Country Japan | JBIC, NEXI, JICA; all Japan |
| Monitoring | Open | Empty state and links to Following and Portfolio |
| Portfolio | Open, summary | 25 active exposures; 1 Amber + 11 No score yet + 13 Green = 25 |
| Screenings | Empty state, New screening, Cancel | The form opens, required fields are empty, Start screening is disabled; closing works |
| Scoring | Freshness = -1 | Error 0-100; Preview effect and Save and activate disabled; profile not activated |
| Network | Siemens to View network | Results with LEI and countries, Siemens graph, 199 relations; canvas and table limits clearly stated |

## Limits and items not checked

- Responsive: the 390×844 viewport request did not change the actual size, measured 1280×720. There are no mobile results; the temporary override was reset.
- CDP and browser control timeouts occurred during navigation. The application kept working after another observation. They cannot be attributed to the site with confidence.
- The primary source theedgemalaysia.com could not be opened because of a timeout. The publication date and the reliability of financial and sanctions data were not independently checked.
- No research, screenings, mailings or password recovery were run. No settings, scoring profile, new companies or tenders were saved. Nothing was deleted.
- Follow and Dismiss, import, list export, deck, PDF content, language change, team switching, settings, logout, roles and access isolation needed a further run.
- Opening a deal page may have marked it viewed (the New label disappeared). No explicit change of business data was made.

## Priorities of the next run

1. Fix SW-01 and SW-02 and cover them by regression.
2. On a dedicated test team, check Follow, Dismiss, Undo, import and screenings with cost control.
3. Check export and PDF and deck content, access rights with two accounts, and recovery with a test mailbox.
4. Do a real mobile and cross-browser check.

## Run 2, 2026-11-04

The results below refine the list of items not checked in run 1.

| Check | Actual result |
|---|---|
| Session persistence | A new tab opened Deal Book without another sign-in |
| Renewables + Europe | Three deals: Serbia, Poland, France; all Renewables |
| Same filters + Financing open | One deal, Solar power project in Serbia |
| Order Name | Calik, Elyse, Solar: order A-Z |
| Calik deal page, then Back | Renewables, Europe and Order Name kept |
| Follow Tuaspring, Following, reload | The deal appeared and its status was kept |
| Unfollow | Original status restored; the deal left Following |
| Follow a name, spaces only | Follow this name disabled, form cancelled |
| Tenders Next | 201-241 of 241, 41 links, Next disabled |
| Overlap of tender pages | 200 and 41 titles; no identical titles between pages. Not checked by ID |
| Why this match | Shown: CPV 09123000 and DEA33, DEU for the first tender of the second page |
| New tender profile, empty | Browser validation requires Name |
| New profile, Name only | Error "A profile names at least one CPV code or one NUTS region."; form cancelled, no profile created |
| Singapore detail | Risk 9, 1 live deal, $14m, score 71 match the catalog and the deal page |
| Singapore, Show them | Four Singapore deals: one active and three held back; Showing 3 held back |
| JBIC detail | 13 Live deals rows, matches the catalog |
| JBIC 45 ISINs | The list expands; Hide ISINs is available |
| Export of active Singapore | XLSX intact: Deals has one Tuaspring, SGP, 14400000 USD, score 71; Developments four rows, Sources one publication |
| Scoring Freshness 11, sum 101 | Preview and Save disabled, message that the sum must be 100 |
| Discard changes | Freshness=10, sum 100 |
| Preview of the original profile | Finished, top 20 movers of 457 deals; shown scores and ranks unchanged. Built-in default live, no saved profiles |
| Console warnings and errors during Scoring | No entries in the checked slice; this does not prove there are no errors at all |

The export was checked by reading the XLSX XML, without opening it in Excel or a visual review. Sources!B2 holds the correct apostrophe U+2019; there is no file encoding error.

The repeated export checked one active Singapore deal. An earlier Export with held=shown was not captured, so the correctness of exporting hidden deals is still unchecked.

After the run, Follow on Tuaspring was restored, no tender profile was created, scoring changes were discarded and the active profile did not change. The test Follow may have left a record in the service log. No research or screenings were started.

Still not checked: Dismiss and restore, import, paid research, PDF and deck content, team and language switching, logout, access isolation with two accounts, a real mobile layout, and a full keyboard navigation audit.
