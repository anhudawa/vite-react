/**
 * THE CORRECTIONS RECORD
 *
 * A publication earns trust not by never being wrong, but by what it does when it
 * is. Every correction, clarification, or retraction is logged here permanently —
 * never a silent edit. An empty log is honest; a hidden mistake is not.
 */

export type CorrectionKind = "correction" | "clarification" | "retraction";

export interface Correction {
  id: string;
  date: string; // ISO
  kind: CorrectionKind;
  /** the fact id affected, if it maps to a reference */
  factId?: string;
  subject: string; // human label, e.g. "Tiger Woods — Rolex Day-Date 40"
  summary: string; // what changed and why, in plain language
}

/** Chronological, newest first. Empty until we have something to record. */
export const corrections: Correction[] = [];

export const correctionsPolicy =
  "When we publish something inaccurate, we correct it in place, mark it, and log it here with the date and what changed. A retraction means a reference failed re-verification and was pulled. We do not delete history.";
