/**
 * Demo dataset: a realistic junior counsel practice book, used so the
 * product can be evaluated without a Supabase project or real data.
 * Dates are computed relative to "now" so the ageing bands and ladder
 * states always look live.
 */

import {
  EscalationStepType,
  FeeNote,
  FeeNoteState,
  Matter,
  SolicitorContact,
  SolicitorFirm,
} from "@/lib/domain/types";
import { EMPTY_FIRM_STATS } from "@/lib/domain/stats";
import { addDays, todayISO } from "@/lib/domain/dates";
import { Db, newId } from "./db";

interface SeedNote {
  firm: string;
  contact: string;
  email: string;
  matter: string;
  ref: string;
  amount: number; // euros
  ageDays: number;
  state: FeeNoteState;
  work: string;
  paidEuros?: number;
  paidDaysAfterIssue?: number;
  disputed?: boolean;
}

const SEED_NOTES: SeedNote[] = [
  // Fresh work, inside 30 days
  { firm: "Murphy & Hogan Solicitors", contact: "Claire Hogan", email: "chogan@murphyhogan.ie", matter: "O'Brien v Galtee Logistics Ltd", ref: "MH-2241", amount: 2500, ageDays: 12, state: "ISSUED", work: "Drafting personal injuries summons and advice on proofs" },
  { firm: "Reilly Quinn LLP", contact: "Dara Quinn", email: "dquinn@reillyquinn.ie", matter: "Re: Estate of M. Donnelly", ref: "RQ-887", amount: 1800, ageDays: 24, state: "ISSUED", work: "Opinion on s.117 application" },
  // First reminder territory
  { firm: "Murphy & Hogan Solicitors", contact: "Claire Hogan", email: "chogan@murphyhogan.ie", matter: "Keane v Keane", ref: "MH-2198", amount: 3200, ageDays: 41, state: "REMINDER_1", work: "Brief fee, Circuit Court family law hearing 2 days" },
  { firm: "Walsh Crowley & Co.", contact: "Eoin Crowley", email: "ecrowley@walshcrowley.ie", matter: "DPP v C.M.", ref: "WC-1130", amount: 950, ageDays: 38, state: "REMINDER_1", work: "Mention and sentence hearing, Dublin Circuit Criminal Court" },
  // Second reminder
  { firm: "Reilly Quinn LLP", contact: "Sinead Reilly", email: "sreilly@reillyquinn.ie", matter: "Hartnett v Ascon Developments", ref: "RQ-902", amount: 4750, ageDays: 68, state: "REMINDER_2", work: "Drafting defence and counterclaim; consultation" },
  // Formal letter
  { firm: "Brennan Field Solicitors", contact: "Marcus Field", email: "mfield@brennanfield.ie", matter: "Lynch v Glenmore Meats Ltd", ref: "BF-449", amount: 6800, ageDays: 96, state: "FORMAL_LETTER", work: "Brief fee, High Court personal injuries action (settled at door)" },
  // Recovery gate
  { firm: "Brennan Field Solicitors", contact: "Marcus Field", email: "mfield@brennanfield.ie", matter: "Glenmore Meats — employment injunction", ref: "BF-462", amount: 5400, ageDays: 138, state: "RECOVERY_DECISION", work: "Interlocutory injunction application, two appearances" },
  // Long-tail: Bar referral active
  { firm: "Doyle Mescal & Partners", contact: "Niamh Mescal", email: "nmescal@doylemescal.ie", matter: "Carrick Quarries v Meath Co. Co.", ref: "DM-310", amount: 8200, ageDays: 240, state: "BAR_REFERRAL_PACK", work: "Judicial review — leave application and written submissions" },
  // Disputed
  { firm: "Walsh Crowley & Co.", contact: "Eoin Crowley", email: "ecrowley@walshcrowley.ie", matter: "Stapleton v Bus Éireann", ref: "WC-1098", amount: 3600, ageDays: 75, state: "DISPUTED", work: "Brief fee and opinion; quantum dispute raised on fee level", disputed: true },
  // Partially paid
  { firm: "O'Mahony Geraghty", contact: "Paul Geraghty", email: "pgeraghty@omg.ie", matter: "Re: Ballyvolane Receivership", ref: "OG-77", amount: 5200, ageDays: 55, state: "REMINDER_1", work: "Advices on receiver's powers of sale; two consultations", paidEuros: 2000, paidDaysAfterIssue: 30 },
  // Settled history (feeds days-to-pay stats)
  { firm: "Murphy & Hogan Solicitors", contact: "Claire Hogan", email: "chogan@murphyhogan.ie", matter: "Dwyer v Cityline Couriers", ref: "MH-2102", amount: 2900, ageDays: 150, state: "SETTLED", work: "Brief fee, Circuit Court PI hearing", paidEuros: 2900, paidDaysAfterIssue: 34 },
  { firm: "Reilly Quinn LLP", contact: "Dara Quinn", email: "dquinn@reillyquinn.ie", matter: "Moylan v Moylan", ref: "RQ-840", amount: 2100, ageDays: 200, state: "SETTLED", work: "Family law motion and consultation", paidEuros: 2100, paidDaysAfterIssue: 52 },
  { firm: "Doyle Mescal & Partners", contact: "Niamh Mescal", email: "nmescal@doylemescal.ie", matter: "Carrick Quarries — costs motion", ref: "DM-298", amount: 1500, ageDays: 320, state: "SETTLED", work: "Costs submissions", paidEuros: 1500, paidDaysAfterIssue: 188 },
  { firm: "O'Mahony Geraghty", contact: "Paul Geraghty", email: "pgeraghty@omg.ie", matter: "Re: Ballyvolane — directions", ref: "OG-71", amount: 1200, ageDays: 180, state: "SETTLED", work: "Directions hearing", paidEuros: 1200, paidDaysAfterIssue: 41 },
];

