# PR_TOUGH2.md — General Bug Review Companion

> **⚠ GENERIC — TAILOR AT INSTALL.** This file ships generic so it can drop into any repo as-is. It works untailored: every rule below stands on its own. It works best after the **Tailoring Pass** (final section) re-grounds it in the target repo's real types, seams, spec sources, and bug history. The empty §13 and the generic examples mark where tailoring lands. Once tailored, retitle the file for the target repo and delete this banner.

Use this file as a companion to `PR_TOUGH.md`, not a replacement for it. `PR_TOUGH.md` is the canonical hostile review framework: the seam review gate, consumer sweeps, hard gates, findings format, and drift score. This file adds broader bug-finding discipline: reviewing the correct surface, separating standards from spec, requiring red-capable bug loops, catching ordinary design smells before they become AI-amplified drift, and recognizing when a repeated bug means a module boundary is too shallow.

If this file and `PR_TOUGH.md` conflict, `PR_TOUGH.md` wins. If both are silent, the repo's other governance files (`AGENTS.md`, `CLAUDE.md`, `RUN_PLAN.md`, `TEST_RULES.md`, `PLAN_RULES.md`, or their local equivalents) keep their normal authority order.

*Provenance: distilled from the MATT engineering skills — `code-review`, `diagnosing-bugs`, `tdd`, `codebase-design`, `improve-codebase-architecture`, `triage`, `wayfinder`.*

## What This Adds

This review is for bugs that slip through a seam-only review:

- the reviewer looked at the wrong diff;
- the code is clean but implements the wrong plan;
- the code matches the plan but violates project standards;
- a bug fix starts from a plausible story instead of a red-capable feedback loop;
- tests assert registration, source text, or tautology rather than behavior;
- repeated bug families are patched locally instead of exposing a too-shallow module;
- foggy work is converted into fake implementation certainty.

Use it on every substantial AI-generated diff, every bug-fix change, and every plan review where the plan changes behavior, contracts, or state.

## 1. Review The Correct Surface

Before reviewing, name the surface being judged. Do not let "the current branch" or "the latest changes" stay vague.

Acceptable surfaces:

- a branch or PR against a fixed point;
- a named plan slice against the pre-slice commit;
- the current working tree, when the user explicitly asks for an on-disk review;
- a specific plan, constraints, or design document.

For branch or PR review:

1. Resolve the fixed point: merge-base, branch, tag, or commit.
2. Confirm it exists with `git rev-parse`.
3. Confirm the diff is non-empty.
4. Prefer `git diff <fixed-point>...HEAD` so the review is against the merge-base, not an accidental local comparison.
5. Record `git log <fixed-point>..HEAD --oneline`.

For working-tree review:

1. Run `git status --short`.
2. Treat all present changes as reviewable unless the user narrowed the scope.
3. Do not demand stashing, splitting, reverting, or deleting unrelated files; `PR_TOUGH.md` defines git-mechanics tolerance.
4. If an unexpected file affects behavior, review it in place as part of the surface.

For plan review:

1. State whether the plan is executable or a draft, per the repo's plan convention.
2. Check the plan against the repo's planning rules (`PLAN_RULES.md` or equivalent), if any.
3. Check any architectural change against the approved constraints record, if the repo keeps one.

The reviewable surface is not only source files. If the change regenerates artifacts — golden files, fixtures, emitted output, generated docs — the artifact diff is part of the surface. A review that reads the code diff but not the regenerated artifact has reviewed half the change.

## 2. Report Two Axes Separately

Every substantial review must keep two axes separate.

**Standards axis:** Does the change obey repo governance, architecture rules, helper reuse, state ownership, test discipline, and evidence honesty?

**Spec axis:** Does the change implement the requested behavior from the plan, ticket, issue, or design doc? Did it miss requirements? Did it add unapproved behavior? Did it satisfy only an easy subset while presenting the whole thing as done?

Do not let one axis hide the other. A change can be architecturally clean and still implement the wrong behavior. A change can implement the requested behavior and still be unsafe to ship.

