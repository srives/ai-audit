# AI Audit: Governance Review

Use this file to review governance files themselves.

Governance files include, but are not limited to:

- `AGENTS.md`
- `CLAUDE.md`
- `RUN_PLAN.md`
- `PLAN_RULES.md`
- `PR_TOUGH.md`
- `PERSONA.md`
- `POWERSHELL.md`
- `AI_AUDIT.md`
- repo-specific expert files
- pipeline/workflow rules and implementation prompts

This audit is not a code review. It is a review of the instructions that shape AI behavior.

## Goal

Make governance files useful enough to improve AI work, small enough to stay inside active awareness, and structured enough that AI workers apply them instead of merely "reading" them.

The failure mode we are hunting:

> The AI has technically seen the governance file, but the file is so large, repetitive, vague, or poorly structured that the important rules degrade into low-resolution hunches during implementation.

That is governance failure.

## Cognitive Baseline

For now, use these as the baseline models for governance cognitive load:

- Opus 4.8
- GPT-5.5 High

This is an operational baseline, not a scientific claim. The question is practical:

> Can these models keep the critical rules actively available while they plan, edit, self-review, and explain?

If a rule is only present in the file but is unlikely to remain in active working awareness during the task, the governance file is overloaded.

## The Awareness Budget

Treat AI awareness as layered:

1. **Active Awareness** - the few rules currently steering behavior.
2. **Working Context** - rules the AI can still retrieve and apply with effort.
3. **Background Memory** - rules it has read but will only apply if prompted directly.
4. **Low-Resolution Hunch** - rules blurred into vague intent.
5. **Lost** - rules effectively absent during execution.

Good governance keeps critical rules in Active Awareness or Working Context.

Bad governance pushes critical rules into Low-Resolution Hunch or Lost.

## Cognitive Load Rubric

Score each governance file from 0 to 5 on each axis.

### 1. Purpose Clarity

Question: Can the AI state what this file governs in one sentence?

- 5: One clear purpose; the file's charter is obvious.
- 4: Mostly clear; a few neighboring concerns.
- 3: Purpose understandable but mixed.
- 2: Multiple purposes compete.
- 1: File is a dumping ground.
- 0: Purpose cannot be stated reliably.

Failure signs:

- implementation rules mixed with review rules;
- planning rules mixed with coding rules;
- expert persona mixed with mechanical gates;
- "everything important" lives in one file.

### 2. Authority Clarity

Question: Does the AI know whether this file is canonical or subordinate?

- 5: Authority chain is explicit and consistent.
- 4: Mostly clear, minor duplication.
- 3: Some conflicts require judgment.
- 2: Several files claim overlapping authority.
- 1: AI must guess which file wins.
- 0: Contradictory authority claims.

Failure signs:

- `CLAUDE.md` and `AGENTS.md` both contain independent rules;
- a pointer file accumulates original rules;
- generated or copied files drift from the canonical file;
- two governance files make opposite demands.

### 3. Actionability

Question: Can the AI convert each rule into an observable action?

- 5: Rules are concrete commands with pass/fail evidence.
- 4: Most rules are actionable.
- 3: Mix of actionable rules and slogans.
- 2: Many values without mechanics.
- 1: Mostly motivational language.
- 0: Cannot tell what to do differently.

Failure signs:

- "be careful";
- "write good code";
- "avoid bad architecture";
- "think deeply";
- no required search terms, commands, gates, or outputs.

### 4. Front-Loading

Question: Are the highest-risk rules placed before the AI starts framing the task?

- 5: Critical gates appear at the front and inside copyable prompts.
- 4: Critical gates are near the front.
- 3: Critical rules are findable but not dominant.
- 2: Critical rules are buried after long context.
- 1: Critical rules appear only at the end.
- 0: Critical rules are scattered randomly.

Failure signs:

- "never do X" appears after 10 pages of background;
- refusal gates are only appendices;
- review-critical rules are after optional examples;
- the AI must infer priority from repetition.

### 5. Load Size

Question: Can the model hold the file's critical rules while doing the actual work?

- 5: Small enough that the whole file can guide behavior.
- 4: Moderate size; critical rules are summarized.
- 3: Large but structured with front gates and section summaries.
- 2: Large and repetitive; critical rules compete with detail.
- 1: Too large for reliable active awareness.
- 0: Actively harmful; creates skim behavior.

Practical guidance:

- Short gates beat long essays.
- Long reference sections are acceptable only if front-loaded summaries tell the AI when to use them.
- Appendices should be searchable reference, not the only place critical rules live.

### 6. Duplication Control

Question: Does repetition reinforce the rule or create drift?

- 5: Intentional repetition only: front gate, copyable prompt, final refusal.
- 4: Minor duplication, no conflict.
- 3: Repetition exists but is mostly aligned.
- 2: Duplicate rules use different wording that can drift.
- 1: Same rule appears in several files with different meanings.
- 0: Contradictory duplicates.

