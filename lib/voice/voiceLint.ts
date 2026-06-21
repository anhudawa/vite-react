/**
 * VOICE GUARDRAIL — pattern-matching only, no LLM, no auto-rewrite.
 *
 * Scans a string of draft text (blog/AEO/episode notes/newsletter/social) and
 * returns structured findings for the machine-detectable parts of
 * `content/voice/VOICE.md`: banned words, banned openers / contrarian hooks, and
 * the detectable structural tells (em-dash overuse, repeated "It isn't X. It's
 * Y." constructions, paragraph-length uniformity, whitespace-styled fragments).
 *
 * It reports — it never edits. Findings carry the rule, the offending term, a
 * severity, and a location so a reviewer (or CI) can act. Runs on drafts before
 * they reach the human verification queue.
 */

export type VoiceSeverity = "error" | "warning";

export type VoiceRule =
  | "banned-word"
  | "banned-opener"
  | "contrarian-hook"
  | "em-dash-density"
  | "em-dash-sentence"
  | "antithesis-repetition"
  | "paragraph-uniformity"
  | "fragmented-paragraphs";

export interface VoiceFinding {
  rule: VoiceRule;
  severity: VoiceSeverity;
  /** The offending text, or a short descriptor for structural findings. */
  term: string;
  /** Human-readable explanation of what's wrong. */
  message: string;
  line: number; // 1-based
  column: number; // 1-based
  /** A trimmed snippet around the hit, for quick scanning. */
  excerpt: string;
}

