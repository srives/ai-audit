# PITHY_PROMPT.md

## Purpose

Use this file when the user wants a deliberately narrow code change and does not want adjacent architecture work, fallback designs, tests, refactors, or broader consumer sweeps.

The goal is to obey a tightly scoped instruction exactly.

## Core Rule

When a task is ruled by `PITHY_PROMPT.md`, treat the user's requested edit as a surgical patch:

- change only the named file, function, line, or behavior
- do not expand the problem into adjacent systems
- do not add tests unless explicitly requested
- do not add fallback behavior unless explicitly requested
- do not refactor surrounding code unless required for the exact requested change
- do not turn a one-line sanitation fix into a contract redesign
- do not search for unrelated future-proofing opportunities after the narrow cause is known
- report if the requested change is impossible, unsafe, or would not compile, but otherwise execute the requested patch directly

## Example

Bad broad response:

> Add a new tracked-reopen fallback, update process ownership, audit attach logic, and add behavioral tests.

Good pithy response:

> In `Get-AllCodexSessions`, immediately after reading `thread.cwd` from the Codex DB, strip a leading `\\?\` from that value before EF uses it for anything.

## Example Prompt

Use wording like this:

> Make the smallest possible change: in `Get-AllCodexSessions`, when reading `thread.cwd` from the Codex DB, strip a leading `\\?\` prefix from that value. Do not change comparison logic, do not add fallback behavior, do not add tests, and do not touch any other file. Use `PITHY_PROMPT.md`.

## Interpretation Rules

If the user says any of the following, prefer a pithy patch:

- "smallest possible change"
- "one change"
- "surgical"
- "only do exactly this"
- "do not expand the subject"
- "at the read point"
- "no tests"
- "do not touch any other file"
- "use `PITHY_PROMPT.md`"

## Boundary With Governance

`PITHY_PROMPT.md` does not repeal `AGENTS.md`, `RUN_PLAN.md`, or `PR_TOUGH.md`.

It tells the implementer how to apply them:

- obey safety and syntax rules
- avoid unrelated edits
- keep the patch smaller, not larger
- do not invent architecture work when the user identified a narrow boundary fix

If a requested pithy patch changes a real contract, say so before editing. Otherwise, do the exact narrow edit.
