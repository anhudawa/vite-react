import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { GATES, POLICY, GATE_RESIDUALS, verifyFact } from "@/lib/verification";
import { publishableFacts } from "@/lib/verification";
import { athletes } from "@/data/athletes";
import { corrections, correctionsPolicy } from "@/data/corrections";
import { JsonLd, breadcrumb } from "@/lib/jsonld";
import styles from "./verification.module.css";

export const metadata: Metadata = {
  title: "The Verification Method",
  description:
    "How The Long Second keeps the record accurate: every claim passes an explicit gauntlet of independent gates before it can appear as fact.",
};

// Modeled joint residual across all gates — illustrative, not a guarantee.
const jointResidual = GATES.reduce((acc, g) => acc * GATE_RESIDUALS[g.id], 1);

function fmt(p: number): string {
  const exp = Math.floor(Math.log10(p));
  const mant = (p / Math.pow(10, exp)).toFixed(1);
  return `${mant} × 10^${exp}`;
}

const ledger = publishableFacts(athletes.flatMap((a) => a.facts)).map((f) => {
  const archived = f.sources.filter(
    (s) => s.verified && s.snapshot && s.snapshot !== "unarchivable"
  ).length;
  return {
    id: f.id,
    subject: `${f.athlete} — ${f.watch}`,
    confidence: verifyFact(f).computedConfidence,
    approvedAt: f.review.approvedAt?.slice(0, 10) ?? "—",
    durable: archived >= 2,
    archived,
  };
});

export default function VerificationPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Verification", path: "/verification" },
        ])}
      />
      <PageHeader
        index="—"
        kicker="The method"
        title="How we know"
        intro="The whole brand is one promise: what's on the wrist, and why it's there, told accurately. So a claim does not get to be published because someone is confident. It gets published because it survived a gauntlet built to destroy it."
      />

      <section className={`container ${styles.intro}`}>
        <p>
          Most of the internet writes the watch down once and moves on. We treat every
          claim as guilty until it clears {GATES.length} independent gates. Each gate
          catches a different way of being wrong. A claim has to pass all of them — and
          because the gates are independent, the chance of a wrong claim slipping past
          every one is the product of the chances of slipping past each.
        </p>
        <p className={styles.stat}>
          <span className={styles.statNum}>{GATES.length}</span>
          <span className={styles.statLabel}>
            independent gates · modeled residual error ~{fmt(jointResidual)}
          </span>
        </p>
        <p className={styles.statNote}>
          That figure is a conservative engineering estimate of the model, not a
          marketing guarantee — published so the claim is auditable rather than
          rhetorical. The real safeguard is that the gauntlet runs automatically: at
          build time, and again every time a fact renders. A claim that fails is not
          quietly downgraded. It cannot ship.
        </p>
      </section>

      <section className={`container ${styles.gates}`}>
        <p className={styles.gatesLabel}>The gauntlet</p>
        <ol className={styles.gateList}>
          {GATES.map((g, i) => (
            <li key={g.id} className={styles.gate}>
              <span className={styles.gateNum}>{String(i + 1).padStart(2, "0")}</span>
              <div className={styles.gateBody}>
                <h2 className={styles.gateName}>{g.label}</h2>
                <p className={styles.gateCatches}>Catches: {g.catches}.</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={`container ${styles.policy}`}>
        <p className={styles.gatesLabel}>The bar, in numbers</p>
        <dl className={styles.policyGrid}>
          <div>
            <dt>Independent sources required</dt>
            <dd>{POLICY.minIndependentSources}</dd>
          </div>
          <div>
            <dt>Corroboration per critical field</dt>
            <dd>{POLICY.minCorroborationPerField}×</dd>
          </div>
          <div>
            <dt>Critical fields</dt>
            <dd>{POLICY.criticalFields.join(", ")}</dd>
          </div>
          <div>
            <dt>Minimum confidence to publish</dt>
            <dd>{POLICY.minConfidenceToPublish}</dd>
          </div>
          <div>
            <dt>Media goes stale after</dt>
            <dd>{POLICY.staleMediaYears} years (primary records never expire)</dd>
          </div>
          <div>
            <dt>Source permanence</dt>
            <dd>≥2 archived independent sources — enforced at build</dd>
          </div>
          <div>
            <dt>Final sign-off</dt>
            <dd>Named editor · dual control</dd>
          </div>
        </dl>
      </section>

      <section className={`container ${styles.policy}`}>
        <p className={styles.gatesLabel}>The public record</p>
        <p className={styles.ledgerIntro}>
          Every published reference, with the confidence the evidence earned, the date
          an editor last signed it, and whether its proof is archived against
          link-rot. This is the audit trail — not a badge.
        </p>
        <ul className={styles.ledger}>
          <li className={`${styles.ledgerRow} ${styles.ledgerHead}`} aria-hidden="true">
            <span>Reference</span>
            <span>Confidence</span>
            <span>Signed</span>
            <span>Evidence</span>
          </li>
          {ledger.map((r) => (
            <li key={r.id} className={styles.ledgerRow}>
              <span className={styles.ledgerSubject}>{r.subject}</span>
              <span>{r.confidence}</span>
              <span className={styles.ledgerMono}>{r.approvedAt}</span>
              <span
                className={styles.ledgerDurable}
                data-durable={r.durable || undefined}
                title={`${r.archived} independent source(s) permanently archived`}
              >
                {r.durable ? "Durable" : "Thin"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className={`container ${styles.policy}`}>
        <p className={styles.gatesLabel}>Corrections &amp; retractions</p>
        <p className={styles.ledgerIntro}>{correctionsPolicy}</p>
        {corrections.length === 0 ? (
          <p className={styles.correctionsEmpty}>
            No corrections to date. When that changes, the entry will appear here —
            dated, described, and permanent.
          </p>
        ) : (
          <ul className={styles.corrections}>
            {corrections.map((c) => (
              <li key={c.id} className={styles.correction}>
                <span className={styles.correctionMeta}>
                  {c.date} · {c.kind}
                </span>
                <span className={styles.correctionSubject}>{c.subject}</span>
                <span className={styles.correctionSummary}>{c.summary}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={`container ${styles.outro}`}>
        <p className={styles.outroLine}>
          When a fact does pass, we show our work. Every reference page carries the gate
          results, the sources, and the editor who signed it — open it and check us.
        </p>
        <Link href="/who-wears-what" className={styles.cta}>
          See it on the reference pages →
        </Link>
      </section>
    </>
  );
}
