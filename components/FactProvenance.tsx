import type { VerifiedFact } from "@/lib/verification";
import { verifyFact, GATE_COUNT, nextReCheck } from "@/lib/verification";
import styles from "./FactProvenance.module.css";

function formatResidual(p: number): string {
  if (p <= 0) return "0";
  const exp = Math.floor(Math.log10(p));
  const mant = (p / Math.pow(10, exp)).toFixed(1);
  return `${mant}×10${superscript(exp)}`;
}
function superscript(n: number): string {
  const map: Record<string, string> = {
    "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
    "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
  };
  return String(n).split("").map((c) => map[c] ?? c).join("");
}

/**
 * The credibility, shown. A native disclosure under a Fact Block that exposes
 * exactly how a claim cleared the gauntlet: every gate, the live sources, the
 * computed (not merely asserted) confidence, and the accountable editor.
 */
export function FactProvenance({ fact }: { fact: VerifiedFact }) {
  const report = verifyFact(fact);
  const passed = report.gates.filter((g) => g.pass).length;
  const live = fact.sources.filter((s) => s.verified);
  const recheck = nextReCheck(fact);

  return (
    <details className={styles.wrap}>
      <summary className={styles.summary}>
        <span className={styles.summaryLabel}>How this was verified</span>
        <span className={styles.summaryCount}>
          {passed}/{GATE_COUNT} gates · {report.computedConfidence}
        </span>
      </summary>

      <div className={styles.body}>
        <ol className={styles.gates}>
          {report.gates.map((g) => (
            <li key={g.id} className={styles.gate} data-pass={g.pass || undefined}>
              <span className={styles.gateMark} aria-hidden="true">
                {g.pass ? "✓" : "✗"}
              </span>
              <span className={styles.gateName}>{g.label}</span>
              <span className={styles.gateDetail}>{g.detail}</span>
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
            <dt>Computed confidence</dt>
            <dd>{report.computedConfidence}</dd>
          </div>
          <div>
            <dt>Reviewed by</dt>
            <dd>
              {fact.review.approvedBy} · {fact.review.approvedAt?.slice(0, 10)} ·{" "}
              {fact.review.method}
            </dd>
          </div>
          <div>
            <dt>Modeled residual error</dt>
            <dd title="Product of independent per-gate residuals — illustrative, not a guarantee">
              ~{formatResidual(report.residualErrorEstimate)}
            </dd>
          </div>
          <div>
            <dt>Next re-check</dt>
            <dd title="When a critical field's live corroboration would next decay; primary-backed claims don't expire">
              {recheck ? recheck.toISOString().slice(0, 10) : "no decay"}
            </dd>
          </div>
        </dl>

        <p className={styles.footnote}>
          Status is never trusted on its own — this fact is re-checked against the
          gauntlet at build time and again on render. See the{" "}
          <a href="/verification" className={styles.methodLink}>
            verification method
          </a>
          .
        </p>
      </div>
    </details>
  );
}
