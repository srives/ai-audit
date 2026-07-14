# ai-audit-long

**`ai-audit-long` is a skill you invoke inside any repo. It grades how healthy that repo's AI setup is, hands you a report of what's broken — and, if the repo is missing its governance, offers to lay it down and tailor it to the project.** Think of it as a linter for the instructions that steer AI agents, not for your code.

## What it does when you run it

You type `/ai-audit-long` (or "audit this repo's AI health"). Before touching anything, it **opens by explaining itself and asking whether to continue** — nothing happens until you say yes. Then:

1. **Detect the stack** — C#/.NET, Node, Python, etc. — so the findings fit the actual project.
2. **Inventory the governance** — `CLAUDE.md`, `AGENTS.md`, `PR_TOUGH.md`, `RUN_PLAN.md`, `.claude/`, skills. Missing ones are themselves findings.
3. **Check each present file against four things:**
   - Current best practice (length budgets, model versions, plan mode)
   - Fit to *this* project (WPF rules in a Python repo = noise)
   - Agreement with each other (do CLAUDE.md and AGENTS.md contradict?)
   - Coverage of real failure modes (does the repo have rules for bugs its own git log shows it keeps hitting?)
4. **Score cognitive load** — is the governance so long the AI will skim past the critical rules?
5. **Write a graded report** — `ai-audit-long-findings.md`.
6. **Offer to fix what's missing** — if the repo has no review governance, it offers (with your permission) to deposit a starter pack and **tailor it to your repo**: filling in your real commands, deleting rules that don't fit your stack, and adding guardrails for the failure modes your git log reveals.

## What you get out

- A report with **per-file A–F grades** + a one-line headline each, **findings ranked by severity** (file:line, what's wrong, why it costs you, the smallest fix), and **top-5 fixes** by impact.
- Optionally — only if you say yes — a set of governance files deposited and customized to your project, so a bare repo walks away actually governed.

## What it's built from

Four masters do the thinking; a `SKILL.md` wraps them so the agent loads and runs them:
`AI-AUDIT.md` (the core checklist) · `AI_AUDIT_GOVERNANCE_REVIEW.md` (the cognitive-load rubric) · `AI_AUDIT_SEAM_REVIEW.md` (seam discipline). A `starter-pack/` holds the templates it deposits.

## A concrete run

Point it at Stratus today and it'd emit things like:
> **HIGH — Cross-file drift.** `CLAUDE.md`/`AGENTS.md`/`PR_TOUGH.md` are copy-pasted across Stratus, Tooling, and `Workstation/` and have diverged. Pick one master, reference it from the others.

> **MEDIUM — Governance blind to Codex/Cursor.** Both are in active use (dozens of `*-codex*.md`) but only `CLAUDE.md` exists. No `.cursorrules`/Codex guidance.

Point it at a bare repo and it grades everything **Missing**, then offers to stand up a tailored `AGENTS.md` whose guardrails come straight from the repo's own history — e.g. a *"no read-path caching without invalidation"* rule traced to a `revert: stale users` commit.

## What it will and won't touch

It **never touches your code.** It **never edits governance you already have without asking** — your `CLAUDE.md` and `AGENTS.md` are yours; the most it does is *report* what they're missing and, only while installing the pack and only on an explicit yes, merge those concepts in. The one thing it writes unprompted is the findings report.

That's the whole thing: **point it at a repo, get back a graded "here's what's wrong with your AI governance and how to fix it" report — and, if you want, the fixes themselves, tailored to your project.**
