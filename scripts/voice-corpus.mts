/**
 * VOICE CORPUS SWEEP (stock phrases) —  npm run voice:corpus
 *
 * The per-piece linter can't see cross-essay repetition, so this sweep counts
 * the configured signature phrases (lib/voice/corpusLint.ts) across ALL
 * reader-facing content and fails when any exceeds its ceiling. Same unit
 * collection as scripts/voice-check.mts:
 *   1. Essays — content/essays/*.mdx prose (imports/JSX tags stripped).
 *   2. Structured copy — the prose fields of the buyers-guides and athlete data,
 *      pulled by importing the modules (not regex-scraping code) so we lint copy,
 *      never source.
 *
 * On top of the phrase sweep, a TEMPLATED META check (findTemplatedMeta) scans
 * the essays' meta copy — dek / emailHook / emailOffer — for verbatim
 * duplication and shared opening moulds, which body-only scanning misses.
 * Findings are WARNINGS, except verbatim email copy duplicated past its gate,
 * which fails the run.
 *
 * Wired into `prebuild` via voice:corpus. Reports only — never rewrites. The
 * canonical spec lives in content/voice/VOICE.md.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { basename, join } from "node:path";
import {
  countAcrossCorpus,
  findTemplatedMeta,
  hasCeilingBreaches,
  hasTemplatedMetaFailures,
  PREFIX_WORDS,
  type CorpusFinding,
  type MetaFieldKind,
  type MetaUnit,
  type TemplatedMetaFinding,
} from "../lib/voice/corpusLint";
import { buyersGuides } from "../data/buyers-guides";
import { athletes } from "../data/athletes";

const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const GREEN = "\x1b[32m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

type Unit = { label: string; text: string };
const units: Unit[] = [];

// 1. Essays — body prose (imports/JSX tags stripped) plus the meta copy
//    fields, each as its own labeled unit ("slug#dek") so cross-essay checks
//    can see exactly where a string lives. The meta block is removed from the
//    body unit so its copy isn't counted twice by the phrase sweep.
//
//    Meta comes from a balanced-brace, string-aware extraction of the
//    `export const meta = {…}` literal (same approach as scripts/link-audit.mts)
//    rather than the stub-loader import trick in scripts/link-graph.mts. The
//    extractor is the sturdier choice here: it tracks quotes/escapes and brace
//    nesting instead of slicing at the first "\n};" (which silently truncates
//    the moment a brace lands flush-left inside a template string or a
//    reformatted nested object), it needs no module-resolution hook or
//    CommonJS stub files on disk, and it doesn't drag the registry's whole
//    import chain into a script that reads the .mdx files directly.
type EssayMeta = {
  title?: string;
  dek?: string;
  tldr?: string;
  kicker?: string;
  emailHook?: string;
  emailOffer?: string;
  image?: { alt?: string };
};

function extractMeta(src: string): { obj: EssayMeta; start: number; end: number } | null {
  const m = /export\s+const\s+meta\s*=\s*/.exec(src);
  if (!m) return null;
  const open = src.indexOf("{", m.index + m[0].length);
  if (open < 0) return null;
  let depth = 0;
  let quote: string | null = null;
  for (let i = open; i < src.length; i++) {
    const ch = src[i];
    if (quote) {
      if (ch === "\\") i++;
      else if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'" || ch === "`") quote = ch;
    else if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        const literal = src.slice(open, i + 1);
        try {
          const obj = new Function(`return (${literal});`)() as EssayMeta;
          return { obj, start: m.index, end: i + 1 };
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

function walkMdx(dir: string, out: string[]) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === "node_modules" || name.startsWith(".")) continue;
      walkMdx(p, out);
    } else if (name.endsWith(".mdx")) {
      out.push(p);
    }
  }
}
const mdxFiles: string[] = [];
walkMdx("content", mdxFiles);

// Meta copy fields fed to the phrase sweep; the subset findTemplatedMeta
// checks for duplication/moulds.
const META_COPY_FIELDS = ["dek", "tldr", "kicker", "emailHook", "emailOffer"] as const;
const TEMPLATED_FIELDS: readonly MetaFieldKind[] = ["dek", "emailHook", "emailOffer"];

