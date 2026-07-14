# TEST_RULES.md

## Purpose

Canonical testing governance, designed to be shared across repos — the same sharing model as
`RECIPE_RULES.md`. It governs what a valid test *is*, which changes require which tests, and
how a test is judged — so a codebase is defended against the failure modes that ship past both
the AI writer **and** the AI reviewer.

The evidence base spans two codebases: a whole-codebase adversarial review
(~90 findings, 8 CRITICAL data-loss bugs, all written AND reviewed by frontier models), and an
independent seam-bug audit of a second, unrelated codebase
(2026-07-06 — 8 seam findings that survived red-first authorship and 2–3 adversarial review
rounds each). Same lesson twice, different codebases, different languages: **the bugs that
ship are the ones no test tried to cause.**

In each adopting repo this file is a first-class peer of the other governance documents:
- `PLAN_RULES.md` — how plans are written.
- `RUN_PLAN.md` — how plans are executed.
- `PR_TOUGH.md` — how work is reviewed.
- `RECIPE_RULES.md` — how the orchestration enforces the above (always engine-canonical in the mastering repo).
- **`TEST_RULES.md` — how the work is tested.**

Where a testing question arises, this file is canonical. It sits below the adopting repo's
`AGENTS.md`, `PR_TOUGH.md`, and production code and never overrides them. The teach / onboarding
layer — mental model, director's phrase-book, practice loop — lives in
`FABLE5-TESTING-SUGGESTIONS.md` (the mastering repo); the enforceable rules live here. Edit the
rules here, not there.

**Founding principle:** a test proves the code **survives**, not merely that it **works**. The bugs that ship are the ones no test tried to cause.

---

## The core principle — Red-First

A valid test for a defect **fails on the unfixed code and passes only after the fix.**

- "The test passes" is **not** evidence.
- "It failed without the fix and passes with it" **is** evidence.

Red-first is the definition of a test that counts, and it is the single proof that a reviewer — even one who does not read code — can verify by eye (a failing run, then a passing run). Every rule below rests on it.

---

## The Rules

### T1 — Failure-to-survive is declared, then tested
Every seam-touching change declares its **failure-to-survive** — the specific bad event it must withstand (crash mid-write, stale worker finishing late, reused PID, locked/torn file, Stop pressed mid-retry). *(Planning slices declare this under `PLAN_RULES.md`; construction restates it at the seam under `RUN_PLAN.md`.)* This rule adds the second half: **the change's test must induce exactly that declared failure.** A declared failure-to-survive with no inducing test is an incomplete change.

### T2 — Red-first is the merge gate, not "tests pass"
A change does not pass on "the suite is green." It passes on the **red-first proof**: the test demonstrably failed on the code *without* the fix and passes *with* it. Acceptable proof is the recorded failing run, or a reviewer confirming the test fails when the fix is reverted. **No red-first proof → revise.**

### T3 — Seam-touching changes require a fault-injection test
A change that touches **durable state, files another process may touch, retry/cancel/worker-acceptance, or deletion/kill/overwrite** must carry a test that *induces its family's fault* (see the Fault Catalog). A seam-touching change with only happy-path/contract tests **fails the gate** — happy-path coverage is necessary but never sufficient for a seam.

### T4 — The reviewer classifies the test, not just runs it
For each seam-touching change, the reviewer **names which bug family's fault the test induces** and confirms it is red-first-proven. "Looks tested" is not a reviewable claim. The family + the induced fault + the red-first proof are named, checkable claims. (Mirrors the recipe seam-safety classification, `RECIPE_RULES.md` R3.)

### T5 — A standing fault-injection harness, reused not reinvented
Fault primitives are shared infrastructure, not per-test one-offs. **The rule is universal; the
primitive list is per-repo** — each adopting repo names the primitives for ITS actual seams, in
its own testing home, and new seam tests extend that toolkit rather than fork it.

- *Example (a PowerShell orchestration repo):* a fake child that floods stderr / hangs; a
  two-writer lease fixture; an abandoned-mutex fixture; a torn-tail journal fixture; a
  reused-PID fixture; a paginated-grid key-sequence; an offline-dependency toggle; an
  injectable atomic-write failure — homed in a shared `testing/faults/` toolkit.
