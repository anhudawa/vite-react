import { describe, expect, it } from "vitest";
import {
  receiptsByMonth,
  toCSV,
  totalReceipts,
  vatPeriods,
  yearsWithActivity,
} from "../reports";
import { Payment } from "../types";

function payment(date: string, euros: number): Payment {
  return {
    id: date + euros,
    feeNoteId: "fn",
    amountCents: Math.round(euros * 100),
    date,
    method: "EFT",
    note: "",
  };
}

const PAYMENTS = [
  payment("2026-01-15", 1000),
  payment("2026-02-03", 500),
  payment("2026-02-20", 250),
  payment("2026-11-30", 2000),
  payment("2025-06-01", 750),
];

describe("receiptsByMonth", () => {
  it("buckets receipts into the right months for the year", () => {
    const rows = receiptsByMonth(PAYMENTS, 2026);
    expect(rows[0]).toMatchObject({ month: "Jan", cents: 100000, count: 1 });
    expect(rows[1]).toMatchObject({ month: "Feb", cents: 75000, count: 2 });
    expect(rows[10]).toMatchObject({ month: "Nov", cents: 200000 });
    expect(rows[5].cents).toBe(0);
    expect(totalReceipts(PAYMENTS, 2026)).toBe(375000);
    expect(totalReceipts(PAYMENTS, 2025)).toBe(75000);
  });
});

describe("vatPeriods", () => {
  it("aggregates into bi-monthly VAT3 periods with 23% extracted", () => {
    const periods = vatPeriods(PAYMENTS, 2026);
    expect(periods).toHaveLength(6);
    expect(periods[0].label).toBe("Jan–Feb");
    expect(periods[0].grossCents).toBe(175000);
    // net = gross / 1.23, vat = gross - net
    expect(periods[0].netCents).toBe(Math.round(175000 / 1.23));
    expect(periods[0].vatCents + periods[0].netCents).toBe(175000);
    expect(periods[5].label).toBe("Nov–Dec");
    expect(periods[5].grossCents).toBe(200000);
  });
});

describe("yearsWithActivity", () => {
  it("returns distinct years, newest first", () => {
    expect(yearsWithActivity(PAYMENTS)).toEqual([2026, 2025]);
  });
});

describe("toCSV", () => {
  it("escapes quotes, commas and newlines", () => {
    const csv = toCSV(
      ["a", "b"],
      [
        ['say "hi"', "x,y"],
        ["line\nbreak", 42],
      ],
    );
    expect(csv).toBe('a,b\r\n"say ""hi""","x,y"\r\n"line\nbreak",42');
  });
});
