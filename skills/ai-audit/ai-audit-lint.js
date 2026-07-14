#!/usr/bin/env node
/*
 * ai-audit lint — a deterministic linter for governance compliance.
 * No LLM, no grades. Every rule has a fixed point. Exit code: 0 clean, 1 errors.
 * Zero dependencies (Node built-ins only). Rules are data (ai-audit-lint.rules.json).
 * Tiers: governance (default), code (--code), commands (--commands).
 */
"use strict";
const fs = require("fs");
const path = require("path");
const cp = require("child_process");

// ---------- args ----------
function parseArgs(argv) {
  const a = { files: null, all: false, json: false, stack: null, rules: null, config: null, tiers: new Set(["governance"]), root: process.cwd() };
  for (let i = 2; i < argv.length; i++) {
    const t = argv[i];
    if (t === "--all") a.all = true;
    else if (t === "--json") a.json = true;
    else if (t === "--code") a.tiers.add("code");
    else if (t === "--commands") a.tiers.add("commands");
    else if (t === "--all-tiers") { a.tiers.add("code"); a.tiers.add("commands"); }
    else if (t === "--files") a.files = (argv[++i] || "").split(/[,\s]+/).filter(Boolean);
    else if (t === "--stack") a.stack = argv[++i];
    else if (t === "--rules") a.rules = argv[++i];
    else if (t === "--config") a.config = argv[++i];
    else if (t === "--root") a.root = path.resolve(argv[++i]);
    else if (t === "-h" || t === "--help") { a.help = true; }
  }
  if (!a.files) a.all = true; // default full sweep when no --files
  return a;
}

// ---------- config ----------
const DEFAULT_CONFIG = {
  currentModels: ["Opus 4.8", "Sonnet 5", "Haiku 4.5", "Fable 5"],
  requiredGovernance: ["AGENTS.md"],
  rootPs1Allow: [],
  ownedPaths: [],
  buildCmd: null, testCmd: null, lintCmd: null, formatCmd: null,
  disable: [], promote: [], allow: []
};
// Cognitive-load thresholds. The unit of overload is the DIRECTIVE, not the line:
// adherence degrades as simultaneous instructions rise (practical ceiling ~150-200,
// with ~50 already consumed by the agent harness), overload fails as SILENT OMISSION,
// and mid-file position alone costs 15-30% adherence (attention is U-shaped).
const DEFAULT_FOCUS = {
  directiveWarn: 75, directiveError: 150,
  combinedWarn: 120, combinedError: 200,
  middleMinLines: 150,
  negationRatio: 0.4, negationMinDirectives: 20,
  signalMinPer100: 10, signalMinLines: 150
};
function loadConfig(root, override) {
  const p = override || path.join(root, ".ai-audit.json");
  let cfg = { ...DEFAULT_CONFIG };
  if (fs.existsSync(p)) {
    try { cfg = { ...cfg, ...JSON.parse(fs.readFileSync(p, "utf8")) }; }
    catch (e) { console.error(`ai-audit: bad config ${p}: ${e.message}`); process.exit(2); }
  }
  return cfg;
}

// ---------- fs / glob ----------
const IGNORE = new Set(["node_modules", ".git", "dist", "obj", "bin", ".claude", "coverage"]);
function walk(root) {
  const out = [];
  (function rec(dir) {
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (e.name.startsWith(".git")) continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) { if (!IGNORE.has(e.name)) rec(full); }
      else if (e.isFile()) out.push(path.relative(root, full).split(path.sep).join("/"));
    }
  })(root);
  return out.sort();
}
function globToRe(glob) {
  // supports **, *, {a,b}, literal path segments; matches repo-relative posix path
  let g = glob.replace(/[.+^${}()|[\]\\]/g, (m) => (m === "{" || m === "}" ? m : "\\" + m));
  g = g.replace(/\{([^}]+)\}/g, (_, inner) => "(?:" + inner.split(",").join("|") + ")");
  g = g.replace(/\*\*/g, "").replace(/\*/g, "[^/]*").replace(//g, ".*");
  return new RegExp("^" + g + "$");
}
function matchAny(file, globs) {
  const arr = Array.isArray(globs) ? globs : [globs];
  return arr.some((gl) => globToRe(gl).test(file));
}
const TEXT_EXT = new Set([".md", ".ts", ".js", ".jsx", ".tsx", ".cs", ".java", ".ps1", ".psm1", ".py", ".json", ".yml", ".yaml", ".fs", ".txt", ".cshtml", ".html", ".css"]);
function isText(f) { return TEXT_EXT.has(path.extname(f).toLowerCase()); }
function read(root, f) { try { return fs.readFileSync(path.join(root, f), "utf8"); } catch { return null; } }

