/**
 * Recovery pack assembly. The chronology is the product: packs are
 * generated *from the audit log and correspondence record*, never
 * reconstructed by hand.
 */

import {
  AuditEntry,
  Correspondence,
  EscalationStep,
  FeeNote,
  Matter,
  Payment,
  SolicitorContact,
  SolicitorFirm,
  UserProfile,
} from "./types";

export type PackType = "BAR_REFERRAL" | "LSRA_COMPLAINT";

export interface ChronologyEntry {
  at: string; // ISO timestamp
  kind: "AUDIT" | "CORRESPONDENCE" | "PAYMENT" | "STEP";
  summary: string;
  detail: string;
}

export interface RecoveryPack {
  type: PackType;
  generatedAt: string;
  barrister: UserProfile;
  feeNote: FeeNote;
  matter: Matter;
  firm: SolicitorFirm;
  contact: SolicitorContact | null;
  outstandingCents: number;
  chronology: ChronologyEntry[];
}

export function buildChronology(
  feeNote: FeeNote,
  steps: EscalationStep[],
  correspondence: Correspondence[],
  payments: Payment[],
  audit: AuditEntry[],
): ChronologyEntry[] {
  const entries: ChronologyEntry[] = [];

  for (const step of steps) {
    if (step.feeNoteId !== feeNote.id || step.status !== "SENT" || !step.sentAt)
      continue;
    entries.push({
      at: step.sentAt,
      kind: "STEP",
      summary: `${stepLabel(step.stepType)} sent`,
      detail: [
        step.templateId
          ? `Template ${step.templateId} v${step.templateVersion}`
          : null,
        step.userApprovedAt ? `User approved ${step.userApprovedAt}` : null,
        step.deliveryMeta,
      ]
        .filter(Boolean)
        .join(" · "),
    });
  }

  for (const c of correspondence) {
    if (c.feeNoteId !== feeNote.id) continue;
    entries.push({
      at: c.at,
      kind: "CORRESPONDENCE",
      summary:
        c.direction === "INBOUND"
          ? `Received from ${c.from}: ${c.subject}`
          : `Sent to ${c.to}: ${c.subject}`,
      detail: c.body,
    });
  }

  for (const p of payments) {
    if (p.feeNoteId !== feeNote.id) continue;
    entries.push({
      at: `${p.date}T00:00:00.000Z`,
      kind: "PAYMENT",
      summary: `Payment received`,
      detail: `${p.method}${p.note ? ` — ${p.note}` : ""}`,
    });
  }

  for (const a of audit) {
    if (a.feeNoteId !== feeNote.id) continue;
    entries.push({ at: a.at, kind: "AUDIT", summary: a.action, detail: a.detail });
  }

  return entries.sort((a, b) => a.at.localeCompare(b.at));
}

export function stepLabel(stepType: string): string {
  switch (stepType) {
    case "REMINDER_1":
      return "First reminder";
    case "REMINDER_2":
      return "Second reminder";
    case "FORMAL_LETTER":
      return "Formal aged-fee letter";
    case "BAR_REFERRAL_PACK":
      return "Bar of Ireland fee recovery referral";
    case "LSRA_COMPLAINT_PACK":
      return "LSRA complaint";
    default:
      return stepType;
  }
}

/** The Bar's fee recovery service caps active referrals at 3 per member. */
export const BAR_REFERRAL_CAP = 3;

export function activeBarReferralCount(feeNotes: FeeNote[]): number {
  return feeNotes.filter((fn) => fn.state === "BAR_REFERRAL_PACK").length;
}

export function canCreateBarReferral(feeNotes: FeeNote[]): boolean {
  return activeBarReferralCount(feeNotes) < BAR_REFERRAL_CAP;
}
