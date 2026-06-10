"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { getStore, useDb, todayInputValue } from "@/lib/store/store";
import { feeNoteView, FeeNoteView } from "@/lib/views";
import { formatCents, parseAmountToCents } from "@/lib/domain/money";
import { formatDate, formatDateTime, addDays } from "@/lib/domain/dates";
import { renderForFeeNote } from "@/lib/domain/templates";
import { validateTimings } from "@/lib/domain/escalation";
import { buildChronology, canCreateBarReferral, stepLabel } from "@/lib/domain/pack";
import { Db } from "@/lib/store/db";
import { Button, Card, Field, inputCls, SectionTitle, StateBadge } from "@/components/ui";

export default function FeeNoteDetailPage() {
  const db = useDb();
  const { id } = useParams<{ id: string }>();
  const fn = db.feeNotes.find((f) => f.id === id);
  if (!fn) {
    return <p className="text-sm text-ink-soft">Fee note not found.</p>;
  }
  const v = feeNoteView(db, fn);

  return (
    <div className="mx-auto max-w-2xl space-y-1 pb-8">
      <Header v={v} />
      <NextAction v={v} db={db} />
      <LadderControls v={v} />
      <PaymentsSection v={v} />
      <CorrespondenceSection v={v} />
      <ChronologySection v={v} db={db} />
    </div>
  );
}

function Header({ v }: { v: FeeNoteView }) {
  return (
    <Card className="p-5">
      <p className="text-xs text-ink-soft">
        <Link href="/fee-notes" className="underline decoration-line-strong underline-offset-2 hover:text-brand">
          Fee notes
        </Link>{" "}
        / <span className="tabular-nums">{v.fn.number}</span>
      </p>
      <h1 className="mt-1.5 font-display text-xl font-semibold leading-snug tracking-tight">
        {v.matter?.title ?? "(no matter)"}
      </h1>
      <p className="mt-0.5 text-sm text-ink-soft">
        {v.firm?.name ?? "—"}
        {v.contact ? ` · ${v.contact.name}` : ""}
        {v.matter?.reference ? ` · ref ${v.matter.reference}` : ""}
      </p>
      {v.fn.workDescription && (
        <p className="mt-1 text-sm text-ink-soft">{v.fn.workDescription}</p>
      )}

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-line pt-4">
        <div>
          <p className="font-display text-[1.7rem] font-semibold leading-none tracking-tight tabular-nums">
            {formatCents(v.outstandingCents)}
          </p>
          <p className="mt-1 text-[11px] text-ink-soft">
            of {formatCents(v.fn.amountCents)} · issued {formatDate(v.fn.issueDate)} ·{" "}
            {v.ageDays} days outstanding
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <StateBadge state={v.fn.state} paused={v.fn.paused} />
          <Link
            href={`/fee-notes/${v.fn.id}/document`}
            className="text-xs text-brand underline decoration-line-strong underline-offset-2 hover:decoration-brand"
          >
            View fee note document
          </Link>
        </div>
      </div>
      {v.matter?.section150 && (
        <p className="mt-2 text-[11px] text-ink-faint">
          s.150 notice issued {formatDate(v.matter.section150.issuedAt)}
          {v.matter.section150.deliveryConfirmedAt ? " · delivery confirmed" : ""}
        </p>
      )}
    </Card>
  );
}

