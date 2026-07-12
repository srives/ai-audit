# YAML bAsIc Rules

YAML governance/configuration documents use named profile contracts. A profile contract defines required fields, optional fields, defaults, unknown-field handling, and diagnostics.

## Required Shape

Every YAML typed document that claims a bAsIc profile must carry:

```yaml
type: <TYPE>
profile: <profile-name>
```

Examples:

```yaml
type: LLM
profile: basicai.llm.v1
provider: HF
model: mistralai/Mistral-7B-v0.1
precision: 4bit
rank: 16
```

```yaml
type: CORPUS
profile: basicai.corpus.v1
license: CC-BY-4.0
commercialUseAllowed: true
sources: []
```

## Profile Authority

The profile name selects a compiler/runtime-known contract. Profiles may be built into `basicai.exe`, imported through AI-pak/governance packs, or embedded into a generated executable.

Draft 1.9 does not treat YAML schema files as loose runtime sidecars. A self-contained executable that needs an imported profile must carry that profile contract with it.

## Unknown Fields

Unknown fields are preserved for provenance. They are accepted only when the selected profile declares unknown fields ignorable or extension-safe. Otherwise the typed read reports a malformed document diagnostic.

## Reflected Identifiers

AI, model, provider, and profile identifiers in YAML resolve through the active AI-pak/profile set. They are not lexer keywords and not string substitutes for source `AI` values.

## Security

YAML documents are data. They do not grant authority, execute code, install providers, fetch network resources, or provide credentials.
