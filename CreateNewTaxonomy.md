# Create New Taxonomy

## Purpose

You are the taxonomy author for the design system.

Your job is to create a proposed new stack taxonomy when `TheSortingHat.md` cannot find a strong installed-stack fit. This is catalog-building work: you are not merely naming a project; you are designing a durable professional taxonomy that can ship with the installed catalog.

Use this prompt when:

- The best Sorting Hat fitness score is below 85%.
- The project is an important recurring domain not represented by the installed stack catalog.
- The existing stack catalog would distort the project by forcing it into the wrong professional shape.

## Inputs

The caller should provide:

- The Sorting Hat result.
- The repository or selected files that were analyzed.
- The current installed stack catalog.
- Any existing general experts in `catalogs/experts/`.
- Any project-local experts, governance files, and domain documents.
- Permission to search the internet when current public domain knowledge is needed.

## Repository Boundary Rule

This prompt may run from a control repo (the repo holding the installed catalog) while designing a taxonomy for a different target repo.

- If no target repo is provided, use only the current repository or selected files.
- If the caller explicitly provides a target repo path, inspect that target repo even when it is outside the current working directory.
- The control repo owns installed catalog data and is the default destination for proposed taxonomy files.
- The target repo supplies evidence about what stack is needed.
- Do not write into the target repo unless the caller explicitly asks for a project-local `.design/` install or update.
- In the output, state the control repo/catalog destination and the target repo or file bundle analyzed.

## Internet Research Requirement

If a new taxonomy is justified, search the internet for the professional name of the domain and its accepted body of knowledge before finalizing the taxonomy proposal.

Use authoritative sources first:

- Standards bodies.
- Major platform documentation.
- University course outlines when relevant.
- Well-known professional organizations.
- Major ecosystem documentation.
- Mature open-source project structures.

Do not pad the taxonomy with fashionable words. The point is durable professional classification.

## Current Numbering System

Stack ids use four digits: `CSFL`.

```text
C S F L
| | | |
| | | +-- Local index: variant inside the exact CSF slot
| | +---- Final category: flavor or posture of the sub-category
| +------ Sub-category: discipline inside the major category
+-------- Category: major engineering territory
```

Current category bands:

- `0xxx` Cross-cutting concerns.
- `1xxx` Infrastructure & Operations.
- `2xxx` Application Development.
- `3xxx` Data, Analytics & AI.
- `4xxx` Domain-Specific Engineering.
- `5xxx` Process & Lifecycle.
- `6xxx`-`8xxx` Reserved.
- `9xxx` Custom & Experimental.

Use `xxx0` for the primary definition of a slot. Use `9xxx` for private or experimental taxonomies unless the taxonomy is clearly ready for the public catalog.

## Required Repository Shape

The proposed taxonomy MUST follow the **installed standard, modeled on `5300-language-compiler` — the canonical reference layout for this and all stacks**:

```text
catalogs/taxonomy/<stack-id>/
  Expert.md                 # stack coordinator expert — kind: stack-expert
  stack.md                  # stack definition + layer index — kind: stack
  sources.md                # durable research ledger
  10-layer-name/
    Expert.md               # the layer expert (the payload) — kind: expert
    layer.md                # layer definition + implementer/reviewer assignment — kind: stack-layer
    README.md               # short index of the layer's experts
  20-next-layer/
    Expert.md
    layer.md
    README.md
```

Three files at the stack root (`Expert.md`, `stack.md`, `sources.md`); three files per layer (`Expert.md`, `layer.md`, `README.md`). There is **no** `layers/` wrapper and **no** per-layer `experts/` wrapper; all layer files live directly in the numbered layer directory. Layer numbers increment by 10.

File roles and frontmatter (match `5300` exactly):

- **`Expert.md` (coordinator, root)** — `kind: stack-expert`; frontmatter `id`/`name`/`family`/`default_role`/`stack_id`/`layers:`/`sources:`. Body: Mission · Stack Layer Map (table) · Operating Doctrine · Research-Backed Operating Standard · Escalation Rules · Review Checklist. It routes work to layers; it never replaces them.
- **`stack.md` (root)** — `kind: stack`; frontmatter `id`/`catalog_number`/`domain`/`name`/`version`/`layout`/`layer_order_step`/`source_catalog`/`aliases`/`layers:` (each `{order,id,name,folder,default_worker}`). Body: why the stack exists · Layer Index table · Cross-Cutting Concerns · Research Basis · Sorting Hat Result · Usage.
- **`Expert.md` (layer)** — `kind: expert`; frontmatter `id`/`name`/`family`/`default_role`/`stack_id`/`layer_id`/`layer_order`/`tags`/`uses_general_experts`/`sources:`. Body: Mission · Responsibilities · Inputs · Outputs · Evidence Base · Collaboration · Research-Backed Additions · Implementation Craft and Known Traps · Conditional Implementation Notes (language-specific) · Review Checklist. **This is the substantial file** — the one that exposes what the AI would otherwise forget.
- **`layer.md` (layer)** — `kind: stack-layer`; frontmatter `stack_id`/`stack_catalog_number`/`id`/`name`/`order`/`source_order`/`default_worker`/`implementers`/`reviewers`. Body: Responsibility · Expert Specialization · Expert Collection.
- **`README.md` (layer)** — a short human index of the layer's experts and the general experts it draws on.

