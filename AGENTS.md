# AGENTS.md

Cross-platform quick reference. Full guidance, architectural rules, and execution discipline live in [`CLAUDE.md`](CLAUDE.md). Execution methodology lives in [`RUN_PLAN.md`](RUN_PLAN.md). Code review framework lives in [`PR_TOUGH.md`](PR_TOUGH.md).

This file is the entry point. If you only read one section, read **Non-Negotiable Rules** below.

---

## Architecture Summary (THIS Repo — AIManifesto)

A zero-dependency static single-page tutorial and quiz site, deployed to GitHub Pages.

Three files make up the entire site:
- `index.html` — all content, quiz data arrays, HTML structure.
- `app.js` — runtime logic only (tab switching, quiz engine, search, glossary).
- `style.css` — all styling via CSS custom properties.

Running locally: `start index.html`. Deployment: push to `master` (auto-deploys via GitHub Pages).

For static-site mechanics (tabs, quizzes, tooltips, glossary), see **Section H** in `CLAUDE.md`.

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

## Project-Level Guardrails (THIS Repo — AIManifesto)

1. Do not put content in `app.js` or runtime logic inline in `index.html` (quiz data arrays are the documented exception).
2. Do not manually create `<span class="tt">` tags — the tooltip system generates them automatically from `glossaryTerms`.
3. Do not hand-roll tab switching, quiz rendering, or glossary back-links — use existing helpers in `app.js`.
4. Do not duplicate CSS custom properties already defined in `:root`.
5. Do not add build steps, npm dependencies, or server requirements. This is a zero-dependency static site.
6. When adding a glossary term, do all three steps: `glossaryTerms` object, glossary table row, working `data-anchor` link target. See `CLAUDE.md` Section H.5.
7. Do not commit or push without explicit user permission.

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
| F | PowerShell / EngineerForge | Session authority, registry-driven dispatch, WT mutation |
| G | C++ / CMake Experiments | WinTCar, reusable concept layering, JSONC editing |
| H | Static HTML/JS/CSS (THIS REPO) | `index.html`, `app.js`, `style.css` |
| I | Embedded Linux / reMarkable | reMarkable cloud sync, sandboxed FS, transport abstraction |
| J | Python Reporting & APIs | matplotlib/reportlab pipelines, FastAPI + Pydantic |
| K | Revit / BIM Integration | ConduitRun traversal, bend sheet generation |
| L | Retro Game / Custom-Chrome Overlays | Asteroids, Atari, Perceptron, custom WPF chrome |

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
