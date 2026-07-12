# PROF.md

> **Synthesis:** final professor governance from `LANGUAGE_DEVELOPMENT-codex3.md` and `LANGUAGE_DEVELOPMENT-claude3.md`.
>
> **Purpose:** Define the highest-standard engineering rules for implementing AI-BASIC as an industrial-strength F# compiler/interpreter system that can emit structured documents and Flow v1 recipes accepted by the Fork/EngineerForge orchestration engine.
>
> **Authority chain:** This file is governance, not law above the project. `AGENTS.md` wins for agent behavior. `specs/AI-BASIC.md` wins for source-language semantics. Fork production code wins for Flow target behavior. When this document conflicts with those sources, update this document.

## 1. Mandate

AI-BASIC must be built as a compiler, not a string replacer, not a parser that prints JSON, and not an interpreter that happens to emit recipes.

A compiler is a sequence of typed transformations between formal representations:

- source text,
- tokens,
- syntax trees,
- bound semantic trees,
- validated semantic models,
- target-neutral or target-specific IR,
- emitted artifacts,
- optional execution or native binary packaging.

Because AI-BASIC's first serious backend is Fork/EngineerForge Flow v1, the compiler must also think in state machines. Fork recipes are executable graphs. A Flow-targeted compiler is not "writing JSON"; it is lowering AI-BASIC semantics to a valid, deterministic, inspectable state-machine graph.

The standard is:

- strict phase boundaries,
- typed intermediate representations,
- explicit source locations,
- deterministic output,
- useful diagnostics,
- property-based correctness checks,
- live validation against Fork,
- no reliance on revoked documents,
- no approximation when a target cannot represent the source program truthfully.

Accuracy is the currency. Simplicity is the methodology.

## 2. Authority Order

### 2.1 AI-BASIC Project Authority

Within `C:\repos\AI-BASIC`, authority order is:

1. `AGENTS.md`
2. `specs/AI-BASIC.md`
3. `RUN_PLAN.md`
4. `PLAN_RULES.md`
5. `PR_TOUGH.md`
6. `README.md`
7. `DESIGNED_WORK/basic-loop-syntax-claude1.md`
8. sample programs under `samples/`
9. this governance document

`AGENTS.md` wins when agent behavior or repo process is in question. `specs/AI-BASIC.md` is the source-language contract. If compiler behavior and the spec disagree, the compiler is wrong unless the spec is first changed through the project's RFC process.

### 2.2 Fork / EngineerForge Authority

For Flow v1 target behavior, authority order is:

1. Fork production source code in `C:\repos\Fork\src\`.
2. `C:\repos\Fork\RECIPE_PROTOCOL.md`.
3. `C:\repos\Fork\orchestration\RECIPE_AUTHORING_GUIDE.md`.
4. `C:\repos\Fork\RECIPE_RULES.md`.
5. this governance document.

Valid Fork sources:

- `C:\repos\Fork\RECIPE_PROTOCOL.md`
- `C:\repos\Fork\RECIPE_RULES.md`
- `C:\repos\Fork\orchestration\RECIPE_AUTHORING_GUIDE.md`
- `C:\repos\Fork\src\entry\recipe.ps1`
- `C:\repos\Fork\src\integration\orchestration-recipe.ps1`
- `C:\repos\Fork\src\integration\orchestration-adapters.ps1`
- `C:\repos\Fork\src\integration\orchestration-actions.ps1`
- `C:\repos\Fork\src\integration\orchestration-engine.ps1`
- `C:\repos\Fork\src\integration\orchestration-handlers.ps1`
- `C:\repos\Fork\src\integration\orchestration-workers.ps1`
- `C:\repos\Fork\src\recipes\`
- `C:\repos\Fork\src\testing\orchestration\`

The path `C:\repos\Fork\scr\` is not the observed source path. The observed path is `C:\repos\Fork\src\`.

If `RECIPE_PROTOCOL.md` disagrees with runtime behavior, do not hand-patch the markdown. Re-read production code, regenerate the protocol if appropriate, and update the compiler contract deliberately.

### 2.3 Revoked Sources

Never use these as authority:

- `C:\repos\Fork\orchestration\SF_RECIPE_PROTOCOL.md`
- `C:\repos\Fork\orchestration\COMPILER_BUILD_PLAN.md`
- any other `.md` file under `C:\repos\Fork\orchestration\` except `RECIPE_AUTHORING_GUIDE.md`
- deleted, stale, or planning-only orchestration documents not revalidated against production Fork code

If a conclusion came from a revoked source, re-derive it from production Fork code, `RECIPE_PROTOCOL.md`, `RECIPE_AUTHORING_GUIDE.md`, or `RECIPE_RULES.md`.

## 3. Research Basis

Prefer primary sources, university course material, recognized programming-language research, and official F#/.NET documentation over blogs or forum advice. Practical articles may help with ergonomics, but they do not override compiler theory, the AI-BASIC spec, or Fork runtime behavior.

High-signal foundations:

- Cooper and Torczon, *Engineering a Compiler*: compiler complexity, phase design, IR discipline.
- Stanford CS143: lexing, parsing, semantic analysis, IR, code generation.
- Cornell CS4120: IR design, control-flow graphs, data-flow, phase boundaries.
- MIT / CSAIL operational semantics notes: big-step and small-step semantics, preservation reasoning.
- Robert Harper, *Practical Foundations for Programming Languages*: syntax, binding, dynamic/static semantics, type safety.
- Aho, Lam, Sethi, Ullman, *Compilers: Principles, Techniques, and Tools*: lexical analysis, parsing, syntax-directed translation.
- Andrew Appel, *Modern Compiler Implementation in ML*: staged pipelines, ASTs, IR, activation records.
- SICP: interpreter discipline and language implementation habits.
- Vaughan Pratt, *Top Down Operator Precedence*: expression parsing.
- Douglas Crockford's TDOP explanation: practical Pratt parsing reference.
- Damas and Milner: inspiration for constraint solving, not a mandate for full polymorphic inference.
- Don Syme and F# compiler material: discriminated unions, records, pattern matching, typed trees.
- Microsoft F# style and component design guidance.
- FsLexYacc and FParsec documentation: optional implementation tools.
- Expecto and FsCheck / QuickCheck lineage: example tests and property-based tests.
- Xavier Leroy / CompCert: semantic preservation as the correctness ideal.
- John Regehr / Csmith: compiler fuzzing and generated edge-case testing.
- Cerny and Tratt, *Don't Panic! Better, Fewer, Syntax Errors for LR Parsers*: diagnostic quality.
- Microsoft QuickBASIC, GW-BASIC, BASICA references and PCjs-hosted manuals: historical BASIC behavior where intentionally adopted.

No authoritative scholarly source was found for "BASIC compiler in F#." The proper foundation is compiler science plus F# idioms plus BASIC history plus the corrected Fork contract.

## 4. The Three Contracts

AI-BASIC programs cross three independent contracts.

| Layer | Owns | Authority |
|---|---|---|
| Language | syntax, semantics, variables, control flow, type rules, AI primitives, diagnostics | `specs/AI-BASIC.md` |
| Format | JSON / YAML / XML / TOML serialization | `EMIT` directive and CLI target |
| Target schema | Flow v1 fields, adapters, routing, substitutions, graph rules | Fork production code and `RECIPE_PROTOCOL.md` |

Never mix these layers:

- Lexer does not know Flow.
- Parser does not know Flow adapters.
- Binder resolves source names and control-flow references.
- Validator checks AI-BASIC legality and target representability.
- Lowerer maps validated semantics to IR.
- Schema conformance checks target contracts.
- Emitter serializes verified IR.

## 5. Compiler Pipeline

The pipeline is strict left-to-right:

```text
.bas source
    |
    v