Good repetition:

- a rule appears once as policy, once inside a prompt, once as a final refusal gate.

Bad repetition:

- three files define the same rule differently;
- old copies remain after canonical wording changes;
- rule variants make the AI pick the easiest one.

### 7. Task Fit

Question: Does the file activate for the right kind of work?

- 5: Clear trigger conditions.
- 4: Mostly clear triggers.
- 3: AI can infer triggers.
- 2: Over-broad; likely activated too often.
- 1: Under-specified; likely forgotten.
- 0: Wrong file used for wrong tasks.

Failure signs:

- code review rules used as implementation rules;
- planning rules used during debugging;
- expert persona used when mechanical validation was needed;
- governance file says "always" when it means "for contract changes."

### 8. Verification

Question: Does the file require evidence that it was followed?

- 5: Requires concrete artifacts: search terms, consumer lists, commands, outputs.
- 4: Requires most evidence.
- 3: Some evidence required.
- 2: Mostly trust-based.
- 1: AI can claim compliance without proof.
- 0: No verification mechanism.

Failure signs:

- "use PR_TOUGH" with no required output;
- "reread RUN_PLAN" with no checklist;
- "do a consumer sweep" without listing consumers;
- tests/lint mentioned but no command output required.

### 9. Anti-Drift Protection

Question: Does the file stop future AI runs from weakening it?

- 5: Canonical placement, refusal gates, and close-out checks are explicit.
- 4: Good drift protection with minor gaps.
- 3: Some drift protection.
- 2: Easy to copy, fork, or reinterpret.
- 1: Likely to rot after a few edits.
- 0: Encourages drift.

Failure signs:

- no rule about canonical authority;
- no rule about copyable prompt updates;
- no rule about stale counts or stale examples;
- no final refusal if the governance was skipped.

### 10. Cognitive Friction

Question: Does the file make the AI slower in a useful way, or just mentally heavier?

- 5: Slows the AI only at high-risk gates.
- 4: Mostly useful friction.
- 3: Some useful friction, some drag.
- 2: Heavy ceremony with weak defect capture.
- 1: AI spends more effort satisfying the document than solving the problem.
- 0: Governance harms execution quality.

Useful friction:

- changed-contract consumer sweep;
- pre-edit seam map;
- final diff review;
- fixed-point review;
- red-capable repro before bug theories.

Bad friction:

- repeated reread commands with no output;
- broad validation when a focused check is enough;
- long persona text that hides mechanical rules;
- multiple files demanding the same proof in different formats.

## Cognitive Load Grades

After scoring the axes, assign a governance grade.

- **A:** Critical rules remain in Active Awareness. The file improves execution.
- **B:** Good file. Some rules may fall to Working Context, but important gates survive.
- **C:** Usable but overloaded. The AI may comply in summary while missing details.
- **D:** Too heavy or unclear. Important rules degrade into hunches.
- **F:** Governance failure. The file creates false confidence or contradictory behavior.

## Required Governance Review Output

Every governance review must include:

1. File reviewed.
2. Stated purpose of the file.
3. Actual purpose observed.
4. Authority relationship to other governance files.
5. Cognitive load grade.
6. Highest-risk overload points.
7. Contradictions or duplicates found.
8. Rules that should move to another file.
9. Rules that should be front-loaded.
10. Rules that should be deleted, shortened, or converted to a checklist.
11. Suggested patch.

## Pass Types

Use separate passes. Do not merge them into one giant review.

### Pass 1: Authority Pass

Ask:

- Which file is canonical?
- Which files are pointers?
- Which files are expert personas?
- Which files are implementation process?
- Which files are review process?
- Which files are planning process?

Output:

- authority chain;
- conflicts;
- rules that belong elsewhere.

### Pass 2: Cognitive Load Pass

Ask:

- Can Opus 4.8 and GPT-5.5 High keep the critical rules active while working?
- What will they actually remember after reading this file?
- What will collapse into a vague hunch?
- What will they likely skip under time pressure?

Output:

- active-awareness rules;
- working-context rules;
- hunch/lost rules;
- proposed compression.

### Pass 3: Actionability Pass

Ask:

- What does each rule require the AI to do?
- What artifact proves it did it?
- Can the rule be checked by a reviewer?
- Is the rule a slogan or a gate?

Output:

- rules to convert into checklists;
- rules needing command output;
- rules needing refusal gates.

### Pass 4: Duplication And Drift Pass

Ask:

- Is this rule repeated elsewhere?
- Is the wording identical?
- Which copy wins?
- Does a copyable prompt need the same update?
- Are examples stale?
- Are counts stale?

Output:

- duplicates to delete;
- canonical text to keep;
- prompt blocks to update.

