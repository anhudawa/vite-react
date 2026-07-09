import type { ClaimField, Confidence, GateId } from "./types";

/**
 * The accuracy policy — every threshold in one place. Tighten these and the
 * whole site re-validates against the stricter bar on the next build.
 */
export const POLICY = {
  /** distinct, independent sources required overall */
  minIndependentSources: 2,
  /** independent sources required to corroborate EACH critical field */
  minCorroborationPerField: 2,
  /** the fields whose accuracy the brand lives or dies by */
  criticalFields: ["watch", "relation", "evidence"] as ClaimField[],
  /** a published fact may not claim more confidence than the evidence earns,
   *  and may not publish below this floor */
  minConfidenceToPublish: "High" as Confidence,
  /** a source older than this (years) no longer counts toward live corroboration
   *  unless it is a primary record (relationships drift; watches get sold) */
  staleMediaYears: 4,
} as const;

/**
 * The only relationship types a reference may declare. A claim must name how the
 * watch reached the wrist — vague affiliation is not allowed. The `relation`
 * field must begin with one of these (case-insensitive).
 */
export const RELATIONSHIP_TYPES = [
  "Sponsored",
  "Ambassador",
  "Personal", // personal purchase / collection
  "Loan",
  "Gifted",
  "Team-issued",
  "Retailer", // supplied by a retailer/partner
  "Unverified", // explicitly logged as not-yet-established
] as const;

/**
 * Modeled residual error per gate — the assumed probability that a *wrong* claim
 * slips past that gate alone. These are conservative engineering estimates, not
 * measured rates; their product is what makes a wrong fact statistically
 * implausible once every gate is independent. Surfaced so the claim is auditable
 * rather than rhetorical.
 */
export const GATE_RESIDUALS: Record<GateId, number> = {
  "independent-sourcing": 0.1,
  "field-corroboration": 0.1,
  "reference-integrity": 0.2,
  "visual-evidence": 0.15,
  "relationship-clarity": 0.3,
  "adversarial-review": 0.08,
  "confidence-threshold": 0.25,
  "editorial-signoff": 0.05,
};
