---
name: pr-tough
description: A tough code review that finds the hard-to-see bugs AI-written code hides and ordinary AI review rubber-stamps — changes that look locally correct and pass a surface read but corrode the system: hidden mutations in read paths, canonical-truth and boundary violations, silent wrong-answer fallbacks, cache treated as authority, invented commands the system doesn't have, and false "cleanup is done" claims. It reviews against the repo's own PR_TOUGH.md framework when present, or offers to deposit and optionally customize one to the stack; it writes severity-ranked findings (file:line, failure mode, smallest credible fix) and a categorical verdict (BLOCK / REWORK / APPROVE-WITH-FOLLOW-UP / APPROVE, never a score) to a fresh numbered results file that never overwrites an earlier one. Read-only on code. Use when someone asks for a code review, PR review, tough review, hostile review, or architectural review, or to review the diff, the branch, the working tree, or their changes — especially to vet AI-generated code before merge. Trigger even when "skill" isn't said.
---

# PR-Tough

Run a **tough, architecture-aware review** of the current changes and write the findings to a numbered results file. It hunts the **defect classes that survive a surface read** — the locally-correct-looking changes AI writes and ordinary AI review misses: hidden mutations in read paths, boundary and canonical-truth drift, silent wrong-answer fallbacks, invented commands, false completion claims. **Read-only.** The verdict is a judgment, stated as one; there is no score.

## Loud stage banners — REQUIRED

Every state change prints a **loud banner on its own line**, with a blank line above and below, exactly in these forms. These banners are the visible progress; they are mandatory, and **you do not narrate the work between them** — no "now let me gather evidence…", no play-by-play. Work silently; let the banners mark the stages.

```
━━━━━━━━━━  ✅ CREATED PR_TOUGH.md — this repo now owns its review framework  ━━━━━━━━━━
━━━━━━━━━━  🔧 CUSTOMIZED PR_TOUGH.md — <N> cited additions  ━━━━━━━━━━
━━━━━━━━━━  🚨 CODE REVIEW STARTED — <surface>  ━━━━━━━━━━
━━━━━━━━━━  ✅ REVIEW COMPLETE — VERDICT: <VERDICT> → pr-tough-results<N>.md  ━━━━━━━━━━
```

Fire **CREATED** the instant a framework file is written — that is the headline, never "no PR_TOUGH.md." Fire **CUSTOMIZED** when customization finishes, **CODE REVIEW STARTED** the instant the review begins, and **REVIEW COMPLETE** when the results file is written.

## When to use

- Someone asks for a code review, PR review, "tough review," or "review my changes / this diff / this branch."
- Before merging AI-generated work, or any change touching storage, boundaries, builds, or tests.
- A repo has no review framework and wants to adopt one that fits its stack.

## Co-located resources

Relative paths resolve against this skill's directory (the folder containing this file).

| File | Purpose |
| --- | --- |
| `PR_TOUGH.md` | The review framework — hard gates, defect categories, smell baseline, bug-finding and test discipline, output format. Also the deposit template. |
| `CUSTOMIZE.md` | The customization procedure — how to fit a deposited `PR_TOUGH.md` to the repo's stack, with the evidence rule: every added check cites a commit, config, or file. |

## Phase 0 — Check first, then speak

Before you say anything, determine the state by **checking, not guessing**:

1. **Git repo?** `git rev-parse --is-inside-work-tree`.
2. **`PR_TOUGH.md` in the repo root?** Check the file.
3. **Anything to review?** Are there source files present.

You now know the state. Every line you say reflects what you found — **never hedge** ("if present", "otherwise", "the repo's copy if it has one"). You checked; speak plainly. **One short line per prompt. No narration, no padding.**

If there's nothing to review, say `Nothing to review here.` and stop.

## Phase 1 — Confirm and choose the framework (collect all answers first)

Ask the one prompt that fits the state you found:

