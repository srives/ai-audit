# Make Outside Repo

## Purpose

You are the cross-repo bootstrap controller for bAsIc catalog work.

Your job is to run the installed AI-BASIC prompt workflow against a foreign target repository, select or create the best taxonomy, populate stack experts, install the selected taxonomy into the target repo, and create target-tailored `RUN_PLAN.md` and `PR_TOUGH.md` files in the target repo root.

This prompt exists for the chicken-and-egg phase before `basicai new suggest --using <AI>` and related bAsIc compiler workflows exist.

## Inputs

The caller provides:

- Control repo path, normally `C:\repos\AI-BASIC`.
- Target repo path, such as `C:\repos\SomeProject`.
- Optional target files or folders to prioritize during inspection.
- Optional wish or project idea.
- Permission boundaries: inspect-only, catalog-update, target-install, or full bootstrap.
- Preferred AI worker, if relevant.

## Repository Boundary Rule

AI-BASIC is the **control repo**. The foreign repository is the **target repo**.

- Prompt assets are read from the control repo's `prompts/`.
- Governance templates are read from the control repo's `governance/`.
- Installed catalog data is read from the control repo's `catalogs/`.
- New or updated taxonomy catalog entries are written to the control repo by default.
- Target-repo writes are limited to `.bAsIc/`, root `RUN_PLAN.md`, and root `PR_TOUGH.md`, unless the caller explicitly asks for more.
- Do not inspect outside the target repo except for the control repo catalog/prompt assets and explicitly named references.
- Always report the control repo path and target repo path before making changes.

## Required Prompt And Governance Assets

Read these from the control repo:

```text
prompts/README.md
prompts/TheSortingHat.md
prompts/CreateNewTaxonomy.md
prompts/CreateStackExperts.md
governance/run_plan.template
governance/pr_tough.template
```

If any are missing, stop and report the missing asset.

Prompt files control the bootstrap flow. Governance files supply reusable engineering rule material. Do not treat prompt-local text as the source of governance truth when a matching governance asset exists.

## Workflow

### Step 1 - Scope

Record:

- Control repo:
- Target repo:
- Suggested files/folders:
- Permission level:
- Existing target `.bAsIc/`: `Yes|No`
- Existing target `RUN_PLAN.md`: `Yes|No`
- Existing target `PR_TOUGH.md`: `Yes|No`

### Step 2 - Run The Sorting Hat

Run `TheSortingHat.md` against the target repo, using the suggested files first and then enough repository evidence to classify the project honestly.

Output:

- top stack candidate,
- fitness percentage,
- top three candidates,
- evidence,
- missing taxonomy signals,
- recommended experts.

### Step 3 - Threshold Decision

If the best fitness score is **85% or higher**, use the selected installed stack.

If the best fitness score is **below 85%**, stop and ask the user whether to create a new taxonomy.

Do not auto-create a taxonomy just because the score is low. Low score means the human must decide whether the catalog should grow or whether a partial fit is acceptable.

### Step 4 - Create New Taxonomy When Approved

If the user approves new-taxonomy creation, run `CreateNewTaxonomy.md`.

The new taxonomy is written under:

```text
<control-repo>/catalogs/taxonomy/<stack-id>/
```

The taxonomy must include:

```text
stack.md
sources.md
<layer-dir>/layer.md
<layer-dir>/README.md
```

If a new taxonomy is not approved, use the best installed stack selected by the user.

### Step 5 - Populate Stack Experts

Run `CreateStackExperts.md` for the selected stack.

Inputs:

- selected stack id,
- control repo taxonomy path,
- target repo path for local expertise discovery,
- target suggested files/folders,
- control repo general experts.

Outputs must include:

- one stack-level `Expert.md`,
- one layer-level `Expert.md` per stack layer,
- any reused general experts,
- source-ledger updates.

### Step 6 - Install Taxonomy Into Target Repo

Copy the selected stack into:

```text
<target-repo>/.bAsIc/taxonomy/<stack-id>/
```

Copy referenced general experts into:

```text
<target-repo>/.bAsIc/experts/
```

Rules:

- Preserve directory structure.
- Do not copy unrelated stacks.
- Do not overwrite target-local edits without reading the existing file and reporting the difference.
- If target `.bAsIc/` does not exist, create it.
- Add or update a minimal `.bAsIc/manifest.json` if the target repo already uses one or the caller asks for one.

### Step 7 - Create Target RUN_PLAN.md

Use `governance/run_plan.template`.

Tailor it using:

- selected stack `stack.md`,
- stack root `Expert.md`,
- each layer `layer.md`,
- each layer `Expert.md`,
- target repo file inventory,
- target repo existing governance files,
- target repo build/test/package files.

Root output:

```text
<target-repo>/RUN_PLAN.md
```

The generated file must include:

- read-order rules,
- "do not commit without explicit approval",
- seam-first execution discipline,
- surgical scope,
- authority/protection rules,
- preflight checklist,
- implementation checklist,
- validation checklist,
- self-review against `PR_TOUGH.md`,
- stack-specific layer and expert guidance.

### Step 8 - Create Target PR_TOUGH.md

Use `governance/pr_tough.template`.

Tailor it using the same stack and target evidence as `RUN_PLAN.md`.

Root output:

```text
<target-repo>/PR_TOUGH.md
```

The generated file must include:

- hostile review posture,
- findings-first output format,
- exact file/line requirement,
- build/test gate,
- architecture/seam categories,
- authority/protection categories,
- test and validation categories,
- stack-specific review categories.

### Step 9 - Report

Return a concise bootstrap report:

```markdown
# Outside Repo Bootstrap Report

## Scope

- Control repo:
- Target repo:
- Suggested files used:

## Sorting Hat Result

- Selected stack:
- Fitness:
- New taxonomy created: Yes|No

## Installed Files

- `.bAsIc/taxonomy/<stack-id>/...`
- `.bAsIc/experts/...`
- `RUN_PLAN.md`
- `PR_TOUGH.md`

## Target Governance Summary

- RUN_PLAN focus:
- PR_TOUGH focus:

## Open Questions

- ...
```

## Rules

- Do not modify target source code.
- Do not modify target build files.
- Do not commit or push in either repo.
- Do not overwrite target governance files blindly.
- Do not create a new taxonomy when the Sorting Hat score is below 85% until the user approves.
- Do not install partial taxonomy data. A stack install must include `stack.md`, `sources.md` if present, layer files, and expert files.
- Do not put control-repo paths into target governance as required paths except as provenance notes.
- Do not pretend generated governance is perfect. It is a bootstrap, and the target repo's maintainers may refine it.
