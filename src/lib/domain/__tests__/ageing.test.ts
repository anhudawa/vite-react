import { describe, expect, it } from "vitest";
import { ageingBandFor, summariseAgeing } from "../ageing";
import { addDays, todayISO } from "../dates";
import { FeeNote, FeeNoteState } from "../types";

function note(id: string, ageDays: number, amountCents: number, state: FeeNoteState = "ISSUED"): FeeNote {
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

describe("ageingBandFor", () => {
  it("maps boundaries to the right bands", () => {
    expect(ageingBandFor(0)).toBe("0-30");
    expect(ageingBandFor(30)).toBe("0-30");
    expect(ageingBandFor(31)).toBe("31-60");
    expect(ageingBandFor(90)).toBe("61-90");
    expect(ageingBandFor(91)).toBe("91-180");
    expect(ageingBandFor(180)).toBe("91-180");
    expect(ageingBandFor(181)).toBe("180+");
    expect(ageingBandFor(2000)).toBe("180+");
  });
});

describe("summariseAgeing", () => {
  it("nets payments off and excludes settled/written-off/draft", () => {
    const notes = [
      note("a", 10, 100000),
      note("b", 45, 200000),
      note("c", 100, 300000, "SETTLED"),
      note("d", 100, 300000, "WRITTEN_OFF"),
      note("e", 5, 50000, "DRAFT"),
      note("f", 200, 400000, "DISPUTED"), // disputed money is still owed
    ];
    const paid = new Map([["b", 50000]]);
    const summary = summariseAgeing(notes, paid);
    expect(summary.totalOutstandingCents).toBe(100000 + 150000 + 400000);
    expect(summary.bands.find((b) => b.key === "0-30")?.cents).toBe(100000);
    expect(summary.bands.find((b) => b.key === "31-60")?.cents).toBe(150000);
    expect(summary.bands.find((b) => b.key === "180+")?.cents).toBe(400000);
  });

  it("drops fully paid notes even if not yet marked settled", () => {
    const summary = summariseAgeing([note("a", 10, 100000)], new Map([["a", 100000]]));
    expect(summary.totalOutstandingCents).toBe(0);
  });
});
