# ai-audit.md

A portable AI consultant for auditing your four governance files (`CLAUDE.md`, `AGENTS.md`, `PR_TOUGH.md`, `RUN_PLAN.md`) against current best practice **and** the actual project they live in.

Drop this file into any repo. Then run:

> "Audit my governance files using `ai-audit.md`. Report findings to `ai-audit-findings.md`."

The audit checks each file against (a) what Anthropic and the Agentic AI Foundation officially recommend, (b) what the specific project type needs, and (c) whether the four files contradict each other. Output is a prioritized fix list, not a wall of opinion.

---

## 0. Mission

You are auditing the four governance files of the current repository. Your goal is to determine whether they:

1. **Match Anthropic's current best practices** (length budgets, @-imports, plan mode, etc.).
2. **Fit the actual project** (WPF rules in a Python repo are noise; Mongo guidance in a static site is noise).
3. **Agree with each other** (CLAUDE.md and AGENTS.md must not contradict; PR_TOUGH and RUN_PLAN must reference the same architecture).
4. **Cover the project's real failure modes** (the rules should be informed by what actually breaks here).

You are not writing prose. You are producing a structured report against the checks below. Findings cite specific lines.

---

## 1. Preflight

Before auditing, identify:

### 1.1. Files present
Run `ls` (or equivalent). Note which of these exist at repo root:

- `CLAUDE.md`
- `AGENTS.md`
- `PR_TOUGH.md`
- `RUN_PLAN.md`

A missing file is itself a finding. Continue the audit on the files that exist.

### 1.2. Project type
Detect the primary stack. Look for:

| Signal | Likely stack |
|---|---|
| `*.csproj`, `*.sln`, `Program.cs` | C# / .NET |
| `package.json`, `*.tsx`, `*.ts` | Node / TypeScript |
| `*.py`, `pyproject.toml`, `requirements.txt` | Python |
| `Cargo.toml`, `*.rs` | Rust |
| `CMakeLists.txt`, `*.cpp` | C++ |
| `*.ps1`, `*.psm1` | PowerShell |
| `index.html` + `app.js` + `style.css` (no build) | Static web |
| `*.xaml`, `MainWindow*.cs` | WPF |
| `WiX`, `*.wxs`, `WorkstationMsi/` | WiX installer |
| `*.cshtml`, MongoDB driver imports | ASP.NET + Mongo |
| Vue 2 + jQuery patterns | Legacy web frontend |

State the detected stack at the top of your findings. If you detect multiple, list them all. If you cannot tell, say so and ask one clarifying question before proceeding.

### 1.3. Build / test / run commands
Find them. Look in `package.json` scripts, `*.csproj`, `Makefile`, `justfile`, `Cargo.toml`, `pyproject.toml`, `README.md`, the existing CLAUDE.md, or `.github/workflows/`. Capture them. You'll check whether the governance files reference these commands accurately.

---

## 2. Per-File Audit

For each file present, walk these checks. Skip checks that don't apply.

### 2.1. CLAUDE.md

#### Length and density (Critical)

| Check | Target | Why |
|---|---|---|
| Line count | Under 200 lines (ideally 80–120) | Anthropic's official guidance. Past 200 lines, instruction adherence measurably drops. Past 500 dense words of rules, adherence collapses. |
| Rule density | ~100–150 distinct instructions max | Frontier models follow ~150–200 instructions before compliance drops; Claude Code's system prompt eats ~50. |

If over 200 lines: this is the highest-priority finding. Recommend splitting via `@-imports` (next check) or moving content to skills.

#### Structural correctness

- **`@-imports` used?** Look for `@docs/...md`, `@~/.claude/...md`, or any `@path/file.md` pattern. If the file is over 120 lines and has no `@-imports`, flag as missing modularization.
- **`See @AGENTS.md` reference?** If `AGENTS.md` exists in the repo, `CLAUDE.md` should reference it. Without this reference, Claude Code won't auto-load AGENTS.md (issue #6235).
- **Secrets?** Scan for `sk-`, `ghp_`, `pat-`, `password`, `api_key`, hardcoded tokens. Any hit is a critical finding.
- **`CLAUDE.local.md` mentioned?** If team-shared CLAUDE.md is present, is the personal-overrides file (`CLAUDE.local.md`, gitignored) mentioned for team members who need personal tweaks?

