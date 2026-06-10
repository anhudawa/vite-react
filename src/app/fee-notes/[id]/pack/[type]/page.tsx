"use client";

import { plural } from "@/lib/plural";

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
  if (!fn) return <p className="text-sm text-ink-soft">Fee note not found.</p>;
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
        <Link href={`/fee-notes/${fn.id}`} className="text-sm text-brand underline">
          ← Back to {fn.number}
        </Link>
        <Button onClick={() => window.print()}>Print / save as PDF</Button>
      </div>

      <div className="print-sheet rounded-lg border border-line bg-white p-8 font-display text-sm leading-relaxed shadow-[0_2px_12px_rgba(28,37,34,0.06)] sm:p-12">
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        <div className="mt-3 border-b-2 border-double border-line-strong" aria-hidden />
        <p className="mt-1 text-xs text-ink-soft">
          Generated {formatDateTime(new Date().toISOString())} · {fn.number}
        </p>

        <h2 className="mt-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft">1. Parties</h2>
        <table className="mt-2 w-full text-sm">
          <tbody>
            <Row k="Barrister" v={`${db.profile.fullName || "—"} BL`} />
            <Row k="Law Library No." v={db.profile.lawLibraryNo || "—"} />
            <Row k="Instructing firm" v={v.firm?.name ?? "—"} />
            <Row k="Instructing solicitor" v={v.contact ? `${v.contact.name} (${v.contact.email})` : "—"} />
          </tbody>
        </table>

        <h2 className="mt-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft">2. Fee note</h2>
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

        <h2 className="mt-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft">3. Chase history</h2>
        <p className="mt-1 text-xs text-ink-soft">
          {plural(sentSteps.length, "escalation step")} sent through the platform, each
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

        <h2 className="mt-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft">4. Full chronology</h2>
        <p className="mt-1 text-xs text-ink-soft">
          Reproduced from the append-only audit log. Every timestamp below was
          recorded at the time of the event.
        </p>
        <table className="mt-2 w-full text-xs">
          <tbody>
            {chronology.map((e, i) => (
              <tr key={i} className="border-b border-line align-top">
                <td className="whitespace-nowrap py-1 pr-3 text-ink-soft">
                  {formatDateTime(e.at)}
                </td>
                <td className="py-1">
                  <span className="font-medium">{e.summary}</span>
                  {e.detail && <span className="text-ink-soft"> — {e.detail}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!isBar && (
          <>
            <h2 className="mt-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft">5. Grounds of complaint</h2>
            <p className="mt-1">
              The fee note above has remained unpaid for {v.ageDays} days
              despite the reminders and formal correspondence listed at section
              3. {v.correspondence.filter((c) => c.direction === "INBOUND").length === 0
                ? "No substantive response has been received from the instructing solicitor."
                : "The instructing solicitor's responses are included in the chronology at section 4."}
            </p>
          </>
        )}

        <p className="mt-8 text-[11px] text-ink-faint">
          Prepared with FeeNote. Chronology generated from an append-only audit
          log; entries cannot be edited or deleted after the fact.
        </p>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <tr className="border-b border-line">
      <td className="w-44 py-1 pr-3 text-ink-soft">{k}</td>
      <td className="py-1 font-medium">{v}</td>
    </tr>
  );
}
