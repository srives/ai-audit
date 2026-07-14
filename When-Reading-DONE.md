# When Reading DONE

Reading a source document as a typed `DONE` value uses the `done.v1` named profile contract.

The goal is not to prove completion at compile time. The goal is to parse a readable completion standard into a stable typed value that done-evaluation can evaluate with deterministic checks, AI evaluation, or both according to the document and declared authority.

## Accepted Markdown Shape

```md
---
type: DONE
profile: done.v1
ai: CLAUDE
strictness: strict
---

# Done

## Criteria
- Tests pass.
- Public contracts are preserved.

## Rules
- Do not weaken governance.
- Do not hide unresolved review findings.

## Review
Use strict review. Findings should cite files and lines when possible.
```

## Mapping

The compiler/runtime maps recognized content into:

| DONE property | Source |
|---|---|
| `title` | document title or first heading |
| `summary` | front matter summary or first paragraph when present |
| `criteria` | `Criteria` section |
| `rules` | `Rules` section |
| `review` | `Review` section |
| `ai` | front matter `ai` value, if present |

The raw source text, source path or artifact identity, profile name, and unrecognized sections are preserved for provenance.

## Validation

A `DONE` document is malformed when:

- `type` is present and is not `DONE`;
- `profile` is present and is not a supported DONE profile;
- required sections for the selected profile are missing;
- front matter is syntactically invalid;
- `ai` names an unknown installed AI identifier.

Malformed `DONE` input is reported as a typed-document diagnostic.

## Done-Evaluation

Done-evaluation returns a boolean.

Accepted forms:

```text
evaluate a result against a DONE document
evaluate a result against a DONE document using one named AI
evaluate a result against a DONE document using any available AI
```

Done-evaluation accepts a single named AI or "any" only. Multi-reviewer workflows belong to judgment.

The toolchain does not claim that a `DONE` document is semantically true. It only validates the profile shape and target representability. Runtime evaluation may execute deterministic checks, AI review, or both, according to the `DONE` document and available authority.
