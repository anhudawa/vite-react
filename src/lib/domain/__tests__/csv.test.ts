import { describe, expect, it } from "vitest";
import { parseCSV, parseFeeNoteImport, parseImportDate } from "../csv";

describe("parseCSV", () => {
  it("handles quoted fields with commas and escaped quotes", () => {
    const rows = parseCSV('a,"b, c","say ""hi"""\r\nd,e,f\n');
    expect(rows).toEqual([
      ["a", "b, c", 'say "hi"'],
      ["d", "e", "f"],
    ]);
  });

  it("skips blank lines", () => {
    expect(parseCSV("a,b\n\n\nc,d\n")).toEqual([
      ["a", "b"],
      ["c", "d"],
    ]);
  });
});

describe("parseImportDate", () => {
  it("accepts dd/mm/yyyy and yyyy-mm-dd", () => {
    expect(parseImportDate("14/03/2026")).toBe("2026-03-14");
    expect(parseImportDate("2/1/2026")).toBe("2026-01-02");
    expect(parseImportDate("2026-03-14")).toBe("2026-03-14");
  });
  it("rejects impossible dates", () => {
    expect(parseImportDate("31/02/2026")).toBeNull();
    expect(parseImportDate("garbage")).toBeNull();
  });
});

describe("parseFeeNoteImport", () => {
  const header = "firm,solicitor,email,matter,reference,amount,issue date,description";

  it("imports valid rows with euro amounts and Irish dates", () => {
    const csv = `${header}\nMurphy & Hogan,Claire Hogan,c@mh.ie,Keane v Keane,MH-1,"2,500.00",14/03/2026,Brief fee`;
    const result = parseFeeNoteImport(csv);
    expect(result.errors).toEqual([]);
    expect(result.ok).toHaveLength(1);
    expect(result.ok[0]).toMatchObject({
      firmName: "Murphy & Hogan",
      amountCents: 250000,
      issueDate: "2026-03-14",
    });
  });

  it("reports per-row errors with line numbers and keeps good rows", () => {
    const csv = `${header}\n,x,y,m,r,100,14/03/2026,\nFirm B,x,y,m,r,not-money,14/03/2026,\nFirm C,x,y,m,r,300,14/03/2026,ok`;
    const result = parseFeeNoteImport(csv);
    expect(result.ok).toHaveLength(1);
    expect(result.ok[0].firmName).toBe("Firm C");
    expect(result.errors.map((e) => e.line)).toEqual([2, 3]);
  });

  it("fails clearly when required columns are missing", () => {
    const result = parseFeeNoteImport("foo,bar\n1,2");
    expect(result.ok).toHaveLength(0);
    expect(result.errors[0].message).toMatch(/Missing required column/);
  });
});
