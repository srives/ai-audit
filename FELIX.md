# FELIX.md — What to Contribute to the Team's Felix Repo

**Date:** 2026-07-11
**Question:** My boss asked me to contribute to `C:\repos\Felix`. What do I have that would be good for the team?
**Answer:** Contribute an **`ai-audit` skill** — audit a repo's AI health (governance drift, staleness, contradictions, cognitive overload). It's uniquely mine, nothing like it exists in Felix, and the company's own repos demonstrably have the disease it cures.

---

## 1. What Felix is

Felix (`github.com/GTP-Services/felix`) is the team's **shared PI-agent package**: skills and extensions distributed to every engineer's machine via `pi install / pi update`. Contribution model (per `CONTRIBUTING.md`):

- Drop a `skills/<name>/SKILL.md` folder (or an `extensions/<name>.ts`) into a clone, open a PR.
- A `/skill:contribute` helper scaffolds, tests (`pi -e ./`), and prints the git/PR commands.
- Review is a **security boundary** — keep changes focused and easy to audit.
- After merge + tag, the whole team gets it with `pi update`.

### What Felix already has

| Bucket | Skills |
|---|---|
| Tool drivers | `stratus-cli`, `jira`, `gh` (ext), `mabl`, `getdx-cli`/`getdx-setup`, `mcp-atlassian` (ext), `atlassian-setup` |
| Workflow automations | `fix-spvr`, `rc`, `qa-test-steps`, `test-gap`, `mabl-coverage-heatmap`, `troubleshoot`, `dev-impact-metrics`, `comment-on-issue` |
| Domain teaching | `learn-mep` |
| Meta | `contribute`, `pi-coding-agent`, `stratus-api-setup` |
| Third-party (not vendored) | Matt Pocock's `tdd`, `triage`, `grill-me`, `diagnose`, `improve-codebase-architecture` — installed from upstream |

### What Felix has zero of

Anything about **governing the AI itself** — no governance auditing, no review-framework skill, no drift protection, no prompt-engineering pipeline. That's exactly my specialty.

---

## 2. What exploration of the company repos found

`C:\repos\Stratus` (cloud SaaS: ASP.NET Core + MongoDB + Azure/AKS + dual Vue) and `C:\repos\Tooling` (WPF desktop + WiX MSI + machine drivers) are a **heavily AI-assisted shop whose AI setup is ungoverned** in precisely the ways my ai-audit work catches:

