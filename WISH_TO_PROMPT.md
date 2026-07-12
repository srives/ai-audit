# WISH_TO_PROMPT.md — How to turn an intent into an executable engineering prompt

## What this is

This is the **template for writing a generation prompt** — the file you hand an AI executor when you want it to *produce* work (a plan, a slice implementation, a document, an AIR recipe), not review it. Given a **WISH** (an intent stated as a desired outcome), the output is **one self-contained prompt** that wraps the intent in enough context, constraint, and a falsifiable definition of done that the result comes back clean and *checkable* — with no other context needed.

It exists for the same reason as its review-phase sibling `PR_TO_PROMPT.md`: **prompting rigor measurably improves results.** A WISH handed over as raw intent ("build the lexer") yields thrash; the same WISH wrapped in the real artifacts to ground in, the operating contract, the boundary of what *not* to do, and falsifiable acceptance criteria yields scoped, verifiable work. *Raise the floor with the prompt; catch the rest with the review loop.*

This is the **intent/generation-phase** member of the prompt-template family. `PR_TO_PROMPT.md` is the review-phase member. Both embed the same **Operating Contract core**. The crucial link between them: **the acceptance criteria written here are the same criteria the review judges against later.** Write them once, in outcome terms, and the prompt that *makes* the work and the review that *grades* it cannot drift apart.

> This template is the prose form of what a `SLICE` encodes structurally (source, layer, expert, evidence route, dependencies, objective, work, acceptance, verification, consumer sweep). We are getting the *ideas* into usable shape here; where they finally live in bAsIc — engine profile, governed artifact, or source surface — is a later decision.

## A generation prompt has these parts, always

- **(A) The WISH** — the intent, as a desired outcome, not an implementation.
- **(B) The Operating Contract** — the scaffold of *how* to work. A **universal core** (re-read, ground every claim, no target invention, decide-and-record, self-review) is invariant across every prompt; a **code-implementation extension** (targeted checks, discriminating tests, net-negative diffs, test hygiene) is added only when the task edits source or tests. A `plan` / `document` / `recipe` prompt that touches no code carries the core only — bolting on test-and-diff mechanics it will never run is the bulk this template exists to prevent.
- **(C) The fill-in body** — the variable payload: what to read, which expertise, what is in and out of scope, the falsifiable acceptance, and the evidence route.
- **(D) The Report footer** — what the executor fills in so the result is self-describing and ready to review.

A WISH without (B) and (C) is a coin flip. (B) and (C) without a real WISH have nothing to aim at.

---

## Procedure to produce a generation prompt

1. **Pin the WISH to an outcome.** Interrogate the intent until it states *what becomes true*, not *what to build*. "The binary rejects every invalid CLI form with a stable diagnostic" — not "write an arg parser." If you cannot phrase it as a checkable outcome, the prompt is not ready.
2. **Find what to ground in.** The strongest single lever. Name the real artifacts the work must be *transcribed from* rather than invented — the running engine (EngineerForge), an existing golden, the exact spec clause, the source file and line. "Ground in the codebase" is not grounding; name the files.
3. **Route to the stack and expert(s).** Name the layer expert(s) and the stack coordinator. A WISH that crosses layers names *every* expert it spans — under-routing a cross-cutting task to one expert defeats the routing.
4. **Write falsifiable, discriminating acceptance — the hinge.** Each criterion must be decidable by a test, a diff inspection, a spec clause, or the engine, *and* able to produce a NO against a wrong result. Write them exactly as the later `PR_TOUGH` review will judge them, so the making prompt and the judging review cannot drift. Define "complete" by the real call/route graph, never by output size.
5. **Draw the boundary.** State what is out of scope, what is later-track (inventory / stub / defer — do not build), and what is forbidden (shims, dual paths, scope creep). Overreach is the generative agent's most common failure; naming the edge is cheaper than reviewing it out.
6. **Choose the evidence route and rung up front.** Decide who or what proves the result — SELF / WORLD / HUMAN / DEFERRED — at what rung (deterministic > observation/read-back > AI judgment), and name the exact commands or oracle that will close it. Verification named *in the prompt*, not discovered after.
7. **Assemble the self-contained prompt:** WISH + the Operating Contract (the core always; add the code-implementation extension only if the task edits source or tests) + the fill-in body + the Report footer, keyed to the Phase. It must work handed over with no other context.

