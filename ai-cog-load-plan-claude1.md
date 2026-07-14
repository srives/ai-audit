# ai-cog-load — Plan (claude1)

**Date:** 2026-07-13
**Goal:** Give `ai-audit` the ability to walk into *any* repo, find its governance/instruction files whatever they are, and judge whether each one is **cognitively overloaded** — carrying more rules than an AI can keep in high-resolution active attention while it works. Not by line count. Not by byte size. By whether the rules actually stay usable in a model's head.

---

## 1. The core insight (why this is different from the rest of the lint)

Cognitive load is **not** a deterministic check, and trying to fake it with a proxy is the wrong move. "Can a model hold these rules in active attention while planning, editing, and reviewing?" is a fact about *model cognition* — and the only valid instrument for measuring model cognition is a model.

That is normally the weakness of an LLM-judgment check ("it's just an opinion"). **Here it is the strength.** The evaluator *is* the instrument being measured. When a model reads a governance file and reports "rules 7–15 collapse into a low-resolution hunch once I'm also holding the architecture map," that is not an opinion about the file — it is a direct readout of the exact quantity we care about. Cognitive load is the one audit dimension where LLM judgment is the **gold standard**, not a compromise.

**Design consequence:** do not dress the verdict as a number or a letter. It is a model assessment; label it as one, honestly. The value is in *what falls out of attention*, not in a fake score.

---

## 2. Strategic fit (would Asa / PI want it)

Strongest fit in the whole project. PI's founding identity is **context economy** — built on "primitives over features" and reportedly the shortest system prompt of any major agent. PI loads `AGENTS.md` / `CLAUDE.md` at startup, so instruction bloat is a cost paid on every session. A tool that measures whether instruction files overload the model's attention defends the exact value PI was built on.

Real target exists: GTP's `CLAUDE.md` files are long and copy-pasted across Stratus / Tooling / Workstation — genuine bloat meeting a philosophically aligned reviewer.

**Caveat to honor:** he will want it explicit that the verdict is a model assessment, never a manufactured metric. Keep it honest and it speaks his language better than anything else `ai-audit` does.

---

## 3. Architecture — three layers, only the last uses judgment

```
[1] DISCOVERY (deterministic)  →  [2] PROXY-TRIAGE (deterministic)  →  [3] VERDICT (model pass)
     find the files                flag the likely-overloaded             judge attention, per file
```

Each layer states plainly which kind of check it is. Determinism where it's honest; judgment only where judgment is the gold standard.

### Layer 1 — Discovery (deterministic)

Find the governance/instruction files in an unknown repo, whatever they are. There is a known, enumerable universe of agent-instruction filenames; scan against a catalog plus a light heuristic.

**Catalog (starter set):**
- `CLAUDE.md`, `CLAUDE.local.md`, `AGENTS.md`, `AGENT.md`, `GEMINI.md`
- `.cursorrules`, `.cursor/rules/*.mdc`, `.windsurfrules`, `.clinerules`, `.aider*`
- `.github/copilot-instructions.md`
- `.claude/` (skills, commands), `.kiro/`, `.pi/`
- any repo-root `*_RULES.md`, `*_TOUGH*.md`, `RUN_PLAN.md`, `PLAN_RULES.md`, `PROF.md`-style expert files
- **heuristic tail:** any `.md` that another instruction file `@`-imports or references as governance

**Output:** the list of discovered governance files, each with why it was picked (catalog hit vs referenced). Missing the obvious ones (no `CLAUDE.md`/`AGENTS.md` at all) is itself a reported fact.

### Layer 2 — Proxy-triage (deterministic)

Line count and byte size are rejected as the *verdict*, but richer deterministic signals correlate with load and are worth computing to **triage** which files earn the expensive model pass. These are candidates, never conclusions.

