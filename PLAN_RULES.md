# PLAN_RULES.md — How a Wish Becomes a Plan

## Purpose

This governance document defines how AI-BASIC turns a **wish** into a **plan**. It is the `POLICY` that planning statements consume:

```basic
LET planRules = READ "PLAN_RULES" AS POLICY
DESIGN plan FROM wish USING planners WITH STRICT planRules FOR 6 ROUNDS
```

It is installed into project `.bAsIc/` payloads by `basicai new` and resolved through the typed governance fallback. Three audiences are bound by it:

- **AI planners** — the workers inside `DESIGN` that draft, debate, and converge on the plan.
- **AI executors** — the workers that later implement the plan's slices via `GENERATE` and are reviewed via `JUDGE`.
- **Humans** — who review plans before execution and own every commit.

The companion documents are `RUN_PLAN.md` (how a plan is executed), `PR_TOUGH.md` (how the work is reviewed), and `When-Design-Makes-Slices.md` (the required shape of generated slices).

**Method catalog.** The operational methods this policy invokes are compiler-owned prompt assets under `prompts/` (data resources, not language specs):

| Method | Used at | Purpose |
|---|---|---|
| `prompts/TheSortingHat.md` | Stage 1 | Classifies a wish/repo against the installed stack catalog; produces ranked candidates with fitness scores. This is the machinery behind `STACK FROM wish` and `DESIGN`'s hidden selection. |
| `prompts/CreateNewTaxonomy.md` | Stage 1, low fitness | Designs a new layered taxonomy when no installed stack fits — the correct response to a missing territory. |
| `prompts/CreateStackExperts.md` | Stage 1, after new taxonomy | Populates a taxonomy with per-layer and stack-level `Expert.md` files so Stage 3 slices have owners. |
| `prompts/MakeOutsideRepo.md` | project bootstrap | Orchestrates Sorting Hat → optional taxonomy creation → expert population → target `.bAsIc/` install. |

## The Contract Chain

```text
wish → stack (taxonomy) → plan → slices → execution → review
```

Each arrow is a contract. A plan is a contract between the planner and the executor — and the executor that reads the plan may read *only* the plan. Therefore:

**The self-instruction rule.** A plan MUST be sufficient on its own to produce correct execution. Every discipline the work requires — taxonomy fit, layer coverage, consumer sweeps, derived verification, self-review, deviation tracking — must be stated *inside the plan* as directives with evidence artifacts. A plan that depends on the executor's diligence is not a contract; it is a hope.

---

## Stage 0 — Wish Hygiene

No planning begins on an untyped wish.

- The wish MUST be a typed `WISH` value: `LET wish = READ "request.md" AS WISH` or `LET wish = ARGS[0] AS WISH`. A loose string is not a wish.
- The planner MUST read the wish's structured intent — `.CONSTRAINTS`, `.PRIORITY$`, `.DEADLINE$`, `.COMPLIANCE$`, `.BUDGET$` — and carry every present constraint into the plan as a named requirement, not background flavor.
- When the wish is ambiguous about outcome, scope, or constraints, the planner MUST use `/ASK` (clarification mode) rather than guess. Clarification results land on the plan (`.ASSUMPTIONS`, `.QUESTIONS`, `.USER_ANSWERS`); a plan built on unrecorded guesses is defective.

## Stage 1 — Taxonomy First: No Planning Without Territory

A wish names a desire. A stack names the professional territory the desire lives in. **Planning in the wrong territory produces a fluent plan that misses whole professional layers** — the exact failure the taxonomy exists to prevent.

Before any plan is produced:

1. **Check whether the wish already carries its territory.** A governed wish file may declare its stack. If `HASVALUE wish.STACK`, use it; do not re-classify what the human already decided.
2. **Derive the stack explicitly when absent.** Use the visible selection expression, not hidden classification:

   ```basic
   10 IF NOT HASVALUE wish.STACK THEN
   20   LET wish.STACK = STACK FROM wish USING planners /ASK
   30 END IF
   ```

3. **Gate on fitness — the Sorting Hat thresholds.** A derived stack carries a transient `.FIT%` (0–100), produced by the classification method in `prompts/TheSortingHat.md`. The plan MUST record the selected stack's identity (`.CODE$`, `.NAME$`) and its fitness, and obey the canonical thresholds:
   - **85–100** — strong/direct fit; use the stack as the working default.
   - **50–84** — partial fit; the planner MUST NOT silently proceed. Use `/ASK` to present close candidates, or stop and ask whether taxonomy refinement or a new taxonomy is needed.
   - **Below 50** — poor fit; strongly recommend new-taxonomy analysis before any planning.

   **No installed taxonomy fitting is a finding, not a failure.** The correct response to a missing territory is `prompts/CreateNewTaxonomy.md` (design the territory) followed by `prompts/CreateStackExperts.md` (staff it) — never planning inside the wrong territory because it was the closest one installed. A fitness score is a professional judgment, not a measurement; the plan records the evidence behind it.
