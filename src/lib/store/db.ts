import {
  AuditEntry,
  Correspondence,
  DEFAULT_TIMINGS,
  EscalationStep,
  FeeNote,
  Matter,
  Payment,
  PaymentPlan,
  SolicitorContact,
  SolicitorFirm,
  Template,
  UserProfile,
} from "@/lib/domain/types";
import { DEFAULT_TEMPLATES } from "@/lib/domain/templates";

/**
 * The full client-side database shape. In production this maps 1:1 onto the
 * Supabase schema (supabase/migrations/0001_init.sql) with RLS as the
 * tenancy boundary; the local store exists so the product works end-to-end
 * in demo mode and so the domain layer stays storage-agnostic.
 */
export interface Db {
  schemaVersion: 1;
  profile: UserProfile;
  firms: SolicitorFirm[];
  contacts: SolicitorContact[];
  matters: Matter[];
  feeNotes: FeeNote[];
  steps: EscalationStep[];
  payments: Payment[];
  paymentPlans: PaymentPlan[];
  templates: Template[];
  correspondence: Correspondence[];
  /** Append-only — the store never updates or removes entries. */
  audit: AuditEntry[];
  feeNoteSeq: number;
}

export function newId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function emptyDb(): Db {
  const now = new Date().toISOString();
  return {
    schemaVersion: 1,
    profile: {
      id: newId(),
      fullName: "",
      email: "",
      lawLibraryNo: "",
      vatNo: "",
      bankDetails: "",
      address: "",
      timings: { ...DEFAULT_TIMINGS },
    },
    firms: [],
    contacts: [],
    matters: [],
    feeNotes: [],
    steps: [],
    payments: [],
    paymentPlans: [],
    templates: DEFAULT_TEMPLATES.map((t) => ({ ...t, id: newId(), updatedAt: now })),
    correspondence: [],
    audit: [],
    feeNoteSeq: 1,
  };
}