---

## The template (copy, then fill the angle-bracket fields)

```
# <short title> — generation prompt
**Date / Author / Phase (plan | slice | document | recipe) / Stack & expert(s)**

## The WISH (intent, as an outcome)
<One or two sentences: the outcome wanted, in outcome terms — what becomes true when this
is done. Not how to build it. "The compiler accepts and rejects the current CLI surface
with stable diagnostics," not "write an argument parser.">

## Definition of good
<What a good result looks like, beyond "it runs." The quality bar the WISH is reaching for.>

## Context to re-read first (ground the work in real artifacts)
<The canonical governance set — AGENTS.md, PROF.md, RUN_PLAN.md, PLAN_RULES.md, PR_TOUGH.md —
plus the SPECIFIC specs/ sections, source files, plan/slice, and any real running artifact
(EngineerForge behavior, an existing golden) this work must be transcribed from rather than
invented. Name them; do not say "the relevant files.">

## Stack / expertise
<Which layer and expert(s) this needs (e.g. catalogs/taxonomy/5300-language-compiler/<layer>/
Expert.md), plus the stack coordinator. A task that crosses layers names every expert it spans.>

## Operating Contract
<the universal core, verbatim; add the code-implementation extension only if this prompt's Phase edits source or tests — see below>

## Boundaries — out of scope
<What NOT to do. The milestone boundary. Surfaces that are later-track and must be inventoried,
stubbed, or deferred rather than built. The shims/dual-paths that are forbidden.>

## Acceptance criteria (falsifiable + discriminating — this is the hinge)
<The checkable definition of done. Each criterion is something a test, a diff inspection, a
spec clause, or the engine can decide — not an adjective — and must be *discriminating*: able
to produce a NO against a wrong result. Define "complete" by the real call/route graph, not by
output size. These are the exact criteria the later PR_TOUGH review will judge against, so
write them as the review would.>

## Evidence route & verification
<How the result will be proven: SELF (the compiler/tests decide), WORLD (a real external
artifact or the engine decides), HUMAN (a person must judge), or DEFERRED. State the rung you
expect — deterministic check > observation/read-back > AI judgment — and the exact commands
(dotnet test, dotnet fantomas src tests --check, doc-lint.ps1) or oracle that close it.>

## Required output
<The artifact to produce (and where), plus a filled-in Report footer. If the output is itself
a prompt or a governed record, name its required shape.>

## Report (fill in, then you're done)
<the canonical footer — see below>
```

---

## The canonical Operating Contract block (shared with PR_TO_PROMPT.md)

The contract is layered. The **universal core** goes in every generation prompt, verbatim, every phase. The **code-implementation extension** is added only when the task edits source or tests (typically the `slice` phase); omit it for `plan` / `document` / `recipe` generation, which produce an artifact and touch no code. Keying the contract to the phase is itself the discipline: a no-code prompt that carries `dotnet test`, net-negative-diff, and test-hygiene mechanics is bulk the executor must filter past — the slop this template exists to prevent.

### Universal core (verbatim — every phase)

