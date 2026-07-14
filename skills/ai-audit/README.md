# ai-audit

**A deterministic lint for a repo's AI-governance health.** Point it at a repo and it tells you what's *objectively* wrong with your `CLAUDE.md` / `AGENTS.md` — file:line, a fix hint, and a pass/fail exit code. Every finding has a fixed point; there are no grades and no opinions. It is **read-only** — it never edits, writes, or installs anything.

The whole tool is one zero-dependency Node script (~270 lines) plus a rules-as-data catalog — auditable end-to-end in minutes.

## What it checks — three tiers

- **`governance` (default)** — the checks nothing else runs. The headline is **cognitive-load detection** (`FOCUS-*`): directive count per always-loaded file and across the whole always-loaded set (the ~150–200 instruction ceiling applies to the *total* the agent holds), critical rules buried mid-file where attention is weakest, prohibition-heavy files, duplicate directives, prose-heavy low-signal files, and vague slogan rules. Plus file health: over-length `CLAUDE.md`, hardcoded secrets, stale model versions, a missing `See @AGENTS.md` reference, required files missing. Overload fails as *silent omission* — rules past the budget aren't misapplied, they vanish; these checks catch that deterministically.
- **`code` (`--code`, off by default)** — code patterns that may overlap your existing linters: empty `catch {}`, loose equality, `DateTime.Now`, console I/O in headless layers. Stack-detected.
- **`commands` (`--commands`, off by default)** — runs your configured build / test / lint / format and requires exit zero.

## Run it

```bash
node <skill-dir>/ai-audit-lint.js --all              # governance tier
node <skill-dir>/ai-audit-lint.js --all --code       # + code patterns
node <skill-dir>/ai-audit-lint.js --files a,b        # changed files only
node <skill-dir>/ai-audit-lint.js --all --json       # machine-readable
```

Exit `0` = clean (or warnings only); exit `1` = errors.

## Configure (optional)

Drop a `.ai-audit.json` at the target repo root:

```json
{
  "currentModels": ["Opus 4.8", "Sonnet 5", "Haiku 4.5"],
  "requiredGovernance": ["AGENTS.md"],
  "tiers": ["governance"],
  "buildCmd": "npm run build",
  "testCmd": "npm test",
  "disable": [],
  "promote": [],
  "allow": [{ "file": "docs/HISTORY.md", "rule": "GOV-STALE-MODEL" }]
}
```

## Files

| File | Role |
| --- | --- |
| `SKILL.md` | The skill the agent runs. |
| `ai-audit-lint.js` | The zero-dependency Node linter. |
| `ai-audit-lint.rules.json` | The rule catalog (rules as data; each rule names its tier and fixed point). |

## What it will not do

No grades, no LLM judgment, no writes. Read-only and deterministic, always.