### Pass 5: Fit-To-Task Pass

Ask:

- Which tasks should activate this file?
- Which tasks should not?
- Does the file say that?
- Is the file being used because it is relevant or because it is famous?

Output:

- trigger conditions;
- non-trigger conditions;
- links to the correct governance file for other task types.

## Cognitive Compression Patterns

Use these to reduce overload without weakening governance.

### Pattern 1: Front Gate Plus Reference

Put the rule in short form at the front.

Put detail in a reference section.

Bad:

```md
Ten paragraphs explaining why consumer sweeps matter...
```

Good:

```md
Before editing after a contract change, list every consumer and update or rule out each one.

Reference: see "Consumer Sweep Details" for examples.
```

### Pattern 2: Checklist Instead Of Essay

Convert prose into required outputs.

Bad:

```md
Think carefully about lifecycle operations and make sure they are safe.
```

Good:

```md
For every lifecycle operation, list:
- durable writes;
- lock acquired;
- repeated-call behavior;
- interrupted-after-write behavior;
- sibling operations checked.
```

### Pattern 3: One Canonical Rule, Many Pointers

Keep one source of truth.

Other files should point to it, not rewrite it.

Bad:

```md
AGENTS.md says one version.
CLAUDE.md says another.
RUN_PLAN.md says a third.
```

Good:

```md
AGENTS.md owns the rule.
CLAUDE.md says: "Follow AGENTS.md for this rule."
RUN_PLAN.md invokes the rule by name and requires its output.
```

### Pattern 4: Refusal Rule At End

Use the end of the file to enforce the front gate.

Example:

```md
If the review does not name the changed contract and its consumers, do not assign a passing grade.
```

### Pattern 5: Separate Persona From Procedure

Expert persona files can shape judgment, but they should not hide mechanical gates.

Bad:

```md
PERSONA.md contains the only instruction to run consumer sweeps.
```

Good:

```md
PERSONA.md defines engineering posture.
RUN_PLAN.md defines implementation gates.
PR_TOUGH.md defines review gates.
```

## Overload Smells

Flag these during governance review:

- The file is too long to summarize.
- The first page does not tell the AI what to do.
- Rules use abstract virtues instead of actions.
- Multiple files contain similar but not identical commands.
- Copyable prompt blocks omit the latest critical rule.
- Important rules are only in examples.
- The file contains historical rationale but no current gate.
- The file mixes implementation, review, planning, and persona.
- The file says "always" but has hidden exceptions.
- The file says "use X" but does not say what output proves X was used.
- The AI could claim compliance without producing evidence.
- The rule is correct but unlikely to remain in active awareness.

## Governance Patch Rules

When patching governance:

1. Put rules in the canonical file.
2. Keep pointer files as pointers.
3. Front-load high-risk gates.
4. Keep copyable prompts in sync.
5. Delete stale duplicates.
6. Prefer checklists over essays.
7. Add final refusal rules for non-negotiable gates.
8. Do not increase cognitive load unless the rule catches a real defect class.
9. If adding a long appendix, add a short front summary that tells the AI when to use it.
10. If a rule is triggered only for some tasks, state the trigger.

## Minimal Governance Review Prompt

Use this prompt when asking an AI to review governance files:

```text
Review this repo's governance files for cognitive load and instruction quality.

Use AI_AUDIT_GOVERNANCE_REVIEW.md.

Treat Opus 4.8 and GPT-5.5 High as the baseline models. Ask whether the critical rules remain in active awareness while the AI plans, edits, reviews, and reports.

Do not review code. Review the governance system.

For each file, report:
- purpose clarity;
- authority clarity;
- actionability;
- front-loading;
- load size;
- duplication/drift;
- task fit;
- verification requirements;
- cognitive load grade;
- exact changes recommended.

Find rules that should move, shrink, become checklists, become refusal gates, or be deleted.
```

## What Good Looks Like

A good governance system lets an AI say:

- "This task is planning, so I use PLAN_RULES.md."
- "This task is implementation, so I use RUN_PLAN.md."
- "This task is review, so I use PR_TOUGH.md."
- "This task is PowerShell-heavy, so POWERSHELL.md informs judgment."
- "This file is persona, not process."
- "This rule is canonical here; the other file only points to it."
- "Before editing, I must produce these exact artifacts."
- "Before approving, I must verify these exact artifacts."

The AI should not have to remember the entire governance library at once. It should know which file applies, what gate is active, and what evidence must be produced.

## Final Refusal Rule

If a governance file is so broad, long, or mixed-purpose that the reviewer cannot state what it governs and when it applies, do not approve the governance change.

If a critical rule is likely to collapse into low-resolution hunch during implementation, do not approve the governance change until the rule is front-loaded, shortened, or converted into a required checklist.