[Lexer]
    |
    v
Token stream
    |
    v
[Parser]
    |
    v
Untyped AST
    |
    v
[Binder / Symbol Analysis]
    |
    v
Bound AST + symbol tables + control-flow graph
    |
    v
[Semantic Validator]
    |
    v
Validated AST + diagnostics
    |
    v
[Lowerer]
    |
    v
Document IR / Flow IR / executable IR
    |
    v
[Target Conformance Check]
    |
    v
Verified IR
    |
    v
[Emitter]
    |
    v
JSON / YAML / XML / TOML / native artifact
```

Rules:

- Each stage consumes only the prior stage's public output.
- No stage reaches backward into earlier private state.
- Parser emits AST, not JSON or Flow.
- Binder resolves names and control-flow references, not target text.
- Validator proves legality and representability.
- Lowerer maps source semantics to IR.
- Target conformance checks IR against target rules.
- Emitter serializes verified IR and does not repair bad programs.

Violating these boundaries is a critical architecture defect.

## 6. Stage Interfaces

Compiler functions should have explicit input and output types.

```fsharp
type CompileResult<'T> = Result<'T, Diagnostic list>

val lex : SourceFile -> CompileResult<Token list>
val parse : Token list -> CompileResult<ParsedProgram>
val bind : ParsedProgram -> CompileResult<BoundProgram>
val validate : BoundProgram -> CompileResult<ValidatedProgram>
val lowerToDocument : ValidatedProgram -> CompileResult<DocumentIr>
val lowerToFlow : ValidatedProgram -> CompileResult<FlowIr>
val checkFlowConformance : FlowIr -> CompileResult<VerifiedFlowIr>
val emitJson : VerifiedDocumentIr -> CompileResult<string>
val emitFlowJson : VerifiedFlowIr -> CompileResult<string>
```

The type system should make wrong phase ordering difficult.

## 7. Core Algorithms

Use algorithms deliberately. Name them in plans and code when doing so helps review.

Lexer:

- deterministic scanner or FsLex-generated DFA,
- longest-match rule,
- identifier scanning before case-insensitive keyword classification,
- exact source span tracking: file, line, column, offset, length,
- `REM` rest-of-line handling,
- doubled-quote escape: `""` inside a string literal represents one literal quote character; backslash has no special meaning in string literals,
- line-boundary preservation for BASIC syntax.

Parser:

- recursive descent for program, line, statement, and block structure,
- Pratt parsing or precedence climbing for expressions,
- explicit precedence and associativity table,
- panic-mode recovery at newline, colon, `END IF`, `NEXT`, `WEND`, `RETURN`, and EOF where appropriate,
- FIRST/FOLLOW reasoning for ambiguity,
- no semantic validation during parsing.

Semantic analysis:

- symbol tables for line numbers, labels, variables, dotted names, arrays, artifacts, predefined globals, and reserved primitives,
- control-flow graph construction,
- type constraint collection and small-scale unification where required,
- reachability analysis,
- loop-kind analysis,
- schema-aware section validation.

Lowering:

- document tree construction for structured output,
- Flow state-machine graph construction for Fork targets,
- stable ID generation,
- artifact closure pass,
- default-elision pass,
- source-map propagation.

Emission:

- structured serializers,
- deterministic ordering,
- correct escaping,
- no semantic decisions.

## 8. F# Discipline

### 8.1 Algebraic Data Types

Use records and discriminated unions.

```fsharp
type SourceSpan =
    { File: string
      StartLine: int
      StartColumn: int
      EndLine: int
      EndColumn: int
      Offset: int option
      Length: int option }

