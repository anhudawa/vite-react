/**
 * Reporting aggregations. Barristers are sole traders assessed on a
 * calendar tax year (Form 11), and in practice account for fees on a
 * cash-receipts basis — every report here is computed off *payments
 * received*, not fee notes issued.
 *
 * VAT: receipts are treated as VAT-inclusive at the standard 23% rate when
 * the user has a VAT number. That assumption is surfaced in the UI and
 * needs owner sign-off before launch (engineering placeholder, not tax
 * advice).
 */

import { Payment } from "./types";

export const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

export function yearsWithActivity(payments: Payment[]): number[] {
  const years = new Set<number>();
  for (const p of payments) years.add(parseInt(p.date.slice(0, 4), 10));
  return [...years].sort((a, b) => b - a);
}

export interface MonthlyReceipts {
  month: string;
  cents: number;
  count: number;
}

export function receiptsByMonth(payments: Payment[], year: number): MonthlyReceipts[] {
  const rows = MONTHS.map((month) => ({ month, cents: 0, count: 0 }));
  for (const p of payments) {
    if (parseInt(p.date.slice(0, 4), 10) !== year) continue;
    const m = parseInt(p.date.slice(5, 7), 10) - 1;
    rows[m].cents += p.amountCents;
    rows[m].count += 1;
  }
  return rows;
}

export function totalReceipts(payments: Payment[], year: number): number {
  return receiptsByMonth(payments, year).reduce((s, r) => s + r.cents, 0);
}

/** Irish VAT3 taxable periods are bi-monthly: Jan/Feb, Mar/Apr, … Nov/Dec. */
export interface VatPeriod {
  label: string;
  grossCents: number;
  /** VAT component at 23% treated as included in receipts. */
  vatCents: number;
  netCents: number;
}

export const STANDARD_VAT_RATE = 0.23;

export function vatPeriods(payments: Payment[], year: number): VatPeriod[] {
  const monthly = receiptsByMonth(payments, year);
  const periods: VatPeriod[] = [];
  for (let i = 0; i < 12; i += 2) {
    const gross = monthly[i].cents + monthly[i + 1].cents;
    const net = Math.round(gross / (1 + STANDARD_VAT_RATE));
    periods.push({
      label: `${MONTHS[i]}–${MONTHS[i + 1]}`,
      grossCents: gross,
      vatCents: gross - net,
      netCents: net,
    });
  }
  return periods;
}

// ---------------------------------------------------------------------------
// CSV export (client download)
// ---------------------------------------------------------------------------

export function toCSV(header: string[], rows: (string | number)[][]): string {
  const escape = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [header, ...rows].map((r) => r.map(escape).join(",")).join("\r\n");
}
