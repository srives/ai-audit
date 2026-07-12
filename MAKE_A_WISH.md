# MAKE_A_WISH.md — turn a raw wish into a properly-stated wish

> **What this file is.** A generic, reusable process for converting a *haphazard request to an AI* into a **properly-stated wish** — the artifact that makes the next step (planning, then building) dramatically better. Drop this file into any project (or use it with no project at all). When you have a request, hand the AI your raw words **plus this file** and say *"make a wish."*
>
> **The premise, stated plainly:** the quality of the wish caps the quality of everything downstream. An underspecified wish forces the AI to silently guess your intent, your scope, and your definition of "done" — and it will guess wrong in ways you only discover after the work is built. A well-formed wish doesn't just describe what you want; it gives the solver an unambiguous target **without dictating the route**, which is exactly what produces strong, and competitively-plannable, results.

---

## 0. The three artifacts (know which one you're making)

There is a pipeline, and this file produces the **middle** one. Do not collapse them.

| Artifact | Question it answers | Who/what owns it |
|---|---|---|
| **Raw wish** | "Here's roughly what I want…" | the human, in their own words |
| **Proper wish** *(this file's output)* | "*Exactly* what outcome do we want, why, how will we know it's granted, and what's off-limits — with the HOW left open" | MAKE_A_WISH |
| **Plan** *(a later, separate step)* | "*How* we will achieve it, step by step" | a planner (often several, competitively) |

**The line you must never cross:** a wish describes the **destination and why**; it never prescribes the **route**. WHAT and WHY, not HOW. The moment a wish says "add a cache," "use a queue," "refactor module X," it has stopped being a wish and started being a (premature, single-threaded) plan — and it has robbed every future planner of the chance to find a better route. Keep the HOW open on purpose.

---

## 1. The Golden Rules of a good wish

A properly-stated wish is:

1. **Outcome, not output.** It names a *result in the world*, not a feature or task. ("A user can recover a lost draft" — not "add an autosave timer.")
2. **Grounded, not vibes.** The problem is anchored in concrete evidence (a real failure, a measurement, a quoted complaint), not "it feels bad."
3. **Falsifiable.** It states an observable test for "granted" — ideally one that *fails today*. If you can't tell whether it's been achieved, it isn't a wish yet.
4. **Bounded.** It says what's *out* of scope and names the non-negotiable constraints, so the solver can't drift or violate an invariant.
5. **HOW-free.** It deliberately leaves the route open and lists the open questions a planner must answer — so planning stays a real, competitive search.
6. **Plain.** Stated in jargon-free language a smart outsider could understand (Heilmeier's first rule).
7. **Singular.** One coherent desire. A bundle of five wishes wearing one trenchcoat must be split.
8. **Right-sized.** It signals appetite — roughly how much this is worth — so the solution can be scaled to the wish, not the reverse.

If a wish has all eight, it is **Granted-ready**. Missing a few: **Needs-shaping**. Missing most: still **Raw**.

---

## 2. Two modes (detect first)

**Detect the mode before anything else:**

- **Repo-Aware mode** — there *is* a codebase / project / body of context available. **Take the shape of that repo.** Read its real artifacts and let them ground the wish:
  - its **evidence** (code, tests, logs, incidents, metrics, docs) → ground the *problem* in something real, cited.
  - its **conventions & vocabulary** → state the wish in the project's own terms and house style.
  - its **constraints & invariants** (architecture rules, "never do X," forward-only/compat policy, governance files) → these become the wish's non-negotiable boundaries.
  - its **definition of done** (how this project proves things — tests, checks) → shape the success test in that currency.
  - When you assert a fact about the project, it must be **checkable** — point at the file/measurement, don't hand-wave.

- **Blank-Slate mode** — no repo, no project context (a brand-new idea, a different domain, a greenfield ask). Ground the wish in **domain reasoning plus explicit, labeled assumptions**:
  - Make every assumption **visible and marked as an assumption** ("Assuming a web app with ~thousands of users…"), so the human can correct it instead of inheriting a hidden guess.
  - Prefer reasoned defaults over interrogation, but ask the **few** questions that genuinely change the wish (see §5).
  - The success test is stated against the *intended outcome*, not against code that doesn't exist yet.

**One rule spans both modes:** never present a guess as a fact. In Repo-Aware mode, verify. In Blank-Slate mode, label it an assumption.

---

## 3. The process (what the AI runs when told "make a wish")

1. **Capture the raw wish verbatim.** Preserve the human's exact words; never overwrite the original intent with your interpretation.
2. **Detect mode** (§2) and gather context — scan the repo, or frame the domain.
3. **Find the real desire.** Separate the *stated request* from the *underlying outcome*. Ask "why do they want this?" until you hit the result they actually care about (the "5 Whys" / jobs-to-be-done move). People often state a solution ("add a button") when they want an outcome ("stop losing work"). Wish for the outcome.
4. **Ground the problem.** State current reality and its limits, backed by evidence (cited repo facts) or labeled assumptions (blank-slate). No grounding → no wish.
5. **Pin the success test.** Write the observable, falsifiable "granted" condition. Strongly prefer a test that would **fail today**. Vague success = vague result.
6. **Draw the boundaries.** Name constraints, invariants that must hold, explicit non-goals, and the appetite. This is where you protect the project from a technically-correct but destructive grant.
7. **Leave the HOW open.** List the open questions a planner must resolve. If you find yourself writing steps or naming a specific technology, stop — that belongs in the plan, not the wish.
8. **Self-grade** against the rubric (§6) and revise until it reaches Granted-ready, or until only human input can close the gap.
9. **Surface what still needs the human** — at most a few high-leverage questions (§5).
10. **Emit** the Proper Wish using the template (§4), plus the grade and any questions. If saving to disk, name it `wish-<short-kebab-slug>.md`.

---

## 4. The Proper-Wish template (the output)

```markdown
# WISH: <one plain-language line — the desired end state, no jargon>

> This is a wish, not a plan. It states what we want to be true and why,
> so a planner can decide how. It deliberately does not prescribe the how.

## The wish
<The desired end state, fuller, still in plain language. An outcome, not a task.>

## The problem (grounded)
<Current reality and its limits, anchored in evidence: cite the real artifact /
measurement / incident (Repo-Aware), or state labeled assumptions (Blank-Slate).
Pair the problem with the wish — never present one without the other.>

## Why it matters / who cares
<The difference if granted. Tie to a measurable value or a named stakeholder.
If nothing changes for anyone, it isn't worth wishing.>

## What "granted" looks like (success test)
<Observable, falsifiable criteria — outcomes, not steps. Prefer at least one
that would FAIL today. This is how anyone proves the wish was achieved.>

## Boundaries & non-negotiables
<Constraints that must hold, invariants that must not break, and explicit
NON-GOALS (what we are deliberately NOT doing). Protect against the
technically-correct-but-wrong grant.>

## Appetite (optional but recommended)
<Roughly how much this is worth — a size band, not an estimate. Lets the
solution be scaled to the wish.>

## Open questions for the planner (intentionally unanswered)
<The genuine forks a planner must decide. Keeping these open is what keeps
the HOW open and planning competitive.>

## Context & assumptions
<Repo-Aware: the real facts/conventions/invariants you grounded in (checkable).
Blank-Slate: every assumption, clearly labeled as an assumption.>
```

> Omit a section only when it genuinely doesn't apply (and say so). The first five sections are load-bearing; a wish missing any of them is not yet Granted-ready.

---

## 5. When to ask the human vs. assume-and-state

Do **not** interrogate. Ask only the questions whose answers would **materially change the wish** — the true forks (scope, the real outcome, a hard constraint, the success bar). Cap it at about **three**. For everything else, make a **reasoned, labeled assumption** and keep moving; a visible assumption the human can correct beats a stall. Reserve questions for what only the human can answer.

---

## 6. The quality rubric — right / in-between / wrong

Grade the wish on each dimension. This is the "is my wish stated well?" instrument.

| Dimension | ✅ Right (strong) | ◐ In-between | ❌ Wrong (raw) |
|---|---|---|---|
| **Outcome vs output** | names a result in the world | mixes result with a chosen feature | names only a task/feature |
| **Grounding** | cited evidence / labeled assumptions | partial / asserted | "it feels off" |
| **Falsifiable success** | observable test, fails today | fuzzy criteria | "make it better" |
| **Boundedness** | constraints + non-goals stated | constraints only | unbounded |
| **HOW-free** | route fully open, forks listed | hints at a solution | prescribes the solution |
| **Plain language** | an outsider gets it | some jargon | insider-only |
| **Singular** | one coherent wish | one wish + creep | a bundle of many |
| **Right-sized** | appetite signaled | implied | open-ended |

**Verdict:** all/most ✅ → **Granted-ready** · mixed → **Needs-shaping** (say what's missing) · mostly ❌ → **Raw** (reshape before any planning).

---

## 7. Anti-patterns (the wrong way — catch and fix these)

- **The Solution-in-Disguise** — "Add a Redis cache." That's a route. Recover the destination: *what outcome does the cache serve?* Wish for that; let the planner choose the cache (or something better).
- **The Vibe Wish** — "Make it faster / cleaner / better." No success test. Demand a measurable "granted."
- **The Mega-Wish** — five desires in one. Split into separate wishes; each gets its own success test.
- **The Jargon Wish** — unreadable without insider context. Restate in plain language (Heilmeier's rule).
- **The Unfalsifiable Wish** — no way to know when it's done. Add an observable test, ideally one that fails today.
- **The Boundless Wish** — no non-goals, no appetite. A solver will over- or under-build. Add boundaries.
- **The Assumption-Hider** — blank-slate guesses dressed as facts. Label every assumption.
- **The Premature Plan** — sequenced steps in the wish. Move them to the plan; keep the wish about the destination.

---

## 8. Worked example (generic)

**Raw wish:** *"The export feature is annoying, can we add a progress bar."*

**Why it's raw:** it's a Solution-in-Disguise (progress bar = a route), ungrounded ("annoying"), and has no success test.

**Properly-stated wish (excerpt):**

> **WISH: A user exporting a large dataset always knows the export is working and roughly how long is left.**
> **Problem (grounded):** Exports over ~50 MB take 20–90s with no feedback; support logs show users assume a freeze and retry, spawning duplicate jobs (cite: ticket cluster / metric).
> **Why it matters:** kills the duplicate-job load and the "is it broken?" support tickets; raises trust in the feature.
> **What "granted" looks like:** during any export >2s, the user sees continuous evidence of progress within 1s of starting; a user test shows zero "I thought it froze" retries on a 60s export (fails today).
> **Boundaries:** must not slow the export itself; no change to the export format; works for the slowest supported export.
> **Open questions for the planner:** progress bar vs streamed status vs time estimate vs background-with-notification — solver's call.

Note the progress bar is now *one option the planner may choose*, not the wish.

---

## 9. Output contract (what the AI returns)

When run, return: (1) the **filled Proper-Wish template** (§4); (2) the **rubric verdict** (§6) with one line on anything below "Right"; (3) at most ~3 **clarifying questions** (§5), or "none — assumptions labeled inline." If asked to save, write `wish-<slug>.md`. Do **not** produce a plan; planning is the next, separate step.

---

## 10. Provenance (what this synthesizes)

This process distills several established problem-framing and prompting traditions, which independently converge on the same skeleton (problem → why → who cares → falsifiable success → explicit non-goals → open route):

- **The Heilmeier Catechism** (DARPA) — plain-language objective, today's limits, what's new, who cares/what difference, risks, success "exams."
- **Shape Up** (Basecamp) — a pitch as Problem · Appetite · Solution-sketch · Rabbit holes · **No-gos**; and the rule "don't jump to *what to build* before establishing the problem."
- **Jobs-to-be-Done / outcome-orientation; the "5 Whys"** — wish for the underlying outcome, not the first stated solution.
- **SMART / INVEST / Specification by Example** — falsifiable, testable, single, right-sized success criteria.
- **Amazon "Working Backwards" (PR/FAQ)** — start from the desired end state and who benefits.
- **Modern prompt-engineering practice** — role/context/constraints/**success criteria & output contract**; "structure beats length."
- **Empirical basis:** the structure that produced strong, competitively-plannable `wish-*.md` files in practice — separating WHAT from HOW, grounding the problem in real evidence, defining "granted" as an observable test, naming non-negotiable boundaries, and leaving open questions for the planner.

**Sources:**
- [The Heilmeier Catechism — DARPA](https://www.darpa.mil/about/heilmeier-catechism)
- [Write the Pitch — Shape Up, Basecamp](https://basecamp.com/shapeup/1.5-chapter-06)
- [Risks and Rabbit Holes — Shape Up, Basecamp](https://basecamp.com/shapeup/1.4-chapter-05)
- [Claude prompting best practices — Anthropic](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)
- [Best practices for prompt engineering — OpenAI](https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api)
