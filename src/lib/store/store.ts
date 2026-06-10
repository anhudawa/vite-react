"use client";

/**
 * Client-side store: localStorage persistence, audit-logged mutations,
 * React subscription via useSyncExternalStore.
 *
 * Every mutation goes through `mutate`, which persists and notifies.
 * Every meaningful action appends to the audit log — the chronology is
 * the product; packs are generated from this log, not reconstructed.
 */

import { useSyncExternalStore } from "react";
import {
  EscalationStepType,
  EscalationTimings,
  FeeNote,
  Matter,
  PaymentPlanInstalment,
  SolicitorContact,
  SolicitorFirm,
  Template,
  TemplateKind,
  UserProfile,
} from "@/lib/domain/types";
import * as ladder from "@/lib/domain/escalation";
import { computeFirmStats, EMPTY_FIRM_STATS } from "@/lib/domain/stats";
import { ImportedFeeNote } from "@/lib/domain/csv";
import { MergeContext, renderForFeeNote } from "@/lib/domain/templates";
import { daysSince, todayISO } from "@/lib/domain/dates";
import { outstandingCents } from "@/lib/domain/ageing";
import { canCreateBarReferral } from "@/lib/domain/pack";
import { Db, emptyDb, newId } from "./db";
import { seedDemoData } from "./seed";

const STORAGE_KEY = "feenote.db.v1";

type Listener = () => void;

class Store {
  private db: Db;
  private listeners = new Set<Listener>();

  constructor() {
    this.db = this.load();
    this.processDueAutomaticSteps();
  }

