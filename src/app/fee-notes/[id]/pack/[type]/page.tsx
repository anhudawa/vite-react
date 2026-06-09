"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useDb } from "@/lib/store/store";
import { feeNoteView } from "@/lib/views";
import { buildChronology, stepLabel } from "@/lib/domain/pack";
import { formatCents } from "@/lib/domain/money";
import { formatDate, formatDateTime } from "@/lib/domain/dates";
import { Button } from "@/components/ui";

/**
 * Recovery pack — printable bundle (browser print → PDF in demo mode;
 * server-side PDF generation in production). Assembled entirely from the
 * audit log, steps, correspondence and payments.
 */
export default function PackPage() {
  const db = useDb();
  const { id, type } = useParams<{ id: string; type: string }>();
  const fn = db.feeNotes.find((f) => f.id === id);
  if (!fn) return <p className="text-sm text-gray-500">Fee note not found.</p>;
  const v = feeNoteView(db, fn);
  const isBar = type === "bar";
  const title = isBar
    ? "Bar of Ireland — Fee Recovery Referral"
    : "LSRA Complaint — Non-payment of Counsel's Fees";

  const chronology = buildChronology(fn, v.steps, v.correspondence, v.payments, db.audit);
  const sentSteps = v.steps.filter((s) => s.status === "SENT");

  return (
    <div className="mx-auto max-w-2xl">
      <div className="no-print mb-4 flex items-center justify-between">
        <Link href={`/fee-notes/${fn.id}`} className="text-sm text-[--color-brand] underline">
          ← Back to {fn.number}
        </Link>
        <Button onClick={() => window.print()}>Print / save as PDF</Button>
      </div>

      <div className="rounded-xl border border-black/10 bg-white p-8 text-sm leading-relaxed">
        <h1 className="text-lg font-semibold">{title}</h1>
        <p className="mt-1 text-xs text-gray-500">
          Generated {formatDateTime(new Date().toISOString())} · {fn.number}
        </p>

        <h2 className="mt-6 font-semibold">1. Parties</h2>
        <table className="mt-2 w-full text-sm">
          <tbody>
            <Row k="Barrister" v={`${db.profile.fullName || "—"} BL`} />
            <Row k="Law Library No." v={db.profile.lawLibraryNo || "—"} />
            <Row k="Instructing firm" v={v.firm?.name ?? "—"} />
            <Row k="Instructing solicitor" v={v.contact ? `${v.contact.name} (${v.contact.email})` : "—"} />
          </tbody>
        </table>

        <h2 className="mt-6 font-semibold">2. Fee note</h2>
        <table className="mt-2 w-full text-sm">
          <tbody>
            <Row k="Fee note" v={fn.number} />
            <Row k="Matter" v={`${v.matter?.title ?? "—"}${v.matter?.reference ? ` (ref ${v.matter.reference})` : ""}`} />
            <Row k="Work done" v={fn.workDescription || "—"} />
            <Row k="Issue date" v={formatDate(fn.issueDate)} />
            <Row k="Amount" v={formatCents(fn.amountCents)} />
            <Row k="Paid to date" v={formatCents(v.paidCents)} />
            <Row k="Outstanding" v={formatCents(v.outstandingCents)} />
            <Row k="Days outstanding" v={`${v.ageDays}`} />
            {v.matter?.section150 && (
              <Row
                k="Section 150 notice"
                v={`Issued ${formatDate(v.matter.section150.issuedAt)}${v.matter.section150.deliveryConfirmedAt ? ", delivery confirmed" : ""}`}
              />
            )}
          </tbody>
        </table>

        <h2 className="mt-6 font-semibold">3. Chase history</h2>
        <p className="mt-1 text-xs text-gray-500">
          {sentSteps.length} escalation step(s) sent through the platform, each
          recorded with the template version used and, where applicable, the
          explicit user approval timestamp.
        </p>
        <ul className="mt-2 list-disc pl-5">
          {sentSteps.map((s) => (
            <li key={s.id}>
              {stepLabel(s.stepType)} — sent {s.sentAt ? formatDateTime(s.sentAt) : "—"}
              {s.templateVersion ? ` (template v${s.templateVersion})` : ""}
            </li>
          ))}
        </ul>

        <h2 className="mt-6 font-semibold">4. Full chronology</h2>
        <p className="mt-1 text-xs text-gray-500">
          Reproduced from the append-only audit log. Every timestamp below was
          recorded at the time of the event.
        </p>
        <table className="mt-2 w-full text-xs">
          <tbody>
            {chronology.map((e, i) => (
              <tr key={i} className="border-b border-black/5 align-top">
                <td className="whitespace-nowrap py-1 pr-3 text-gray-500">
                  {formatDateTime(e.at)}
                </td>
                <td className="py-1">
                  <span className="font-medium">{e.summary}</span>
                  {e.detail && <span className="text-gray-500"> — {e.detail}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!isBar && (
          <>
            <h2 className="mt-6 font-semibold">5. Grounds of complaint</h2>
            <p className="mt-1">
              The fee note above has remained unpaid for {v.ageDays} days
              despite the reminders and formal correspondence listed at section
              3. {v.correspondence.filter((c) => c.direction === "INBOUND").length === 0
                ? "No substantive response has been received from the instructing solicitor."
                : "The instructing solicitor's responses are included in the chronology at section 4."}
            </p>
          </>
        )}

        <p className="mt-8 text-[11px] text-gray-400">
          Prepared with FeeNote. Chronology generated from an append-only audit
          log; entries cannot be edited or deleted after the fact.
        </p>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <tr className="border-b border-black/5">
      <td className="w-44 py-1 pr-3 text-gray-500">{k}</td>
      <td className="py-1 font-medium">{v}</td>
    </tr>
  );
}
