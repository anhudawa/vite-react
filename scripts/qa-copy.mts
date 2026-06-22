/**
 * COPY QA —  npm run qa:copy
 *
 * The verification rigor is the engine, not the pitch. Telling readers, in the
 * marketing voice, that everything is "verified / sourced / proven" is internal
 * positioning leaking into public copy. This sweep flags that language in
 * reader-facing pages and content so it can be rewritten as confident editorial.
 *
 * It also catches one structural AI-slop tell that pure word-lists miss: the
 * dismissive doubled negation "Not a X, not a Y" used as an opening frame.
 *
 * The dedicated /verification page is the one place this vocabulary belongs, so
 * it's exempt. Code comments are ignored.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const GREEN = "\x1b[32m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

// Structural slop: the dismissive doubled negation "Not a X, not a Y" that
// lists what a thing ISN'T instead of opening on what it IS. This is the exact
// tell that produced the worst line we shipped ("Not a shop, not a sermon").
// Legitimate when it resolves into a positive ("Not X, not Y, BUT Z"), so the
// check below skips any match whose sentence carries a resolver.
const NEGATION_OPENER = /\bnot\s+(?:a|an|the)\b[^.?!\n]{0,80}?,\s*(?:not|nor)\b/i;
const RESOLVER = /\b(?:but|instead|rather|yet)\b/i;

// Phrases that read as "we verify" self-promotion in the public voice.
const BANNED: { re: RegExp; note: string }[] = [
  { re: /it ?isn[’'`]?t a claim/i, note: "verification-as-pitch" },
  { re: /not a claim until/i, note: "verification-as-pitch" },
  { re: /show(s|ing)? (you )?the proof/i, note: "verification-as-pitch" },
  { re: /guilty until/i, note: "verification-as-pitch" },
  { re: /every claim (is )?(sourced|verified|corroborated)/i, note: "verification-as-pitch" },
  { re: /sourced and verified/i, note: "verification-as-pitch" },
  { re: /cleared the gauntlet/i, note: "internal jargon" },
  { re: /the gauntlet/i, note: "internal jargon" },
  { re: /\b\d+\s+verification gates\b/i, note: "internal jargon" },
  { re: /\b8\/8 gates\b/i, note: "internal jargon" },
  { re: /residual error/i, note: "internal jargon" },
];

// Public, reader-facing surfaces. The verification page is the sanctioned home
// for this vocabulary; skip it. Skip CSS and tests.
const ROOTS = ["app", "content", "components"];
const EXEMPT = ["app/verification"];

function walk(dir: string, out: string[]) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === "node_modules" || name.startsWith(".")) continue;
      walk(p, out);
    } else if (/\.(tsx?|mdx)$/.test(name) && !/\.test\.tsx?$/.test(name)) {
      out.push(p);
    }
  }
}

const files: string[] = [];
for (const r of ROOTS) walk(r, files);

let hits = 0;
console.log(`\nCOPY QA — scanning ${files.length} reader-facing files\n`);

for (const file of files) {
  if (EXEMPT.some((e) => file.startsWith(e))) continue;
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    const trimmed = line.trim();
    // Ignore code comments — this is about rendered copy, not source notes.
    if (
      trimmed.startsWith("//") ||
      trimmed.startsWith("*") ||
      trimmed.startsWith("/*") ||
      trimmed.startsWith("{/*")
    )
      return;
    let flagged = false;
    for (const { re, note } of BANNED) {
      if (re.test(line)) {
        hits += 1;
        const m = line.match(re)![0];
        console.log(
          `${YELLOW}${file}:${i + 1}${RESET}  ${RED}“${m}”${RESET} ${DIM}(${note})${RESET}`
        );
        flagged = true;
        break;
      }
    }
    if (flagged) return;
    // Structural slop: unresolved doubled negation on the line.
    const neg = line.match(NEGATION_OPENER);
    if (neg && !RESOLVER.test(line)) {
      hits += 1;
      console.log(
        `${YELLOW}${file}:${i + 1}${RESET}  ${RED}“${neg[0]}…”${RESET} ${DIM}(dismissive doubled negation — open on what it IS)${RESET}`
      );
    }
  });
}

if (hits > 0) {
  console.log(
    `\n${RED}FAIL${RESET}: ${hits} bit(s) of verification-as-pitch, internal jargon, or structural slop in public copy.\n` +
      `${DIM}Rewrite as confident editorial; keep the "how we verify" vocabulary on /verification.${RESET}\n`
  );
  process.exit(1);
}
console.log(`${GREEN}OK${RESET}: public copy reads as editorial, not internal process.\n`);
