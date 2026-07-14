# governance-lint — Spec

**Date:** 2026-07-13
**Purpose:** A deterministic linter for governance compliance. It runs the checks that today live as *prose* inside the governance corpus and turns them into pass/fail with file:line and a CI-gatable exit code. **No LLM. Every check has a fixed point.** It is the anti-theater half of the audit: it certifies the ~40% that is mechanizable, and refuses to touch the ~60% that is opinion.

It exists because the oracle test found the corpus's real checks (length, secrets, banned patterns, required fields, referenced-path existence, build/test/lint exit codes) are *specified but never executed* — so they silently rot and prove nothing. This makes them prove something.

---

## 1. Design principle: rules are data, the runner is thin

The asset is a **rule catalog** (`governance-lint.rules.json`) — language-neutral. The **runner** is a small engine that executes each rule's `kind` and reports. This matches the corpus's own philosophy (dispatch tables over if/else; keyword recognition as a lookup, not a switch). Swapping the runner's language never touches the rules.

**The iron law:** a rule belongs in this tool **only if its compliance is decidable by a fixed point** — a command exit code, a grep count, a file/path existence check, a numeric threshold, a byte-for-byte match, a parsed field. If a check needs an LLM to judge "good / hostile / falsifiable / right seam," it is **not** a governance-lint rule. It stays in the `.md` as an attention-directing lead.

---

## 2. Oracle primitives (the finite set of rule `kind`s)

Every rule is one of these. This closed set *is* the guarantee of falsifiability.

| `kind` | Fixed point | Pass condition |
|---|---|---|
| `max-lines` | `wc -l` | count ≤ threshold |
| `forbidden-pattern` | regex grep | match count == 0 |
| `required-pattern` | regex grep | match count ≥ 1 |
| `count-threshold` | regex grep | count `<op>` N |
| `file-exists` / `file-absent` | path stat | present / absent |
| `referenced-paths-exist` | extract path-like tokens → stat each | every referenced path resolves |
| `frontmatter-fields` | parse YAML front matter | required keys present |
| `golden-match` | extract a delimited block, compare to canonical | byte-for-byte equal |
| `ordering` | line position of two tokens | pos(A) < pos(B) |
| `command-exit-zero` | run an external command | exit code == 0 |

If a proposed check can't be expressed as one of these, it doesn't belong here — that's the test.

---

## 3. The rule catalog (harvested from the oracle test)

Grouped. Each rule ships with `id`, `kind`, `target` (glob), `pattern`/`arg`, `severity` (error|warn), `fix` hint, and `applies-to` (stack filter or `*`).

### 3.1 Governance-file health (lint the `.md` governance itself)
| id | kind | Checks |
|---|---|---|
| `GOV-LEN` | max-lines | `CLAUDE.md` ≤ 200 (warn > 120) |
| `GOV-SECRET` | forbidden-pattern | no `sk-`, `ghp_`, `pat-`, `api_key=`, hardcoded tokens in any governance file |
| `GOV-STALE-MODEL` | forbidden-pattern | no model-version string outside the configured current set (the current set lives in config, not code — see §6) |
| `GOV-REF-AGENTS` | required-pattern | if `AGENTS.md` exists, `CLAUDE.md` contains `@AGENTS.md` / `See @AGENTS.md` |
| `GOV-PATHS` | referenced-paths-exist | repo paths cited in governance (`src/...`, `tests/...`) actually exist |
| `GOV-FRONTMATTER` | frontmatter-fields | typed docs carry `type` + `profile` |
| `GOV-PLACEHOLDER` | forbidden-pattern | an *installed* (non-template) governance file has no `<tailor at install>` / `<angle-bracket>` leftovers |
| `GOV-FILES` | file-exists | the repo's declared required governance set is present |

### 3.2 Code-pattern rules (what governance demands of code)
| id | kind | Checks | applies-to |
|---|---|---|---|
| `CODE-EMPTY-CATCH` | forbidden-pattern | `catch\s*(\(\s*\w*\s*\))?\s*\{\s*\}` | * |
| `CODE-DATETIME-NOW` | forbidden-pattern | `DateTime\.Now` (require `ToLocalTime`) | .net |
| `CODE-SESSION-WRITEHOST` | forbidden-pattern | `Write-Host\|Read-Host\|$host\.UI` under `src/session/` | powershell |
| `CODE-NONASCII` | forbidden-pattern | non-ASCII bytes in string literals of CI/test scripts | powershell |
| `CODE-PS7-SYNTAX` | forbidden-pattern | `??`, `?:`, 3-arg `Join-Path`, `#Requires -Version [67]` when PS5.1 support is declared | powershell |
| `CODE-RAW-PERSIST` | forbidden-pattern | `Set-Content\|Out-File\|WriteAllText` on owned/canonical paths | powershell |
| `CODE-JS-COUNT` | forbidden-pattern | `\.count\b` (mean `.length`) | js |
| `CODE-JS-EQ` | forbidden-pattern | `[^=!]==[^=]` in touched JS | js |
| `CODE-ROOT-PS1` | count-threshold | root `*.ps1` count == allowlist size | powershell |
| `CODE-DRIFT-<n>` | forbidden-pattern | the named `PR_TOUGH §F.1` / `DAY1PROMPT R1–R11` forbidden-pattern greps, one rule each | per-stack |