/** The approval gate: the system proposes, the barrister disposes. */
function NextAction({ v, db }: { v: FeeNoteView; db: Db }) {
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(false);
  const [actionError, setActionError] = useState("");
  const store = getStore();

  /** Store transitions throw TransitionError on a blocked move (e.g. the
   * Bar referral cap); surface it instead of crashing the handler. */
  const tryAction = (action: () => void) => {
    try {
      setActionError("");
      action();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : String(e));
    }
  };

  if (v.fn.state === "DRAFT") {
    return (
      <Card className="border-l-4 border-l-brand">
        <p className="text-sm">This fee note is a draft — the clock hasn’t started.</p>
        <div className="mt-2">
          <Button onClick={() => store.issueFeeNote(v.fn.id)}>Issue now</Button>
        </div>
      </Card>
    );
  }

  if (v.fn.state === "BAR_REFERRAL_PACK" || v.fn.state === "LSRA_COMPLAINT_PACK") {
    const type = v.fn.state === "BAR_REFERRAL_PACK" ? "bar" : "lsra";
    return (
      <Card className="border-l-4 border-l-purple-400">
        <p className="text-sm">
          {v.fn.state === "BAR_REFERRAL_PACK"
            ? "Referred to the Bar of Ireland fee recovery service."
            : "LSRA complaint pack generated."}
        </p>
        <div className="mt-2">
          <Link href={`/fee-notes/${v.fn.id}/pack/${type}`} className="contents">
            <Button variant="secondary">View pack</Button>
          </Link>
        </div>
      </Card>
    );
  }

  if (!v.proposed) {
    if (v.fn.paused) {
      return (
        <Card className="border-l-4 border-l-line-strong">
          <p className="text-sm text-ink-soft">
            Ladder paused — no chases will be proposed or sent until you resume.
          </p>
        </Card>
      );
    }
    if (v.fn.state === "DISPUTED") {
      return (
        <Card className="border-l-4 border-l-rose-400">
          <p className="text-sm">
            Disputed — the ladder is paused while the dispute runs. Use the
            correspondence thread below; resolve the dispute to resume.
          </p>
          <div className="mt-2">
            <Button variant="secondary" onClick={() => store.resolveDispute(v.fn.id)}>
              Mark dispute resolved
            </Button>
          </div>
        </Card>
      );
    }
    return null;
  }

  if (v.proposed.kind === "RECOVERY_DECISION") {
    const barAvailable = canCreateBarReferral(db.feeNotes);
    return (
      <Card className="border-l-4 border-l-danger">
        <p className="text-sm font-medium">
          The ladder is exhausted. How do you want to escalate?
        </p>
        <p className="mt-1 text-xs text-ink-soft">
          Both packs are assembled from the logged chronology below — every
          reminder is timestamped evidence of non-engagement.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            disabled={!barAvailable}
            onClick={() =>
              tryAction(() => {
                store.approveAndSendStep(v.fn.id, "BAR_REFERRAL_PACK");
                router.push(`/fee-notes/${v.fn.id}/pack/bar`);
              })
            }
          >
            Refer to Bar fee recovery
          </Button>
          <Button
            variant="danger"
            onClick={() =>
              tryAction(() => {
                store.approveAndSendStep(v.fn.id, "LSRA_COMPLAINT_PACK");
                router.push(`/fee-notes/${v.fn.id}/pack/lsra`);
              })
            }
          >
            Prepare LSRA complaint
          </Button>
        </div>
        {actionError && <p className="mt-2 text-xs text-danger">{actionError}</p>}
        {!barAvailable && (
          <p className="mt-2 text-xs text-danger">
            You already have 3 active Bar referrals — the service caps at 3 per
            member. Settle or withdraw one first.
          </p>
        )}
      </Card>
    );
  }

  const { step, due, dueDate, requiresApproval } = v.proposed;
  const template = db.templates.find((t) => t.kind === step) ?? null;
  const ctx = store.mergeContextFor(db, v.fn);
  const rendered = template && ctx ? renderForFeeNote(template, ctx) : null;

  if (!requiresApproval) {
    return (
      <Card className="border-l-4 border-l-blue-300">
        <p className="text-sm">
          {due
            ? "First reminder is due and will be sent automatically."
            : `First reminder scheduled for ${formatDate(dueDate)} — sent automatically, no action needed.`}
        </p>
      </Card>
    );
  }

  return (
    <Card className={`border-l-4 ${due ? "border-l-accent" : "border-l-line-strong"}`}>
      <p className="text-sm font-medium">
        {stepLabel(step)} {due ? "is due" : `scheduled for ${formatDate(dueDate)}`}
      </p>
      <p className="mt-1 text-xs text-ink-soft">
        Nothing is sent without your say-so. Review the letter, then approve
        with one tap.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          onClick={() =>
            tryAction(() => {
              store.approveAndSendStep(v.fn.id, step);
              setShowPreview(false);
            })
          }
        >
          Approve &amp; send {due ? "now" : "early"}
        </Button>
        <Button variant="secondary" onClick={() => setShowPreview((s) => !s)}>
          {showPreview ? "Hide letter" : "Review letter"}
        </Button>
        <Button variant="ghost" onClick={() => store.skipStep(v.fn.id, step)}>
          Skip this step
        </Button>
      </div>
      {actionError && <p className="mt-2 text-xs text-danger">{actionError}</p>}
      {showPreview && rendered && (
        <div className="mt-3 rounded-lg bg-paper p-3 text-sm">
          <p className="font-medium">{rendered.subject}</p>
          <pre className="mt-2 whitespace-pre-wrap font-sans text-xs text-ink">
            {rendered.body}
          </pre>
          <p className="mt-2 text-[11px] text-ink-faint">
            Template v{template?.version} · sent as {db.profile.fullName || "you"},
            replies go to {db.profile.email || "your address"}.
          </p>
        </div>
      )}
    </Card>
  );
}

