# ai-audit

**The library of record for AI governance.** This repo is the one governed place where all the governance files and governance ideas live — the documents that put engineering discipline around AI planning, implementation, review, and orchestration.

Other repos *consume* these files. [`C:\repos\AI-BASIC`](../AI-BASIC/) — the project that puts orchestration around AI — installs them under `governance/` and `prompts/`. Any target repo can have them installed via the bootstrap prompts below. But the masters live **here**, and this repo also contains the tools to keep them healthy: audits that check governance files for drift, staleness, contradiction, and cognitive overload.

That is the meta-idea of this repo: **governance for the governance.** The quality of AI-assisted work is capped by the quality of the instructions the AI is given — so the instructions themselves need a canonical home, an audit discipline, and drift protection.

---

## The core idea

AI work has an engineering pipeline, and each stage has a governing document:

```
raw request → WISH → PLAN → SLICES → IMPLEMENTATION → REVIEW → DONE
             (MAKE_A_WISH)  (PLAN_RULES)  (MakeSlices)   (RUN_PLAN)   (PR_TOUGH)  (When-Reading-DONE)
```

Around that pipeline sit the always-loaded steering files (`AGENTS.md`, `CLAUDE_.md`), the stack-classification system (Sorting Hat → taxonomy → experts), and the audits that keep all of it honest.

---

## 1. Audit toolkit — governance for the governance

Drop-in audit prompts. Hand one to an AI agent in any repo and get back a prioritized, cited report.

| File | Audits | Output |
|---|---|---|
| `AI-AUDIT.md` | The four governance files (`CLAUDE.md`, `AGENTS.md`, `PR_TOUGH.md`, `RUN_PLAN.md`) against current best practice, project fit, and cross-file coherence. | Findings with file:line citations, per-file A–F grades, top-5 fixes, decomposition plan for over-budget files. |
| `AI_AUDIT_GOVERNANCE_REVIEW.md` | Cognitive load of governance files — will the AI keep the critical rules *active* while working, or skim them into a hunch? | 10-axis rubric (purpose, authority, actionability, front-loading, load size, duplication, task fit, verification, anti-drift, friction) with A–F grade. |
| `AI_AUDIT_SEAM_REVIEW.md` | Whether `RUN_PLAN.md` / `PR_TOUGH.md` force seam reasoning: state ownership, consumers, sibling paths, partial writes, repeat-safety. | Drop-in gate text (pre-edit sweep, review gate, refusal rule) plus minimum templates for repos missing the files. |
| `PR_TOUGH2.md` | Companion review to `PR_TOUGH.md` (run alongside it, never replacing it): correct-surface review, standards-vs-spec separation, smell baseline, red-capable repros, falsifiable hypotheses, public-seam testing, shallow-module recurrence. | A generic drop-in review companion with a **§16 Tailoring Pass** for re-grounding it to a target repo (worked installs: `remarkableAI\PR_TOUGH2.md`, `AI-BASIC\PR_TOUGH2.md`). |

Invocation, in an AI session inside the target repo:

```text
Audit my governance files using AI-AUDIT.md. Report findings to ai-audit-findings.md.
```

Each audit file ends with its own invocation examples and stop conditions.

---

## 2. Governance masters

The canonical governance files. Consumer repos (AI-BASIC and any bootstrapped target) hold installed copies; edits belong here first.

| File | Role |
|---|---|
| `AGENTS.md` | Cross-tool entry point: non-negotiable universal rules, project summary, pointers to the heavier files. |
| `CLAUDE_.md` | Generic model `CLAUDE.md` template. Trailing underscore = untailored placeholder; tailor Section 0 and trim platform addenda at install, then rename. |
| `RUN_PLAN.md` | Universal execution-control prompt: how to implement without drifting across boundaries, corrupting canonical data, or shipping a green-looking PR that ran the wrong tests. |
| `PR_TOUGH.md` | Tough architectural PR-review framework with hard auto-floor gates. Reviews against the repo's *documented* architecture. |
| `PLAN_RULES.md` | How a wish becomes a plan — the policy layer that AI-BASIC planning consumes. |
| `TEST_RULES.md` | Canonical testing governance, shared across the product family. |
| `PERSONALITY.md` | Engineering persona / posture (`PROF.md`) — shapes judgment; deliberately separate from mechanical gates. |
| `SURGICAL.md` | Narrow-change discipline — deliberately scoped edits, no adjacent refactors or speculative work. |
| `DAY1PROMPT.md` | The day-1 architectural prompt that establishes the patterns most projects pay for later in a painful refactor. |

---

## 3. Wish → prompt → review pipeline

Turning intent into executable work, and review findings back into executable fixes.

| File | Turns… | …into |
|---|---|---|
| `MAKE_A_WISH.md` | A haphazard request | A properly-stated **wish** — unambiguous target, route not dictated. |
| `WISH_TO_PROMPT.md` | A wish | A self-contained **generation prompt** with context, constraint, and a falsifiable definition of done. |
| `PR_TO_PROMPT.md` | A code review | An executable **fix prompt** (`prx.md`) — both hostile review and repair instructions, no other context needed. |

---

## 4. Stack taxonomy, experts, and slicing (from AI-BASIC)

The prompt catalog that classifies a repo, builds its professional taxonomy, staffs it with experts, and slices work into implementable pieces. These power `basicai new suggest`, `DESIGN /ASK`, and cross-repo bootstrap.