const metaUnits: MetaUnit[] = [];
for (const file of mdxFiles) {
  const raw = readFileSync(file, "utf8");
  const slug = basename(file, ".mdx");
  const parsed = extractMeta(raw);
  const withoutMeta = parsed ? raw.slice(0, parsed.start) + raw.slice(parsed.end) : raw;
  const prose = withoutMeta
    .split("\n")
    .filter((l) => !/^\s*import\s/.test(l))
    .join("\n")
    .replace(/<\/?[A-Za-z][^>]*>/g, " "); // drop JSX tags, keep inner text
  units.push({ label: file, text: prose });
  if (!parsed) continue;
  for (const field of META_COPY_FIELDS) {
    const value = parsed.obj[field];
    if (typeof value !== "string" || !value.trim()) continue;
    units.push({ label: `${slug}#${field}`, text: value });
    if ((TEMPLATED_FIELDS as readonly string[]).includes(field)) {
      metaUnits.push({ essay: slug, field: field as MetaFieldKind, text: value });
    }
  }
  // Title and alt text are reader-facing too — keep them in the phrase sweep
  // now that the meta block is cut from the body unit.
  if (typeof parsed.obj.title === "string" && parsed.obj.title.trim()) {
    units.push({ label: `${slug}#title`, text: parsed.obj.title });
  }
  if (typeof parsed.obj.image?.alt === "string" && parsed.obj.image.alt.trim()) {
    units.push({ label: `${slug}#image.alt`, text: parsed.obj.image.alt });
  }
}

// 2. Buyers-guides copy fields.
for (const g of buyersGuides) {
  const base = `data/buyers-guides:${g.slug}`;
  units.push({ label: `${base}#dek`, text: g.dek });
  units.push({ label: `${base}#intro`, text: g.intro });
  units.push({ label: `${base}#counsel`, text: g.counsel });
  g.criteria.forEach((c, i) => units.push({ label: `${base}#criteria[${i}]`, text: c.body }));
  g.tiers.forEach((t, i) => {
    units.push({ label: `${base}#tier[${i}].blurb`, text: t.blurb });
    t.picks.forEach((p, j) => units.push({ label: `${base}#tier[${i}].pick[${j}].why`, text: p.why }));
  });
}

// 3. Athlete copy fields.
for (const a of athletes) {
  const base = `data/athletes:${a.slug}`;
  if (a.summary) units.push({ label: `${base}#summary`, text: a.summary });
  (a.notes ?? []).forEach((n, i) => units.push({ label: `${base}#notes[${i}]`, text: n }));
}

// ── run ──
console.log(`\nVOICE CORPUS — sweeping ${units.length} content unit(s) for stock phrases\n`);

const findings: CorpusFinding[] = countAcrossCorpus(units);

for (const f of findings) {
  const over = f.count > f.maxUses;
  const color = over ? RED : GREEN;
  const status = over ? "OVER" : "ok";
  console.log(`${color}${status}${RESET}  “${f.term}” — ${f.count}/${f.maxUses} use(s)`);
  for (const label of f.locations) {
    console.log(`    ${YELLOW}${label}${RESET}`);
  }
}

// ── templated meta (dek / emailHook / emailOffer) ──
const metaFindings: TemplatedMetaFinding[] = findTemplatedMeta(metaUnits);
const metaWarnings = metaFindings.filter((f) => !f.fails);
const metaFailures = metaFindings.filter((f) => f.fails);

console.log(
  `\nTEMPLATED META — checking ${metaUnits.length} meta unit(s) for duplication and moulds\n`,
);
if (metaFindings.length === 0) {
  console.log(`${GREEN}ok${RESET}  no templated meta copy detected`);
}
for (const f of metaFindings) {
  const color = f.fails ? RED : YELLOW;
  const status = f.fails ? "FAIL" : "WARNING";
  const what =
    f.kind === "verbatim"
      ? "verbatim duplicate"
      : `shared ${PREFIX_WORDS}-word opening`;
  console.log(
    `${color}${status}${RESET}  ${f.field} ${what} across ${f.essays.length} essays — ${DIM}“${f.shared}”${RESET}`,
  );
  for (const essay of f.essays) {
    console.log(`    ${YELLOW}${essay}${RESET}`);
  }
}

// ── verdict ──
console.log("");
const phraseBreach = hasCeilingBreaches(findings);
const metaBreach = hasTemplatedMetaFailures(metaFindings);
if (phraseBreach || metaBreach) {
  const parts: string[] = [];
  if (phraseBreach) {
    const over = findings.filter((f) => f.count > f.maxUses);
    parts.push(`${over.length} phrase(s) over ceiling`);
  }
  if (metaBreach) {
    parts.push(`${metaFailures.length} verbatim email-copy duplicate(s) past the gate`);
  }
  console.log(
    `${RED}FAIL${RESET}: ${parts.join("; ")} across the corpus. ` +
      `${DIM}Spread the signature lines out and rewrite the duplicated meta copy — see content/voice/VOICE.md.${RESET}\n`,
  );
  process.exit(1);
}
console.log(
  `${GREEN}OK${RESET}: no stock phrase exceeds its corpus ceiling; no meta copy past the duplication gate` +
    (metaWarnings.length
      ? ` ${DIM}(${metaWarnings.length} templated-meta warning(s) above — worth spreading out)${RESET}`
      : "") +
    ".\n",
);