type Statement =
    | Let of LetStatement
    | Print of PrintStatement
    | If of IfStatement
    | For of ForStatement
    | Next of NextStatement
    | Goto of GotoStatement
    | Gosub of GosubStatement
    | Return of ReturnStatement
    | Emit of EmitStatement
    | Ai of AiStatement
```

Avoid:

- AST class hierarchies,
- visitor-heavy object models,
- `obj`,
- `Map<string, obj>`,
- generic statement-kind strings,
- raw token bags as syntax nodes,
- JSON fragments as AST nodes.

### 8.2 Immutability

AST nodes are immutable. Do not mutate parsed nodes to add binding or type data. Produce phase-specific representations:

- `ParsedProgram`
- `BoundProgram`
- `ValidatedProgram`
- `DocumentIr`
- `FlowIr`
- `VerifiedFlowIr`

No global mutable compiler state. Pass contexts explicitly.

### 8.3 Exhaustive Matching

Wildcard matches over core AST and IR nodes are forbidden when they hide missing cases.

Bad:

```fsharp
match statement with
| Let x -> validateLet x
| _ -> Ok ()
```

Better:

```fsharp
match statement with
| Let x -> validateLet x
| Print x -> validatePrint x
| If x -> validateIf x
| For x -> validateFor x
| Next x -> validateNext x
| Goto x -> validateGoto x
| Gosub x -> validateGosub x
| Return x -> validateReturn x
| Emit x -> validateEmit x
| Ai x -> validateAi x
```

Adding a syntax case should force every phase to decide what the new case means.

### 8.4 Results, Not Exceptions

Recoverable compiler errors use diagnostics:

```fsharp
type DiagnosticSeverity =
    | Error
    | Warning
    | Info

type Diagnostic =
    { Code: string
      Severity: DiagnosticSeverity
      Span: SourceSpan option
      Message: string
      Help: string option }
```

Exceptions are for host failures and impossible internal conditions, not invalid user programs.

### 8.5 No Partial Functions

These are bugs in compiler-domain code unless statically or locally proven safe:

- `List.head`
- `List.tail`
- `Option.get`
- `Map.find`
- direct indexing such as `xs.[0]`
- unchecked casts

Use pattern matching or safe lookup functions.

### 8.6 No `obj` Or Reflection In Domain Logic

If the compiler needs a generic value, define a discriminated union that lists every legal shape. Reflection is acceptable only in tooling or diagnostics when isolated from hot compiler paths.

## 9. Lexer Governance

The lexer converts source characters into tokens. It must be deterministic, position-aware, and ignorant of higher-level semantics.

Lexer responsibilities:

- track file, line, column, and ideally offset/length,
- preserve source spans,
- classify keywords case-insensitively,
- preserve original lexemes for diagnostics,
- implement longest-match behavior,
- emit EOF,
- represent newlines where grammar needs line sensitivity,
- recognize string literals, numeric literals, identifiers, labels, comments, operators, separators, and dotted identifiers if the spec allows them,
- report invalid characters with useful diagnostics.

Lexer non-responsibilities:

- resolving `GOTO` targets,
- deciding whether variables are declared,
- checking AI primitive legality,
- reading Fork protocol data,
- building JSON or Flow,
- validating graph structure.

Mandatory lexer tests:

- newline handling,
- colon-separated statements,
- `REM` comments,
- keyword case-insensitivity,
- identifiers that contain keyword text,
- string literal boundaries,
- unterminated strings,
- invalid characters,
- EOF behavior,
- token span monotonicity.

## 10. Parser Governance

The parser converts tokens into an untyped AST.

Recommended structure:

- recursive descent for program, line, statement, and block grammar,
- Pratt parsing or precedence climbing for expressions,
- explicit handling for line boundaries and colon-separated statements,
- panic-mode recovery at statement or line boundaries,
- small parser functions named after grammar productions.

Parser responsibilities:

- enforce grammar shape,
- preserve source spans,
- build AST nodes that represent source intent,
- produce useful syntax diagnostics,
- recover enough to report multiple errors where practical.

Parser non-responsibilities:

- binding identifiers,
- type checking,
- checking Flow schema,
- calling Fork,
- serializing output,
- executing code,
- normalizing away source constructs later phases need.

Parser tests:

- every grammar rule has a positive example,
- every grammar rule has a negative example,
- precedence and associativity are tested,
- block and separator errors have diagnostics,
- recovery does not silently invent valid AST.

## 11. Trees And IR

Keep these representations distinct:

- Concrete syntax tree: exact syntactic shape, useful for formatting/editor tooling.
- Untyped AST: simplified program structure after parsing.
- Bound AST: names, labels, line targets, artifact references, and control-flow edges resolved.
- Validated AST: semantics proven legal for the selected target.
- Document IR: target-neutral structured data model.
- Flow IR: typed state-machine representation for Fork recipes.
- Executable IR: future runtime/native compilation representation.
- Emitted artifact: serialized JSON/YAML/XML/TOML or native package.

AI-BASIC v1 does not need a full concrete syntax tree unless formatting/editor features require one. But parser output must retain every source detail needed for diagnostics and semantics.

Tree invariants:

- every syntax node has a source span,
- parent spans cover child spans unless a node is synthesized,
- synthesized nodes are marked,
- bound references point to declarations or carry diagnostics,
- validated AST contains no unresolved names,
- lowered IR contains no source-only constructs,
- emitted artifacts contain no compiler placeholders.

## 12. Binder And Symbol Analysis

The binder assigns meaning to names and control-flow references.

Binder outputs:

- variable table,
- line-number table,
- label table,
- artifact table,
- AI primitive reference table where needed,
- procedure/subroutine table if the language grows that feature,
- control-flow graph edges,
- duplicate declaration diagnostics,
- unresolved reference diagnostics.

Binder responsibilities:

- resolve names,
- resolve labels,
- resolve line targets,
- resolve artifact references,
- detect duplicates,
- detect unresolved references,
- build graph edges for control-flow constructs,
- attach symbol information to a bound representation.

Binder non-responsibilities:

- target serialization,
- Fork validation,
- output format decisions,
- runtime execution.

Duplicate diagnostics should include both the duplicate span and the prior declaration span.

## 13. Type And Semantic Validation

Validation checks whether a bound program is legal AI-BASIC and whether it can be represented by the selected target.

Validator responsibilities:

- type compatibility,
- declaration/use rules,
- read-before-assignment rules where required by the spec,
- legal `GOTO`, `GOSUB`, and `RETURN`,
- balanced `IF`/`END IF`, loops, `FOR`/`NEXT`,
- valid artifact references,
- AI primitive constraints,
- output format representability,
- Flow v1 representability,
- warnings for unreachable or suspicious code where useful.

Type inference:

- Keep it intentionally small unless the spec grows.
- Do not import full Damas-Hindley-Milner complexity without a spec need.
- If inference exists, define constraints explicitly and test them.

A program can lex, parse, and bind successfully while still failing validation. Do not push semantic checks into the parser just to make failures earlier.

## 14. Lowering

Lowering translates validated AI-BASIC meaning into an IR. This is where AI-BASIC semantics meet target semantics.

Lowering rules:

- pure transformation,
- deterministic output,
- deterministic generated IDs,
- no source file reads,
- no parser state,
- no token streams,
- no source reparsing,
- source mappings preserved,
- unsupported target constructs rejected with diagnostics,
- no undocumented Fork behavior.

Expected lowering targets:

- `DocumentIr` for structured data,
- `FlowIr` for Fork recipes,
- future executable/runtime IR.

When targeting Fork, lowering is graph construction. The lowerer must create explicit states, edges, terminal nodes, failure routes, artifact references, and adapter invocations.

Lowerer responsibilities for Flow:

- compute artifact declarations,
- complete the artifact closure pass,
- build Flow state-machine steps from AI-BASIC control flow,
- generate stable Flow identifiers,
- create `next` maps from control flow and adapter outcomes,
- derive `maxVisits` from bounded runtime loops where applicable,
- emit checkpoints only where language semantics or target workflow require resumability,
- enforce deterministic routing before AI judgment,
- preserve source origin on every generated step,
- reject constructs not representable in current Flow v1.

## 15. Flow IR

Flow IR should model the target contract explicitly.

Representative shape:

```fsharp
type FlowId = private FlowId of string

