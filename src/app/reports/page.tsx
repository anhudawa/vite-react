"use client";

import { useState } from "react";
import { useDb } from "@/lib/store/store";
import { summariseAgeing } from "@/lib/domain/ageing";
import { formatCents } from "@/lib/domain/money";
import {
  receiptsByMonth,
  toCSV,
  totalReceipts,
  vatPeriods,
  yearsWithActivity,
} from "@/lib/domain/reports";
import { outstandingViews, paidCentsByFeeNote } from "@/lib/views";
import { downloadCSV } from "@/lib/download";
import { Button, Card, EmptyState, SectionTitle } from "@/components/ui";

export default function ReportsPage() {
  const db = useDb();
  const years = yearsWithActivity(db.payments);
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(years[0] ?? currentYear);

  if (db.feeNotes.length === 0) {
    return (
      <EmptyState title="No data to report on yet">
        Import or create fee notes first.
      </EmptyState>
    );
  }

  const ageing = summariseAgeing(db.feeNotes, paidCentsByFeeNote(db));
  const monthly = receiptsByMonth(db.payments, year);
  const vat = vatPeriods(db.payments, year);
  const maxMonth = Math.max(1, ...monthly.map((m) => m.cents));

  const exportAgedDebt = () => {
    const rows = outstandingViews(db).map((v) => [
      v.fn.number,
      v.firm?.name ?? "",
      v.matter?.title ?? "",
      v.fn.issueDate,
      v.ageDays,
      (v.outstandingCents / 100).toFixed(2),
      v.fn.state,
    ]);
    downloadCSV(
      `aged-debt-${new Date().toISOString().slice(0, 10)}.csv`,
      toCSV(
        ["Fee note", "Firm", "Matter", "Issue date", "Days outstanding", "Outstanding (EUR)", "State"],
        rows,
      ),
    );
  };

  const exportReceipts = () => {
    const rows = db.payments
      .filter((p) => p.date.startsWith(String(year)))
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((p) => {
        const fn = db.feeNotes.find((f) => f.id === p.feeNoteId);
        return [p.date, fn?.number ?? "", (p.amountCents / 100).toFixed(2), p.method, p.note];
      });
    downloadCSV(
      `receipts-${year}.csv`,
      toCSV(["Date", "Fee note", "Amount (EUR)", "Method", "Note"], rows),
    );
  };

  return (
    <div className="mx-auto max-w-2xl space-y-1 pb-8">
      <div className="mb-2 flex items-end justify-between">
        <h1 className="font-display text-[1.65rem] font-semibold leading-tight tracking-tight">Reports</h1>
        <select
          className="rounded-lg border border-line-strong bg-white px-2 py-1 text-sm"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value, 10))}
        >
          {(years.length ? years : [currentYear]).map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <SectionTitle>Aged debt summary</SectionTitle>
      <Card>
        <p className="text-sm">
          Total outstanding:{" "}
          <span className="font-semibold tabular-nums">
            {formatCents(ageing.totalOutstandingCents)}
          </span>
        </p>
        <ul className="mt-2 space-y-1 text-sm text-ink-soft">
          {ageing.bands.map((b) => (
            <li key={b.key} className="flex justify-between">
              <span>{b.label}</span>
              <span className="tabular-nums">
                {b.count > 0 ? `${formatCents(b.cents)} (${b.count})` : "—"}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3">
          <Button variant="secondary" onClick={exportAgedDebt}>
            Export aged debt (CSV)
          </Button>
        </div>
      </Card>

      <SectionTitle>Receipts — {year} (tax year = calendar year)</SectionTitle>
      <Card>
        <p className="mb-2 text-sm">
          Fees received in {year}:{" "}
          <span className="font-semibold tabular-nums">
            {formatCents(totalReceipts(db.payments, year))}
          </span>
          <span className="ml-1 text-xs text-ink-soft">(cash-receipts basis, Form 11 oriented)</span>
        </p>
        <div className="space-y-1">
          {monthly.map((m) => (
            <div key={m.month} className="flex items-center gap-2">
              <span className="w-8 text-xs text-ink-soft">{m.month}</span>
              <div className="h-4 flex-1 overflow-hidden rounded bg-paper">
                <div
                  className="h-full rounded bg-brand"
                  style={{ width: `${(m.cents / maxMonth) * 100}%` }}
                />
              </div>
              <span className="w-20 text-right text-xs tabular-nums">
                {m.cents > 0 ? formatCents(m.cents) : "—"}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <Button variant="secondary" onClick={exportReceipts}>
            Export receipts (CSV)
          </Button>
        </div>
      </Card>

      <SectionTitle>VAT summary — {year}</SectionTitle>
      <Card>
        <p className="mb-2 text-xs text-amber-700">
          Draft figures: receipts treated as VAT-inclusive at 23%. The VAT
          treatment of counsel&apos;s fees needs owner sign-off before this
          report is relied on.
        </p>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs text-ink-soft">
              <th className="py-1">VAT3 period</th>
              <th className="py-1 text-right">Gross</th>
              <th className="py-1 text-right">Net</th>
              <th className="py-1 text-right">VAT @ 23%</th>
            </tr>
          </thead>
          <tbody>
            {vat.map((p) => (
              <tr key={p.label} className="border-b border-line">
                <td className="py-1">{p.label}</td>
                <td className="py-1 text-right tabular-nums">
                  {p.grossCents > 0 ? formatCents(p.grossCents) : "—"}
                </td>
                <td className="py-1 text-right tabular-nums">
                  {p.grossCents > 0 ? formatCents(p.netCents) : "—"}
                </td>
                <td className="py-1 text-right tabular-nums">
                  {p.grossCents > 0 ? formatCents(p.vatCents) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <p className="pt-2 text-xs text-ink-faint">
        Use your browser&apos;s print dialog for a PDF of this page.
      </p>
    </div>
  );
}
