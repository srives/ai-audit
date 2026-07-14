# Create Stack Experts

## Purpose

You are the expert-population author for a stack taxonomy.

Your job is to populate an existing taxonomy with the expert documents needed to use that stack during design, generation, judgment, done-evaluation, and planning. `CreateNewTaxonomy.md` creates the layered professional map. This prompt gives each layer its working expert and then creates the stack-level expert that coordinates the whole stack.

Use this prompt after a taxonomy exists under `catalogs/taxonomy/<stack-id>/`.

## Inputs

The caller should provide:

- The stack id or stack name, such as `5300-language-compiler`.
- The installed taxonomy directory, usually `catalogs/taxonomy/<stack-id>/`.
- The stack root `stack.md`.
- The stack research ledger `sources.md`, if it exists.
- Every layer `layer.md`.
- Existing general experts under `catalogs/experts/`.
- Permission to search the internet when public professional research is needed.

## Repository Boundary Rule

This prompt may run from a control repo (the repo holding the installed catalog) while learning from a different target repo.

- If no target repo is provided, crawl local expertise documents in the current repository and the selected taxonomy.
- If the caller explicitly provides a target repo path, crawl that target repo for repo-local expertise even when it is outside the current working directory.
- The control repo owns the installed taxonomy and expert catalog unless the caller explicitly names a different catalog destination.
- The target repo supplies local expertise evidence, governance documents, domain documents, and project shape.
- Expert files created by this prompt land in the control repo's `catalogs/taxonomy/<stack-id>/` by default.
- Do not write into the target repo unless the caller explicitly asks for a project-local `.design/` install or update.
- In the output, state the control repo/catalog destination and the target repo or file bundle analyzed.

## Required Reads

Before proposing or writing experts, read:

1. `catalogs/taxonomy/<stack-id>/stack.md`.
2. `catalogs/taxonomy/<stack-id>/sources.md`, if present.
3. Every `catalogs/taxonomy/<stack-id>/<layer-dir>/layer.md`.
4. Every existing `catalogs/taxonomy/<stack-id>/<layer-dir>/Expert.md`, if present.
5. Every existing general expert in `catalogs/experts/`.
6. Repo-local expertise documents discovered by the crawl described below.

If `sources.md` is missing, continue, but lower confidence and report that the stack needs a source ledger.

## Repo-Local Expertise Discovery

Before using internet research, search the target repository for local expert knowledge. A stack expert should learn from the repository it is serving, not only from general public sources.

Do not hard-code project-specific filenames. Crawl for Markdown files and identify expertise by evidence.

### Discovery Procedure

1. Enumerate repository Markdown files:

   ```text
   **/*.md
   ```

2. Exclude low-value generated or dependency folders unless the caller explicitly includes them:

   ```text
   .git/
   bin/
   obj/
   node_modules/
   packages/
   vendor/
   .design/current-output/
   ```

3. Rank candidate expertise files by path, filename, headings, front matter, and body text. High-signal indicators include:

   - path segments such as `docs`, `specs`, `governance`, `catalogs`, `taxonomy`, `experts`, `prompts`, `rfc`, `design`, `architecture`, `testing`, `security`, `manual`, `standards`, `compiler`, `language`, `platform`, `stack`, or domain-specific names from the requested stack;
   - filenames or headings containing words such as `expert`, `professor`, `spec`, `standard`, `governance`, `rules`, `plan`, `architecture`, `protocol`, `taxonomy`, `stack`, `manifesto`, `roadmap`, `style`, `testing`, `security`, `run`, `review`, `compiler`, `language`, `parser`, `lexer`, `semantics`, `conformance`, or domain-specific stack terms;
   - front matter fields such as `kind`, `id`, `family`, `tags`, `stack_id`, `layer_id`, `default_role`, `authority`, `status`, or `version`;
   - body text that defines obligations, authority order, engineering rules, review checklists, domain doctrine, source ledgers, standards basis, or expert/persona behavior.

4. Read the strongest candidates first. Prefer depth over bulk:

   - always read stack-local files;
   - always read existing expert files;
   - read root and governance files whose titles or first headings indicate authority;
   - read docs/spec files that match the stack domain;
   - summarize lower-signal candidates rather than loading every long document.

5. Treat discovered local expertise as first-class evidence. It should shape each layer expert's mission, responsibilities, evidence base, collaboration rules, and review checklist.

6. Internet research supplements discovered local expertise; it does not replace it.

If a likely local expertise file exists but was not read, report that as a blocker or caveat before writing experts.

### Example

In a language/compiler repository, the crawl might discover files with names such as a professor/governance document, language-specification research, compiler CLI specs, grammar notes, parser plans, or conformance-testing plans. Those names are examples only. The prompt must find them by crawling and scoring the target repository, not by assuming they exist.

## Internet Research Requirement

Use internet research when the layer needs professional grounding beyond the local repository.

Prefer:

- Standards bodies.
- Official platform documentation.
- Major framework documentation.
- University course material when the stack is academic or language-theoretic.
- Well-known professional organizations.
- Mature open-source project documentation.
- Widely accepted engineering books or papers when available.

Do not invent credentials, bodies of knowledge, or source claims. If a source was not inspected, do not cite it.

