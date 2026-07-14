Create `<plan>-recipe-final.md` from `<plan>-final.md`.

Work in `<target repo>`.

Read these files first, in this order:

1. `AGENTS.md`
2. `PLAN_RULES.md`
3. The orchestration engine's `RECIPE_RULES.md`
4. `RUN_PLAN.md`
5. `<the project's governing expert/persona document>`
6. `<the project's primary spec files>`
7. `<plan>-final.md`

Do not use `<superseded recipe file>`. It has been deleted because `<plan>-final.md` is now the active master plan.

Goal:

Turn `<plan>-final.md` into a recipe-ready, deletion-friendly implementation queue named `<plan>-recipe-final.md`.

Requirements:

- Do not edit source code.
- Do not edit `<plan>-final.md` unless absolutely necessary; the output is the new recipe file.
- Do not commit.
- Preserve the plan's first-milestone boundary.
- Keep deferred tracks (for example experimental or later-version capabilities) as later-version tracks, not active implementation slices.
- Make the recipe executable under `PLAN_RULES.md` and the orchestration engine's `RECIPE_RULES.md`.
- Use strict file order as execution order.
- Each implementation unit must be deletable as a whole when complete.
- Number active recipe slices sequentially starting from 1.
- Do not make broad vague phases. If a `<plan>-final.md` slice is too large, split it into smaller recipe slices.
- Each slice must name:
  - Source slice from `<plan>-final.md`
  - Product class: `<one of the plan's declared product classes>`
  - Layer
  - Expert path from `catalogs/taxonomy/<stack-id>/...`
  - Evidence route: SELF, WORLD, HUMAN, or DEFERRED
  - Depends on
  - Objective
  - Work
  - Acceptance
  - Verification
  - Consumer sweep / search terms where the slice changes a contract

Expert routing:

Use the installed stack taxonomy. For example, with a language-compiler stack:

- language spec work -> `catalogs/taxonomy/<stack-id>/10-language-specification/Expert.md`
- lexer work -> `catalogs/taxonomy/<stack-id>/20-lexical-analysis/Expert.md`
- parser/AST work -> `catalogs/taxonomy/<stack-id>/30-parsing-and-syntax-trees/Expert.md`
- binder work -> `catalogs/taxonomy/<stack-id>/40-binding-and-symbol-analysis/Expert.md`
- type/static semantics -> `catalogs/taxonomy/<stack-id>/50-type-system-and-static-semantics/Expert.md`
- IR/lowering -> `catalogs/taxonomy/<stack-id>/60-ir-and-lowering/Expert.md`
- emitters -> `catalogs/taxonomy/<stack-id>/70-target-backends-and-emitters/Expert.md`
- diagnostics -> `catalogs/taxonomy/<stack-id>/80-diagnostics-and-error-recovery/Expert.md`
- conformance/testing -> `catalogs/taxonomy/<stack-id>/90-conformance-and-property-testing/Expert.md`
- CLI/AOT -> `catalogs/taxonomy/<stack-id>/100-cli-packaging-and-aot/Expert.md`
- governance/orchestration -> `catalogs/taxonomy/<stack-id>/110-governance-and-ai-orchestration/Expert.md`
- compatibility/evolution -> `catalogs/taxonomy/<stack-id>/120-language-evolution-and-compatibility/Expert.md`

Walking spines:

Preserve vertical walking spines from `<plan>-final.md`. They should appear as early as dependencies permit, before broad horizontal buildout. A spine that crosses layers must list every relevant expert.

Validation:

After writing `<plan>-recipe-final.md`:

- run `git diff --check -- <plan>-recipe-final.md`
- run the repo's doc lint if the new file is covered by it; if not, say so
- run targeted searches proving:
  - no deferred-track implementation slices are in the active queue
  - the plan's mode field uses the current spec values
  - each slice's evidence route uses SELF/WORLD/HUMAN/DEFERRED
  - deprecated slice fields are not resurrected
  - the superseded recipe file is not referenced as authority

Final report:

- State the file created.
- Summarize how `<plan>-final.md` was transformed.
- List any content intentionally deferred.
- List validation commands run and results.