// ── lexicon ──────────────────────────────────────────────────────────────────
// Apostrophes vary (straight ' , curly ’ , backtick ` ); [’'`]? tolerates them.
const BANNED_WORDS: { term: string; re: RegExp; note?: string }[] = [
  { term: "delve", re: /\bdelv(?:e|es|ed|ing)\b/gi },
  { term: "unpack", re: /\bunpack(?:s|ed|ing)?\b/gi },
  { term: "multifaceted", re: /\bmulti-?faceted\b/gi },
  { term: "in today's world", re: /\bin today[’'`]?s world\b/gi },
  { term: "it's worth noting", re: /\bit[’'`]?s worth noting\b/gi },
  { term: "straightforward", re: /\bstraightforward\b/gi },
  { term: "game-changer", re: /\bgame[-\s]?changer\b/gi },
  { term: "leverage", re: /\bleverag(?:e|es|ed|ing)\b/gi, note: "banned as a verb" },
  { term: "robust", re: /\brobust\b/gi },
  { term: "synergy", re: /\bsynerg(?:y|ies)\b/gi },
  { term: "at its core", re: /\bat its core\b/gi },
  { term: "at the end of the day", re: /\bat the end of the day\b/gi },
  { term: "journey", re: /\bjourney(?:s)?\b/gi },
  { term: "unlock your potential", re: /\bunlock your potential\b/gi },
  { term: "elevate", re: /\belevat(?:e|es|ed|ing)\b/gi },
];

const BANNED_OPENERS: { term: string; re: RegExp }[] = [
  { term: "Here's what nobody tells you", re: /\bhere[’'`]?s what nobody tells you\b/gi },
  { term: "the [X] won't tell you", re: /\bthe\b[^.?!\n]{0,40}\bwon[’'`]?t tell you\b/gi },
  { term: "let me break this down", re: /\blet me break (?:this|it) down\b/gi },
  { term: "stick around to the end", re: /\bstick around (?:to|until|for) the end\b/gi },
];

const CONTRARIAN_HOOKS: { term: string; re: RegExp }[] = [
  {
    term: "Everyone … they're wrong",
    re: /\beveryone\b[^.?!\n]{0,80}[.?!]\s+(?:they[’'`]?re|that[’'`]?s|you[’'`]?re)\s+wrong\b/gi,
  },
  { term: "the truth nobody admits", re: /\bthe truth (?:nobody|no one)\s+(?:admits|tells|wants)\b/gi },
];

// "It isn't X. It's Y." — both clauses lead with "it"; tolerate is/was forms.
const ANTITHESIS =
  /\bit(?:[’'`]?s not|\s+is not|\s+isn[’'`]?t|\s+wasn[’'`]?t|\s+was not)\b[^.?!\n]*[.?!]+\s+it(?:[’'`]?s|\s+is|\s+was)\b/gi;

const EM_DASH = /—/g; // —
const EM_DASH_PER_WORDS = 1 / 60; // density threshold

// ── location helpers ─────────────────────────────────────────────────────────
function lineStarts(text: string): number[] {
  const starts = [0];
  for (let i = 0; i < text.length; i++) if (text[i] === "\n") starts.push(i + 1);
  return starts;
}

function locate(text: string, index: number, starts: number[]) {
  let line = 1;
  for (let i = 0; i < starts.length; i++) {
    if (starts[i] <= index) line = i + 1;
    else break;
  }
  const column = index - starts[line - 1] + 1;
  const raw = text.slice(Math.max(0, index - 24), index + 56);
  const excerpt = raw.replace(/\s+/g, " ").trim();
  return { line, column, excerpt };
}

function wordCount(text: string): number {
  return (text.match(/\S+/g) || []).length;
}

// ── the lint ─────────────────────────────────────────────────────────────────
export function lintVoice(text: string): VoiceFinding[] {
  const findings: VoiceFinding[] = [];
  const starts = lineStarts(text);
  const firstSentenceEnd = (() => {
    const m = /[.?!]/.exec(text);
    return m ? m.index : text.length;
  })();
  const push = (
    rule: VoiceRule,
    severity: VoiceSeverity,
    term: string,
    message: string,
    index: number,
  ) => {
    const { line, column, excerpt } = locate(text, index, starts);
    findings.push({ rule, severity, term, message, line, column, excerpt });
  };

  const scan = (
    rules: { term: string; re: RegExp; note?: string }[],
    rule: VoiceRule,
    severity: VoiceSeverity,
    describe: (term: string, note?: string, atOpening?: boolean) => string,
  ) => {
    for (const { term, re, note } of rules) {
      re.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = re.exec(text)) !== null) {
        const atOpening = m.index <= firstSentenceEnd;
        push(rule, severity, m[0], describe(term, note, atOpening), m.index);
        if (m.index === re.lastIndex) re.lastIndex++; // guard zero-width
      }
    }
  };

  // banned words
  scan(BANNED_WORDS, "banned-word", "error", (term, note) =>
    note ? `Banned word “${term}” (${note}).` : `Banned word “${term}”.`,
  );

  // banned openers / contrarian hooks (errors; worse when they open the piece)
  scan(BANNED_OPENERS, "banned-opener", "error", (term, _n, atOpening) =>
    atOpening
      ? `Banned opener “${term}” — and it opens the piece. Start from the watch, the moment, or the person.`
      : `Banned phrase “${term}”.`,
  );
  scan(CONTRARIAN_HOOKS, "contrarian-hook", "error", (term, _n, atOpening) =>
    `Contrarian “hook” construction (${term})${atOpening ? " opening the piece" : ""}. This voice flows from substance, not a contrarian setup.`,
  );

  // "It isn't X. It's Y." — only a problem when repeated (2+)
  {
    ANTITHESIS.lastIndex = 0;
    const hits: number[] = [];
    let m: RegExpExecArray | null;
    while ((m = ANTITHESIS.exec(text)) !== null) {
      hits.push(m.index);
      if (m.index === ANTITHESIS.lastIndex) ANTITHESIS.lastIndex++;
    }
    if (hits.length >= 2) {
      for (const idx of hits) {
        push(
          "antithesis-repetition",
          "warning",
          "It isn't X. It's Y.",
          `Parallel “It isn't X. It's Y.” construction (${hits.length} in this piece). Two or more reads as engineered rhythm.`,
          idx,
        );
      }
    }
  }

  // em-dash overuse — density across the piece, and >2 in one sentence.
  // A single matched pair around an aside is good writing, not overuse, so the
  // density rule needs 3+ em-dashes before it fires; the per-sentence rule still
  // catches 3+ stacked in one sentence.
  {
    const total = (text.match(EM_DASH) || []).length;
    const words = wordCount(text);
    if (total >= 3 && words > 0 && total / words > EM_DASH_PER_WORDS) {
      const first = text.indexOf("—");
      push(
        "em-dash-density",
        "warning",
        "—",
        `Em-dash overuse: ${total} em-dashes across ~${words} words (over the ~1-per-60 ceiling).`,
        first < 0 ? 0 : first,
      );
    }
    // per-sentence
    const sentenceRe = /[^.?!\n]+[.?!]*/g;
    let s: RegExpExecArray | null;
    while ((s = sentenceRe.exec(text)) !== null) {
      const dashes = (s[0].match(EM_DASH) || []).length;
      if (dashes > 2) {
        push(
          "em-dash-sentence",
          "warning",
          "—",
          `${dashes} em-dashes in a single sentence (max 2).`,
          s.index,
        );
      }
      if (s.index === sentenceRe.lastIndex) sentenceRe.lastIndex++;
    }
  }

  // paragraph-shape tells
  {
    const paras: { text: string; index: number }[] = [];
    const re = /[^\n]+(?:\n(?!\s*\n)[^\n]+)*/g; // blocks separated by blank lines
    let p: RegExpExecArray | null;
    while ((p = re.exec(text)) !== null) {
      const t = p[0].trim();
      if (t) paras.push({ text: t, index: p.index });
    }

    if (paras.length >= 5) {
      const lens = paras.map((x) => wordCount(x.text));
      const mean = lens.reduce((a, b) => a + b, 0) / lens.length;
      const variance = lens.reduce((a, b) => a + (b - mean) ** 2, 0) / lens.length;
      const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;
      if (cv < 0.15) {
        push(
          "paragraph-uniformity",
          "warning",
          "uniform paragraphs",
          `Every paragraph is about the same length (${paras.length} paragraphs, low variance). Vary the breathing — this reads as engineered rhythm.`,
          paras[0].index,
        );
      }
    }

    // whitespace-styled fragments: many one-sentence paragraphs in a row
    if (paras.length >= 4) {
      const singles = paras.filter((x) => (x.text.match(/[.?!]+/g) || []).length <= 1);
      const avgWords = paras.reduce((a, b) => a + wordCount(b.text), 0) / paras.length;
      if (singles.length / paras.length >= 0.75 && avgWords < 20) {
        push(
          "fragmented-paragraphs",
          "warning",
          "single-sentence paragraphs",
          `${singles.length} of ${paras.length} paragraphs are single short sentences. Heavy whitespace between one-line paragraphs reads as a sales page, not a story.`,
          paras[0].index,
        );
      }
    }
  }

  findings.sort((a, b) => a.line - b.line || a.column - b.column);
  return findings;
}

export function hasErrors(findings: VoiceFinding[]): boolean {
  return findings.some((f) => f.severity === "error");
}

/** Compact one-line-per-finding summary, used by the CLI and in test output. */
export function summarizeFindings(findings: VoiceFinding[]): string {
  if (findings.length === 0) return "No voice findings.";
  return findings
    .map((f) => `${f.line}:${f.column} [${f.severity}] ${f.rule}: ${f.message}`)
    .join("\n");
}