4. **An explicit `AS stack` clause on `DESIGN` always wins** over `wish.STACK`. The plan records which path selected the territory and why.

A plan that does not name its stack has not located the work in the technology kingdom and MUST be rejected at review.

## Stage 2 — Layer Coverage: Cover or Rule Out

The selected stack's layers are the map of professional concerns. The plan MUST visit every layer of the stack and do one of two things:

- **Cover it** — at least one slice owned by that layer; or
- **Rule it out explicitly** — a one-line reason in the plan's out-of-scope section.

Format:

| Layer | Disposition | Reason if ruled out |
|---|---|---|
| `10-availability-and-recovery` | Covered (Slices 3, 7) | n/a |
| `50-rate-limiting` | Ruled out | Internal tool; single trusted caller; revisit if exposed |

Silence about a layer is the defect. An AI can produce convincing work while skipping security, observability, cost, or compliance — the taxonomy makes that omission visible *only if the plan is forced to answer for every layer*.

## Stage 3 — Slices Obey the Taxonomy

Plans decompose into slices, and slices obey `When-Design-Makes-Slices.md`:

- Every slice carries `**Source slice:**`, `**Layer:**`, and `**Expert:**` — the taxonomy layer that owns it and the real path to the layer's `Expert.md`. The layer that owns a slice is the layer where the feature *first becomes real*, not the layer that eventually consumes it.
- Every slice has a **falsifiable acceptance criterion** — something a test or a focused check can prove. "Improve the parser" is not acceptance; "`LABEL <name> /NOEMIT` parses and the negative form produces a stable diagnostic" is.
- Every slice is one session of focused work and leaves the project buildable and test-passing.
- Recipe-bound slices are deletion-friendly: completed slices are deleted, never relabeled.
- Implementers and reviewers come from the layer's catalog defaults unless the plan states an override and why.

**The Walking Spine rule** (from `prompts/MakeSlices.md`). A slicing plan MUST NOT consist only of horizontal taxonomy-layer slices. Before broad implementation work begins, the plan defines at least one **walking spine**: the smallest honest end-to-end path through the real production pipeline, from a real input to a real output. A valid spine:

1. starts from a real user-facing input;
2. passes through the real major phases of the system — no shortcuts around the intended architecture;
3. produces a real user-facing or machine-consumable output;
4. includes tests proving the path end-to-end;
5. stays intentionally narrow — even humiliatingly small;
6. becomes the trunk that later horizontal slices attach to.

Horizontal layer slices preserve ownership, expertise, and phase discipline; the spine proves the system is real. Both are required. A plan whose first ten slices are all horizontal has deferred the only slice that can falsify the architecture.

**Position is semantics.** In an executable queue ("implement the first remaining slice in file order"), a prerequisite exists only if it physically precedes its consumers — dependencies are expressed by placement, never by prose. A slice that says "consumers run after me" while sitting after them is a lying comment in plan form; the plan is defective until the placement is fixed. Completed slices in deletion-friendly queues are **deleted**, never retained as annotated future work. After any edit to an ordered plan, verify by position that every declared prerequisite precedes every consumer.

## Stage 4 — Consumer Sweep for Contract Changes

If the plan changes any contract — a type, a property name, a statement form, a file format, a spec section, a CLI flag — the plan MUST contain a consumer-sweep table: every consumer of the old contract, each marked *update* or *ruled out with a reason*.

| Contract | Consumer | Action | Reason if ruled out |
|---|---|---|---|
| `stack.NUMBER$` → `stack.CODE$` | every spec section, slice plan, manual example, sample program mentioning `.NUMBER$` | Update | n/a |

And the plan must say this plainly to its executor: **the table is intent, not proof.** The executor re-derives the consumer list before editing (Stage 5, directive 1), because the planner's sweep may be incomplete.

## Stage 5 — Executor Directives (Mandatory in Every Plan)

Every plan ends with an **Executor Directives** section. These are the orders that make verification an *output of executing the plan* rather than a hoped-for behavior of the executor. Eight are mandatory; a planner may add more, never fewer:

