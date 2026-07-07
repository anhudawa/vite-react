/**
 * IMAGE RIGHTS AUDIT —  npm run rights:check
 *
 * Walks public/photography, public/brand and public/video and fails (exit 1)
 * if any file on disk lacks a record in the unified ledger (data/rights.ts).
 * Also flags ledger records whose file no longer exists, so the ledger cannot
 * silently rot in either direction.
 *
 * Prints a summary table by status; the "unlicensed-placeholder" count is the
 * pre-launch licensing debt number (see RIGHTS.md). Advisory until launch —
 * deliberately NOT wired into prebuild.
 */
import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { rightsLedger, rightsSummary } from "../data/rights";
import type { RightsStatus } from "../data/rights";

const DIM = "\x1b[2m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const publicDir = join(root, "public");
const MEDIA_DIRS = ["photography", "brand", "video"];

/** All files on disk under the audited dirs, as ledger-style paths. */
function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(relative(publicDir, full).split("\\").join("/"));
  }
  return out;
}

const onDisk = MEDIA_DIRS.flatMap((d) => walk(join(publicDir, d))).sort();
const inLedger = new Set(rightsLedger.map((r) => r.file));

const missing = onDisk.filter((f) => !inLedger.has(f));
const stale = rightsLedger.filter((r) => !onDisk.includes(r.file)).map((r) => r.file);
const duplicates = rightsLedger
  .map((r) => r.file)
  .filter((f, i, all) => all.indexOf(f) !== i);

console.log(`\nIMAGE RIGHTS — ${onDisk.length} file(s) on disk, ${rightsLedger.length} ledger record(s)\n`);

const summary = rightsSummary();
const ORDER: RightsStatus[] = [
  "public-domain",
  "own-work",
  "licensed",
  "unlicensed-placeholder",
  "unknown",
];
const width = Math.max(...ORDER.map((s) => s.length));
for (const status of ORDER) {
  const n = summary[status];
  const colour =
    status === "unlicensed-placeholder" && n > 0
      ? YELLOW
      : status === "unknown" && n > 0
        ? YELLOW
        : n > 0
          ? GREEN
          : DIM;
  console.log(`  ${colour}${status.padEnd(width)}  ${String(n).padStart(3)}${RESET}`);
}
console.log(
  `\n  ${YELLOW}Pre-launch licensing debt: ${summary["unlicensed-placeholder"]} unlicensed-placeholder file(s)${RESET}` +
    `${DIM} — each must be licensed, cleared, or replaced before public launch (RIGHTS.md).${RESET}\n`,
);

let failed = false;
if (missing.length > 0) {
  failed = true;
  console.error(`${RED}✗ ${missing.length} file(s) on disk with NO ledger record in data/rights.ts:${RESET}`);
  for (const f of missing) console.error(`    ${RED}public/${f}${RESET}`);
}
if (stale.length > 0) {
  failed = true;
  console.error(`${RED}✗ ${stale.length} ledger record(s) whose file no longer exists:${RESET}`);
  for (const f of stale) console.error(`    ${RED}public/${f}${RESET}`);
}
if (duplicates.length > 0) {
  failed = true;
  console.error(`${RED}✗ duplicate ledger record(s):${RESET}`);
  for (const f of duplicates) console.error(`    ${RED}public/${f}${RESET}`);
}

if (failed) {
  console.error(`\n${RED}Rights check FAILED — every media file needs an honest ledger record.${RESET}\n`);
  process.exit(1);
}
console.log(`${GREEN}✓ Every file under public/{${MEDIA_DIRS.join(",")}} has a rights record.${RESET}\n`);
