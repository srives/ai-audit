# CLAUDE_.md — Generic Placeholder Template

> **⚠ PLACEHOLDER — TAILOR AT INSTALL.** This is the generic model `CLAUDE.md` that ships with bAsIc governance payloads. The trailing underscore marks it as a template: when bAsIc is installed on a client machine, this file is tailored to the target project (Section 0 and the platform addenda are replaced or trimmed to the client project's specifics) and renamed to `CLAUDE.md`. Until tailored, Section 0 still describes the repo this template was synthesized from — do not treat that section as instructions for the current repository. The universal sections (1–7) apply as-is to any project.

Guidance for Claude Code (claude.ai/code) working in this repository.

Synthesized from production CLAUDE.md and AGENTS.md files across thirty-one repos spanning PowerShell orchestration (EngineerForge / Fork), ASP.NET + MongoDB services (Stratus), WPF desktop apps (Workstation, Print, Tooling, Monitor, Alfred, Asteroids, Atari), C++ experiments (WinTCar), embedded Linux / reMarkable integration, Revit / BIM plugins (WireWorks), Python reporting tools, Node/Electron session managers, retro-style custom-chrome games (Perceptron), and this static site.

The universal sections (0–7) apply to any project. Platform-specific addenda (A–L) at the bottom apply only when the work touches that platform. This is the AIManifesto repo, so **Section H (Static Web)** describes the immediate working rules for changes to `index.html`, `app.js`, and `style.css`.

---

## 0. Project Overview (THIS Repo)

A static single-page tutorial and quiz website about Claude Code, deployed to GitHub Pages at https://srives.github.io/AIManifesto/. No build step, no server, no npm, no dependencies.

Three files make up the entire site:
- `index.html` (~355KB) — all content, all quiz questions as inline JS arrays, all HTML structure. The dominant file and where most edits happen.
- `app.js` — runtime logic only: tab switching, quiz engine, search (highlight-in-page), hamburger nav, glossary back-links.
- `style.css` — all styling. Uses CSS custom properties (`--bg-primary`, `--accent-blue`, etc.) defined in `:root`.

### Running Locally

```
start index.html
```

Or open `index.html` directly in any browser. That's it.

### Deployment

Pushing to `master` auto-deploys via GitHub Pages. The live site reflects `index.html` at the repo root.

For everything specific to the static-site mechanics (tab system, quiz system, tooltip auto-generation, glossary entries), see **Section H. Static HTML/JS/CSS Sites** below.

---

## 1. Core Principles

These are non-negotiable across every platform. Violating them is a critical defect regardless of how clean the local code looks.

### 1.1. Git operations require explicit user approval.

Never commit, push, amend, force-push, rebase, reset, or run destructive git operations without explicit permission for that specific operation. Approval once is not approval forever — match the scope of your action to what was actually requested.

- `git commit` — ask first, always.
- `git push` — ask first, always.
- `git rebase`, `git reset`, `git checkout --`, `git restore .`, `git clean -f`, `git branch -D` — ask first, always.
- `--force` / `--force-with-lease` — ask first, always.
- Never skip pre-commit hooks (`--no-verify`) unless the user explicitly asks. If a hook fails, fix the underlying issue.
- Never amend an existing commit instead of creating a new one unless the user explicitly asks. After a hook failure, the commit did NOT happen, so `--amend` would modify the PREVIOUS commit and may destroy work.

The user controls when code is committed. Your job is to build, test, and prepare code for the user to approve.

### 1.2. Search before you write.

Before writing any new pattern, helper, or shared logic — search the codebase first. If a function or pattern exists that does what you need, use it. Do not write new inline code until you have confirmed no existing code handles it.

This applies to:
- Helpers, utilities, mappers, builders, validators.
- CSS custom properties (check `:root`).
- Test fixtures and sample loaders.
- Persistence helpers (atomic writers, JSON readers).
- Command/menu dispatch.

Duplication at one location is acceptable. At two, extract. At three or more, the cost of not extracting compounds.

### 1.3. Forward-only architecture.

- Never try to stay backward compatible unless the user explicitly asks for a temporary bridge.
- Always forward, never backward.
- Prefer clean contracts and interfaces over function hacks, shims, and compatibility layers.
- When a legacy pattern blocks a cleaner design, remove it instead of preserving it.
- Do not emit both old and new field names "just in case."
- Do not add fallback chains for old data formats.

If a refactor introduces a bridge, the plan must name the deletion condition.

### 1.4. Function names must tell the truth.

- `Get-*` / `get*` functions are read-only. They must not mutate state.
- `Test-*` / `test*` / `is*` functions must not perform cleanup.
- `Resolve-*` / `resolve*` functions must not delete.
- If an `async` function no longer does asynchronous work, remove `async`/`await`, change the return type, and rename it to drop the `Async` suffix.
- Comments and doc-strings must match the actual behavior. Update them when you change behavior.

### 1.5. Preserve full object shape on mutations.

When updating a record, document, or settings object: read, mutate, write. Never read, rebuild-partial, write. Stripping identity fields, discriminators, or metadata silently corrupts downstream consumers.

### 1.6. Minimum viable code.

Change the smallest set of files and methods required. Do not widen into unrelated cleanup, broad refactors, new abstractions, or "future flexibility." If you notice something else that should be fixed, list it as follow-up instead of editing it as a side effect.

A senior reviewer should be able to see why each changed line is needed for the task.

### 1.7. Collaboration norm.

When the user asks a question, **answer the question**. Do not treat a question as a command to act. Wait for an explicit instruction before making changes. "Should we…?" and "What about…?" are questions, not authorizations.

### 1.8. Executing actions with care.

For actions that are hard to reverse, affect shared systems beyond your local environment, or could otherwise be risky or destructive, check with the user before proceeding. The cost of pausing to confirm is low; the cost of an unwanted action can be very high.

Examples that warrant confirmation:
- Destructive operations: deleting files/branches, dropping tables, killing processes, `rm -rf`, overwriting uncommitted changes.
- Hard-to-reverse: force-pushing, `git reset --hard`, amending published commits, removing or downgrading dependencies, modifying CI/CD pipelines.
- Actions visible to others: pushing code, creating/closing PRs or issues, sending Slack/email/GitHub messages, posting to external services.
- Uploading content to third-party tools (diagram renderers, pastebins, gists) — content may be cached or indexed even after deletion.

When you encounter an obstacle, do not use destructive actions as a shortcut. Identify root causes. If you discover unexpected state (unfamiliar files, branches, configuration), investigate before deleting or overwriting — it may be the user's in-progress work.

---

## 2. Session & Context Management

### 2.1. Context Compression Recovery

When the conversation context is compressed (messages summarized to free up space):

1. **Re-read the active plan.** If a `RUN_PLAN.md`, `PLAN*.md`, or similar plan file is driving the work, re-read it immediately after compression to restore awareness of remaining steps, current phase, and completion criteria.
2. **Re-read `CLAUDE.md`.** Architectural rules and guardrails may have been lost in compression. Re-read this file.
3. **Check task state.** If tasks were being tracked, review them to understand what is complete and what remains.

Do not continue executing a plan from memory alone after compression. Always re-ground from the source files.

### 2.2. Checkpoint Discipline

For multi-step tasks, create checkpoints so work is not lost if context is compressed or the session ends.

- **Before compression is likely** (long-running tasks, large diffs accumulating): ask the user if they want to commit current progress as a checkpoint.
- **At natural milestones** (a phase completes, a feature works but is not yet polished): surface the milestone and suggest a checkpoint commit.
- **When switching between plan phases:** suggest committing the completed phase before starting the next.

Checkpoints should be real git commits with descriptive messages, not just saved files.

### 2.3. Session Continuity Memories

When working on a multi-session task (a plan that spans multiple conversations), proactively save progress memories so the next session can pick up where this one left off.

Save as memory files (e.g., `progress_<planname>.md`) in the memory directory:
- **What was completed** — which plan phases or steps are done.
- **What is in progress** — current step, any partial work, blockers encountered.
- **Key decisions made** — architectural choices and trade-offs decided during implementation.
- **What to do next** — the immediate next step when work resumes.

Update memories as work progresses, not only at the end.

### 2.4. Long Session Context Management

Long AI sessions fill context windows. The AI then loses track of earlier decisions, code changes, and test results, causing sloppy edits, repeated work, and silent regressions.

Rules for long sessions:

1. **Create numbered handoff files as context fills.** When context is getting long, write a `<N>.md` file (`1.md`, `2.md`, `3.md`) in the memory directory capturing:
   - what was done since the last handoff
   - what is still remaining
   - any files modified
   - any decisions made that a future context needs to know
2. **Do local commits at each handoff point** (with user approval). Use descriptive commit messages summarizing the work batch.
3. **Reference earlier handoff files when needed.** If a later decision depends on an earlier one, re-read the relevant handoff file instead of guessing from memory.
4. **Do not let context pressure cause shortcuts.** Running out of context is not an excuse to skip hard items, defer work to "help me" files, or stop validating. If context is full, checkpoint and continue — do not silently downgrade the remaining work.

### 2.5. Plan Obedience Rule

When the user gives you a plan, the plan controls the work.

- Do not change scope because some items look harder, easier, slower, or less interesting.
- Do not reorder the plan for convenience or preference.
- You may change order only when later work is a real prerequisite for an earlier planned item, and you must say so explicitly.
- You must do the whole plan — all phases, all sub-plans, all sections — unless the user explicitly narrows scope.
- You are not allowed to "bank progress" by doing the easy parts and leaving the hard parts for later while still presenting the plan as substantially done.
- You are not allowed to silently cut work because it feels too hard, too big, too risky, or too tedious. If something truly cannot be done, report it as a blocker against the plan; do not redefine the plan.

---

## 3. Execution Discipline

### 3.1. Preflight (Before Any Code Changes)

For any multi-file or architecturally significant change:

1. **Restate the task.** Requested outcome, scope, non-goals, assumptions.
2. **Read the actual source files** the plan or task names. Confirm the code still matches the plan. If a function moved, changed shape, or was already partially fixed, say so before proceeding.
3. **Identify the owner and seam.** Name the canonical file or function that owns the behavior.
4. **Identify the blast radius.** For every function you will modify, find every caller. If the contract changes, all callers are in scope for validation.
5. **State the execution order** before coding.

### 3.2. Implementation (One Bounded Change At A Time)

For each change:
- Re-read the function or section you are about to modify.
- Re-read its callers if you are changing its contract.
- Re-read the covering tests.
- Change the minimum necessary for this item.
- Do not duplicate helpers or create a second version of an existing utility.
- Do not refactor surrounding code unless directly required for correctness or safety.
- State what changed, in what file and function, and what the behavioral difference is.
- Do not move to the next item until this one is internally consistent.

### 3.3. Validation

- Verify the change works (or state what manual validation is needed).
- Re-check callers and regressions — grep for every modified function and confirm callers are still correct.
- State manual validation truthfully — what was and what was not validated.
- For UI or frontend changes, start the dev server / open in a browser and exercise the feature before reporting the task complete. Type-checking and tests verify correctness, not feature correctness. If you cannot test the UI, say so explicitly rather than claiming success.

### 3.4. Self-Review

Before declaring done, review changes against these defect classes:
- **Architecture and namespace drift** — did you put content in `app.js`, runtime logic in `index.html`, or otherwise violate documented boundaries?
- **Data shape drift** — did you strip fields when mutating objects, or create fallback chains?
- **Pipeline and error propagation** — can errors escape or cause secondary failures?
- **Safety and destructive operations** — did any read path gain hidden cleanup?

### 3.5. Architectural Work: Mandatory Constraint Extraction

For any architectural task involving RUN_PLAN execution, design docs, authority changes, or cross-cutting refactors:

1. Write your constraint extraction to a file: `.constraint-extraction.md`.
2. The user reviews that file and confirms it's complete.
3. The user explicitly says "constraints approved, proceed to code."
4. Only then do you write code.
5. If you attempt to write code without `.constraint-extraction.md` being reviewed and approved, the user will reject the commit and point you back to the file.

This is not optional. No constraint file = no code.

The gate is structural, not behavioral. It does not rely on self-regulation; it relies on the user refusing to proceed until the artifact exists and is correct.

### 3.6. Executor Gates (the Two-F Rule)

Added after five consecutive failed hostile reviews of the same AI executor (AI-BASIC repo, 2026-06-10), each failing on a defect the previous gates did not encode: the executor scoped its own verification and certified itself complete. Conclusion: rules that rely on executor judgment do not survive executor blind spots. These gates are structural, like 3.5, and bind **every task that edits more than one file**, automatically, with no plan citation and no human prompting required.

**Install note (gate 11 applied to this template):** at client install, place these gates in whatever file the target repo declares **canonical** (its `AGENTS.md`-equivalent — the file that says "when documents disagree, this wins"). A copy may remain in the tailored `CLAUDE.md` only with an explicit pointer to the authoritative home. Installing rules in a file the canonical file calls a pointer reproduces the exact defect gate 11 exists to prevent.

**Install checklist (gate 12 applied to this template):** the universal sections (1–7) apply to any project and survive tailoring. Section 0 and the platform addenda (A–L) are **synthesis-source examples, not universal rules**: at install, replace Section 0 with the target project's overview and **delete every platform addendum that does not match the target project's platforms** — retain only the matching ones. A tailored file that still carries foreign addenda teaches rules for projects the client does not have.

1. **Dirty-tree stop.** If the working tree contains changes unrelated to this task, stop before editing anything and ask the human to commit or separate them. One sentence, then wait. A task's diff is its review surface; unrelated content in the surface is an execution defect.
2. **Term-list first, posted before editing.** Produce the complete search-term list — every contract, form, or name this task changes or removes, INCLUDING forms already fixed in earlier passes — and the full file scope. Show it to the human in your first progress message. That list, not any plan table and not your memory of prior work, is the edit checklist. Both Fs lived in terms the executor left off its list.
3. **Touch a file, sweep the file.** Any file you edit gets the full term list run against it, not just the term that brought you there.
4. **Fresh-context review before "done" — with the FIXED protocol.** Before reporting completion, run the repo's hostile review framework against your own diff **in a context that did not produce the diff** (a fresh agent, a `/prc`-style command, or a second AI). You do not compose the reviewer's instructions: pass it exactly (a) the repo's `PR_TOUGH.md`, (b) the mechanical close-out block from gate 6 (the reviewer runs it too), and (c) this sentence verbatim: "Review the entire working tree including untracked files; do not confine yourself to the executor's claims or file list." A custom reviewer prompt is a scoped reviewer, and a scoped reviewer inherits the author's blind spots — the third failed review in the originating incident traced to a hand-written reviewer prompt that omitted the validation block. Fix every High finding before reporting, and include the reviewer's output in your report.
5. **Repo-visible or it didn't happen.** Decisions, deviations, batch plans, and follow-ups go in tracked files, never only in chat or gitignored files. Any file the task creates, or that a plan/review explicitly orders added, is **staged** (`git add`) — staging is not committing; commits remain human-only. Do not substitute a written "needs git add" note for the act of staging: a reviewer reads the tree, not your intentions, and an untracked file referenced by tracked text becomes a dangling pointer at commit time.
6. **Mechanical close-out, after the FINAL edit.** Run the repo's standard validation block — at minimum `git diff --check`, the project's build, the project's tests, the project's formatter check, and `git status --short` (use the exact commands from the platform addendum or project docs) — in order, **after the last edit of the pass**. Any edit made after running it voids it; run it again. Paste the actual output into your report. A failure in this block is a blocking finding regardless of how good the content is. There is no judgment in this gate: the commands are the gate.
7. **Surface anomalies the moment you see them.** If a file's content contradicts its location, name, or claimed purpose — a governance file describing a different repository, a "final" plan with draft content, a tracked deletion you didn't make — say so to the human in your very next message, before continuing. Observing silently and proceeding is a defect.
8. **Position is semantics in ordered documents.** In any file with an execution-order rule, a prerequisite exists only if it physically precedes its consumers — insert it there; never append it with a note. If you find yourself writing a sentence that explains why the structure doesn't mean what it says ("despite appearing last, this runs first"), stop: that sentence is the defect detector firing — fix the structure and never write the sentence. After editing an ordered plan, mechanically verify position(prerequisite) < position(every consumer) for each declared dependency. Completed slices in deletion-friendly queues are deleted, never kept as annotated future work.
9. **Counts are consumers.** When a change alters the membership of any enumerated set — types, commands, slices, keywords — the set's cardinality language joins the term list: "seven", "all N", "N types", totals tables. A count that can only be satisfied by resurrecting the removed member is a stale positive expectation that name-searches cannot see.
10. **Edit a unit, read the unit.** When editing inside a structured unit — one slice, one section, one table — read the entire unit before and after the edit; its frame (objective, acceptance, header) must agree with the edited body.
11. **Rules land in the canonical file.** Before adding any rule or contract to a governance document, check the repo's declared authority chain — the file that says "when this disagrees, this wins" — and put the content **there**. A subordinate file may carry a copy only with an explicit pointer back to the authoritative text. If the file you are about to extend is declared a pointer or subordinate by the canonical file, stop: place the content canonically, or change the authority declaration first, truthfully and with the owner's knowledge. "It's what the agent reads first" is a delivery argument, not an authority argument; both must hold.
12. **A document's charter is part of the unit.** Gate 10 at document scale: before adding content to any governance or spec file, re-read its self-description — what it claims to be, and what other files claim about it. Content that exceeds the file's declared charter is a lying header, the same defect class as a comment that lies. An authority contradiction between two files (A says B is a pointer; B says it is master guidance) is a gate-7 anomaly: surface it the first time you have read both.
13. **Provenance claims are verifiable facts.** Never write "X landed in commit `<hash>`" unless inspecting that commit confirms it contains X. Work in the current uncommitted diff is attributed as "this change (pending commit)," never to an existing hash — status lines written mid-diff describe the present, not the post-commit future. During close-out, verify every commit hash written into a document this pass.

---

## 4. Refactor Completion Rules

These rules exist because AI sessions repeatedly accept "new path added" as progress while old code paths are still active.

1. **A refactor is not done when both paths still ship.** Adding the new path is only the first half. The old path must be removed from runtime, or the work remains incomplete.
2. **Every rewrite must include an excision inventory.** Before coding, list the old helpers, runtime paths, and docs that exist only because the old architecture still exists. For each: delete now, replace now, quarantine temporarily, or not in scope.
3. **Compatibility is opt-in, not the default.** Do not preserve backward compatibility unless the user explicitly asks. Prefer deletion over migration ballast.
4. **Done means grep-clean at the architectural seam.** Before declaring a refactor done, search for the retired names. If they still participate in live runtime behavior, the refactor is not done.

---

## 5. Stop Conditions

Stop and surface the issue instead of improvising if:
- The plan no longer matches the code in a material way.
- The correct owner or seam is unclear.
- The change requires guessing about identity or ownership.
- The only path forward is destructive cleanup on weak evidence.
- Validation cannot establish that the change is safe.
- The requested change conflicts with architectural rules in this file.

When blocked, explain the minimum missing fact or decision. Do not hide uncertainty behind confident wording.

---

## 6. Tough PR Review Framework

When reviewing changes (self-review or PR review), check these categories in priority order:

1. **Architecture and Namespace Drift (Critical)** — Does new code violate the documented architecture for this repo? In AIManifesto, does content logic leak into `app.js`? Does runtime logic appear inline in `index.html` outside of quiz data arrays?
2. **Helper and Pattern Drift (High)** — Does new code bypass existing helpers (e.g., hand-rolling tab switching instead of using `switchTab()`, manually creating tooltips instead of using `initTooltips()`)? Does it duplicate an existing CSS custom property or utility?
3. **Safety and Destructive Operations (Medium)** — Does any cleanup path silently delete artifacts when ownership is uncertain? Does any destructive operation lack a confirmation guard?
4. **Documentation and Comment Truthfulness (Medium)** — Do docs or comments claim cleanup is finished when the code still violates the boundary?

### Output Format For Reviews

- **Severity:** CRITICAL / HIGH / MEDIUM / LOW
- **Category:** (from above)
- **File:Line:** exact location
- **What:** what is wrong
- **Why it matters:** what breaks
- **Fix:** the smallest credible fix

Rate the diff on a 1-5 architectural drift scale:
1. Actively makes architecture worse.
2. Preserves old failure modes.
3. Neutral or mixed.
4. Respects intended boundaries.
5. Actively moves toward target architecture.

For an aggressive cross-platform review framework with platform-specific addenda, see `PR_TOUGH.md`.

---

## 7. Common AI Failure Modes To Watch For

AI sessions executing plans fail in repeatable ways. Be vigilant against:

1. The plan is stale and the AI patches the wrong seam.
2. The plan names the function but not the callers, so the blast radius is missed.
3. The AI creates a new helper instead of using the one that already exists.
4. The AI mutates an object by rebuilding a subset of fields and strips identity or metadata.
5. The AI updates the code but not the tests, or rewrites tests to rubber-stamp new behavior.
6. The AI fixes the symptom but not the root cause.
7. The AI says "done" without proving the change.
8. The AI counts "new path added" as completion while old runtime paths still ship.
9. The AI hides uncertainty behind confident wording instead of surfacing blockers.
10. The AI runs broad validation bundles by habit after every tiny edit, drowning real failures in PASS noise.
11. The AI moves mutation into startup or read paths because it is convenient.
12. The AI treats a question as a command to act and edits before the user authorizes the change.

---

---

# Platform-Specific Addenda

The universal sections above apply to every codebase. The sections below apply only when the work touches the named platform. Read the addendum for every domain your change touches.

---

## A. WPF / .NET Desktop

Applies to: WPF overlays (`monitor.cs`), MVVM apps (Workstation, Print, Tooling), retro game overlays (Asteroids, Atari, Alfred), and any WPF surface that mutates settings or talks to hardware.

### A.1. MVVM layer discipline
- **Views** (`.xaml`): layout, event wiring, visual state only. No business logic. No direct settings writes.
- **ViewModels**: expose bindable properties and commands. Use `[INotifyPropertyChanged]` / `[ObservableProperty]` from CommunityToolkit.Mvvm. Raise `PropertyChanged` for every bindable property change.
- **Commands**: implement `ICommand`. Delegate to services for hardware/I/O and to the VM for UI state.
- **Services**: own external I/O. All slow or blocking work in `Task.Run`. Never block the WPF dispatcher.

### A.2. Settings access — never cache as static
```csharp
// WRONG — snapshot taken once, stale forever:
private static Settings _settings = _app.Settings;
// CORRECT — always reads current:
private static Settings Settings => ((App)Application.Current).Settings;
```

### A.3. Settings persistence — atomic
Never delete-then-write. Use temp-file + `File.Replace`:
```csharp
var tmp = path + ".tmp";
File.WriteAllText(tmp, json);
File.Replace(tmp, path, path + ".bak");
```
UTF-8 without BOM (`new UTF8Encoding(encoderShouldEmitUTF8Identifier: false)`).

### A.4. ObservableCollection — UI thread only
Wrap background mutations: `_dispatcher.Invoke(() => CutItems.Add(item))` or use `BindingOperations.EnableCollectionSynchronization`.

### A.5. Render-loop and async safety
Every external process call (`powershell.exe`, hardware I/O, large file reads) must be wrapped in `_ = System.Threading.Tasks.Task.Run(() => { ... })`. Inline blocking calls freeze the WPF render loop.

Every `async void` method (event handlers, command Execute implementations) must have a top-level try/catch. Uncaught exceptions in `async void` terminate the process.

No empty catches (`catch { }`, `catch (Exception) { }`). Log meaningfully or surface to the operator.

### A.6. Custom-chrome overlays (Asteroids, Atari, Alfred, Perceptron)
- `FormBorderStyle.None` with manual drag handling via `WM_NCHITTEST`.
- Capture foreground HWND via `GetForegroundWindow()` **before** the WPF window steals focus; position overlay using `GetWindowRect()`.
- Set overlay as topmost tool window (hidden from alt-tab) via `WS_EX_TOOLWINDOW`.
- Account for DPI scaling explicitly.

### A.7. Game-loop discipline (Asteroids, retro overlays)
- Use `CompositionTarget.Rendering` or `DispatcherTimer` at ~60fps.
- Clamp frame delta to 0.1s max to prevent physics explosions when the loop stalls.
- Prefer C# records with `with` expressions for game state — immutable-style updates avoid mutation bugs.

### A.8. Owner-drawn controls (Perceptron, retro game UIs)
- Use GDI+ via `Graphics.FillEllipse`, `PathGradientBrush` for glow effects.
- Specify colors as `Color.FromArgb(R, G, B)` with alpha 60-100 for soft glows.
- Document visual constants (color values, UI metrics) in this file rather than scattering magic numbers.

### A.9. Destructive action confirmation
Destructive buttons (Nuke, Reset, Delete-All) must require operator confirmation. Two-step inline flow ("Confirm Nuke" + "Cancel") or modal `MessageBox.Show(... MessageBoxButton.YesNo)`. Single-click destructive is a critical defect.

### A.10. Time handling
- `value.ToLocalTime()` for display.
- Offset-less store timestamps treated as UTC via `.ToUniversalTime()` parsing.
- Lowercase spaced relative ages: `45s ago`, `8m ago`, `2h 25m ago`, `2d 3h ago`.
- Future timestamps as `in <duration>`, never clamped to `0s ago`.
- `DateTimeOffset.UtcNow`, never `DateTime.Now`.

### A.11. E2E tests with Appium + NovaWindows
- Locators via `By.AccessibilityId()` — maps to XAML `x:Name`.
- Startup sequence must poll for `LoadingView` modal before main UI interaction.
- Tests run non-parallel (single app session).

---

## B. WiX / MSI Installer & Release Pipeline

Applies to: WorkstationMsi, PrintMsi, Auto-Updates/AutoUpdateMsi, any WiX 3.1.x installer, GitHub Actions release workflows.

### B.1. Build via `build.cmd`, not msbuild directly
```powershell
cd WorkstationMsi && build.cmd Release
cd WorkstationMsi && build.cmd Release -v 2026.05.13.0001
```
Calling `msbuild` directly on WiX 3.1.1 projects breaks compatibility.

### B.2. Self-contained publish + heat.exe harvest
- `dotnet publish -r win-x64 --self-contained true` for app deployment.
- Harvest files with `heat.exe` (avoids manual file tracking).
- Filter the harvest with `.xslt` for exclusions.

### B.3. Version flow is end-to-end
Version must flow consistently through EXE, MSI, WinGet manifest, GitHub tag, and release branch. Centralize via `GlobalAssemblyInfo.cs` linked into all projects. Do not hardcode release versions in app or installer files.

### B.4. Pipeline inputs are caller-owned
Reusable workflow inputs are resolved by the caller. Caller workflows own manual or generated version selection; shared workflows consume one already-resolved value. Validate YAML changes by reading all call paths.

### B.5. Mirror sibling installers
Workstation and Print installer behavior should mirror each other unless there is a documented reason. Self-contained publish, WiX harvest filters, signing, and timestamping must be checked together.

---

## C. Physical Hardware Control & Crippa Bend Math

Applies to: Workstation app and any code that drives TigerStop, RazorGage, Lockformer, Crippa, TigerMeasure, or produces Crippa XML / YBC / polar / cartesian row data.

**These rules describe safety boundaries. Violations are shop-floor safety risks, not UI bugs.**

### C.1. Never mark an item moved/done unless movement actually succeeded.
A workflow flag (`ResetStockBeforeNextMove`) is not proof of movement. Do not enter the cut/done/auto-cycle path when movement failed.

### C.2. Failed pre-cycle checks must abort the cycle.
If `CheckForRetractErrorPreCut(...)` returns true: stop. Do not call cycle. Do not mark done. Clear execution flags and return.

### C.3. Auto-cycle capability must be proven by hardware, not settings.
A user setting (`EnableAutomatedToolCycling`) is the operator's request, not hardware capability proof.

### C.4. Stop signals must be `volatile`.
Loop-exit signals checked in tight background loops must be `volatile`. Non-volatile bool writes are not guaranteed visible across CPU cores.

### C.5. Validate manual positioning targets before sending.
Reject NaN, negative values, and values exceeding maximum tool length before the machine moves.

### C.6. Crippa bend-math invariants
- Preview and export must agree on which bend data is being used.
- Reverse means machine/export direction reversal. Recalculate the YBCR/polar route; do not fake it in the drawing layer.
- Do not mix machine radius (Material.xml CLR, ~8.281") and fitting radius (Revit, ~19.45") in the same computation.
- Do not set `CartesianRows` on reversed `BendInstructionSet` from vertex data — apex vertices produce worse output than bend-row math.
- Do not weaken existing geometric guards in `TryBuildTwoBendParallelOffsetRows`.
- Do not widen narrow-case formulas (2-bend parallel offset) to 3+ bends or 3D routing without a separate analysis.

### C.7. File-name and delete safety
- File names deterministic, sanitized, inside Crippa path-length limits.
- Delete only the intended Crippa batch/output directories. Log delete attempts and failures.

### C.8. Geometric null-path guards
`GetNormalizedVector()` on zero-length returns `(1,0,0)` silently. `IsParallelTo` on `Vector3D.Zero` returns false. Guard before calling. Guard `.First()`, `[0]`, `.Location`, `.Direction` on possibly empty/null data.

---

## D. ASP.NET + MongoDB Web Services

Applies to: Stratus, Gtpx.Cloud.* projects, controller/service/repository stacks with Mongo persistence.

### D.1. Strict layer boundaries
- Controllers handle HTTP shape, authorization attributes, model binding, response mapping, delegation only.
- Business rules belong in services.
- Mongo / query / persistence details belong in repositories.

### D.2. FeatureClaim is part of the contract
The query parameter named in `[FeatureClaim]` is part of authorization, even when the action body does not otherwise use it. Do not remove those parameters as "unused"; keep the existing pragma/comment pattern.

### D.3. Discriminators and scoping
Always guard on discriminator for shared collections: `CutListType`, `ToolType`, `ModelType`, `PartType`. Use `== CutListType.CutList`, not `!= CutListType.BendList`. Missing company/project ownership checks are critical.

### D.4. Mongo document discipline
- Preserve full object shape when updating Mongo-backed records. Do not rebuild a subset and silently drop fields or discriminators.
- Mongo repo projections must include every field needed downstream.
- Inherit `MongoRepositoryBaseV1`; all data company-scoped.

### D.5. Schema discovery before querying
Fetch one sample document first; analyze actual field structure before writing queries. Do not query against assumed schema.

### D.6. Units at boundaries
Stratus convention: feet in model space, inches in cut/bend/export data, `InInches`/`InFeet` suffixes. Convert at boundaries, not inline.

### D.7. Geometry safety
`Vector3D.GetNormalizedVector()` returns `(1,0,0)` for zero-vectors — it does not throw. Guard explicitly.

### D.8. Mongo-derived test pattern
Capture the smallest real-shaped sample → store under `Tests.Unit/<Feature>/Samples/<Scenario>/` → write a shared loader → assert at the real logic boundary, not the database transport boundary.

---

## E. Vue 2 / Browser JavaScript

Applies to: `Gtpx.Cloud.Forge.Web` frontend, Vue 2 components, jQuery-era surfaces.

### E.1. Reactivity
For Vue 2 objects, use `Vue.set` when adding reactive properties after object creation. Newly added properties do not become reactive otherwise.

### E.2. File-download error handling
File downloads must handle blob error responses, not just success blobs:
```js
if (typeof data.text === 'function') { /* blob error path */ }
```

### E.3. Common JavaScript type bugs
- `.count` instead of `.length` (silently undefined).
- `==` instead of `===` (silently coerces).
- Blob vs JSON error handling missing.
- Undefined parameters from Vue event emit not guarded.

---

## F. PowerShell / EngineerForge Orchestration

Applies to: Fork, EngineerForge, any PowerShell system with canonical session authority and registry-driven platform behavior.

### F.1. Registry-driven dispatch
Global `$PlatformRegistry` is the single source of truth for display names, CLI names, resume/fork commands, and per-platform behavior functions. Never hardcode platform-specific logic inline. New platforms register; no platform-specific code outside the registry.

### F.2. Canonical persistence helpers
Use `Read-JsonFileSafe`, `Write-JsonFileAtomic`, `Update-JsonFile`. Never raw `Get-Content | ConvertFrom-Json` or `Set-Content` / `Out-File` on canonical data.

### F.3. UI input
Use `Read-MenuKey` for intentional blocking; `Try-ReadMenuKey` for optional polling. Do not use `$Host.UI.RawUI.KeyAvailable` as proof that a blocking read is safe.

### F.4. Console output
Use `Write-ColorText`. Never `Write-Host -ForegroundColor` directly.

### F.5. Headless session layer
Files under `src/session/` must not contain `Write-Host`, `Read-Host`, `Read-DialogInput`, `Read-MenuKey`, `Confirm-Destructive`, `Confirm-YesNo`, or `$host.UI.RawUI.ReadKey`. All interactive output belongs in `src/ui/`.

### F.6. Session identity
- `sfSessionKey` is the immutable primary key; `nativeSessionId` is the alternate platform key.
- `sessionId`, `name`, `projectPath`, `wtProfileName`, `trackedName` are NOT identity.
- No dual-field emission. No fallback chains.

### F.7. WT presentation is not authority
`wtProfileName` must not appear in canonical `session.json` records. `byWTProfile` is a derived convenience index only. Platform source comes from the canonical `source` field, never from WT profile prefixes.

### F.8. Destructive operations
Detection and cleanup are separate steps. Never silently delete artifacts during refresh or discovery. Surface issues truthfully in the UI before any cleanup.

### F.9. ASCII-only in string literals
Non-ASCII bytes in literals cause build-safety scan failures. Use `--` not `—`, straight quotes not curly.

### F.10. WT mutation boundary
All WT settings changes go through `src/wt/service.ps1`, `src/wt/profiles.ps1`, `src/wt/image.ps1`. Never hand-roll WT state mutation in UI or session files.

---

## G. C++ / CMake Experiments

Applies to: WinTCar / car, any single-purpose C++ experiment driven by CMake + MSVC.

### G.1. Reusable concept layering
Separate reusable platform concepts from application code. Concept files (`WinTerminal/WTSettingsPath`, `WTSession`, `WTProfile`, `WTSettings`, `WTBackground`) are one concept per file. No concept file knows about application domain.

### G.2. Dependency direction
`src/` depends on `WinTerminal/`. Reverse forbidden. Concept directory never imports application directory.

### G.3. JSONC-aware editing
Parse + re-serialize loses comments. Do surgical text edits inside a confirmed block instead. Validate parse before write-back; abort on parse failure rather than writing a guess.

### G.4. Atomic writes with backup
Always back up on first run (`<path>.<tool>.bak`). Write to temp file (`<path>.<tool>.tmp`), then rename.

### G.5. Phased delivery for experiments
Deliver in phases with explicit completion gates: skeleton → platform concepts → domain primitives → loop/integration → measurement. Each phase has a completion criterion.

---

## H. Static HTML/JS/CSS Sites (THIS Repo — AIManifesto)

Applies to: AIManifesto and any zero-dependency static site with three files (HTML + JS + CSS).

### H.1. Three-file architecture
- `index.html` — all content, quiz data arrays, HTML structure.
- `app.js` — runtime logic only.
- `style.css` — all styling via CSS custom properties.

Do not put content in `app.js`. Do not put runtime logic inline in `index.html` outside of the documented exception (quiz data arrays). Do not add build steps, npm dependencies, or server requirements. **Zero-dependency static site is an architectural commitment.**

### H.2. Tab System
Each tab is a `<section id="tabname" class="tab-panel">` in `index.html`. Tabs are activated via `.active` class toggled by `switchTab()` in `app.js`. The primary nav bar is hardcoded in `<nav class="tab-bar">`; secondary tabs are in the hamburger drawer.

### H.3. Quiz System
Quizzes are JS arrays inside `index.html` (not in `app.js`). Each entry: `{ question, choices[], answer, explanation }` where `answer` is the 0-based index. `initQuiz(prefix, questions)` in `app.js` renders and wires each quiz by DOM id prefix.

To add a new quiz tab:
1. Add the question array in `index.html`.
2. Add a `<section id="newtab" class="tab-panel">` with the required score/progress/questions elements.
3. Add a `<button class="tab-btn" data-tab="newtab">` in the nav.
4. Call `initQuiz('newtab', newQuestions)` in the `DOMContentLoaded` handler in `app.js`.

### H.4. Tooltip / Hover-over System
Term hover-overs are **generated automatically at runtime** from the `glossaryTerms` object (near the bottom of `index.html`). You never manually add `<span class="tt">` tags — the JS `initTooltips()` function walks the DOM of every tab panel (skipping `CODE`, `PRE`, headers, `A`, `BUTTON`, and the glossary section itself) and wraps matching text nodes automatically.

The `.tt` style is a dashed underline (`border-bottom: 1px dashed`) with `cursor: help`. On hover, a floating popup shows the term name and its definition.

### H.5. Adding a Glossary Entry (three steps, all required)

1. **Add to `glossaryTerms`** — in the `const glossaryTerms = {` object near the bottom of `index.html`:
   ```js
   'TermName': 'Short definition shown in the hover popup.',
   ```
   This alone causes hover-overs to appear on every occurrence of that term in the document body (except headers, code blocks, and the glossary section).
2. **Add a glossary table row** — in the `#glossary` section:
   ```html
   <tr><td>TermName</td><td>Full definition here. <a class="gloss-link" data-tab="tabid" data-anchor="anchorid" href="#">→ Chapter X</a></td></tr>
   ```
   The `.gloss-link` must point to a specific anchor where the term is **actually used** in the document body — not just a chapter heading.
3. **Find the link target** — search `index.html` for an existing `id=` anchor near a real usage. If no suitable anchor exists, add one (`<span id="anchor-termname"></span>`) adjacent to a usage.

The visual convention: dashed underline = "this term has a glossary entry." In the body, hovering shows the definition popup. In the glossary table, the term cell is a clickable link back to a usage.

### H.6. Helper-first reuse (THIS repo)
Before adding new code: check `app.js` for existing runtime helpers; check `style.css` for existing custom properties. Never duplicate.

### H.7. Deployment
Pushing to `master` auto-deploys via GitHub Pages. The live site reflects `index.html` at the repo root.

---

## I. Embedded Linux / reMarkable Integration

Applies to: reMarkableAi, any project where code interacts with a sandboxed root directory and must not escape it.

### I.1. Transport abstraction as source of truth
All cloud operations through `src/remarkable/client.ts`. No direct `rmapi-js` calls outside `src/remarkable/`.

### I.2. Canonical helpers for persistent state
Auth tokens through `store.ts`. Document hashes through download/notebook modules. No raw `fs.readFile/writeFile` on owned files.

### I.3. Write-back mutations are highest-risk
`notebook.ts` performs atomic multi-part uploads. Verify hashes before upload. Never leave a document partially written.

### I.4. Namespace ownership
- `src/cli.ts` — dispatch only.
- `src/remarkable/` — cloud ops.
- `scripts/` — Python processing.
- `docs/` — design only.
- `.local/` — runtime state (gitignored).

### I.5. Sandbox escape is critical
Any file operation that could escape the documented sandbox root (e.g., `SYS1000/` on reMarkable) is a critical defect. Path-traversal vulnerabilities (`../` in user-supplied paths), symlink resolution leaving the sandbox, and absolute paths where sandbox-relative is required are blocking.

### I.6. Test-driven bug fixes
Before fixing: write a failing test; fix the bug; confirm the test passes.

### I.7. Cleanup on failure
Any function creating artifacts must clean them up on error. Track creation with flags.

### I.8. No empty catch blocks
Every catch either logs meaningfully, re-throws after cleanup, or returns a structured error.

---

## J. Python Reporting & APIs

Applies to: Toolbox/AITimeSave, Toolbox/ReleaseNotes, ToolingPodAI, any Python tool that generates reports or exposes an API.

### J.1. Report-generation pipeline
Extract data → build JSON schema → Python script reads JSON → matplotlib charts → `python-docx` / `python-pptx` / `reportlab` formats output. Keep stages separable; JSON is the seam.

### J.2. Pydantic for request/response validation
Use Pydantic models for type safety at the API boundary. SQLite for templates. FastAPI for endpoints.

### J.3. Secrets via environment variables
Store API tokens in env vars (gitignored). Load at startup. Never commit a `.env` with real values.

### J.4. Read-only mode as default
Tools that can mutate state default to read-only. Pass an explicit `-W` flag for write mode. Always dry-run first.

---

## K. Revit / BIM Integration

Applies to: WireWorks, any Revit plugin generating bend sheets or processing CAD/BIM geometry.

### K.1. Bend sheet generation from ConduitRun
Traverse connectors end-to-end. Accumulate straight lengths. Record distance, angle (radians→degrees), 3D rotation at each elbow. Repeat from the other end for an alternate option.

### K.2. Data models for bend geometry
- `BendSheet` — project/pipe/type/size/cut-length.
- `BendOption` — traversal direction.
- `BendLine` — bend inflection.
- `BendOffset` — configurable per family/size.
- `BendProfile` — named rotation patterns.

### K.3. Terminal detection
Find unconnected or out-of-run connectors to identify ConduitRun terminals.

---

## L. Retro Game / Custom-Chrome Overlay UIs

Applies to: Asteroids, Atari, Alfred, Perceptron, and any WPF / WinForms surface that emulates older UI aesthetics over the operator's terminal or desktop.

### L.1. Custom chrome
- `FormBorderStyle.None` / `WindowStyle="None"`.
- Manual drag via `MouseDown` + `DragMove()` or WM_NCHITTEST.
- Resize edges via WM_NCHITTEST regions.

### L.2. Terminal/window overlay positioning
- `GetForegroundWindow()` **before** the overlay steals focus.
- `GetWindowRect()` for the host window bounds.
- Account for DPI scaling explicitly.
- Set `WS_EX_TOOLWINDOW` to hide from alt-tab.

### L.3. Owner-drawn aesthetics
- GDI+ via `Graphics.FillEllipse`, `PathGradientBrush`.
- Color values as `Color.FromArgb(R, G, B)` with explicit alpha for glows (60-100 typical).
- Conditional glow rendering based on state (e.g., active/idle/error).
- Document visual constants in this file rather than scattering magic numbers throughout `.xaml.cs` / `.cs`.

### L.4. Game loop discipline
- `CompositionTarget.Rendering` or `DispatcherTimer` at ~60fps.
- Clamp frame delta to 0.1s max — long stalls otherwise produce physics explosions.
- C# `record` types with `with` expressions for game state — immutable-style updates avoid mutation bugs.
- `WriteableBitmap` for fast pixel-level rendering.

### L.5. Era-faithful math (Perceptron, 1958-1986 simulators)
- Preserve the original algorithm's numerical behavior — do not "modernize" with normalized weights or improved gradient descent unless the goal is explicitly modernization.
- Document the source paper / era constants near the algorithm.

---

## Why This File Exists

This synthesis is the consolidated guidance from production CLAUDE.md / AGENTS.md files across thirty-one repos. The universal core (sections 0–7) prevents the failure modes that recur in every project regardless of stack. The platform addenda (A–L) capture the specific patterns and traps that only matter when working in that platform.

When in doubt: read the section for the platform you're touching, then re-read the universal core. The universal core wins when sections conflict.
