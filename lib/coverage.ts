import type { ArticleMode, Pillar } from "./content";

/**
 * Coverage matrix — pure, build-time computations for /coverage.
 * Every function takes a plain array of piece metadata so the logic can be
 * exercised without importing the MDX registry. No hand-typed numbers.
 */

/** The subset of EssayMeta the coverage computations need. */
export interface CoveragePiece {
  slug: string;
  title: string;
  pillar?: Pillar;
  mode?: ArticleMode;
  tags?: string[];
  date: string; // ISO
}

/** Column order for the matrix — mirrors the ArticleMode union. */
export const MODES: ArticleMode[] = ["feature", "guide", "review", "dispatch"];

/** A piece with no explicit mode publishes as a feature (see `sectionOf`). */
export function effectiveMode(mode?: ArticleMode): ArticleMode {
  return mode ?? "feature";
}

export interface MatrixRow {
  pillar: Pillar;
  /** Count per mode, in MODES order. */
  cells: number[];
  total: number;
}

export interface Matrix {
  rows: MatrixRow[];
  /** Column totals, in MODES order. */
  modeTotals: number[];
  /** Pieces counted into the grid (i.e. carrying a pillar). */
  total: number;
  /** Pieces with no pillar — outside the grid, reported honestly. */
  unassigned: number;
}

export function buildMatrix(pieces: CoveragePiece[], pillars: Pillar[]): Matrix {
  const rows: MatrixRow[] = pillars.map((pillar) => {
    const cells = MODES.map(
      (mode) =>
        pieces.filter((p) => p.pillar === pillar && effectiveMode(p.mode) === mode)
          .length,
    );
    return { pillar, cells, total: cells.reduce((a, b) => a + b, 0) };
  });
  const modeTotals = MODES.map((_, i) =>
    rows.reduce((sum, r) => sum + r.cells[i], 0),
  );
  const total = rows.reduce((sum, r) => sum + r.total, 0);
  return { rows, modeTotals, total, unassigned: pieces.length - total };
}

export interface Gap {
  pillar: Pillar;
  mode: ArticleMode;
}

/** Every empty pillar × mode intersection, in display order. */
export function findGaps(matrix: Matrix): Gap[] {
  const gaps: Gap[] = [];
  for (const row of matrix.rows) {
    row.cells.forEach((count, i) => {
      if (count === 0) gaps.push({ pillar: row.pillar, mode: MODES[i] });
    });
  }
  return gaps;
}

/* --- Sport coverage -------------------------------------------------------- */

/**
 * A deliberately simple keyword map: a piece covers a sport when any keyword
 * appears in its title or tags (case-insensitive substring). Crude on purpose —
 * the point is honest zeroes, not perfect recall.
 */
export const SPORT_KEYWORDS: { sport: string; keywords: string[] }[] = [
  {
    sport: "cycling",
    keywords: ["cycling", "tour de france", "time trial", "hour record", "peloton"],
  },
  { sport: "running", keywords: ["running", "marathon", "minute mile", "track"] },
  { sport: "triathlon", keywords: ["triathlon", "ironman"] },
  { sport: "swimming", keywords: ["swim", "open water"] },
  { sport: "ultra / trail", keywords: ["ultra", "trail", "fkt", "utmb"] },
  { sport: "rowing", keywords: ["rowing", "regatta", "boat race"] },
  { sport: "climbing", keywords: ["climbing", "mountaineering", "alpinism", "everest"] },
];

export interface SportCount {
  sport: string;
  count: number;
}

export function sportCoverage(pieces: CoveragePiece[]): SportCount[] {
  return SPORT_KEYWORDS.map(({ sport, keywords }) => ({
    sport,
    count: pieces.filter((p) => {
      const haystack = [p.title, ...(p.tags ?? [])].join(" ").toLowerCase();
      return keywords.some((k) => haystack.includes(k));
    }).length,
  }));
}

/* --- Freshness -------------------------------------------------------------- */

export interface MonthCount {
  /** Sortable key, e.g. "2026-06". */
  key: string;
  /** Human label, e.g. "June 2026". */
  label: string;
  count: number;
}

/** Essays per month of `meta.date`, ascending. */
export function byMonth(pieces: CoveragePiece[]): MonthCount[] {
  const buckets = new Map<string, number>();
  for (const p of pieces) {
    const key = p.date.slice(0, 7);
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  return [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, count]) => ({
      key,
      label: new Date(`${key}-01T00:00:00Z`).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }),
      count,
    }));
}
