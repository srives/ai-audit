---
name: ai-audit-long
description: Audit a repository's AI health — the quality of the governance files and review discipline that steer AI coding agents in this repo. Grades CLAUDE.md, AGENTS.md, PR_TOUGH.md, RUN_PLAN.md, and .claude/ against current best practice, project fit, cross-file coherence, and cognitive load. For cognitive load it traces the full set of instruction files loaded into every prompt — CLAUDE.md and its @-imports, AGENTS.md, .cursorrules and peers — and counts the total directives against the model's attention budget (~150 usable, ~50 already spent by the agent harness) to flag governance that has grown past what the model can actually hold and will silently drop. PR_TOUGH.md is treated as the unified review framework (the former PR_TOUGH2.md is merged into it); if a repo keeps PR_TOUGH.md and PR_TOUGH2.md as separate files, the two are treated together as one framework and used only as a coverage checklist — the audit verifies its ideas appear somewhere across both, and never recommends consolidating them. It produces a graded findings report (per-file A–F, severity-ranked findings with file:line and the smallest fix). Never edits your governance without consent. When the repo's review governance is missing (no PR_TOUGH.md / RUN_PLAN.md) it offers to deposit a starter pack and tailor it to your repo; once those exist it stays hands-off. Only when it installs that review pack does it also touch CLAUDE.md / AGENTS.md — your own shared-standard files — offering a starter if absent or an additive merge of missing concepts if present, never overwriting; if you already have the review governance, it leaves CLAUDE.md/AGENTS.md untouched. Use when someone asks to audit AI health, review governance files, check CLAUDE.md/AGENTS.md quality, set up governance for a repo that has none, or find governance drift, staleness, contradictions, or missing agent coverage. Trigger even when "skill" isn't said.
---

# AI Audit

Turn a repo's governance files into a **graded, cited report of what's wrong and
how to fix it** — a linter for the instructions that steer AI agents, not for the
code — and, for a repo that has **no** governance, offer to lay down a starter pack
and tailor it. This skill is **hands-off on governance you already have**: it grades
existing files and never edits them. The only files it may write are *missing*
starter-pack files, once, with your explicit consent.

## When to use

- Someone asks to "audit AI health", "review our governance files", or "check
  whether CLAUDE.md is any good".
- A repo's governance was copy-pasted from another project and you suspect drift —
  stale stack, wrong build commands, contradictions.
- Governance has grown so long you doubt the agent still keeps the critical rules
  in mind.
- New agents (Codex, Cursor, Copilot) are in use but only `CLAUDE.md` exists.
- **A repo has no governance at all** and you want to stand it up, tailored.

## Deliverables

- **Always:** `ai-audit-long-findings.md` — per-file A–F grades, severity-ranked
  findings (each with file:line, what's wrong, why it costs you, the smallest fix),
  cross-file conflicts, project-fit gaps, top-5-by-impact.
- **With consent, when installing governance:** missing review-governance files
  (`PR_TOUGH.md`/`RUN_PLAN.md`) deposited and tailored — and *only if
  that install happens*, `CLAUDE.md`/`AGENTS.md` handled too (starter if absent,
  additive merge of missing concepts if present). No install → `CLAUDE.md`/
  `AGENTS.md` untouched. Never a silent or overwriting edit.

## Co-located resources

Relative paths resolve against this skill's directory (the folder containing this
file).

| Path | Purpose |
| --- | --- |
| `AI-AUDIT.md` | Core checklist: per-file audit, cross-file coherence, project-fit, decomposition proposals. The spine of the audit. |
| `AI_AUDIT_GOVERNANCE_REVIEW.md` | Cognitive-load rubric — 10 axes, A–F, plus posture findings (e.g. agents running with permission prompts disabled). |
| `COGNITIVE-LOAD.md` | The measurement method for cognitive load: trace the prompt-loaded closure, count directives, judge the total against the model's attention budget (the ~150-directive ceiling), flag buried/negated/duplicate/low-signal shape, and name the cuts. |
| `AI_AUDIT_SEAM_REVIEW.md` | Seam-review gates to check `RUN_PLAN.md` / `PR_TOUGH.md` for: state ownership, consumers, partial writes, repeat-safety. |
| `starter-pack/` | The **deposit templates** — generic `CLAUDE.md`, `AGENTS.md`, `PR_TOUGH.md` (the unified review framework), `RUN_PLAN.md`. Copied into a repo only when missing, only with consent. Drop more templates here (e.g. `PLAN_RULES.md`) and they join the offer automatically. |

## Phase 0 — Explain, then confirm (the entry gate)

When invoked as `/ai-audit-long`, this is the **real start of the run.** Do it before
anything else — before reading files, before grading, before touching the repo.

