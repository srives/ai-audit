# Markdown bAsIc Rules

Markdown governance documents remain readable Markdown. bAsIc uses a small governed subset of front matter, headings, and markers so typed document reads can preserve prose while exposing stable properties to the compiler/runtime.

## Front Matter

Optional YAML front matter may appear at the top of a Markdown governance document.

Required fields for a typed profile are owned by that profile. Common fields are:

```yaml
type: DONE
profile: basicai.done.v1
ai: CLAUDE
strictness: strict
```

Rules:

- `type` names the typed document family.
- `profile` names the compiler/runtime-known profile contract.
- Reflected identifiers such as `CLAUDE` are AI-pak identifiers, not Markdown keywords.
- Unknown fields are preserved as raw metadata unless the named profile rejects them.

## Headings

Recognized sections are ordinary Markdown headings. A profile may require exact section names. For `basicai.done.v1`, recognized sections are:

- `Criteria`
- `Rules`
- `Review`

Profile matching is case-insensitive and trims surrounding punctuation, but emitted/provenance text preserves the original heading.

## Markers

Profiles may define line markers using bold labels such as:

```md
**AI:** CLAUDE
**Strictness:** strict
```

Markers are profile data, not executable Markdown. Comments, prose, and examples remain text unless a named profile explicitly maps them to typed fields.

## Preservation

The runtime must preserve:

- raw source text;
- source path or artifact identity;
- normalized profile name;
- recognized section content;
- unrecognized sections as raw prose.

Markdown rules never grant file, network, AI, or provider authority. Source `ALLOW` declarations and runtime authority policy still govern effects.
