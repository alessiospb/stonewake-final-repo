# Task: Stabilize and Improve the Existing Playwright Automation Project

## Context

You are a Senior QA Automation Engineer specializing in Playwright, TypeScript, test reliability, and maintainable test architecture.

We are participating in a QA automation competition with a strict 3-hour time limit, including implementation, verification, documentation, video recording, and submission.

A diagnostic audit of this repository has already been completed.

**Your task is to implement high-priority improvements based on the audit findings, stabilize the test suite, and improve maintainability without introducing unnecessary complexity.**

Do not repeat the full diagnostic audit.

Use the findings and recommendations from the previous phase as your starting point.

If the audit report is available in the conversation or repository, read it before making changes.

## 1. Objectives

Work toward the following goals, in priority order:

1. Resolve critical issues preventing test execution.
2. Fix confirmed test implementation defects.
3. Eliminate identified sources of flakiness.
4. Improve test isolation and determinism.
5. Perform targeted architectural refactoring.
6. Improve code quality, readability, and maintainability.
7. Preserve existing test coverage and intended behavior.
8. Prepare the project for reliable execution in GitHub Actions.

The ultimate goal is a reliable test suite capable of demonstrating five consecutive successful runs.

However, do not execute the five-run verification campaign during this phase unless explicitly instructed.

## 2. Use the Diagnostic Findings

Review the findings from the previous audit.

Create a short implementation plan containing:

| Priority | Finding ID | Proposed Change | Estimated Time | Verification |
|---|---|---|---|---|

Start with P0 and P1 findings.

Address P2 findings only when they provide meaningful benefits and do not jeopardize stability.

Ignore P3 improvements unless explicitly requested.

Do not spend time on speculative issues that lack supporting evidence.

If a finding appears incorrect, explain why and exclude it from implementation.

**Begin implementation immediately after presenting the short plan. Do not wait for approval unless a change is destructive, security-sensitive, or outside the authorized scope.**

## 3. Fix Test Failures

For each confirmed test implementation defect:

1. Identify the root cause.
2. Apply the smallest reliable correction.
3. Preserve the original test intent.
4. Run the affected test.
5. Confirm that the correction addresses the observed failure.

Do not change expected results merely to match the application's current behavior.

If a failure appears to be caused by a genuine application defect:

- Do not modify the test to hide it.
- Preserve the failing assertion.
- Record the issue with reproduction steps.
- Include expected and actual behavior.
- Capture relevant evidence when available.
- Mark the issue for reporting in SpiraTest.

Do not modify application code unless explicitly instructed.

## 4. Eliminate Flakiness

Focus on confirmed or strongly supported causes of instability.

### Synchronization

Replace inappropriate fixed delays with condition-based waiting.

Prefer Playwright's built-in auto-waiting and retrying assertions.

Example:

Avoid:

```typescript
await page.waitForTimeout(3000);
expect(await page.locator('.status').textContent()).toBe('Ready');
```

Prefer:

```typescript
await expect(page.locator('.status')).toHaveText('Ready');
```

Do not remove a delay without understanding why it was introduced.

### Locators

Prefer stable, meaningful locators:

1. `getByRole()`
2. `getByLabel()`
3. `getByPlaceholder()`
4. `getByTestId()` when appropriate
5. Stable CSS selectors when necessary

Avoid fragile positional selectors and selectors based on dynamic implementation details.

Before replacing a locator, verify that the new locator identifies the intended element.

Do not assume that a locator is correct merely because it matches an element.

### Test Isolation

Identify and correct:

- Shared mutable state
- Test order dependencies
- Conflicting test data
- Incomplete cleanup
- Parallel execution conflicts
- Authentication state leakage

Prefer isolated test fixtures and deterministic setup.

Avoid unnecessary global state.

Do not introduce large infrastructure changes unless required.

### Retries and Timeouts

Do not increase retry counts to conceal failures.

Do not increase timeouts without evidence that the existing limits are inappropriate.

Keep verification runs at zero retries whenever practical.

## 5. Targeted Refactoring

Improve architecture only where it provides clear benefits.

### Page Object Model

If POM already exists:

- Improve problematic Page Objects.
- Remove duplicated interactions.
- Consolidate repeated locators.
- Clarify responsibilities.
- Preserve existing public interfaces where practical.

If POM does not exist:

- Introduce it only for frequently reused or particularly complex page interactions.
- Do not rewrite the entire suite.

### Fixtures

Use Playwright fixtures when they simplify repeated setup and improve test isolation.

Avoid unnecessary abstractions.

### Helpers and Utilities

Extract duplicated logic when it materially improves readability or reliability.

Avoid creating generic utility frameworks for one-off operations.

