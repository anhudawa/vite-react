/**
 * Fee note email parsing — shared types plus the deterministic fallback
 * extractor used in demo mode (no API key). The production path runs the
 * same extraction through the Claude API (src/app/api/parse-fee-note) and
 * both feed the same review screen: nothing AI-extracted is ever saved
 * without the barrister confirming it field by field.
 */

import { parseAmountToCents } from "./money";
import { parseImportDate } from "./csv";

export interface ParsedFeeNote {
  firmName: string;
  contactName: string;
  contactEmail: string;
  matterTitle: string;
  matterReference: string;
  /** Euros as a display string, e.g. "2,500.00" — confirmed by the user. */
  amount: string;
  issueDate: string; // ISO yyyy-mm-dd or "" when not found
  workDescription: string;
  /** Which engine produced this draft, shown on the review screen. */
  source: "claude" | "heuristic";
}

export const EMPTY_PARSE: ParsedFeeNote = {
  firmName: "",
  contactName: "",
  contactEmail: "",
  matterTitle: "",
  matterReference: "",
  amount: "",
  issueDate: "",
  workDescription: "",
  source: "heuristic",
};

/**
 * Best-effort extraction from a pasted/forwarded fee note email.
 * Deliberately conservative: a blank field the user fills in beats a
 * confidently wrong one.
 */
export function heuristicParse(text: string): ParsedFeeNote {
  const result: ParsedFeeNote = { ...EMPTY_PARSE };

  // Largest euro amount in the text is almost always the fee.
  let best = 0;
  for (const m of text.matchAll(/€\s*([\d.,]*\d)/g)) {
    const cents = parseAmountToCents(m[1]);
    if (cents !== null && cents > best) best = cents;
  }
  if (best > 0) result.amount = (best / 100).toFixed(2);

  // "Re:" line → matter title; trailing parenthetical/ref token → reference.
  const re = text.match(/^\s*(?:subject:\s*)?(?:fwd?:\s*)?re:\s*(.+)$/im);
  if (re) {
    let title = re[1].trim();
    const ref = title.match(/[([]\s*(?:ref|reference)[.:\s]*([\w/-]+)\s*[)\]]/i);
    if (ref) {
      result.matterReference = ref[1];
      title = title.replace(ref[0], "").trim();
    }
    result.matterTitle = title.replace(/\s*[-–—]\s*fee note.*$/i, "").trim();
  }

  if (!result.matterReference) {
    const ref = text.match(/\b(?:our|your)\s+ref(?:erence)?[.:\s]+([\w/-]{2,20})/i);
    if (ref) result.matterReference = ref[1];
  }

  // First plausible date (dd/mm/yyyy or yyyy-mm-dd).
  const dateMatch = text.match(/\b(\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2})\b/);
  if (dateMatch) result.issueDate = parseImportDate(dateMatch[1]) ?? "";

  // First email address that isn't the platform's own forwarding address.
  for (const email of text.matchAll(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g)) {
    if (!/@in\.feenote\./i.test(email[0])) {
      result.contactEmail = email[0].toLowerCase();
      break;
    }
  }

  // Firm name: a single line mentioning Solicitors/LLP/"& Co".
  const firm = text.match(
    /^[^\S\n]*([A-Z][\w'&. -]{2,60}(?:Solicitors|Solicitor|LLP|& Co\.?|and Co\.?))[^\S\n]*$/m,
  );
  if (firm) result.firmName = firm[1].trim();

  // "Dear X," salutation → contact name (from a reply), or signature line.
  const dear = text.match(/\bdear\s+([A-Z][a-z]+(?:\s+[A-Z][a-z'-]+)?)/i);
  if (dear && !/sirs?|madam/i.test(dear[1])) result.contactName = dear[1].trim();

  return result;
}
