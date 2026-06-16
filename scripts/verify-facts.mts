/**
 * Standalone verification gate — run in CI and locally:  npm run verify:facts
 *
 * Loads every fact and runs the full gauntlet, prints an auditable report, and
 * exits non-zero if any fact marked "published" failed. This is the same logic
 * the site enforces at build time; here it is human-readable.
 */
import { athletes } from "../data/athletes";
import { verifyFact, GATES, type VerifiedFact } from "../lib/verification";

const all: VerifiedFact[] = athletes.flatMap((a) => a.facts);

const DIM = "\x1b[2m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

let failedPublished = 0;

console.log(`\nESCAPEMENT — fact verification (${GATES.length} gates)\n`);

for (const fact of all) {
  const report = verifyFact(fact);
  const passed = report.gates.filter((g) => g.pass).length;
  const head =
    fact.status === "published"
      ? report.publishable
        ? `${GREEN}PUBLISHED ✓${RESET}`
        : `${RED}PUBLISHED ✗ (INVALID)${RESET}`
      : `${YELLOW}${fact.status.toUpperCase()} (held)${RESET}`;

  console.log(`${head}  ${fact.athlete} — ${fact.watch}  ${DIM}[${fact.id}]${RESET}`);
  console.log(
    `  ${passed}/${GATES.length} gates · computed ${report.computedConfidence} · ` +
      `residual ~${report.residualErrorEstimate.toExponential(1)}`
  );
  for (const g of report.gates) {
    const mark = g.pass ? `${GREEN}✓${RESET}` : `${RED}✗${RESET}`;
    console.log(`    ${mark} ${g.label}${DIM} — ${g.detail}${RESET}`);
  }
  console.log("");

  if (fact.status === "published" && !report.publishable) failedPublished++;
}

if (failedPublished > 0) {
  console.error(
    `${RED}FAIL${RESET}: ${failedPublished} fact(s) marked "published" did not clear the gauntlet.\n`
  );
  process.exit(1);
}

console.log(`${GREEN}OK${RESET}: every published fact cleared all ${GATES.length} gates.\n`);
