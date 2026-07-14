# AI Audit: Hostile Seam Review Upgrade

Use this file to upgrade any repository's implementation and PR review governance.

Goal: make AI implementers and reviewers stop reasoning only about changed lines and start reasoning about the contract seam: state ownership, consumers, sibling paths, partial writes, retries, and repeated operations.

`RUN_PLAN.md` prevents seam bugs upstream. `PR_TOUGH.md` catches seam bugs downstream. The audit should upgrade both.

## When Auditing A Repo

1. Look for `PR_TOUGH.md` at the repo root.
2. If it exists, add the PR review sections below.
3. If it does not exist, create `PR_TOUGH.md` and include the minimum review policy below.
4. Look for `RUN_PLAN.md` at the repo root.
5. If it exists, add the pre-edit seam sweep sections below.
6. If it does not exist, create `RUN_PLAN.md` with the minimum implementation policy below, or add the same rule to the repo's main agent/governance file if the repo has a different canonical implementation guide.
7. In `PR_TOUGH.md`, place the mandatory gate near the front of the file, before any long checklist.
8. In `PR_TOUGH.md`, place the refusal rule at the end of the file.

The `RUN_PLAN.md` gate changes how the implementer edits. The `PR_TOUGH.md` front gate changes how the reviewer frames the review. The end rule prevents passing a review that skipped the gate.

## Add Near The Front Of RUN_PLAN.md

```md
## Mandatory Pre-Edit Seam Sweep

Before editing code for any change that affects behavior, state, commands, lifecycle, persistence, process execution, retries, cancellation, recovery, validation, generated output, or public return shapes, the implementer must identify the changed contract.

For every changed contract, write down:

1. The old contract.
2. The new contract.
3. The durable state touched.
4. The single writer of that state.
5. Every consumer of the changed fields, return shape, command reason, receipt, event, or side effect.
6. Every sibling seam that handles the same command, result, or failure class.
7. What happens if the operation is interrupted after each durable write.
8. What happens if the operation is repeated.

Do not start editing until this sweep is complete.

If the sweep finds a consumer that is affected, update it in the same change or explicitly record why it is out of scope and safe. Passing tests are not enough if the consumer sweep is incomplete.

For orchestration, workflow, background job, state machine, process, database, queue, cache, session, or file-store changes, answer these before editing:

- Can this create a second writer?
- Can a read, status, or diagnosis path mutate state?
- Can stale or replaced work still be accepted?
- Can unreadable, corrupt, missing, locked, or busy state be mistaken for absent state?
- Can Stop, Cancel, Delete, Retry, Resume, Repair, or Rebuild be repeated without changing meaning?
- Can a partial write leave the system worse than before?
- Can a timeout, killed process, reboot, disconnected network, or reused PID turn this into corruption?
```

## Add Near The End Of RUN_PLAN.md

```md
## Post-Edit Seam Recheck

After editing and before reporting done, re-run the pre-edit seam sweep against the actual diff.

Confirm:

- The changed contract is still the one intended.
- Every consumer found before editing was updated or explicitly ruled out.
- No new consumer was created by the implementation.
- Durable writes still have a single writer.
- Interrupted and repeated operation behavior is known and acceptable.
- Any tests or validation run prove behavior, not just registration or source text.

If the implementation changed a return shape, receipt, event, command reason, status, field name, file path, process ownership rule, retry rule, cancellation rule, or validation result, this recheck is mandatory.
```

## Minimum RUN_PLAN.md For Repos That Do Not Have One

If a repo has no `RUN_PLAN.md`, create one with this content:

```md
# RUN_PLAN.md

Use this guide for AI-assisted implementation work.

## Mandatory Pre-Edit Seam Sweep

Before editing code for any change that affects behavior, state, commands, lifecycle, persistence, process execution, retries, cancellation, recovery, validation, generated output, or public return shapes, the implementer must identify the changed contract.

For every changed contract, write down:

1. The old contract.
2. The new contract.
3. The durable state touched.
4. The single writer of that state.
5. Every consumer of the changed fields, return shape, command reason, receipt, event, or side effect.
6. Every sibling seam that handles the same command, result, or failure class.
7. What happens if the operation is interrupted after each durable write.
8. What happens if the operation is repeated.

Do not start editing until this sweep is complete.

If the sweep finds a consumer that is affected, update it in the same change or explicitly record why it is out of scope and safe. Passing tests are not enough if the consumer sweep is incomplete.

## Implementation Rules

- Prefer existing helpers and ownership boundaries.
- Do not add compatibility shims unless the repo explicitly requires them.
- Do not change unrelated behavior.
- Keep the diff scoped to the contract being changed.
- If a helper already exists, use it instead of creating a parallel one.
- If the change touches durable state, name the single writer.
- If the change touches a lifecycle operation, define repeat behavior.
- If the change touches process execution, define timeout, kill, and orphan behavior.

## Post-Edit Seam Recheck

After editing and before reporting done, re-run the pre-edit seam sweep against the actual diff.

Confirm:

- The changed contract is still the one intended.
- Every consumer found before editing was updated or explicitly ruled out.
- No new consumer was created by the implementation.
- Durable writes still have a single writer.
- Interrupted and repeated operation behavior is known and acceptable.
- Any tests or validation run prove behavior, not just registration or source text.
```

## Add Near The Front Of PR_TOUGH.md