| Pain point (evidence) | My tool that catches it |
|---|---|
| `CLAUDE.md` / `AGENTS.md` / `PR_TOUGH.md` / `RUN_PLAN.md` **copy-pasted and drifting** across Stratus, Tooling, and nested `Tooling\Gtpx.Stratus.Workstation\` | `AI-AUDIT.md` §3 cross-file coherence + stale-content checks |
| **50+ loose review artifacts** in the Stratus root: `PRc.md`…`PRc7.md`, `PRClaude1-3.md`, `*-codex*.md`, `*-claude*.md`, a 335 KB `log.md`, malformed filenames — a real multi-model review pipeline (Claude vs Codex vs Cursor) with no governed home | Governance patch rules; a skill can standardize output location and gitignore/archive policy |
| Both repos set **`defaultMode: bypassPermissions`** in `.claude/settings.local.json` — agents run with prompts disabled | A named finding in `AI_AUDIT_GOVERNANCE_REVIEW.md` posture checks |
| Governance is **Claude-only** (CLAUDE.md, `.claude/`) while Codex and Cursor are demonstrably in use (`reverse-cursor1.md`, dozens of `*-codex*.md`) — no `.cursorrules`, no Copilot instructions | `AI-AUDIT.md` coverage / project-fit checks |
| Stratus: **~24% of recent commits are fix/guard/revert** (95 of 400); CI auto-retries flaky tests (`auto-rerun.yml`, 2× test retries in `pr-build.yml`) | `PR_TOUGH2.md` + `AI_AUDIT_SEAM_REVIEW.md` — rules derived from real failure modes |
| **No `PULL_REQUEST_TEMPLATE`**; PR expectations live only in AGENTS.md prose | Audit finding + smallest-credible-fix recommendation |

### The beachhead already exists

`C:\repos\Tooling\taxonomy\2400-windows-desktop-wpf\` contains an **11-layer `ai-basic-expert` taxonomy** (YAML frontmatter `kind: ai-basic-expert`, per-layer `Expert.md` + review checklists) — my AI-BASIC expert framework is *already installed in a company repo*. The team also already uses `PR_TOUGH.md` manually (the `PRc*.md` sprawl is its output) and has real `.claude/commands`. The methodology is half-adopted; what's missing is the packaged tooling around it.

---

## 3. Recommendation: the `ai-audit` skill

One skill: **`skills/ai-audit/SKILL.md`** —

> *"Audit this repo's AI health: check CLAUDE.md, AGENTS.md, and agent governance for drift, staleness, contradictions, missing coverage, and cognitive overload. Produces a graded findings report with file:line citations."*

### Why this wins

1. **Uniquely mine.** Nobody on the team has this. It's not a tool driver anyone could write in an afternoon — it's distilled methodology from months of governance work across Fork/EngineerForge, AI-BASIC, and ai-audit.
2. **The demo writes itself.** Run it against Stratus and Tooling *before* opening the PR. The findings in §2 are real and current — the PR description can say "here's what it found in our own repos today." Unanswerable pitch.
3. **Fits Felix's shape.** Self-contained SKILL.md + co-located checklist resources (the pattern the `rc` skill uses with its mongosh script). No dependencies, read-only on code, easy to security-review — exactly the CONTRIBUTING.md bar.
4. **Rides a wave the team is already on.** They installed the taxonomy, they use PR_TOUGH manually, they have `.claude/commands`. This formalizes what's already half-adopted.

### Source material (from `C:\repos\ai-audit`)

| Master file | Feeds the skill's… |
|---|---|
| `AI-AUDIT.md` | Core checklist: per-file audit, cross-file coherence, project-fit, decomposition proposals |
| `AI_AUDIT_GOVERNANCE_REVIEW.md` | Cognitive-load rubric (10 axes, A–F grade), posture findings (`bypassPermissions`) |
| `AI_AUDIT_SEAM_REVIEW.md` | Seam-review gates to recommend into `RUN_PLAN.md` / `PR_TOUGH.md` |
| `PR_TOUGH2.md` | Bug-discipline additions (fixed-point review, smell baseline, red-capable repros) |

### Tailoring for GTP (per the exploration)

- **.NET multi-solution aware** — reason over `.sln`/`.csproj` scoping the way `pr-build.yml` does path-based component detection.
- **Multi-agent coverage** — check for Codex/Cursor/Copilot governance, not just Claude.
- **`bypassPermissions` as a named finding** — with the compensating-audit-trail recommendation.
- **Artifact-sprawl check** — flag ungoverned `PRc*.md` / `*-codex*.md` / plan-compare files in repo roots; recommend a standard output folder + gitignore.
- **Taxonomy-aware** — recognize and extend the `kind: ai-basic-expert` taxonomy pattern rather than reinventing it.
- **Cross-repo drift check** — compare the duplicated governance files across Stratus / Tooling / Workstation and report divergence.

---

## 4. Runner-up and follow-ups

| Contribution | What | When |
|---|---|---|
| **`pr-tough` review skill** (runner-up) | Run the PR_TOUGH.md hostile-review rubric the team already uses manually; standardize where `PRc*` output lands (also fixes the sprawl). | PR #2 — keep each PR focused per CONTRIBUTING.md |
| **`make-a-wish` / wish→prompt skill** | The `MAKE_A_WISH.md` → `WISH_TO_PROMPT.md` pipeline for stating work properly before an AI executes it. | Later, once the audit skill lands |
| **Governance bootstrap** | `MakeOutsideRepo.md`-style install: Sorting Hat → taxonomy → experts → tailored RUN_PLAN/PR_TOUGH into a target repo. | After the taxonomy pattern gains team traction |

### Considered and set aside (for now)

- **EngineerForge engine** (`C:\repos\Fork`) — mature (v8.2.0, ~170K LOC) but Windows/PowerShell-bound and the wrong granularity for a PI skill. Its *methodology* travels via the files above; the engine doesn't.
- **`mongoJS.cmd` / C:\scripts framework** — genuinely good infrastructure (KeyVault-authed Mongo runner, `h`/`Make`/`cmdCheck` self-documenting CMD system, `CreateInstall.cmd`), but it's infrastructure, not a skill — and Felix already has `stratus-cli` + Mongo MCP covering the access story.
- **mongo-data-mining `src/lib/`** — a strong 30-module mining framework and the Stratus data dictionary (`SCHEMA_MAP.md`, `FK_collections.md`) are reusable, but they're a library/knowledge asset, not a Felix skill. The data dictionary could later back a "stratus-schema" skill.
- **Personal nav scripts** (~100 one/two-char `cd` bookmarks) — personal muscle memory, not shareable.

---

## 5. Suggested path

1. **Draft** `skills/ai-audit/SKILL.md` + co-located checklist resources, adapted from the four ai-audit masters and tailored per §3.
2. **Dry-run** it against Stratus and Tooling; capture the findings report.
3. **Contribute** via Felix's flow: clone → branch `add-ai-audit` → `pi -e ./` to test → PR with the findings report as the demo.
4. **Follow up** with the `pr-tough` skill as PR #2 once the first lands.

---

## Appendix: exploration evidence paths

- **Felix:** `C:\repos\Felix\README.md`, `CONTRIBUTING.md`, `AGENTS.md`, `skills\*\SKILL.md`
- **Governance in company repos:** `C:\repos\Stratus\CLAUDE.md`, `C:\repos\Tooling\CLAUDE.md`, both `AGENTS.md`, `C:\repos\Stratus\.claude\commands\*.md`, `C:\repos\Tooling\taxonomy\2400-windows-desktop-wpf\**`, both `.claude\settings.local.json` (`bypassPermissions`)
- **Review/CI:** `.github\workflows\{pr-build,validate-pr-title,auto-assign,auto-rerun}.yml` (both repos), `PR_TOUGH.md` / `RUN_PLAN.md` / `PLAN_RULES.md` (both roots)
- **Pain points:** `C:\repos\Stratus\{PRc*.md,PRClaude*.md,*-codex*.md,log.md,JOBS-FINDINGS-COMMON-BUGS1.md,WEB-SITE-FINDINGS-COMMON-BUGS1.md}`, `C:\repos\Tooling\{WAT-268-BUGS.md,workstation-bugs-final.md}`
- **My assets:** `C:\repos\ai-audit\*` (masters), `C:\repos\Fork` (EngineerForge v8.2.0), `C:\repos\AI-BASIC` (taxonomy/experts/slicing prompts), `C:\scripts` (Sys1000), `C:\repos\mongo-data-mining` (mining framework + data dictionary)