// ---------- stack detection ----------
function detectStack(root, files) {
  const s = new Set();
  const has = (re) => files.some((f) => re.test(f));
  if (has(/\.csproj$|\.sln$/)) s.add("dotnet");
  if (has(/(^|\/)package\.json$/)) s.add("js");
  if (has(/\.psm1$|\.ps1$/)) s.add("powershell");
  if (has(/pyproject\.toml$|requirements\.txt$/)) s.add("python");
  return s;
}

// ---------- focus (cognitive-load) analysis ----------
// Always-loaded instruction files pay their attention cost EVERY session; on-demand files don't.
const ALWAYS_LOADED = ["CLAUDE.md", "CLAUDE.local.md", "AGENTS.md", "AGENT.md", "GEMINI.md", ".cursorrules", ".windsurfrules", ".clinerules", ".github/copilot-instructions.md"];
// A "directive" is deterministically defined: a non-heading/non-code/non-table line that
// carries an instruction modal, or a list item opening with an imperative verb.
const DIRECTIVE_RE = /\b(must(?:\s+not)?|never|always|do\s+not|don'?t|shall|forbidden|required|requires?|avoid|may\s+not)\b/i;
const IMPERATIVE_BULLET_RE = /^\s*(?:[-*]|\d+[.)])\s+(?:\*\*)?(do|don'?t|never|always|use|keep|avoid|prefer|run|read|write|add|remove|delete|check|verify|confirm|ask|wait|stop|report|state|name|list|grep|search|test|ensure|treat|mark|include|exclude|follow|obey)\b/i;
const PROHIBITION_RE = /\b(never|must\s+not|do\s+not|don'?t|forbidden|may\s+not)\b/i;
const VAGUE_RES = [/\bbe\s+careful\b/i, /\bbest\s+practices?\b/i, /\bproperly\b/i, /\bappropriately\b/i, /\bhigh[- ]quality\b/i, /\bclean\s+code\b/i, /\bas\s+needed\b/i, /\bwhen\s+appropriate\b/i, /\bcommon\s+sense\b/i, /\bgracefully\b/i, /\bthoughtfully\b/i];

function analyzeFocus(root, file) {
  const t = read(root, file); if (t == null) return null;
  const lines = t.split(/\r?\n/);
  let inFence = false;
  const directives = [], vague = [];
  lines.forEach((raw, i) => {
    if (/^\s*```/.test(raw)) { inFence = !inFence; return; }
    if (inFence || /^\s*(#|\||>)/.test(raw)) return;
    for (const v of VAGUE_RES) { const m = v.exec(raw); if (m) { vague.push({ line: i + 1, term: m[0] }); break; } }
    if (!(DIRECTIVE_RE.test(raw) || IMPERATIVE_BULLET_RE.test(raw))) return;
    directives.push({ line: i + 1, text: raw.trim(), negated: PROHIBITION_RE.test(raw), critical: PROHIBITION_RE.test(raw) });
  });
  return { file, lineCount: lines.length, directives, vague };
}
function alwaysLoadedSet(root, allFiles) {
  const set = new Set(ALWAYS_LOADED.filter((f) => allFiles.includes(f)));
  for (const f of ["CLAUDE.md", "AGENTS.md"]) { // resolve @-imports one level: they load every session too
    const t = read(root, f); if (t == null) continue;
    for (const m of t.matchAll(/@([A-Za-z0-9_./-]+\.md)\b/g)) {
      const p = m[1].replace(/^\.\//, "");
      if (allFiles.includes(p)) set.add(p);
    }
  }
  return [...set];
}
function normDirective(text) {
  return text.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
}

// ---------- frontmatter ----------
function frontmatterKeys(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!m) return null;
  const keys = new Set();
  for (const line of m[1].split(/\r?\n/)) {
    const km = /^([A-Za-z0-9_-]+)\s*:/.exec(line);
    if (km) keys.add(km[1]);
  }
  return keys;
}

// ---------- rule handlers ----------
function lineOf(text, index) { return text.slice(0, index).split(/\r?\n/).length; }
function eachMatch(text, re, cb) {
  const r = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
  let m;
  while ((m = r.exec(text)) !== null) { cb(m); if (m.index === r.lastIndex) r.lastIndex++; }
}

function runRule(rule, root, targetFiles, cfg, opts) {
  const F = [];
  const push = (file, line, msg) => F.push({ rule: rule.id, severity: rule.severity, file, line: line || 1, message: msg || rule.message, fix: rule.fix || "" });
  switch (rule.kind) {
    case "max-lines": {
      for (const f of targetFiles) {
        const t = read(root, f); if (t == null) continue;
        const n = t.split(/\r?\n/).length;
        if (rule.max != null && n > rule.max) push(f, 1, `${n} lines (max ${rule.max})`);
        else if (rule.warn != null && n > rule.warn) F.push({ rule: rule.id, severity: "warn", file: f, line: 1, message: `${n} lines (soft max ${rule.warn})`, fix: rule.fix || "" });
      }
      break;
    }
    case "forbidden-pattern": {
      const re = new RegExp(rule.pattern, rule.flags || "");
      const allowed = rule.allowedFromConfig ? new Set((cfg[rule.allowedFromConfig] || []).map((s) => String(s).toLowerCase().replace(/\s+/g, " ").trim())) : null;
      for (const f of targetFiles) {
        const t = read(root, f); if (t == null) continue;
        eachMatch(t, re, (m) => {
          if (allowed) {
            const tok = (rule.captureGroup != null ? m[rule.captureGroup] : m[0]).toLowerCase().replace(/\s+/g, " ").trim();
            if (allowed.has(tok)) return;
          }
          push(f, lineOf(t, m.index), `${rule.message} — "${m[0].trim().slice(0, 60)}"`);
        });
      }
      break;
    }
    case "required-pattern": {
      if (rule.onlyIfExists && !fs.existsSync(path.join(root, rule.onlyIfExists))) break;
      const re = new RegExp(rule.pattern, rule.flags || "");
      for (const f of targetFiles) {
        const t = read(root, f); if (t == null) continue;
        if (!re.test(t)) push(f, 1, rule.message);
      }
      break;
    }
    case "files-present": {
      for (const want of (cfg[rule.configList] || [])) {
        if (!fs.existsSync(path.join(root, want))) push(want, 1, `${rule.message}: ${want}`);
      }
      break;
    }
    case "frontmatter-fields": {
      for (const f of targetFiles) {
        const t = read(root, f); if (t == null) continue;
        const keys = frontmatterKeys(t); if (!keys) continue; // only typed docs
        for (const req of rule.requiredFields || []) if (!keys.has(req)) push(f, 1, `missing front-matter field: ${req}`);
      }
      break;
    }
    case "referenced-paths-exist": {
      const tokRe = /`([A-Za-z0-9_./-]+\/[A-Za-z0-9_./-]+)`/g;
      for (const f of targetFiles) {
        const t = read(root, f); if (t == null) continue;
        let m;
        while ((m = tokRe.exec(t)) !== null) {
          const p = m[1];
          if (/[<>*?]/.test(p) || p.endsWith("/") || !/\.[a-z0-9]+$/i.test(p)) continue; // conservative: only file-looking paths
          if (!fs.existsSync(path.join(root, p))) push(f, lineOf(t, m.index), `referenced path does not exist: ${p}`);
        }
      }
      break;
    }
    case "count-files": {
      const n = targetFiles.length;
      const limit = rule.nFromConfigLen != null ? (cfg[rule.nFromConfigLen] || []).length : rule.n;
      const ops = { "==": n === limit, "<=": n <= limit, "<": n < limit, ">=": n >= limit, ">": n > limit };
      if (!ops[rule.op]) push(targetFiles[0] || ".", 1, `${n} files (expected ${rule.op} ${limit})`);
      break;
    }
    case "ordering": {
      for (const f of targetFiles) {
        const t = read(root, f); if (t == null) continue;
        const bi = t.search(new RegExp(rule.before)), ai = t.search(new RegExp(rule.after));
        if (bi >= 0 && ai >= 0 && bi > ai) push(f, lineOf(t, ai), `${rule.message}`);
      }
      break;
    }
    case "golden-match": {
      const golden = read(root, rule.goldenFile); if (golden == null) break;
      const gm = new RegExp(rule.startMarker + "([\\s\\S]*?)" + rule.endMarker);
      const gExp = (gm.exec(golden) || [])[1];
      for (const f of targetFiles) {
        const t = read(root, f); if (t == null) continue;
        const got = (gm.exec(t) || [])[1];
        if (got != null && gExp != null && got !== gExp) push(f, 1, `block does not match canonical ${rule.goldenFile}`);
      }
      break;
    }
    case "command-exit-zero": {
      const cmd = cfg[rule.cmdFromConfig]; if (!cmd) break;
      const r = cp.spawnSync(cmd, { cwd: root, shell: true, encoding: "utf8" });
      if (r.status !== 0) push(".", 1, `command failed (exit ${r.status}): ${cmd}`);
      break;
    }
    case "focus-directives": {
      const fc = opts.focus.cfg;
      for (const a of opts.focus.analyses) {
        const n = a.directives.length;
        if (n > fc.directiveError) push(a.file, 1, `${n} directives (max ${fc.directiveError}) — rules past the attention budget are silently omitted, not misapplied`);
        else if (n > fc.directiveWarn) F.push({ rule: rule.id, severity: "warn", file: a.file, line: 1, message: `${n} directives (soft max ${fc.directiveWarn}) — approaching the attention budget`, fix: rule.fix || "" });
      }
      break;
    }
    case "focus-combined": {
      const fc = opts.focus.cfg;
      const total = opts.focus.analyses.reduce((s, a) => s + a.directives.length, 0);
      const names = opts.focus.analyses.map((a) => `${a.file}(${a.directives.length})`).join(" + ");
      if (total > fc.combinedError) push(opts.focus.analyses[0]?.file || ".", 1, `${total} directives across the always-loaded set [${names}] (max ${fc.combinedError}) — the budget applies to the TOTAL the agent must hold, not per file`);
      else if (total > fc.combinedWarn) F.push({ rule: rule.id, severity: "warn", file: opts.focus.analyses[0]?.file || ".", line: 1, message: `${total} directives across the always-loaded set [${names}] (soft max ${fc.combinedWarn})`, fix: rule.fix || "" });
      break;
    }
    case "focus-middle": {
      const fc = opts.focus.cfg;
      for (const a of opts.focus.analyses) {
        if (a.lineCount < fc.middleMinLines) continue;
        const lo = a.lineCount / 3, hi = (2 * a.lineCount) / 3;
        const buried = a.directives.filter((d) => d.critical && d.line > lo && d.line <= hi).slice(0, 5);
        for (const d of buried) push(a.file, d.line, `critical rule buried mid-file, where attention is weakest — "${d.text.slice(0, 60)}"`);
      }
      break;
    }
    case "focus-negation": {
      const fc = opts.focus.cfg;
      for (const a of opts.focus.analyses) {
        const n = a.directives.length; if (n < fc.negationMinDirectives) continue;
        const neg = a.directives.filter((d) => d.negated).length;
        if (neg / n > fc.negationRatio) push(a.file, 1, `${Math.round((neg / n) * 100)}% of ${n} directives are prohibitions — negated rules fail disproportionately under load`);
      }
      break;
    }
    case "focus-dup": {
      const seen = new Map();
      for (const a of opts.focus.analyses) {
        for (const d of a.directives) {
          const k = normDirective(d.text); if (k.length < 20) continue;
          const first = seen.get(k);
          if (first) push(a.file, d.line, `duplicate directive (also at ${first.file}:${first.line}) — copies drift into soft conflicts`);
          else seen.set(k, { file: a.file, line: d.line });
        }
      }
      break;
    }
    case "focus-signal": {
      const fc = opts.focus.cfg;
      for (const a of opts.focus.analyses) {
        if (a.lineCount < fc.signalMinLines) continue;
        const per100 = (a.directives.length / a.lineCount) * 100;
        if (per100 < fc.signalMinPer100) push(a.file, 1, `${a.directives.length} directives in ${a.lineCount} lines — mostly prose; narrative taxes the attention budget without buying behavior`);
      }
      break;
    }
    case "focus-vague": {
      for (const a of opts.focus.analyses) {
        for (const v of a.vague.slice(0, 10)) push(a.file, v.line, `vague rule ("${v.term}") — attention spent, no checkable behavior purchased`);
      }
      break;
    }
    default: console.error(`ai-audit: unknown rule kind "${rule.kind}" (${rule.id})`);
  }
  return F;
}

// ---------- main ----------
function main() {
  const opts = parseArgs(process.argv);
  if (opts.help) { console.log("Usage: lint.js [--all | --files a,b] [--code] [--commands] [--all-tiers] [--stack id] [--json] [--rules p] [--config p] [--root dir]\nTiers: governance checks run by default; --code adds code-pattern rules; --commands runs the configured build/test/lint/format."); process.exit(0); }
  const root = opts.root;
  const cfg = loadConfig(root, opts.config);
  if (Array.isArray(cfg.tiers)) for (const t of cfg.tiers) opts.tiers.add(t);
  const rulesPath = opts.rules || path.join(__dirname, "ai-audit-lint.rules.json");
  let rules;
  try { rules = JSON.parse(fs.readFileSync(rulesPath, "utf8")).rules; }
  catch (e) { console.error(`ai-audit: cannot load rules ${rulesPath}: ${e.message}`); process.exit(2); }

  const allFiles = walk(root);
  const stacks = opts.stack ? new Set([opts.stack]) : detectStack(root, allFiles);
  const scope = opts.all ? allFiles : allFiles.filter((f) => opts.files.map((x) => x.split(path.sep).join("/")).includes(f));

  const disabled = new Set(cfg.disable);
  const promoted = new Set(cfg.promote);
  const focusNeeded = rules.some((r) => String(r.kind).startsWith("focus-") && !disabled.has(r.id) && (!r.tier || opts.tiers.has(r.tier)));
  opts.focus = focusNeeded
    ? { analyses: alwaysLoadedSet(root, allFiles).map((f) => analyzeFocus(root, f)).filter(Boolean), cfg: { ...DEFAULT_FOCUS, ...(cfg.focus || {}) } }
    : null;
  let findings = [];
  for (const rule of rules) {
    if (disabled.has(rule.id)) continue;
    if (rule.tier && !opts.tiers.has(rule.tier)) continue;
    if (rule.appliesTo && rule.appliesTo !== "*" && !rule.appliesTo.some((s) => s === "*" || stacks.has(s))) continue;
    const isFocus = String(rule.kind).startsWith("focus-");
    if (isFocus && !opts.focus) continue;
    const targets = scope.filter((f) => (isText(f) || rule.kind === "count-files" || rule.kind === "files-present") && matchAny(f, rule.target));
    if (targets.length === 0 && !isFocus && !["files-present", "count-files", "command-exit-zero"].includes(rule.kind)) continue;
    findings.push(...runRule(rule, root, targets, cfg, opts));
  }
  // promote warn→error, apply allow-list suppressions
  const allow = new Set((cfg.allow || []).map((a) => `${a.file}|${a.rule}`));
  findings = findings
    .map((x) => (promoted.has(x.rule) ? { ...x, severity: "error" } : x))
    .filter((x) => !allow.has(`${x.file}|${x.rule}`));
  findings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.rule.localeCompare(b.rule));

  const errors = findings.filter((f) => f.severity === "error").length;
  const warns = findings.length - errors;

  if (opts.json) {
    console.log(JSON.stringify({ findings, summary: { errors, warns, files: scope.length } }, null, 2));
  } else {
    for (const f of findings) {
      const loc = `${f.file}:${f.line}`.padEnd(34);
      console.log(`${loc} [${f.severity.padEnd(5)}] ${f.rule.padEnd(20)} ${f.message}${f.fix ? `  (fix: ${f.fix})` : ""}`);
    }
    console.log(`\nai-audit: ${errors} error(s), ${warns} warning(s) across ${scope.length} file(s).`);
  }
  process.exit(errors > 0 ? 1 : 0);
}
main();
