"use client";

/** Derived read models joining fee notes to matters/firms/payments —
 * what the list and detail screens actually render. */

import { Db } from "@/lib/store/db";
import {
  Correspondence,
  EscalationStep,
  FeeNote,
  Matter,
  Payment,
  PaymentPlan,
  SolicitorContact,
  SolicitorFirm,
} from "@/lib/domain/types";
import { proposeNextAction, ProposedAction } from "@/lib/domain/escalation";
import { daysSince } from "@/lib/domain/dates";
import { isOutstandingState, outstandingCents } from "@/lib/domain/ageing";

export interface FeeNoteView {
  fn: FeeNote;
  matter: Matter | null;
  firm: SolicitorFirm | null;
  contact: SolicitorContact | null;
  paidCents: number;
  outstandingCents: number;
  ageDays: number;
  proposed: ProposedAction | null;
  steps: EscalationStep[];
  payments: Payment[];
  correspondence: Correspondence[];
  plan: PaymentPlan | null;
}

export function paidCentsByFeeNote(db: Db): Map<string, number> {
  const map = new Map<string, number>();
  for (const p of db.payments) {
    map.set(p.feeNoteId, (map.get(p.feeNoteId) ?? 0) + p.amountCents);
  }
  return map;
}

export function feeNoteView(db: Db, fn: FeeNote): FeeNoteView {
  const matter = db.matters.find((m) => m.id === fn.matterId) ?? null;
  const firm = matter
    ? (db.firms.find((f) => f.id === matter.firmId) ?? null)
    : null;
  const contact = matter
    ? (db.contacts.find((c) => c.id === matter.contactId) ?? null)
    : null;
  const payments = db.payments
    .filter((p) => p.feeNoteId === fn.id)
    .sort((a, b) => a.date.localeCompare(b.date));
  const paid = payments.reduce((s, p) => s + p.amountCents, 0);
  return {
    fn,
    matter,
    firm,
    contact,
    paidCents: paid,
    outstandingCents: outstandingCents(fn, paid),
    ageDays: daysSince(fn.issueDate),
    proposed: proposeNextAction(fn, db.profile.timings),
    steps: db.steps
      .filter((s) => s.feeNoteId === fn.id)
      .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt)),
    payments,
    correspondence: db.correspondence
      .filter((c) => c.feeNoteId === fn.id)
      .sort((a, b) => a.at.localeCompare(b.at)),
    plan: db.paymentPlans.find((p) => p.feeNoteId === fn.id) ?? null,
  };
}

export function allViews(db: Db): FeeNoteView[] {
  return db.feeNotes
    .map((fn) => feeNoteView(db, fn))
    .sort((a, b) => b.ageDays - a.ageDays);
}

export function outstandingViews(db: Db): FeeNoteView[] {
  return allViews(db).filter(
    (v) => isOutstandingState(v.fn) && v.outstandingCents > 0,
  );
}

/** Fee notes whose proposed step is due and waiting on the approval gate. */
export function awaitingApproval(db: Db): FeeNoteView[] {
  return outstandingViews(db).filter(
    (v) =>
      (v.proposed?.kind === "SEND_STEP" &&
        v.proposed.due &&
        v.proposed.requiresApproval) ||
      v.proposed?.kind === "RECOVERY_DECISION",
  );
}

export interface FirmRollup {
  firm: SolicitorFirm;
  outstandingCents: number;
  noteCount: number;
  oldestAgeDays: number;
}

export function firmRollups(db: Db): FirmRollup[] {
  const rollups = new Map<string, FirmRollup>();
  for (const firm of db.firms) {
    rollups.set(firm.id, { firm, outstandingCents: 0, noteCount: 0, oldestAgeDays: 0 });
  }
  for (const v of outstandingViews(db)) {
    if (!v.firm) continue;
    const r = rollups.get(v.firm.id);
    if (!r) continue;
    r.outstandingCents += v.outstandingCents;
    r.noteCount += 1;
    r.oldestAgeDays = Math.max(r.oldestAgeDays, v.ageDays);
  }
  return [...rollups.values()].sort(
    (a, b) => b.outstandingCents - a.outstandingCents,
  );
}
