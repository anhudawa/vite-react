/**
 * SOURCE PERMANENCE AUDIT —  npm run verify:sources
 *
 * A verified-facts site is only as durable as its evidence. Links rot; brands
 * quietly edit pages. This audit reports, for every PUBLISHED fact, whether each
 * cited source carries an immutable archived copy (a Wayback snapshot) — or is
 * explicitly acknowledged as unarchivable, or is physical evidence with no URL.
 *
 * It is a report, not yet a hard gate: it surfaces exactly which citations still
 * need a permanent capture so they can be fixed before that becomes enforcing.
 */
import { athletes } from "../data/athletes";
import { isPublishable } from "../lib/verification";
import type { Source } from "../lib/verification";

const DIM = "\x1b[2m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

type Status = "archived" | "unarchivable" | "physical" | "missing";

const PHYSICAL_KINDS = new Set(["photo", "video", "document"]);

function classify(s: Source): Status {
  if (s.snapshot && s.snapshot !== "unarchivable") return "archived";
  if (s.snapshot === "unarchivable") return "unarchivable";
  // No archive. Physical evidence (a photo/video/filing) has nothing to rot;
  // a media/official citation with no link is itself a permanence gap.
  if (!s.url) return PHYSICAL_KINDS.has(s.kind) ? "physical" : "missing";
  return "missing"; // has a URL but no permanent capture
}

const facts = athletes.flatMap((a) => a.facts).filter(isPublishable);

let missingTotal = 0;
console.log(`\nSOURCE PERMANENCE — ${facts.length} published fact(s)\n`);

for (const fact of facts) {
  const rows = fact.sources
    .filter((s) => s.verified)
    .map((s) => ({ s, status: classify(s) }));
  const archivable = rows.filter((r) => r.status === "missing" || r.status === "archived");
  const covered = rows.filter((r) => r.status === "archived").length;
  const missing = rows.filter((r) => r.status === "missing").length;
  missingTotal += missing;

  // A fact's permanence rests on having at least two *archived* independent
  // sources — so it survives even if the live web changes underneath it.
  const durable = covered >= 2;
  const head = durable ? `${GREEN}DURABLE${RESET}` : `${YELLOW}THIN${RESET}`;
  console.log(
    `${head}  ${fact.athlete} — ${fact.watch}  ${DIM}` +
      `${covered} archived / ${archivable.length} archivable${RESET}`
  );

  for (const { s, status } of rows) {
    const mark =
      status === "archived"
        ? `${GREEN}✓ archived${RESET}`
        : status === "unarchivable"
          ? `${DIM}— unarchivable${RESET}`
          : status === "physical"
            ? `${DIM}— physical${RESET}`
            : `${RED}✗ needs capture${RESET}`;
    const when =
      s.snapshot && s.snapshot !== "unarchivable" ? ` ${DIM}(${s.snapshot.capturedAt})${RESET}` : "";
    console.log(`    ${mark}${when}  ${s.publisher} ${DIM}· ${s.kind}${RESET}`);
  }
  console.log("");
}

if (missingTotal > 0) {
  console.log(
    `${YELLOW}NOTE${RESET}: ${missingTotal} cited URL(s) lack a permanent archive. ` +
      `Capture them (Wayback Save Page Now) before permanence becomes a hard gate.\n`
  );
} else {
  console.log(`${GREEN}OK${RESET}: every archivable source carries a permanent snapshot.\n`);
}