1. **Show the user what this is and what it will do**, briefly and in plain terms:
   - It audits this repo's *AI health* — it grades the governance files that steer
     AI agents (`CLAUDE.md`, `AGENTS.md`, `PR_TOUGH.md`, `RUN_PLAN.md`, `.claude/`)
     and writes a graded report to `ai-audit-long-findings.md`.
   - It is **read-only except for writes you approve.** If the repo's review
     governance is missing, it can — with your consent — install and tailor a
     starter pack, and only then offer to help your `CLAUDE.md`/`AGENTS.md`.
   - It **never edits a file that already exists without your explicit yes.**
2. **Ask: "Do you want to continue?"**
3. **Proceed only on a clear yes.** On "no" or anything that isn't a clear yes,
   **stop** — read nothing further, write nothing, take no other action.

Everything below runs only after the user confirms.

## Phase 1 — Establish the surface

Work these rungs in order; capture file:line references as you go.

1. **Detect the stack.** C#/.NET, Node, Python, static web, etc. — from
   `*.csproj` / `package.json` / `pyproject.toml` and the build files. Findings
   must fit *this* project; state the detected stack at the top of the report.
2. **Inventory the governance.** Which of `CLAUDE.md`, `AGENTS.md`, `PR_TOUGH.md`,
   `RUN_PLAN.md`, `.claude/`, and skills exist in the repo root. Record present vs
   **missing** — the missing list drives Phase 5. If the repo keeps a **separate
   `PR_TOUGH2.md`** alongside `PR_TOUGH.md`, respect that layout: **do not** recommend
   merging or retiring it. Treat the two together as one review framework — the
   coverage check in Phase 2 verifies the unified framework's ideas appear somewhere
   **across both**, and flags a concept only when it is absent from **both**.
3. **Trace the prompt-loaded closure** (`COGNITIVE-LOAD.md` Step 1). The load cost is
   paid on what actually enters every prompt, not on what sits in the repo. Resolve
   the always-loaded set — `CLAUDE.md` and its transitive `@`-imports, `AGENTS.md`,
   `.cursorrules` / `.cursor/rules/*`, `.windsurfrules`, `.clinerules`,
   `.github/copilot-instructions.md`, `GEMINI.md` — plus each on-demand file
   (`PR_TOUGH.md`, `RUN_PLAN.md`, invoked skills) as a *separate* budget. This traced
   set — not the four canonical filenames — is what the cognitive-load analysis runs on.
4. **Capture the real commands.** Pull the actual build / test / run commands from
   the project so you can check whether the governance quotes them accurately.
5. **Read the git log.** `git log --oneline -30` for fix/revert/guard commits —
   these are the repo's *real* failure modes, and the highest-value gaps are rules
   that would have caught a bug the repo has already had.

## Phase 2 — Audit each present file (`AI-AUDIT.md`)

For every governance file that **exists**, check it against four axes. Skip checks
that don't apply to the stack.

1. **Current** — length budget, `@-imports`, model versions, plan-mode awareness.
2. **Project-fit** — does it describe *this* repo? WPF rules in a Python project
   are noise that costs context every message; stale paths and "we use X" claims
   that aren't true are critical findings.
3. **Coherent** — do the files contradict each other, or cite different build
   commands / different architecture vocabulary?
4. **Grounded** — does it carry rules for the failure modes the git log shows?

**`PR_TOUGH.md` specifically — coverage check across the repo's review file(s).**
Use the bundled unified framework in `starter-pack/PR_TOUGH.md` as a **checklist** of
ideas (architectural defect categories + bug-finding discipline + a categorical
verdict, no numeric score). Verify each idea appears **somewhere across the repo's
review file(s)** — `PR_TOUGH.md`, plus a separate `PR_TOUGH2.md` if the repo has one,
treated together as one framework. Flag a concept **only when it is missing from all
of them**; never recommend that separate review files be consolidated — the repo's
layout is the repo's choice. A genuine regression (e.g. a fake percentage/letter
"drift score" still in use) is a finding on its own. Any remedy is subject to the
Phase 5 consent gates; never overwrite silently.

## Phase 3 — Measure cognitive load (`COGNITIVE-LOAD.md` + `AI_AUDIT_GOVERNANCE_REVIEW.md`)

Governance can be *present* and still fail — too long, too vague, buried — so the
critical rules degrade into low-resolution hunches, or drop out entirely, during
real work. This phase measures that, it doesn't guess at it.

