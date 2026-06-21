/**
 * COPY QA —  npm run qa:copy
 *
 * The verification rigor is the engine, not the pitch. Telling readers, in the
 * marketing voice, that everything is "verified / sourced / proven" is internal
 * positioning leaking into public copy. This sweep flags that language in
 * reader-facing pages and content so it can be rewritten as confident editorial.
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
    for (const { re, note } of BANNED) {
      if (re.test(line)) {
        hits += 1;
        const m = line.match(re)![0];
        console.log(
          `${YELLOW}${file}:${i + 1}${RESET}  ${RED}“${m}”${RESET} ${DIM}(${note})${RESET}`
        );
        break;
      }
    }
  });
}

if (hits > 0) {
  console.log(
    `\n${RED}FAIL${RESET}: ${hits} bit(s) of verification-as-pitch / internal jargon in public copy.\n` +
      `${DIM}Rewrite as confident editorial; keep the "how we verify" vocabulary on /verification.${RESET}\n`
  );
  process.exit(1);
}
console.log(`${GREEN}OK${RESET}: public copy reads as editorial, not internal process.\n`);