1. **Pre-edit sweep artifact.** Before editing anything, produce a list of every file that mentions any contract this plan removes or changes; classify each hit (will edit / correct as-is / out of scope with reason); treat that list — not the plan's landing tables — as the edit checklist. The plan supplies seed search terms; the executor extends them with every changed form discovered during the work. **Counts are consumers:** when the change alters the membership of any enumerated set, the set's cardinality language ("seven", "all N", "N types", totals) joins the term list — a count satisfiable only by the removed member is a stale positive that name-searches cannot see.
2. **Derived verification.** The plan's enumerated acceptance checks are a floor, not the definition of done. Derive additional checks from the plan's change inventory — for every removed or renamed form, search every authority document (spec, governance, slice plans, manuals, samples) for it as a *positive expectation* — and report the results.
3. **Hostile self-review.** The final work item of every plan is reviewing the executor's own full diff under `PR_TOUGH.md` before reporting completion: consumers the sweep missed, stale version markers, positive expectations of removed behavior, untracked rationale.
4. **Batch hygiene.** Before starting, verify the working tree contains only this plan's work; flag unrelated changes to the human for separation. A plan's diff is its review surface.
5. **Tracked deviations.** Any deviation from the plan — a judgment call, a conflict resolution, a correction of the plan itself — is recorded in a tracked file (the plan or its addendum), never only in gitignored working files or conversation. Untracked rationale does not exist. **Provenance claims are verifiable facts:** never attribute work to a commit hash unless inspecting that commit confirms it; work in the current uncommitted diff is "this change (pending commit)," never history.
6. **Review-fix contradiction sweep.** After fixing a review finding, search the entire edited artifact for the finding's semantic terms, their synonyms, and their opposites. Verify that the objective, work, acceptance, verification, checklist, report, and "done" language all teach the same rule. Fixing the cited line is not completion if a nearby checklist still preserves the old meaning.
7. **Target-shape citation or rejection.** Any plan text that names an AIR/Flow/target shape must cite the exact authority that makes it real: a spec section, protocol line range, generated protocol snapshot, prototype source location, or checked-in derivation artifact. This applies to fields, adapters, route keys, artifact maps, manifests, provenance, evidence, policy locations, approval gates, `next`, `maxVisits`, and any other target noun. If the target location cannot be cited exactly, the plan must say `BAS0705`, later-track, or contract-decision gap. Plausible target nouns are not evidence.
8. **Held proof cannot finish a release gate.** A plan may allow held or degraded `WORLD` evidence inside an implementation loop when that is explicitly part of the recipe mechanics, but a final release gate, shipping gate, or "queue complete" gate cannot pass on held evidence. If release proof is held, the release slice remains incomplete and undeleted. Every checklist, report, and definition of done must repeat that rule consistently.

**Why these are mandatory — the cautionary case.** AI-BASIC's own Draft 1.9 cleanup (`RFC/RFC-CLEANUP.md` in the compiler repo) was a thorough plan: per-section landing instructions, a consumer-sweep table, slice routing, acceptance checks. Executed faithfully, it earned an **F** in hostile review — because every one of its High findings was a missing *directive*, not a missing *instruction*. Walking-spine examples in sibling planning files still taught syntax the plan had just rejected (directive 1 would have listed those files before editing). A slice absent from the plan's routing table still required the removed behavior (directive 2 — the routing table was treated as the complete consumer list). Stale version markers survived in footers and headers (directive 3). The plan told its executor *where to land changes*; it never ordered the executor to *prove the landing was complete*. This section exists to close that gap in every plan this policy governs.

## Stage 6 — Done Means Evidence

A plan is complete when its executor can hand the human **artifacts, not assurances**:

- the pre-edit sweep list and its dispositions;
- the derived verification results, each search named and its hits classified;
- the self-review findings (including "none found," stated explicitly per category);
- the review-fix contradiction sweep for any review-driven revision;
- exact citations for every target shape the plan relies on, or explicit `BAS0705` / later-track / contract-decision treatment;
- a review surface containing only this plan's work;
- deviations recorded in tracked text.

Held evidence is not release evidence. If a final release, shipping, or queue-complete gate depends on `WORLD` proof and that proof is held, the plan is not complete; it is waiting on proof.

`JUDGE` evaluates the work against the governing policy and the `DONE` standard; the human owns the commit. An executor's summary saying "done" carries no evidentiary weight on its own — in AI-BASIC terms, completion is `result IS Done`, never `PRINT "done"`.

## Forward-Only

Plans introduce no backward-compatibility shims, no dual paths, no "transitional" code. When a contract changes, every consumer changes in the same plan or is explicitly ruled out. Exceptions are named, scoped, and justified in the plan — silence is not an exception.

## The One-Line Summary

A wish names a desire; a stack names its territory; a plan is the contract that crosses between them. Write the plan so a stranger could execute it correctly — taxonomy verified, layers answered for, sweeps re-derived, evidence demanded — because the executor who reads it *is* a stranger, every time.


---

## Appendix — Common AI Bug Families (Planning / Slicing Side)

_Common AI bug-family appendix: the five seam/concurrency/destruction families AI writers and reviewers reliably miss. Self-contained; no external-repo references._

