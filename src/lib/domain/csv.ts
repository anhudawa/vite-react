/**
 * CSV import for onboarding existing aged debt (product principle 4:
 * empty dashboards kill activation). Deliberately dependency-free —
 * handles quoted fields, embedded commas/newlines and CRLF.
 */

import { parseAmountToCents } from "./money";

export function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((f) => f.trim() !== "")) rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }
  row.push(field);
  if (row.some((f) => f.trim() !== "")) rows.push(row);
  return rows;
}

export interface ImportedFeeNote {
  firmName: string;
  contactName: string;
  contactEmail: string;
  matterTitle: string;
  matterReference: string;
  amountCents: number;
  issueDate: string;
  workDescription: string;
}

export interface ImportResult {
  ok: ImportedFeeNote[];
  errors: { line: number; message: string }[];
}

const HEADER_ALIASES: Record<keyof ImportedFeeNote | "amount", string[]> = {
  firmName: ["firm", "firm name", "solicitor firm", "solicitors"],
  contactName: ["solicitor", "contact", "contact name", "solicitor name"],
  contactEmail: ["email", "contact email", "solicitor email"],
  matterTitle: ["matter", "matter title", "case", "case name"],
  matterReference: ["reference", "matter reference", "ref", "matter ref"],
  amount: ["amount", "fee", "value", "amount (eur)", "amount eur"],
  amountCents: [],
  issueDate: ["issue date", "date", "issued", "date issued"],
  workDescription: ["description", "work", "work done", "details"],
};

function buildColumnMap(header: string[]): Map<string, number> {
  const map = new Map<string, number>();
  header.forEach((raw, idx) => {
    const name = raw.trim().toLowerCase();
    for (const [field, aliases] of Object.entries(HEADER_ALIASES)) {
      if (aliases.includes(name) && !map.has(field)) map.set(field, idx);
    }
  });
  return map;
}

/** Accepts dd/mm/yyyy (Irish convention) or yyyy-mm-dd. */
export function parseImportDate(input: string): string | null {
  const trimmed = input.trim();
  let m = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) {
    const [, y, mo, d] = m;
    return isValidDate(+y, +mo, +d) ? `${y}-${mo}-${d}` : null;
  }
  m = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) {
    const [, d, mo, y] = m;
    return isValidDate(+y, +mo, +d)
      ? `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`
      : null;
  }
  return null;
}

function isValidDate(y: number, mo: number, d: number): boolean {
  const dt = new Date(Date.UTC(y, mo - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === mo - 1 &&
    dt.getUTCDate() === d
  );
}

export function parseFeeNoteImport(text: string): ImportResult {
  const rows = parseCSV(text);
  if (rows.length < 2) {
    return {
      ok: [],
      errors: [{ line: 1, message: "Need a header row and at least one data row" }],
    };
  }
  const cols = buildColumnMap(rows[0]);
  const required = ["firmName", "amount", "issueDate"] as const;
  const missing = required.filter((f) => !cols.has(f));
  if (missing.length > 0) {
    return {
      ok: [],
      errors: [
        {
          line: 1,
          message: `Missing required column(s): ${missing.join(", ")}. Required: firm, amount, issue date.`,
        },
      ],
    };
  }

  const get = (row: string[], field: string) => {
    const idx = cols.get(field);
    return idx === undefined ? "" : (row[idx] ?? "").trim();
  };

  const result: ImportResult = { ok: [], errors: [] };
  rows.slice(1).forEach((row, i) => {
    const line = i + 2;
    const firmName = get(row, "firmName");
    if (!firmName) {
      result.errors.push({ line, message: "Missing firm name" });
      return;
    }
    const amountCents = parseAmountToCents(get(row, "amount"));
    if (amountCents === null || amountCents <= 0) {
      result.errors.push({ line, message: `Invalid amount "${get(row, "amount")}"` });
      return;
    }
    const issueDate = parseImportDate(get(row, "issueDate"));
    if (!issueDate) {
      result.errors.push({
        line,
        message: `Invalid issue date "${get(row, "issueDate")}" (use dd/mm/yyyy or yyyy-mm-dd)`,
      });
      return;
    }
    result.ok.push({
      firmName,
      contactName: get(row, "contactName"),
      contactEmail: get(row, "contactEmail"),
      matterTitle: get(row, "matterTitle") || "Imported matter",
      matterReference: get(row, "matterReference"),
      amountCents,
      issueDate,
      workDescription: get(row, "workDescription"),
    });
  });
  return result;
}
