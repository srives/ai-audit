# When Reading DONE

`READ source AS DONE` uses the `basicai.done.v1` named profile contract.

The goal is not to prove completion at compile time. The goal is to parse a readable completion standard into a stable typed value that `IS` can evaluate with deterministic checks, AI evaluation, or both according to the document and declared authority.

## Accepted Markdown Shape

```md
---
type: DONE
profile: basicai.done.v1
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
| `.TITLE$` | document title or first heading |
| `.SUMMARY$` | front matter summary or first paragraph when present |
| `.CRITERIA` | `Criteria` section |
| `.RULES` | `Rules` section |
| `.REVIEW` | `Review` section |
| `.AI` | front matter `ai` value, if present |

The raw source text, source path or artifact identity, profile name, and unrecognized sections are preserved for provenance.

## Validation

A `DONE` document is malformed when:

- `type` is present and is not `DONE`;
- `profile` is present and is not a supported DONE profile;
- required sections for the selected profile are missing;
- front matter is syntactically invalid;
- `.AI` names an unknown AI-pak identifier.

Malformed `DONE` input is a typed-document diagnostic in the `BAS04xx` family.

## IS Evaluation

`IS` returns `BOOLEAN`.

Accepted forms:

```basic
IF evaluation IS ModelDone THEN END SUCCESS
IF result IS Done USING CLAUDE THEN END SUCCESS
IF result IS Done USING ANY THEN END SUCCESS
```

`IS ... USING` accepts singular `AI | ANY` only. Multi-review workflows belong to `JUDGE`.

The compiler does not claim that a `DONE` document is semantically true. It only validates the profile shape and target representability. Runtime evaluation may execute deterministic checks, AI review, or both, according to the `DONE` document and available authority.