| File | Purpose |
|---|---|
| `TheSortingHat.md` | Classifies a repository or file bundle against the installed stack catalog; recommends stack, layers, and experts. |
| `CreateNewTaxonomy.md` | Proposes a new layered taxonomy when the installed catalog is a poor fit. |
| `CreateStackExperts.md` | Populates a taxonomy with one `Expert.md` per layer plus a stack-level coordinating expert. |
| `MakeOutsideRepo.md` | Cross-repo bootstrap: Sorting Hat → optional taxonomy creation → expert population → install `.bAsIc/` into the target → generate target-tailored `RUN_PLAN.md` / `PR_TOUGH.md`. |
| `MakeSlices.md` | Turns a wish + taxonomy stack into a slicing plan: layer slices, the Walking Spine, vertical-slice method. Used by `DESIGN`. |
| `SamplePromptPlanToRecipe.md` | Worked example: plan → recipe conversion prompt. |

Control/target boundary: when these prompts run, the repo owning the catalog is the **control repo** and the repo being classified is the **target repo**. Prompts must not look outside the working repo unless a target path is explicitly supplied. (Full rule in `AI-BASIC\prompts\README.md`.)

---

## 5. bAsIc document contracts

Governance for the AI-BASIC language's typed document reads.

| File | Purpose |
|---|---|
| `Markdown-bAsIc-Rules.md` | Governed Markdown subset: front matter, headings, markers readable by the compiler/runtime. |
| `YAML-bAsIc-Rules.md` | Named profile contracts for YAML governance/config documents. |
| `When-Design-Makes-Slices.md` | Required metadata shape of slices produced by `DESIGN` (the shape; `MakeSlices.md` owns the thinking). |
| `When-Reading-DONE.md` | The `basicai.done.v1` contract — parsing a completion standard into a typed value `IS` can evaluate. |
| `EXTERNAL_FILES_ORCH.md` | Registry of Markdown files outside compiled source that EngineerForge orchestration reads into prompts and recipes. |

---

## Ecosystem and sync state

Known copies of these files in other repos, and their state as of **2026-07-09**:

| Location | Relationship | State |
|---|---|---|
| `AI-BASIC\governance\` (19 files) | Installed copy of the governance masters | **Byte-identical** to this repo |
| `AI-BASIC\prompts\` (6 files) | Source the prompt catalog was imported from | **Byte-identical** to this repo |
| `AI-BASIC\governance\run_plan.template`, `pr_tough.template` | Templates for generating target-tailored files | **Only in AI-BASIC** — not yet mastered here |
| `AIManifesto\ai-audit.md` | Fork of `AI-AUDIT.md` + an inline "Cognitive Load" §2.6 | **Diverged.** That §2.6 idea evolved here into the standalone `AI_AUDIT_GOVERNANCE_REVIEW.md`; the fork should be refreshed from the masters |
| `PR_TOUGH2.md`, `AI_AUDIT_GOVERNANCE_REVIEW.md` | Newest masters | **Mastered only here** — not in `AI-BASIC\governance\` |
| `remarkableAI\PR_TOUGH2.md`, `AI-BASIC\PR_TOUGH2.md` | Tailored installs of the PR_TOUGH2 master | **Tailored** per the master's §16 Tailoring Pass — deliberate divergence (tailoring ≠ drift, sync rule 2) |

Sync rules for this repo:

1. **Masters live here.** Edit here first; push copies outward. If a copy was edited in place, reconcile back to the master before further changes.
2. **A copy is not authority.** Consumer repos may tailor at install (per `CLAUDE_.md`'s placeholder rule); tailoring is not drift, but silent divergence of the universal sections is.
3. **Audit the library with its own tools.** Run `AI_AUDIT_GOVERNANCE_REVIEW.md` against this repo periodically — the audits apply to their own masters.

---

## Repository layout

```
ai-audit/
├── README.md
│
├── AI-AUDIT.md                        # ── 1. audit toolkit ──
├── AI_AUDIT_GOVERNANCE_REVIEW.md
├── AI_AUDIT_SEAM_REVIEW.md
├── PR_TOUGH2.md
│
├── AGENTS.md                          # ── 2. governance masters ──
├── CLAUDE_.md
├── RUN_PLAN.md
├── PR_TOUGH.md
├── PLAN_RULES.md
├── TEST_RULES.md
├── PERSONALITY.md
├── SURGICAL.md
├── DAY1PROMPT.md
│
├── MAKE_A_WISH.md                     # ── 3. wish → prompt → review ──
├── WISH_TO_PROMPT.md
├── PR_TO_PROMPT.md
│
├── TheSortingHat.md                   # ── 4. taxonomy / experts / slicing ──
├── CreateNewTaxonomy.md
├── CreateStackExperts.md
├── MakeOutsideRepo.md
├── MakeSlices.md
├── SamplePromptPlanToRecipe.md
│
├── Markdown-bAsIc-Rules.md            # ── 5. bAsIc document contracts ──
├── YAML-bAsIc-Rules.md
├── When-Design-Makes-Slices.md
├── When-Reading-DONE.md
└── EXTERNAL_FILES_ORCH.md
```

---

## Why this exists

The engineering around plans and implementation — wishes stated properly, plans governed by rules, slices with a walking spine, execution that respects seams, reviews with hard gates — may be the biggest idea in this whole body of AI work. These documents *are* that idea, written down. They drift the way all governance drifts: copies fork, gates soften into slogans, files describe projects they no longer live in. This repo exists so there is exactly one place where the masters live, one discipline for keeping them healthy, and one set of audits that can be pointed at any repo — including this one.
