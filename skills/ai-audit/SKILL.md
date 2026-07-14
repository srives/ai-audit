---
name: ai-audit
description: A deterministic auditor for the cognitive load that AI-governance files impose on a language model. It operationalizes established findings on transformer instruction-following into falsifiable measurements — no model judgment, no grades. Empirically, instruction adherence degrades monotonically as the number of simultaneously-active directives rises (reliable only up to a bounded set, on the order of 150–200, part of which the agent's own system prompt consumes); the dominant failure mode under load is silent omission, not misexecution; and adherence is U-shaped in position, so directives in a file's interior are attended measurably less than those at its edges. From these regularities it computes directive counts per always-loaded file and across the whole loaded set, flags critical prohibitions buried in the low-attention interior, and quantifies negation load, directive duplication (a latent self-contradiction the model cannot detect), and signal dilution — alongside deterministic file-health checks (secrets, stale model identifiers, missing cross-references, length). Because every measurement is a count, position, or ratio, the instrument does not inherit the failure modes it measures; thresholds are exposed as configuration because they are model-generation-specific. Read-only. Use to audit CLAUDE.md / AGENTS.md health, or to test whether an instruction file has exceeded what the current model can reliably hold. Trigger even when "skill" isn't said.
---

# AI Audit

Run a **deterministic lint** over a repo's AI governance and report what's objectively wrong — file:line, a fix hint, and an exit code. **Every finding has a fixed point** (a length count, a regex match, a missing reference). No grades, no letters, no "is this good?" — only checks a machine can settle. This skill is **read-only**: it never edits, writes, or installs anything.

The linter is one zero-dependency Node script (~380 lines) with a rules-as-data catalog — small enough to audit completely in minutes, which is the point: you can verify everything it does before trusting it. Its headline capability is **deterministic cognitive-load measurement**: quantifying, without model judgment, whether an instruction file has exceeded the load under which a language model begins to silently drop rules.

Co-located resources in this skill directory (relative paths resolve against the folder containing this `SKILL.md`):

| File | Purpose |
| --- | --- |
| `ai-audit-lint.js` | The zero-dependency Node linter this skill runs. |
| `ai-audit-lint.rules.json` | The rule catalog — rules as data; each rule names its tier and its fixed point. |

## When to use

- Someone wants a **fast, objective** governance check ("is our CLAUDE.md healthy?").
- Verifying a `CLAUDE.md` / `AGENTS.md` before a PR — stale model versions, secrets, an over-budget file, a missing `@AGENTS.md` reference.
- A quick drift check after governance files have been copied between repos.

## What it checks — three tiers

**`governance` (default — the checks nothing else runs):**

**Cognitive-load checks (`FOCUS-*`) — the theoretical basis.** These operationalize established empirical regularities in transformer instruction-following into deterministic measurements. Four motivate the rules:

1. **Density degradation.** Adherence to simultaneously-active instructions declines monotonically with their count, reliable only up to a bounded set (empirically on the order of 150–200 directives), part of which the agent's fixed system prompt consumes before any governance loads.
2. **Silent omission.** The failure mode under load is not misexecution but *omission*: past the budget, rules are dropped rather than performed incorrectly — the failure is therefore invisible at the point it occurs, which is what makes it dangerous.
3. **Positional asymmetry ("lost in the middle").** Adherence is U-shaped in position; a directive in a file's interior is attended measurably less (on the order of 15–30%) than the same directive at an edge, as a function of position alone, independent of content.
4. **Negation fragility and self-contradiction blindness.** Prohibitions are honored less reliably than affirmative instructions under load, and models do not reliably detect inconsistency among their own instructions, so duplicated rules act as latent soft conflicts.

The unit of measurement is therefore the **directive** (an imperative- or modal-governed instruction), not the line or byte, and every check is a count, a position, or a ratio — no model judgment — so the instrument does not inherit the effects it measures:
- `FOCUS-DIRECTIVES` — directive count per always-loaded file (warn >75, error >150)
- `FOCUS-COMBINED` — **total** directives across the whole always-loaded set (`CLAUDE.md` + `AGENTS.md` + `.cursorrules` + resolved `@`-imports…) — the budget applies to what the agent holds at once, not per file
- `FOCUS-MIDDLE` — critical rules (NEVER / MUST NOT) buried in the middle third of a long file, where attention is weakest
- `FOCUS-NEGATION` — prohibition-heavy files (negated rules fail disproportionately under load)
- `FOCUS-DUP` — duplicate directives across the set (copies drift into soft conflicts)
- `FOCUS-SIGNAL` — low directive density (prose filler taxing the attention budget)
- `FOCUS-VAGUE` — slogan rules ("be careful", "best practices") that spend attention without buying checkable behavior

*File-health checks:*
- `CLAUDE.md` over the length budget (error > 200 lines, warn > 120)
- Hardcoded secrets in any governance `.md`
- Model versions not in the configured current set
- `CLAUDE.md` missing a `See @AGENTS.md` reference (when `AGENTS.md` exists)
- Required governance files missing (configurable list)

**`code` (opt-in, `--code`) — may overlap the repo's own linters, so off by default:**
- Empty `catch {}`; loose `==`/`!=` and `.count` in JS; `DateTime.Now` in C#; console I/O in a headless `src/session/` layer; stray root `.ps1`. Stack-detected.

**`commands` (opt-in, `--commands`) — runs the repo's own oracles:**
- The configured build / test / lint / format commands must exit zero.

The full catalog lives in `ai-audit-lint.rules.json`; every rule names its tier, its fixed point, and its fix hint.

## How to run it

The linter is bundled with this skill as `ai-audit-lint.js` (zero dependencies; needs Node). From the **target repo's root**, run the copy in this skill's directory (the folder containing this SKILL.md):

```bash
node <this-skill-dir>/ai-audit-lint.js --all              # governance tier (default)
node <this-skill-dir>/ai-audit-lint.js --all --code       # + code-pattern rules
node <this-skill-dir>/ai-audit-lint.js --all --commands   # + run configured build/test
node <this-skill-dir>/ai-audit-lint.js --files a.md,b.ts  # changed files only
node <this-skill-dir>/ai-audit-lint.js --all --json       # machine-readable
```

1. Confirm Node is available (`node --version`); if not, say so and stop — this skill has no fallback.
2. Run `ai-audit-lint.js --all` at the repo root (add `--code` / `--commands` only if the user asks for the deeper tiers).
3. **Report its output verbatim as facts** — file:line, severity, rule id, fix hint. Do not re-grade, soften, or editorialize; the tool's output *is* the finding.
4. State the exit code and the error/warning counts (`0` = clean or warnings only; `1` = errors).

## Reading the output

```
CLAUDE.md:1   [error] GOV-LEN          736 lines (max 200)   (fix: split via @-imports)
CLAUDE.md:1   [warn ] GOV-REF-AGENTS   no See @AGENTS.md reference          (fix: add the reference)

ai-audit: 1 error(s), 1 warning(s) across 11 file(s).
```

A repo tunes it via `.ai-audit.json` at its root: `currentModels`, `requiredGovernance`, `tiers`, `disable`, `promote` (warn→error), and per-finding `allow` suppressions.

## What it will NOT do

- **No grades / letters / scores.** Ever — only checks with a fixed point.
- **No LLM judgment.** It won't decide "good architecture" or "clear writing" — only what a machine can settle.
- **No writes.** It never edits, deposits, tailors, or merges. Read-only, always.

## Requires

Node (any recent version). The linter is a single zero-dependency script; nothing to install.
