# PR_TOUGH.md

A tough code review. It enforces the repository's **documented architecture** and hunts the bug classes that survive a surface read — the changes that look clean line by line yet corrode boundaries, revive retired assumptions, or ship a silent wrong answer.

It reviews against the architecture the repo documents (in `AGENTS.md` / `CLAUDE.md` or the equivalent) *and* applies general bug-finding discipline. Where a repo documents no architecture, the architecture sections apply weakly but the surface, spec, smell, and bug-finding sections still hold.

Two things it will not do: review standalone prose for style, or manufacture a numeric grade. Findings are concrete and cited; the verdict is a judgment, stated plainly as one.

---

## 0. Core rule

Read the architecture docs first. Treat them, the current tests, the current file headers, and the code as it exists on disk as **law**. Do not trust comments, release notes, refactor claims, or file moves by themselves — verify the architecture in code, tests, and manifests.

Review source, tests, manifests, and docs — not just the code diff. A change that looks clean in isolation can drift the architecture through a test fixture, a build manifest, or a comment that lies about what the code does.

---

## 1. Establish the review surface

Name what you are judging before you judge it. Do not let "the current branch" or "the latest changes" stay vague.

- **Branch or PR:** resolve the fixed point (merge-base, branch, tag, or commit), confirm it resolves and the diff is non-empty, and prefer `diff <fixed-point>...HEAD` so the review is against the merge-base, not a local accident. Record the commit list.
- **Working tree:** `git status --short`; treat all present changes as reviewable unless the user narrowed scope. Do not demand stashing, splitting, or reverting to make the diff tidy — judge the tree as it is.
- **Plan or slice:** state whether it is executable or a draft, and check it against the repo's planning rules.

The reviewable surface is not only source files. If the change regenerates artifacts — golden files, fixtures, generated output — the artifact diff is part of the surface. Reading the code diff but not the regenerated artifact is half a review.

---

## 2. Two axes — standards and spec

Every substantial review reports two axes, kept separate:

- **Standards:** does the change obey governance, architecture boundaries, helper reuse, state ownership, test discipline, and evidence honesty?
- **Spec:** does it implement what the plan / ticket / issue asked — no requirement missed, no scope crept in, no easy subset presented as the whole?

Do not let one axis hide the other. A change can be architecturally clean and implement the wrong behavior; it can implement the behavior and still be unsafe to ship.

Find the spec source in order — a user-provided path, the active plan and its records, ticket references in commit messages, `docs/` or `specs/`, the backlog — or write `Spec source: none found`. Never infer requirements from vibes; a missing or contradictory spec is itself review evidence.

---

## 3. Hard gates (auto-fail)

These conditions force a failing verdict regardless of any other strength in the change.

| Gate | Rule |
|---|---|
| **Build fails** | The documented build command fails on a file in the diff's blast radius. Do not dismiss it as environmental, machine-specific, or unrelated. Blocks until green. |
| **Lint/format fails** | Where the repo gates on lint or format and a changed file fails, every finding is at least one severity higher. |
| **Hidden mutation in a read path** | A refresh, render, projection, poll, hydration, liveness, or status path silently writes canonical state. |
| **Single-click destructive action** | A destructive action (delete-all, reset, nuke, force-push) fires on one action with no operator confirmation. |
| **Invented command / API** | A surface submits a command or API the system does not actually have. |
| **False completion claim** | Docs, comments, or a commit message claim a cleanup or refactor is finished while the old path still ships in runtime. |

---

## 4. Preflight before writing findings

### 4.1 Targeted drift search

Grep for the drift patterns your repo already knows it has — list them in your governance and search them here. Common shapes:

- **Bypassed helpers** — a hand-rolled version of an existing helper; raw file reads or writes outside the persistence seam.
- **Cross-boundary imports** — a module importing another's internals instead of its public interface; a lower layer reaching into a higher one.
- **Multiple sources of truth** — the same entity written durably in two places without one being clearly canonical; dual-field emission of the same concept under two names.
- **Cache or projection used as authority** — a lookup into derived data driving a mutation decision.
- **Mutable presentation state used as identity** — display names, file paths, or UI state used as a durable key.
- **Old patterns preserved under new names** — comments claiming a cleanup the code doesn't perform; "transitional" code with no retirement condition.
- **Brittle parsing** — positional/offset string parsing where a named parse belongs.

### 4.2 Trace the full path before judging the surface