If no spec exists, write `Spec source: none found` instead of inventing requirements.

## 3. Find The Spec Source

Search for the originating spec in this order:

1. A user-provided plan, ticket, issue, or file path.
2. The repo's active plan convention (executable plan files and their constraints/deviations records).
3. Issue or ticket references in commit messages.
4. Specs and design documents under `docs/`, `specs/`, or the repo's equivalent.
5. Local trackers such as `TODO.md` or the repo's backlog files.
6. If none applies, report `Spec source: none found`.

Never infer hidden requirements from vibes. A missing or contradictory spec is itself review evidence.

## 4. Code-Smell Baseline

Use these as review leads, not automatic blockers. Repo rules and design docs decide severity. At tailoring, each smell gains the target repo's own named examples.

- **Mysterious Name:** a name does not reveal what the thing does, holds, or mutates. Verbs must tell the truth: `get*` must not mutate, `list*` must not delete, `find*` must not create; status/report/diagnose paths must not write unless the design says the observation records a durable fact.
- **Duplicated Code:** the same logic shape appears more than once. Most dangerous when one copy carries a guard and the other copy is the same operation without it.
- **Feature Envy:** a function reaches into another module's data to make decisions the callee should own.
- **Data Clumps:** the same fields or parameters travel together repeatedly and want a type.
- **Primitive Obsession:** raw strings, numbers, or booleans stand in for a domain concept. Raw primitives are acceptable at storage and CLI boundaries; the domain should convert them into closed types before decisions.
- **Repeated Switches:** the same conditional cascade appears in multiple places; one path will drift. Acceptable only when every switch is exhaustive, contract-tested, and the repetition is deliberate at a boundary.
- **Shotgun Surgery:** one logical change forces scattered edits across many files. Require the consumer sweep from `PR_TOUGH.md` and check it independently.
- **Divergent Change:** one file absorbs unrelated reasons to change — surfaces growing policy, stores gaining decisions that belong in services.
- **Speculative Generality:** hooks, parameters, abstractions, or seams exist for needs not in the spec. A seam is justified only when the approved design names the axis, at least two real implementations exist, or the abstraction removes real duplication or concentrates a real invariant. One adapter behind a hypothetical seam is a fake seam.
- **Message Chains:** callers navigate long object chains or storage shapes to infer a policy that belongs behind a method on the owning module.
- **Middle Man:** a function or class mostly delegates with no distinct contract. Thin pass-through is acceptable only at composition and adapter boundaries that name a real seam.
- **Refused Bequest:** an implementation nominally fits an interface but ignores or rejects most of it. Acceptable only for explicit test doubles whose contract suite proves callers never use those members in that context.

## 5. Bug Fixes Need A Red-Capable Feedback Loop

For a bug fix, do not begin with a theory. First create or identify one red-capable command that drives the reported bug path and asserts the user's exact symptom.

A valid loop is:

- **Red-capable:** fails on the current bug and would pass after the fix.
- **Deterministic:** same verdict every run, or a high reproduction rate for flakes.
- **Fast:** seconds when possible, not a broad suite.
- **Agent-runnable:** one command the AI can run unattended.

Acceptable loop types:

- focused test;
- CLI invocation with fixture input and expected output;
- replayed trace or captured event log;
- throwaway harness, promoted into a real test when the seam is clear;
- differential run against old/new versions;
- `git bisect run`;
- fuzz/property loop for intermittent wrong-output bugs;
- human-in-the-loop script only as a last resort.

If no red-capable loop can be built, say why and name the missing evidence. Do not guess.

## 6. Minimize The Repro Before Fixing

Once a bug reproduces, shrink it.

Remove inputs, files, flags, services, callers, and timing assumptions one at a time. Re-run the loop after each removal. Keep only what is load-bearing.

The minimized repro becomes the best regression test when a correct public seam exists for it. Do not keep a full end-to-end loop as the only repro if a smaller seam can prove the same invariant.

