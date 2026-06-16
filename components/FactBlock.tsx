import styles from "./FactBlock.module.css";

export type Confidence = "High" | "Medium" | "Low";

export interface Fact {
  athlete: string;
  watch: string;
  relation: string;
  evidence: string;
  confidence: Confidence;
  confidenceNote?: string;
  reference?: string; // movement / reference number, set in mono
}

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

  return (
    <Tag className={styles.block} aria-label="Sourced fact">
      <header className={styles.head}>
        <span className={styles.kicker}>Sourced fact</span>
        {fact.reference && <span className={styles.ref}>{fact.reference}</span>}
      </header>

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
