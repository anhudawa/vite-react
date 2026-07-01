/**
 * CORPUS-LEVEL STOCK-PHRASE GUARDRAIL — pattern-matching only, no LLM, no
 * auto-rewrite.
 *
 * The per-piece linter (`voiceLint.ts`) can't see cross-essay repetition:
 * a signature phrase reads fine in one piece and becomes a tic across seven.
 * This module counts configured phrases across the WHOLE corpus and flags any
 * that exceed its ceiling, so editorial QA can spread the good lines out
 * instead of letting them calcify into house slop.
 *
 * It reports — it never edits. Ceilings are a ratchet: when a phrase is
 * already over on the live corpus it gets grandfathered at the current count,
 * to be ratcheted down as essays are revised.
 */

export interface CorpusPhrase {
  term: string;
  /** Must be a global regex — countAcrossCorpus relies on /g iteration. */
  re: RegExp;
  maxUses: number;
  note?: string;
}

export interface CorpusFinding {
  term: string;
  /** Total occurrences across every unit. */
  count: number;
  maxUses: number;
  /** Labels of the units the phrase appears in (one entry per unit). */
  locations: string[];
}

// ── lexicon ──────────────────────────────────────────────────────────────────
// Apostrophes vary (straight ' , curly ’ , backtick ` ); [’'`]? tolerates them.
export const PHRASES: CorpusPhrase[] = [
  {
    term: "the receipt",
    re: /\bthe receipts?\b/gi,
    maxUses: 3,
    note: "the watch-as-receipt metaphor — the house line, worn thin by repetition",
  },
  {
    term: "metered out",
    re: /\bmetered out\b/gi,
    maxUses: 3,
    note: "signature verb phrase for time/effort dispensed in measured doses",
  },
  {
    term: "record of a moment that cost years",
    re: /\brecord of a moment that cost years\b/gi,
    maxUses: 1, // ratcheted to target 2026-07-01 — the manifesto keeps the line; others paraphrase
    note: "a closer, not a refrain — one essay gets it",
  },
  {
    term: "honest judge",
    re: /\bhonest judge\b/gi,
    maxUses: 2,
    note: "the watch-as-arbiter figure",
  },
  {
    term: "keeps honest time",
    re: /\bkeeps? honest time\b/gi,
    maxUses: 2,
    note: "sibling of “honest judge” — same figure, different clothes",
  },
  {
    term: "you are an oscillator",
    re: /\byou are an oscillator\b/gi,
    maxUses: 1,
    note: "the body-as-movement conceit — singular by design",
  },
  {
    term: "finite reserve",
    re: /\bfinite reserves?\b/gi,
    maxUses: 1, // ratcheted 2026-07-01 — the-same-machine is the canonical resonance piece; sole use
    note: "power-reserve-as-body metaphor",
  },
];

export interface CorpusUnit {
  label: string;
  text: string;
}

// ── the sweep ────────────────────────────────────────────────────────────────
export function countAcrossCorpus(
  units: CorpusUnit[],
  phrases: CorpusPhrase[] = PHRASES,
): CorpusFinding[] {
  const findings: CorpusFinding[] = [];
  for (const { term, re, maxUses } of phrases) {
    let count = 0;
    const locations: string[] = [];
    for (const { label, text } of units) {
      re.lastIndex = 0;
      let hits = 0;
      let m: RegExpExecArray | null;
      while ((m = re.exec(text)) !== null) {
        hits++;
        if (m.index === re.lastIndex) re.lastIndex++; // guard zero-width
      }
      if (hits > 0) {
        count += hits;
        locations.push(label);
      }
    }
    findings.push({ term, count, maxUses, locations });
  }
  return findings;
}

export function hasCeilingBreaches(findings: CorpusFinding[]): boolean {
  return findings.some((f) => f.count > f.maxUses);
}

/** Compact one-line-per-phrase summary, used by the CLI and in test output. */
export function summarizeCorpusFindings(findings: CorpusFinding[]): string {
  if (findings.length === 0) return "No corpus findings.";
  return findings
    .map(
      (f) =>
        `${f.count > f.maxUses ? "OVER" : "ok"} “${f.term}”: ${f.count}/${f.maxUses}` +
        (f.locations.length ? ` (${f.locations.join(", ")})` : ""),
    )
    .join("\n");
}
