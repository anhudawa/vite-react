import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Figure } from "@/components/Figure";
import { Reveal } from "@/components/Reveal";
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

// Editorial sightings — photography, not yet verified references. Named athlete
// and the watch confirmed in frame.
const spotted = [
  {
    src: "/photography/topuria-rm.jpg",
    alt: "Ilia Topuria in low-key light, a Richard Mille on his wrist",
    subject: "Ilia Topuria",
    watch: "Richard Mille",
  },
];

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
        kicker="Bought it, or paid to wear it"
        title="Who Wears What"
        intro="The watch is never the real question. Whether he bought it or he's paid to wear it — and what it cost — is the line nobody else bothers to draw."
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
        <p className={styles.sectionLabel}>In the field</p>
        <div className={styles.gallery}>
          {spotted.map((s, i) => (
            <Reveal key={s.src} delay={i * 90}>
              <Figure
                src={s.src}
                alt={s.alt}
                subject={s.subject}
                watch={s.watch}
                unverified
                ratio="4 / 5"
                sizes="(max-width: 700px) 100vw, 30vw"
              />
            </Reveal>
          ))}
        </div>
        <p className={styles.note}>
          Photographs of a watch on a wrist, where we haven&rsquo;t yet pinned down the
          full story. Interesting, but not presented as fact until we can stand it up.
        </p>
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