function LadderControls({ v }: { v: FeeNoteView }) {
  const store = getStore();
  const [showCadence, setShowCadence] = useState(false);
  const t = v.fn.timingsOverride;
  const [r1, setR1] = useState(String(t?.reminder1Days ?? 30));
  const [r2, setR2] = useState(String(t?.reminder2Days ?? 60));
  const [fl, setFl] = useState(String(t?.formalLetterDays ?? 90));
  const [cadenceError, setCadenceError] = useState("");
  const terminal = v.fn.state === "SETTLED" || v.fn.state === "WRITTEN_OFF";
  if (terminal || v.fn.state === "DRAFT") return null;

  return (
    <>
      <SectionTitle>Ladder controls</SectionTitle>
      <Card>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => store.pauseLadder(v.fn.id, !v.fn.paused)}
          >
            {v.fn.paused ? "Resume ladder" : "Pause ladder"}
          </Button>
          {v.fn.state !== "DISPUTED" && (
            <Button
              variant="secondary"
              onClick={() =>
                store.markDisputed(v.fn.id, "Marked disputed from fee note screen")
              }
            >
              Mark disputed
            </Button>
          )}
          <Button variant="secondary" onClick={() => setShowCadence((s) => !s)}>
            Adjust cadence
          </Button>
          <Button variant="ghost" onClick={() => store.settle(v.fn.id)}>
            Mark settled
          </Button>
          <Button variant="ghost" onClick={() => store.writeOff(v.fn.id)}>
            Write off
          </Button>
        </div>
        {showCadence && (
          <div className="mt-3 space-y-2 rounded-lg bg-paper p-3">
            <p className="text-xs text-ink-soft">
              Days after issue for each step — this fee note only. Some
              relationships warrant a softer cadence.
            </p>
            <div className="grid grid-cols-3 gap-2">
              <Field label="Reminder 1">
                <input className={inputCls} inputMode="numeric" value={r1} onChange={(e) => setR1(e.target.value)} />
              </Field>
              <Field label="Reminder 2">
                <input className={inputCls} inputMode="numeric" value={r2} onChange={(e) => setR2(e.target.value)} />
              </Field>
              <Field label="Formal letter">
                <input className={inputCls} inputMode="numeric" value={fl} onChange={(e) => setFl(e.target.value)} />
              </Field>
            </div>
            {cadenceError && <p className="text-sm text-danger">{cadenceError}</p>}
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  const [a, b, c] = [r1, r2, fl].map((x) => parseInt(x, 10));
                  const timings = {
                    reminder1Days: a,
                    reminder2Days: b,
                    formalLetterDays: c,
                  };
                  const problem = validateTimings(timings);
                  if (problem) {
                    setCadenceError(problem);
                    return;
                  }
                  store.setTimingsOverride(v.fn.id, timings);
                  setShowCadence(false);
                }}
              >
                Save cadence
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  store.setTimingsOverride(v.fn.id, null);
                  setShowCadence(false);
                }}
              >
                Use global defaults
              </Button>
            </div>
          </div>
        )}
      </Card>
    </>
  );
}

function PaymentsSection({ v }: { v: FeeNoteView }) {
  const store = getStore();
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayInputValue());
  const [method, setMethod] = useState("EFT");
  const [showPlan, setShowPlan] = useState(false);
  const [planCount, setPlanCount] = useState("3");
  const [planStart, setPlanStart] = useState(todayInputValue());

  return (
    <>
      <SectionTitle>Payments</SectionTitle>
      <Card className="space-y-3">
        {v.payments.length > 0 && (
          <ul className="divide-y divide-line text-sm">
            {v.payments.map((p) => (
              <li key={p.id} className="flex justify-between py-1.5">
                <span>
                  {formatDate(p.date)} · {p.method}
                  {p.note ? ` · ${p.note}` : ""}
                </span>
                <span className="font-medium tabular-nums">
                  {formatCents(p.amountCents)}
                </span>
              </li>
            ))}
          </ul>
        )}
        {v.plan && (
          <div className="rounded-lg bg-paper p-3 text-xs text-ink-soft">
            <p className="font-medium text-ink">Payment plan</p>
            {v.plan.instalments.map((i, idx) => (
              <p key={idx}>
                {formatDate(i.dueDate)} — {formatCents(i.amountCents)}
              </p>
            ))}
          </div>
        )}
        {v.fn.state !== "SETTLED" && v.fn.state !== "WRITTEN_OFF" && (
          <>
            <div className="grid grid-cols-3 gap-2">
              <Field label="Amount (EUR)">
                <input className={inputCls} inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </Field>
              <Field label="Date">
                <input className={inputCls} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </Field>
              <Field label="Method">
                <input className={inputCls} value={method} onChange={(e) => setMethod(e.target.value)} />
              </Field>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => {
                  const cents = parseAmountToCents(amount);
                  if (cents === null || cents <= 0) return;
                  store.recordPayment({
                    feeNoteId: v.fn.id,
                    amountCents: cents,
                    date,
                    method,
                    note: "",
                  });
                  setAmount("");
                }}
              >
                Record payment
              </Button>
              <Button variant="ghost" onClick={() => setShowPlan((s) => !s)}>
                {v.plan ? "Replace payment plan" : "Set up payment plan"}
              </Button>
            </div>
            {showPlan && (
              <div className="space-y-2 rounded-lg bg-paper p-3">
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Instalments">
                    <input className={inputCls} inputMode="numeric" value={planCount} onChange={(e) => setPlanCount(e.target.value)} />
                  </Field>
                  <Field label="First due date">
                    <input className={inputCls} type="date" value={planStart} onChange={(e) => setPlanStart(e.target.value)} />
                  </Field>
                </div>
                <Button
                  onClick={() => {
                    const n = parseInt(planCount, 10);
                    if (!Number.isFinite(n) || n < 1 || n > 24) return;
                    const per = Math.floor(v.outstandingCents / n);
                    const instalments = Array.from({ length: n }, (_, i) => ({
                      dueDate: addDays(planStart, i * 30),
                      // Last instalment absorbs the rounding remainder
                      amountCents:
                        i === n - 1 ? v.outstandingCents - per * (n - 1) : per,
                    }));
                    store.createPaymentPlan(v.fn.id, instalments);
                    setShowPlan(false);
                  }}
                >
                  Create monthly plan over {planCount || "?"} instalments
                </Button>
              </div>
            )}
          </>
        )}
      </Card>
    </>
  );
}

