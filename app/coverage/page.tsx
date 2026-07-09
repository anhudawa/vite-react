import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { essays } from "@/content/essays/registry";
import { pillarList, PILLARS } from "@/lib/pillars";
import {
  MODES,
  buildMatrix,
  byMonth,
  findGaps,
  sportCoverage,
  type CoveragePiece,
} from "@/lib/coverage";
import styles from "./coverage.module.css";

export const metadata: Metadata = {
  title: "Coverage",
  description: "Internal coverage matrix — where the pieces are, and where they aren't.",
  robots: { index: false, follow: false },
};

export default function CoveragePage() {
  const pieces: CoveragePiece[] = essays.map(
    ({ slug, title, pillar, mode, tags, date }) => ({
      slug,
      title,
      pillar,
      mode,
      tags,
      date,
    }),
  );

  const matrix = buildMatrix(
    pieces,
    pillarList.map((p) => p.slug),
  );
  const gaps = findGaps(matrix);
  const sports = sportCoverage(pieces);
  const months = byMonth(pieces);
  const maxMonth = Math.max(...months.map((m) => m.count), 1);

  return (
    <>
      <PageHeader
        index="—"
        kicker="Internal"
        title="Coverage"
        intro={`The matrix, computed from the registry at build time — ${pieces.length} pieces. Nothing on this page is typed by hand; a gap here is a gap in fact.`}
      />

      {/* PILLARS × MODES */}
      <section className={`container ${styles.section}`} aria-labelledby="cov-matrix">
        <h2 id="cov-matrix" className={styles.h}>
          Pillars × modes
        </h2>
        <table className={styles.matrix}>
          <thead>
            <tr>
              <th scope="col" className={styles.rowHead}>
                Pillar
              </th>
              {MODES.map((m) => (
                <th key={m} scope="col" className={styles.cell}>
                  {m}
                </th>
              ))}
              <th scope="col" className={styles.cellTotal}>
                Σ
              </th>
            </tr>
          </thead>
          <tbody>
            {matrix.rows.map((row) => (
              <tr key={row.pillar}>
                <th scope="row" className={styles.rowHead}>
                  {PILLARS[row.pillar].short}
                </th>
                {row.cells.map((count, i) => (
                  <td key={MODES[i]} className={styles.cell}>
                    {count === 0 ? (
                      <span className={styles.gapFlag} aria-label="no pieces">
                        —
                      </span>
                    ) : (
                      count
                    )}
                  </td>
                ))}
                <td className={styles.cellTotal}>{row.total}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" className={styles.rowHead}>
                Σ
              </th>
              {matrix.modeTotals.map((count, i) => (
                <td key={MODES[i]} className={styles.cellTotal}>
                  {count}
                </td>
              ))}
              <td className={styles.cellTotal}>{matrix.total}</td>
            </tr>
          </tfoot>
        </table>
        {matrix.unassigned > 0 && (
          <p className={styles.note}>
            {matrix.unassigned} piece{matrix.unassigned === 1 ? "" : "s"} without a
            pillar, outside the grid.
          </p>
        )}
      </section>

      {/* SPORT COVERAGE */}
      <section className={`container ${styles.section}`} aria-labelledby="cov-sport">
        <h2 id="cov-sport" className={styles.h}>
          Sport coverage
        </h2>
        <p className={styles.lede}>
          Keyword match against titles and tags. Zeroes are the finding.
        </p>
        <ul className={styles.sports}>
          {sports.map((s) => (
            <li key={s.sport} className={styles.sport}>
              <span className={styles.sportLabel}>{s.sport}</span>
              <span className={s.count === 0 ? styles.gapFlag : styles.sportCount}>
                {s.count}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* FRESHNESS */}
      <section className={`container ${styles.section}`} aria-labelledby="cov-fresh">
        <h2 id="cov-fresh" className={styles.h}>
          Freshness
        </h2>
        <p className={styles.lede}>Pieces by month of publication.</p>
        <div className={styles.months}>
          {months.map((m) => (
            <div key={m.key} className={styles.monthRow}>
              <span className={styles.monthLabel}>{m.label}</span>
              <span className={styles.monthCount}>{m.count}</span>
              <span className={styles.monthBar} aria-hidden="true">
                <span
                  className={styles.monthBarFill}
                  style={{ width: `${(m.count / maxMonth) * 100}%` }}
                />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* GAPS */}
      <section className={`container ${styles.section}`} aria-labelledby="cov-gaps">
        <h2 id="cov-gaps" className={styles.h}>
          Gaps
        </h2>
        <p className={styles.lede}>
          Every empty pillar × mode intersection. {gaps.length} of{" "}
          {matrix.rows.length * MODES.length} cells.
        </p>
        <ul className={styles.gaps}>
          {gaps.map((g) => (
            <li key={`${g.pillar}-${g.mode}`} className={styles.gap}>
              {g.pillar} × {g.mode}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