- **`PR_TOUGH.md` exists** → *"Reviewing against this repo's PR_TOUGH.md → pr-tough-results&lt;N&gt;.md. Proceed?"* Yes → Phase 2. No → stop.
- **`PR_TOUGH.md` absent** → *"No PR_TOUGH.md here. Deposit a copy to the repo, or review with the built-in framework?"*
  - **Deposit** → copy `PR_TOUGH.md` from this skill into the repo root → **fire the CREATED banner immediately.** Then ask *"Customize it to this repo's stack? (adds checks from your git history; each cites its evidence)"* — yes runs `CUSTOMIZE.md` then **fire the CUSTOMIZED banner**; no leaves it generic.
  - **Built-in** → review with this skill's bundled `PR_TOUGH.md`; nothing is written to the repo.
  - Neither → stop.

Ask all questions now; the review runs uninterrupted after.

## Phase 2 — Establish the review surface

Name what is being judged (framework §1), using the git state you already checked in Phase 0:

- **No git** → *"No git repo. Review the code as-is?"* Yes → the surface is every source file present (no diff, branch, or history); skip anything needing git. No → stop.
- **Git** → default to the working tree (`git status --short`, all present changes) unless the user named a branch/PR — then resolve the merge-base, confirm the diff is non-empty, record the commit list.
- Include regenerated artifacts (fixtures, goldens) in the surface.
- Spec source: the plan / ticket / issue, or `none found`.

## Phase 3 — Run the review

**Fire the CODE REVIEW STARTED banner** (naming the surface), then work silently — no narration until the results file. Apply the chosen `PR_TOUGH.md` in full: hard gates first (run the repo's real build/test commands where known and cheap — a failed build is a gate, not an observation), then the drift search, the defect categories, the smell baseline as leads, and the bug-finding/test discipline for any fix in the diff. Findings must be falsifiable claims: exact file:line, the failure mode, the smallest credible fix. Label introduced vs pre-existing.

## Phase 4 — Write the results file

1. **Number it:** scan the repo root for `pr-tough-results<number>.md`; the new file is max+1 (or `pr-tough-results1.md` if none). **Never overwrite an existing results file.**
2. **Open with the provenance header** — the review documents its own basis:

```md
# PR-Tough Review <N> — <date>

**Surface:** <working tree | fixed point `<ref>`; commit list or file count>
**Spec source:** <plan/ticket/doc, or "none found">
**Framework:** <repo copy | deposited this run | deposited + customized this run | skill default>
**Commands run:** <the build/test/lint commands actually executed, or "none available">
```

3. Then the framework's output format: **Findings** (by severity) → **Verdict** (BLOCK / REWORK / APPROVE-WITH-FOLLOW-UP / APPROVE — a judgment from the findings, never a score) → **Missing validation** → **Missing tests** → **Residual risks** → **Summary**.
4. End the file with one line: `*(Results files are local review artifacts — add pr-tough-results*.md to .gitignore if you don't want them committed.)*`
5. **Fire the REVIEW COMPLETE banner** — the verdict and the results filename. This is the last thing you print.

## Rules

- **Loud banners, silent work.** Fire every required stage banner; do not narrate the steps between them. The banners are the only progress output the user should see until the results file.
- **Read-only on code.** Never edit, fix, refactor, or "clean up" anything under review. Findings propose fixes; they do not apply them.
- **Write surface = exactly two files, both bounded:** the new `pr-tough-results<N>.md`, and — only after an explicit yes in Phase 1 — the deposited `PR_TOUGH.md` (plus its consented customization edits). Nothing else, ever.
- **Never overwrite** an existing results file or an existing `PR_TOUGH.md`.
- **Customization obeys `CUSTOMIZE.md`:** additive, budgeted, and every added check cites a commit, config, or file. No citation → no rule.
- **The verdict is categorical.** Do not emit a numeric score, a percentage, or a letter grade.
- **Refusal:** do not APPROVE a change that hits a hard gate; do not APPROVE if you cannot say what happens when a changed destructive or lifecycle operation is interrupted or repeated.