function CorrespondenceSection({ v }: { v: FeeNoteView }) {
  const store = getStore();
  const [body, setBody] = useState("");
  const [subject, setSubject] = useState("");

  return (
    <>
      <SectionTitle>Correspondence</SectionTitle>
      <Card className="space-y-3">
        {v.correspondence.length === 0 ? (
          <p className="text-sm text-ink-soft">
            No correspondence yet. Chases sent by the ladder land here
            automatically; log inbound replies so the chronology stays complete.
          </p>
        ) : (
          <ul className="space-y-2">
            {v.correspondence.map((c) => (
              <li
                key={c.id}
                className={`rounded-lg p-3 text-sm ${
                  c.direction === "INBOUND"
                    ? "bg-rose-50"
                    : "bg-brand-light"
                }`}
              >
                <p className="text-[11px] text-ink-soft">
                  {c.direction === "INBOUND" ? "From" : "To"}{" "}
                  {c.direction === "INBOUND" ? c.from : c.to} ·{" "}
                  {formatDateTime(c.at)}
                </p>
                <p className="mt-0.5 font-medium">{c.subject}</p>
                <p className="mt-1 whitespace-pre-wrap text-xs text-ink-soft">
                  {c.body}
                </p>
              </li>
            ))}
          </ul>
        )}
        <div className="space-y-2 border-t border-line pt-3">
          <Field label="Log an inbound reply (subject)">
            <input className={inputCls} value={subject} onChange={(e) => setSubject(e.target.value)} />
          </Field>
          <textarea
            className={inputCls}
            rows={2}
            placeholder="Paste the solicitor's reply…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <Button
            variant="secondary"
            onClick={() => {
              if (!subject.trim() && !body.trim()) return;
              store.addCorrespondence({
                feeNoteId: v.fn.id,
                direction: "INBOUND",
                from: v.contact?.email ?? v.firm?.name ?? "unknown",
                to: "",
                subject: subject || "(no subject)",
                body,
              });
              setSubject("");
              setBody("");
            }}
          >
            Log inbound
          </Button>
        </div>
      </Card>
    </>
  );
}

function ChronologySection({ v, db }: { v: FeeNoteView; db: Db }) {
  const chronology = buildChronology(
    v.fn,
    v.steps,
    v.correspondence,
    v.payments,
    db.audit,
  );
  return (
    <>
      <SectionTitle>Chronology (audit log)</SectionTitle>
      <Card>
        <p className="mb-2 text-xs text-ink-soft">
          Append-only. This is the evidence base for any Bar referral or LSRA
          complaint — packs are generated from it, never reconstructed.
        </p>
        <ol className="space-y-1.5 border-l border-line pl-3 text-xs">
          {chronology.map((e, i) => (
            <li key={i}>
              <span className="text-ink-faint">{formatDateTime(e.at)}</span>{" "}
              <span className="font-medium">{e.summary}</span>
              {e.detail && <span className="text-ink-soft"> — {e.detail}</span>}
            </li>
          ))}
        </ol>
      </Card>
    </>
  );
}
