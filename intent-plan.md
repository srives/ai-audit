# intent-plan.md — Promoting the Intent Contract into the Governance Masters

**Date:** 2026-07-11
**Source:** `C:\repos\AI-BASIC\RFC\RFC-INTENT.md` (exploratory RFC, subordinate to the governance corpus)
**Scope:** the governance masters in `C:\repos\ai-audit\` (and their sync to `AI-BASIC\governance\`)
**Posture:** the RFC's own promotion ladder governs this plan — *governance prototype first, measured evidence, then promotion* (RFC §6, §9). Phase 1 uses "expected" language; MUST is reserved for Phase 2, after the three-plan experiment.

---

## Intent

*(This plan practices what it installs.)*

**Why this work exists:** AI workers that receive only the literal task make literal-but-wrong fixes — the diagnostic gets added but the stale artifact remains; the spelling is accepted but lowered to a no-op. Carrying the task's intent contract (why, must-remain-true, non-goals, failure shape) into plans, slices, prompts, and reviews gives workers a decision aid and reviewers a target beyond literal compliance.

**User value:** fewer literal-but-wrong implementations; reviews that can cite intent drift as a finding; tests that target the motivating failure.

**What must remain true:**
- The RFC stays subordinate and unpromoted — no bAsIc syntax changes, no spec edits.
- One canonical rule, many pointers (per `AI_AUDIT_GOVERNANCE_REVIEW.md`): the contract is *defined* in exactly two places (compact form and full form); everything else references it.
- Cognitive load does not increase in always-loaded files (`AGENTS.md`, `CLAUDE_.md`).

**Non-goals:** no `INTENT` keyword or language surface (RFC Options B/C are deferred); no engine/recipe metadata changes; no edits to `SURGICAL.md`, `PERSONALITY.md`, or the bAsIc contract files.

**Failure shape:** intent text sprayed redundantly across five files with drifting wording — the exact §10 anti-pattern the RFC warns against — or inspirational why-prose that no reviewer can test. Guardrail sentence installed everywhere the block is defined: *"Intent must be actionable and testable, or it is prompt noise."*

---

## Where intent already lives (do not duplicate)

Verified by grep before planning:

| File | Existing coverage | Gap |
|---|---|---|
| `MAKE_A_WISH.md` | why, non-goals, appetite, falsifiable success (step 6 line 67; skeleton ~line 101; grading table line 136) | no **failure shape**; bundle never named as a contract that must travel |
| `WISH_TO_PROMPT.md` | WISH-as-outcome (line 42), Boundaries/out-of-scope (line 63), acceptance criteria (line 67) | no **why / failure shape** field in the template |
| `PLAN_RULES.md` | Stage 0 reads wish's structured intent (line 46); **P4** requires invariant + failure-to-survive for state/file/retry/destruction slices (line 193) | no Intent block for plans; P4 covers only risky-slice families |
| `When-Design-Makes-Slices.md` | Objective / Acceptance / Verification fields | **zero** intent fields in the slice shape |
| `RUN_PLAN.md` | outcome/scope/non-goals in constraint extraction (line 98) and Phase 0 understanding (lines 299, 424) | no why / failure shape; no intent-conflict stop condition |
| `PR_TOUGH.md` | verifies code against "stated intent" of docs in passing (line 197) | no Intent Drift check anywhere |
| `TEST_RULES.md` | — | no motivating-failure-shape rule |

---

## Phase 1 — the RFC §9 experiment (apply now)

### Edit 1 — `When-Design-Makes-Slices.md` · canonical home of the COMPACT form

**Where:** Required Slice Metadata (§ at line 9) and the Deletion-Friendly Slice Shape template (lines 58–87).

**What:** insert the RFC §4 compact fields between `**Objective:**` and `**Work:**`:

```md
**Intent:** <why this slice exists — the failure or value it targets>

**Must remain true:** <invariant the slice may not break>

**Non-goal:** <adjacent work this slice deliberately does not do>

**Failure shape:** <what it looks like when this slice is done wrong>
```

Language: *expected for non-trivial or multi-file slices* (not yet MUST). Add a pointer: for state/file/retry/destruction slices these fields extend `PLAN_RULES.md` P4 — reference it, do not restate it. Add the §10 guardrail sentence here (this file defines the form).

### Edit 2 — `PR_TOUGH.md` · Intent Drift check (question, not gate)

**Where (a):** new **§2.4** in Preflight, after §2.3 (line 72):

```md
### 2.4. Intent drift.

If the plan, slice, or work agreement states an intent (why the work exists,
failure shape), ask: does the implementation satisfy the stated intent, or
did it merely satisfy the literal task while missing the reason the task
exists? Drift examples: a diagnostic is added but the stale artifact remains;
a spelling is accepted but lowered to a no-op; the test proves a fresh
directory stays clean but never seeds the stale case that motivated the fix;
the review checks only the named file though the intent protects a
cross-phase contract. If no intent is stated, report "no intent available" —
do not invent one.
```

**Where (b):** one sentence inside the **§6 Short Prompt** (line 275), so copy-paste users inherit the rule (the copyable-prompt-sync pattern from `AI_AUDIT_SEAM_REVIEW.md`).

**Explicitly not:** a §1 Hard Gate, and not a new defect category yet — both are Phase 2 promotions.

### Edit 3 — `WISH_TO_PROMPT.md` · intent travels in the generation prompt

**Where:** the template (starts line 36), new section immediately after `## The WISH (intent, as an outcome)` (lines 42–46):

