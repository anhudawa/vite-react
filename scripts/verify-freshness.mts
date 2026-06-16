/**
 * RE-VERIFICATION FORECAST —  npm run verify:freshness
 *
 * "Verified" has to mean verified *now*. Relationships end, watches get sold, and
 * the staleness policy stops counting old media after POLICY.staleMediaYears. A
 * fact can therefore pass today and silently fall below the corroboration bar as
 * its sources age out.
 *
 * This forecasts that decay: for each published fact it reports how long since an
 * editor last re-checked it, and the earliest date a critical field will drop
 * below the required number of live sources. Run it on a schedule (e.g. monthly)
 * to drive the re-verification queue.
 */
import { athletes } from "../data/athletes";
import { isPublishable, POLICY } from "../lib/verification";
import type { ClaimField, VerifiedFact } from "../lib/verification";

const DIM = "\x1b[2m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

const NOW = new Date();
const MS_YEAR = 365.25 * 24 * 3600 * 1000;

/** The date a media source stops counting toward live corroboration. Primary
 *  records never expire (a filing or dated photograph doesn't drift). */
function expiryOf(s: VerifiedFact["sources"][number]): Date | null {
  if (s.tier === "primary") return null;
  const base = s.publishedAt ?? s.accessedAt;
  return new Date(new Date(base).getTime() + POLICY.staleMediaYears * MS_YEAR);
}

/** Earliest date `field` falls below the required live-source count. */
function fieldCliff(fact: VerifiedFact, field: ClaimField): Date | null {
  const expiries = fact.sources
    .filter((s) => s.verified && s.supports.includes(field))
    .map(expiryOf)
    .filter((d): d is Date => d !== null)
    .sort((a, b) => a.getTime() - b.getTime());
  const live = fact.sources.filter(
    (s) => s.verified && s.supports.includes(field)
  ).length;
  if (live < POLICY.minCorroborationPerField) return NOW; // already thin
  // After this many media sources expire, we cross below the threshold.
  const canLose = live - POLICY.minCorroborationPerField;
  return expiries[canLose] ?? null; // null => never decays (enough primaries)
}

function monthsBetween(a: Date, b: Date): number {
  return (b.getTime() - a.getTime()) / (MS_YEAR / 12);
}

const facts = athletes.flatMap((a) => a.facts).filter(isPublishable);
console.log(`\nRE-VERIFICATION FORECAST — ${facts.length} published fact(s)\n`);

let due = 0;
for (const fact of facts) {
  const reviewed = fact.review.approvedAt ? new Date(fact.review.approvedAt) : null;
  const ageMonths = reviewed ? monthsBetween(reviewed, NOW) : Infinity;

  // Earliest cliff across all critical fields.
  let soonest: Date | null = null;
  for (const f of POLICY.criticalFields) {
    const c = fieldCliff(fact, f);
    if (c && (!soonest || c < soonest)) soonest = c;
  }
  const monthsToCliff = soonest ? monthsBetween(NOW, soonest) : Infinity;

  // Due for re-check if not reviewed in 12 months, or a cliff is under 12 away.
  const dueNow = ageMonths > 12 || monthsToCliff < 12;
  if (dueNow) due++;

  const head = dueNow ? `${YELLOW}RE-CHECK${RESET}` : `${GREEN}FRESH${RESET}`;
  const cliffStr = soonest
    ? monthsToCliff <= 0
      ? `${RED}below bar now${RESET}`
      : `corroboration cliff in ~${monthsToCliff.toFixed(0)} mo (${soonest
          .toISOString()
          .slice(0, 10)})`
    : `${DIM}no decay (primary-backed)${RESET}`;
  console.log(`${head}  ${fact.athlete} — ${fact.watch}`);
  console.log(
    `  ${DIM}last reviewed ${
      reviewed ? reviewed.toISOString().slice(0, 10) : "never"
    } (~${ageMonths === Infinity ? "—" : ageMonths.toFixed(0)} mo ago) · ${cliffStr}${DIM}${RESET}\n`
  );
}

console.log(
  due > 0
    ? `${YELLOW}${due} fact(s) due for re-verification.${RESET}\n`
    : `${GREEN}OK${RESET}: all published facts are current.\n`
);
