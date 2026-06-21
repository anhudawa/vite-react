import type { VerifiedFact } from "@/lib/verification";
import styles from "./FactProvenance.module.css";

/**
 * The sources, shown quietly. A native disclosure under a Fact Block: the
 * citations a reader can open and check for themselves. No scores, no badges,
 * no talk of our own process — the reporting stands on the sources, not on us
 * saying so.
 */
export function FactProvenance({ fact }: { fact: VerifiedFact }) {
  const live = fact.sources.filter((s) => s.verified);
  if (live.length === 0) return null;

  return (
    <details className={styles.wrap}>
      <summary className={styles.summary}>
        <span className={styles.summaryLabel}>Sources</span>
        <span className={styles.summaryCount}>{live.length}</span>
      </summary>

      <div className={styles.body}>
        <div className={styles.sources}>
          <ul>
            {live.map((s) => (
              <li key={s.id} className={styles.source}>
                <span className={styles.sourceTier} data-tier={s.tier}>
                  {s.tier}
                </span>
                <span className={styles.sourcePub}>
                  {s.url ? (
                    <a href={s.url} rel="nofollow noreferrer" target="_blank">
                      {s.publisher}
                    </a>
                  ) : (
                    s.publisher
                  )}
                  <span className={styles.sourceKind}> · {s.kind}</span>
                  {s.snapshot === "unarchivable" ? (
                    <span
                      className={styles.sourceArchive}
                      data-state="blocked"
                      title="Publisher blocks archiving"
                    >
                      no archive
                    </span>
                  ) : s.snapshot ? (
                    <a
                      className={styles.sourceArchive}
                      href={s.snapshot.archivedUrl}
                      rel="nofollow noreferrer"
                      target="_blank"
                      title={`Archived copy · captured ${s.snapshot.capturedAt}`}
                    >
                      archived
                    </a>
                  ) : null}
                </span>
                <span className={styles.sourceExcerpt}>“{s.excerpt}”</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </details>
  );
}