#### Content correctness (does it match THIS project?)

- **Build/test commands accurate?** Cross-check against actual `package.json` / `*.csproj` / etc. found in preflight. Stale commands are a finding.
- **Tech stack references match?** If CLAUDE.md says "controllers/services/repositories" but the project is a static site, that's stale content from another project.
- **File paths exist?** If CLAUDE.md references `src/auth/login.ts` or `Gtpx.Cloud.Services/`, those paths should exist. Otherwise it's a copy-paste from another repo.
- **Model versions current?** Look for "Opus 4.5", "Sonnet 4", "Claude 3" — these are stale references. Current as of May 2026: **Opus 4.7, Sonnet 4.6, Haiku 4.5**.
- **Platform addenda relevant?** If CLAUDE.md has a "WPF" section but the repo has no `.xaml` files, that section is noise. Same for Mongo guidance in a static site, PowerShell rules in a Node project, etc.

#### Universal rules present?

A solid CLAUDE.md typically covers these. Missing rules are findings (severity: Medium unless project-specific):

- [ ] Git operations require explicit user approval (no auto-commit/push)
- [ ] Search before you write (use existing helpers)
- [ ] Forward-only architecture (no preserving backward compatibility unless asked)
- [ ] Truthful function naming (Get-* read-only, Async dropped when no longer async)
- [ ] Preserve full object shape on mutations
- [ ] Minimum viable code (no widening scope)
- [ ] Answer questions, don't act on them
- [ ] Constraint extraction gate for architectural work (`.constraint-extraction.md`)
- [ ] Refactor completion rule (old paths must be removed)
- [ ] Common AI failure modes named

If most of these are absent, the file is closer to a quick-start than a governance file. Flag accordingly.

#### Modern features mentioned?

- [ ] Plan Mode (Shift+Tab × 2 / `/plan` / `ExitPlanMode`)
- [ ] `/rewind` for state restoration
- [ ] Adaptive thinking effort levels (low/medium/high/xhigh/max)
- [ ] @-imports for CLAUDE.md modularization
- [ ] AGENTS.md as cross-tool standard

Missing items aren't critical individually, but if 4 of 5 are missing the file is pre-2026.

---

### 2.2. AGENTS.md

#### Presence and framing (High)

- **Does it exist?** AGENTS.md is now governed by the Linux Foundation Agentic AI Foundation (Dec 9 2025), adopted by 60,000+ projects and most agentic CLI tools. If absent and you collaborate across tools (Codex, Cursor, Copilot, Gemini), creating one is recommended.
- **Is it the primary cross-tool file?** Recommended pattern: `AGENTS.md` is the cross-tool primary; `CLAUDE.md` is the Anthropic-specific layer plus `See @AGENTS.md`. Verify the file actually contains rules, not just a pointer to CLAUDE.md.

#### Content (per AGENTS.md spec)

Recommended sections (not required, but expected):

- [ ] Project overview (one paragraph)
- [ ] Build and test commands
- [ ] Code style / conventions
- [ ] Testing instructions
- [ ] Security considerations or forbidden patterns
- [ ] Commit / PR conventions
- [ ] Deployment steps (when applicable)

Missing sections aren't blocking but each gap is a finding. The spec has no hard requirements — it's intentionally simple — but agents rely on these to operate predictably.

#### Length

- **Under ~300 lines** is the practical ceiling; ~50–150 lines is typical. AGENTS.md is loaded by most tools at session start. Same context-cost reasoning as CLAUDE.md.

#### Duplication with CLAUDE.md

- **Are the same rules stated twice?** If both files repeat the same content, the maintenance burden doubles and drift becomes inevitable. Recommended pattern: AGENTS.md owns the cross-tool rules; CLAUDE.md adds Anthropic-specific extensions only (hooks, skills, subagents).

---

### 2.3. PR_TOUGH.md

#### Hard gates defined? (Critical)

Modern PR review frameworks include explicit auto-floor conditions. Look for:

