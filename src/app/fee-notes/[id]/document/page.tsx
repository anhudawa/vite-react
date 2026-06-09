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
  if (!fn) return <p className="text-sm text-gray-500">Fee note not found.</p>;
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

      <div className="rounded-xl border border-black/10 bg-white p-10 text-sm leading-relaxed">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-base font-semibold">{p.fullName || "[Barrister name]"} BL</p>
            <p className="whitespace-pre-line text-xs text-gray-500">
              {p.address || "[Address]"}
            </p>
            <p className="text-xs text-gray-500">
              {p.lawLibraryNo && `Law Library No. ${p.lawLibraryNo}`}
              {p.vatNo && ` · VAT No. ${p.vatNo}`}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold tracking-tight">FEE NOTE</p>
            <p className="text-xs text-gray-500">{fn.number}</p>
            <p className="text-xs text-gray-500">{formatDate(fn.issueDate)}</p>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-xs uppercase tracking-wider text-gray-400">To</p>
          <p className="font-medium">{v.contact?.name ?? ""}</p>
          <p>{v.firm?.name ?? "[Instructing firm]"}</p>
          {v.firm?.address && <p className="text-gray-500">{v.firm.address}</p>}
        </div>

        <div className="mt-6">
          <p className="text-xs uppercase tracking-wider text-gray-400">Re</p>
          <p className="font-medium">
            {v.matter?.title ?? "[Matter]"}
            {v.matter?.reference && (
              <span className="font-normal text-gray-500"> (your ref {v.matter.reference})</span>
            )}
          </p>
        </div>

        <table className="mt-8 w-full">
          <thead>
            <tr className="border-b border-black/20 text-left text-xs uppercase tracking-wider text-gray-400">
              <th className="py-2">Professional fees</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-black/5 align-top">
              <td className="py-3">{fn.workDescription || "Professional services rendered"}</td>
              <td className="py-3 text-right font-medium tabular-nums">
                {formatCents(fn.amountCents)}
              </td>
            </tr>
            {v.paidCents > 0 && (
              <tr className="border-b border-black/5">
                <td className="py-2 text-gray-500">Less payments received</td>
                <td className="py-2 text-right tabular-nums text-gray-500">
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
          <div className="mt-8 rounded-lg bg-gray-50 p-3 text-xs">
            <p className="font-medium text-gray-600">Payment details</p>
            <p className="whitespace-pre-line text-gray-500">{p.bankDetails}</p>
          </div>
        )}

        {v.matter?.section150 && (
          <p className="mt-6 text-[11px] text-gray-400">
            A notice under section 150 of the Legal Services Regulation Act
            2015 was provided in this matter on {formatDate(v.matter.section150.issuedAt)}.
          </p>
        )}
      </div>
    </div>
  );
}