Per discovered file, compute:
- **Directive density** — count of imperative gates (`MUST`, `NEVER`, `ALWAYS`, `DO NOT`, numbered rules). More distinct directives = more to hold.
- **Distinct-instruction count** — rough count of separable rules (list items + imperative sentences).
- **Topic sprawl** — number of unrelated concerns in one file (heading topics that don't share a subject).
- **Duplication** — the same rule restated in scattered places (near-duplicate line/heading detection).
- **Front-loading position** — where the critical gates sit relative to the top (are the `NEVER`s before or after 300 lines of context).

**Output:** a per-file triage score with its components shown, and a flag: *worth a model pass?* (e.g. high directive density + low front-loading + real length). This layer is honest that it only *ranks likelihood*, it does not decide overload.

### Layer 3 — Verdict (model pass — the judgment)

For each flagged file, run the model assessment using the existing 10-axis rubric in `AI_AUDIT_GOVERNANCE_REVIEW.md` (purpose clarity, authority, actionability, front-loading, load size, duplication, task fit, verification, anti-drift, friction) — but reframed around the single question:

> While planning, editing, self-reviewing, and explaining in this repo, **which of these rules stay in active awareness, and which collapse into a low-resolution hunch or drop entirely?**

**Output, per file:**
- **Rules that stay in active attention** (the file's real, usable core).
- **Rules that fall to working-context** (retrievable with effort).
- **Rules that collapse to a low-resolution hunch or are lost** (present in the file, absent in practice).
- **The smallest cut** that would bring the critical rules back into high resolution (what to move to an on-demand file, what to delete, what to front-load).
- Labeled explicitly: *this is a model assessment of attention, not a metric.*

---

## 4. What `ai-audit` already has to build on

- **`lint.js` + `lint.rules.json`** — the deterministic engine and its file-walk/glob/report machinery. Layers 1 and 2 are new *kinds* of check that fit its rules-as-data shape (discovery = a catalog match; proxies = counts/positions over a file).
- **`AI_AUDIT_GOVERNANCE_REVIEW.md`** — the 10-axis cognitive-load rubric already exists; it is the substance Layer 3 applies. This plan operationalizes it, it does not invent it.
- The skill already knows how to run a bundled tool and report its output as facts.

New work is: the discovery catalog, the four/five proxy signals, and the Layer-3 model-pass prompt + output contract.

---

## 5. Honesty principle (non-negotiable)

Every finding states which layer produced it and what kind of check it is:
- Layer 1/2 findings are deterministic facts ("directive density 240; critical gates first appear at line 410").
- Layer 3 findings are a labeled model assessment ("in practice I would lose rules 12–18 once holding the layer map").

No numeric grade on the load itself. No "87% = B+". The value is the named rules that fall out of attention and the smallest cut that fixes it.

---

## 5.5 Status — deterministic layers BUILT (2026-07-13)

Layers 1–2 now exist as seven `FOCUS-*` rules in the `ai-audit` skill's linter (`ai-audit-lint.js`, default governance tier): `FOCUS-DIRECTIVES` (per-file directive budget, warn 75 / error 150), `FOCUS-COMBINED` (total across the always-loaded set incl. resolved `@`-imports, warn 120 / error 200), `FOCUS-MIDDLE` (critical rules in the middle third, where attention is weakest), `FOCUS-NEGATION` (prohibition ratio > 40%), `FOCUS-DUP` (duplicate directives), `FOCUS-SIGNAL` (directive density), `FOCUS-VAGUE` (slogan rules). Thresholds live in `.ai-audit.json` config. Key refinements over this plan's draft: the unit is the *directive*, not the line; the budget applies to the *combined* always-loaded set; and the finding language teaches the mechanism (overload = silent omission, not misapplication). Layer 3 (the model-pass verdict) remains unbuilt and belongs to the judgment tool, not the lint.

## 6. Build order

1. **Discovery catalog + scan** (deterministic). Ship the filename catalog + the `@`-import/reference tail. Output: discovered governance files with provenance. Testable against any repo.
2. **Proxy-triage signals** (deterministic). Directive density, distinct-instruction count, topic sprawl, duplication, front-loading position. Output: per-file triage + "worth a model pass?" flag.
3. **Verdict model pass.** The Layer-3 prompt keyed to `AI_AUDIT_GOVERNANCE_REVIEW.md`, with the active-attention / working-context / lost output contract and the smallest-cut recommendation.
4. **Wire into the skill** as: discover → triage → (on flagged files) verdict → report, each layer labeled.
5. Dry-run against a known-bloated file (a large `CLAUDE.md`) and a known-lean one; confirm the lean one passes triage without a model pass and the bloated one produces a real "these rules fall out" verdict.

---

## 7. Open decisions

- **Where the model pass runs.** Inside the skill (the agent does it in-session) is simplest and keeps it self-contained. Decide whether Layer 3 is always run on flagged files or offered.
- **Triage threshold.** What combination of proxy signals flags a file as "worth the expensive look" — tune against real files so lean governance never triggers a needless pass.
- **Discovery breadth.** How aggressive the heuristic tail is (following `@`-imports and references) vs the fixed catalog only — start catalog-only, add the tail once discovery is proven.
- **Standalone vs skill.** The deterministic layers (1–2) could ship as a CLI check; the verdict (3) needs a model. Decide whether the whole thing is one skill or a CLI + a model step.

---

## 8. One-line summary

`ai-audit` finds every governance file in any repo, deterministically triages which look overloaded, then has a model report — honestly, as a model assessment — which rules actually stay in high resolution and which collapse, plus the smallest cut to fix it. Cognitive load is the one dimension where model judgment is the gold standard, and the one most aligned with what PI values.
