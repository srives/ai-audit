Create compiler-plan-recipe-final.md from compiler-plan-final.md.



&#x20; Work in C:\\repos\\AI-BASIC.



&#x20; Read these files first, in this order:

&#x20; 1. AGENTS.md

&#x20; 2. PLAN\_RULES.md

&#x20; 3. C:\\repos\\Fork\\RECIPE\_RULES.md

&#x20; 4. RUN\_PLAN.md

&#x20; 5. PROF.md

&#x20; 6. specs\\AI-BASIC-SPECS.md

&#x20; 7. specs\\BASICAI\_CLI.md

&#x20; 8. specs\\AI-BASIC-ENGINE.md

&#x20; 9. compiler-plan-final.md



&#x20; Do not use slices-recipe-final.md. It has been deleted because compiler-plan-final.md is now the active master plan.



&#x20; Goal:

&#x20; Turn compiler-plan-final.md into a recipe-ready, deletion-friendly implementation queue named compiler-plan-recipe-final.md.



&#x20; Requirements:

&#x20; - Do not edit compiler source code.

&#x20; - Do not edit compiler-plan-final.md unless absolutely necessary; the output is the new recipe file.

&#x20; - Do not commit.

&#x20; - Preserve the AIR-first milestone boundary.

&#x20; - Keep LLM and ANN/WordNet as later-version tracks, not active implementation slices.

&#x20; - Make the recipe executable under PLAN\_RULES.md and C:\\repos\\Fork\\RECIPE\_RULES.md.

&#x20; - Use strict file order as execution order.

&#x20; - Each implementation unit must be deletable as a whole when complete.

&#x20; - Number active recipe slices sequentially starting from 1.

&#x20; - Do not make broad vague phases. If a compiler-plan-final.md slice is too large, split it into smaller recipe slices.

&#x20; - Each slice must name:

&#x20;   - Source slice from compiler-plan-final.md

&#x20;   - Product class: RECIPE\_COMPILER, RUNTIME\_ORACLE, ENGINE\_PORT, or FUTURE\_SURFACE

&#x20;   - Layer

&#x20;   - Expert path from catalogs\\taxonomy\\5300-language-compiler\\...

&#x20;   - Evidence route: SELF, WORLD, HUMAN, or DEFERRED

&#x20;   - Depends on

&#x20;   - Objective

&#x20;   - Work

&#x20;   - Acceptance

&#x20;   - Verification

&#x20;   - Consumer sweep / search terms where the slice changes a contract



&#x20; Expert routing:

&#x20; Use the 5300 language-compiler taxonomy. For example:

&#x20; - language spec work -> catalogs/taxonomy/5300-language-compiler/10-language-specification/Expert.md

&#x20; - lexer work -> catalogs/taxonomy/5300-language-compiler/20-lexical-analysis/Expert.md

&#x20; - parser/AST work -> catalogs/taxonomy/5300-language-compiler/30-parsing-and-syntax-trees/Expert.md

&#x20; - binder work -> catalogs/taxonomy/5300-language-compiler/40-binding-and-symbol-analysis/Expert.md

&#x20; - type/static semantics -> catalogs/taxonomy/5300-language-compiler/50-type-system-and-static-semantics/Expert.md

&#x20; - IR/lowering -> catalogs/taxonomy/5300-language-compiler/60-ir-and-lowering/Expert.md

&#x20; - emitters -> catalogs/taxonomy/5300-language-compiler/70-target-backends-and-emitters/Expert.md

&#x20; - diagnostics -> catalogs/taxonomy/5300-language-compiler/80-diagnostics-and-error-recovery/Expert.md

&#x20; - conformance/testing -> catalogs/taxonomy/5300-language-compiler/90-conformance-and-property-testing/Expert.md

&#x20; - CLI/AOT -> catalogs/taxonomy/5300-language-compiler/100-cli-packaging-and-aot/Expert.md

&#x20; - governance/orchestration -> catalogs/taxonomy/5300-language-compiler/110-governance-and-ai-orchestration/Expert.md

&#x20; - compatibility/evolution -> catalogs/taxonomy/5300-language-compiler/120-language-evolution-and-compatibility/Expert.md



&#x20; Walking spines:

&#x20; Preserve vertical walking spines from compiler-plan-final.md. They should appear as early as dependencies permit, before broad horizontal buildout. A spine that crosses layers must list every relevant

&#x20; expert.



&#x20; Validation:

&#x20; After writing compiler-plan-recipe-final.md:

&#x20; - run git diff --check -- compiler-plan-recipe-final.md

&#x20; - run .\\doc-lint.ps1 if the new file is covered by doc lint; if not, say so

&#x20; - run targeted searches proving:

&#x20;   - no active LLM/ANN/WordNet implementation slices are in the active queue

&#x20;   - Plan.MODE$ uses the current spec values

&#x20;   - Slice.EVIDENCE$ uses SELF/WORLD/HUMAN/DEFERRED

&#x20;   - Slice.LIVE\_PROOF\_REQUIRED is not resurrected

&#x20;   - old slices-recipe-final.md is not referenced as authority



&#x20; Final report:

&#x20; - State the file created.

&#x20; - Summarize how compiler-plan-final.md was transformed.

&#x20; - List any content intentionally deferred.

&#x20; - List validation commands run and results.



