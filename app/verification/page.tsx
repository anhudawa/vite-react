import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { POLICY, verifyFact, publishableFacts } from "@/lib/verification";
import { athletes } from "@/data/athletes";
import { corrections, correctionsPolicy } from "@/data/corrections";
import { JsonLd, breadcrumb } from "@/lib/jsonld";
import styles from "./verification.module.css";

export const metadata: Metadata = {
  title: "How We Verify",
  description:
    "How The Long Second keeps the record accurate: every claim is sourced, corroborated, and signed before it can appear as fact — and we show our work.",
};

// Reader-facing checks — the plain-language version of what we confirm before
// anything is published. The internal scoring stays internal.
const CHECKS: { title: string; body: string }[] = [
  {
    title: "Independent sources",
    body: "At least two sources that don't share an owner. One outlet repeating another doesn't count as two.",
  },
  {
    title: "Every detail corroborated",
    body: "The watch, the relationship, and the sighting each have to be backed more than once — not one of them carrying the others.",
  },
  {
    title: "The watch checks out",
    body: "The model and reference are real and match the maker. A transposed digit fails.",
  },
  {
    title: "Something you can see",
    body: "For our highest rating, a photo or footage — not words alone.",
  },
  {
    title: "How it reached the wrist",
    body: "Bought, sponsored, gifted, on loan — we say which, plainly. Vague ‘affiliation’ isn't allowed.",
  },
  {
    title: "We try to disprove it",
    body: "Before publishing, we go looking for whatever would contradict the claim. If we find it, it doesn't run.",
  },
  {
    title: "Only as sure as the evidence",
    body: "Confidence comes from the sources, not from how we feel. We can't call something certain because we'd like it to be.",
  },
  {
    title: "A named editor signs it",
    body: "Nothing ships on autopilot. A person puts their name to every published claim.",
  },
];

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
        intro="The whole brand is one promise: what's on the wrist, and why it's there, told accurately. So a claim doesn't get published because someone's confident. It gets published once it's sourced, corroborated, and signed — and once we've gone looking for the reasons it might be wrong."
      />

      <section className={`container ${styles.intro}`}>
        <p>
          Most of the internet writes the watch down once and moves on. We treat every
          claim as guilty until proven: sourced, corroborated, checked against whatever
          would contradict it, and signed by a name. Only then can it appear as fact.
        </p>
        <p className={styles.statNote}>
          And it isn't a one-time check. The same standard runs automatically — when a
          page is built, and again every time a claim loads. Anything that no longer
          holds up doesn't quietly downgrade. It can't ship.
        </p>
      </section>

      <section className={`container ${styles.gates}`}>
        <p className={styles.gatesLabel}>What we check before we publish</p>
        <ol className={styles.gateList}>
          {CHECKS.map((c, i) => (
            <li key={c.title} className={styles.gate}>
              <span className={styles.gateNum}>{String(i + 1).padStart(2, "0")}</span>
              <div className={styles.gateBody}>
                <h2 className={styles.gateName}>{c.title}</h2>
                <p className={styles.gateCatches}>{c.body}</p>
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
            <dt>Corroboration per key detail</dt>
            <dd>{POLICY.minCorroborationPerField}×</dd>
          </div>
          <div>
            <dt>The details we corroborate</dt>
            <dd>the watch, the relationship, the evidence</dd>
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
            <dt>Ownership claims</dt>
            <dd>Don&rsquo;t expire — a purchase is historical, unlike a sponsorship</dd>
          </div>
          <div>
            <dt>Source permanence</dt>
            <dd>≥2 archived independent sources — enforced at build</dd>
          </div>
          <div>
            <dt>Final sign-off</dt>
            <dd>A named editor · two-person review</dd>
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
          When a claim does pass, we show our work. Every reference page carries the
          checks, the sources you can open, and the editor who signed it — go and check
          us.
        </p>
        <Link href="/who-wears-what" className={styles.cta}>
          See it on the reference pages →
        </Link>
      </section>
    </>
  );
}
