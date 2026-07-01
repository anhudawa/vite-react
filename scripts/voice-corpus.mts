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
 * NOT wired into `prebuild` — this is an editorial ratchet, run on demand.
 * Reports only — never rewrites. The canonical spec lives in
 * content/voice/VOICE.md.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  countAcrossCorpus,
  hasCeilingBreaches,
  type CorpusFinding,
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

// 1. Essays — strip import lines and JSX tags, keep prose + meta copy (dek,
//    emailHook/emailOffer, alt text are all reader-facing and worth checking).
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
for (const file of mdxFiles) {
  const raw = readFileSync(file, "utf8");
  const prose = raw
    .split("\n")
    .filter((l) => !/^\s*import\s/.test(l))
    .join("\n")
    .replace(/<\/?[A-Za-z][^>]*>/g, " "); // drop JSX tags, keep inner text
  units.push({ label: file, text: prose });
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

console.log("");
if (hasCeilingBreaches(findings)) {
  const over = findings.filter((f) => f.count > f.maxUses);
  console.log(
    `${RED}FAIL${RESET}: ${over.length} phrase(s) over ceiling across the corpus. ` +
      `${DIM}Spread the signature lines out — see content/voice/VOICE.md.${RESET}\n`,
  );
  process.exit(1);
}
console.log(`${GREEN}OK${RESET}: no stock phrase exceeds its corpus ceiling.\n`);