- [ ] Build-fail floor (e.g., D-)
- [ ] Lint-fail penalty
- [ ] Hidden mutation in read paths = F
- [ ] Single-click destructive action = F
- [ ] Invented commands the system doesn't have = F
- [ ] False completion claims = F

Without hard gates, the framework is advisory; reviewers can rationalize anything.

#### Defect categories specific to the project?

Universal defect categories (canonical truth, boundaries, cache/projection, helper drift, etc.) are good, but a strong PR_TOUGH.md adds **project-specific** ones derived from real bugs:

- For Mongo+ASP.NET: discriminators, projections, FeatureClaim parameters
- For WPF: settings caching, async void, ObservableCollection threading
- For PowerShell tooling: dispatch tables over if/else chains, canonical persistence helpers, no console writes in module code
- For Crippa/hardware: false-success → moved-material safety
- For static web: helper-first reuse, no build-step creep

If PR_TOUGH.md is generic-only, flag that the project's actual failure modes aren't being checked. Look at git log for recent bug fixes; those are evidence of failure modes that belong in PR_TOUGH.

#### Drift-search patterns?

A strong PR_TOUGH.md lists **regex patterns** for known drift (e.g., forbidden field names, deprecated APIs, stale aliases). If missing, the review depends on memory.

#### Output format specified?

- [ ] Severity scale (Critical/High/Medium/Low or A+/A-/F)
- [ ] File:line citations required
- [ ] "What/Why/Fix" structure per finding
- [ ] Architectural drift score (1–5 or letter grade)
- [ ] "Don't produce .md-only findings" rule (code reviews target code, not docs)

#### Verification commands listed?

- [ ] Build command
- [ ] Targeted test command
- [ ] Scoped vs solution-wide build distinction
- [ ] Lint command for changed files

Without these, the reviewer can't actually run anything and just opines.

---

### 2.4. RUN_PLAN.md

#### Phases present? (Critical)

A solid RUN_PLAN.md has these phases. Flag missing ones:

- [ ] **Phase 0 — Preflight** (no code changes; restate task, read source, identify owner/seam, blast radius, tests, risks)
- [ ] **Phase 1 — Implementation** (one bounded change at a time, re-read before edit, lint after each)
- [ ] **Phase 2 — Validation** (lane selection, narrow tests first, scoped build)
- [ ] **Phase 3 — Self-review** (defect classes, hostile-reviewer mindset)

#### Critical guardrails present?

- [ ] **Constraint extraction gate** (`.constraint-extraction.md` for architectural work)
- [ ] **Plan obedience rule** (no scope cutting, no reordering)
- [ ] **Refactor completion rule** (old paths must be removed)
- [ ] **Stop conditions** (when to surface blockers instead of improvising)
- [ ] **Long-session discipline** (handoff files, checkpoint commits, context-compression recovery)

#### Authority classifications?

For complex projects, RUN_PLAN.md should classify touched files by authority level (canonical / projection / presentation / evidence / independent). If the project has multiple stores, this is essential. If single-source, skip the check.

#### Templates present?

- [ ] Full execution prompt
- [ ] Short prompt version
- [ ] Task template for handing to AI

These make the file actually usable.

#### Plan Mode mentioned?

RUN_PLAN.md is your heavyweight discipline. Plan Mode is Anthropic's lightweight built-in. Strong RUN_PLAN.md positions itself: "Use Plan Mode for quick changes; use this for architecturally significant work."

If RUN_PLAN.md doesn't mention Plan Mode at all, it's missing the obvious comparison readers will make.

---

## 2.5. Decomposition Proposal (when a file is over budget)

Run this for any file flagged as too long in §2.1–§2.4. A finding that just says "split via @-imports" is not actionable. Produce a concrete decomposition plan.

### How to propose a split

1. **Read the whole file.** Group sections by topic (universal rules, project overview, build commands, code style, testing, architecture, platform-specific addenda, edge cases, templates).
2. **Identify what must stay in the root.** Always-loaded content with no good place to extract: project overview, non-negotiable rules, build/test commands, the `@-imports` block itself.
3. **Identify what can extract** — content that's either (a) topic-specific (style, testing, architecture), (b) platform-specific (only relevant when working on that platform), or (c) reference material that doesn't need to live in context every message.
4. **Identify what should be deleted** — stale content from another project, irrelevant platform addenda (e.g., WPF rules in a Python repo), duplicated content already in another file.
5. **Identify what should move to a Skill** — long procedures (onboarding, release flow, migration runbooks) that are only relevant occasionally. Skills cost zero tokens until invoked.

