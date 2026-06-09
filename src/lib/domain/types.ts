/**
 * Core domain types. These mirror the Supabase schema in
 * supabase/migrations/0001_init.sql — keep the two in sync.
 *
 * All money values are integer cents to avoid floating-point drift.
 * All timestamps are ISO 8601 strings (UTC).
 */

// ---------------------------------------------------------------------------
// Escalation ladder
// ---------------------------------------------------------------------------

export const FEE_NOTE_STATES = [
  "DRAFT",
  "ISSUED",
  "REMINDER_1",
  "REMINDER_2",
  "FORMAL_LETTER",
  "RECOVERY_DECISION",
  "BAR_REFERRAL_PACK",
  "LSRA_COMPLAINT_PACK",
  "SETTLED",
  "WRITTEN_OFF",
  "DISPUTED",
] as const;

export type FeeNoteState = (typeof FEE_NOTE_STATES)[number];

/** States in which the ladder is still live and can advance. */
export const ACTIVE_STATES: readonly FeeNoteState[] = [
  "ISSUED",
  "REMINDER_1",
  "REMINDER_2",
  "FORMAL_LETTER",
  "RECOVERY_DECISION",
  "BAR_REFERRAL_PACK",
  "LSRA_COMPLAINT_PACK",
];

/** Terminal states — the ladder never advances out of these. */
export const TERMINAL_STATES: readonly FeeNoteState[] = [
  "SETTLED",
  "WRITTEN_OFF",
];

export const ESCALATION_STEP_TYPES = [
  "REMINDER_1",
  "REMINDER_2",
  "FORMAL_LETTER",
  "BAR_REFERRAL_PACK",
  "LSRA_COMPLAINT_PACK",
] as const;

export type EscalationStepType = (typeof ESCALATION_STEP_TYPES)[number];

/**
 * Default day offsets from issue date for each automatic ladder step.
 * User-adjustable globally (settings) and per fee note.
 */
export interface EscalationTimings {
  reminder1Days: number;
  reminder2Days: number;
  formalLetterDays: number;
}

export const DEFAULT_TIMINGS: EscalationTimings = {
  reminder1Days: 30,
  reminder2Days: 60,
  formalLetterDays: 90,
};

// ---------------------------------------------------------------------------
// Records
// ---------------------------------------------------------------------------

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  lawLibraryNo: string;
  vatNo: string;
  /** Printed on fee note templates; changes require re-auth in production. */
  bankDetails: string;
  address: string;
  timings: EscalationTimings;
}

export interface SolicitorFirm {
  id: string;
  name: string;
  address: string;
  /** Computed per-user payment stats — accretes from day one (Phase 2 moat). */
  stats: FirmPaymentStats;
}

export interface FirmPaymentStats {
  paidCount: number;
  /** Sum of days-to-pay across settled fee notes, for a stable running mean. */
  totalDaysToPay: number;
  paidValueCents: number;
  outstandingValueCents: number;
}

export interface SolicitorContact {
  id: string;
  firmId: string;
  name: string;
  email: string;
  phone: string;
}

export interface Section150Record {
  issuedAt: string;
  deliveryConfirmedAt: string | null;
  clarificationRequests: { receivedAt: string; note: string }[];
}

export interface Matter {
  id: string;
  firmId: string;
  contactId: string;
  title: string;
  reference: string;
  section150: Section150Record | null;
}

export interface FeeNote {
  id: string;
  /** Human-facing sequence, e.g. "FN-142". */
  number: string;
  matterId: string;
  amountCents: number;
  currency: "EUR";
  issueDate: string; // ISO date (yyyy-mm-dd)
  workDescription: string;
  state: FeeNoteState;
  /** State the ladder was in when DISPUTED was entered, for resuming. */
  stateBeforeDispute: FeeNoteState | null;
  /** Per-fee-note override of the global timings; null = use global. */
  timingsOverride: EscalationTimings | null;
  /** True while the user has paused the ladder on this fee note. */
  paused: boolean;
  /** Step types the user has chosen to skip. */
  skippedSteps: EscalationStepType[];
  createdAt: string;
}

export type EscalationStepStatus =
  | "SCHEDULED" // computed/queued, not yet due
  | "AWAITING_APPROVAL" // due, blocked on the one-tap user gate
  | "SENT"
  | "SKIPPED";

export interface EscalationStep {
  id: string;
  feeNoteId: string;
  stepType: EscalationStepType;
  status: EscalationStepStatus;
  scheduledAt: string;
  sentAt: string | null;
  templateId: string | null;
  templateVersion: number | null;
  userApprovedAt: string | null;
  deliveryMeta: string | null;
}

export interface Payment {
  id: string;
  feeNoteId: string;
  amountCents: number;
  date: string;
  method: string;
  note: string;
}

export interface PaymentPlanInstalment {
  dueDate: string;
  amountCents: number;
}

export interface PaymentPlan {
  id: string;
  feeNoteId: string;
  instalments: PaymentPlanInstalment[];
  createdAt: string;
}

export type TemplateKind =
  | "REMINDER_1"
  | "REMINDER_2"
  | "FORMAL_LETTER"
  | "SECTION_150";

export interface Template {
  id: string;
  kind: TemplateKind;
  name: string;
  /** Bumped on every edit; sent steps record the version actually used. */
  version: number;
  subject: string;
  /** Body with {{merge_fields}}. */
  body: string;
  updatedAt: string;
}

export type CorrespondenceDirection = "INBOUND" | "OUTBOUND";

export interface Correspondence {
  id: string;
  feeNoteId: string;
  direction: CorrespondenceDirection;
  at: string;
  from: string;
  to: string;
  subject: string;
  body: string;
}

/**
 * Append-only. Every state change, send event and user action lands here.
 * This is the LSRA evidence base — never update or delete entries.
 */
export interface AuditEntry {
  id: string;
  at: string;
  feeNoteId: string | null;
  action: string;
  detail: string;
}

// ---------------------------------------------------------------------------
// Aggregates used by views
// ---------------------------------------------------------------------------

export const AGEING_BANDS = [
  { key: "0-30", label: "0–30 days", min: 0, max: 30 },
  { key: "31-60", label: "31–60 days", min: 31, max: 60 },
  { key: "61-90", label: "61–90 days", min: 61, max: 90 },
  { key: "91-180", label: "91–180 days", min: 91, max: 180 },
  { key: "180+", label: "180+ days", min: 181, max: Infinity },
] as const;

export type AgeingBandKey = (typeof AGEING_BANDS)[number]["key"];