- *Example (a C# repo), as the model for other adopters:* a fake child process that never drains
  stdin / exits before reading; a two-writer race fixture (custody file, catalog row,
  content-address); a torn/truncated-file fixture; a stale-generation replay; an
  offline-dependency toggle; an injectable atomic-write/flush failure — homed in a dedicated
  TestKit project beside its `Doubles/` and `Contracts/`.

*(Testing governance is extensible — new canonical rules land here as T6, T7, …. Keep each rule enforceable and checkable: a rule that cannot be checked is a wish, not a rule — `PERSONA.md`.)*

---

## The Fault Catalog (reference)

The trigger for T3. For each bug family (defined in the `COMMON_AI_PROBLEMS_*` appendices): the **fault to inject** → the **assertion**.

| Family | Inject this fault | Assert this |
|---|---|---|
| 1 — Second writer | two writers hit the same state concurrently | no lost update / no clobber; one clean winner |
| 2 — Read that writes | call the read/Get/Test a thousand times | nothing on disk or in shared state changed |
| 3 — No fencing | replay a stale / already-replaced worker's result after the world moved on (cancel, step advance) | it is **rejected**, not accepted |
| 4 — Absent ≠ unreadable | lock the file / leave a half-written last line / take the container offline | code does **not** treat it as absent and does **not** destroy it |
| 5 — Destroy on weak evidence | reuse a PID / collide a filename fragment / point a delete at a look-alike | the wrong thing is **not** killed / deleted |

---

## What counts as a "seam-touching" change (the T3 trigger)

Any change that: writes durable state (a store, a file, a shared global); reads a file another process may be writing; accepts work that can time out, retry, restart, or be cancelled; or deletes / kills / overwrites / truncates. A change touching none of these surfaces needs only its ordinary happy-path and contract tests; T3/T4 do not fire.

---

## Test-Quality Bar — how to reject a fake test

A test that meets none of these is a happy-path test in disguise; send it back:
- It only asserts the **success** path → require the failure induction (T3).
- It was **never shown red** → require the red-first proof (T2).
- It **mocks away the exact thing that breaks** (stubs the file read so the lock/torn case can't occur) → require the *real* fault be induced.
- It asserts *"no error was thrown"* but not *"the correct safe outcome happened"* → require the specific safe outcome be asserted.

---

## Wiring (how the other governance invokes TEST_RULES — per adopting repo)

The rules are inert until the adopting repo's OWN governance points at them; workers read
`PR_TOUGH.md` and `CLAUDE.md`/`AGENTS.md`, not this file, unless told to. Minimum live wiring:

- **`PR_TOUGH.md`** (the load-bearing pointer — the reviewer reads it fresh every pass): in its
  Test Discipline category, require T2 (red-first proof, not a green suite), T3
  (fault-inducing test on every seam-touching change), and T4 (the reviewer NAMES the induced
  fault family). This single pointer is what makes enforcement real.
- **`CLAUDE.md` / `AGENTS.md`** — list `TEST_RULES.md` in the governance-files section so every
  session and worker discovers it.
- **`PLAN_RULES.md`** — each seam slice *declares* its failure-to-survive in its slice text →
  feeds **T1**. **`RUN_PLAN.md`** — red-first as the definition of done (T1/T2).
- **`RECIPE_RULES.md`** (engine-canonical) — the recipe's review gate consumes PR_TOUGH's
  verdict, which carries T3/T4 once the pointer above exists.

---

## Sharing model (how a repo adopts this file)

Mastered here; two adoption modes, mirroring `RECIPE_RULES.md`:

1. **Reference by absolute path** (the mastering repo's `TEST_RULES.md`) — zero drift, right
   for tools and recipes that take a path input.
2. **Adapted copy at the adopting repo's root** — right when the repo's workers read root
   governance files (the common case). An adapted copy MUST change exactly four things and
   nothing else:
   - **Project naming** in Purpose (workers demonstrably set aside governance naming a foreign
     project).
   - **The T5 primitive list**, rewritten for that repo's actual seams and testing home.
   - **The wiring pointers**, added to that repo's `PR_TOUGH.md` + `CLAUDE.md`/`AGENTS.md`.
   - **No dangling references** — anything not present in the adopting repo is repointed to its
     canonical path in the mastering repo or pruned.
   T1–T4, the Fault Catalog, the seam-touching definition, and the Test-Quality Bar are the
   invariant core: if an adaptation changes those, it is a fork, not an adoption — bring the
   change here first (they land as T6, T7, … for every repo at once).

**Adoption record:** first adopting repo — adapted copy, 2026-07-06, wired via its
`PR_TOUGH.md` Category 6 and `CLAUDE.md` governance list; binding forward-only from adoption,
never retroactive against already-landed slices (the precedent adaptations should follow).