### Tool support — important caveats

| File | @-import support | Recommendation |
|---|---|---|
| **CLAUDE.md** | Yes — official Claude Code feature, recursive 5 deep, `@~/.claude/` for user-level | Aggressively split when over budget |
| **AGENTS.md** | No formal spec support — different tools handle imports differently | Prefer section-based organization with table of contents; avoid `@-imports` for portability |
| **PR_TOUGH.md** | N/A — loaded on demand, not auto-loaded | Length matters less; split only if it actively hurts readability |
| **RUN_PLAN.md** | N/A — loaded on demand, not auto-loaded | Same as PR_TOUGH; modularize for clarity, not token cost |

### Output format for the decomposition

```
## Proposed Decomposition: <filename>

Current: <N> lines, monolithic.
Target: ~<M> lines root + <K> imported files.

Root <filename> (keep, ~<lines>):
  Lines a-b    <topic, e.g., Project overview and architecture summary>
  Lines c-d    <topic, e.g., Non-negotiable rules>
  Lines e-f    <topic, e.g., Build/test commands>
  Lines g-h    <topic, e.g., @-import block>

Extract to @docs/agents/<topic>.md (~<lines>):
  Lines i-j    <what>

Extract to @docs/agents/platform-<name>.md (~<lines>) — loads only when working on <stack>:
  Lines k-l    <what>

Move to .claude/skills/<name>/SKILL.md (zero token cost until invoked):
  Lines m-n    <long procedure>

Delete entirely (stale / not used by this project):
  Lines o-p    <what, with reason — e.g., "Vue 2 rules; repo has no Vue files">

Net result: root file <M> lines (<X>% of original), <Y> lines of stale content removed,
<Z> lines moved to on-demand imports, <W> lines moved to invocation-only skills.
```

### Naming conventions

Recommend this structure unless the repo already has a different convention:

```
.
├── CLAUDE.md                          # ~100 lines, root file with @-imports
├── AGENTS.md                          # cross-tool primary, ~50-150 lines
├── PR_TOUGH.md                        # load-on-demand
├── RUN_PLAN.md                        # load-on-demand
└── docs/
    └── agents/
        ├── style.md                   # code style, naming, formatting
        ├── testing.md                 # test commands, conventions, fixtures
        ├── architecture.md            # layer boundaries, owner/seam map
        ├── security.md                # forbidden patterns, secret handling
        └── platform-<name>.md         # one per platform addendum
```

For user-level (not project-level) personal preferences, propose `@~/.claude/<name>.md` paths.

### Edge cases the decomposition must handle

- **Universal vs project-specific content already mixed in one file.** This is the most common pattern that produced the over-budget state. Recommend extracting *all* platform addenda into separate per-platform files that load only when the work touches that platform. The root file should describe THIS project, not be a manual for every project type.
- **Content that looks like a skill candidate.** Long step-by-step procedures (e.g., "How to onboard a new team member", "Release process", "Database migration runbook") are usually skill candidates, not CLAUDE.md content. Skills cost nothing until invoked.
- **Content duplicated across files.** If PR_TOUGH.md and CLAUDE.md state the same architectural rules, pick one home. PR_TOUGH should reference the rule, not restate it.
- **`@-imports` that don't exist yet.** When proposing imports, propose the new file's content too — at least an outline. Don't recommend a split that requires the user to invent content from scratch.

### When NOT to propose a split

- The file is under budget. Splitting a 120-line CLAUDE.md is overhead, not improvement.
- The content is genuinely indivisible — every rule references every other rule, no clean topic boundaries.
- The project doesn't use the relevant tool. Don't propose `@-imports` for AGENTS.md if the team uses only tools that don't support imports.

In these cases, say so explicitly in the audit findings: "No decomposition recommended — file is at appropriate length for its role."

---

## 3. Cross-File Coherence

These checks compare files against each other.

### 3.1. No contradictions

