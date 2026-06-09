import { describe, expect, it } from "vitest";
import { formatCentsCompact, parseAmountToCents } from "../money";

describe("parseAmountToCents", () => {
  it("parses plain and thousands-grouped amounts", () => {
    expect(parseAmountToCents("2500")).toBe(250000);
    expect(parseAmountToCents("2,500.00")).toBe(250000);
    expect(parseAmountToCents("€1,250,000.50")).toBe(125000050);
    expect(parseAmountToCents(" 950.5 ")).toBe(95050);
  });

  it("rejects ambiguous comma-decimal input rather than misreading it", () => {
    // European "1,50" means €1.50 — silently parsing it as €150 loses money.
    expect(parseAmountToCents("1,50")).toBeNull();
    expect(parseAmountToCents("1.000,50")).toBeNull();
    expect(parseAmountToCents("12,34.56")).toBeNull();
  });

  it("rejects junk", () => {
    expect(parseAmountToCents("")).toBeNull();
    expect(parseAmountToCents("abc")).toBeNull();
    expect(parseAmountToCents("12.345")).toBeNull();
    expect(parseAmountToCents("-50")).toBeNull();
  });
});

describe("formatCentsCompact", () => {
  it("compacts large amounts and keeps small ones exact", () => {
    expect(formatCentsCompact(2740000)).toBe("€27.4k");
    expect(formatCentsCompact(95000)).toBe("€950");
  });
});