For any UI / API / export change, trace end to end: control → emitted event → handler → request shape (verb, route, params) → server entry → service → store → external system, and for the response, its field origin, unit conventions, and fallbacks — plus what the tests actually cover. A change that looks right at one layer often breaks at the seam between two.

### 4.3 Incomplete-by-design vs broken-now

When the plan says a slice is intentionally unfinished, do not report the absence as a bug. Do report code that *pretends* the unfinished slice is complete — bad fallback values, silent successes that should be diagnosable failures, false UI states.

---

## 5. Architectural defect categories (in priority order)

### 5.1 Canonical truth (Critical)

The architecture documents a single source of truth for each entity.

- Does any path treat a non-canonical file or store as authority?
- Does any path write durable state in multiple places without one being clearly canonical?
- Does any path persist what should not be canonical — computed values, presentation state, transient runtime markers?
- Does any path use mutable presentation fields (display names, file paths, UI state) as identity?
- Does any action read a raw identity field directly instead of going through the documented accessor or recovery seam?
- Do function names tell the truth — a read-prefixed function that does not mutate, a resolve that does not delete, a test/check that does not clean up?

### 5.2 Boundary and namespace (Critical)

The architecture documents how modules relate and which may call which.

- Does any code cross a documented boundary (UI doing business logic, core doing rendering, a headless layer prompting the user)?
- Does any new code bypass a documented helper by hand-rolling the logic inline?
- Does any code depend on another module's internals instead of its public interface?
- Does any change quietly preserve old coupling under new names or "transitional" comments?
- Does any change move code into smaller files but keep the same wrong ownership split?

### 5.3 Cache and projection (High)

A documented cache or projection must be rebuildable from canonical truth.

- Does any path treat cache/projection as source of truth when it should be read-only?
- Does any write update the projection but fail to update the canonical record first?
- Does any read silently trust derived data when canonical data is missing or contradictory?
- If the projection were deleted now, would rebuilding from canonical restore the same visible state? If not, it has become quiet authority.
- Does any new store declare its lifecycle — durable evidence, rebuildable projection, disposable cache, or transient transport?

### 5.4 Authorization and access (High)

Where the architecture documents who may mutate what, and when.

- Does any code mutate state at the wrong layer, or skip a required authorization check or guard?
- Does any new code assume a prerequisite is true without validating it?
- Does any destructive operation lack a confirmation guard?
- Was a parameter removed as "unused" when an authorization attribute or decorator actually required it?
- If authorization context comes from request-body data instead of the route, is there an explicit ownership check backing it?

### 5.5 Helper and abstraction drift (High)

- Does any new function duplicate an existing helper, mapper, builder, validator, or converter?
- Does any new code hand-roll behavior an existing seam already owns?
- Does any change hide side effects behind misleading naming or placement?
- Does any new abstraction have a clear owner, caller, and reason — or is it speculative flexibility?
- Does any new DTO / view model carry the same concept under a different shape without a contract reason?
- Are sibling routes or list types copying logic instead of delegating to a shared helper?

### 5.6 Build and manifest parity (High)

Where the product is stitched from multiple sources or built from manifests.

- Was a new shared file added but not included in every required manifest?
- Was logic moved in source but left duplicated or stale in a build artifact?
- Can the same helper now behave differently across products because manifests load different files or a different order?
- Do docs claim "single source" while build artifacts still preserve multiple copies?
- Are new source files, samples, or fixtures referenced but not copied to test output?
- Does the diff change an include pattern in a way that silently adds or drops files?

### 5.7 Safety, repair, and destructive operations (Medium — Critical when data loss is plausible)

Maintenance code must be more careful than normal code.

- Does any repair or cleanup path assume data consistency it does not verify?
- Does any destructive operation lack guards where data loss is possible, or delete/overwrite artifacts when ownership is uncertain?
- Does cleanup silently heal ambiguity by deletion instead of surfacing the problem?
- Does any code mutate in-memory state to "success" before the durable write succeeds?
- If persistence fails after external work succeeds, does the code surface a partial/failed state honestly, or do memory and disk silently diverge?

### 5.8 Null paths, silent fallbacks, and misleading successes (High — Medium)

A silent wrong answer is worse than a loud failure.

- Are nullable/optional values dereferenced without a guard?
- Do first-element accesses (`.First()`, `[0]`, `.head`) run on possibly empty collections?
- Does any fallback value produce a silently wrong result instead of an error?
- Does any `continue`/`skip` silently drop user-supplied data without surfacing a warning?
- Does any filter silently exclude items the user expects to see?

