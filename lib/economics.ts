import type { DisplayFact } from "./verification";

/**
 * THE MONEY ANGLE
 *
 * The reason to visit isn't "a watch was verified" — it's the honest answer to a
 * question people actually care about: did he *buy* this, or is he *paid* to
 * wear it, and what does it cost? We already verify the relationship; this reads
 * the stance straight out of it, so the site can lead with the story instead of
 * the machinery.
 */

export type Stance = "own-money" | "paid" | "gifted" | "loan" | "unverified";

export interface Acquisition {
  stance: Stance;
  /** the headline, in the site's plain voice */
  label: string;
  /** one-line gloss for context */
  gloss: string;
}

/** Read the acquisition stance from the verified `relation` string. */
export function acquisitionOf(relation: string): Acquisition {
  // Split on a *spaced* dash only, so hyphenated words ("Team-issued") survive.
  const head = relation.split(/\s+[—–-]\s+/)[0].trim().toLowerCase();
  switch (head) {
    case "personal":
      return {
        stance: "own-money",
        label: "Bought it himself",
        gloss: "His own money — no brand paid for this wrist.",
      };
    case "sponsored":
    case "ambassador":
    case "retailer":
      return {
        stance: "paid",
        label: "Paid to wear it",
        gloss: "A paid relationship — the watch is a placement, not a purchase.",
      };
    case "team-issued":
      return {
        stance: "paid",
        label: "Team-issued",
        gloss: "Supplied through the team's sponsor, not bought by the athlete.",
      };
    case "gifted":
      return {
        stance: "gifted",
        label: "Gifted",
        gloss: "Given, not bought — and not a standing paid relationship.",
      };
    case "loan":
      return {
        stance: "loan",
        label: "On loan",
        gloss: "Lent for the moment; it goes back.",
      };
    default:
      return {
        stance: "unverified",
        label: "Unverified",
        gloss: "How it reached the wrist isn't yet established.",
      };
  }
}

/** £155,000 → "£155,000"; rounded, no pence. */
export function formatGBP(n: number): string {
  return "£" + Math.round(n).toLocaleString("en-GB");
}

/** A short value string for a fact, or null if no value is set. */
export function valueLine(fact: DisplayFact): string | null {
  if (!fact.value) return null;
  return `~${formatGBP(fact.value.gbpApprox)}`;
}

export interface CorpusStats {
  count: number;
  totalGBP: number;
  paid: number; // paid to wear it (incl. team-issued)
  bought: number; // bought with own money
  other: number; // gifted / loan / unverified
}

/** Aggregate the money story across a set of facts — for the ledger band. */
export function corpusStats(facts: DisplayFact[]): CorpusStats {
  return facts.reduce<CorpusStats>(
    (acc, f) => {
      acc.count += 1;
      acc.totalGBP += f.value?.gbpApprox ?? 0;
      const s = acquisitionOf(f.relation).stance;
      if (s === "paid") acc.paid += 1;
      else if (s === "own-money") acc.bought += 1;
      else acc.other += 1;
      return acc;
    },
    { count: 0, totalGBP: 0, paid: 0, bought: 0, other: 0 }
  );
}