type FlowRecipe =
    { Schema: FlowSchema
      Id: FlowId
      Description: string option
      Action: ActionMeta option
      Inputs: InputDecl list
      Roles: RoleDecl list
      Workspace: WorkspaceDecl
      Artifacts: ArtifactDecl list
      Steps: FlowStep list
      Defaults: FlowDefaults option
      Policies: FlowPolicies option
      TestExpect: TestExpect option
      SourceMap: SourceMap }

type FlowStep =
    { Id: FlowId
      Uses: AdapterId
      With: AdapterInput
      Next: FlowRoute option
      MaxVisits: int option
      Retry: RetryPolicy option
      Span: SourceSpan option }

type IrValue =
    | IrNull
    | IrBool of bool
    | IrInt of int64
    | IrFloat of double
    | IrString of string
    | IrList of IrValue list
    | IrMap of Map<string, IrValue>
```

Flow IR rules:

- IDs are constructed through validation, not arbitrary strings.
- Adapter IDs come from a typed catalog or protocol snapshot.
- Artifact references point to declared artifacts.
- Terminal steps cannot have `next`.
- Non-terminal steps must route somewhere.
- `retry` is allowed only where the target permits it.
- Cycles require explicit bounded visits.
- Role binding should prefer logical roles over hardcoded provider/platform names.
- Artifact closure declares every generated or consumed artifact.

## 16. Fork Contract Snapshot

This snapshot is for orientation only. Verify against valid Fork sources before implementation.

Schema:

```text
engineerforge.flow/v1
```

Flow identifier regex:

```text
^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$
```

Required top-level fields:

```text
schema, id, workspace, artifacts, steps
```

Allowed top-level fields:

```text
schema, id, description, action, inputs, roles, workspace, artifacts, steps, defaults, policies, testExpect
```

Allowed step fields:

```text
id, uses, with, next, maxVisits, retry
```

Known workspace modes:

- `temp`
- `project`
- `existing`

Known leases:

- `none`
- `shared-read`
- `exclusive-write`

Known first-party adapters at the time of prior review:

- `ai.run`
- `core.writeText`
- `core.copyFile`
- `core.assertFile`
- `core.writeHandoff`
- `core.guardPlanRewrite`
- `core.evaluatePlanStatus`
- `core.writeProgressCheckpoint`
- `judge.run`
- `action.run`
- `operator.approval`
- `flow.decision`
- `flow.complete`
- `flow.fail`

Important rules:

- Unknown top-level fields are rejected.
- Unknown step fields are rejected.
- The first step in `steps` is the graph start.
- Terminal adapters such as `flow.complete` and `flow.fail` must not declare `next`.
- Non-terminal steps must declare `next`.
- `retry` is valid only for `ai.run`.
- Artifact references must be declared.
- Unbounded cycles are rejected unless a cycle step declares `maxVisits`.
- Routing tries result-specific keys, then outcome keys, then default routing.

Do not hard-code this forever. Implementation should use a generated protocol snapshot or typed adapter manifest derived from Fork.

## 17. Protocol Snapshot Discipline

Compiler-side conformance checks are useful but not authoritative.

Policy:

- Keep a versioned protocol snapshot for fast local validation.
- Generate it from valid Fork sources, not examples.
- Treat it as early feedback.
- Run Fork's real validator as the final oracle for Flow output.
- When Fork changes, regenerate the snapshot and update tests.

A compiler-side mirror of the Fork validator must never become a competing definition of the contract.

## 18. Schema Conformance

Before emission, Flow IR must pass a conformance pass.

The conformance pass checks:

- schema identifier,
- ID regex,
- known top-level fields,
- known step fields,
- valid workspace mode,
- valid lease,
- declared artifacts,
- terminal/non-terminal routing,
- bounded cycles,
- retry legality,
- adapter input shape where available,
- role references,
- no unsupported Flow fields.

Schema conformance belongs between lowering and emission. It is not a parser responsibility and not an emitter responsibility.

## 19. Emission

Emitters serialize verified IR.

Emitter rules:

- use structured serializers where available,
- escape through the target serializer,
- preserve deterministic ordering,
- do not bind variables,
- do not type-check,
- do not call Fork for semantic decisions,
- do not repair invalid IR,
- do not concatenate complex structured output by hand.

Output-specific rules:

- JSON must parse as JSON.
- YAML must avoid ambiguous scalar surprises where possible.
- XML mapping must explicitly define element/attribute behavior.
- TOML mapping must respect table and array limitations.
- Flow JSON must validate with Fork.

## 20. Structured Output Governance

JSON, YAML, XML, and TOML are not the same target with different punctuation.

Use a target-neutral `DocumentIr`:

- objects/maps,
- arrays,
- strings,
- booleans,
- numbers,
- null/missing where specified,
- comments only if the target supports them,
- source mappings.

Define:

- duplicate key behavior,
- ordering,
- numeric precision,
- missing versus null,
- XML element/attribute mapping,
- TOML table shape,
- string escaping,
- target-specific unsupported constructs.

Do not let JSON silently become the semantic model for every format unless the spec explicitly says so.

## 21. AI-Orchestration Primitive Governance

AI primitives are first-class language constructs, not strings to paste into recipes.

Each primitive needs:

- spec entry,
- typed AST node,
- binder rules,
- validator rules,
- lowering rule,
- diagnostics,
- artifact input/output definition,
- determinism classification,
- target support matrix,
- security/permission behavior.

The compiler must reject a primitive when the selected target cannot represent it truthfully.

## 22. Flow Authoring Rules For AI-BASIC

When AI-BASIC targets Fork:

- emit only fields accepted by the current Flow protocol,
- prefer logical roles over hardcoded platform/model names,
- bind roles in the recipe's `roles` object,
- declare every artifact up front,
- trim AI step `reads` to what each step actually needs,
- use canonical substitution tokens supported by Fork,
- use deterministic routing before AI judgment,
- use `core.evaluatePlanStatus` for machine-readable plan-state decisions,
- route `approve`, `revise`, `unknown`, and `default` deliberately when using plan-status evaluation,
- use `judge.run` only where deterministic checks cannot answer,
- use `core.writeProgressCheckpoint` only after durable semantic progress or where language semantics/target workflow require resumability,
- use `exclusive-write` for writing project workspaces when that lease is valid,
- put `retry` only on `ai.run`,
- ensure every fallible path can reach `flow.fail`,
- do not make an AI judge restate a machine-readable decision already present in an artifact,
- treat plan-file deletion as the completion signal for tag-team style loops where Fork rules require it,
- keep generated recipes readable by operators.

Do not assume every AI-BASIC statement maps to a Fork step. Do not assume every Fork adapter should become source-language syntax.

## 23. BASIC-Specific Governance

BASIC-style syntax carries historical behavior. Implement only what the spec adopts, and test every compatibility claim.

Specify and test:

- line numbers,
- source order versus numeric line order,
- labels,
- colon-separated statements,
- `REM` comments,
- case-insensitive keywords,
- variable suffix conventions if supported,
- arrays and indexing base,
- `GOTO`,
- `GOSUB` and `RETURN` stack behavior,
- `FOR`/`NEXT`,
- `WHILE`/`WEND` if supported,
- `IF`/`THEN`/`ELSE`/`END IF`,
- `ON ... GOTO` and `ON ... GOSUB` if supported,
- `DATA`/`READ` ordering if supported.

Do not claim BASICA, GW-BASIC, QuickBASIC, or Visual Basic compatibility without explicit spec text and tests.

## 24. Semantics Governance

Before interpreter or binary behavior, define the language semantics.

At minimum:

- runtime state,
- variable environment,
- artifact environment,
- program counter or continuation,
- control stack,
- `GOSUB` stack,
- loop stack if needed,
- file/output state,
- error state.

Interpreter semantics should be expressible as:

```text
Step : RuntimeState * Statement -> RuntimeState
```

Compiler semantics should be judged by preservation:

```text
If source program P validates and lowers to target artifact T,
then T preserves the behavior specified for P.
```

Full machine-checked proof is not required for v1. The architecture and tests should still aim toward semantic preservation.

## 25. Interpreter And Native Binary Governance

The project is compile-first, but governance must prepare for interpreter and binary work.

Interpreter rules:

- The interpreter consumes validated AST or runtime IR.
- It uses the same parser/binder/validator pipeline.
- It does not execute parser state.
- It has operational-semantics tests.
- Early interpreter work should avoid AI/git/Fork side effects until host boundaries are specified.

Native binary rules:

- Native packaging comes after the core compiler pipeline works.
- A native backend consumes validated AST or executable IR.
- It does not consume parser cursor state.
- It does not reparse emitted JSON.
- It does not embed secrets.
- It has a documented runtime boundary.
- It preserves diagnostics/source maps where practical.
- It has deterministic version metadata.

.NET Native AOT is an implementation technique, not an architecture.

## 26. Security And Host Boundary

The compiler must not silently transform AI-BASIC into arbitrary host actions.

Rules:

- File access must be explicit in the language and target runtime.
- Shell access must be explicit and heavily constrained.
- Secrets must never be embedded in structured output or native binaries.
- Generated Flow must declare artifacts and workspace behavior through the Fork contract.
- Diagnostics must not leak secrets from source or environment.
- Native execution needs a permission model before broad host interaction.

## 27. Diagnostics

Diagnostics are part of the compiler's public interface.

Every diagnostic should include:

- stable code,
- severity,
- source span when available,
- concise message,
- expected/found details where useful,
- optional help text,
- relevant spec/protocol context when helpful.

Bad:

```text
Syntax error
```

Good:

```text
AB1007: expected THEN after IF condition
  at samples/demo.bas:12:18
  help: write IF condition THEN statement, or use multiline IF ... END IF
