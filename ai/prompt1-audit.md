# Task: Rapid Diagnostic Audit of an Existing Playwright Automation Project

## Context

You are a Senior QA Automation Engineer specializing in Playwright, TypeScript, test architecture, CI/CD, and test reliability.

We are participating in a QA automation competition.

We have received an existing automation project that may contain:

- Flaky and failing tests
- Outdated or poorly structured code
- Unreliable selectors and synchronization
- Weak test isolation
- Missing test coverage
- Configuration and CI/CD problems
- Maintainability and readability issues

**Time constraint:** The entire competition lasts 3 hours, including implementation, verification, documentation, video recording, and submission.

Your task is to perform a rapid, evidence-based diagnostic audit and produce an actionable improvement plan.

**Do not modify any project files during this phase.**

## 1. Repository Discovery

Inspect the existing repository and identify:

- Project structure and organization
- Playwright and TypeScript versions
- Test directories and naming conventions
- Page Object Model (POM) implementation, if any
- Fixtures, helpers, and shared utilities
- Test data management
- Environment configuration
- Existing reporters
- GitHub Actions workflows
- Available documentation
- Test execution commands

Determine how the project is intended to be executed.

Do not assume that the current architecture is incorrect merely because it differs from common patterns.

## 2. Baseline Execution

First, inspect the available configuration and scripts.

Identify the appropriate commands to execute the existing test suite.

Run the tests using the project's intended configuration, if the environment permits.

Prefer running without retries to expose instability.

Collect:

- Total number of discovered tests
- Passed tests
- Failed tests
- Skipped tests
- Execution duration
- Error messages
- Relevant screenshots, traces, and logs

Distinguish between:

1. Test implementation defects
2. Potential application defects
3. Environment or infrastructure problems
4. Configuration problems
5. Unconfirmed or potentially flaky failures

Do not automatically classify every failing test as flaky.

If execution is impossible, explain exactly why.

Do not modify configuration or tests merely to make the baseline run succeed.

## 3. Flakiness and Reliability Analysis

Inspect the test suite for common sources of instability.

### Synchronization

Look for:

- Hardcoded timeouts and `waitForTimeout()`
- Missing or incorrect asynchronous waits
- Race conditions
- Unnecessary `networkidle` dependencies
- Assertions that do not properly wait for expected conditions
- Actions performed before elements become ready

### Locators

Look for:

- Fragile CSS or XPath selectors
- Positional selectors such as `nth()` without justification
- Dynamic IDs or class names
- Ambiguous selectors
- Excessive reliance on implementation details
- Opportunities to use `getByRole()`, `getByLabel()`, `getByTestId()`, or other stable locators

### Test Isolation

Look for:

- Dependencies between tests
- Shared mutable state
- Test order dependencies
- Inadequate cleanup
- Reused accounts or conflicting test data
- Parallel execution conflicts
- Tests that depend on previous test results

### Reliability Configuration

Inspect:

- Retry settings
- Timeouts
- Workers
- Browser configuration
- Global setup and teardown
- Error handling
- Trace, screenshot, and video collection

Identify configuration choices that may conceal underlying problems.

For each significant issue, provide file paths, line numbers, and an explanation of the potential impact.

## 4. Architecture and Maintainability

Evaluate:

- Separation of test logic and page interactions
- POM structure and responsibilities
- Reusable components
- Fixtures and dependency management
- Duplicated code
- Hardcoded test data
- TypeScript type safety
- Naming conventions
- Code readability
- Error handling
- Maintainability

Do not recommend large-scale refactoring unless there is a clear benefit within the competition's time constraints.

Prioritize incremental improvements that preserve existing functionality.

## 5. Test Coverage Assessment

Identify the functional areas currently covered by the test suite.

Inspect available product documentation and application behavior when accessible.

Determine:

- Existing functional coverage
- Important missing scenarios
- Missing negative tests
- Missing boundary-value checks
- Missing validation scenarios
- Potential gaps in critical user journeys

Do not invent product requirements.

Clearly distinguish between:

- Confirmed requirements
- Inferred expected behavior
- Areas requiring clarification

Recommend additional tests based on risk and business impact.

## 6. CI/CD and Reporting Assessment

Inspect GitHub Actions configuration.

Evaluate:

- Dependency installation
- Playwright browser installation
- Test execution
- Artifact collection
- HTML reporting
- GitHub Pages publication
- Failure diagnostics
- Workflow permissions
- Reproducibility

Identify obstacles to demonstrating five consecutive successful test runs.

Pay particular attention to:

- Execution duration
- Environment dependencies
- Parallelism
- Retry configuration
- Reporting reliability

Do not change CI configuration during this audit.

## 7. Prioritization

Classify findings into four priority levels.

### P0 — Critical Blockers

Issues that prevent test execution, CI execution, or reliable delivery.

### P1 — Stability and Correctness

Issues causing test failures, flakiness, false positives, or incorrect validation.

### P2 — Architecture and Coverage

Improvements that materially increase maintainability, readability, or meaningful test coverage.

### P3 — Optional Enhancements

Cosmetic improvements, low-impact refactoring, and bonus features.

Prioritize fixes based on:

- Impact on competition scoring
- Probability of successful implementation
- Estimated implementation time
- Risk of introducing regressions
- Dependencies between tasks

## 8. Required Output

Produce a concise diagnostic report using the following structure.

### A. Executive Summary

Provide:

- Overall project health assessment
- Main risks
- Most important findings
- Recommended immediate actions

### B. Baseline Results

| Metric | Result |
|---|---|
| Discovered tests | |
| Passed | |
| Failed | |
| Skipped | |
| Execution time | |
| Environment status | |

Clearly distinguish observed results from assumptions.

### C. Findings

| ID | Priority | Category | File:Line | Problem | Evidence | Recommended Fix | Estimated Time |
|---|---|---|---|---|---|---|---|

Only include actionable findings.

### D. Test Coverage Gaps

| Feature | Existing Coverage | Missing Scenarios | Priority |
|---|---|---|---|

### E. Recommended Improvement Plan

Provide an ordered implementation plan.

For each step, include:

- What should be changed
- Why it matters
- Estimated implementation time
- Dependencies
- Verification method

### F. Quick Wins

Identify improvements that can be implemented in approximately 5–10 minutes each and offer meaningful benefits.

### G. Risks and Open Questions

Identify uncertainties that require further investigation or clarification from competition organizers.

### H. Suggested Next Action

Recommend the single most valuable next implementation task.

## 9. Execution Rules

- Do not modify project source files.
- Do not install dependencies without explicit approval.
- Do not commit or push changes.
- Do not modify existing tests.
- Do not disable or skip failing tests.
- Do not weaken assertions.
- Do not increase retries to hide failures.
- Do not assume application defects without evidence.
- Do not claim tests passed unless they were actually executed.
- Do not confuse static analysis findings with observed runtime failures.
- Avoid unnecessary architectural redesign.
- Keep the report concise, specific, and actionable.

You may run read-only inspection commands, type checking, linting, and existing test commands when the environment permits.

If a command would modify tracked files, require approval first.

## 10. Time Budget

Complete this diagnostic audit within approximately **10 minutes**.

Prioritize high-value investigation over exhaustive code review.

If time is running out:

1. Finish the current investigation.
2. Summarize confirmed findings.
3. Clearly identify unverified areas.
4. Produce the prioritized action plan.

Do not continue investigating indefinitely.

**Start by inspecting the repository structure, package.json, Playwright configuration, existing tests, and GitHub Actions workflows.**