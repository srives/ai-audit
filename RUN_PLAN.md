# RUN_PLAN.md

A universal execution-control prompt for AI coding sessions. The plan tells the AI **what** to build. This document tells it **how** to execute without drifting across architectural boundaries, breaking canonical data, producing code that looks locally correct but corrodes the system, or shipping a PR that only looks green because the wrong tests ran.

This is an execution-control prompt, not a creativity prompt.

Synthesized from production run plans across PowerShell orchestration (EngineerForge / Fork), ASP.NET + MongoDB services (Stratus), WPF desktop apps (Workstation, Monitor, Tooling), C++ experiments (WinTCar), and static web (AIManifesto). Platform-specific guidance lives in the dedicated sections at the bottom; everything above the dividing line applies to all work.

---

## 0. Core Rule

Read `AGENTS.md` and `CLAUDE.md` first. They are local law. If anything in a plan, in this document, or in conversation conflicts with them, AGENTS.md / CLAUDE.md wins.

Then read PR_TOUGH.md (or your repo's equivalent) so you know the defect classes you will be graded against.

Then read the plan precisely. Do not skip parts. Do not silently narrow scope. Do not reorder for convenience.

Do not commit, push, amend, rebase, reset, checkout, or force-anything without explicit user permission.

---

## 1. Plan Obedience Rule

When the operator gives you a plan, the plan controls the work.

- Do not change scope because some items look harder, easier, slower, or less interesting.
- Do not reorder the plan for convenience or preference.
- You may change order only when later work is a real prerequisite for an earlier planned item, and you must say so explicitly.
- You must do the whole plan: all phases, all sub-plans, all sections, and all named work unless the operator explicitly narrows scope.
- You are not allowed to "bank progress" by doing the easy parts and leaving the hard parts for later while still presenting the plan as substantially done.
- You are not allowed to silently cut work because it feels too hard, too big, too risky, or too tedious. If something truly cannot be done, report it as a blocker against the plan; do not redefine the plan.

If the user asks a question, answer it. If the user asks whether updates are needed, inspect the evidence and make the justified updates rather than stopping at analysis.

---

## 2. Architectural Integrity Rules

These apply to all code -- features, bug fixes, refactors, tests, helpers, scripts. Do not write code that looks locally correct but violates the existing architecture. Small violations compound into permanent maintenance drag.

### 2.1. Surface assumptions and ask before choosing risky interpretations.
Do not silently pick one interpretation when the task can reasonably mean more than one thing. State the ambiguity, name the assumption you would make, and ask when the wrong choice would change architecture, data shape, security, customer-visible behavior, or test strategy. Push back when a plan does not make sense instead of executing a bad plan confidently.

### 2.2. Use the existing seam before creating a new one.
Search for existing controllers, services, repositories, helpers, DTOs, builders, mappers, validators, view-models, commands, and test fixtures before adding anything new. If an existing helper owns the concept, reuse or extend it surgically. Do not create a parallel helper, route, service method, DTO, or test builder that does substantially the same job.

### 2.3. Make surgical changes.
Change the smallest set of files and methods required to satisfy the requested behavior. Do not widen into unrelated cleanup, broad refactors, new abstractions, or renamed flows unless they are required for correctness. If the correct fix needs broader work, say that explicitly before expanding scope.

### 2.4. Minimum viable code is the quality bar.
If 50 clear lines do the job, do not ship 200 lines of speculative flexibility. A senior reviewer should be able to see why each changed line is needed for the task. No speculative features, single-use abstractions, or "future flexibility" unless the current task genuinely requires it.

### 2.5. Preserve layer boundaries.
Each project has a documented architecture (controller/service/repo, MVVM, session/UI, etc.). Do not move higher-layer logic into lower layers because it is convenient for one endpoint. Do not introduce parallel algorithms, DTOs, routes, or helper paths for behavior already owned elsewhere.

### 2.6. Forward-only architecture.
Prefer deletion over migration ballast. Do not preserve backward compatibility, emit dual field names "just in case," or add fallback chains for old data formats unless the plan explicitly requires a temporary bridge and names when it can be removed. One field, one name, one location.

### 2.7. Refactors are not done when both paths still ship.
Adding the new path is only the first half. The old path must be removed from runtime, or the work remains incomplete. Before declaring a refactor done, search for the retired names. If they still participate in live runtime behavior, the refactor is not done. List old stores, helpers, fields, runtime paths, tests, docs, and maintenance scripts as an excision inventory before coding.

### 2.8. Preserve full object shape on mutations.
Do not rebuild a subset of fields when updating a record. Stripping identity, discriminators, or metadata silently corrupts downstream consumers. Read, mutate, write -- never read, rebuild-partial, write.

### 2.9. Do not hide architecture drift behind compatibility code.
Do not emit duplicate fields, preserve old/new runtime paths, or add fallback chains "just in case." Compatibility must still preserve one business authority for the value being changed.

### 2.10. Comment changed behavior, not obvious syntax.
New public, internal, or non-trivial private functions should have concise comments when behavior, assumptions, units, or limits are not obvious from the name. If you change a function that already has a comment, update it. Do not add noise comments that merely restate code. Do not delete comments unless they are wrong, obsolete because of the current change, or actively misleading.

### 2.11. Trust canonical paths; do not invent shadow authorities.
Read canonical fields directly. Do not write `$x = $obj.newField; if (!$x) { $x = $obj.oldField }` as defensive programming -- that fallback keeps the old field alive as a shadow authority. Do not let projections, caches, or aggregate files become quiet authority over the canonical record.

### 2.12. Preserve helper-first persistence in tests.
Tests are part of the product contract. They must use the same persistence helpers as production code unless the test is explicitly proving malformed low-level input. A test that uses direct file I/O for canonical data normalizes helper bypasses.

### 2.13. Truthful function naming.
If you change an async function so it no longer does asynchronous work, remove the `async`/`await`, change the return type if needed, and rename it to remove the misleading `Async` suffix. Keep method names truthful.

### 2.14. Remove genuinely-unused parameters and imports only after verification.
On files you touch, remove truly unused parameters and unused `using`/`import` directives when it is safe. Verify they are genuinely unused first: interface contracts, overrides, partials, generated usage, conditional compilation, reflection, framework attributes (e.g., `[FeatureClaim]`), and file-scoped type references.

### 2.15. List unrelated improvements instead of making them.
If you notice code that should be cleaned up but it is not required for the current task, do not edit it as a side effect. Put it in the report as follow-up.

### 2.16. Do not touch code you do not understand.
Read it first or leave it alone. "It looked wrong" is not a fix justification.

---

## 3. The Phases

### Phase 0 -- Preflight (No Code Changes)

#### 0.0. Write the constraint extraction artifact (architectural work only).

For architectural work, plan execution, RUN_PLAN runs, design-doc changes, or authority changes: extract every constraint, gate, and non-negotiable requirement into a per-plan file. Name it `<plan-basename>.constraints.md` beside the plan, or `.constraint-extraction.md` if the user requested that convention. Cover: requested outcome, scope, non-goals, mandatory constraints, owners, seams, authority classifications, stop conditions, and risks. State the artifact path before proceeding. Do not write code until the user confirms constraints are reviewed and approved.

If the user explicitly requests preflight-only, stop after this artifact. Otherwise, continue into the rest of Phase 0.

#### 0.1. Restate the task precisely.
- Requested outcome
- Scope (which projects, layers, namespaces, files)
- Non-goals
- Assumptions
- Ambiguities -- name the assumption you would otherwise make; ask before coding if the wrong assumption would alter architecture, data shape, security, customer-visible behavior, or test strategy

#### 0.2. Read actual code, not summaries.
- Read every file the plan names.
- Walk the real caller path end to end.
- If the code no longer matches the plan, say so before coding. Plans go stale.

#### 0.3. Identify the owner and seam.
- Name the canonical controller/service/component/helper/namespace that owns the behavior.
- Name the public seam you should use instead of reaching across boundaries.
- Search before writing. If a helper already exists, use it.
- If the plan implies a new route, service method, DTO, helper, or algorithm, prove that an existing seam cannot be reused before creating it.

#### 0.4. Identify the blast radius.
- For every function you will modify, list every caller.
- If a contract changes -- parameters, return shape, exceptions, fields written, behavior -- every caller is in scope for validation even if the plan did not mention them.
- Check both sides of language boundaries (C# callers ↔ JS callers, PowerShell ↔ external tools, etc.).

#### 0.5. Identify the data and side effects involved.
- Which canonical records, collections, or stores are read or written.
- Which discriminators, scopes, or ownership keys gate the behavior.
- Which units are involved (and where the conversion boundary is).
- Which exports, queues, signals, notifications, attachments, or external tool contracts are affected.
- Which feature/authorization attributes (e.g., `[FeatureClaim]`, role checks) gate the path.
- Which projections include every downstream-required field.

#### 0.6. Identify the test surface.
- Find existing tests under the nearest test project that cover the touched behavior.
- If no test exists for new behavior or a new guardrail, plan to add one.
- If an existing test asserts old behavior the change intentionally replaces, plan to update it.
- Before adding a test, state the story being proved and the seam that owns it. If that seam is private-only, redesign before coding.
- Prefer testing through public/service seams. Use `internal` + `InternalsVisibleTo` (or the equivalent visibility seam) instead of reflection for narrow internal checks. Do not invoke private methods by reflection.
- Keep tests small. If a test grows because setup dominates the assertion, extract a focused builder/sample helper.

#### 0.7. Classify every touched file by authority.

For each file the change reads or writes, classify it:

| Class | Meaning | Examples |
|---|---|---|
| **Canonical** | Source of truth. Must be written first. | `sessions/<id>/session.json`, MongoDB primary collections, project files. |
| **Authoritative mutable history** | Append-only journal owning transition truth. | `transitions.jsonl`, audit logs. |
| **Materialized snapshot** | Rebuildable projection of canonical + history. | `workflow.json`, grid snapshots. |
| **Optional projection / cache** | Disposable, rebuildable. Never a row source. | Cache files, aggregate dashboards. |
| **Presentation** | Re-renderable, derived. | Generated PNGs, WT profiles, rendered HTML. |
| **Evidence** | Read-only worker output. | `runs/*/stdout.txt`, `result.json`, screenshots. |
| **Ingress / transport** | Command receipts, signals. | `commands/incoming/*.json`. |
| **Coordination** | Locks, leases, fencing tokens. | `locks/*.lock`. |
| **Independent** | User preferences, not session state. | `menu-prefs.json`, theme config. |

Then identify the identity fields involved and which are mutable presentation versus immutable contract.

#### 0.8. Build a risk map.
- Route / action / verb / parameter mismatches.
- DTO / view-model / data-shape drift.
- Missing projection fields.
- Null-path runtime failures (especially geometry, collection access, optional fields).
- Dangerous silent fallbacks (zero vectors, empty defaults, empty-string coalescence).
- Wrong discriminator / wrong scope / wrong authorization enforcement.
- Silent divergence between UI value, stored value, and exported value.
- Queue / send / print / export side effects.
- Exception mapping (does the controller catch what the service actually throws?).
- Per-item adjustments applied to aggregates or vice versa.
- Cutover boundary: is hybrid old/new runtime possible? If yes, redesign unless the plan explicitly proves hybrid mode is safe.

#### 0.9. Build the residue inventory (refactors and rewrites only).
- List every old store, cache, helper, alias field, runtime entrypoint, test, doc, and maintenance path that exists only because the old design still exists.
- For each: delete now, replace now, quarantine temporarily, or not in scope.
- Default to "delete now" unless quarantine outside active runtime is strictly required.

#### 0.10. Drift search.
Before coding, grep the tree for the drift patterns specific to this repo (alias fields, hand-rolled helpers, prohibited cross-namespace calls, deprecated APIs). Confirm your planned changes do not reintroduce any flagged pattern. If your change touches files that already contain flagged patterns, note them as pre-existing and do not make them worse.

#### 0.11. State the execution order.
List the changes in order. Name the file, method, and layer for each. Identify the minimum viable code path; if the plan looks overbuilt, say so before implementing.

If the operator explicitly asked for a preflight-only pass, stop here. Otherwise continue.

---

### Phase 1 -- Implement (One Bounded Change At A Time)

Before each edit:
- Re-read the function or seam.
- Re-read its callers if behavior or contract changes.
- Re-read the covering tests.

While editing:
- Change the minimum necessary for this item.
- Preserve layer boundaries.
- Match existing patterns in the file before introducing new conventions.
- Reuse existing helpers and seams before adding new ones.
- Convert units at boundaries, not inline.
- Preserve full object shape on mutations.
- Update function comments to match new behavior.
- Add concise comments for new non-trivial functions when behavior, assumptions, units, or limits would otherwise be implicit.
- Write to canonical first, then optional projection, then presentation. Never reverse direction.
- Never treat a projection/cache as authoritative input to a mutation decision.
- If the task is a refactor, remove the replaced runtime path in the same task unless the plan explicitly authorizes a temporary bridge and proves it is safe.
- Run lint / formatter / type-check on changed files immediately after writing, before moving to the next item. A lint failure now is cheaper than a hook failure or a reviewer comment.

After each item:
- State what changed, in what file and method, and the behavioral difference.
- Name callers checked or updated.
- If a canonical write path changed, confirm full document shape and discriminators are preserved.
- Do not move to the next item until this one is internally consistent and lint-clean.

---

### Phase 2 -- Validate

#### 2.1. Select a validation lane before running anything.
- `lint` -- static source checks only.
- `smoke` -- lint plus the smallest mapped behavioral bundle.
- `focused` -- affected behavioral bundles for the touched boundary.
- `release` -- full validation, build, long tests, installer/release checks.

Pick the smallest lane that proves the changed behavior. Broaden when the blast radius is larger.

#### 2.2. Run fast structural validation first.
Static checks (lint, parsers, type-checkers) catch architectural violations in seconds. Run these before behavioral tests.

#### 2.3. Run the narrowest relevant behavioral tests next.
Start with the specific narrow bundle closest to the changed behavior. Prefer fail-fast / delta / warm-runner modes for repeated narrow checks. Use broad bundles only for broad refactors, authority changes, release work, or explicit operator request.

#### 2.4. Run the affected build, scoped when possible.
Solution-wide build only when the blast radius justifies it.

#### 2.5. Re-check callers and side effects.
Grep for every modified function. Confirm callers are still correct, routes match, response shapes match, and side effects (queue, send, print, export, signal) still fire when expected.

#### 2.6. Re-check data coherence.
If any canonical document shape was touched:
- Write path preserves all existing fields.
- Discriminators are never omitted or defaulted incorrectly.
- Unit-bearing fields have correct values in correct units.
- Export paths still produce correct output.
- Delete-and-rebuild any optional projection produces the same visible state.

#### 2.7. State manual validation truthfully.
If the behavior crosses live browser interaction, hardware control, external machine import, environment-dependent boundaries, or anything that cannot be reproduced in CI, state exactly what was and was not validated manually. Do not claim UI behavior was visually verified unless it was actually run and observed.

---

### Phase 3 -- Self-Review (PR_TOUGH Mindset)

Before declaring done, review like a hostile PR reviewer. Walk these defect classes in order:

1. **Authority direction.** Did you write to a projection or presentation artifact before writing to the canonical record? Did any path treat cache/projection data as the source of truth?
2. **Boundary and namespace drift.** Did business logic land in a controller, view, or UI file? Did UI logic land in a session/service file? Did you hand-roll a helper that already exists?
3. **Identity and ownership.** Did you treat any mutable field as identity? Did you write any identity field without validation?
4. **Cache and projection disposability.** If you deleted any optional projection right now, would rebuilding restore the correct visible state?
5. **Data shape and units.** Mixed units without conversion at the boundary? Raw field used where converted needed? UI vs stored vs export divergence? Per-item adjustment applied to aggregate?
6. **Discriminator and scoping.** Wrong type/scope/feature-claim enforcement? Missing ownership check?
7. **Null paths and silent fallbacks.** Geometry on zero-length vectors? `.First()` on empty? `.Location` on null? Fallback that produces silently wrong results instead of an error?
8. **Pipeline and error propagation.** Can a terminating error escape from a pipeline segment? Did any catch path introduce a secondary failure? Any undisposed stream or handle?
9. **Silent behavior.** `continue` / `skip` with no warning to the user? `.Where()` filter silently dropping items the user expects?
10. **Exception mapping.** Does the controller / orchestrator catch what the service actually throws? Does ArgumentException fall through to 500?
11. **Test gaps.** New behavior without a test? Only single-item happy path? Tests rewritten to rubber-stamp rather than assert the contract?
12. **Refactor completion.** Did you add a new path but leave the old path active? Tests/docs still defending the old architecture?
13. **Comment / docstring truthfulness.** Do docs claim cleanup is finished when the code still violates the boundary?

If you find a real problem in self-review that is in scope and low-risk, fix it before reporting. Otherwise call it out explicitly.

Rate the diff on a 1-5 architectural drift scale:
1. Actively makes architecture worse.
2. Preserves old failure modes.
3. Neutral or mixed.
4. Respects intended boundaries.
5. Actively moves toward target architecture.

---

## 4. Stop Conditions

Stop and surface the issue instead of improvising if:
- The plan no longer matches the code in a material way.
- The correct owner or seam is unclear.
- The change requires guessing about identity, ownership, unit conventions, or external tool contracts.
- The only path forward is destructive cleanup on weak evidence.
- Validation cannot establish that the change is safe.
- The requested change conflicts with AGENTS.md / CLAUDE.md.
- The only way to finish a refactor is to leave old and new runtime paths both active and pretend that is complete.

When blocked, explain the minimum missing fact or decision. Do not hide uncertainty behind confident wording.

---

## 5. Completion Report

When done, provide:

1. **Understanding** -- outcome, scope, non-goals, assumptions.
2. **Preflight findings** -- owner/seam, files, callers, authority classifications, identity fields, residue inventory, risks.
3. **Execution notes** -- what changed, deviations from plan (only for real prerequisite ordering or operator-scope changes, not convenience triage), callers verified, what old path was removed, what old path remains and why.
4. **Validation** -- exact tests/commands run, build status, manual validation performed, projection disposability verified when applicable, what remains unvalidated.
5. **Residual risks** -- only real remaining risks, not generic caution text.
6. **Closeout** -- whether the work is done, whether follow-up is needed, whether the work is ready for review.

Do not commit. Wait for explicit instruction.

---

## 6. Long Session Discipline

Long AI sessions fill context windows and lose track of earlier decisions, code changes, and test results.

1. **Numbered handoff files as context fills.** Write `1.md`, `2.md`, `3.md` (or `progress_<name>.md` in the memory directory) capturing: current test state, what was done since the last handoff, what is still remaining, files modified, decisions a future context needs to know.
2. **Local commits at handoff points (with user approval).** Use descriptive commit messages that summarize the work batch.
3. **Reference earlier handoff files when needed.** Re-read instead of guessing from memory.
4. **Do not let context pressure cause shortcuts.** If context is full, checkpoint and continue -- do not silently downgrade remaining work, defer hard items to "help me" files, or stop validating.
5. **After context compression, re-ground from sources.** Re-read AGENTS.md, CLAUDE.md, this file, the active plan, and current files before continuing. Do not execute a plan from memory alone after compression.

---

## 7. Common AI Failure Modes To Watch For

These are the repeatable ways AI sessions executing plans fail. Every phase above exists to block one or more of these.

1. The plan is stale and the AI patches the wrong seam.
2. The plan names the function but not the callers, so the blast radius is missed.
3. The AI creates a new helper instead of using the one that already exists.
4. The AI mutates a record by rebuilding a subset of fields and strips identity or metadata.
5. The AI updates the code but not the tests, or rewrites tests to rubber-stamp the new behavior.
6. The AI fixes the symptom but not the root cause.
7. The AI says "done" without proving the change -- no targeted tests, no build, no caller verification.
8. The AI counts "new path added" as completion while old runtime paths still ship.
9. The AI writes to cache/projection without updating the canonical record, creating authority drift.
10. The AI treats presentation state (display names, WT profile, file paths) as durable business authority.
11. The AI mixes units (feet/inches, ms/s, raw/encoded) without converting at boundaries.
12. The AI catches generic Exception and maps everything to 500.
13. The AI silently skips items with `continue` instead of warning the user.
14. The AI uses `.count` instead of `.length`, or `==` instead of `===`.
15. The AI calls geometry methods on zero-length vectors and gets silently wrong results.
16. The AI tests only the single-item happy path and misses multi-item, null, and error scenarios.
17. The AI hides uncertainty behind confident wording instead of surfacing blockers.
18. The AI runs broad validation bundles by habit after every tiny edit, drowning real failures in PASS noise.
19. The AI moves mutation into startup or projection paths because it is convenient.
20. The AI fakes a canonical identity (native session ID, UUID, fingerprint) when the real one is not yet available, instead of leaving the field empty and gating dependent actions.

---

## 8. Reusable Templates

### 8.1. Full Execution Prompt

```text
You are executing an implementation plan in the [REPO_NAME] repo.
Read AGENTS.md and CLAUDE.md first. They are law and override anything in
the plan that conflicts with them. Then read PR_TOUGH.md (or equivalent)
for the architectural enforcement framework. Then read the plan file:
[PLAN_FILE_PATH]. For [DOMAIN] work, also read [RELEVANT_DESIGN_DOCS].

The operator's plan controls the work. Do not change scope, skip
sections, or reorder the plan because some parts look easier or harder.
You may change order only when later work is a true prerequisite for
earlier planned work, and you must say so explicitly. Do the whole plan
unless the operator explicitly narrows scope.

Your job is to make the smallest correct change that:
- matches the current codebase, not just the plan
- preserves [LAYER_BOUNDARIES e.g. controller/service/repo]
- preserves [SCOPING e.g. company/project/tenant]
- preserves [CANONICAL_RECORD_SHAPE]
- keeps UI value, stored value, and exported value coherent
- converts units at boundaries, not inline
- lands with proof through the right tests and builds

Complete Phase 0 preflight before coding. Do not pause after preflight
unless the operator explicitly asked for a preflight-only pass.

Implement one bounded change at a time. After each change, run
lint/parser checks on touched files before moving on.

Validate with the narrowest behavioral tests first, then scoped build,
then solution build only if blast radius justifies it. State manual
validation truthfully -- do not claim UI behavior was visually verified
unless it was actually run and observed.

Self-review against the PR_TOUGH defect classes. If you find a real
problem in self-review and it is in scope and low-risk, fix it before
reporting. Otherwise call it out explicitly.

Report Understanding, Preflight findings, Execution notes, Validation,
Residual risks, and Closeout. Do not commit without explicit permission.
```

### 8.2. Short Prompt

```text
Execute the implementation plan in [PLAN_FILE_PATH] with aggressive
engineering rigor. Read AGENTS.md, CLAUDE.md, PR_TOUGH.md, and
RUN_PLAN.md first. The operator's plan controls scope and order: do
not cut sections, do not skip hard parts, do not reorder for
convenience. For architectural work, write a constraint extraction
artifact before coding. Before writing any code, restate outcome, scope,
non-goals, assumptions, owning component, callers, tests, canonical
fields, unit conventions, export formats, discriminators, projections,
authorization, side effects, and risks. Read the actual files the plan
names and confirm the plan still matches the code. Search before
writing. Reuse existing helpers and seams. Make surgical changes only.
Implement one bounded change at a time. Verify callers after contract
changes. Run targeted tests, then scoped build. Self-review against
PR_TOUGH defect classes. Report honestly. Do not commit without
explicit permission.
```

### 8.3. Task Template

```text
Task: <one-sentence requested outcome>
Plan file: [PLAN_FILE_PATH]

Read AGENTS.md, CLAUDE.md, PR_TOUGH.md, and RUN_PLAN.md first.

Before coding, produce:
1. Constraint artifact (architectural work only)
2. Understanding -- outcome, scope, non-goals, assumptions
3. Preflight -- files read, owner/seam, callers, authority
   classifications, identity fields, residue inventory, tests, risks
4. Execution order -- steps, acceptance criteria, validation plan

Then implement conservatively. Report what changed, callers verified,
tests run, build status, manual validation, residual risks.
```

### 8.4. Unplanned Work

This document works without a plan file. For bug fixes, one-off tasks, or any work without a formal plan, substitute the bug or task description for `[PLAN_FILE_PATH]` and skip "confirm plan matches code." Everything else applies. Preflight still forces you to find the owner, callers, blast radius, tests, and data shape before coding. Implementation, validation, and self-review are identical.

---

## 9. Engineering Rigor Checklist

Use this to judge whether a run plan is strong enough before handing it to an AI.

| Discipline | Strong | Weak |
|---|---|---|
| **Objective** | States what must change and what must not. Defines acceptance criteria. | Mixes bug fix, refactor, and feature into one blur. |
| **Preflight** | AI reads actual files first. Assumes the plan may be stale. Forces caller and test discovery. | Lets the AI code from the plan document without checking the repo. |
| **Architecture** | Names owning component. Enforces helper-first reuse. | Says "update whatever is needed." Tolerates direct mutation from arbitrary files. |
| **Authority** | Classifies every touched file. Write direction explicit. Projection disposability verified. | Treats cache as authoritative. Writes projection before canonical. |
| **Refactor completion** | Inventories old path. Requires deletion or explicit quarantine. Grep-clean validation. | Celebrates the new path while the old still ships. |
| **Data / Units** | Names canonical fields and units. Treats UI-vs-export divergence as a defect. | Assumes uniform units. Mutates documents without preserving fields. |
| **Discriminators** | Names which types/scopes are in scope. Tests isolation. | Adds behavior to shared paths without checking discriminator. |
| **Safety** | Maps service exceptions to correct HTTP codes. No empty catches. Strong ownership evidence before destructive action. | Catches generic Exception. Skips items silently. Auto-heals by deleting. |
| **Validation** | Selects a lane. Targeted then scoped. Tests error and multi-item paths. | "Run tests" without naming what proves correctness. Runs broad bundles by habit. |
| **Reporting** | Concrete, falsifiable. Records what was validated and what was not. | Reports success without evidence. Hides uncertainty. |

---

---

# Platform-Specific Addenda

The rules above are universal. The rules below apply only when the work touches the named platform, language, or domain. Read the addendum for every domain your change touches.

---

## A. WPF / .NET Desktop (single-file or MVVM apps)

Applies to: WPF overlays (`monitor.cs`), WPF MVVM apps (Workstation, Print, Tooling), any WPF surface that mutates settings or talks to hardware.

### A.1. MVVM layer discipline

- **Views** (`.xaml` + `.xaml.cs`): layout, event wiring, visual state only. No business logic. No direct settings writes. No machine or external-tool commands.
- **ViewModels** (`Models/*VM.cs`): expose properties and commands for binding. Read shared state via the live accessor (e.g., `((App)Application.Current).Settings`), never via a cached static field. Raise `PropertyChanged` for every bindable property that changes.
- **Commands** (`Commands/*.cs`): implement `ICommand`. Delegate to services for I/O and to the VM for UI state. Keep `CanExecute`, visibility, images, and labels aligned with the action that will actually run.
- **Services**: own external I/O (hardware, network, file system). All slow or blocking work runs in `Task.Run`. Never block the WPF dispatcher.
- **Helpers**: pure or near-pure computation. No direct UI or settings access unless explicitly needed.

### A.2. Settings access -- never cache as static

```csharp
// WRONG -- snapshot taken once, stale forever:
private static Settings _settings = _app.Settings;

// CORRECT -- always reads current:
private static Settings Settings => ((App)Application.Current).Settings;
```

When adding a bound property, add `OnPropertyChanged` where the UI must refresh.

### A.3. Settings persistence -- atomic

```csharp
// NEVER: delete then write (data loss if crash between the two)
File.Delete(path);
File.WriteAllText(path, json);

// CORRECT: temp-file then atomic replace
var tmp = path + ".tmp";
File.WriteAllText(tmp, json);
File.Replace(tmp, path, path + ".bak");
```

Use UTF-8 without BOM (`new UTF8Encoding(encoderShouldEmitUTF8Identifier: false)`).

### A.4. ObservableCollection -- UI thread only

All mutations to bound `ObservableCollection`s happen on the WPF dispatcher thread:

```csharp
_dispatcher.Invoke(() => CutItems.Add(cutItem));
```

Or use `BindingOperations.EnableCollectionSynchronization` once at startup.

### A.5. Render-loop safety

Every operation that runs an external process (`powershell.exe`, machine I/O, large file reads) must be wrapped in `Task.Run`. Inline blocking calls freeze the WPF render loop. Capture the result into a UI-thread-visible field and let the next polling cycle refresh.

Bound external processes with timeouts. Sound effects on button press are fine but must use `SoundPlayer` (already async on Windows).

### A.6. `async void` -- top-level catch required

Every `async void` method (event handlers, command Execute implementations) must have a top-level try/catch that routes to a documented error sink. Uncaught exceptions in `async void` terminate the process.

### A.7. No empty catches

```csharp
// WRONG:
catch { }
catch (Exception) { }

// CORRECT: at minimum log; for hardware paths surface to the operator
catch (Exception ex)
{
    _logger.LogError(ex, "Descriptive context: {Detail}", relevantValue);
}
```

### A.8. UI / layout discipline (overlay-style single-file apps)

- Preserve floating overlay text on a black background.
- Keep label/value color separation.
- Keep close button on the top-most output row, right side.
- Keep action buttons centered under the measured output text block.
- Do not introduce dialog boxes or card-like panels for the main output. Confirmations for destructive buttons are the exception (see A.10).
- Vector glyph rendering stays. Do not replace with WPF `TextBlock` without explicit user approval.
- Engine-circle / status-indicator visuals must redraw cheaply enough to run every frame.

### A.9. Time handling

- Display absolute times in local machine time using `value.ToLocalTime()`.
- Treat offset-less timestamps as UTC store values via `.ToUniversalTime()` parsing.
- Format relative ages as lowercase, spaced text: `45s ago`, `8m ago`, `2h 25m ago`, `2d 3h ago`.
- Do not clamp future timestamps to `0s ago`; surface as `in <duration>`.
- Use `DateTimeOffset.UtcNow` for all "now" values; never `DateTime.Now`.

### A.10. Destructive action confirmation

The destructive button (Nuke, Reset, Delete-All) must require operator confirmation before firing. Two acceptable patterns:

- **Two-step inline flow:** First click flips the button row to a confirmation state (e.g., "Confirm Nuke" + "Cancel"). Second click fires.
- **Modal confirmation:** `MessageBox.Show` with `MessageBoxButton.YesNo` and clear destructive text.

A single-click destructive button is a critical PR review violation.

### A.11. Command parity rule (sidecar/operator surfaces)

If the WPF app is a sidecar to a larger system (Monitor → orchestration engine, Workstation → cloud backend), every command it submits must use a command name the engine actually has. Do not invent commands. Grep the engine's command surface to confirm.

---

## B. WiX / MSI Installer & Release Pipeline

Applies to: WorkstationMsi, PrintMsi, any WiX 3.1.x installer, GitHub Actions release workflows.

### B.1. Build via build.cmd, not msbuild directly

```powershell
cd WorkstationMsi && build.cmd Release
cd WorkstationMsi && build.cmd Release -v 2026.05.13.0001
```

Calling `msbuild` directly on WiX 3.1.1 projects breaks compatibility.

### B.2. Mirror sibling installers

Workstation and Print installer behavior should mirror each other unless there is a documented reason. Self-contained publish, WiX harvest filters, signing, and timestamping must be checked together.

### B.3. Version flow is end-to-end

Version must flow consistently through EXE, MSI, WinGet manifest, GitHub tag, and release branch. Do not hardcode release versions in app or installer files unless the user explicitly asks for a temporary emergency override.

### B.4. Pipeline inputs are caller-owned

Reusable workflow inputs should be resolved by the caller. Caller workflows own manual or generated version selection; shared workflows consume one already-resolved value. If a workflow is called by a scheduler or another workflow, update the caller inputs too.

Validate YAML changes by reading all call paths, not only the edited file. For installer/signing/version work, inspect the produced EXE/MSI metadata instead of trusting build success alone.

---

## C. Physical Hardware Control (Shop Floor / Robotics)

Applies to: Workstation app and any code that drives TigerStop, RazorGage, Lockformer, Crippa, or any cutting/bending/welding/moving machine.

**These rules describe safety boundaries, not style preferences. Violations are not UI bugs -- they are shop floor safety risks.**

### C.1. Never mark an item moved/done unless movement actually succeeded.

A workflow flag is not proof of movement. Success-returning workflow methods are not proof of physical movement. Do not enter the cut/done/auto-cycle path when movement failed.

### C.2. A failed pre-cycle check must abort the cycle.

If `CheckForRetractErrorPreCut(...)` (or equivalent safety pre-check) returns true, stop. Do not call the cycle command. Do not mark the item done. Clear execution/cycling flags and return.

### C.3. Auto-cycle capability must be proven by hardware, not just settings.

A user-level setting (e.g., `EnableAutomatedToolCycling`) may be the operator's request. It is not hardware capability proof. Check hardware interconnect for non-RazorGage machines.

### C.4. The stop signal must be `volatile`.

Loop-exit signals checked in tight background loops must be `volatile`. Non-volatile bool writes are not guaranteed visible across CPU cores. If you add a new shared bool used as a loop-exit signal, mark it `volatile`.

### C.5. Validate manual positioning targets before sending.

Reject NaN, negative values, and values exceeding maximum tool length before the machine moves.

### C.6. Crippa / bend-math discipline (Stratus + Workstation)

- Preview and export must agree on which bend data is being used. Recalculate the route; do not fake it in the drawing layer.
- Reverse means machine/export direction reversal. Recalculate the YBCR/polar route; do not fake it in the drawing layer.
- Radius, thickness, and size overrides must come from the agreed Crippa tooling/material authority.
- Do not mix machine radius (Material.xml CLR, ~8.281") and fitting radius (Revit, ~19.45") in the same computation.
- Do not set `CartesianRows` on reversed `BendInstructionSet` from vertex data -- apex vertices produce worse output than bend-row math.
- Do not weaken existing geometric guards in `TryBuildTwoBendParallelOffsetRows` or its equivalents. Each guard blocks a geometry case the formula cannot handle.
- Do not widen narrow-case formulas (2-bend parallel offset) to cover 3+ bend or 3D routing without a separate analysis.
- File names must stay deterministic, sanitized, and inside the Crippa path-length limits.
- Delete only the intended batch/output directories. Log delete attempts and failures.
- Do not mutate stored Stratus bend instructions unless the ticket explicitly requires it.

### C.7. Geometric null-path guards

- Geometry methods on zero-length vectors return silently wrong results, not errors. `IsParallelTo` on `Vector3D.Zero` returns false. `GetNormalizedVector` on zero-length returns (1,0,0). Guard before calling.
- `.Location`, `.Direction`, `.Width`, `.Height`, `.Points` on null connector/part will throw at runtime. Guard.
- `.First()` or `[0]` on empty collection will throw. Guard or use `.FirstOrDefault()` with explicit null handling.

---

## D. ASP.NET / C# Web Services with MongoDB

Applies to: Stratus, Gtpx.Cloud.* projects, controller/service/repository stacks with Mongo persistence.

### D.1. Layer boundaries are strict

- Controllers handle HTTP shape, authorization attributes, model binding, response mapping, and delegation only.
- Business rules belong in services.
- Mongo / query / persistence details belong in repositories.
- Do not move service-layer logic into controllers because it is convenient for one endpoint.

### D.2. FeatureClaim authorization is part of the contract

The query parameter named in `[FeatureClaim]` is part of authorization, even when the action body does not otherwise use it. Do not remove those parameters as "unused"; keep the existing pragma/comment pattern. When the authorization value comes from the body instead of the query string, add an explicit ownership/access check before mutating data.

### D.3. Discriminators and scoping

- Name which `CutListType` / `ToolType` / `ModelType` / `PartType` values are in scope.
- Cut list ID must not reach a bend-list code path or vice versa.
- Missing company/project ownership check is a critical defect.
- Use existing route families and discriminator wrappers. Prefer thin route wrappers plus shared service/helper logic over copy-pasting a second implementation.

### D.4. MongoDB document discipline

- Preserve full object shape when updating Mongo-backed records. Do not rebuild a subset and silently drop fields or discriminators.
- Preserve identity (`_id`), discriminator fields, and nested `Properties` / `CinxProperties` / etc. through the write path.
- Mongo repo projections must include every field needed downstream. Missing projection fields cause null-path failures far from the read.
- Discriminators are never omitted or defaulted incorrectly.

### D.5. Units at boundaries

Stratus convention: feet in model space, inches in cut/bend/export data, `InInches` / `InFeet` field suffixes. Convert at boundaries, not inline. Do not mix feet and inches in the same data structure without explicit field-name suffixes.

### D.6. Exception mapping in controllers

Does `ArgumentException` fall through to 500? Does the controller catch what the service actually throws? Map known service exceptions to 400/403/404 explicitly. Generic `catch (Exception)` in a controller is a defect.

### D.7. Mongo-derived unit-test pattern

When you need regression coverage from a real customer document without a database-backed test:

1. **Capture the smallest real-shaped sample** that reproduces the issue. Trim to fields the code path actually reads. Preserve Mongo-facing names and nesting (`_id`, nested connectors, `Properties`, `CinxProperties`).
2. **Store the sample under the nearest test slice.** One scenario folder per regression: `Gtpx.Cloud.Services.Tests.Unit/CutList/Samples/<Feature>/<ScenarioName>/`. Typical files: `assembly.json`, `parts.json`, optional `metadata.json` or notes.
3. **Add a shared loader/builder** in the test project. The loader translates raw sample JSON into domain objects. Tests call `Load...Sample("<ScenarioName>")` instead of repeating JSON parsing or hand-building large object graphs.
4. **Assert at the real logic boundary.** Service logic bug → call the service directly. Export bug → build the stored export payload directly. Repository bug → only then consider an integration-style test.

### D.8. Test seam discipline

- Do not add reflection-based tests just to reach private methods.
- Prefer testing through public/service seams.
- For narrow internal coverage, prefer `internal` + `InternalsVisibleTo` over widening the public API "for tests."
- Keep tests small. If setup dominates the assertion, extract a focused builder/sample helper.
- Preserve the one-file-per-class convention in tests and test helpers. Test sample/DTO/model types go in a nearby `Models/` folder, not nested in one file.

### D.9. Build commands

```powershell
# Targeted unit tests first
dotnet test Gtpx.Cloud.Services.Tests.Unit/Gtpx.Cloud.Services.Tests.Unit.csproj --filter "FullyQualifiedName~CutListServiceTests" -v minimal

# Scoped build
dotnet build Gtpx.Cloud.Forge.Web/Gtpx.Cloud.Forge.Web.csproj -m:1 /nodeReuse:false -p:UseSharedCompilation=false

# Solution-wide only when blast radius justifies it
dotnet build Stratus.sln
```

---

## E. Vue 2 / Browser JavaScript (legacy Vue + jQuery surfaces)

Applies to: `Gtpx.Cloud.Forge.Web` frontend, Vue 2 components, jQuery-era surfaces.

### E.1. Reactivity

For Vue 2 objects, use `Vue.set` when adding reactive properties after object creation. Newly added properties do not become reactive otherwise.

### E.2. File-download error handling

File downloads must handle blob error responses, not just success blobs. Pattern:
```js
if (typeof data.text === 'function') { /* blob error path */ }
```

### E.3. JavaScript type bugs to watch for

- `.count` instead of `.length` -- silently undefined.
- `==` instead of `===` -- silently coerces.
- Blob vs JSON error handling missing.
- Undefined parameters from Vue event emit not guarded.

### E.4. Frontend validation

```powershell
npx jasmine
# in Gtpx.Cloud.Forge.Web.Jasmine when applicable
```

The build does not lint JS, so review manually for type bugs.

---

## F. PowerShell Orchestration / Session Authority (EngineerForge-style)

Applies to: Fork, EngineerForge, any PowerShell system with canonical session authority, registry-driven platform behavior, and orchestration runtime.

### F.1. Headless session layer

- Files under `src/session/` must not contain `Write-Host`, `Read-Host`, `Read-DialogInput`, `Read-MenuKey`, `Confirm-Destructive`, `Confirm-YesNo`, or `$host.UI.RawUI.ReadKey`.
- All interactive output, prompts, menus, and colored rendering belongs in `src/ui/`.
- If a session function needs to communicate with the user, return data and let `src/ui/` render it.

### F.2. Identity field discipline

- The only identity keys are `sfSessionKey` (primary) and `nativeSessionId` (alternate platform key).
- `sessionId`, `name`, `projectPath`, `wtProfileName`, and `trackedName` are not identity. Do not use them as hash keys, dedup keys, lookup keys, or ownership evidence.
- Do not emit both old and new field names "just in case." One field, one name, one location.
- Do not write fallback chains (`$x = $obj.newField; if (!$x) { $x = $obj.oldField }`) -- they keep the old field alive as a shadow authority.

### F.3. WT presentation is not authority

- `wtProfileName` must not appear in canonical `session.json` records or as a parameter on `Update-SessionRecord`.
- `byWTProfile` is a derived convenience index only. It must not be used as session-ownership evidence, lookup authority, or source inference input.
- Platform source must come from the canonical `source` field, never from WT profile name prefixes or WT presence.
- WT, background, cache, mapping, and compatibility artifacts are never native-ID recovery evidence.

### F.4. Write direction

- Write to `session.json` first, then refresh optional projections, then refresh presentation. Never write a projection first.
- Never treat optional projection/cache data as authoritative input to a mutation decision.
- A named launch creates canonical session identity (`sfSessionKey` and `session.json`) immediately, even before the platform exposes a native session ID. Do not fake a native session ID; leave `nativeSessionId` empty until uniqueness-proven backfill.

### F.5. Startup / refresh boundary

| Mode | Rules |
|---|---|
| **Startup** | Authority-read, offline, fast. Read non-deleted canonical `session.json`. Build projections. NO live discovery, NO lifecycle writes, NO repair. Must complete from local authority reads only. |
| **Post-launch return** | Reread the just-written canonical `session.json`. Do NOT trigger full live discovery. Do not invent a third in-memory authority. |
| **Refresh** | Run `Sync-SessionAuthority`. Re-read canonical `session.json`. Build projections. Refresh never renders discovery output directly. |
| **Maintenance** | Destructive cleanup, orphan removal, retired-store deletion, compaction. Never runs on startup, projection, or ordinary refresh. |

### F.6. Orchestration invariants

If the plan touches `src/integration/orchestration-*`, `src/integration/hooks.ps1`, workflow status/control surfaces, workflow execution state, run artifacts, signals, retries, or approvals:

1. **One supervisor only.** Exactly one runtime path is allowed to mutate canonical workflow state. Hooks, UI actions, approvals, retries, worker completion, and transport ingress must all submit to the same command/supervisor path. External tools (Monitor, dashboards) must submit commands -- they must not hand-edit workflow snapshots.
2. **No old/new hybrid runtime.** Do not let old orchestration tick/reconcile/state paths touch new execution stores. The store cutover must be one-way at the execution boundary.
3. **No snapshot/journal ambiguity.** State which store is authoritative and which is derived. If using both a current-state snapshot and a transition journal, their precedence must be explicit. The snapshot must be rebuildable from the authoritative stores.
4. **No stale worker acceptance without fencing validation.** `runId` alone is not enough. Every worker result/evidence path must be validated against active execution identity, step identity, run identity, and fencing token or lease epoch.
5. **`executionId` is the true execution identity.** Do not use `workflowId`, repo path, or ticket key as the durable execution key.
6. **Freeze the execution definition.** A running workflow must never re-read a mutable external recipe path as authority.
7. **Monotonic revision/order beats wall clock time** for business ordering.
8. **Heartbeats are evidence only.** They must not create a second canonical writer.
9. **Operator sidecars are clients, not supervisors.** If a sidecar needs a new recovery action, add an engine command and have the sidecar call it. Sidecars must use the engine command surface (`Get-SFWorkflowCommandProjection` or equivalent). The sidecar must not invent commands the engine does not have.
10. **Workspace isolation** must be enforced by a real lease/ownership mechanism, not just descriptive fields.
11. **Retry-from-failure creates a new execution** unless the plan explicitly proves in-place retry is safer.

### F.7. PowerShell-specific style

- Preserve PowerShell 5.1 compatibility.
- Keep `Get-*` functions read-only.
- Use atomic persistence helpers for durable writes. Never raw `Set-Content` / `Out-File` on canonical data.
- Use registry-driven platform behavior; do not hardcode platform source inside dispatched platform work.
- Command-line entry parsing must use flag-length constants, named parser helpers, or structured argument handling. `.Substring(19)` is not a contract.
- PowerShell string literals must remain ASCII-only in tests and CI-facing scripts unless the file is explicitly exempt.

### F.8. Validation lanes

- `lint.cmd --changed` immediately after writing code. Fast (under 5s).
- `lint.cmd --staged` before commit.
- `vf.cmd plan` or `src/entry/tools/validation/plan.ps1` to choose commands instead of guessing.
- `vf.cmd run <bundle> --fail-fast --delta` for repeated narrow checks.
- `cmd /c build\Make.bat` when src/ changed.
- Use broad bundles (`core`, `session`, `ui`, `all`) only for broad refactors, authority changes, release work, or explicit operator request.

---

## G. C++ / Native Experimental Tools (CMake + MSVC)

Applies to: WinTCar, any single-purpose C++ experiment driven by CMake and MSVC.

### G.1. Reusability layering

Separate reusable platform-concept code from application-specific code. Concept files (e.g., `WinTerminal/`) are one concept per file. No concept file may know about the application's domain. They take generic inputs (paths, GUIDs, strings, byte buffers) and return generic outputs.

Dependency direction is one-way: app → concepts → lower concepts. The concepts directory never includes anything from the application directory.

### G.2. Phased delivery for experiments

For experimental tools, deliver in phases with explicit completion gates:

1. **Skeleton** -- empty files in the right shape, build green, no behavior.
2. **Platform concepts** -- the reusable layer, with a probe/test mode.
3. **Domain primitives** -- application-specific computation, with a render-only mode.
4. **Loop / integration** -- the full experiment.
5. **Measurement** -- benchmarks and reporting.

Each phase has a completion criterion ("build succeeds and exe runs"; "probe reports the resolved path"; "render-only produces a PNG").

### G.3. Settings-file safety

Surgical text edits inside a confirmed block. Never re-serialize the whole file -- a full JSON parser would lose comments. Validate the file parses before our edit; do not write back if it does not. Atomic write: write to `<path>.<tool>.tmp`, then rename. Back up the original on first run to `<path>.<tool>.bak`.

### G.4. Stop conditions for experimental tools

Stop and surface instead of improvising if:
- The target file fails to parse before our edit.
- The detected identifier (profile GUID, session ID) is not present.
- A backup write fails.
- The system under test does not appear to honor the change at all -- that is the experiment finding, not a bug to work around.

---

## H. Static Web (no build, no server)

Applies to: AIManifesto, static single-page sites with three files (HTML + JS + CSS).

### H.1. Three-file architecture

- `index.html` -- all content, quiz data arrays, HTML structure.
- `app.js` -- runtime logic only.
- `style.css` -- all styling via CSS custom properties.

Do not put content in `app.js` or runtime logic inline in `index.html` (quiz data arrays are the documented exception).

### H.2. Helper-first reuse

- Do not manually create tooltip spans -- the tooltip system generates them automatically from `glossaryTerms`.
- Do not hand-roll tab switching, quiz rendering, or glossary back-links -- use existing helpers in `app.js`.
- Do not duplicate CSS custom properties already defined in `:root`.

### H.3. Zero-dependency rule

Do not add build steps, npm dependencies, or server requirements. This is a zero-dependency static site.

### H.4. Glossary three-step rule

When adding a new term to the glossary, do all three steps:
1. Add to `glossaryTerms` object (drives hover popups).
2. Add a glossary table row with a working `data-anchor` link.
3. Ensure the link target anchor exists in the document body where the term is actually used.

---

## I. Crippa / Bend Geometry Math (cross-platform reference)

See section C.6 for the operational rules. Additional context here for plan authors:

### I.1. Read the existing analysis before changing polar row computation.

For Crippa-related work, re-read the current understanding of the radius/rise problem in `wat-radius-wrong.md` and `pipe-length-stretch-issue-claude2.md` in the Workstation repo before changing geometry code.

### I.2. Key invariants

- `DistanceInInches` from Stratus encodes vertex-to-vertex distances using the Revit fitting radius (~19.45"). The machine uses a different CLR from Material.xml (~8.281"). These must not be mixed.
- `TryBuildPolarRowsFromCartesianRows` is the primary export path when CartesianRows exist and differ meaningfully from bend-row math. It uses fitting tangent-boundary positions from the CartesianList.
- `TryBuildTwoBendParallelOffsetRows` corrects the rise deficit for simple two-bend parallel offsets by solving for the middle feed needed to preserve both total developed length and target rise with the machine radius.
- The `ShouldPreferCartesianPolarRows` gate (0.01" threshold) prevents unnecessary changes when rows already agree.

---

## Why This Exists

AI sessions executing plans fail in repeatable ways. Section 7 lists them. Every phase in this document exists to block one or more of those failure modes.

The cost of a bad change is not measured by how clean the diff looks. It is measured by how much architectural drift it adds to a codebase that has to keep working for years. Surgical changes, helper-first reuse, write-direction discipline, and refactor completion are not style preferences. They are the difference between a codebase that compounds quality and one trapped in permanent fix-mode.


---

## Appendix — Common AI Bug Families (Construction Side)

_Common AI bug-family appendix: the five seam/concurrency/destruction families AI writers and reviewers reliably miss. Self-contained; no external-repo references._

> **Construction-side appendix.** How to WRITE code so the five bug families (defined in the review-side appendix) never get written. Its companion catches them in review; this one prevents them at the keyboard. Both derive from the same whole-repo adversarial review, where 8 CRITICAL data-loss/corruption bugs were written *and* passed review by Claude and Codex — because nothing forced the author to reason about crash, race, and reuse.

## The one habit that prevents all five: state the invariant before the body

Before writing any code that (a) writes durable state, (b) touches a file another process might touch, (c) accepts work that could time out/retry, or (d) deletes/kills/overwrites anything — **write one sentence naming the invariant, and one sentence naming the failure it must survive.** If you cannot write those two sentences, you do not understand the seam well enough to write it correctly yet. Put them in a comment at the seam.

Example: `# INVARIANT: only the supervisor writes workflow.json. FAILURE TO SURVIVE: a monitor reading this file at the same instant must not be able to write it back.`

The bugs below all come from writing the body without ever stating the invariant.

---

## Rule 1 — One writer per state. Never open a second door.
- Pick the single function that owns each durable state. ALL mutation flows through it. Reads go anywhere; writes go through the one door.
- Put the lock/lease check **inside the mutation function**, not only in the loop that usually calls it. Any CLI/UI/`--wait`/poll path that can also call it must hit the same gate.
- **Never** let two processes read-modify-write the same file without a shared lock held across the *whole* read→modify→write (not just the write). A mutex inside `Write-JsonFileAtomic` does NOT protect a `Read → edit → Write` done by the caller.
- **Anti-pattern that shipped:** the writer lease lived in the supervisor loop; `Invoke-...Cycle` (the actual mutator) had no lease check, so every direct caller was an unguarded second writer.

## Rule 2 — Reads are read-only. Forever. No exceptions.
- A `Get-*`/`Read-*`/`Test-*`/`Resolve-*`/`Find-*` function must be safe to call a million times with zero effect on disk or shared globals. If you feel the urge to "rebuild and save while I'm here," **don't** — return the rebuilt value; let a mutation path (holding the writer lock) persist it.
- Heartbeats, liveness pings, monitors, and diagnostics **emit evidence, never state.** Evidence is append-only and never read back into a decision that mutates canonical truth.
- If a read must repair a projection, repair it **in memory** and return it; persist only from a path that owns the write lock.
- **Anti-pattern that shipped:** `Read-SFWorkflowSnapshot` persisted its rebuilt snapshot on read, so a monitor glance regressed state behind a committed command.

## Rule 3 — Stamp every retryable unit; check the stamp on the way back.
- Any work that can time out, retry, restart, or be cancelled carries the full identity: execution + step + run + a monotonic fence/epoch (a counter that increments on every restart/reassign).
- **Every** acceptance handler — complete, fail, retry, escalate, cancel, restart — enforces the SAME guard: reject unless `status` is in the expected set AND step/run/fence all match current. Write the guard as a shared helper so a sibling cannot "forget" it.
- `runId` (or any single id) is never sufficient. A late result from a replaced worker must be *rejected*, not merely ignored by convention.
- **Anti-pattern that shipped (CRITICAL):** `complete-step`/`fail-step` checked the fence; `retry-step` checked nothing and forced `running` — a retry the instant after Stop resurrected a cancelled recipe.

## Rule 4 — Treat a failed read as ambiguous. Never destroy or default on it.
- A read returning null/empty/false means *one of*: absent, being-written-now, or corrupt. Do not collapse them. Before any destructive or default-creating branch, distinguish them: check `Test-Path` on the file separately from the parse result; on "file exists but won't parse," STOP — surface a distinct "corrupt/locked" state, never "missing → rebuild/delete."
- For append-only logs: a malformed **final** line is a torn tail (a process died mid-append — the most expected crash artifact). Keep the valid prefix; truncate/repair the torn fragment under the lock. Only *mid-file* corruption fails closed.
- Assume dependencies go transiently offline (unmounted drives, cloud-sync, AV locks). "Everything looks missing" must never trigger mass delete/rebuild — gate on the container root existing first.
- **Anti-patterns that shipped:** unreadable `session.json` → overwritten with a blank husk; one torn journal line → whole execution bricked; offline Claude folder → every record deleted.

## Rule 5 — Prove identity before you destroy. Coincidence is not proof.
- Before `Remove-Item`/delete/`taskkill`/overwrite/truncate, require the target's **own identity**: the file's internal id/cwd, the process's start-time AND command-line, the record's canonical key. Never a filename fragment, a `-like`/wildcard name match, a bare-alive PID, or an empty-looking folder.
- Use `-LiteralPath` for anything derived from data (paths, session keys — `-Path` glob-expands `[ ] * ?`). Never `-ErrorAction SilentlyContinue` on a destructive call you can't verify.
- Confirmation text must state exactly what will be destroyed. If the code can delete canonical records, the prompt says so — never describe a destructive op as a cosmetic one.
- Under any doubt: preserve the artifact and surface the problem. Deletion is the last resort, never the auto-heal.
- **Anti-patterns that shipped:** delete-by-8-char-filename-fragment across all projects; `taskkill` of reused PIDs; mass delete behind a "rebuild cache" prompt.

## Rule 6 — Foreign config: merge, never replace.
- When writing a file your program does not own (`~/.claude.json`, `settings.json`, any tool's config): read it, change ONLY your keys, write back **every** other top-level key untouched. Never construct a fresh object containing only your subset.
- Route the write through the atomic + backup helper; keep a never-overwritten first-touch backup for foreign files. Watch `ConvertTo-Json -Depth`: real config nests deep — pass a high depth and prefer surgical text edits over a full round-trip that eats comments and `$`-keys.
- **Anti-patterns that shipped:** `Write-MCPConfigForClaude` wrote back only `{mcpServers}` (wiped OAuth/projects); `Set-ClaudePermissionMode` replaced the whole `permissions` block (wiped allow/deny).

---

## PowerShell construction do/don't (language-level)

- **Never** assign to `$matches`, `$args`, `$profile`, `$PID`, `$error`, `$input`, `$host`. Name it `$matchedRows`, `$updateArgs`, `$wtProfile`.
- **Always** `@(...)`-wrap a collection you return or whose `.Count`/`-contains` you'll trust; put `$null` on the LEFT of `-eq`/`-ne`.
- **Never** `[int]$x`/`[bool]$x` on a value that could be `''`/non-numeric/garbage without a guarded parse (`[int]::TryParse`, or a `ConvertTo-...EvidenceInt` helper that returns 0/`$null` on failure). This throws terminating errors that abort whole loops.
- **Atomic write** = `[System.IO.File]::Move($tmp,$path,$true)` or `File.Replace`, never `Move-Item -Force`. Readers of a concurrently-written file take the same path mutex.
- **`WaitOne()`** is wrapped: `try { $ok = $m.WaitOne(ms) } catch [System.Threading.AbandonedMutexException] { $ok = $true }`. Abandonment means you acquired it (and should validate the file), not that the wait failed.
- **Process I/O:** attach stdout/stderr readers immediately after `Start()`, THEN write stdin; bound every `.Result` with a timeout and kill the tree on expiry.
- Develop suspect seams under `Set-StrictMode -Version Latest`; a swallowed `catch {}` gets a receipt (`Write-ErrorLog`), never silence.

---

## Pre-write checklist (run before writing any seam that stores, deletes, or coordinates)

1. What is the ONE writer of this state? Is my write going through it, gated at the mutation point? (R1)
2. Is my function named as a read? Then it changes NOTHING. (R2)
3. Can this unit be retried/replaced/cancelled? Then it's fence-stamped and every acceptance handler checks the stamp identically. (R3)
4. Does a null/empty read here lead to a destroy or a default-write? Then I distinguish absent vs unreadable vs torn-tail first. (R4)
5. Am I deleting/killing/overwriting? Then I have the target's own identity, `-LiteralPath`, an honest prompt, and preserve-on-doubt. (R5)
6. Am I writing a file I don't own? Then I merged and preserved every foreign key. (R6)
7. Which PowerShell trap could bite this line? (auto-var, empty-array, `[int]` cast, `-Path` glob, non-atomic move, `WaitOne`, stdin ordering, JSON depth.)
8. **What test reproduces the failure this must survive?** Write it red first. If the seam can't be tested (press-Stop-mid-retry, tear-a-file, reuse-a-PID, race-two-writers, offline-dependency), restructure until it can.