1. **Count against the budget (`COGNITIVE-LOAD.md`).** On the always-loaded closure
   from Phase 1, count **directives** (imperatives and MUST/NEVER/ALWAYS-type rules —
   not headings, prose, or examples) per file and as a **combined total.** Judge the
   total against the model's attention budget — reliable adherence tops out near
   150–200 directives, and the agent harness's own system prompt already spends ~50,
   so the usable budget for repo governance is roughly **~100 (conservative) to ~150**.
   State it plainly: *"the always-loaded set carries N directives against a ~100–150
   budget."* Over budget → **silent omission is expected**; some rules are loaded but
   not in force. (A closure of 250 directives is ~2.5× the budget — the back half is
   effectively not followed, with no visible error.) These constants are
   model-generation-specific; the mechanism is durable.
2. **Measure the shape.** Per always-loaded file: critical prohibitions buried in the
   middle third (low-attention region), prohibition ratio > ~40% (negations fail
   under load), duplicate directives across the closure (latent soft conflicts), and
   low directive-to-prose density (narrative taxing the budget).
3. **Score the quality axes (`AI_AUDIT_GOVERNANCE_REVIEW.md`).** Score each file 0–5
   on the ten axes and assign an A–F cognitive-load grade — this judges whether the
   rules that *are* held are clear, actionable, and front-loaded.
4. **Name the cuts.** Per `COGNITIVE-LOAD.md` Step 5: progressive disclosure (move
   task-specific rules to on-demand files), delete stale/irrelevant, front-load gates,
   dedupe, positivize prohibitions, cut prose — enough to bring the always-loaded
   closure under budget with every remaining line load-bearing.

## Phase 4 — Write the findings (the report)

Assemble `ai-audit-long-findings.md`:

- **Header** — repo, date, detected stack, files audited (with line counts),
  files missing.
- **Cognitive-load budget** — the always-loaded closure (which files, how pulled in),
  its **total directive count vs the ~100–150 budget**, the over/under verdict (and
  for on-demand closures, the same), plus the shape flags (buried gates, negation
  ratio, duplicates, low signal). If over budget, state which rules are effectively
  not in force and the cuts that bring it back under.
- **Per-file grades** — A–F, one-line headline issue each.
- **Findings**, ordered by severity. Each: **Severity · Category · File:Line ·
  What · Why it matters · Fix** (the smallest credible change).
- **Cross-file conflicts**, each with both sides cited.
- **Project-fit gaps** — failure modes from the git log no file protects against.
- **Top 5 fixes by impact.**

## Phase 5 — Offer to fill governance gaps (consent-gated writes)

This is the only phase that may write to the repo, and it is strictly gated. A
skill is stateless — it cannot remember whether it asked before — so **file
presence is the memory.** Two tracks, because the two families of files behave
differently. Present them as **separate prompts**.

### Track A — Our review governance: `PR_TOUGH.md`, `RUN_PLAN.md`

These are ours; a repo has either adopted them or not.

1. **Sentinel.** If both exist, the user has effectively already said yes —
   do nothing on this track and stay hands-off.