  private load(): Db {
    if (typeof window === "undefined") return emptyDb();
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as Db;
    } catch {
      // Corrupt local data — start clean rather than crash the app.
    }
    return emptyDb();
  }

  getSnapshot = (): Db => this.db;

  subscribe = (fn: Listener): (() => void) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };

  private mutate(fn: (db: Db) => void): void {
    const next: Db = structuredClone(this.db);
    fn(next);
    this.db = next;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
    this.listeners.forEach((l) => l());
  }

  private log(db: Db, feeNoteId: string | null, action: string, detail = "") {
    db.audit.push({
      id: newId(),
      at: new Date().toISOString(),
      feeNoteId,
      action,
      detail,
    });
  }

  private refreshFirmStats(db: Db, firmId: string) {
    const firm = db.firms.find((f) => f.id === firmId);
    if (!firm) return;
    const matterIds = new Set(
      db.matters.filter((m) => m.firmId === firmId).map((m) => m.id),
    );
    const firmNotes = db.feeNotes.filter((fn) => matterIds.has(fn.matterId));
    firm.stats = computeFirmStats(firmNotes, db.payments);
  }

  // -------------------------------------------------------------------------
  // Setup / onboarding
  // -------------------------------------------------------------------------

  loadDemoData(): void {
    this.mutate((db) => {
      seedDemoData(db);
      this.log(db, null, "DEMO_DATA_LOADED", "Demo dataset seeded");
      for (const firm of db.firms) this.refreshFirmStats(db, firm.id);
    });
    this.processDueAutomaticSteps();
  }

  resetAll(): void {
    this.mutate((db) => {
      Object.assign(db, emptyDb());
    });
  }

  updateProfile(patch: Partial<UserProfile>): void {
    this.mutate((db) => {
      Object.assign(db.profile, patch);
      this.log(db, null, "PROFILE_UPDATED", Object.keys(patch).join(", "));
    });
  }

  updateGlobalTimings(timings: EscalationTimings): void {
    this.mutate((db) => {
      db.profile.timings = timings;
      this.log(
        db,
        null,
        "TIMINGS_UPDATED",
        `Reminder 1 day ${timings.reminder1Days}, reminder 2 day ${timings.reminder2Days}, formal letter day ${timings.formalLetterDays}`,
      );
    });
  }

  // -------------------------------------------------------------------------
  // Firms / contacts / matters
  // -------------------------------------------------------------------------

  findOrCreateFirm(db: Db, name: string): SolicitorFirm {
    const existing = db.firms.find(
      (f) => f.name.trim().toLowerCase() === name.trim().toLowerCase(),
    );
    if (existing) return existing;
    const firm: SolicitorFirm = {
      id: newId(),
      name: name.trim(),
      address: "",
      stats: { ...EMPTY_FIRM_STATS },
    };
    db.firms.push(firm);
    this.log(db, null, "FIRM_CREATED", firm.name);
    return firm;
  }

  findOrCreateContact(
    db: Db,
    firmId: string,
    name: string,
    email: string,
  ): SolicitorContact | null {
    if (!name && !email) return null;
    const existing = db.contacts.find(
      (c) =>
        c.firmId === firmId &&
        (c.email && email
          ? c.email.toLowerCase() === email.toLowerCase()
          : c.name.toLowerCase() === name.toLowerCase()),
    );
    if (existing) return existing;
    const contact: SolicitorContact = {
      id: newId(),
      firmId,
      name: name || email,
      email,
      phone: "",
    };
    db.contacts.push(contact);
    return contact;
  }

  createMatter(input: {
    firmName: string;
    contactName: string;
    contactEmail: string;
    title: string;
    reference: string;
  }): string {
    let matterId = "";
    this.mutate((db) => {
      const firm = this.findOrCreateFirm(db, input.firmName);
      const contact = this.findOrCreateContact(
        db,
        firm.id,
        input.contactName,
        input.contactEmail,
      );
      const matter: Matter = {
        id: newId(),
        firmId: firm.id,
        contactId: contact?.id ?? "",
        title: input.title,
        reference: input.reference,
        section150: null,
      };
      db.matters.push(matter);
      matterId = matter.id;
      this.log(db, null, "MATTER_CREATED", `${matter.title} (${firm.name})`);
    });
    return matterId;
  }

  issueSection150(matterId: string): void {
    this.mutate((db) => {
      const matter = db.matters.find((m) => m.id === matterId);
      if (!matter) return;
      matter.section150 = {
        issuedAt: new Date().toISOString(),
        deliveryConfirmedAt: null,
        clarificationRequests: [],
      };
      this.log(db, null, "SECTION_150_ISSUED", `Matter ${matter.title}`);
    });
  }

  confirmSection150Delivery(matterId: string): void {
    this.mutate((db) => {
      const matter = db.matters.find((m) => m.id === matterId);
      if (!matter?.section150) return;
      matter.section150.deliveryConfirmedAt = new Date().toISOString();
      this.log(db, null, "SECTION_150_DELIVERY_CONFIRMED", `Matter ${matter.title}`);
    });
  }

  // -------------------------------------------------------------------------
  // Fee notes
  // -------------------------------------------------------------------------

  createFeeNote(input: {
    matterId: string;
    amountCents: number;
    issueDate: string;
    workDescription: string;
    asDraft: boolean;
  }): string {
    let id = "";
    this.mutate((db) => {
      const fn: FeeNote = {
        id: newId(),
        number: `FN-${db.feeNoteSeq++}`,
        matterId: input.matterId,
        amountCents: input.amountCents,
        currency: "EUR",
        issueDate: input.issueDate,
        workDescription: input.workDescription,
        state: input.asDraft ? "DRAFT" : "ISSUED",
        stateBeforeDispute: null,
        timingsOverride: null,
        paused: false,
        skippedSteps: [],
        createdAt: new Date().toISOString(),
      };
      db.feeNotes.push(fn);
      id = fn.id;
      this.log(
        db,
        fn.id,
        input.asDraft ? "FEE_NOTE_DRAFTED" : "FEE_NOTE_ISSUED",
        `${fn.number} for ${(fn.amountCents / 100).toFixed(2)} EUR, issue date ${fn.issueDate}`,
      );
      const matter = db.matters.find((m) => m.id === fn.matterId);
      if (matter) this.refreshFirmStats(db, matter.firmId);
    });
    this.processDueAutomaticSteps();
    return id;
  }

  importFeeNotes(rows: ImportedFeeNote[]): number {
    let imported = 0;
    this.mutate((db) => {
      for (const row of rows) {
        const firm = this.findOrCreateFirm(db, row.firmName);
        const contact = this.findOrCreateContact(
          db,
          firm.id,
          row.contactName,
          row.contactEmail,
        );
        let matter = db.matters.find(
          (m) =>
            m.firmId === firm.id &&
            ((row.matterReference && m.reference === row.matterReference) ||
              m.title.toLowerCase() === row.matterTitle.toLowerCase()),
        );
        if (!matter) {
          matter = {
            id: newId(),
            firmId: firm.id,
            contactId: contact?.id ?? "",
            title: row.matterTitle,
            reference: row.matterReference,
            section150: null,
          };
          db.matters.push(matter);
        }
        const fn: FeeNote = {
          id: newId(),
          number: `FN-${db.feeNoteSeq++}`,
          matterId: matter.id,
          amountCents: row.amountCents,
          currency: "EUR",
          issueDate: row.issueDate,
          workDescription: row.workDescription,
          state: "ISSUED",
          stateBeforeDispute: null,
          timingsOverride: null,
          paused: false,
          skippedSteps: [],
          createdAt: new Date().toISOString(),
        };
        db.feeNotes.push(fn);
        this.log(
          db,
          fn.id,
          "FEE_NOTE_IMPORTED",
          `${fn.number} (${firm.name}) issue date ${fn.issueDate}`,
        );
        imported++;
      }
      for (const firm of db.firms) this.refreshFirmStats(db, firm.id);
    });
    this.processDueAutomaticSteps();
    return imported;
  }

  issueFeeNote(feeNoteId: string): void {
    this.applyTransition(feeNoteId, "FEE_NOTE_ISSUED", (fn) => ladder.issue(fn));
    this.processDueAutomaticSteps();
  }

  // -------------------------------------------------------------------------
  // Escalation ladder
  // -------------------------------------------------------------------------

  /**
   * REMINDER_1 is the only auto-sendable rung (handover §4.4): when due and
   * not paused/disputed, the system sends it without a gate. Called on app
   * load and after relevant mutations — in production this is a scheduled
   * job; here it runs whenever the app wakes.
   */
  processDueAutomaticSteps(): void {
    const now = new Date();
    const due = this.db.feeNotes.filter((fn) => {
      const action = ladder.proposeNextAction(fn, this.db.profile.timings, now);
      return (
        action?.kind === "SEND_STEP" &&
        action.step === "REMINDER_1" &&
        action.due &&
        !action.requiresApproval
      );
    });
    for (const fn of due) {
      try {
        this.sendStep(fn.id, "REMINDER_1", false);
      } catch (e) {
        // One bad record must not abort the sweep (or app startup, which
        // runs this from the constructor). mutate() discards its clone on
        // throw, so the store is still consistent.
        console.error(`Auto-send failed for fee note ${fn.id}:`, e);
      }
    }
  }

  /** One-tap approval gate: approve and send in a single action. */
  approveAndSendStep(feeNoteId: string, step: EscalationStepType): void {
    this.sendStep(feeNoteId, step, true);
  }

  private sendStep(
    feeNoteId: string,
    step: EscalationStepType,
    approved: boolean,
  ): void {
    this.mutate((db) => {
      const idx = db.feeNotes.findIndex((f) => f.id === feeNoteId);
      if (idx === -1) return;
      const fn = db.feeNotes[idx];

      if (step === "BAR_REFERRAL_PACK" && !canCreateBarReferral(db.feeNotes)) {
        throw new ladder.TransitionError(
          "The Bar's fee recovery service caps active referrals at 3 — settle or withdraw one first.",
        );
      }

      const updated = ladder.markStepSent(fn, step, approved);
      const nowIso = new Date().toISOString();

      const template = this.templateForStep(db, step);
      const ctx = this.mergeContextFor(db, updated);
      const rendered =
        template && ctx ? renderForFeeNote(template, ctx) : null;

      db.steps.push({
        id: newId(),
        feeNoteId,
        stepType: step,
        status: "SENT",
        scheduledAt: nowIso,
        sentAt: nowIso,
        templateId: template?.id ?? null,
        templateVersion: template?.version ?? null,
        userApprovedAt: approved ? nowIso : null,
        deliveryMeta: "demo-mode: outbound email simulated",
      });

      if (rendered && ctx) {
        db.correspondence.push({
          id: newId(),
          feeNoteId,
          direction: "OUTBOUND",
          at: nowIso,
          from: db.profile.email || "practice@feenote.local",
          to: ctx.contact?.email || ctx.firm.name,
          subject: rendered.subject,
          body: rendered.body,
        });
      }

      db.feeNotes[idx] = updated;
      this.log(
        db,
        feeNoteId,
        `STEP_SENT_${step}`,
        approved
          ? `Sent with explicit user approval at ${nowIso}`
          : "Sent automatically on schedule (reminder 1)",
      );

      // After the formal letter the ladder hands over to the recovery gate.
      if (step === "FORMAL_LETTER") {
        db.feeNotes[idx] = ladder.enterRecoveryDecision(db.feeNotes[idx]);
        this.log(
          db,
          feeNoteId,
          "RECOVERY_DECISION_REACHED",
          "Formal letter sent; awaiting user decision on Bar referral or LSRA complaint",
        );
      }
    });
  }

  pauseLadder(feeNoteId: string, paused: boolean): void {
    this.applyTransition(
      feeNoteId,
      paused ? "LADDER_PAUSED" : "LADDER_RESUMED",
      (fn) => ladder.setPaused(fn, paused),
    );
    if (!paused) this.processDueAutomaticSteps();
  }

  skipStep(feeNoteId: string, step: EscalationStepType): void {
    this.mutate((db) => {
      const idx = db.feeNotes.findIndex((f) => f.id === feeNoteId);
      if (idx === -1) return;
      db.feeNotes[idx] = ladder.skipStep(db.feeNotes[idx], step);
      db.steps.push({
        id: newId(),
        feeNoteId,
        stepType: step,
        status: "SKIPPED",
        scheduledAt: new Date().toISOString(),
        sentAt: null,
        templateId: null,
        templateVersion: null,
        userApprovedAt: new Date().toISOString(),
        deliveryMeta: null,
      });
      this.log(db, feeNoteId, `STEP_SKIPPED_${step}`, "Skipped by user");
    });
  }

  setTimingsOverride(feeNoteId: string, timings: EscalationTimings | null): void {
    this.mutate((db) => {
      const fn = db.feeNotes.find((f) => f.id === feeNoteId);
      if (!fn) return;
      fn.timingsOverride = timings;
      this.log(
        db,
        feeNoteId,
        "TIMINGS_OVERRIDE",
        timings
          ? `Per-note cadence: ${timings.reminder1Days}/${timings.reminder2Days}/${timings.formalLetterDays} days`
          : "Reverted to global cadence",
      );
    });
  }

  markDisputed(feeNoteId: string, note: string): void {
    this.applyTransition(feeNoteId, "DISPUTED", (fn) => ladder.dispute(fn), note);
  }

  resolveDispute(feeNoteId: string): void {
    this.applyTransition(feeNoteId, "DISPUTE_RESOLVED", (fn) =>
      ladder.resolveDispute(fn),
    );
  }

  settle(feeNoteId: string): void {
    this.applyTransition(feeNoteId, "SETTLED", (fn) => ladder.settle(fn));
  }

  writeOff(feeNoteId: string): void {
    this.applyTransition(feeNoteId, "WRITTEN_OFF", (fn) => ladder.writeOff(fn));
  }

  private applyTransition(
    feeNoteId: string,
    action: string,
    fn: (note: FeeNote) => FeeNote,
    detail = "",
  ): void {
    this.mutate((db) => {
      const idx = db.feeNotes.findIndex((f) => f.id === feeNoteId);
      if (idx === -1) return;
      db.feeNotes[idx] = fn(db.feeNotes[idx]);
      this.log(db, feeNoteId, action, detail);
      const matter = db.matters.find((m) => m.id === db.feeNotes[idx].matterId);
      if (matter) this.refreshFirmStats(db, matter.firmId);
    });
  }

  // -------------------------------------------------------------------------
  // Payments
  // -------------------------------------------------------------------------

  recordPayment(input: {
    feeNoteId: string;
    amountCents: number;
    date: string;
    method: string;
    note: string;
  }): void {
    this.mutate((db) => {
      db.payments.push({ id: newId(), ...input });
      this.log(
        db,
        input.feeNoteId,
        "PAYMENT_RECORDED",
        `${(input.amountCents / 100).toFixed(2)} EUR on ${input.date} (${input.method})`,
      );
      const idx = db.feeNotes.findIndex((f) => f.id === input.feeNoteId);
      if (idx === -1) return;
      const fn = db.feeNotes[idx];
      const paid = db.payments
        .filter((p) => p.feeNoteId === fn.id)
        .reduce((s, p) => s + p.amountCents, 0);
      if (
        paid >= fn.amountCents &&
        fn.state !== "SETTLED" &&
        fn.state !== "WRITTEN_OFF" &&
        fn.state !== "DRAFT"
      ) {
        db.feeNotes[idx] = ladder.settle(fn);
        this.log(db, fn.id, "SETTLED", "Paid in full");
      }
      const matter = db.matters.find((m) => m.id === fn.matterId);
      if (matter) this.refreshFirmStats(db, matter.firmId);
    });
  }

  createPaymentPlan(feeNoteId: string, instalments: PaymentPlanInstalment[]): void {
    this.mutate((db) => {
      db.paymentPlans = db.paymentPlans.filter((p) => p.feeNoteId !== feeNoteId);
      db.paymentPlans.push({
        id: newId(),
        feeNoteId,
        instalments,
        createdAt: new Date().toISOString(),
      });
      this.log(
        db,
        feeNoteId,
        "PAYMENT_PLAN_CREATED",
        `${instalments.length} instalment(s)`,
      );
    });
  }

  // -------------------------------------------------------------------------
  // Correspondence + templates
  // -------------------------------------------------------------------------

  addCorrespondence(input: {
    feeNoteId: string;
    direction: "INBOUND" | "OUTBOUND";
    from: string;
    to: string;
    subject: string;
    body: string;
  }): void {
    this.mutate((db) => {
      db.correspondence.push({
        id: newId(),
        at: new Date().toISOString(),
        ...input,
      });
      this.log(
        db,
        input.feeNoteId,
        `CORRESPONDENCE_${input.direction}`,
        input.subject,
      );
    });
  }

  updateTemplate(id: string, subject: string, body: string): void {
    this.mutate((db) => {
      const t = db.templates.find((t) => t.id === id);
      if (!t) return;
      t.subject = subject;
      t.body = body;
      t.version += 1;
      t.updatedAt = new Date().toISOString();
      this.log(db, null, "TEMPLATE_UPDATED", `${t.name} → v${t.version}`);
    });
  }

  private templateForStep(db: Db, step: EscalationStepType): Template | null {
    const kind: TemplateKind | null =
      step === "REMINDER_1" || step === "REMINDER_2" || step === "FORMAL_LETTER"
        ? step
        : null;
    if (!kind) return null;
    return db.templates.find((t) => t.kind === kind) ?? null;
  }

  mergeContextFor(db: Db, fn: FeeNote): MergeContext | null {
    const matter = db.matters.find((m) => m.id === fn.matterId);
    if (!matter) return null;
    const firm = db.firms.find((f) => f.id === matter.firmId);
    if (!firm) return null;
    const contact = db.contacts.find((c) => c.id === matter.contactId) ?? null;
    const paid = db.payments
      .filter((p) => p.feeNoteId === fn.id)
      .reduce((s, p) => s + p.amountCents, 0);
    return {
      user: db.profile,
      feeNote: fn,
      matter,
      firm,
      contact,
      ageDays: daysSince(fn.issueDate),
      outstandingCents: outstandingCents(fn, paid),
    };
  }
}

// Singleton — created lazily so SSR renders against an empty store and the
// client hydrates from localStorage.
let storeInstance: Store | null = null;

export function getStore(): Store {
  if (!storeInstance) storeInstance = new Store();
  return storeInstance;
}

const serverSnapshot: Db = emptyDb();

export function useDb(): Db {
  return useSyncExternalStore(
    (fn) => getStore().subscribe(fn),
    () => getStore().getSnapshot(),
    () => serverSnapshot,
  );
}

/**
 * False during SSR and the hydration render, true once the client store is
 * live. Gating page content on this avoids the flash of empty-state content
 * before localStorage has been read.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    (fn) => getStore().subscribe(fn),
    () => true,
    () => false,
  );
}

export function todayInputValue(): string {
  return todayISO();
}
