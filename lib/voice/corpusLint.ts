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

// ── templated meta ───────────────────────────────────────────────────────────
// Second check dimension: deks and email copy cast from the same mould. The
// stock-phrase sweep counts a configured lexicon; this one needs no lexicon —
// it flags (a) the exact same FULL string reused across essays (verbatim
// duplication) and (b) the same opening words across many essays (the mould
// tell), per meta field kind.

export type MetaFieldKind = "dek" | "emailHook" | "emailOffer";

export interface MetaUnit {
  /** Essay identifier (slug) — what findings report. */
  essay: string;
  field: MetaFieldKind;
  text: string;
}

export interface TemplatedMetaFinding {
  field: MetaFieldKind;
  kind: "verbatim" | "prefix";
  /** The shared full string (verbatim) or the shared opening words (prefix). */
  shared: string;
  /** Essays that carry it. */
  essays: string[];
  /** True when the finding trips the hard gate (exit 1), not just a warning. */
  fails: boolean;
}

/**
 * House sign-offs — shared closers by design, not moulds. Verbatim checks
 * compare full strings (so a shared tail alone never matches); the prefix
 * check strips these from the end before taking the opening words, so a
 * short lead can't bleed the sign-off into its prefix.
 */
export const HOUSE_SIGNOFFS: string[] = [
  "The occasional essay, written by a fan, no hype.",
];

/** Any exact full string shared by this many essays is reported (warning). */
export const VERBATIM_WARN_MIN = 2;
/** An opening prefix shared by this many essays is reported (warning). */
export const PREFIX_WARN_MIN = 4;
/** Length of the opening prefix, in words. */
export const PREFIX_WORDS = 6;

/**
 * Hard gate: verbatim email copy duplicated across this many essays FAILS the
 * corpus sweep. Policy target is 3 for both fields. Grandfathered 2026-07-07
 * at one over the live corpus counts so the build stays green while the copy
 * is rewritten — ratchet each back to 3 once its offender below is fixed:
 *   emailHook  ×3  "The races the clock decided, in your inbox."
 *              (seventeen-hours, the-1989-tour-eight-seconds, the-longest-hour)
 *   emailOffer ×6  "Where watches and endurance genuinely meet — the timing,
 *              the craft, the heritage. The occasional essay, written by a
 *              fan, no hype."
 *              (omega-and-the-olympic-clock, seventeen-hours, sixteen-years,
 *              the-1989-tour-eight-seconds, the-longest-hour,
 *              the-number-that-doesnt-count)
 */
export const VERBATIM_FAIL_MIN: Partial<Record<MetaFieldKind, number>> = {
  emailHook: 3, // ratcheted to policy 2026-07-07 — offenders rewritten
  emailOffer: 3, // ratcheted to policy 2026-07-07 — offenders rewritten
};

export interface TemplatedMetaOptions {
  verbatimWarnMin?: number;
  prefixWarnMin?: number;
  prefixWords?: number;
  verbatimFailMin?: Partial<Record<MetaFieldKind, number>>;
  signoffs?: string[];
}

const FIELD_ORDER: MetaFieldKind[] = ["dek", "emailHook", "emailOffer"];

const normalizeWs = (s: string) => s.replace(/\s+/g, " ").trim();

/** Strip any trailing house sign-off(s), case-insensitively. */
function stripSignoffs(text: string, signoffs: string[]): string {
  let t = normalizeWs(text);
  let stripped = true;
  while (stripped) {
    stripped = false;
    for (const s of signoffs) {
      const sig = normalizeWs(s);
      if (sig && t.toLowerCase().endsWith(sig.toLowerCase())) {
        t = t.slice(0, t.length - sig.length).trim();
        stripped = true;
      }
    }
  }
  return t;
}

export function findTemplatedMeta(
  units: MetaUnit[],
  opts: TemplatedMetaOptions = {},
): TemplatedMetaFinding[] {
  const verbatimWarnMin = opts.verbatimWarnMin ?? VERBATIM_WARN_MIN;
  const prefixWarnMin = opts.prefixWarnMin ?? PREFIX_WARN_MIN;
  const prefixWords = opts.prefixWords ?? PREFIX_WORDS;
  const verbatimFailMin = opts.verbatimFailMin ?? VERBATIM_FAIL_MIN;
  const signoffs = opts.signoffs ?? HOUSE_SIGNOFFS;

  const findings: TemplatedMetaFinding[] = [];
  for (const field of FIELD_ORDER) {
    const fieldUnits = units.filter((u) => u.field === field && u.text.trim().length > 0);

    // (a) Verbatim duplication — FULL strings only (whitespace-normalized), so
    //     a shared sign-off tail never registers on its own.
    const byText = new Map<string, string[]>();
    for (const u of fieldUnits) {
      const key = normalizeWs(u.text);
      const essays = byText.get(key) ?? [];
      if (!essays.includes(u.essay)) essays.push(u.essay);
      byText.set(key, essays);
    }
    for (const [shared, essays] of byText) {
      if (essays.length < verbatimWarnMin) continue;
      const failMin = verbatimFailMin[field];
      findings.push({
        field,
        kind: "verbatim",
        shared,
        essays,
        fails: failMin !== undefined && essays.length >= failMin,
      });
    }

    // (b) Opening-prefix moulds — the sign-off is stripped from the tail first
    //     so a short lead can't collide inside the shared closer; leads with
    //     fewer than `prefixWords` words left are skipped.
    const byPrefix = new Map<string, string[]>();
    for (const u of fieldUnits) {
      const lead = stripSignoffs(u.text, signoffs);
      const words = lead.split(/\s+/).filter(Boolean);
      if (words.length < prefixWords) continue;
      const prefix = words.slice(0, prefixWords).join(" ").toLowerCase();
      const essays = byPrefix.get(prefix) ?? [];
      if (!essays.includes(u.essay)) essays.push(u.essay);
      byPrefix.set(prefix, essays);
    }
    for (const [shared, essays] of byPrefix) {
      if (essays.length < prefixWarnMin) continue;
      findings.push({ field, kind: "prefix", shared, essays, fails: false });
    }
  }
  return findings;
}

export function hasTemplatedMetaFailures(findings: TemplatedMetaFinding[]): boolean {
  return findings.some((f) => f.fails);
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