2. **Any missing → offer to copy (consent gate #1).** In one prompt, list the
   missing ones and ask whether to deposit them from `starter-pack/`. Copy only the
   approved, only ones that don't already exist; never overwrite. **Record the exact
   set you copied — the *install list*.** Files that were already present are not on
   it and are never touched.
3. **Tailor (consent gate #2 — recommended, default yes).** Run the **tailoring
   pass** below **on the install list only** — the exact files you just copied,
   nothing else. A file that already existed is never tailored, even though it is one
   of ours. A generic template is raw material, not the deliverable, so recommend
   tailoring the files you installed; decline only if the user wants them raw. If
   nothing was copied, there is nothing to tailor. Because the trigger is pure
   presence, this re-offers each run until the files exist — intended, since
   ai-audit-long runs rarely.

### Track B — The shared-standard files: `CLAUDE.md`, `AGENTS.md`

These usually **already exist and did not come from us** — they are the repo's own.
Handle them in a **separate prompt** from Track A, and never overwrite them.

**Precondition — Track B runs if and only if Track A just copied.** Do Track B only
when Track A deposited one or more review-governance files into this repo in this
same run. If the review-governance sentinel was already satisfied, or the user
declined Track A's copy, **skip Track B entirely** — no starter offer, no merge
offer, do not touch `CLAUDE.md`/`AGENTS.md` at all. (The audit still *reports* any
CLAUDE/AGENTS findings in Phases 2–4; only the remediation offer is gated. Track B
is a step of *installing* governance, not of auditing an already-governed repo.)

1. **Absent → offer a starter.** If neither/either is missing, offer to deposit the
   missing one from `starter-pack/`; on approval, deposit and run the tailoring pass
   (same as Track A). This is a distinct prompt from Track A's copy offer.
2. **Present → the file is the user's. Do not edit it without a yes.** This is the
   only case where the skill would touch a file the user authored, so permission is
   mandatory and specific — never merge, append, reword, or "clean up" a present
   `CLAUDE.md`/`AGENTS.md` on your own initiative. The sequence is fixed:
   1. In the findings, **report** the concepts our governance covers that their
      file lacks (e.g. missing universal rules, no `See @AGENTS.md`, no plan-mode
      awareness). If nothing is missing, say nothing and stop.
   2. **Ask** whether to merge those specific concepts in, listing them.
   3. **Only on an explicit yes**, make the merge — additive, preserving everything
      they wrote. Anything but a clear yes = leave the file exactly as it is.

   **Refusal gate:** if you have not received explicit approval for this specific
   merge, you may not modify a present `CLAUDE.md` or `AGENTS.md`. A report of what's
   missing is always allowed; an edit never is without the yes.

### Report

In `ai-audit-long-findings.md`, note what was deposited, tailored, merged, or declined —
per file.

### The tailoring pass

**Input: the install list** — the exact files copied in this run (Track A step 2,
or a Track B starter deposit, added to the same list). Tailor **only** these. A file
that already existed in the repo is never tailored — even if it is one of ours —
because the user owns it. Pass the install list explicitly to any subagent you hand
tailoring to, so it customizes those files and no others.

Tailor **one file at a time** (a big file — `PR_TOUGH.md`, `RUN_PLAN.md` — is a good
subagent job; hand it just that one filename). For each file **on the install
list**, using the repo facts already gathered in Phase 1 (detected stack, real
build/test/run commands, actual source paths, the failure modes from `git log`):

1. **Read the template's own tailoring guidance first** and obey it — `CLAUDE.md`'s
   tailor-at-install banner and Section 0, `RUN_PLAN.md`'s per-stack sections, and
   each file's own stated conventions.
2. **Fill every placeholder.** Replace `<tailor at install>` / `<angle-bracket>`
   fields with this repo's real project summary, commands, and paths. No placeholder
   may survive.
3. **Keep what fits, delete what doesn't.** Retain the addenda/rules matching the
   detected stack; **remove** the ones that don't (WPF rules in a Python repo, Mongo
   rules in a static site) — dead sections cost context every message.
4. **Ground it in this repo's reality.** Insert the actual build/test commands, the
   real layer/paths, and rules for the failure modes the git log shows the repo has
   already hit. Particularize; don't leave it generic.
5. **Verify before finishing.** Grep the tailored file for leftover placeholders and
   for any other-project names or paths that don't exist here. Zero should remain.

The goal: the deposited file reads as if it were written *for this repo*, not
copied into it.

## Audit rules (hold every finding — and every write — to these)

- **Never edit silently; the user owns their governance.** No write to any existing
  file without explicit approval for that write.
  - **Our review governance** (`PR_TOUGH.md`, `RUN_PLAN.md`): if
    present, fully hands-off — grade only, never edit. Both present suppresses
    Track A entirely.
  - **Shared-standard files** (`CLAUDE.md`, `AGENTS.md`): if present, never replace;
    the only permitted write is an **additive merge of specific missing concepts,
    with explicit consent**, preserving everything the user wrote.
- **Deposit only: missing and consented.** A starter-pack file is written only if
  it is missing and only after explicit approval. Two separate consents: copy, then
  tailor.
- **Customize only what you installed.** The tailoring pass runs strictly on the
  *install list* — the files copied this run — never on a file that was already in
  the repo. Track that list and pass it to any subagent doing the tailoring.
- **Verify, don't invent.** Grep before asserting; quote the offending line, don't
  paraphrase. "CLAUDE.md:47 says 'all data in MongoDB' — repo has no Mongo driver"
  is a finding; "seems Mongo-focused" is not.
- **Cite file:line** on every per-file finding.
- **Don't flag irrelevant rules.** A missing WPF rule in a static site is not a
  finding.
- **No prose edits.** This is a governance audit, not a copy-editing pass; findings
  fix governance and code, never a doc's wording.
- **Be honest about limits.** If a check needs code run ("does this build command
  work?"), say "could not verify without executing" rather than asserting.

## Example findings

> **HIGH · Cross-file drift · CLAUDE.md / AGENTS.md / PR_TOUGH.md.** Copy-pasted
> across the app, the tooling repo, and a nested subproject, now diverged. **Fix:**
> pick one master, reference it from the others.

> **MEDIUM · Coverage gap · governance root.** Codex and Cursor are in active use
> (dozens of `*-codex*.md` artifacts) but only `CLAUDE.md` exists — no Codex or
> Cursor guidance. **Fix:** add an `AGENTS.md` the other agents read.

> **CRITICAL · Missing governance · repo root.** No `AGENTS.md`, `PR_TOUGH.md`, or
> `RUN_PLAN.md`. **Fix:** offered the starter pack — deposited and tailored
> `AGENTS.md` + `RUN_PLAN.md` (Phase 5); `PR_TOUGH.md` declined by user.