### 5.9 Test and fixture drift (Medium)

Tests are architecture documentation; false tests hide real drift.

- Is there a new architectural seam without a contract test proving its invariant?
- Do tests or fixtures still encode the old architecture instead of the new one?
- Were tests rewritten to rubber-stamp the new code instead of asserting the original contract?
- Do tests reject the **forbidden shape** that caused the bug, not only the new happy path?
- Do tests cover multi-item, null, and error scenarios, or only the single happy path?
- Do tests reach private methods by reflection instead of going through the public seam?
- Did the change add one giant boolean megatest that could hide drift, instead of splitting by contract?

### 5.10 Documentation, comment, and truthfulness drift (Medium)

- Do comments or file headers claim a cleanup is finished while the code still violates the boundary?
- Do comments call something "transitional," "compat," or "temporary" without a concrete retirement path?
- Does the change match what the plan, design doc, or commit message claimed?
- Are functions still named for asynchronous work they no longer do?

**Use `.md` files freely as evidence — read plans, changelogs, and design docs to verify whether code matches its stated intent. But never produce a finding that asks to fix a `.md` file.** A code review targets source, tests, manifests, and inline doc-strings — not standalone documentation. The only exception is when the diff itself edited docs incorrectly.

---

## 6. Code-smell baseline (leads, not blockers)

Use these as review leads; repo rules and design docs decide severity.

- **Mysterious Name** — a name does not reveal what the thing does, holds, or mutates.
- **Duplicated Code** — the same logic shape appears more than once; most dangerous when one copy carries a guard and the other does not.
- **Feature Envy** — a function reaches into another module's data to make decisions the callee should own.
- **Data Clumps** — the same fields travel together repeatedly and want a type.
- **Primitive Obsession** — raw strings/numbers/booleans stand in for a domain concept past the storage/boundary edge.
- **Repeated Switches** — the same conditional cascade in several places; one will drift.
- **Shotgun Surgery** — one logical change forces scattered edits across many files.
- **Divergent Change** — one file absorbs unrelated reasons to change.
- **Speculative Generality** — hooks, parameters, or seams for needs not in the spec; one adapter behind a hypothetical seam is a fake seam.
- **Message Chains** — callers navigate long object chains to infer a policy that belongs behind a method.
- **Middle Man** — a class mostly delegates with no distinct contract.
- **Refused Bequest** — an implementation nominally fits an interface but ignores most of it.

---

## 7. Bug-finding discipline

### 7.1 A bug fix needs a red-capable loop before a theory

Do not begin a bug fix with a story. First build or identify one command that drives the reported bug path and asserts the exact symptom, and that is: **red-capable** (fails now, passes after the fix), **deterministic**, **fast**, and **runnable unattended**. If no such loop can be built, say why and name the missing evidence — do not guess.

### 7.2 Minimize the repro before fixing

Once it reproduces, shrink it: remove inputs, files, flags, services, callers, and timing assumptions one at a time, re-running after each. Keep only what is load-bearing. The minimized repro is the best regression test when a public seam exists for it. Minimization matters most for multi-cause failures — without it, a fix chases the symptom and misses the contract break.

### 7.3 Rank falsifiable hypotheses

For a hard bug, list 3–5 ranked hypotheses before instrumenting, each with a prediction: *if `<cause>` is true, then `<probe>` produces `<observable>`.* Reject any you cannot falsify. Instrument one variable at a time.

### 7.4 Tag and remove instrumentation

Temporary instrumentation exists only to test a hypothesis: tag each line with a unique prefix (e.g. `[DEBUG-a4f2]`), grep for the tag before close-out, and remove it — unless it is deliberately promoted to a documented diagnostic with tests.

---

## 8. Test discipline

Tests must verify behavior where callers observe the system.

**Prefer:** contract suites at the module's public interface; behavior tests at the real command/API/CLI seam; expected values from specs, fixed examples, or observed incidents; one red-green vertical at a time; tests that survive refactoring.

**Flag:** source-pattern tests offered as proof of runtime behavior; tests that call private helpers because it is easier; **tautological** tests that compute the expected value the same way the code does; tests that assert only "does not throw"; horizontal batches asserting imagined behavior before one vertical proves reality; tests rewritten to bless new behavior without citing a spec change.

---

## 9. Recurrence means the module may be too shallow

If the same bug family recurs across files, review rounds, or plans, do not only add more local guards — ask whether the interface leaks too much ordering burden to callers.

