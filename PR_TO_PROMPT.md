# PR_TO_PROMPT.md — How to turn a code review into an executable handoff prompt

## What this is

This is the **spec for writing a `prx.md`** — a single-use review file, named per review and deleted once its findings are addressed. When the instruction is *"do a code review, write your analysis to `prx.md`, and make it fully executable per `PR_TO_PROMPT.md`,"* the output is **one self-contained file that is both (A) a hostile code review under `PR_TOUGH.md` and (B) an executable prompt** an AI executor can run to fix every finding — with no other context needed. Hand it over and say *"do `prx.md`,"* and it works.

It exists because **prompting rigor measurably improves results.** Loose prompts produce thrash, regressions, and lost days; prompts that embed the full operating contract produce clean, scoped, checkable work. *Raise the floor with the prompt; catch the rest with the review loop.* A `prx.md` is both at once.

This is the **review-phase** member of a small family of prompt templates. Its forward-phase sibling is `WISH_TO_PROMPT.md`, which turns an *intent* into a generation prompt. Both embed the same **Operating Contract** (below); the acceptance criteria are the hinge that keeps the two halves — the prompt that *makes* the work and the review that *judges* it — speaking one contract.

## A prx.md has two halves, always

- **(A) The Review** — adversarial analysis under `PR_TOUGH.md`: grade, acceptance-vs-diff check, findings by severity, and what the implementer got right.
- **(B) The Prompt** — the embedded **Operating Contract** + an ordered **work-list** derived from the findings + a **Report footer**. This is what makes it *executable*, not just a critique.

A review without (B) is not done. A prompt without (A) has nothing to fix.

---

## Procedure to produce a prx.md

1. **Capture state.** `git status --short`, `git log` to find the commit(s) under review, `git diff` / `git show` the change. Read any implementer artifact (`constraints.md`, the report, the slice/ticket the work implemented).
2. **Review adversarially under `PR_TOUGH.md`** (every category, in severity order). Verify the diff against the **acceptance criteria** of the slice/plan it implemented. Distinguish **introduced vs pre-existing** findings (check against the baseline commit). For large diffs, parallelize the reading with subagents and synthesize the verdict yourself.
3. **Verify, don't just read — but targeted only.** Run *only* change-related checks to confirm or refute a finding (`dotnet test` on the touched area, `dotnet fantomas src tests --check`, `doc-lint.ps1` for docs, EngineerForge prototype behavior for AIR shape). **Re-run the executor's own verification commands** (the `constraints.md` sweep, the named tests) — claims are leads, not proof. **Never run the full conformance suite to review.** If you cannot run a single targeted check, say so as a finding (and tell the executor to build a focused runner).
4. **Trace call paths; never infer completeness from diff size.** A *small* diff can mean prior work already did most of it — a small or net-neutral change that closes the last real gap is **success**, not "incomplete." A *large* diff can hide an abstraction added without deleting the wires it replaced. Judge consolidation by following the actual call paths (who routes through what), not by `+/-` counts.
5. **Grade** on the 0–100 letter scale (below) and decide the verdict.
6. **Write the file** with all the Required Sections, including the verbatim Operating Contract block and the work-list + Report footer that make it executable.

---

## Required sections of a prx.md (the template)

```
# PRx — <slice/feature> — "<commit subject>" (<hash>)
**Date / Reviewer posture (PR_TOUGH + PROF) / Slice or plan / Drift Score: <NN>/100 — <letter> — <verdict>**
<2–3 sentence summary + verdict>

## Operating Contract (this file is a handoff prompt — re-read; do not work from memory)
<the canonical block, verbatim — see below>

## Acceptance-vs-Diff Matrix
<table: each acceptance criterion → met? → evidence (file:line / test / spec clause)>

## Findings By Category
### CRITICAL / HIGH / MEDIUM / LOW
<each: Category (PR_TOUGH §), Type (introduced|pre-existing), File:line, What, Why it matters, Fix>

## What The Implementer Got Right (do NOT undo)
<list — protect the good work>

## Your Task — address these findings (work-list, in order)
<the findings turned into ordered, surgical steps>

## Report (fill in, then you're done)
<fill-in footer — see below>
```

---

## The canonical Operating Contract block (copy verbatim into every prx.md and slice handoff)

> Adjust only the filename in the first bullet and the test-bundle names to the subsystem. Everything else is fixed.

```
You are addressing this handoff. Work under these rules (re-read them; do not work from memory):

- Re-read, don't recall. At start, after any interruption, and roughly every 30 minutes,
  re-read: this file, the slice/plan/spec it relates to, the source files you will touch
  (fresh from disk — the tree changes under you), and the canonical governance set:
  AGENTS.md, PROF.md, RUN_PLAN.md, PLAN_RULES.md, PR_TOUGH.md, and the relevant specs/ files.
- No unverified claim becomes a result. Ground every assertion in the real artifact — the
  file, the test output, the running engine (EngineerForge), the spec section. "It should
  work" is not evidence; cite file:line, a named test result, or a spec clause. This rule is
  load-bearing; the rest serve it.
- Decide and record; escalate only true gates. For an ordinary decision, make it on
  PROF.md / PR_TOUGH.md judgment, write one line in the Decisions footer, and continue — do
  not stop for routine input. Escalate to the human only for genuine governance gates: a
  spec/contract change (RFC), promotion of a later-track surface, or any destructive or
  outward-facing action. Never halt on a routine choice; never self-authorize a gate.
- Git authorization is explicit and per-ticket. The default governs: stage and summarize, do
  NOT commit or push without permission (AGENTS.md). Only if this handoff grants standing
  commit/push authorization do you commit and push without asking — and never bypass hooks
  or signing.
- Verify targeted, not wholesale. Run only the change-related checks that confirm or refute a
  finding (dotnet test on the touched area, dotnet fantomas src tests --check, doc-lint for
  docs). The full conformance suite runs at its defined gate, not per change. If you cannot
  run a single targeted check, say so as a finding and build a focused runner — do not fall
  back to running everything.
- After a check, fix what it surfaces — it's a loop. A red or flagged run is not "done." Fix
  the cause, re-review the fix, and re-run only that check. Don't report a failure and stop.
- Self-review every diff under PR_TOUGH.md before it lands. Read your own delta against
  PR_TOUGH.md's categories; "none found" or fix. Any change made after the self-review —
  including a test-driven fix — re-enters the self-review on the new delta. No change lands
  without passing PR_TOUGH on the final diff.
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
- Done = the acceptance criteria met + change-related checks green + self-review passed + the
  constraints.md and Report footer written (+ committed/pushed only if authorized).
```

