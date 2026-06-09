import { describe, expect, it } from "vitest";
import {
  validateTimings,
  dispute,
  issue,
  markStepSent,
  proposeNextAction,
  resolveDispute,
  settle,
  setPaused,
  skipStep,
  TransitionError,
  writeOff,
} from "../escalation";
import { DEFAULT_TIMINGS, FeeNote } from "../types";
import { addDays, todayISO } from "../dates";

function note(overrides: Partial<FeeNote> = {}): FeeNote {
  return {
    id: "fn1",
    number: "FN-1",
    matterId: "m1",
    amountCents: 250000,
    currency: "EUR",
    issueDate: todayISO(),
    workDescription: "",
    state: "ISSUED",
    stateBeforeDispute: null,
    timingsOverride: null,
    paused: false,
    skippedSteps: [],
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("proposeNextAction", () => {
  it("proposes reminder 1 at day 30, auto-sendable without approval", () => {
    const fn = note({ issueDate: addDays(todayISO(), -35) });
    const action = proposeNextAction(fn);
    expect(action).toMatchObject({
      kind: "SEND_STEP",
      step: "REMINDER_1",
      due: true,
      requiresApproval: false,
    });
  });

  it("everything beyond reminder 1 requires approval", () => {
    const r1 = note({ state: "REMINDER_1", issueDate: addDays(todayISO(), -70) });
    const r2 = note({ state: "REMINDER_2", issueDate: addDays(todayISO(), -100) });
    expect(proposeNextAction(r1)).toMatchObject({
      step: "REMINDER_2",
      requiresApproval: true,
    });
    expect(proposeNextAction(r2)).toMatchObject({
      step: "FORMAL_LETTER",
      requiresApproval: true,
    });
  });

  it("is not due before the scheduled day", () => {
    const fn = note({ issueDate: addDays(todayISO(), -10) });
    const action = proposeNextAction(fn);
    expect(action).toMatchObject({ step: "REMINDER_1", due: false });
  });

  it("respects per-note timing overrides", () => {
    const fn = note({
      issueDate: addDays(todayISO(), -40),
      timingsOverride: { reminder1Days: 60, reminder2Days: 90, formalLetterDays: 120 },
    });
    expect(proposeNextAction(fn)).toMatchObject({ step: "REMINDER_1", due: false });
  });

  it("proposes nothing when paused or disputed", () => {
    expect(proposeNextAction(note({ paused: true, issueDate: addDays(todayISO(), -90) }))).toBeNull();
    expect(proposeNextAction(note({ state: "DISPUTED" }))).toBeNull();
  });

  it("skipped steps fall through to the next rung", () => {
    const fn = note({
      state: "REMINDER_1",
      issueDate: addDays(todayISO(), -65),
      skippedSteps: ["REMINDER_2"],
    });
    expect(proposeNextAction(fn)).toMatchObject({ step: "FORMAL_LETTER" });
  });

  it("an entirely skipped ladder lands on the recovery gate", () => {
    const fn = note({
      skippedSteps: ["REMINDER_1", "REMINDER_2", "FORMAL_LETTER"],
    });
    expect(proposeNextAction(fn)).toEqual({ kind: "RECOVERY_DECISION" });
  });

  it("proposes the recovery gate from RECOVERY_DECISION and nothing from packs/terminal", () => {
    expect(proposeNextAction(note({ state: "RECOVERY_DECISION" }))).toEqual({
      kind: "RECOVERY_DECISION",
    });
    expect(proposeNextAction(note({ state: "BAR_REFERRAL_PACK" }))).toBeNull();
    expect(proposeNextAction(note({ state: "SETTLED" }))).toBeNull();
    expect(proposeNextAction(note({ state: "DRAFT" }))).toBeNull();
  });

  it("uses global timings when no override set", () => {
    const fn = note({ state: "REMINDER_1", issueDate: addDays(todayISO(), -45) });
    const action = proposeNextAction(fn, { ...DEFAULT_TIMINGS, reminder2Days: 40 });
    expect(action).toMatchObject({ step: "REMINDER_2", due: true });
  });
});

describe("transitions", () => {
  it("issues a draft", () => {
    expect(issue(note({ state: "DRAFT" })).state).toBe("ISSUED");
    expect(() => issue(note({ state: "ISSUED" }))).toThrow(TransitionError);
  });

  it("reminder 1 sends without approval; later steps refuse unapproved sends", () => {
    expect(markStepSent(note(), "REMINDER_1", false).state).toBe("REMINDER_1");
    expect(() =>
      markStepSent(note({ state: "REMINDER_1" }), "REMINDER_2", false),
    ).toThrow(/approval/);
    expect(
      markStepSent(note({ state: "REMINDER_1" }), "REMINDER_2", true).state,
    ).toBe("REMINDER_2");
  });

  it("never moves backwards down the ladder", () => {
    expect(() =>
      markStepSent(note({ state: "FORMAL_LETTER" }), "REMINDER_1", true),
    ).toThrow(TransitionError);
  });

  it("refuses to send while paused or disputed", () => {
    expect(() => markStepSent(note({ paused: true }), "REMINDER_1", false)).toThrow();
    expect(() =>
      markStepSent(note({ state: "DISPUTED" }), "REMINDER_1", false),
    ).toThrow();
  });

  it("packs are only reachable from the recovery gate, with approval", () => {
    const gate = note({ state: "RECOVERY_DECISION" });
    expect(markStepSent(gate, "BAR_REFERRAL_PACK", true).state).toBe("BAR_REFERRAL_PACK");
    expect(markStepSent(gate, "LSRA_COMPLAINT_PACK", true).state).toBe("LSRA_COMPLAINT_PACK");
    expect(() => markStepSent(gate, "BAR_REFERRAL_PACK", false)).toThrow(/approval/);
    expect(() =>
      markStepSent(note({ state: "REMINDER_2" }), "LSRA_COMPLAINT_PACK", true),
    ).toThrow(TransitionError);
  });

  it("dispute pauses the ladder and resumes to the prior state", () => {
    const disputed = dispute(note({ state: "REMINDER_2" }));
    expect(disputed.state).toBe("DISPUTED");
    expect(disputed.stateBeforeDispute).toBe("REMINDER_2");
    const resumed = resolveDispute(disputed);
    expect(resumed.state).toBe("REMINDER_2");
    expect(resumed.stateBeforeDispute).toBeNull();
  });

  it("settle and write-off guard their terminal pairs", () => {
    expect(settle(note({ state: "FORMAL_LETTER" })).state).toBe("SETTLED");
    expect(writeOff(note({ state: "RECOVERY_DECISION" })).state).toBe("WRITTEN_OFF");
    expect(() => settle(note({ state: "WRITTEN_OFF" }))).toThrow();
    expect(() => writeOff(note({ state: "SETTLED" }))).toThrow();
    expect(() => settle(note({ state: "DRAFT" }))).toThrow();
  });

  it("pause and skip are recorded on the note", () => {
    expect(setPaused(note(), true).paused).toBe(true);
    expect(skipStep(note(), "REMINDER_2").skippedSteps).toEqual(["REMINDER_2"]);
  });
});

describe("validateTimings", () => {
  it("accepts a strictly ascending cadence", () => {
    expect(
      validateTimings({ reminder1Days: 30, reminder2Days: 60, formalLetterDays: 90 }),
    ).toBeNull();
  });

  it("rejects out-of-order or non-positive cadences", () => {
    expect(
      validateTimings({ reminder1Days: 60, reminder2Days: 30, formalLetterDays: 90 }),
    ).toMatch(/order/);
    expect(
      validateTimings({ reminder1Days: 0, reminder2Days: 60, formalLetterDays: 90 }),
    ).toMatch(/positive/);
    expect(
      validateTimings({ reminder1Days: 30, reminder2Days: 30, formalLetterDays: 90 }),
    ).toMatch(/order/);
  });
});
