import type { GateId, VerifiedFact } from "@/lib/verification";
import { verifyFact, nextReCheck } from "@/lib/verification";
import styles from "./FactProvenance.module.css";

// Reader-facing translation of the internal verification checks. The machinery
// stays internal; what a visitor sees is plain language about what we confirmed.
const CHECK_COPY: Record<GateId, string> = {
  "independent-sourcing": "Backed by multiple independent sources",
  "field-corroboration": "Every key detail corroborated more than once",
  "reference-integrity": "The watch and its reference check out",
  "visual-evidence": "There's a photo or footage you can see",
  "relationship-clarity": "How it reached the wrist is stated plainly",
  "adversarial-review": "Checked against anything that would contradict it",
  "confidence-threshold": "Rated only as sure as the evidence earns",
  "editorial-signoff": "Signed off by a named editor",
};

/**
 * The credibility, shown — in plain language. A native disclosure under a Fact
 * Block: what we confirmed, the sources you can open and check, the confidence
 * the evidence earned, and the editor who signed it. The internal scoring stays
 * internal; the reader sees the proof, not the machinery.
 */
export function FactProvenance({ fact }: { fact: VerifiedFact }) {
  const report = verifyFact(fact);
  const live = fact.sources.filter((s) => s.verified);
  const recheck = nextReCheck(fact);

  return (
    <details className={styles.wrap}>
      <summary className={styles.summary}>
        <span className={styles.summaryLabel}>How we checked this</span>
        <span className={styles.summaryCount}>
          {report.computedConfidence} confidence
        </span>
      </summary>

      <div className={styles.body}>
        <ol className={styles.gates}>
          {report.gates.map((g) => (
            <li key={g.id} className={styles.gate} data-pass={g.pass || undefined}>
              <span className={styles.gateMark} aria-hidden="true">
                {g.pass ? "✓" : "✗"}
              </span>
              <span className={styles.gateName}>{CHECK_COPY[g.id]}</span>
            </li>
          ))}
        </ol>

        <div className={styles.sources}>
          <p className={styles.sourcesHead}>Sources ({live.length})</p>
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
                      title="Publisher blocks archiving — this fact stands on its other, archivable sources"
                    >
                      no archive
                    </span>
                  ) : s.snapshot ? (
                    <a
                      className={styles.sourceArchive}
                      href={s.snapshot.archivedUrl}
                      rel="nofollow noreferrer"
                      target="_blank"
                      title={`Permanent archived copy · captured ${s.snapshot.capturedAt}`}
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

        <dl className={styles.meta}>
          <div>
            <dt>Confidence</dt>
            <dd>{report.computedConfidence}</dd>
          </div>
          <div>
            <dt>Reviewed by</dt>
            <dd>
              {fact.review.approvedBy} · {fact.review.approvedAt?.slice(0, 10)}
            </dd>
          </div>
          <div>
            <dt>We&rsquo;ll re-check by</dt>
            <dd title="When the supporting reports start to age; a purchase or a primary record doesn't expire">
              {recheck ? recheck.toISOString().slice(0, 10) : "no expiry"}
            </dd>
          </div>
        </dl>

        <p className={styles.footnote}>
          We don&rsquo;t take our own word for it — every claim here is re-checked when
          the page is built and again when it loads. See{" "}
          <a href="/verification" className={styles.methodLink}>
            how we verify
          </a>
          .
        </p>
      </div>
    </details>
  );
}
