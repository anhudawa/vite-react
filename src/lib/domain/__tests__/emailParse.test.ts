import { describe, expect, it } from "vitest";
import { heuristicParse } from "../emailParse";

const SAMPLE = `Fwd: Re: O'Brien v Galtee Logistics Ltd (ref MH-2241) — fee note

Dear Claire,

Please find attached my fee note dated 14/03/2026 in the above matter,
covering drafting of the personal injuries summons and advice on proofs.

Fee: €2,500.00 (plus VAT where applicable)

Kind regards,
Aoife Brennan BL

--
Claire Hogan
Murphy & Hogan Solicitors
chogan@murphyhogan.ie`;

describe("heuristicParse", () => {
  it("extracts the key fields from a typical forwarded fee note", () => {
    const parsed = heuristicParse(SAMPLE);
    expect(parsed.amount).toBe("2500.00");
    expect(parsed.issueDate).toBe("2026-03-14");
    expect(parsed.matterTitle).toContain("O'Brien v Galtee Logistics");
    expect(parsed.matterReference).toBe("MH-2241");
    expect(parsed.contactEmail).toBe("chogan@murphyhogan.ie");
    expect(parsed.firmName).toBe("Murphy & Hogan Solicitors");
    expect(parsed.contactName).toBe("Claire");
    expect(parsed.source).toBe("heuristic");
  });

  it("picks the largest euro amount as the fee", () => {
    const parsed = heuristicParse("Stamp duty €50. Brief fee €3,200. Copies €12.50.");
    expect(parsed.amount).toBe("3200.00");
  });

  it("leaves fields blank rather than guessing", () => {
    const parsed = heuristicParse("Hello, just checking in about that thing.");
    expect(parsed.amount).toBe("");
    expect(parsed.firmName).toBe("");
    expect(parsed.issueDate).toBe("");
  });

  it("ignores the platform's own forwarding address", () => {
    const parsed = heuristicParse("Sent to aw-7f3k@in.feenote.ie\nFrom: dq@reillyquinn.ie");
    expect(parsed.contactEmail).toBe("dq@reillyquinn.ie");
  });
});
