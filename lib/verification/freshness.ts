import { POLICY } from "./policy";
import type { ClaimField, Source, VerifiedFact } from "./types";

/**
 * RE-VERIFICATION TIMING — shared by the freshness script and the provenance UI
 * so they never disagree. "Verified" must mean verified now: media sources age
 * out after POLICY.staleMediaYears, so a fact can quietly fall below the
 * corroboration bar. This computes when.
 */

const MS_YEAR = 365.25 * 24 * 3600 * 1000;

/** The date a source stops counting toward live corroboration (primaries never). */
export function sourceExpiry(s: Source): Date | null {
  if (s.tier === "primary") return null;
  const base = s.publishedAt ?? s.accessedAt;
  return new Date(new Date(base).getTime() + POLICY.staleMediaYears * MS_YEAR);
}

/** Earliest date `field` drops below the required live-source count. */
function fieldCliff(fact: VerifiedFact, field: ClaimField): Date | null {
  const supporting = fact.sources.filter(
    (s) => s.verified && s.supports.includes(field)
  );
  if (supporting.length < POLICY.minCorroborationPerField) return new Date();
  const expiries = supporting
    .map(sourceExpiry)
    .filter((d): d is Date => d !== null)
    .sort((a, b) => a.getTime() - b.getTime());
  const canLose = supporting.length - POLICY.minCorroborationPerField;
  return expiries[canLose] ?? null; // null => never decays (enough primaries)
}

/** Earliest corroboration cliff across all critical fields, or null if none. */
export function nextReCheck(fact: VerifiedFact): Date | null {
  let soonest: Date | null = null;
  for (const f of POLICY.criticalFields) {
    const c = fieldCliff(fact, f);
    if (c && (!soonest || c < soonest)) soonest = c;
  }
  return soonest;
}