```
You are addressing this handoff. Work under these rules (re-read them; do not work from memory):

- Re-read, don't recall. At start, after any interruption, and roughly every 30 minutes,
  re-read: this file, the slice/plan/spec it relates to, the artifacts you will touch
  (fresh from disk — the tree changes under you), and the canonical governance set:
  AGENTS.md, PROF.md, RUN_PLAN.md, PLAN_RULES.md, PR_TOUGH.md, and the relevant specs/ files.
- No unverified claim becomes a result. Ground every assertion in the real artifact — the
  file, the test output, the running engine (EngineerForge), the spec section. "It should
  work" is not evidence; cite file:line, a named test result, or a spec clause. This rule is
  load-bearing; the rest serve it.
- No target invention. Emit no external-contract shape — a Flow field, adapter, route key,
  schema key, or CLI form — unless it is verified from the prototype, protocol, a current
  passing golden, or the spec. Otherwise mark it deferred or name it an open decision; never
  guess a shape into existence.
- Decide and record; escalate only true gates. For an ordinary decision, make it on
  PROF.md / PR_TOUGH.md judgment, write one line in the Decisions footer, and continue — do
  not stop for routine input. Escalate to the human only for genuine governance gates: a
  spec/contract change (RFC), promotion of a later-track surface, or any destructive or
  outward-facing action. Never halt on a routine choice; never self-authorize a gate.
- Git authorization is explicit and per-ticket. The default governs: stage and summarize, do
  NOT commit or push without permission (AGENTS.md). Only if this handoff grants standing
  commit/push authorization do you commit and push without asking — and never bypass hooks
  or signing.
- Self-review every change under PR_TOUGH.md before it lands. Read your own delta against
  PR_TOUGH.md's categories; "none found" or fix. Any change made after the self-review
  re-enters the self-review on the new delta. Nothing lands without passing PR_TOUGH on the
  final delta.
- Done = the acceptance criteria met + the named verification green + self-review passed + the
  Report footer written (+ committed/pushed only if authorized).
```

### Code-implementation extension (add only when the task edits source or tests)

```
- Verify targeted, not wholesale. Run only the change-related checks that confirm or refute a
  finding (dotnet test on the touched area, dotnet fantomas src tests --check, doc-lint for
  docs). The full conformance suite runs at its defined gate, not per change. If you cannot
  run a single targeted check, say so as a finding and build a focused runner — do not fall
  back to running everything.
- After a check, fix what it surfaces — it's a loop. A red or flagged run is not "done." Fix
  the cause, re-review the fix, and re-run only that check. Don't report a failure and stop.
- Evidence discipline — make the work reviewable in minutes and the claims re-runnable. Produce
  a constraints.md: the before/after contract, the consumer sweep classified per file (edit /
  correct-as-is / out-of-scope+reason), and a post-edit sweep — re-run your search terms and
  record exactly what remains, proving no stragglers. Every claim is verifiable: paste the exact
  command and its result. "Swept everything" / "tests pass" without the command and result is not
  evidence.
- Discriminating tests + shared-seam sweep. Any test you add must fail against the old/broken
  behavior, not merely pass the happy path — a test that passes either way proves nothing. If a
  change touches a shared helper or a source-of-truth (used beyond your subsystem, or where a
  value is read from), sweep the whole tree, not just your subsystem, and add such a test.
- Surgical + forward-only + net-negative. Keep the diff to this handoff's scope. No shims, no
  dual paths, no "transitional" code, no backward-compat wrappers. Default to fewer load-bearing
  wires than you started with — delete what you replace. Net-positive lines only when justified —
  a new owned-boundary seam that removes scattered duplication, or a required safety fallback;
  say which. An abstraction added without removing the old wiring fails its own acceptance.
- Test hygiene. Add a test only when >=90% persuaded it is needed; when you do, remove a
  genuinely obsolete/redundant one if you find it (don't force it). Any test encoding a
  contract you changed is rewritten or deleted. The suite does not grow without cause.
```

## The canonical Report footer (fill in)

The core fields close every generation prompt. Add the code-implementation block only when the task edited source or tests.

### Core (every phase)

```
Outcome: <what is now true — against the WISH>
Acceptance: <each criterion — met? — evidence (file:line / test result / spec clause / oracle / inspection)>
Self-review (PR_TOUGH categories): none-found / fixes
Verification: <the named checks/oracle run and their results — not "looks good">
Evidence route closed at rung: <deterministic | observation | AI-judgment> — <how>
Decisions / deferrals: <one line each>
Out-of-scope surfaces touched: <none, or what and why deferred>
Committed + pushed: <hash(es), or "staged — not authorized to commit">
```