```

Diagnostic tests should assert:

- code,
- span,
- severity,
- stable message fragment.

Full prose should not be overfit in tests unless exact wording is a product contract.

## 28. Correctness Strategy

Correctness comes from phase invariants.

Lexer invariants:

- token spans are monotonic,
- invalid characters produce diagnostics,
- EOF is present,
- line/column tracking is correct.

Parser invariants:

- successful parse consumes all tokens except EOF,
- AST spans cover child spans,
- precedence and associativity match the grammar,
- recovery does not silently create valid semantics.

Binder invariants:

- all resolved references point to declarations,
- duplicates produce diagnostics with both spans,
- control-flow targets are checked,
- artifact references are known.

Validator invariants:

- validated AST contains no unresolved names,
- type constraints are satisfied,
- target representability is proven before lowering.

Lowering invariants:

- IR contains no source-language-only constructs,
- generated IDs are deterministic,
- Flow artifacts are declared,
- non-terminal Flow steps route,
- fallible Flow paths can reach failure handling,
- cycles are bounded.

Emitter invariants:

- output parses as the target format,
- output is deterministic,
- escaping is correct,
- no compiler placeholders remain.

## 29. Testing Discipline

Use layered tests. Expecto is the default F# test framework. FsCheck is required for invariants that benefit from generated cases. Fantomas is the canonical F# formatter and should be a CI gate.

Unit tests per phase:

- Lexer tests: every token kind, span edge cases, malformed input.
- Parser tests: every statement positive and negative.
- Binder tests: symbol tables, labels, line numbers, duplicates.
- Validator tests: types, loops, reserved names, target representability, diagnostics.
- Lowering tests: IR shape and source origins.
- Schema conformance tests: mirror Fork validation cases.
- Emitter tests: deterministic output.
- CLI tests: end-to-end compile paths.

High-value FsCheck properties:

- lexer never throws on arbitrary input,
- token spans are monotonic,
- parser never throws on arbitrary input,
- successful parse consumes all tokens except EOF,
- generated valid mini-programs validate,
- generated invalid mini-programs fail with diagnostics,
- validation is idempotent,
- lowering is deterministic,
- emitter output is deterministic,
- default omission is correct,
- emitted JSON parses as JSON,
- generated Flow IDs satisfy protocol regex,
- every Flow artifact reference is declared,
- every non-terminal Flow step routes,
- diagnostic spans stay inside source length,
- round-trip properties where the target supports them.

Golden tests:

- Every important sample should eventually have expected output.
- Compare parsed structures where formatting is not semantic.
- Use byte-for-byte comparison only where deterministic formatting is required.
- Flow goldens must pass Fork validation.
- Golden updates must be intentional and reviewed.

String diff alone is never enough for Flow correctness.

## 30. Fork Differential Testing

Fork is the oracle for Flow acceptance.

Pattern:

1. Compile an AI-BASIC program to Flow JSON.
2. Validate the Flow through the supported Fork validator or recipe entrypoint.
3. Assert validation succeeds.
4. When practical, execute in an isolated workspace.
5. Compare expected artifacts, terminal status, and diagnostics.

Expected command shape, subject to Fork CLI changes:

```powershell
C:\repos\Fork\src\entry\recipe.ps1 --action=lint --recipe-path=<compiled.json> --json
```

If the public entrypoint changes, update governance and tests together.

## 31. Performance And AOT

Performance matters, but it must not outrank correctness in the first slices.

Guidelines:

- Keep phases independently testable.
- Avoid unnecessary reparsing.
- Avoid reflection in hot paths.
- Keep data structures immutable unless measurement proves a bottleneck.
- Use deterministic ordering without excessive sorting in inner loops.
- Add benchmarks after the pipeline exists.

Fast startup and Native AOT are valid goals for `basicai`, but the first milestone is correctness and a small working compiler.

Expected publish commands:

```powershell
dotnet publish src/Basicai.Cli -c Release -r win-x64 -p:PublishAot=true
dotnet publish src/Basicai.Cli -c Release -r linux-x64 -p:PublishAot=true
dotnet publish src/Basicai.Cli -c Release -r osx-arm64 -p:PublishAot=true
```

## 32. Milestones

Milestone 1: minimal compiler:

1. `basicai compile foo.bas --target json`.
2. Source file loading.
3. Lexer with spans.
4. Parser for a small spec-backed subset.
5. AST with source locations.
6. Binder for labels and variables needed by that subset.
7. Validator for that subset.
8. Document IR or Flow IR lowering.
9. Deterministic JSON emission.
10. Tests for every phase.
11. One real sample, such as `samples/tag-team-run-plan.bas`, compiles and passes Fork validation when targeting Flow.

Milestone 2: small interpreter:

1. Non-orchestration BASIC subset: `LET`, `PRINT`, expressions, `IF`, `GOTO`, `GOSUB`, `RETURN`, `FOR`, `END`.
2. Same parser/AST/binder/validator pipeline.
3. Operational-semantics step tests.
4. No AI/git/Fork side effects yet.

Milestone 3: richer Flow compiler:

1. More AI-BASIC primitives.
2. Checkpoint/slice lowering only where specified.
3. Plan-status deterministic/fallback pattern.
4. Golden tests and Fork differential validation.
5. Artifact closure and role binding.
6. Schema snapshot generation.

Milestone 4: additional document targets:

1. YAML/XML/TOML through `DocumentIr`.
2. More property tests.
3. CLI polish and diagnostics.
4. Performance measurement.

Milestone 5: executable design:

1. `exe-generator` design.
2. `exe-executor` design.
3. Runtime adapter and permission model before implementation.

## 33. Build And Verification Commands

Repo commands:

```powershell
dotnet build
dotnet test
dotnet fantomas src tests --check
dotnet fantomas src tests
dotnet run --project src/Basicai.Cli -- compile samples/tag-team-run-plan.bas --target json
```

Protocol snapshot command, if still supported by Fork:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File C:\repos\Fork\tools\dump-flow-v1-protocol.ps1 -Json > resources/protocol-snapshot.json
```

