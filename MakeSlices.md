# MakeSlices — Turning a Wish and a Taxonomy into a Slicing Plan

This prompt teaches an AI worker how to turn a wish plus an installed taxonomy stack into a slicing plan: horizontal taxonomy-layer slices, vertical walking-spine slices, and the ordering that makes them compose into a working system. `DESIGN` supplies it as guidance whenever it produces implementation slices.

This is a method document, not project documentation. It is generic: it applies to compilers, applications, services, and AI-orchestration programs alike. The required metadata shape of each produced slice is owned by `governance/When-Design-Makes-Slices.md`; this prompt owns the thinking that fills that shape.

## 1. The Slicing Prompt

The caller supplies: a wish (what to build), a rudimentary plan or specification when one exists, and a taxonomy stack path (the layered map of professional concerns for this domain).

The worker's job:

1. Read the wish and the taxonomy stack.
2. Walk **every layer** of the stack against the wish. For each layer, identify the work the wish implies in that layer — including the layers the wish does not mention, because the unmentioned layers (reliability, security, conformance, packaging, evolution) are where AI-produced plans silently fail.
3. Record the work as slices. Each slice names the taxonomy layer that owns it and the file path of that layer's `Expert.md` — the expert that should implement and review the slice. A slice with no named layer and expert is not a finished slice.
4. Define the walking spines required by §2 and design them by the method in §3.
5. Order the queue by the spine-first rule (§3.2).
6. Run the failure-mode checklist (§3.7) before declaring the plan complete.

The layer that owns a slice is the layer where the feature **first becomes real**, not the layer that eventually consumes the result.

## 2. Rule: Every Slicing Plan Must Include a Walking Spine

A slicing plan MUST NOT consist only of taxonomy-layer or subsystem slices. Before broad implementation work begins, the plan MUST define at least one **walking spine**: the smallest useful end-to-end path that passes through the real production pipeline from input to output.

The walking spine is a vertical proof slice. It crosses layers rather than completing any one layer. It should use the smallest honest feature that exercises the real architecture.

A valid walking spine MUST:

1. Start from a real user-facing input.
2. Pass through the real major phases of the system.
3. Produce a real user-facing or machine-consumable output.
4. Avoid shortcuts that bypass the intended architecture.
5. Include tests proving the path works end-to-end.
6. Remain intentionally narrow, even humiliatingly small.
7. Become the trunk that later horizontal slices attach to.

Horizontal taxonomy slices remain required. They preserve ownership, expertise, and phase discipline. But horizontal slices alone are not enough. A system is not real until one thin vertical path works.

Typical first-spine shapes by project type:

For compiler projects:

```text
source file → lexer → parser → binder → validator → IR
→ conformance check → emitter → output file → CLI exit code
```

For application projects:

```text
user action → input validation → domain logic
→ persistence or external effect → response/output → observable test result
```

For AI-orchestration projects:

```text
wish → clarified request → stack or policy selection → plan → one slice
→ attempt → generate → validate → judge → accept or reject → artifact/output
```

Every slice in the plan identifies which of three types it is:

- a **horizontal** layer slice,
- a **vertical walking-spine** slice, or
- an **attachment** slice that extends an existing walking spine.

No large surface area should be built before the first walking spine is green. A slice plan that lacks a walking spine is incomplete, even if all taxonomy layers are well defined.

## 3. The Vertical-Slice Method

### 3.1 The Two Kinds of Slices, and Why Both Exist

A **horizontal slice** completes part of one taxonomy layer. It preserves expert ownership, phase discipline, and deep coverage. A plan made only of horizontal slices can build excellent isolated branches that never compose into a working system — every layer 80% done, nothing runs.

A **vertical slice** (walking spine) crosses layers instead of completing any one of them. A plan made only of vertical slices degenerates into demo-driven hacking — paths that work, layers that rot.

The method: **vertical spines form the trunk; horizontal slices attach to it and deepen it.** Neither replaces the other.