### Code-implementation extension (add only when source or tests were edited)

```
Change-related checks: <bundle(s), PASS, runtime>   (NO full-suite run)
Discriminating check: <the verification would have failed had the result been wrong — how>
Post-edit sweep: <search terms re-run — what remains — none / stragglers>
```

---

## What makes a generation prompt great (and how it fails)

- **Outcome, not implementation.** A great WISH states the result; a weak one pre-bakes a design. *Failure: "write a Pratt parser" instead of "expression precedence matches the spec."*
- **Grounded in named artifacts.** The single strongest lever. *Failure: "ground in the codebase" — hand-waving that gets skipped.*
- **Acceptance is falsifiable AND discriminating.** Every criterion can be decided and could produce a NO. *Failure: adjectives ("robust," "clean"), or a check that passes either way.*
- **Completeness is traced, not proxied.** "Done" is defined by the real call/route graph, not by how much output. A small change that closes the last gap is success; never ask for bulk to look thorough. *Failure: a prompt that rewards a big delta over the surgical one the work needs.*
- **The boundary is explicit.** Out-of-scope, later-track, and forbidden moves are named. *Failure: an unbounded WISH that invites later-track surface and shims.*
- **Verification is named up front.** The exact commands/oracle and the evidence rung live in the prompt, not in the executor's imagination. *Failure: "make sure it works."*
- **Self-contained.** The prompt carries the Operating Contract and everything needed. *Failure: a prompt that only works if you already hold the context.*

---

## Why each part exists (so an author never waters it down)

- **WISH as outcome, not implementation:** stating the result keeps the executor free to find the right *how*, and gives the review something objective to check. An implementation-shaped WISH pre-bakes a possibly-wrong design.
- **Context to re-read / ground in real artifacts:** the strongest single lever on quality. Work transcribed from a running engine or an existing spec clause is correct by construction; work invented from intent drifts. Name the artifacts so they actually get read.
- **Operating Contract:** the rigor is a fixed scaffold, not something the model re-derives per call. This is the part that must not rest on the executor's memory or goodwill. Its *core* is invariant; its code-discipline mechanics layer in only when the task edits code, so a no-code prompt stays as lean as the work — the template's own "structure beats length" rule applied to itself.
- **Boundaries / out of scope:** the most common failure of a generative agent is doing too much — building later-track surface, adding shims, expanding scope. Naming the boundary is cheaper than reviewing the overreach out.
- **Falsifiable acceptance as the hinge:** acceptance written as checkable criteria is what lets the same contract drive both generation and review. Adjectives ("robust," "clean") are unjudgeable and let the two halves drift.
- **Evidence route & rung:** decides up front *who or what* proves the result and *how strong* that proof is — deterministic over observation over AI judgment — so "done" means proven, not asserted.
- **Completeness traced, not proxied:** a prompt that implicitly rewards output size gets bulk, not correctness. Defining done by the real call/route graph asks for the surgical change the work needs — the same instinct the language itself encodes.

---

## On the template library

`PR_TO_PROMPT.md` (review → fix) and `WISH_TO_PROMPT.md` (intent → generate) are the first two members of a prompt-template family keyed by **phase**. More may follow — a plan-decomposition template, an architecture-specific template — but every member shares two invariants: the **Operating Contract core** (verbatim — the code-implementation extension is task-typed, added only when the prompt edits source or tests) and **falsifiable acceptance criteria** as the seam where the generating prompt and the judging review meet. Keep those two fixed and the library can grow without fragmenting the discipline.

## One-line summary

A generation prompt is a **WISH** welded to the canonical Operating Contract + the real artifacts to ground in + a falsifiable definition of done — so the work comes back scoped, grounded, and already shaped for the review that will judge it.