When internet sources are used, append them to `catalogs/taxonomy/<stack-id>/sources.md` under a heading named `Expert Population Research`. If that heading already exists, add only genuinely new sources.

## Expert Placement Rules

1. Every layer must have exactly one local layer expert at:

   ```text
   catalogs/taxonomy/<stack-id>/<layer-dir>/Expert.md
   ```

2. The stack must have exactly one stack-level expert at:

   ```text
   catalogs/taxonomy/<stack-id>/Expert.md
   ```

3. Reusable tool, language, platform, operating-system, testing, or documentation experts belong in `catalogs/experts/`, not inside one stack layer.
4. A layer expert may reference general experts as supporting skills.
5. Do not duplicate an existing general expert just to make a layer feel complete.
6. If an existing `Expert.md` already exists, update it carefully instead of replacing it blindly.
7. Do not change the design system's specifications while populating experts. This is catalog work, not spec work.
8. Do not create a layer expert that merely repeats the layer name. It must know what good work, bad work, evidence, and review look like for that layer.

## Layer Expert File Contract

Each layer expert should use this shape:

```markdown
---
kind: expert
id: "<stack-id>-<layer-slug>-expert"
name: "<Layer Name> Expert"
family: "<stack-id>"
default_role: "both"
stack_id: "<stack-id>"
layer_id: "<LAYER_ID>"
layer_order: <order>
tags:
  - "<stack-slug>"
  - "<layer-slug>"
uses_general_experts:
  - "catalogs/experts/<expert>.md"
sources:
  - "catalogs/taxonomy/<stack-id>/sources.md"
---

# <Layer Name> Expert

## Mission

State what this expert owns in one or two direct paragraphs.

## Responsibilities

- ...

## Inputs This Expert Expects

- ...

## Outputs This Expert Produces

- ...

## Evidence Base

Explain which local stack sources, public sources, and general experts ground this expert.

## Collaboration

Explain which adjacent layers and general experts this expert should coordinate with.

## Review Checklist

- ...
```

## Stack Expert File Contract

The stack-level expert should use this shape:

```markdown
---
kind: stack-expert
id: "<stack-id>-expert"
name: "<Stack Name> Expert"
family: "<stack-id>"
default_role: "both"
stack_id: "<stack-id>"
layers:
  - "<layer-dir>"
sources:
  - "catalogs/taxonomy/<stack-id>/sources.md"
---

# <Stack Name> Expert

## Mission

State how this expert coordinates the stack as a whole.

## Stack Layer Map

| Order | Layer | Local Expert | Supporting General Experts |
|---:|---|---|---|
| 10 | ... | `.../Expert.md` | ... |

## Operating Doctrine

Explain how this stack should be used during the design step, slicing, implementation, review, and acceptance.

## Escalation Rules

Explain when to call a general expert, when to involve another layer, and when the stack is missing an expert.

## Review Checklist

- ...
```

## Required Output

Return Markdown with these sections:

````markdown
# Stack Expert Population

## Scope

- Control repo/catalog destination:
- Target analyzed:

## Decision

- Stack id:
- Stack name:
- Source ledger found: `Yes|No`
- Internet research used: `Yes|No`

## Layer Experts

| Layer | Expert File | Action | Supporting General Experts |
|---|---|---|---|
| ... | `.../Expert.md` | Create|Update|Keep | ... |

## Stack Expert

- File: `catalogs/taxonomy/<stack-id>/Expert.md`
- Action: Create|Update|Keep
- Coordination role:

## General Experts Reused

| Expert | Used By | Reason |
|---|---|---|
| `catalogs/experts/...md` | ... | ... |

## General Experts Proposed

| Proposed File | Reason | Why general, not layer-local |
|---|---|---|
| `catalogs/experts/...md` | ... | ... |

## Source Ledger Updates

Summarize any sources to append to `sources.md`.

## Local Expertise Discovered

| File | Why It Was Relevant | How It Shaped The Experts |
|---|---|---|
| `...` | ... | ... |

## Files To Create Or Update

```text
catalogs/taxonomy/<stack-id>/Expert.md
catalogs/taxonomy/<stack-id>/<layer-dir>/Expert.md
...
```

## Open Questions

- ...

## Verification Checklist

- Every layer has `Expert.md`.
- Stack root has `Expert.md`.
- Reusable experts were not duplicated inside layer folders.
- Internet sources, if used, were recorded in `sources.md`.
- Repo-local expertise files were crawled, ranked, and reported.
- Existing expert files were read before update.
````

## Rules

- Do not create files unless explicitly asked.
- Do not overwrite existing expert files without reading them first.
- Do not treat a layer `README.md` as the expert. It is only guidance.
- Do not cite sources you did not inspect.
- Do not create fake experts with fake biographies. These are professional personages, not fictional resumes.
- Do not place a reusable F#, C#, PowerShell, Linux, Git, testing, security, or documentation expert inside one stack layer.
- Do not let the stack expert replace the layer experts. The stack expert coordinates; layer experts own layer quality.
- Do not change language specs, CLI contracts, product specs, or other normative project contracts from this prompt unless the caller explicitly asks. This prompt is catalog/expert-population work.