/** Ladder steps that must already have been sent for a note in `state`. */
function stepsAlreadySent(state: FeeNoteState): EscalationStepType[] {
  switch (state) {
    case "REMINDER_1":
      return ["REMINDER_1"];
    case "REMINDER_2":
    case "DISPUTED": // seeded dispute arose after reminder 2
      return ["REMINDER_1", "REMINDER_2"];
    case "FORMAL_LETTER":
    case "RECOVERY_DECISION":
      return ["REMINDER_1", "REMINDER_2", "FORMAL_LETTER"];
    case "BAR_REFERRAL_PACK":
      return ["REMINDER_1", "REMINDER_2", "FORMAL_LETTER", "BAR_REFERRAL_PACK"];
    default:
      return [];
  }
}

const STEP_DAY_OFFSET: Record<string, number> = {
  REMINDER_1: 30,
  REMINDER_2: 60,
  FORMAL_LETTER: 90,
  BAR_REFERRAL_PACK: 120,
};

export function seedDemoData(db: Db): void {
  db.profile.fullName = db.profile.fullName || "Aoife Brennan";
  db.profile.email = db.profile.email || "aoife.brennan@lawlibrary.ie";
  db.profile.lawLibraryNo = db.profile.lawLibraryNo || "LL4821";
  db.profile.vatNo = db.profile.vatNo || "IE6388047V";
  db.profile.address =
    db.profile.address || "The Law Library, Four Courts, Dublin 7";

  const today = todayISO();
  const firmsByName = new Map<string, SolicitorFirm>();
  const contactsByEmail = new Map<string, SolicitorContact>();

  for (const seed of SEED_NOTES) {
    let firm = firmsByName.get(seed.firm);
    if (!firm) {
      firm = {
        id: newId(),
        name: seed.firm,
        address: "",
        stats: { ...EMPTY_FIRM_STATS },
      };
      firmsByName.set(seed.firm, firm);
      db.firms.push(firm);
    }
    let contact = contactsByEmail.get(seed.email);
    if (!contact) {
      contact = {
        id: newId(),
        firmId: firm.id,
        name: seed.contact,
        email: seed.email,
        phone: "",
      };
      contactsByEmail.set(seed.email, contact);
      db.contacts.push(contact);
    }

    const issueDate = addDays(today, -seed.ageDays);
    const matter: Matter = {
      id: newId(),
      firmId: firm.id,
      contactId: contact.id,
      title: seed.matter,
      reference: seed.ref,
      section150: {
        issuedAt: `${addDays(issueDate, -7)}T09:00:00.000Z`,
        deliveryConfirmedAt: `${addDays(issueDate, -6)}T09:00:00.000Z`,
        clarificationRequests: [],
      },
    };
    db.matters.push(matter);

    const fn: FeeNote = {
      id: newId(),
      number: `FN-${db.feeNoteSeq++}`,
      matterId: matter.id,
      amountCents: Math.round(seed.amount * 100),
      currency: "EUR",
      issueDate,
      workDescription: seed.work,
      state: seed.state,
      stateBeforeDispute: seed.disputed ? "REMINDER_2" : null,
      timingsOverride: null,
      paused: false,
      skippedSteps: [],
      createdAt: `${issueDate}T10:00:00.000Z`,
    };
    db.feeNotes.push(fn);
    db.audit.push({
      id: newId(),
      at: `${issueDate}T10:00:00.000Z`,
      feeNoteId: fn.id,
      action: "FEE_NOTE_ISSUED",
      detail: `${fn.number} for ${seed.amount.toFixed(2)} EUR, issue date ${issueDate}`,
    });

    for (const step of stepsAlreadySent(seed.state)) {
      const sentDate = addDays(issueDate, STEP_DAY_OFFSET[step]);
      if (sentDate > today) continue;
      const sentAt = `${sentDate}T09:30:00.000Z`;
      const template = db.templates.find((t) => t.kind === step) ?? null;
      db.steps.push({
        id: newId(),
        feeNoteId: fn.id,
        stepType: step,
        status: "SENT",
        scheduledAt: sentAt,
        sentAt,
        templateId: template?.id ?? null,
        templateVersion: template?.version ?? null,
        userApprovedAt: step === "REMINDER_1" ? null : sentAt,
        deliveryMeta: "demo seed",
      });
      db.audit.push({
        id: newId(),
        at: sentAt,
        feeNoteId: fn.id,
        action: `STEP_SENT_${step}`,
        detail:
          step === "REMINDER_1"
            ? "Sent automatically on schedule (reminder 1)"
            : `Sent with explicit user approval at ${sentAt}`,
      });
      if (template && step !== "BAR_REFERRAL_PACK") {
        db.correspondence.push({
          id: newId(),
          feeNoteId: fn.id,
          direction: "OUTBOUND",
          at: sentAt,
          from: db.profile.email,
          to: contact.email,
          subject: `${template.name} — ${fn.number}`,
          body: `(Demo seed) ${template.name} for ${fn.number} re ${matter.title}.`,
        });
      }
    }

    if (seed.disputed) {
      const disputeAt = `${addDays(issueDate, 65)}T11:00:00.000Z`;
      db.correspondence.push({
        id: newId(),
        feeNoteId: fn.id,
        direction: "INBOUND",
        at: disputeAt,
        from: contact.email,
        to: db.profile.email,
        subject: `RE: ${fn.number} — fee level`,
        body: "Our client considers the brief fee excessive for a one-day hearing and proposes €2,400 in full and final settlement. Grateful for your views.",
      });
      db.audit.push({
        id: newId(),
        at: disputeAt,
        feeNoteId: fn.id,
        action: "DISPUTED",
        detail: "Quantum dispute raised by instructing solicitor",
      });
    }

    if (seed.paidEuros && seed.paidDaysAfterIssue !== undefined) {
      const payDate = addDays(issueDate, seed.paidDaysAfterIssue);
      db.payments.push({
        id: newId(),
        feeNoteId: fn.id,
        amountCents: Math.round(seed.paidEuros * 100),
        date: payDate,
        method: "EFT",
        note: seed.state === "SETTLED" ? "Paid in full" : "Part payment",
      });
      db.audit.push({
        id: newId(),
        at: `${payDate}T12:00:00.000Z`,
        feeNoteId: fn.id,
        action: "PAYMENT_RECORDED",
        detail: `${seed.paidEuros.toFixed(2)} EUR on ${payDate} (EFT)`,
      });
    }
  }
}