### 3.2 The Spine-First Ordering Rule

A walking spine runs at its **earliest dependency-true position** — the first point in the queue where the slices it genuinely needs are complete. It does not wait for the full horizontal surface of the layers it crosses.

**No large surface area is built before the spine it serves is green.** If the queue schedules a broad layer slice before a spine that does not need that breadth, the queue is wrong: either move the spine earlier or shrink what stands before it.

Ordering signature of a healthy queue:

```text
foundations → SPINE → deepen → next capability's entry slices → SPINE → deepen → ...
```

Ordering signature of a sick queue (fix it):

```text
foundations → entire layer 1 → entire layer 2 → entire layer 3 → ... → first end-to-end proof
```

### 3.3 The Spine-Minimum Pattern

A spine that crosses a layer implements only that layer's **spine minimum**: the smallest honest piece of that layer's job that the spine program requires — nothing more. The later horizontal slice for that layer then deepens the green trunk.

Rules for the minimum:

1. **Minimal, never fake.** The spine passes through the real phase — a real (tiny) symbol table, a real (tiny) validator rule, a real (tiny) IR. Mocks, stubs that skip the phase, and shortcuts around the architecture disqualify the spine.
2. **The minimum is named in the spine slice.** Write explicit work items: "spine-minimum X: do exactly A and B; nothing else." Unbounded minimums grow until the spine becomes the layer.
3. **The deepening slice acknowledges the trunk.** The later horizontal slice for that layer extends what the spine built; it does not rebuild it.
4. **Intentionally narrow, even humiliatingly small.** A spine that feels embarrassingly trivial is correctly sized. Resist enrichment: every feature added to a spine program delays the proof the spine exists to deliver.

### 3.4 Choosing the Spine Programs

Each spine is one concrete scenario — for a language, a source program; for an application, a user action; for an orchestration system, a wish. Selection rules:

1. **The first spine proves the pipeline exists.** Choose the smallest input that touches every major phase and produces a real, verifiable output. One declaration and one terminator can be enough.
2. **One spine per major capability campaign.** When the plan contains a distinct capability family (a new subsystem, pipeline, or integration), that campaign gets its own spine, run after the campaign's entry slices (its grammar/schema/API surface) and minimal types, before its full surface. Campaign pattern: `entry slices → minimal types → SPINE → full surface`.
3. **The newest, least-proven contract gets the earliest spine.** When the plan introduces a contract that has never been exercised against its real counterpart — a new wire format, a new engine capability, a new protocol field — design a spine whose entire purpose is to prove that contract differentially against the real system at the first possible moment. Do not let broad horizontal work be the first thing to exercise an unproven contract.
4. **The system's core loop gets a spine.** Whatever the system fundamentally exists to do — compile and branch on a result, accept and fulfill an order, generate and judge and accept work — must have one spine that walks the whole loop, including the decision point. A pipeline proof without the decision point is not the core loop.

### 3.5 Required Shape of a Spine Slice

A spine slice uses the standard slice shape from `governance/When-Design-Makes-Slices.md`, plus spine-specific fields:

```md
## Spine N — <name> Walking Spine

**Source slice:** <source-id-or-description>

**Slice type:** walking-spine

**Layer:** Vertical (spans <layer-1>, <layer-2>, ...)

**Experts:** <every spanned layer's Expert.md path; domain general experts in addition, never instead>

**Depends on:** <only slices physically earlier in the queue>

**Sequencing note:** <which later slices this spine deliberately precedes, and
what spine-minimum work it carries inline for them>

**Objective:** <what end-to-end fact this spine proves, and why now>

**Spine program / scenario:** <the concrete input, complete and runnable>

**Required path:** <input -> phase -> phase -> ... -> verifiable output>

**Work:** <spine-minimum items, each scoped "do exactly X; nothing else">

**Output artifact:** <the durable proof: a golden, a passing E2E test, a validated artifact>

**Acceptance:** <including: the path traverses real phases; no architecture bypass;
negative tests for what the spine deliberately rejects>

**Verification:** <commands; external oracle validation when one exists>
```