```md
## Intent (why + failure shape)

Why this work exists: <the failure or value that motivated the WISH>
Failure would look like: <the observable wrong outcome if the executor
satisfies the letter but misses the reason>
```

Do **not** add non-goals here — `## Boundaries — out of scope` (line 63) already owns them. Add the §10 guardrail sentence in the "Why each part exists" section (line 197) so authors never water it into prose.

### Edit 4 — `MAKE_A_WISH.md` · complete the birthplace

**Where:** step 6 "Draw the boundaries" (line 67), the wish skeleton (~line 101), and the grading table (line 136).

**What:** add the one missing field — **failure shape** — to step 6 and the skeleton; add one sentence naming the bundle: *the why, non-goals, and failure shape are the wish's intent contract — they travel verbatim into the prompt, plan, and slices; downstream stages must not re-derive them.* Extend the Boundedness row of the grading table to include failure shape.

### Edit 5 — `AI-AUDIT.md` · the measurement arm

This is how RFC §9 step 4 ("compare review findings before and after") becomes checkable rather than vibes.

**Where / what:**
- §2.3 PR_TOUGH.md checks (~line 188): add `- [ ] Intent-drift question present (preflight + copyable prompt)`
- §2.4 RUN_PLAN.md checks (~line 220): add `- [ ] Intent restated in preflight (Phase 2 promotion — absence is LOW until then)`
- §5 Findings **Category** line (line 440): add `Intent-drift` to the category list
- §3 cross-file checks: add one check for the §10 anti-pattern — *intent contract defined in more than two places, or with drifting wording, is a finding*

---

## Phase 2 — promote only on evidence (do NOT apply yet)

Gate: run the RFC §9 experiment first — Intent blocks on the next three plans/slice recipes, Intent-Drift question in their reviews — and compare findings. Apply these only if workers made fewer literal-but-wrong fixes, reviewers caught more seam bugs, or tests targeted motivating failures more directly.

| # | File | Promotion |
|---|---|---|
| 6 | `PLAN_RULES.md` | Canonical home of the **FULL Intent block** (RFC §4 long form: why / user value / must remain true / non-goals / failure shape). New short section after Stage 0 Wish Hygiene (line 41): every plan carries `## Intent` derived from the wish; required for non-trivial slices only (answers RFC open question 1). |
| 7 | `RUN_PLAN.md` | Phase 0 understanding (lines 299, 424) gains "intent + failure shape"; constraint-extraction field list (line ~105) adds intent; new stop condition: *if intent conflicts with the plan or spec, stop and surface it — the spec wins until changed by RFC* (RFC §3). |
| 8 | `TEST_RULES.md` | One rule: **regression tests must seed the motivating failure shape**, not just prove the happy path. Point to the red-capable-loop rule in `PR_TOUGH2.md` §5 — do not restate it. |
| 9 | `PR_TO_PROMPT.md` | Each prx finding carries a one-line intent (why the fix exists) so the executor cannot make a literal-but-wrong fix. |
| 10 | `PR_TOUGH.md` | Promote Intent Drift from preflight question to formal defect category **§3.11** — RFC open question 2, answered by data. Consider a hard-gate floor only if drift findings recur. |

---

## Deliberately untouched (and why)

- **`AGENTS.md` / `CLAUDE_.md`** — always-loaded; adding intent rules there is the §10 redundancy anti-pattern and violates the load-size axis of `AI_AUDIT_GOVERNANCE_REVIEW.md`. The contract lives in per-task pipeline files.
- **`SURGICAL.md`** — its charter is minimal ceremony for deliberately narrow changes; an intent block contradicts its purpose.
- **`PERSONALITY.md`** — persona, not process (Pattern 5: separate persona from procedure).
- **bAsIc contract files** (`When-Reading-DONE.md`, `Markdown/YAML-bAsIc-Rules.md`) — only relevant if intent is ever promoted to engine/recipe metadata (RFC §8 Option B), which is explicitly deferred.
- **AI-BASIC specs / syntax** — out of scope by the RFC's own authority posture.

---

## Execution order and verification

1. Apply Edits 1–5 in this repo (the masters).
2. Verify: grep each edited file for `Intent` / `Failure shape` — the contract must be *defined* in exactly two canonical homes (`When-Design-Makes-Slices.md` compact now; `PLAN_RULES.md` full form in Phase 2) and *referenced* elsewhere.
3. Sync outward per README sync rules: copy the five edited files to `AI-BASIC\governance\` and confirm byte-identical.
4. Run the experiment: next three plans/slice recipes carry Intent blocks; their reviews use the new §2.4 question.
5. Collect evidence (review findings before/after, per RFC §9 step 4) — the new `AI-AUDIT.md` checks make adoption measurable.
6. Decide Phase 2 with data; record the decision back into `RFC-INTENT.md` (promote status or close as not-worth-the-load).

## Stop conditions

- Any Phase 1 edit forces restating a rule that already exists (P4, Boundaries, red-capable loop) → stop, point instead.
- The Intent fields start appearing as motivational prose in real plans → stop the rollout, tighten the guardrail wording first.
- Evidence after three plans is neutral or negative → do not apply Phase 2; the RFC's default answer stands (*governance first, engine metadata second, source syntax last*) and the Phase 1 fields get demoted to optional.