## The canonical Report footer (copy into every prx.md, tailor to the findings)

```
Per finding: <#id — what you did — file:line>
constraints.md: <path — before/after contract + per-file consumer sweep>
Self-review (PR_TOUGH categories): none-found / fixes
Change-related checks: <bundle(s), PASS, runtime>   (NO full-suite run)
Tests added: <0, or why >=90% persuaded; each fails against the old behavior> ; obsolete test removed: <which, or none found>
Post-edit sweep: <search terms re-run — what remains — none / stragglers>
Net line delta: <<= 0, or net-positive + which seam/fallback justifies it>
Decisions / deferrals: <one line each>
Committed + pushed: <hash(es), or "staged — not authorized to commit">
```

---

## Grading & verdict conventions

- **0–100 with letter** (A 90+, B 80+, C 70+, D 60+, F <60), per `PR_TOUGH.md`'s Architectural Drift Score. Deduct hardest for `PR_TOUGH.md` Category 1 (spec/code drift) and Category 2 (pipeline boundary), then EngineerForge alignment (4.5) and feature-gate violations (4.6), then F#/AST/diagnostic drift (3–5), then test and documentation discipline (6–7). A contract change without a consumer sweep is a critical-tier deduction.
- **Verdict:** BLOCK (spec drift, pipeline-boundary or orchestrator-schema break, safety guard disabled) · REWORK (significant drift, missed consumers) · MERGE-WITH-FOLLOW-UP (minor/fixable) · MERGE.
- **Introduced vs pre-existing** must be labeled — never grade the implementer down for debt they merely sat beside.
- **Net-negative surface** is a first-class criterion: a consolidation that *added* an abstraction without deleting the wires it replaces has failed its own acceptance, even if it works. **But** a small or net-neutral diff is *correct* when prior work already consolidated most paths — verify by tracing the call paths, and do not down-grade complete-but-small work or pressure an executor to manufacture a larger delta.
- **Evidence over assertion:** cite `file:line`, a named test result, a spec clause, or a commit hash; re-run the executor's stated sweep/test commands yourself. "Tests pass" without naming the bundle and result is not evidence.
- **A targeted check buried in a slow suite that times out before reaching it is still verifiable** — run the single named test or its direct fixture. A timeout is a speed problem, not a coverage gap; don't grade it "unverified."

---

## Why each rule exists (so an author never waters it down)

- **Re-read / no-memory:** agents drift from memory and get killed mid-run; the working tree changes under them (concurrent edits, prior commits). Re-reading is the only reliable cure.
- **No unverified claim:** this is the whole reason the discipline exists. A plausible-but-unchecked claim that becomes a "result" is the defect that compounds. Grounding in the real artifact is non-negotiable.
- **Decide-and-record, escalate gates:** the loop (self-review + targeted checks) is the gate for routine work, not the operator — pausing for ordinary input is dead time. But our system has real governance gates (spec RFCs, later-track promotion, destructive/outward-facing actions); those still belong to the human.
- **Git authorization explicit:** the canonical rule is "no commit without permission." Standing authorization is a per-handoff exception, never a default and never an override smuggled into a template.
- **Targeted checks + full-suite-only-at-its-gate:** a single full run to review costs hours and teaches nothing a targeted check wouldn't. Targeted per change + one run at the defined gate = velocity without flying blind.
- **After-check-fix + self-review loop:** a check-driven fix is unreviewed code; that is exactly where regressions slip in. The loop re-reviews the final diff.
- **Evidence discipline:** a review you cannot re-run is one you have to take on faith. A `constraints.md` plus a *post-edit sweep* that re-runs the search terms turns "I swept everything" into a checkable fact, and pasting the command with its result makes every claim re-runnable.
- **Discriminating tests + shared-seam sweep:** a test that passes whether or not the defect is present proves nothing — only a test that *fails against the old behavior* is evidence. A shared seam changes behavior beyond its subsystem, so both its test and its sweep must reach the whole tree.
- **Test hygiene:** a bloated suite *is* the slow beast. Every added test is a permanent runtime tax — it must earn its place, and obsolete ones must go.
- **Surgical / forward-only / net-negative:** the goal is fewer load-bearing wires. Adding abstractions on top of old ones is how a codebase becomes unmaintainable in the first place.

---

## One-line summary

A `prx.md` is a hostile `PR_TOUGH.md` review **welded to** the canonical Operating Contract + a finding-by-finding work-list + a Report footer — so the same file that *diagnoses* the problems is the file that *fixes* them when you hand it back.
