import { AGEING_BANDS, AgeingBandKey, FeeNote } from "./types";
import { daysSince } from "./dates";

export function ageingBandFor(ageDays: number): AgeingBandKey {
  for (const band of AGEING_BANDS) {
    if (ageDays >= band.min && ageDays <= band.max) return band.key;
  }
  return "180+";
}

export interface AgeingSummary {
  totalOutstandingCents: number;
  bands: { key: AgeingBandKey; label: string; cents: number; count: number }[];
}

/**
 * Outstanding = face value minus recorded payments, for fee notes that are
 * still live (not settled/written off/draft). Disputed notes remain in the
 * ageing picture — the money is still owed while the dispute runs.
 */
export function summariseAgeing(
  feeNotes: FeeNote[],
  paidCentsByFeeNote: Map<string, number>,
  now: Date = new Date(),
): AgeingSummary {
  const bands = AGEING_BANDS.map((b) => ({
    key: b.key,
    label: b.label,
    cents: 0,
    count: 0,
  }));
  let total = 0;
  for (const fn of feeNotes) {
    if (!isOutstandingState(fn)) continue;
    const outstanding = outstandingCents(fn, paidCentsByFeeNote.get(fn.id) ?? 0);
    if (outstanding <= 0) continue;
    const band = bands.find(
      (b) => b.key === ageingBandFor(daysSince(fn.issueDate, now)),
    )!;
    band.cents += outstanding;
    band.count += 1;
    total += outstanding;
  }
  return { totalOutstandingCents: total, bands };
}

export function isOutstandingState(fn: FeeNote): boolean {
  return fn.state !== "DRAFT" && fn.state !== "SETTLED" && fn.state !== "WRITTEN_OFF";
}

export function outstandingCents(fn: FeeNote, paidCents: number): number {
  return Math.max(0, fn.amountCents - paidCents);
}
