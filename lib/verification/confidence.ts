import type { Confidence, Source, VerifiedFact } from "./types";
import { POLICY } from "./policy";

const CONFIDENCE_RANK: Record<Confidence, number> = { Low: 1, Medium: 2, High: 3 };

export function rankConfidence(c: Confidence): number {
  return CONFIDENCE_RANK[c];
}

/** Distinct independent sources: collapse any that declare each other as not
 *  independent (same owner / syndication / a party reporting on itself). */
export function independentSources(sources: Source[]): Source[] {
  const kept: Source[] = [];
  for (const s of sources) {
    if (!s.verified) continue;
    const clashes = kept.some(
      (k) =>
        k.publisher === s.publisher ||
        k.notIndependentOf?.includes(s.id) ||
        s.notIndependentOf?.includes(k.id)
    );
    if (!clashes) kept.push(s);
  }
  return kept;
}

function yearsSince(iso?: string): number {
  if (!iso) return Infinity;
  return (Date.now() - new Date(iso).getTime()) / (365.25 * 24 * 3600 * 1000);
}

/** Sources that still count as live corroboration (primary records never go
 *  stale; media reporting does). */
export function liveSources(sources: Source[]): Source[] {
  return sources.filter((s) => {
    if (!s.verified) return false;
    if (s.tier === "primary") return true;
    return yearsSince(s.publishedAt) <= POLICY.staleMediaYears;
  });
}

/**
 * Compute confidence from the evidence, independent of whatever the author
 * *claimed*. A fact is only as strong as: how many independent live sources back
 * it, whether at least one is primary, and whether direct visual evidence (a
 * dated, located photo/video) exists.
 */
export function computeConfidence(fact: VerifiedFact): Confidence {
  const live = liveSources(fact.sources);
  const independent = independentSources(live);
  const hasPrimary = independent.some((s) => s.tier === "primary");
  const hasVisual = independent.some((s) => s.kind === "photo" || s.kind === "video");
  const n = independent.length;

  let score = 0;
  score += Math.min(n, 4) * 0.2; // breadth, capped
  if (hasPrimary) score += 0.25;
  if (hasVisual) score += 0.2;
  if (fact.review.disconfirmingSearch && fact.review.contradictionsFound.length === 0) {
    score += 0.15;
  }

  if (n >= 3 && hasPrimary && hasVisual && score >= 0.85) return "High";
  if (n >= 2 && hasPrimary && score >= 0.6) return "High";
  if (n >= 2 && score >= 0.45) return "Medium";
  return "Low";
}