- Does CLAUDE.md say "always use TDD" while AGENTS.md says "tests are optional"?
- Does PR_TOUGH.md require a build to pass while RUN_PLAN.md says "build is optional for source-only changes"?
- Do CLAUDE.md and AGENTS.md cite different build commands?

List every contradiction with file:line on both sides.

### 3.2. Consistent architecture vocabulary

If CLAUDE.md says "controller → service → repository" and PR_TOUGH.md says "presentation → domain → infrastructure," that's a vocabulary drift. Pick one and use it everywhere.

### 3.3. Layering: AGENTS.md primary, CLAUDE.md as extension

Recommended pattern:

- **AGENTS.md** owns the cross-tool universal rules (build, test, style, commit conventions).
- **CLAUDE.md** owns Anthropic-specific extensions (hooks, skills, subagents, MCP, Plan Mode references) plus a `See @AGENTS.md` import.
- **PR_TOUGH.md** references AGENTS.md / CLAUDE.md as the architecture-of-record.
- **RUN_PLAN.md** references AGENTS.md / CLAUDE.md as the rules to obey, and PR_TOUGH.md as the self-review framework.

If CLAUDE.md is doing AGENTS.md's job (project overview, build commands) and AGENTS.md is doing CLAUDE.md's job (Anthropic-specific Plan Mode coverage), the layering is inverted. Flag it.

### 3.4. No stale content from another project

Grep all four files for:
- Project names that don't match the current repo
- File paths that don't exist
- Tech-stack references that don't apply
- "We use X" claims where X isn't actually used

Stale content is a critical finding — it actively misleads the AI.

### 3.5. Same model versions

If CLAUDE.md says "Opus 4.7" and PR_TOUGH.md says "Opus 4.5," one of them is wrong. Pin to current (Opus 4.7 / Sonnet 4.6 / Haiku 4.5 as of May 2026) and keep all four files aligned.

---

## 4. Project-Fit Audit

For the detected stack (from §1.2), check whether the four files cover the platform's specific failure modes. This catches "generic governance file copy-pasted from a template" syndrome.

### 4.1. Required content per detected stack

| Stack | Must-have rules |
|---|---|
| **WPF / .NET Desktop** | Settings cached as static = anti-pattern; ObservableCollection on UI thread only; `async void` needs top-level catch; atomic settings save (temp + rename); `Task.Run` for external processes |
| **ASP.NET + MongoDB** | Layer boundaries (controller/service/repo); FeatureClaim parameters not "unused"; discriminator guards; full Mongo document shape on writes; units at boundaries |
| **PowerShell tooling** | Dispatch tables over if/else chains; canonical persistence helpers (no raw `Set-Content` scattered); no `Write-Host` in module/library code; truthful verb naming (`Get-*` read-only) |
| **Static web (HTML/JS/CSS)** | Three-file architecture (content/runtime/styling separated); helper-first reuse; no npm/build steps |
| **Embedded / sandboxed** | Sandbox-escape prevention; transport abstraction; cleanup on failure |
| **C++ / CMake** | Concept layering; atomic writes with backup; JSONC-aware editing |
| **Hardware control** | Movement success not assumed; pre-cycle abort; `volatile` stop signals; geometric null guards |
| **Vue 2 frontend** | `Vue.set` for added reactive properties; blob error handling; `.length` not `.count`; `===` not `==` |

If the detected stack is on this list and the rules aren't in any of the four files, that's a project-fit gap.

### 4.2. Forbidden content per detected stack

If the stack is a static site, having WPF rules is noise. If the stack is Python, having Mongo rules is noise. Each irrelevant section costs context every message.

List every irrelevant section. Recommend moving to `@-imported` files that load only when relevant, or deleting outright.

### 4.3. Evidence of real failure modes

Run `git log --oneline -30` (or `--since="3 months ago"`). Look for fix commits, revert commits, "fix bug" / "fix issue" / "hotfix" patterns. These are evidence of real failure modes in this project.

Check whether the governance files have a rule that would have prevented each. Gaps here are the highest-value findings — the project has *literally already had this problem* and nothing protects against it.

---

## 5. Output Format

Write findings to `ai-audit-findings.md` (or wherever the user specifies). Structure:

