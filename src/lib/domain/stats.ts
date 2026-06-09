/**
 * Per-firm payment statistics — the seed of the Phase 2 benchmark moat.
 * Computed and stored per user from day one (product principle 5), but
 * never surfaced across users until the legal review gate clears.
 */

import { daysSince } from "./dates";
import { isOutstandingState, outstandingCents } from "./ageing";
import { FeeNote, FirmPaymentStats, Payment } from "./types";

export const EMPTY_FIRM_STATS: FirmPaymentStats = {
  paidCount: 0,
  totalDaysToPay: 0,
  paidValueCents: 0,
  outstandingValueCents: 0,
};

/** Days from issue to the payment that cleared the balance. */
export function daysToPay(fn: FeeNote, payments: Payment[]): number | null {
  const ours = payments
    .filter((p) => p.feeNoteId === fn.id)
    .sort((a, b) => a.date.localeCompare(b.date));
  let paid = 0;
  for (const p of ours) {
    paid += p.amountCents;
    if (paid >= fn.amountCents) {
      return daysSince(fn.issueDate, new Date(`${p.date}T00:00:00Z`));
    }
  }
  return null;
}

/** Recompute a firm's stats from scratch off its fee notes + payments. */
export function computeFirmStats(
  firmFeeNotes: FeeNote[],
  payments: Payment[],
  now: Date = new Date(),
): FirmPaymentStats {
  const stats = { ...EMPTY_FIRM_STATS };
  for (const fn of firmFeeNotes) {
    const paid = payments
      .filter((p) => p.feeNoteId === fn.id)
      .reduce((sum, p) => sum + p.amountCents, 0);
    if (fn.state === "SETTLED") {
      const days = daysToPay(fn, payments);
      if (days !== null) {
        stats.paidCount += 1;
        stats.totalDaysToPay += days;
      }
      stats.paidValueCents += Math.min(paid, fn.amountCents);
    } else if (isOutstandingState(fn)) {
      stats.outstandingValueCents += outstandingCents(fn, paid);
      stats.paidValueCents += Math.min(paid, fn.amountCents);
    }
  }
  void now;
  return stats;
}

export function meanDaysToPay(stats: FirmPaymentStats): number | null {
  if (stats.paidCount === 0) return null;
  return Math.round(stats.totalDaysToPay / stats.paidCount);
}

/**
 * Banded presentation ("typically pays in 30–60 days") — the only form the
 * benchmark is ever surfaced in, even for the user's own data, so the
 * Phase 2 cross-user feature inherits a defamation-safe display format.
 */
export function paymentBandLabel(stats: FirmPaymentStats): string {
  const mean = meanDaysToPay(stats);
  if (mean === null) return "No payment history yet";
  if (mean <= 30) return "Typically pays within 30 days";
  if (mean <= 60) return "Typically pays in 30–60 days";
  if (mean <= 90) return "Typically pays in 60–90 days";
  if (mean <= 180) return "Typically pays in 90–180 days";
  return "Typically takes 180+ days to pay";
}