Fork validation command shape:

```powershell
C:\repos\Fork\src\entry\recipe.ps1 --action=lint --recipe-path=<compiled.json> --json
```

Native AOT publish:

```powershell
dotnet publish src/Basicai.Cli -c Release -r win-x64 -p:PublishAot=true
dotnet publish src/Basicai.Cli -c Release -r linux-x64 -p:PublishAot=true
dotnet publish src/Basicai.Cli -c Release -r osx-arm64 -p:PublishAot=true
```

## 34. Review Checklist

Before accepting a language implementation change:

- Which phase changed, and did phase boundaries remain intact?
- Is the feature described in `specs/AI-BASIC.md`?
- If the spec changed, was the RFC process followed?
- Did new AST/IR nodes get source locations?
- Are source spans preserved?
- Is the AST typed and explicit?
- Are symbol consumers updated?
- Are target limitations checked before emission?
- Are diagnostics stable and useful?
- Did every parser rule get positive and negative tests?
- Did semantic rules get validator tests?
- Are property tests added where appropriate?
- Does Flow output pass Fork validation?
- Are all artifacts declared?
- Are all failure routes reachable or intentionally impossible?
- Are AST/IR matches exhaustive?
- Are partial functions avoided?
- Is output deterministic?
- Did any protocol change update the protocol snapshot and trigger a consumer sweep?
- Does the change avoid revoked documents?