> **Planning/slicing-side appendix.** The five bug families (defined in the review-side appendix) (Second Writer, Reading-That-Writes, No-Fencing, Absent≠Unreadable, Destroy-on-Weak-Evidence) are **decomposition artifacts as much as coding errors.** They are caught in review and prevented in construction — but they are *made structurally likely or structurally impossible at slicing time*. This appendix is how a plan is decomposed so the AI executing the slices cannot introduce them. It does not restate the five families; read them once in the review-side appendix, then apply the slicing rules here.

## Why slicing is where these are won or lost

An AI executes one slice at a time, seeing only that slice's frame. If the plan splits an invariant across slices — the write in one, the guard in another; the delete in one, the identity-proof in another; two writers of one state in two different slices — then **no single execution pass ever sees the whole invariant**, and the bug is created by the gap between slices, not inside any one of them. The plan is the only artifact that sees all slices at once. That makes the plan the last line of defense that can make the invariant whole. A slice-level review cannot re-assemble what the plan tore apart.

## The slicing rules

### P1 — Name the single writer of each state, in the plan.
Before slicing, list every durable state the plan touches (a store, a file, a shared global). For each, name the ONE slice/component allowed to write it. Any slice that writes shared state must declare *which* state and assert it is the owner. If two slices would write the same state, that is a plan defect — merge the writers or route one through the other. **Prevents Family 1 by construction: you cannot accidentally create a second writer if the plan assigned the writer up front.**

### P2 — Keep an invariant whole within one slice. Never split capability from its safety.
The slice that adds a *capability* must, in the same slice, add the thing that makes it safe:
- adds a **delete/kill/overwrite** → same slice adds the strong-identity check that proves the target (Family 5).
- adds a **retry/accept-worker/cancel path** → same slice adds the fence/epoch guard (Family 3).
- adds a **read that precedes a destroy or default-write** → same slice adds the absent-vs-unreadable distinction (Family 4).
- adds a **write to shared state** → same slice adds the single-writer gate at the mutation point (Family 1).
- adds a **foreign-config touch** → same slice carries the "preserve all keys" requirement (merge-not-replace).

A plan that has "Slice 12: add cleanup" and "Slice 19: add the ownership check cleanup needs" has already built the bug, because Slice 12 can pass review and ship on its own. Capability and its safety are one slice or the plan is wrong.

### P3 — Sequence destroy-after-prove. Position is semantics.
Any slice that can delete/kill/overwrite must come *after*, and explicitly depend on, the slice that establishes strong-identity resolution for its targets. A cleanup/retirement/purge slice with no identity-proof prerequisite physically before it in the plan is a defect — even if the prose says "this will use the identity check." (This is your existing PLAN_RULES "position is semantics" rule, applied to the destruction families: a prerequisite exists only if it physically precedes its consumer.)

### P4 — Every state/file/retry/destruction slice declares its invariant and its failure-to-survive.
For each such slice, the plan carries two sentences: the invariant it must hold, and the specific failure it must survive (crash mid-write, reused PID, torn file, stop-pressed-mid-retry, offline dependency, concurrent writer). The executor inherits these instead of re-deriving them from a frame that can't see them. A slice touching these families with no declared failure-to-survive is under-specified.

### P5 — The changed-contract consumer sweep includes the writer set and the destruction paths.
Extend your existing "changed contracts require consumer sweeps" rule: when a slice changes a store, a record shape, a lifecycle state, or an id, the sweep must additionally answer — *who else writes this state, who else reads it into a mutation decision, and who deletes based on it?* A consumer sweep that lists callers but not the other writers/deleters cannot catch a Family 1 or Family 5 violation. Name them in the plan.

### P6 — Do not defer the safety of a family to "a later hardening slice."
"Ship the feature now, add the fencing/containment/identity check in a hardening pass" is the single most reliable way to ship the CRITICAL. The safety of a family is not tech debt to be scheduled; it is part of the definition-of-done for the slice that introduces the capability. If the plan defers it, the plan is deferring a data-loss bug into production.

## Slicing checklist (run while decomposing, before the plan is executable)

1. Did I list every durable state and name its ONE writer? (P1)
2. Does any slice add a capability whose safety lives in a *different* slice? Merge them. (P2)
3. Does every destroy/kill/overwrite slice physically follow its identity-proof slice? (P3)
4. Does every state/file/retry/destruction slice carry an invariant + failure-to-survive line? (P4)
5. Does the consumer sweep name the writer set and destruction paths, not just callers? (P5)
6. Is any family's safety deferred to a later hardening slice? Pull it forward. (P6)
7. Could a slice, executed alone by an AI that sees only its frame, introduce one of the five families? If yes, the plan — not the executor — is where to fix it.
