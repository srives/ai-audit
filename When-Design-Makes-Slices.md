# When DESIGN Makes Slices

## Purpose

This governance document defines the required shape of slice sections produced by the design step when it turns a plan, wish, or specification into implementation slices.

The design step is not merely summarizing work. It is producing executable planning material for AI workers and orchestration-engine execution. Therefore each slice must identify the expertise needed to execute it.

## Required Slice Metadata

Every generated slice section MUST include these Markdown fields near the top of the section:

```md
**Source slice:** <source-id-or-description>

**Layer:** `<taxonomy-layer-name>`

**Expert:** `<path-to-layer-Expert.md>`
```

If a slice combines multiple source slices, use:

```md
**Source slices:** <source-id-1>, <source-id-2>
```

## Expert Field Rule

The `**Expert:**` field is mandatory.

It tells the AI worker which taxonomy expert to read before implementing the slice. The value must be a real repository path to the governing `Expert.md` file for the layer that owns the slice.

Example:

```md
**Layer:** `20-lexical-analysis`

**Expert:** `catalogs/taxonomy/5300-language-compiler/20-lexical-analysis/Expert.md`
```

The stack-level expert may be referenced in addition to the layer expert, but it does not replace the layer-specific `Expert.md`.

## Layer Ownership Rule

The `**Layer:**` field identifies the taxonomy layer that owns the slice. The layer owns the slice when that layer is where the feature first becomes real.

Examples:

- Lexer/token rules belong to the lexical-analysis layer.
- Parsed grammar and AST shape belong to the parsing-and-syntax-trees layer.
- Names, labels, and reflected identifiers belong to the binding-and-symbol-analysis layer.
- Types, effects, authority, and object properties belong to the static-semantics layer.
- Flow or document transformation belongs to the lowering layer.
- JSON/YAML/XML/TOML serialization belongs to the emitter layer.

Do not assign a slice to a later layer merely because that later layer eventually consumes the result.

## Deletion-Friendly Slice Shape

When slices are intended for an implementation recipe, each slice section must be independently deletable after completion.

A recipe-ready slice should contain:

```md
## Slice N — <name>

**Source slice:** <source>

**Layer:** `<layer>`

**Expert:** `<path>`

**Objective:** <one paragraph>

**Work:**
- <actionable item>

**Output artifact:** <durable result>

**Acceptance:**
- <verifiable acceptance point>

**Verification:**
- <command or focused check>
```

Completed slices are deleted from the recipe-ready plan. They are not relabeled as done.

## No Implicit Expertise

AI workers must not infer expertise from the slice title alone. `DESIGN` must name the layer and expert path explicitly so that orchestration can load the right knowledge without guessing.

