import type { Confidence, DisplayFact } from "@/lib/verification";
import { acquisitionOf, valueLine } from "@/lib/economics";
import styles from "./FactBlock.module.css";

// Kept for backwards-compatible imports.
export type { Confidence };
export type Fact = DisplayFact;

const ROWS: { key: keyof Fact; label: string }[] = [
  { key: "athlete", label: "Athlete" },
  { key: "watch", label: "Watch" },
  { key: "relation", label: "Relation" },
  { key: "evidence", label: "Evidence" },
];

/**
 * THE FACT BLOCK — the credibility signature. A spec plate on a movement:
 * precise, sourced, set largely in the technical mono. It appears on hundreds
 * of pages, so it is restrained and reusable. The Lume accent is reserved for
 * a single confidence tick.
 */
export function FactBlock({ fact, as = "aside" }: { fact: Fact; as?: "aside" | "div" }) {
  const Tag = as;
  const dots =
    fact.confidence === "High" ? 3 : fact.confidence === "Medium" ? 2 : 1;
  const acq = acquisitionOf(fact.relation);
  const value = valueLine(fact);

  return (
    <Tag className={styles.block} aria-label="Sourced fact">
      <header className={styles.head}>
        <span className={styles.kicker}>Sourced fact</span>
        {fact.reference && <span className={styles.ref}>{fact.reference}</span>}
      </header>

      <div className={styles.stance} data-stance={acq.stance}>
        <span className={styles.stanceLabel}>{acq.label}</span>
        {value && (
          <span className={styles.stanceValue}>
            {value}
            <span className={styles.stanceValueNote}>est.</span>
          </span>
        )}
      </div>

      <dl className={styles.rows}>
        {ROWS.map(({ key, label }) => (
          <div className={styles.row} key={key}>
            <dt className={styles.label}>{label}</dt>
            <dd className={styles.value}>{fact[key] as string}</dd>
          </div>
        ))}

        <div className={`${styles.row} ${styles.confRow}`}>
          <dt className={styles.label}>Confidence</dt>
          <dd className={styles.value}>
            <span className={styles.dots} aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={styles.dot}
                  data-on={i < dots || undefined}
                />
              ))}
            </span>
            <span className={styles.confText}>
              {fact.confidence}
              {fact.confidenceNote ? ` · ${fact.confidenceNote}` : ""}
            </span>
          </dd>
        </div>
      </dl>
    </Tag>
  );
}
