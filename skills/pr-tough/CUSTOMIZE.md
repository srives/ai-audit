# CUSTOMIZE.md — Fitting PR_TOUGH.md to This Repository

This is the procedure for customizing a freshly deposited `PR_TOUGH.md` so it reviews **this** repository — its real commands, its real boundaries, its real failure history — instead of reviewing in the abstract.

## The evidence rule (non-negotiable)

**Every rule this procedure adds must cite its evidence** — a commit hash, a config path, a real file, a documented boundary. If you cannot name the evidence, you may not add the rule. Customization is not taste; it is the repo's own history written down as review checks. A rule with no citation is deleted at verification.

---

## The procedure

Work these steps in order. Collect evidence first; edit `PR_TOUGH.md` once, at the end.

### 1. Detect the stack

From build files (`*.csproj`, `package.json`, `pyproject.toml`, `Cargo.toml`, `*.psm1`, …) — never from guesses. Record: languages, frameworks, test framework, package layout.

### 2. Extract the real commands

Find the actual build / test / lint / format commands (package scripts, project files, Makefiles, workflow files, the README). Wire them in:

- **§3 Hard gates** — replace "the documented build command" with the literal command.
- **§11 Missing validation** — the examples become this repo's real invocations.

*Evidence: the file that defines each command.*

### 3. Mine the git history for failure families

`git log --oneline -200` (or `--since` a sensible window), grep for `fix|revert|hotfix|guard|null`. Cluster the hits into failure families — the bugs this repo actually has. For each family with two or more members, add one drift pattern or category emphasis to **§4.1 Targeted drift search**, phrased as a searchable check.

*Evidence: the commit hashes, listed with the added pattern.* This is the highest-value step — a rule born from a real regression outranks any generic advice.

### 4. Harvest the existing lint layer

Read `.editorconfig`, eslint/analyzer configs, formatter configs. **Do not duplicate anything they already enforce** — reference them as the §3 lint gate instead. Customization never competes with the repo's own tooling.

*Evidence: the config paths.*

### 5. Map the boundaries

From the directory layout, import conventions, and any architecture docs (`AGENTS.md`, `CLAUDE.md`, docs/) — identify the layers and who may call whom. Populate **§4.1** with repo-specific forbidden shapes (e.g. "`ui/` importing from `store/` internals") and sharpen the **§5.2 boundary questions** with the real module names.

*Evidence: the doc line or the directory convention observed.*

### 6. Name the canonical stores

Identify where durable state actually lives (database, files, caches, projections). Rewrite the **§5.1 canonical-truth** and **§5.3 cache/projection** questions to name those stores, so the reviewer checks "does anything bypass `<the real store>`" instead of an abstraction.

*Evidence: the code paths that read/write each store.*

---

## Editing rules

- **Additive only.** Never rewrite or delete the framework's sections; the section numbering must survive untouched.
- **Mark, don't remove.** A section that genuinely cannot apply (e.g. build/manifest parity in a single-project repo) gets a one-line `*(N/A here: <reason>)*` marker, not deletion.
- **Budget: at most ~15 additions.** Customization that doubles the file defeats the review — an overloaded framework falls out of the reviewer's working attention. Prefer the highest-evidence additions; drop the rest.
- **Front-load.** Repo-specific hard gates go where the generic gates live, not in an appendix.
- **No speculation.** "This repo might someday…" is not evidence.

## Verification (before declaring done)

1. **Structure intact** — all original section headings still present, in order.
2. **Every added pattern tested** — run each added grep against the repo: it must be syntactically valid, and either match a known-bad example (from the cited commit) or cleanly match nothing (a guard). A pattern that errors or matches noise is removed.
3. **Every addition cited** — anything without evidence is removed.
4. **Provenance footer appended** to the customized file:

```md
---
## Customization record
Customized: <date> · Stack: <detected>
| Addition | Section | Evidence |
|---|---|---|
| <pattern or rule> | §4.1 | commits a1b2c3d, e4f5a6b |
| <build command wired> | §3 | package.json scripts.build |
```

The footer is the audit trail: anyone can check any customization decision against the repo itself.
