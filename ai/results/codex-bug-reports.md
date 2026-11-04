# Stonewake Bug Reports

Severity is assessed by user impact; Priority indicates scheduling urgency. Descriptive severity labels are used because the incident tracker's severity scale has not been provided.

## SW-01

**Status: confirmed by the participant, SpiraTest incident [85](https://itac.spiraservice.net/30/Incident/85.aspx).**

**Name of incident**

“1 source” expands the update history instead of opening the source

**Description:**

On the Tuaspring deal page, the first “1 source” button expands the update history. Its label suggests that it opens the source supporting the displayed update, as the buttons inside the expanded history do.

**Steps to Reproduce:**

1. Sign in to https://app.stonewake.ai/ and select team `itac-6`.
2. Open https://app.stonewake.ai/deals/b07cef67dbdc.
3. Locate the Updates section. Initially, one update and a “1 source” button are visible.
4. Click “1 source”.
5. Click the second “1 source” button in the expanded section for comparison.

**Expected Results:**

“1 source” opens the supporting source for the displayed update. An action that expands the update history should have a distinct label describing that action and the number of updates.

**Actual Results:**

The first click displays five update blocks and five “1 source” buttons without opening a source dialog. The first button is marked as expanded. Clicking the second button opens a dialog containing a cited passage and a source link.

**Any Additional information:**

- Observed on November 4, 2026, in the Codex in-app browser at 1280 × 720, with English selected.
- Reproduced twice, including after opening the deal URL directly.
- Evidence: expanded history (file kept outside the repository), source dialog opened by the second button (file kept outside the repository).
- SW-01 and SW-02 may share a cause; the implementation cause has not been established.

**Priority:**

P2 — Medium

**Severity:**

Medium — The source control performs a different action from its label, interfering with source verification. A workaround exists through the expanded history; no data loss or complete workflow block was observed.

## SW-02

**Status: confirmed by the participant, SpiraTest incident [87](https://itac.spiraservice.net/30/Incident/87.aspx).**

**Name of incident**

Expanded Updates section displays two identical update blocks

**Description:**

After expanding the Updates section on the Tuaspring deal page, the first two blocks display identical content without distinguishing a summary from an individual history entry. This makes one event appear twice.

**Steps to Reproduce:**

1. Sign in to https://app.stonewake.ai/ and select team `itac-6`.
2. Open https://app.stonewake.ai/deals/b07cef67dbdc.
3. In Updates, click the initially visible “1 source” button to expand the history.
4. Compare the first two update blocks.

**Expected Results:**

Each update is displayed once. If the section includes both a summary and the underlying history, their roles are clearly labeled so that identical content does not appear as two independent updates.

**Actual Results:**

The first two blocks show the same wording about NEXI providing insurance for the co-financed portion of the US$14.4 million JBIC buyer’s credit. Both display “Cover in principle”, “Published 3 Nov 2026”, “US$14.4 million”, and “Verified”. No visible distinction explains why the content is repeated.

**Any Additional information:**

- Observed on November 4, 2026, in the Codex in-app browser at 1280 × 720, with English selected.
- Reproduced twice after expanding the history.
- Evidence: identical first and second blocks (file kept outside the repository).
- The checked XLSX export contains four development records without an exact duplicate. This finding concerns UI presentation; duplicate storage records have not been established.
- The UI may be showing a summary alongside the first history entry, but this explanation has not been confirmed.

**Priority:**

P2 — Medium

**Severity:**

Medium — Identical blocks can make one event appear to be multiple developments, affecting interpretation of the history. The checked export has no exact duplicate, and data corruption was not established.