## 35. Anti-Patterns

Reject these in review:

| Anti-pattern | Why bad | Correct approach |
|---|---|---|
| Citing `SF_RECIPE_PROTOCOL.md` | revoked and stale | use Fork source plus `RECIPE_PROTOCOL.md` |
| Citing `COMPILER_BUILD_PLAN.md` | deleted/stale planning source | use current valid docs and code |
| Parser emits JSON | phase violation | parser emits AST |
| Parser knows Fork adapters | phase violation | lowerer/schema pass know Flow |
| Validator reads tokens | phase violation | validator reads bound AST |
| Emitter parses source | phase violation | emitter serializes verified IR |
| AST stores raw token stream | leaks parser internals | store domain values and spans |
| Generic strings for syntax | invalid states easy | use discriminated unions |
| `_` in AST/IR walkers | hides missing cases | match explicitly |
| `Option.get` or `List.head` | crashes on bad input | pattern match |
| One giant `compile` function | untestable | compose phases |
| Mutating AST for type info | breaks phase separation | produce bound/validated trees |
| Reimplementing Fork validator as final authority | drifts | local conformance plus Fork oracle |
| Unsupported Flow fields | runtime rejection | lower to supported IR or reject |
| `retry` on non-`ai.run` | runtime rejection | enforce target rule |
| `exclusive` lease | retired/invalid | use `exclusive-write` if valid |
| AI judge before deterministic checks | expensive and fragile | deterministic routing first |
| Format logic in lowerer | couples semantics to serialization | lower to IR, emit per target |
| Golden-only correctness | misses semantic bugs | combine goldens with structural/property tests |
| Exposing every Fork adapter as syntax | language bloat | expose spec-backed primitives only |
| Spec feature ignored because inconvenient | violates contract | implement or formally defer via RFC |
| Feature in code not in spec | unspecified behavior | update spec first |

