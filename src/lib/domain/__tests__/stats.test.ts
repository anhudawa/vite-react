import { describe, expect, it } from "vitest";
import { computeFirmStats, daysToPay, meanDaysToPay, paymentBandLabel } from "../stats";
import { addDays, todayISO } from "../dates";
import { FeeNote, FeeNoteState, Payment } from "../types";

function note(id: string, ageDays: number, amountCents: number, state: FeeNoteState): FeeNote {
  return {
    id,
    number: id,
    matterId: "m",
    amountCents,
    currency: "EUR",
    issueDate: addDays(todayISO(), -ageDays),
    workDescription: "",
    state,
    stateBeforeDispute: null,
    timingsOverride: null,
    paused: false,
    skippedSteps: [],
    createdAt: new Date().toISOString(),
  };
}

function payment(feeNoteId: string, amountCents: number, daysAfterIssue: number, issueAgeDays: number): Payment {
  return {
    id: `${feeNoteId}-p`,
    feeNoteId,
    amountCents,
    date: addDays(todayISO(), -issueAgeDays + daysAfterIssue),
    method: "EFT",
    note: "",
  };
}

describe("daysToPay", () => {
  it("uses the payment that clears the balance, supporting partials", () => {
    const fn = note("a", 100, 100000, "SETTLED");
    const payments = [
      payment("a", 40000, 20, 100),
      payment("a", 60000, 50, 100),
    ];
    expect(daysToPay(fn, payments)).toBe(50);
  });

  it("returns null while unpaid", () => {
    const fn = note("a", 100, 100000, "REMINDER_2");
    expect(daysToPay(fn, [payment("a", 40000, 20, 100)])).toBeNull();
  });
});

describe("computeFirmStats", () => {
  it("aggregates paid history and outstanding exposure", () => {
    const notes = [
      note("a", 100, 100000, "SETTLED"),
      note("b", 80, 200000, "SETTLED"),
      note("c", 40, 300000, "REMINDER_1"),
    ];
    const payments = [
      payment("a", 100000, 30, 100),
      payment("b", 200000, 60, 80),
      payment("c", 100000, 10, 40), // part payment on outstanding note
    ];
    const stats = computeFirmStats(notes, payments);
    expect(stats.paidCount).toBe(2);
    expect(meanDaysToPay(stats)).toBe(45);
    expect(stats.outstandingValueCents).toBe(200000);
    expect(paymentBandLabel(stats)).toBe("Typically pays in 30–60 days");
  });

  it("bands an empty history honestly", () => {
    const stats = computeFirmStats([], []);
    expect(meanDaysToPay(stats)).toBeNull();
    expect(paymentBandLabel(stats)).toBe("No payment history yet");
  });
});
