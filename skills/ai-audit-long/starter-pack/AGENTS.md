# AGENTS.md

Cross-platform quick reference. Full guidance, architectural rules, and execution discipline live in [`CLAUDE.md`](CLAUDE.md). Execution methodology lives in [`RUN_PLAN.md`](RUN_PLAN.md). Code review framework lives in [`PR_TOUGH.md`](PR_TOUGH.md).

This file is the entry point. If you only read one section, read **Non-Negotiable Rules** below.

---

## Architecture Summary (THIS Repo — `<tailor at install>`)

`<Tailor at install: replace this section with a short architecture summary of the target repo — what it is, the files or projects that make it up, how to run it locally, and how it deploys.>`

`<Tailor at install: point to the platform addendum (A–L) in CLAUDE.md that carries this repo's platform-specific mechanics.>`

---

## Non-Negotiable Rules (Universal)

These apply on every project, every platform, every commit.

1. **Git operations require explicit user approval.** Never commit, push, amend, force-push, rebase, reset, or `git clean -f` without explicit permission. Approval once is not approval forever.
2. **Search before you write.** Before writing any new pattern, helper, or shared logic, search the codebase first. Use the existing seam.
3. **Forward-only architecture.** Never preserve backward compatibility unless the user explicitly asks. Prefer deletion over migration ballast.
4. **Function names must tell the truth.** `Get-*` is read-only; `Test-*` does not clean up; `Resolve-*` does not delete. If a function stops doing async work, drop the `Async` suffix.
5. **Preserve full object shape on mutations.** Read, mutate, write. Never read, rebuild-partial, write.
6. **Minimum viable code.** Change the smallest set of files required. List unrelated improvements as follow-up; do not edit them as side effects.
7. **Answer questions, don't act on them.** When the user asks a question, answer it. Wait for explicit instruction before making changes.
8. **For risky actions, confirm before acting.** Destructive operations (delete files, drop tables, force-push), hard-to-reverse operations (`git reset --hard`, removing dependencies), and actions visible to others (PRs, Slack, email) need explicit authorization for the specific action.
9. **Don't hide uncertainty.** If blocked, surface the missing fact. Do not improvise with confident wording.
10. **A refactor is not done when both paths still ship.** Old path must be removed from runtime, or report the work as incomplete.

---

## Project-Level Guardrails (THIS Repo — `<tailor at install>`)

`<Tailor at install: replace this section with a short numbered list of this repo's specific guardrails — the "do not" rules unique to its architecture (layer boundaries, generated artifacts, dependency policy, canonical helpers). Keep each one short and checkable, and end the list with: "Do not commit or push without explicit user permission.">`

---

## Working in Other Stacks?

If your change touches a platform other than the static site, read the matching addendum in `CLAUDE.md` before editing:

| Section | Platform | Triggers |
|---|---|---|
| A | WPF / .NET Desktop | `.xaml`, `.xaml.cs`, single-file `*.cs` apps, MVVM, overlays |
| B | WiX / MSI / Release Pipeline | `WorkstationMsi/`, `PrintMsi/`, GitHub Actions release workflows |
| C | Physical Hardware & Crippa Bend Math | TigerStop, RazorGage, Crippa XML/YBC, bend instructions |
| D | ASP.NET + MongoDB | Controllers, services, repositories, Mongo projections, FeatureClaim |
| E | Vue 2 / Browser JS | Vue 2 components, `Vue.set`, jQuery-era surfaces |
| F | PowerShell Orchestration | Session authority, registry-driven dispatch, WT mutation |
| G | C++ / CMake Experiments | Reusable concept layering, JSONC editing, single-purpose experiments |
| H | Static HTML/JS/CSS | `index.html`, `app.js`, `style.css` |
| I | Embedded Linux | Device cloud sync, sandboxed FS, transport abstraction |
| J | Python Reporting & APIs | matplotlib/reportlab pipelines, FastAPI + Pydantic |
| K | Revit / BIM Integration | ConduitRun traversal, bend sheet generation |
| L | Retro Game / Custom-Chrome Overlays | Game loops, owner-drawn controls, custom WPF chrome |

---

## Execution Discipline Quick Reference

For any non-trivial change, follow the discipline in `CLAUDE.md` Section 3 and `RUN_PLAN.md`:

1. **Preflight** — restate the task, read actual source, identify owner/seam, identify blast radius, state execution order.
2. **Implementation** — one bounded change at a time. Re-read function and callers before editing. Change the minimum.
3. **Validation** — re-check callers, run targeted tests, state manual validation truthfully.
4. **Self-review** — architecture drift, data shape drift, error propagation, safety.

For architectural work (RUN_PLAN runs, design changes, authority changes), the **Constraint Extraction Gate** is mandatory: write `.constraint-extraction.md`, wait for user approval, then code. See `CLAUDE.md` Section 3.5.

---

## When Context Gets Long

If you're deep into a multi-step task and context is filling up:
- Write numbered handoff files (`1.md`, `2.md`, `3.md`) in the memory directory capturing what was done, what remains, files modified, decisions made.
- Suggest checkpoint commits at natural milestones (with user approval).
- After context compression: re-read the active plan, this file, `CLAUDE.md`, and the source files. Do not continue from memory alone.

See `CLAUDE.md` Section 2 for full session-continuity rules.
