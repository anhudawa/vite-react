"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useDb } from "@/lib/store/store";
import { feeNoteView } from "@/lib/views";
import { formatCents } from "@/lib/domain/money";
import { formatDate } from "@/lib/domain/dates";
import { Button } from "@/components/ui";

/**
 * The fee note document — clean printable template carrying the
 * barrister's own identity (browser print → PDF in demo mode; server-side
 * PDF in production).
 */
export default function FeeNoteDocumentPage() {
  const db = useDb();
  const { id } = useParams<{ id: string }>();
  const fn = db.feeNotes.find((f) => f.id === id);
  if (!fn) return <p className="text-sm text-ink-soft">Fee note not found.</p>;
  const v = feeNoteView(db, fn);
  const p = db.profile;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="no-print mb-4 flex items-center justify-between">
        <Link href={`/fee-notes/${fn.id}`} className="text-sm text-brand underline">
          ← Back to {fn.number}
        </Link>
        <Button onClick={() => window.print()}>Print / save as PDF</Button>
      </div>

      <div className="print-sheet rounded-lg border border-line bg-white p-10 font-display text-[0.95rem] leading-relaxed shadow-[0_2px_12px_rgba(28,37,34,0.06)] sm:p-14">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-xl font-semibold tracking-tight">
              {p.fullName || "[Barrister name]"}{" "}
              <span className="font-normal text-ink-soft">BL</span>
            </p>
            <p className="mt-1 whitespace-pre-line text-xs text-ink-soft">
              {p.address || "[Address]"}
            </p>
            <p className="text-xs text-ink-soft">
              {p.lawLibraryNo && `Law Library No. ${p.lawLibraryNo}`}
              {p.vatNo && ` · VAT No. ${p.vatNo}`}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-ink-soft">
              Fee note
            </p>
            <p className="mt-0.5 text-lg font-semibold tabular-nums">{fn.number}</p>
            <p className="text-xs text-ink-soft">{formatDate(fn.issueDate)}</p>
          </div>
        </div>
        <div className="mt-6 border-b-2 border-double border-line-strong" aria-hidden />

        <div className="mt-8">
          <p className="text-xs uppercase tracking-wider text-ink-faint">To</p>
          <p className="font-medium">{v.contact?.name ?? ""}</p>
          <p>{v.firm?.name ?? "[Instructing firm]"}</p>
          {v.firm?.address && <p className="text-ink-soft">{v.firm.address}</p>}
        </div>

        <div className="mt-6">
          <p className="text-xs uppercase tracking-wider text-ink-faint">Re</p>
          <p className="font-medium">
            {v.matter?.title ?? "[Matter]"}
            {v.matter?.reference && (
              <span className="font-normal text-ink-soft"> (your ref {v.matter.reference})</span>
            )}
          </p>
        </div>

        <table className="mt-8 w-full">
          <thead>
            <tr className="border-b border-line-strong text-left text-xs uppercase tracking-wider text-ink-faint">
              <th className="py-2">Professional fees</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-line align-top">
              <td className="py-3">{fn.workDescription || "Professional services rendered"}</td>
              <td className="py-3 text-right font-medium tabular-nums">
                {formatCents(fn.amountCents)}
              </td>
            </tr>
            {v.paidCents > 0 && (
              <tr className="border-b border-line">
                <td className="py-2 text-ink-soft">Less payments received</td>
                <td className="py-2 text-right tabular-nums text-ink-soft">
                  −{formatCents(v.paidCents)}
                </td>
              </tr>
            )}
            <tr>
              <td className="py-3 font-semibold">Balance due</td>
              <td className="py-3 text-right text-base font-semibold tabular-nums">
                {formatCents(v.outstandingCents)}
              </td>
            </tr>
          </tbody>
        </table>

        {p.bankDetails && (
          <div className="mt-8 rounded-lg bg-paper p-3 text-xs">
            <p className="font-medium text-ink-soft">Payment details</p>
            <p className="whitespace-pre-line text-ink-soft">{p.bankDetails}</p>
          </div>
        )}

        {v.matter?.section150 && (
          <p className="mt-6 text-[11px] text-ink-faint">
            A notice under section 150 of the Legal Services Regulation Act
            2015 was provided in this matter on {formatDate(v.matter.section150.issuedAt)}.
          </p>
        )}
      </div>
    </div>
  );
}
