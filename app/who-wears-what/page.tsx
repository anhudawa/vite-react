import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { AthleteLookup } from "@/components/AthleteLookup";
import { acquisitionOf, valueLine } from "@/lib/economics";
import {
  publishedAthletes,
  inReviewAthletes,
  renderableFacts,
  athleteSearchList,
} from "@/data/athletes";
import { JsonLd, breadcrumb } from "@/lib/jsonld";
import styles from "./index.module.css";

export const metadata: Metadata = {
  title: "Who Wears What",
  description:
    "The sourced reference: which athletes wear which watches, the nature of the relationship, and exactly how sure we are.",
};

export default function WhoWearsWhat() {
  // Lead with the money: sort the ledger by indicative value, dearest first.
  const published = publishedAthletes().sort(
    (a, b) =>
      (renderableFacts(b)[0].value?.gbpApprox ?? 0) -
      (renderableFacts(a)[0].value?.gbpApprox ?? 0)
  );
  const inReview = inReviewAthletes();
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Who Wears What", path: "/who-wears-what" },
        ])}
      />
      <PageHeader
        index="01"
        kicker="The reference"
        title="Who Wears What"
        intro="Which athletes wear which watches, and what they cost — sourced, and honest about how sure we are. And where it matters, the detail nobody else bothers to log: whether it was bought, or it's a paid placement."
      />

      <section className={`container ${styles.lookup}`}>
        <AthleteLookup athletes={athleteSearchList()} />
      </section>

      <section className={`container ${styles.section}`}>
        <p className={styles.sectionLabel}>Published references</p>
        <ul className={styles.refs}>
          {published.map((a) => {
            const f = renderableFacts(a)[0];
            const acq = acquisitionOf(f.relation);
            const value = valueLine(f);
            return (
              <li key={a.slug}>
                <Link href={`/who-wears-what/${a.slug}`} className={styles.ref}>
                  <span className={styles.refName}>{a.name}</span>
                  <span className={styles.refWatch}>{f.watch}</span>
                  <span className={styles.refStance} data-stance={acq.stance}>
                    {acq.label}
                  </span>
                  <span className={styles.refValue}>{value ?? ""}</span>
                  <span className={styles.refArrow} aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={`container ${styles.section}`}>
        <p className={styles.sectionLabel}>In the workshop</p>
        <ul className={styles.pipe}>
          {inReview.map((a) => (
            <li key={a.slug} className={styles.pipeItem}>
              <span className={styles.pipeName}>{a.name}</span>
              <span className={styles.pipeLine}>{a.summary}</span>
              <span className={styles.pipeTag}>Held · in review</span>
            </li>
          ))}
        </ul>
        <p className={styles.note}>
          Names we&rsquo;re still standing up. Until the evidence is there, they stay
          here — visible, but not yet presented as fact.
        </p>
      </section>
    </>
  );
}
