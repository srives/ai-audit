# COGNITIVE-LOAD.md — Measuring What a Repo Loads Into the Model's Attention

This is the method for the cognitive-load axis of the audit. It answers one question with numbers, not vibes: **does the instruction the repo injects into every prompt exceed what the current model can reliably hold — and if so, what should be cut?**

The audit's other axes judge whether rules are *correct*. This axis judges whether they are *in force at all*. A rule can be perfectly written and still be silently ignored because the file it lives in is over budget.

---

## 1. The attention model (why load is measurable, not aesthetic)

Governance quality is usually judged by content. But adherence is also governed by *quantity and position*, through established regularities in how transformer models follow instructions:

- **Density degradation.** Adherence to simultaneously-active instructions declines monotonically as their number rises, reliable only up to a bounded set (empirically on the order of 150–200 directives).
- **Silent omission is the failure mode.** Past the budget, the model does not perform rules *incorrectly* — it *drops* them. The omission is invisible at the moment it happens. This is why overload is dangerous: nothing breaks visibly; rules just quietly stop being in force.
- **Positional asymmetry ("lost in the middle").** Adherence is U-shaped in position: content at the start and end of a file is honored more reliably than the same content in the interior, by a measurable margin, from position alone.
- **Primacy bias.** Under load, earlier instructions are preferentially honored; the model triages toward what it read first.
- **Negation fragility.** Prohibitions ("do not X") are followed less reliably than affirmatives, and the gap widens under load.
- **Self-contradiction blindness.** The model does not reliably notice inconsistency among its own instructions, so duplicated or near-duplicated rules act as latent soft conflicts.
- **Finite budget / signal dilution.** Attention is spread across all loaded tokens; low-signal prose reduces the effective salience of the high-signal rules around it.

The consequence: to know whether governance is actually working, you must **count the directives the model is asked to hold, and where they sit** — not read them for quality alone.

---

## 2. Step 1 — Trace the prompt-loaded closure

The cost is paid on what actually enters the prompt every session, not on what merely sits in the repo. Build that set — the **always-loaded closure**:

1. **Roots** (loaded every session by common agents): `CLAUDE.md`, `CLAUDE.local.md`, `AGENTS.md`, `AGENT.md`, `GEMINI.md`, `.cursorrules`, `.cursor/rules/*.mdc`, `.windsurfrules`, `.clinerules`, `.github/copilot-instructions.md`.
2. **Follow imports transitively.** `CLAUDE.md` supports recursive `@path/file.md` imports (up to several levels deep). Every imported file joins the closure and is loaded every session — resolve the whole graph, not just the root.
3. **Ambient skill/command context.** If the harness injects skill or command descriptions into every prompt, they spend budget too — include them.
4. **Separate the on-demand budget.** Files that load only when invoked — `PR_TOUGH.md`, `RUN_PLAN.md`, `PLAN_RULES.md`, explicitly-called skills — are **not** in the always-loaded budget. Track them as a *second* budget that applies during the task that invokes them, and audit each closure separately.

**Output:** a list of every file in the always-loaded closure, how it's pulled in (root vs `@`-import vs ambient), and the same for each on-demand closure. This traced set — not the four canonical filenames — is what the load analysis runs on.

---

## 3. Step 2 — Count directives (the unit of load)

Line count and byte size are proxies; the real unit is the **directive** — one instruction the model must hold:

- an imperative sentence ("Search before you write.");
- a modal rule (contains MUST / MUST NOT / NEVER / ALWAYS / DO NOT / SHALL / REQUIRED / FORBIDDEN);
- a numbered or bulleted rule that opens with an instruction.

**Not** directives: headings, narrative prose, code blocks, examples, tables of reference data. Count directives per file, and **sum across the whole closure.**

---

## 4. Step 3 — The ceiling (the formula)

Models sustain reliable adherence up to roughly **150–200 simultaneous directives**. The agent harness's own system prompt already consumes about **50** before any repo governance loads. So the usable budget for *repo* governance in the always-loaded closure is approximately:

```
usable budget  ≈  150  −  ~50 (harness)  ≈  ~100 directives   (conservative)
                                            up to ~150 at the optimistic ceiling
```

Judge the closure's **total** directive count against it:

| Total directives (always-loaded closure) | Verdict |
|---|---|
| **≤ ~100** | Within budget. Rules can be held. |
| **~100–150** | At risk. The model begins triaging (primacy bias); later and interior rules degrade toward low-resolution hunches. |
| **> ~150** | **Over budget.** Silent omission is expected — some rules are effectively not in force. |

Worked example: a closure totalling **250 directives** is ~2.5× the reliable budget. Roughly the back half — everything the model reads after it has spent its attention — will be dropped with **no visible error**. "The rule is right there in AGENTS.md" is true and irrelevant; it is loaded but not held.

These constants are **model-generation-specific** — recalibrate them (they live in the audit's config posture, not in the mechanism) as models improve. The *mechanism* — a finite budget, omission under load — is durable.

---

## 5. Step 4 — Position, negation, duplication, signal

Beyond the total, measure the shape of each always-loaded file:

- **Buried gates.** Any critical prohibition (NEVER / MUST NOT / FORBIDDEN) whose first occurrence falls in the **middle third** of a long file sits in the low-attention region — flag it; it should be front-loaded or restated at the end.
- **Negation load.** If prohibitions exceed ~40% of a file's directives, flag it — negations fail disproportionately under load; prefer affirmative phrasing.
- **Duplication.** Near-duplicate directives within or across the closure are latent soft conflicts the model cannot detect — flag each pair.
- **Signal dilution.** A long always-loaded file with a low directive-per-line ratio is mostly prose taxing the budget — flag it; an always-loaded file should be rules, not narrative.

---

## 6. Step 5 — Findings and what to cut

Turn the measurements into graded findings and **concrete cuts** that bring the always-loaded closure back under the usable budget, every remaining line load-bearing:

1. **Progressive disclosure.** Move rules that are only needed for specific tasks out of the always-loaded closure into on-demand files the agent reads *when relevant*. This is the highest-leverage cut — it reduces the standing budget without losing the rule.
2. **Delete stale / irrelevant.** Rules for stacks or platforms this repo doesn't use are pure tax; remove them.
3. **Front-load the gates.** Move the non-negotiable prohibitions to the top (and optionally restate at the end).
4. **Dedupe.** One canonical statement per rule; reference it elsewhere.
5. **Positivize** prohibitions where a rule can be stated as "do X" instead of "never Y".
6. **Cut prose.** An always-loaded file earns its budget with directives, not explanation — move rationale to docs.

Report the closure's total directive count, the budget, the over/under verdict, the per-file shape flags, and the specific cuts that would bring it into budget. That is the cognitive-load section of the findings — the part that says whether the governance is actually being *followed*, not just whether it is *good*.
