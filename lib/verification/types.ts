/**
 * VERIFICATION TYPES
 *
 * Accuracy is the brand's whole moat. Every claim that renders on the site is a
 * VerifiedFact that must clear an explicit gauntlet of independent gates. The
 * types here make verification *structural*: you cannot construct a publishable
 * fact without the provenance the gates require.
 */

export type Confidence = "High" | "Medium" | "Low";

/** The fields a reader actually sees in a Fact Block. */
export interface DisplayFact {
  athlete: string;
  watch: string;
  relation: string;
  evidence: string;
  confidence: Confidence;
  confidenceNote?: string;
  reference?: string; // movement / reference number, set in mono
}

/** Which display claim a given source actually corroborates. */
export type ClaimField = "athlete" | "watch" | "relation" | "evidence";

export type SourceKind =
  | "official" // manufacturer / team / the athlete — authoritative on the relationship
  | "media" // established watch or sports reporting
  | "photo" // a dated, located photograph of the wrist
  | "video" // broadcast / event footage
  | "document"; // filing, press release, court/contract record

export type SourceTier = "primary" | "secondary" | "tertiary";

export interface Source {
  id: string;
  publisher: string;
  kind: SourceKind;
  tier: SourceTier;
  url?: string; // canonical link; optional only for physical photo/video evidence
  publishedAt?: string; // ISO date the source was published / the photo was taken
  accessedAt: string; // ISO date an editor last confirmed it
  excerpt: string; // the exact supporting quote or description
  supports: ClaimField[]; // the claim fields this source corroborates
  /** An immutable archived copy of the source, so the citation survives
   *  link-rot. `unarchivable` records that the publisher blocks archiving
   *  (e.g. rolex.com) — in which case the claim must stand on other,
   *  archivable sources rather than this one. */
  snapshot?: { archivedUrl: string; capturedAt: string } | "unarchivable";
  /** ids of sources this one is NOT independent from (same owner, syndication,
   *  a party to the relationship reporting on itself). Used to prevent an echo
   *  chamber from counting as corroboration. */
  notIndependentOf?: string[];
  /** an editor confirmed the link resolves and the excerpt is accurate & current */
  verified: boolean;
}

/** The adversarial / human layer. */
export interface Review {
  /** an explicit attempt to *disprove* the claim was carried out */
  disconfirmingSearch: boolean;
  /** anything found that contradicts the claim — MUST be empty to publish */
  contradictionsFound: string[];
  /** known look-alikes explicitly ruled out (e.g. RM 67-01 vs RM 67-02) */
  confusedWithRuledOut: string[];
  /** how the final check was performed */
  method: "dual-control" | "single" | "none";
  approvedBy?: string; // named editor
  approvedAt?: string; // ISO
  notes?: string;
}

export type FactStatus = "draft" | "in-review" | "published";

export interface VerifiedFact extends DisplayFact {
  id: string;
  status: FactStatus;
  sources: Source[];
  review: Review;
}

export type GateId =
  | "independent-sourcing"
  | "field-corroboration"
  | "reference-integrity"
  | "visual-evidence"
  | "relationship-clarity"
  | "adversarial-review"
  | "confidence-threshold"
  | "editorial-signoff";

export interface GateResult {
  id: GateId;
  label: string;
  pass: boolean;
  detail: string;
}

export interface VerificationReport {
  factId: string;
  publishable: boolean;
  gates: GateResult[];
  computedConfidence: Confidence;
  /** modeled residual probability a wrong fact survives all gates (illustrative) */
  residualErrorEstimate: number;
  failures: string[];
}