### TypeScript

Fix relevant type errors.

Avoid introducing `any` unless justified.

Prefer explicit types where they improve clarity.

### Readability

Use descriptive names and consistent conventions.

Remove obsolete code only when its purpose is understood.

Add comments explaining non-obvious decisions, synchronization requirements, and important constraints.

Do not add comments that merely repeat what the code already says.

## 6. Preserve Test Integrity

The following actions are prohibited unless explicitly authorized:

- Deleting tests to achieve a green run
- Adding `test.skip()` or `test.fixme()` to hide failures
- Replacing meaningful assertions with weaker ones
- Removing validation steps
- Changing expected values without confirming requirements
- Increasing retries to conceal instability
- Mocking behavior that the test is intended to validate
- Disabling browsers or projects solely to reduce failures
- Silently excluding failing test files
- Modifying application behavior to satisfy incorrect tests

Preserve all intentional negative tests.

If an existing test is intentionally designed to fail, document that fact and do not modify it without authorization.

**A green test suite obtained by reducing meaningful coverage is not considered a successful stabilization.**

## 7. Verification Strategy

After each significant change:

1. Run the affected tests.
2. Confirm that the original failure is resolved.
3. Check for regressions in related tests.

After completing the selected improvements:

Run the complete suite using the repository's intended configuration.

Prefer zero retries.

For example:

```bash
npx playwright test --retries=0 --reporter=line
```

Do not blindly force Chromium if the project requires additional browser coverage.

Run available TypeScript and lint checks where appropriate.

If the complete suite is too expensive to run within the remaining time, prioritize critical scenarios and explicitly document the verification limitation.

Do not report unexecuted checks as successful.

## 8. Maintain a Change Log

Create or update:

`docs/competition-changes.md`

Document significant changes using this format:

| ID | Category | Problem | Root Cause | Files Changed | Fix | Verification |
|---|---|---|---|---|---|---|

Keep entries concise and factual.

Also record:

- Unresolved failures
- Suspected application defects
- Environment limitations
- Known risks
- Verification gaps

This document will later support the README, STP, and final presentation.

Do not include secrets or sensitive test data.

## 9. AI Usage Documentation

Create or update:

`docs/ai-usage.md`

Record:

- AI tool: Claude Code
- Purpose of this phase
- Main instructions used
- Significant AI-assisted changes
- Verification performed
- Human decisions or overrides, if any

Include the main prompt or a faithful reference to its saved location.

Do not invent human reviews or approvals.

## 10. Time Management

Target approximately 35–45 minutes for this implementation phase.

This is a planning budget, not an automatically enforced timeout.

Prioritize improvements with the highest expected impact on stability and competition scoring.

Avoid spending excessive time on a single difficult failure.

If an issue cannot be resolved efficiently:

1. Document the current evidence.
2. Record the blocker.
3. Continue with the next high-priority issue.

Reserve sufficient time for:

- Five consecutive green runs
- GitHub Actions verification
- Test coverage improvements
- Documentation
- Video recording
- Final submission

Do not initiate time-consuming optional work when the remaining budget is uncertain.

## 11. Git and Repository Safety

- Do not push changes.
- Do not create commits unless explicitly instructed.
- Do not rewrite Git history.
- Do not change repository remotes.
- Do not modify GitHub repository settings.
- Do not expose credentials or tokens.
- Do not overwrite unrelated user changes.

Keep changes focused and reviewable.

## 12. Final Deliverables

At the end of this phase, provide:

### A. Implementation Summary

| Finding ID | Status | Files Changed | Verification Result |
|---|---|---|---|

Use these statuses:

- Fixed and verified
- Fixed but not fully verified
- Partially addressed
- Blocked
- Deferred

### B. Test Results

Report:

- Tests executed
- Passed
- Failed
- Skipped
- Execution duration
- Retry configuration

Distinguish between targeted test runs and full-suite runs.

### C. Architecture Improvements

Briefly describe the most important structural changes.

### D. Remaining Problems

List unresolved issues and their impact.

### E. Next Recommended Actions

Recommend the next steps in priority order.

### F. Verification Confidence

Explicitly state:

- What was verified
- What was not verified
- Whether the full suite passed
- Whether the project is ready for the five-run stability campaign

Do not claim that the project is stable solely because one test run passed.

## 13. Execution Instructions

Start by reading the diagnostic findings from the previous phase.

Prepare a concise implementation plan.

Then implement the selected fixes.

Verify each significant change.

Maintain the change log and AI usage documentation.

Do not stop after producing recommendations — this phase requires actual code changes.

**Your objective is to deliver the greatest measurable improvement in test reliability and maintainability within the available time, without compromising test integrity.**