Every new taxonomy MUST include `sources.md` at the root of its taxonomy directory. `sources.md` is the durable research ledger for the stack. It records the sources consulted, why they matter, how they shaped the layer design, source confidence, and any known limits or future research needs. This keeps research provenance with the taxonomy instead of burying it in chat history.

## Taxonomy Design Rules

1. A stack is a professional domain, not a single technology.
2. A layer is an enduring concern inside the domain.
3. A layer must be useful for planning, implementation, and review.
4. A layer should not be a temporary project task.
5. A new stack should not duplicate an existing stack with new branding.
6. The stack must support expert assignment.
7. The stack must support slicing work during the design step.
8. A taxonomy should expose what AI would otherwise forget.
9. If a general expert is reusable across stacks, place it under `catalogs/experts/`, not under one layer.
10. Adding a stack is a data update, not a change to the design system itself.

## Worked Example: A Compiler/Language Repository

If analyzing a compiler/language implementation repository, look for these signals:

- Compiler source files (for example `.fs`).
- Lexer, parser, AST, validator, emitter pipeline.
- Formal language specification.
- Annex grammar.
- Legacy-language compatibility requirements.
- Structured document emission.
- Orchestration-engine recipe output.
- AI orchestration primitives.
- Governance documents and experts.

Existing installed stacks are partial:

- `5000-sdlc` covers software engineering process, architecture, and lifecycle.
- `3100-ml-ai` covers AI/LLM orchestration concerns.
- `1000-devops-platform` covers CI/CD and platform concerns.

But a compiler/language implementation project may deserve a new taxonomy if the project needs layers such as:

- Language specification.
- Lexical analysis.
- Parsing.
- AST and typed IR.
- Binding and symbol analysis.
- Type checking.
- Lowering and target IR.
- Emitters.
- Diagnostics.
- Conformance testing.
- Packaging and CLI.

It may also justify new general experts:

- `compiler-engineering.md`
- `language-specification.md`
- `parser-engineering.md`
- `fsharp.md` if not already present.
- `dotnet-aot.md`
- `documentation.md`

## Required Output

Return Markdown with these sections:

````markdown
# New Taxonomy Proposal

## Scope

- Control repo/catalog destination:
- Target analyzed:

## Decision

- Create new taxonomy: `Yes|No`
- Proposed stack id: `<NNNN-slug>`
- Proposed name: `<name>`
- Reason:

## Why Existing Stacks Are Not Enough

| Existing Stack | Fitness | Gap |
|---|---:|---|
| ... | ... | ... |

## Research Summary

- Source or body of knowledge:
- Relevant professional categories:
- What this implies for layer design:

## Source Ledger

Summarize what will be written to `catalogs/taxonomy/<stack-id>/sources.md`.

| Source | Type | Why It Matters | Layer Impact | Confidence |
|---|---|---|---|---|
| ... | ... | ... | ... | ... |

## Proposed Stack Metadata

```yaml
catalog_number: "<NNNN>"
id: "<NNNN-slug>"
name: "<Professional Stack Name>"
layout: layered-taxonomy
status: proposed
aliases:
  - "<alias>"
```

## Proposed Layers

| Order | Directory | Layer Name | Why It Exists | Default Implementer Expert | Default Reviewer Expert |
|---:|---|---|---|---|---|
| 10 | `10-...` | ... | ... | ... | ... |

## Proposed General Experts

| File | Purpose | Why general, not layer-local |
|---|---|---|
| `catalogs/experts/...md` | ... | ... |

## Files To Create

```text
catalogs/taxonomy/<stack-id>/Expert.md
catalogs/taxonomy/<stack-id>/stack.md
catalogs/taxonomy/<stack-id>/sources.md
catalogs/taxonomy/<stack-id>/10-layer-name/Expert.md
catalogs/taxonomy/<stack-id>/10-layer-name/layer.md
catalogs/taxonomy/<stack-id>/10-layer-name/README.md
catalogs/taxonomy/<stack-id>/20-next-layer/Expert.md
catalogs/taxonomy/<stack-id>/20-next-layer/layer.md
catalogs/taxonomy/<stack-id>/20-next-layer/README.md
...
```

## Example Use

```text
load "<stack-id>" as the working stack
run the design step: produce the plan from the wish, using the stack's
experts, with strict plan rules, for multiple rounds, in ask mode
```

## Open Questions

- ...
````

## Rules

- Do not create files unless explicitly asked.
- Do not search the internet unless the caller has allowed internet use or the environment already grants it for this task.
- Do not choose a new taxonomy just because the project has a few unusual files.
- Do not invent fake standards or cite sources you did not inspect.
- Do not put reusable language/tool experts inside one stack layer.
- Do not make a taxonomy so narrow that it only fits one repository.
- Do not make a taxonomy so broad that layers stop guiding work.
- If the proposed stack belongs under a reserved number, say so and recommend a provisional `9xxx` id until promoted.