```markdown
# AI Governance Audit — <repo name>

**Date:** <ISO date>
**Detected stack:** <e.g., "ASP.NET 8 + MongoDB + Vue 2 frontend">
**Files audited:** CLAUDE.md (X lines), AGENTS.md (Y lines), PR_TOUGH.md (Z lines), RUN_PLAN.md (W lines)
**Files missing:** <list, or "none">

## Executive Summary

One paragraph. State the verdict per file: Healthy / Drifted / Stale / Missing.
State the top three fixes by impact.

## Per-File Grades

| File | Grade | Headline issue |
|---|---|---|
| CLAUDE.md | A–F | <one line> |
| AGENTS.md | A–F | <one line> |
| PR_TOUGH.md | A–F | <one line> |
| RUN_PLAN.md | A–F | <one line> |

## Findings

Order by severity. For each finding:

- **Severity:** CRITICAL / HIGH / MEDIUM / LOW
- **Category:** Length / Project-fit / Cross-file / Currentness / Modern-features / Missing-rule / Stale-content / Hard-gate / etc.
- **File:Line:** exact location (or "missing" if the file doesn't exist)
- **What:** what is wrong
- **Why it matters:** concrete current cost
- **Fix:** smallest credible change

## Cross-File Conflicts

Direct contradictions between files, each with both sides cited.

## Project-Fit Gaps

Failure modes the project has had (per git log) that aren't covered by any file.

## Top 5 Fixes Ordered by Impact

1. <one-line action>
2. <one-line action>
3. <one-line action>
4. <one-line action>
5. <one-line action>

## What's Working

Brief. Three to five items the files got right. Keeps the audit balanced.

## Sources

Links to any official docs cited (Anthropic best practices, AGENTS.md spec, etc.).
```

---

## 6. Audit Rules

- **Verify, don't invent.** If you're not sure a file says X, grep it. Don't assert from memory.
- **Quote, don't paraphrase, when calling out wrong content.** A finding that says "CLAUDE.md says we use MongoDB" is unfalsifiable. "CLAUDE.md line 47: `'All data stored in MongoDB'` — but the repo has no Mongo driver" is actionable.
- **Cite line numbers** for every per-file finding.
- **Don't flag missing rules that are irrelevant.** "No FeatureClaim coverage" in a static-site repo is not a finding — it's irrelevant.
- **Don't propose abstract improvements.** "Improve clarity" is not a finding. "Replace lines 30–35 with a single rule: 'Run `npm test` after every edit'" is a finding.
- **Don't audit `.md` writing style.** This is a governance audit, not a copy-editing pass.
- **Be honest about your own limits.** If a check requires running code (e.g., "verify the build command works"), say "could not verify build command without executing" rather than asserting success or failure.

---

## 7. Stop Conditions

Pause the audit and ask the user if:

- The detected stack is genuinely ambiguous (e.g., a mixed monorepo with several stacks).
- One of the files contains content that looks tenant- or customer-specific (might be private, don't quote it back without confirmation).
- The four files describe radically different architectures and you can't tell which is current.
- Git history is empty (no failure-mode evidence available).

---

## 8. How to Invoke

In your Claude Code session:

> "Audit my governance files using `ai-audit.md`. Output findings to `ai-audit-findings.md`."

Or scoped:

> "Audit only `CLAUDE.md` using `ai-audit.md`. Skip the cross-file checks."

Or paired with a fix-it pass:

> "Run the audit per `ai-audit.md`. Report to `ai-audit-findings.md`. Then propose specific edits for the top 3 findings as a follow-up — but do NOT apply them. Wait for me to approve."

---

## 9. Why This Exists

Governance files drift. A `CLAUDE.md` written for a Mongo+ASP.NET project gets copy-pasted into a static site repo. A `PR_TOUGH.md` with hard gates for hidden-mutation defects gets diluted into vague rules over six months of edits. An `AGENTS.md` never gets written because "we use CLAUDE.md." Each is a slow, silent erosion of the AI's reliability.

A periodic audit catches drift before it compounds. This file makes the audit checklistable and tool-agnostic — runnable in any project, by any AI agent, against any stack.

The four files exist to make AI more reliable. This file exists to make sure the four files are still doing their job.