Vocabulary: **interface** = everything callers must know, including invariants, ordering, errors, cost; **depth** = how much behavior sits behind a small interface; **seam** = where the interface lives; **adapter** = a concrete implementation behind it.

Ask: does understanding one concept require bouncing across many files? Is the interface nearly as complex as the implementation? Are tests forced to reach inside because the public seam is wrong? Does one adapter exist for a hypothetical seam? Would a deeper module let the repo fix once instead of patching every caller?

---

## 10. Review posture

- Block changes that preserve old patterns under new names.
- Block changes that move code into smaller files but keep the same wrong ownership split.
- Be suspicious of "compatibility," "transitional," "fallback," and "repair" code — that is where old assumptions survive.
- Verify behavior in code, not in claims. A comment saying "this is now read-only" over a function that still moves a file is a critical finding.
- A passing test is evidence, not proof — it can rubber-stamp wrong behavior or encode the old architecture. A passing build is a precondition for a passing verdict, not a credit toward one.

---

## 11. Output format

### Findings

Order by severity. For each:

```
Severity:      CRITICAL | HIGH | MEDIUM | LOW
Category:      <one of the categories, or "spec" / "smell" / "test">
File:Line:     <exact location>
What:          <one line>
Why it matters: <concrete current risk>
Failure mode:  <how it breaks, or how to reproduce>
Fix:           <the smallest credible fix, not a refactor wish list>
```

If unsure, say so and name the evidence that would confirm it. Do not pad with speculative future risk. If there are none, say exactly `No findings.`

### Verdict

State the outcome as a judgment from the findings — **not a computed score, not a percentage.** One of:

- **BLOCK** — a hard gate is hit, or an unresolved Critical remains.
- **REWORK** — significant drift, boundary or canonical violations, or a missing test on a critical path.
- **APPROVE WITH FOLLOW-UP** — only Medium/Low findings, or fixable gaps tracked by a named follow-up.
- **APPROVE** — boundaries intact, no drift, spec met.

Label introduced-vs-pre-existing on every finding; never grade a change down for debt it merely sat beside.

### Missing validation

Exact commands or manual checks still to run — the specific targeted test, the specific manual check, the specific artifact to inspect. Be concrete; name the command.

### Missing tests

For each, the correct test file and the invariant it should prove. Place each test in the layer that owns the seam.

### Residual risks

Only real risks still current after the review. No vague future work.

### Summary

Short. If clean, say so and list residual risks. If not, say whether to block, rework, or merge with explicit follow-up — and call out explicitly when docs or tests lie about the architecture even if the runtime bug hasn't happened yet.

---

## 12. Close-out and refusal

Before declaring the review complete:

- State the review surface and the spec source (or `none found`).
- Keep the standards and spec conclusions separate.
- For any bug fix, state the red-capable loop used (or the missing evidence).
- Grep out any debug tag you introduced.

**Refusal:** do not APPROVE a change that hits a hard gate. Do not APPROVE if you cannot state what happens when a changed destructive or lifecycle operation is interrupted or repeated. A report of what is wrong is always allowed; a passing verdict over an unmet gate is not.

---

## 13. Short prompt

```text
Tough architectural PR review. Read the architecture docs (AGENTS.md/CLAUDE.md)
first and treat them, the current tests, file headers, and on-disk code as law;
do not depend on deleted docs. Review source, tests, manifests, and docs — not
just the code diff.

First name the review surface (fixed point or working tree; confirm non-empty).
Report two axes separately: standards (boundaries, helpers, ownership, tests) and
spec (requirements met/missed/crept). Name the spec source or say none.

Hunt, in priority order: (1) canonical-truth violations (2) boundary/namespace
(3) cache/projection used as authority (4) authorization/access (5) helper/
abstraction drift (6) build/manifest parity (7) safety/destructive ops (8) null
paths and silent fallbacks (9) test/fixture drift (10) comment/doc truthfulness.
Apply the smell baseline as leads. For any bug fix, require a red-capable loop.
Flag tautological and private-reaching tests.

Auto-fail for build failure, hidden mutation in read paths, single-click
destructive actions, invented commands, or false completion claims. Never file a
finding to fix a standalone .md — use docs as evidence only.

Findings first, by severity, with exact file:line, failure mode, and the smallest
credible fix. Then a verdict — BLOCK / REWORK / APPROVE-WITH-FOLLOW-UP / APPROVE,
stated as a judgment, not a score. Then missing validation, missing tests,
residual risks, and a short summary.
```
