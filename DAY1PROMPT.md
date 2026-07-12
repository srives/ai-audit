# The Day-1 Architectural Prompt

This is the architectural prompt that, if given to an AI assistant at the start of a
complex multi-platform tool, would establish the patterns that most projects pay for
in a painful refactoring arc later. It is written as a literal prompt -- the kind you
would place in a CLAUDE.md or project system prompt before the first line of code.

It was derived from a real project (SessionForge) by working backwards from a v9
architecture refactoring arc that touched 403,423 lines -- more than every prior era
of the product combined. See `CaseStudy.md` for the full story.

---

```
You are building a multi-platform AI session manager called SessionForge. It manages
sessions for several AI coding CLIs (Claude Code, Codex, Copilot, and others to come).
Before writing any code, the following architectural rules are non-negotiable. Every
decision you make must be consistent with them. When in doubt, ask before deviating.

---

RULE 1: PLATFORM REGISTRY IS THE ONLY SOURCE OF TRUTH FOR PLATFORM BEHAVIOR

All platform-specific values -- CLI binary paths, resume/fork command syntax, model
choices, Windows Terminal profile prefix, permission mode flags, background directory
prefix, cost rates -- live in a single $Global:PlatformRegistry hashtable in one file.
No other file may hardcode a platform name, CLI name, WT prefix, or CLI flag as a
string literal. When you need platform-specific behavior, read it from the registry.
When adding a new platform, add one registry entry. Zero other files change.

This rule exists because we will add platforms continuously. If platform logic is
scattered, every new platform is a surgery. If it is in the registry, every new
platform is a data entry.

---

RULE 2: ALL JSON READS AND WRITES GO THROUGH CANONICAL HELPERS

SessionForge owns several JSON data files (session mapping, session names, menu prefs,
cost snapshots, background tracking). Every read on these files goes through
Read-JsonFileSafe. Every write goes through Write-JsonFileAtomic, which writes to a
temp file and renames atomically so a crash mid-write cannot corrupt data.

Never use Get-Content | ConvertFrom-Json on a file SessionForge owns.
Never use Set-Content, Out-File, or [System.IO.File]::WriteAllText on a file
SessionForge owns.

External CLI-owned files (Claude transcripts, Claude settings, platform databases)
may use raw reads, but writes to external config (e.g., Claude's settings.json for
permission mode) must still use an atomic write helper. Document the reason in a
comment at each raw-read site.

---

RULE 3: ALL WINDOWS TERMINAL MUTATIONS GO THROUGH THE WT SERVICE LAYER

Any operation that modifies settings.json -- adding a profile, removing a profile,
renaming a profile, updating a background image path -- must call a function in the
WT service layer (src/wt/service.ps1 or src/wt/profiles.ps1). No file outside the
wt/ namespace may read or write settings.json directly.

The WT service layer must wrap mutations in a transaction: read settings, make the
change in memory, write atomically, validate the result. On any exception, restore
the backup. This is not optional even for "simple" changes. Settings.json corruption
is invisible to users until their terminal breaks.

---

RULE 4: SESSION IDENTITY HAS ONE CANONICAL PRECEDENCE ORDER, ENFORCED IN ONE PLACE

Session display name resolution:
  customTitle  >  trackedName  >  "(unnamed)"

Session-to-WT-profile linkage resolution:
  wtProfileName  >  session-info.json backup link  >  projectPath match

These rules are implemented in exactly one function each. All display code, all repair
code, and all rename code calls those functions. No file infers a session name or
profile link through its own logic. When this rule is violated, sessions display the
wrong name after rename, or sessions steal each other's WT profiles.

---

RULE 5: SOURCE CODE IS ORGANIZED INTO NAMESPACES. EACH NAMESPACE OWNS ITS CONCERNS.

  src/core/        -- global state, persistence helpers, platform registry
  src/session/     -- session lifecycle (launch, fork, continue, attach, rename, delete)
  src/ui/          -- menu rendering, display, navigation
  src/wt/          -- Windows Terminal profile and settings management
  src/integration/ -- external service clients (Jira, GitHub, MCP)
  src/maintenance/ -- CleanSessions operations
  src/testing/     -- all test code (never included in production builds)

A file in ui/ must not implement session lifecycle logic. A file in session/ must not
render menus. A file in wt/ must not know about Jira. When a function is in the wrong
namespace, it creates phantom dependencies: files loading modules they should not need,
and changes in one area breaking unrelated areas silently.

If a function's home is not obvious, it belongs in core/ as a shared helper, not
inline in the first file that needed it.

---

RULE 6: THE BUILD SYSTEM IS MULTI-PRODUCT FROM DAY ONE

Two products are built from this codebase: SessionForge.ps1 (the main tool) and
CleanSessions.ps1 (the maintenance utility). Each product has a .sln1 manifest that
lists the source files to stitch together in order.

When you add a source file: update both .sln1 manifests or document explicitly why
the file belongs to only one product.
When you move a function to a new file: check every product manifest.
When you add a shared helper: put it in core/ and include it in both manifests.

Failure to maintain manifests silently breaks one product while the other works.
This is the class of bug that is hardest to catch because the broken product is
rarely the one being actively tested.

---

RULE 7: EVERY BUG FIX IS PRECEDED BY A FAILING TEST

Before fixing any bug: write a test that reproduces it and fails. Then fix the bug.
Then confirm the test passes. The test is not optional.

This rule exists because bugs fixed without tests return. The regression rate on
unprotected fixes is near 100% over a long enough project lifetime. A test that
explicitly reproduces a bug is documentation that the bug was real, proof that the
fix is correct, and insurance that the fix stays correct.

Tests use string-literal identifiers ("dir/file: TestName"), not sequential numbers.
Sequential numbers require renumbering every time a test is added between existing
ones. String literals survive reordering, refactoring, and obfuscation.

---

RULE 8: EVERY FUNCTION THAT CREATES ARTIFACTS MUST CLEAN THEM UP ON FAILURE

If a function creates a Windows Terminal profile, a background directory, a session
mapping entry, or a pending mapping -- and anything goes wrong before the function
completes -- all created artifacts must be removed in the catch block before rethrowing.

Track artifact creation with boolean flags before creation:
  $profileCreated = $false
  ... create profile ...
  $profileCreated = $true
  ... if exception ...
  if ($profileCreated) { Remove-WTProfile ... }

Artifacts left behind by failed operations accumulate silently. They appear as
"orphaned profiles" in diagnostics. They confuse users. They compound over time.
The only way to prevent accumulation is to clean up at the point of failure.

---

RULE 9: EXTRACT SHARED HELPERS AT THE SECOND INSTANCE, NOT THE THIRD

The first time you write a pattern inline, that is acceptable. The second time you
write the same pattern in a different file, extract it into a shared helper before
writing it a second time. Do not wait for three instances.

The patterns most likely to violate this rule:
- Finding a WT profile by name and updating it
- Resolving the background image path for a session
- Reading and writing a session's pending mapping state
- Formatting a session display name with precedence rules
- Building the git branch + identity + ticket display for a new session

When duplication is allowed to reach three or four instances, the fix requires
touching every instance. When it is caught at two, the fix is cheap.

---

RULE 10: NO EMPTY CATCH BLOCKS. NO SWALLOWED EXCEPTIONS.

Every catch block must either:
  a) Log the exception to the debug log via Write-DebugInfo, or
  b) Re-throw after performing cleanup, or
  c) Return a structured error result that the caller checks

A catch block containing only a comment, a `# ignore`, or nothing at all is a bug.
Swallowed exceptions are invisible failures. They cause functions to return success
when they have failed, data to be silently lost, and users to see wrong state with
no indication that anything went wrong.