Minimization matters most for multi-cause failures: without it, an implementer fixes the symptom path and misses the actual contract break.

## 7. Rank Falsifiable Hypotheses

For hard bugs, list 3–5 ranked hypotheses before instrumenting.

Each hypothesis must have a prediction:

```text
If <cause> is true, then <probe/change> will produce <observable result>.
```

Reject hypotheses that cannot be falsified. Instrument one variable at a time.

Bad: "Maybe the service is flaky; add logs everywhere."

Good: "If the cache is serving the stale entry, then a request with cache bypass will return the correct value while the same request without bypass returns the old one."

## 8. Instrumentation Must Be Tagged And Removed

Temporary instrumentation is allowed only to test a hypothesis.

Rules:

- tag every temporary line with a unique prefix, such as `[DEBUG-a4f2]`;
- grep for the tag before close-out;
- remove it before reporting done, unless it is deliberately promoted into permanent diagnostics;
- if promoted, document the diagnostic as product behavior and add or adjust tests for it.

Permanent diagnostics are valuable. Untagged temporary noise is not — it becomes permanent noise that confuses every later diagnosis.

## 9. Test Through Public Seams

Tests should verify behavior where callers observe the system.

Prefer:

- contract suites at the module's public interface over tests of private helpers;
- behavior tests at the real command/API/CLI seam;
- expected values from specs, fixed examples, or observed incident artifacts;
- one red-green vertical slice at a time;
- tests that survive refactoring.

Avoid:

- source-pattern tests as proof of runtime behavior (source scans may enforce architecture invariants, but they are not behavior claims — do not confuse the two);
- tests that call private helpers because they are easier;
- tautological tests that compute the expected result the same way the implementation does;
- tests that assert only "does not throw";
- horizontal batches that assert many imagined behaviors before one vertical path proves reality;
- tests that rewrite expectations to bless new behavior without citing the spec change.

Where the repo has testing governance (`TEST_RULES.md` or equivalent), apply it in addition to this section.

## 10. Repeated Bugs Mean The Module May Be Too Shallow

If the same bug family recurs across multiple files, review rounds, or plans, do not only add more local guards. Ask whether the interface leaks too much ordering burden to callers.

Use this vocabulary:

- **Module:** anything with an interface and implementation.
- **Interface:** everything callers must know, including invariants, ordering, errors, cost, and retry behavior.
- **Depth:** how much behavior sits behind a small interface.
- **Locality:** whether change and verification concentrate in one place.
- **Leverage:** how much callers get from one interface.
- **Seam:** where the module's interface lives.
- **Adapter:** a concrete implementation behind a seam.

Ask:

- Does understanding one concept require bouncing across many files?
- Is the interface nearly as complex as the implementation?
- Are tests forced to reach inside because the public seam is wrong?
- Would deleting the module concentrate complexity or merely remove pass-through code?
- Does one adapter exist for a hypothetical seam with no approved second axis?
- Would a deeper module let the repo fix once instead of patching every caller?

## 11. Durable Bug Reports Are User-Behavior First

When turning a bug into a ticket or plan input, write it in durable behavior language:

- what happened;
- what was expected;
- concrete reproduction steps;
- whether it is consistent or intermittent;
- domain terms from the repo's design vocabulary.

Use file/line references in PR reviews and fix plans, where they belong. Avoid making them the identity of a durable bug ticket — they go stale after refactors; behavior survives.

Good: "A freshly submitted order shows no confirmation row and no acknowledgement appears."

Bad: "`OrderWorker.cs:155` is wrong."

## 12. Foggy Work Needs A Map

For work too large or unclear for one agent session:

- define the destination first;
- separate investigation tickets from implementation slices;
- record "not yet specified" fog explicitly;
- resolve one decision per session;
- update the approved constraint or design artifact before coding if a decision changes architecture;
- keep future ideas in a named follow-up file, not hidden inside a slice.

Do not turn fog into twenty fake implementation steps. A plan slice must be falsifiable and verifiable. An honest, named "not yet" stub beats a fake implementation.