```md
## Mandatory Seam Review Gate

Before writing findings, the reviewer must identify the changed contract.

For every changed contract, list:

1. The old contract.
2. The new contract.
3. The durable state touched.
4. The single writer of that state.
5. Every consumer of the changed fields, return shape, command reason, receipt, event, or side effect.
6. Every sibling seam that handles the same command, result, or failure class.
7. What happens if the operation is interrupted after each durable write.
8. What happens if the operation is repeated.

A review that does not include this sweep is incomplete, even if the code compiles, lint passes, and tests pass.

For orchestration, workflow, background job, state machine, process, database, queue, cache, session, or file-store changes, always answer these hostile questions:

- Can this create a second writer?
- Can a read, status, or diagnosis path mutate state?
- Can stale or replaced work still be accepted?
- Can unreadable, corrupt, missing, locked, or busy state be mistaken for absent state?
- Can Stop, Cancel, Delete, Retry, Resume, Repair, or Rebuild be repeated without changing meaning?
- Can a partial write leave the system worse than before?
- Can a timeout, killed process, reboot, disconnected network, or reused PID turn this into corruption?

Do not trust the implementer's claimed scope. Review the seam, not the story.
```

## Add Inside Any Copyable Review Prompt

If `PR_TOUGH.md` contains a copyable prompt block, add this paragraph inside that prompt so users who copy only the prompt still get the rule:

```text
Mandatory seam review gate: before writing findings, identify the changed contract. For every changed contract, list the old contract, the new contract, durable state touched, the single writer, every consumer of changed fields/return shape/command reason/receipt/event/side effect, every sibling seam for the same command/result/failure class, what happens if interrupted after each durable write, and what happens if repeated. A review that does not include this sweep is incomplete, even if code compiles, lint passes, and tests pass. For orchestration, workflow, background job, state machine, process, database, queue, cache, session, or file-store changes, always answer whether this can create a second writer, whether a read/status/diagnosis path mutates, whether stale work can be accepted, whether unreadable/corrupt/missing/locked/busy state can be mistaken for absent state, whether destructive or lifecycle operations are repeat-safe, and whether a partial write can leave the system worse than before. Review the seam, not the story.
```

## Add At The End Of PR_TOUGH.md

```md
## Final Review Refusal Rule

If the review does not name the changed contract and its consumers, do not assign a passing grade.

If the review cannot state what happens when the changed operation is interrupted or repeated, do not assign a passing grade.
```

## Minimum PR_TOUGH.md For Repos That Do Not Have One

If a repo has no `PR_TOUGH.md`, create one with this content:

```md
# PR_TOUGH.md

Use this prompt when reviewing AI-generated or AI-assisted code. The reviewer must be hostile to seam bugs, not hostile to people.

## Mandatory Seam Review Gate

Before writing findings, the reviewer must identify the changed contract.

For every changed contract, list:

1. The old contract.
2. The new contract.
3. The durable state touched.
4. The single writer of that state.
5. Every consumer of the changed fields, return shape, command reason, receipt, event, or side effect.
6. Every sibling seam that handles the same command, result, or failure class.
7. What happens if the operation is interrupted after each durable write.
8. What happens if the operation is repeated.

A review that does not include this sweep is incomplete, even if the code compiles, lint passes, and tests pass.

For orchestration, workflow, background job, state machine, process, database, queue, cache, session, or file-store changes, always answer these hostile questions:

- Can this create a second writer?
- Can a read, status, or diagnosis path mutate state?
- Can stale or replaced work still be accepted?
- Can unreadable, corrupt, missing, locked, or busy state be mistaken for absent state?
- Can Stop, Cancel, Delete, Retry, Resume, Repair, or Rebuild be repeated without changing meaning?
- Can a partial write leave the system worse than before?
- Can a timeout, killed process, reboot, disconnected network, or reused PID turn this into corruption?

Do not trust the implementer's claimed scope. Review the seam, not the story.

## Findings Format

For each finding, include:

- Severity: CRITICAL / HIGH / MEDIUM / LOW
- File and line
- What is wrong
- Why it matters
- Smallest credible fix

Order findings by severity. Lead with bugs, risks, regressions, missing contract sweeps, and missing tests.

## Review Rules

- Verify against source code, not summaries.
- Search for all consumers of changed contracts.
- Search for sibling seams, not only the reported path.
- Treat tests as evidence, not proof of consumer completeness.
- Do not approve if the changed contract's consumers were not swept.
- Do not approve if partial-write or repeated-operation behavior is unknown.

## Final Review Refusal Rule

If the review does not name the changed contract and its consumers, do not assign a passing grade.

If the review cannot state what happens when the changed operation is interrupted or repeated, do not assign a passing grade.
```

## Why This Exists

AI implementers often write plausible local code and miss cross-boundary failures:

- return shape changed, but old consumers still expect the old shape;
- command ordering changed, but command ingress or receipt handling still has the old assumption;
- one lifecycle path was fixed, but sibling paths kept the bug;
- a process can be killed after durable write 1 but before durable write 2;
- a second button press, retry, resume, or cancel changes the meaning of the first one;
- tests pass because they cover the happy path, not the seam.

The seam review gate exists to catch these failures before they become production incidents.

The pre-edit seam sweep exists to stop the implementer from creating those failures in the first place. A repo needs both: `RUN_PLAN.md` to force seam reasoning before code is written, and `PR_TOUGH.md` to verify that reasoning after code exists.