*(The PR_TOUGH/DAY1PROMPT greps are the single richest vein — ~60 already-written regexes. Each becomes one `forbidden-pattern` row. These are leads, so default severity `warn` unless the repo promotes them.)*

### 3.3 Structural / build oracles (invoke the real tools)
| id | kind | Checks |
|---|---|---|
| `BUILD-GREEN` | command-exit-zero | the repo's declared build command on the blast radius |
| `TEST-GREEN` | command-exit-zero | the declared narrow test command |
| `LINT-GREEN` | command-exit-zero | the declared lint command |
| `FORMAT-CHECK` | command-exit-zero | the declared formatter `--check` |

### 3.4 Contract / artifact
| id | kind | Checks |
|---|---|---|
| `CONTRACT-VERBATIM` | golden-match | a prompt's "Operating Contract" block equals the canonical block |
| `SLICE-EXPERT-EXISTS` | referenced-paths-exist | every `**Expert:**` path in a slice file resolves |
| `REFACTOR-CLEAN` | count-threshold | retired names in runtime paths == 0 |

---

## 4. Invocation & scope

```
governance-lint [--files <list> | --all] [--stack <id>] [--json] [--rules <path>] [--config <path>]
```

- `--files <changed>` — lint only changed files (the CI-on-diff mode; the default in a pre-commit hook).
- `--all` — full sweep (the ai-audit / periodic mode).
- `--stack <id>` — enable stack-specific rules; auto-detected if omitted (`*.csproj`→dotnet, `package.json`→js, `*.psm1`→powershell…).
- `--rules` / `--config` — override the rule catalog / config location.
- `--json` — machine-readable output; default is a human table.

## 5. Output & exit code (the oracle contract)

Human (default), deterministically ordered by file then line:
```
FILE:LINE  [SEVERITY]  RULE-ID   message            (fix: …)
CLAUDE.md:1  [error]    GOV-LEN   248 lines (max 200)  (fix: split via @-imports)
src/user.ts:2 [warn]   CODE-EMPTY-CATCH  empty catch    (fix: handle or rethrow)
```
`--json`: `[{rule, severity, file, line, message, fix}]`.

**Exit code — this is what makes it an oracle:** `0` if no `error`-severity failures; non-zero otherwise. A CI job or pre-commit hook gates on it. That single fact converts the governance's mechanizable rules from prose an LLM might honor into a check a machine enforces.

## 6. Config & allowlist

`.governance-lint.json` (per repo), so rules tune without editing the catalog:
- `currentModels`: the model-version strings `GOV-STALE-MODEL` treats as current (the one hardcoded fact, isolated here so it rots in *one* place, not scattered through prose).
- `requiredGovernance`: which files `GOV-FILES` demands.
- `rootPs1Allow`, `ownedPaths`, `buildCmd`/`testCmd`/`lintCmd`/`formatCmd`.
- `disable`: rule ids to skip; `promote`: warn→error.
- `.governance-lint.allow`: per-finding suppressions (file + rule id) for reviewed exceptions.

## 7. Non-goals (explicit — this is the whole point)

- **No grades, no letters, no scores.** No "Architectural Drift Score," no A–F, no 1–5. Those are the theater the oracle test flagged; this tool refuses to emit them.
- **No LLM, no "quality" judgment.** It never decides "good / hostile enough / falsifiable / right seam / minimum viable." Those stay in the `.md` files as leads for a human or an LLM reviewer — labeled as opinion, not enforced here.
- **No writes to the repo.** Read-only; reports and exits. (Fixes are the caller's job.)

## 8. Integration with the ai-audit skill

This directly answers the fatal critique in `SHIT.md` (the audit is "an LLM confirming its own priors"). Re-shape the skill:

- **Objective layer = governance-lint.** The skill runs it and reports its findings as *facts* — file:line, deterministic, reproducible. No taste.
- **Subjective layer = the LLM, honestly labeled.** The cross-file-coherence and project-fit *leads* remain, but presented as "reviewer opinion," never as a graded verdict.

That split gives the audit a real, falsifiable core it currently lacks — and lets it drop the letter grades that made it un-shippable. An auditor with a lint spine is a tool; an auditor that only grades is an opinion.

## 9. Runner recommendation

Rules-as-data means the language is cheap to change; pick by distribution target:
- **For the Felix / broad-CI path:** a single zero-dependency **Node** script (`npx governance-lint`) — every target repo already has node, matches the PI/Felix world, easy pre-commit + GitHub Action.
- **For the EngineerForge/PowerShell world:** a single **pwsh 7** script, same catalog.

Recommend building the **Node** runner first (widest reach, and it's the version that could ride the Felix channel), keeping the rule catalog as the portable asset both runners share.

---

## Build order

1. Catalog `governance-lint.rules.json` with the ~10 `kind`s and the §3.1 + §3.3 rules (governance-health + build/test/lint) — the highest-signal, lowest-noise set.
2. Node runner: the 10 primitives, `--files`/`--all`/`--json`, exit code, config/allowlist.
3. Add §3.2 code-pattern rules per stack (start with the PR_TOUGH/DAY1PROMPT greps as `warn`).
4. Wire it as the objective layer of the ai-audit skill (§8) and as a pre-commit hook / CI gate.
