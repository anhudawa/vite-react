import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Figure } from "@/components/Figure";
import { Reveal } from "@/components/Reveal";
import {
  publishedAthletes,
  inReviewAthletes,
  renderableFacts,
} from "@/data/athletes";
import { GATE_COUNT } from "@/lib/verification";
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
  {
    src: "/photography/mcgregor-rm.jpg",
    alt: "Conor McGregor ringside in black, a Richard Mille on his wrist",
    subject: "Conor McGregor",
    watch: "Richard Mille",
  },
];

export const metadata: Metadata = {
  title: "Who Wears What",
  description:
    "The sourced reference: which athletes wear which watches, the nature of the relationship, and exactly how sure we are.",
};

export default function WhoWearsWhat() {
  const published = publishedAthletes();
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
        intro="The internet recycles the same fifteen names and reviews the watch as an object. This is the opposite: the relationship, sourced, with the evidence shown and the confidence stated."
      />

      <section className={`container ${styles.section}`}>
        <p className={styles.sectionLabel}>Published references</p>
        <ul className={styles.refs}>
          {published.map((a) => {
            const f = renderableFacts(a)[0];
            return (
              <li key={a.slug}>
                <Link href={`/who-wears-what/${a.slug}`} className={styles.ref}>
                  <span className={styles.refName}>{a.name}</span>
                  <span className={styles.refWatch}>{f.watch}</span>
                  <span className={styles.refRel}>{f.relation}</span>
                  <span className={styles.refConf}>
                    <span className={styles.dot} data-conf={f.confidence} />
                    {f.confidence}
                  </span>
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
                ratio="4 / 5"
                sizes="(max-width: 700px) 100vw, 30vw"
              />
            </Reveal>
          ))}
        </div>
        <p className={styles.note}>
          Sightings we&rsquo;re working to source. Photography, not yet a verified
          reference — the relationship has to clear the gauntlet before it earns a page.
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
          A name only earns a reference page once its claim clears all {GATE_COUNT}{" "}
          verification gates. Until then it is held here — visible, but never shown as
          fact. That restraint is the whole point. See the{" "}
          <Link href="/verification" className={styles.noteLink}>
            verification method
          </Link>
          .
        </p>
      </section>
    </>
  );
}