---

RULE 11: POWERSHELL 5.1 COMPATIBILITY IS MANDATORY

This tool runs on the user's machine, not a controlled environment. Assume PowerShell
5.1. Specifically:

- Join-Path takes exactly two arguments. Use .Parent.Parent chain for path traversal.
- No null-coalescing operator (??)
- No ternary operator (?:)
- No [array]::Empty<T>()
- No #Requires -Version 6 or higher
- No [System.IO.Path]::Combine() with more than two arguments

PS6+ syntax fails silently or with confusing errors on PS5.1 installations. Test on
PS5.1 before considering any code complete.

---

RULE 12: THE SESSION LIFECYCLE HAS ONE CANONICAL SEQUENCE

Every path that starts a session -- new, fork, continue, attach, started from a Jira
ticket, started from a PR -- follows the same sequence of shared steps:

  1. Resolve platform and model from registry
  2. Resolve or generate session identity (name, title)
  3. Create or reuse the Windows Terminal profile
  4. Create the pending session mapping
  5. Generate visual artifacts (background image, WT profile background)
  6. Launch or resume the CLI process
  7. Resolve the pending mapping to a confirmed mapping
  8. On any exception: remove all artifacts created in steps 3-5

These steps are implemented as shared helper functions called by all launch paths.
No launch path owns its own version of steps 3-5. When these steps are implemented
multiple times, each copy drifts. When one copy gets a fix, the others do not.

---

WHY THESE RULES EXIST

Every rule above addresses a specific class of production bug or a refactoring cost
that compounds over time. None of them are style preferences. The platform registry
rule exists because we shipped a bug where Codex sessions stored "codex" as the model
name. The persistence helper rule exists because we shipped a bug where Claude's
settings.json was corrupted by a non-atomic write. The artifact cleanup rule exists
because we accumulated orphaned WT profiles for months before adding the cleanup path.
The test rule exists because every bug fixed without a test returned.

These rules do not slow development. They slow the first implementation of each
pattern by a few minutes. They prevent the class of incident where a single missing
cleanup call costs two engineering weeks to diagnose and fix six months later.

Hold to them from the first commit.
```

---

## How to Adapt This Prompt for Your Project

The rules above are specific to SessionForge's technology (PowerShell, Windows Terminal,
multi-platform CLI management). The *shape* of each rule is universal:

| Rule | Universal Form |
|------|---------------|
| Platform Registry | All variant behavior for a dimension that will grow lives in one place. No hardcoding. |
| Canonical persistence helpers | All I/O for owned data goes through one layer. Never raw. |
| Service layer for external mutations | External system state is owned by one module. No direct writes from elsewhere. |
| Identity precedence in one place | Any rule with a priority order is implemented once and called everywhere. |
| Namespace ownership | Each concern has a home. Cross-namespace dependencies are explicit and minimal. |
| Multi-product build discipline | If you ship more than one artifact, maintain all manifests on every change. |
| Test before fix | Red-green is not a style. It is the only way bugs stay fixed. |
| Artifact cleanup on failure | Anything created must be destroyable. Track creation. Clean up on catch. |
| Extract at second instance | The third instance is always expensive. The second is cheap. |
| No silent failures | Every caught exception is either logged, rethrown, or returned as a result. |
| Runtime compatibility is fixed | Know your minimum runtime. Never assume the latest. |
| Canonical lifecycle sequence | Any multi-step operation with side effects has one implementation, not N. |

The specific technology changes. The rules do not.
