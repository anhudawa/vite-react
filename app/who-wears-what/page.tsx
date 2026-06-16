import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { athletes, forthcoming } from "@/data/athletes";
import { JsonLd, breadcrumb } from "@/lib/jsonld";
import styles from "./index.module.css";

export const metadata: Metadata = {
  title: "Who Wears What",
  description:
    "The sourced reference: which athletes wear which watches, the nature of the relationship, and exactly how sure we are.",
};

export default function WhoWearsWhat() {
  const published = athletes.filter((a) => a.published);
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
          {published.map((a) => (
            <li key={a.slug}>
              <Link href={`/who-wears-what/${a.slug}`} className={styles.ref}>
                <span className={styles.refName}>{a.name}</span>
                <span className={styles.refWatch}>{a.facts[0].watch}</span>
                <span className={styles.refRel}>{a.facts[0].relation}</span>
                <span className={styles.refConf}>
                  <span
                    className={styles.dot}
                    data-conf={a.facts[0].confidence}
                  />
                  {a.facts[0].confidence}
                </span>
                <span className={styles.refArrow} aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={`container ${styles.section}`}>
        <p className={styles.sectionLabel}>In the workshop</p>
        <ul className={styles.pipe}>
          {forthcoming.map((f) => (
            <li key={f.name} className={styles.pipeItem}>
              <span className={styles.pipeName}>{f.name}</span>
              <span className={styles.pipeLine}>{f.line}</span>
              <span className={styles.pipeTag}>Sourcing</span>
            </li>
          ))}
        </ul>
        <p className={styles.note}>
          A name only earns a reference page once the relationship is sourced to
          publication standard. Until then it waits here. That restraint is the
          point.
        </p>
      </section>
    </>
  );
}