## 36. Rejected, Constrained, Or Deferred Ideas

This section keeps rejected material visible because bad ideas are useful warnings.

### 36.1 Rejected Ideas

- **Persona claims as authority.** Rejected. A "professor" framing is useful only as an engineering standard; authority comes from sources, code, and contracts.
- **Using `SF_RECIPE_PROTOCOL.md`.** Rejected because the user explicitly revoked it and the corrected source chain replaced it.
- **Using `COMPILER_BUILD_PLAN.md`.** Rejected because the user said it was deleted/false and it is not valid authority.
- **Parser-to-Flow direct generation.** Rejected because it collapses syntax and target semantics.
- **Emitter-side semantic repair.** Rejected because invalid source programs must fail before emission.
- **Golden files as the only correctness oracle.** Rejected because byte comparison misses semantic invalidity and target-contract drift.
- **Full Damas-Hindley-Milner Algorithm W as a default requirement.** Rejected as premature unless the spec requires polymorphic inference.
- **Treating Flow checkpoints as automatic semantics of an AI-BASIC `SLICE`.** Rejected unless `specs/AI-BASIC.md` defines `SLICE` semantics.
- **Exposing every Fork adapter as an AI-BASIC primitive.** Rejected because target mechanics should not automatically become source-language syntax.
- **Making this document canonical above `AGENTS.md`, the spec, or Fork code.** Rejected because governance must remain subordinate to actual project contracts.

### 36.2 Constrained Ideas

- **"`RECIPE_PROTOCOL.md` is the single source of truth."** Constrained. It is the canonical generated protocol document, but Fork production code is final when code and docs disagree.
- **"Flow v1 emitter is the backend."** Constrained. Flow is the first serious orchestration backend, but AI-BASIC also has structured output targets and future executable work. Keep IR families separate.
- **"Compiler-side schema validator mirrors Fork."** Constrained. Local conformance checks are useful for fast feedback; Fork's validator remains the oracle.
- **"Every sample needs byte-for-byte golden JSON."** Constrained. Byte goldens are useful where deterministic formatting matters. Structural comparisons are better when formatting is not semantic.
- **"Emit checkpoints after every major semantic boundary."** Constrained. Checkpoints are useful for resumability, but emit them only when justified by AI-BASIC semantics or target workflow.
- **"No wildcard matches anywhere."** Constrained. Wildcards are forbidden in core AST/IR walkers where they hide missing cases. They can be acceptable in local, closed, non-domain matches when context makes them safe.
- **"Protocol snapshot cannot drift."** Constrained. Generated docs reduce drift but are not magic. Regenerate and revalidate when Fork changes.
- **"Performance target first."** Constrained. Performance and AOT matter, but first slices prioritize correctness, diagnostics, and architecture.
- **"AI-BASIC lowerer should always use `core.evaluatePlanStatus` before `judge.run`."** Constrained. This is mandatory for plan-status patterns where the decision is machine-readable. It is not a universal replacement for judgment steps.
- **"`exclusive-write` should always be used."** Constrained. Use it for writing project workspaces when the current protocol and workflow require it, not as a blind default.

### 36.3 Deferred Ideas

- **Production recipe decompile/recompile round-trip.** Deferred until a decompiler exists and Flow IR is stable.
- **Native executable backend for AI-BASIC programs.** Deferred until semantics and IR contracts are stable.
- **Full concrete syntax tree for formatter/editor tooling.** Deferred unless tooling requires it.
- **Advanced optimization passes.** Deferred until correctness and target conformance are established.
- **Broad BASIC compatibility matrix.** Deferred until `specs/AI-BASIC.md` explicitly chooses which dialect behaviors matter.
- **Full runtime adapter system for executable AI-BASIC programs.** Deferred until interpreter semantics and host security policy are written.

## 37. Merge Rationale

This document preserves the useful substance from both round-three drafts:

- `codex3` supplied the broader final structure, explicit rejected/constrained/deferred ledger, structured output governance, Flow IR discipline, protocol snapshot discipline, and detailed Fork snapshot.
- `claude3` supplied the sharper authority hierarchy, professor-style mandate, core algorithm section, SICP/Cerny-Tratt/Cooper-Torczon research additions, artifact closure emphasis, deterministic-routing-first rule, milestone split for interpreter and executable work, and stronger review checklist.
- Similar compiler pipeline, F# discipline, lexer/parser/binder/validator/lowering/emitter guidance was merged rather than duplicated.
- Flow-specific guidance was retained but constrained so Fork mechanics do not leak directly into source-language semantics.
- Aggressive or overbroad claims were preserved in the rejected/constrained section so future agents can see what not to do.

## 38. Operating Principle

Build AI-BASIC as a typed F# compiler from the first line: source to tokens, tokens to AST, AST to bound and validated semantics, semantics to IR, IR to deterministic artifacts, and Flow artifacts validated by Fork.

A future compiler engineer should be able to open the codebase and immediately identify:

- tokens,
- untyped AST,
- binder,
- validator,
- IR families,
- emitters,
- diagnostics,
- schema conformance checks,
- Fork differential tests,
- and executable/interpreter boundaries.

If those responsibilities are mixed together, the implementation is not merely messy; it is scientifically weaker. Trust the spec for the source language. Trust Fork production code for the target contract. Reject anything that cannot be represented truthfully.
