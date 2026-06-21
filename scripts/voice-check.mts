/**
 * VOICE CHECK (content sweep) —  npm run voice:check
 *
 * Runs the voice guardrail over the repo's reader-facing CONTENT, so off-voice
 * copy can't ship. Two sources:
 *   1. Essays — content/essays/*.mdx prose (imports/JSX tags stripped).
 *   2. Structured copy — the prose fields of the buyers-guides and athlete data,
 *      pulled by importing the modules (not regex-scraping code) so we lint copy,
 *      never source.
 *
 * Wired into `prebuild`. Errors (banned words/openers/hooks) fail the build;
 * structural tells are advisory unless you pass --strict. Reports only — never
 * rewrites. The canonical spec lives in content/voice/VOICE.md.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { lintVoice, type VoiceFinding } from "../lib/voice/voiceLint";
import { buyersGuides } from "../data/buyers-guides";
import { athletes } from "../data/athletes";

const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const GREEN = "\x1b[32m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

const strict = process.argv.includes("--strict");

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
let errors = 0;
let warnings = 0;
console.log(`\nVOICE CHECK — scanning ${units.length} content unit(s)\n`);

for (const { label, text } of units) {
  const findings: VoiceFinding[] = lintVoice(text);
  for (const f of findings) {
    if (f.severity === "error") errors++;
    else warnings++;
    const color = f.severity === "error" ? RED : YELLOW;
    console.log(
      `${YELLOW}${label}${RESET}  ${color}${f.rule}${RESET} ${f.message}\n    ${DIM}“${f.excerpt}”${RESET}`,
    );
  }
}

const fail = errors > 0 || (strict && warnings > 0);
console.log("");
if (fail) {
  console.log(
    `${RED}FAIL${RESET}: ${errors} error(s), ${warnings} warning(s) across content. ` +
      `${DIM}Rewrite to voice — see content/voice/VOICE.md.${RESET}\n`,
  );
  process.exit(1);
}
console.log(
  `${GREEN}OK${RESET}: content reads on-voice` +
    (warnings ? ` ${DIM}(${warnings} advisory warning(s))${RESET}` : "") +
    ".\n",
);