## 13. Project-Specific Bug Leads

> **TAILOR AT INSTALL — this section starts empty by design.** Fill it during the Tailoring Pass from the target repo's evidence: `git log` fix/revert/guard commits, incident and post-mortem docs, bug backlogs, and past review findings. These are the highest-value checks in the file — the repo has *literally already had* these problems.

Shape: grouped headings by subsystem or failure family, each holding short questions answerable from code and tests. Example shape (replace entirely):

```md
### <Subsystem or failure family>

- Can <specific hazard the repo has actually hit>?
- Does <specific invariant> hold after <specific interruption>?
```

## 14. Suggested Report Addendum

When using this alongside `PR_TOUGH.md`, add a short section to the review artifact after the Mandatory Seam Review Gate:

```md
## General Bug Audit

**Review surface:** <fixed point / working tree / plan file>
**Spec source:** <plan/ticket/design doc, or "none found">

### Standards Axis
<Findings, or "No additional standards findings beyond PR_TOUGH categories.">

### Spec Axis
<Requirements satisfied, missed, or added without approval.>

### Feedback Loop
<For bug fixes: red-capable loop used, minimized repro, or missing evidence.>

### Smell Leads Checked
<Only meaningful leads; do not dump a checkbox list.>

### Architecture-Depth Question
<If a repeated bug family was found: is the module too shallow?>
```

This addendum does not replace `PR_TOUGH.md`'s findings format, severity rubric, or drift score.

## 15. Close-Out Rules

Before declaring the review complete:

- state the review surface;
- state the spec source or `none found`;
- state the red-capable feedback loop for any bug fix;
- grep for any temporary debug tag you introduced;
- keep standards and spec conclusions separate;
- do not approve a change that fails `PR_TOUGH.md`'s final review refusal rule.

This file must make reviews stricter and more deterministic. It must never be used to excuse missing consumer sweeps or to substitute smell commentary for concrete file/line findings.

## 16. The Tailoring Pass

Run this once, at install, to convert the generic file into the target repo's companion. Tailoring is content work, not restructuring: the section numbering and the twelve disciplines stay stable so cross-references survive.

1. **Retitle.** `# AI Audit: General Bug Review For <TargetRepo>` (or the repo's naming convention). Delete the banner at the top of this file.
2. **Restate the companion relationship.** Rewrite the opening to name what the target's canonical review framework actually covers, and rewrite the authority order using the target's real governance files. If the target's hazard profile differs from this file's assumptions — e.g., a single-shot deterministic pipeline has none of the orchestration hazards — say plainly which sections apply weakly and why.
3. **Coverage check before adding.** For each numbered section, mark it **covered / partial / genuine addition** against the target's existing governance and mechanical lints. Only the gaps earn text. If a rule's real home is another file (the canonical governance file, an architecture lint test), name that home in a placement table rather than duplicating the rule here.
4. **Re-ground every example.** Replace each smell's generic wording with the target's named types, files, seams, states, and verbs. A smell without a local example will be skimmed; a smell naming the repo's own `OrderWorker` will be checked.
5. **Fill §13 from evidence.** Mine `git log` for fix/revert/guard commits, incident docs, bug backlogs, and past review findings. Each lead becomes a question answerable from code and tests. This section is the reason the tailored file outperforms the generic one.
6. **Localize the loop vocabulary.** In §5, §6, and §9, name the target's test framework, contract suites, fixtures, oracles, replay tools, and any environment-specific evidence rules (live-account consent, hardware-in-the-loop, external lint gates). If the repo distinguishes local proof from real-world proof, make that distinction explicit — a passing parse is not an acceptance gate.
7. **Keep §14–§15 compatible** with the target's `PR_TOUGH.md` output format, severity rubric, and refusal rules.
8. **Delete what cannot be grounded.** A section with no honest target-repo grounding is context noise. Removing it is tailoring, not weakening — record the removal in one line so the next auditor knows it was deliberate.