Hard rules learned from review failures:

1. **`Depends on` is machine-checkable metadata and must be true and complete.** List every slice whose output the spine body consumes — all of them physically earlier in the queue. Never bury "runs before X" prose inside the `Depends on` line; that belongs in the `Sequencing note`. A queue checker reads `Depends on` literally.
2. **Every construct in the spine program must have an owner.** Walk the spine program token by token: each syntax form, schema field, API call, or type it uses must be routed to a preceding slice or to the spine's own spine-minimum work. A spine that uses a construct nobody builds dies at the first phase — discovered only at implementation time.
3. **The dependency map and the queue order must tell one story.** If the master plan's dependency table says the spine needs layer slice X but the queue runs the spine before X, state the resolution explicitly in both places: the spine carries the X-minimum inline, and X deepens afterward. Contradictory metadata makes the plan mechanically untrustworthy.
4. **Slice labels are stable; execution order is file order.** When spines are repositioned, do not renumber the world — state the rule once: numbers are labels, position is the schedule.
5. **Use the external oracle from the first spine that can reach it.** If a real validator, reference implementation, or production counterpart exists for the output, the spine's verification calls it — and reports "oracle unavailable" separately from "spine broken."

### 3.6 Attachment Slices

After a spine is green, horizontal slices that extend it are **attachment slices**. An attachment slice:

- names the spine it extends in `Depends on`;
- widens the trunk (more syntax through the same path, more fields through the same schema, more cases through the same loop) without re-architecting it;
- keeps the spine's goldens green — a broken spine golden means the attachment changed the trunk's behavior and must say so deliberately.

Every horizontal slice positioned after a green spine implicitly attaches to it.

### 3.7 Failure Modes To Check Before Finalizing the Plan

Run this checklist over the finished plan:

1. **Late spine** — a spine scheduled behind broad horizontal surface it does not need. Move it to the earliest dependency-true position.
2. **Fat spine** — a spine program with features the proof does not require, or spine-minimum items without a "nothing else" boundary. Shrink it.
3. **Fake spine** — a path that bypasses a real phase with a mock or shortcut. It proves nothing; rebuild it through the real architecture.
4. **Orphan construct** — anything in a spine program that no preceding slice and no spine-minimum item builds. Route it or remove it.
5. **Lying metadata** — `Depends on` that omits real dependencies or names later slices; dependency tables that contradict queue order. Fix the metadata, not the checker.
6. **Unproven contract exercised late** — a new external contract first touched by broad work instead of a dedicated early spine. Add the spine.
7. **Missing core-loop spine** — pipeline proofs exist but the system's decision loop has none. Add it.
8. **Uncovered layers** — taxonomy layers the wish never mentioned and the plan never visited. Walk the stack again; the silent layers are the dangerous ones.
9. **No deletion path** — spines and slices that get relabeled "done" instead of deleted from the executable queue. Completed sections are deleted, per the recipe-ready rules.

### 3.8 Worked Shape (Generic)

For a system with phases `input → A → B → C → output` and two capability campaigns X and Y:

```text
1. foundations for A (entry-level)
2. foundations for B (entry-level)
3. SPINE 1: trivial input through A→B→C to verified output      [walking-spine]
4. A in full                                                     [attachment]
5. B in full                                                     [attachment]
6. C in full                                                     [attachment]
7. X entry slices (surface/grammar/schema)
8. SPINE 2: smallest X scenario end-to-end                       [walking-spine]
9. X full surface                                                [attachment]
10. SPINE 3: core decision loop end-to-end, oracle-validated     [walking-spine]
11. Y entry slices → SPINE 4 → Y full surface
12. cross-cutting hardening (conformance, packaging, evolution)
```

The plan is complete when every major phase, every capability campaign, the core loop, and every unproven external contract each have a green-able spine — and nothing broad runs before the spine it serves.
