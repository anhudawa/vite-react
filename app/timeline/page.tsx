import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { JsonLd, breadcrumb } from "@/lib/jsonld";
import { timeline, tagLabel } from "@/data/timeline";
import styles from "./timeline.module.css";

export const metadata: Metadata = {
  title: "Timeline",
  description:
    "A century of dates where watches and endurance sport share the record — from Gleitze's vindication swim in 1927 to Ganna's 56.792-kilometre Hour in 2022, each entry sourced to the essay that tells it in full.",
  alternates: { canonical: "/timeline" },
};

export default function TimelineIndex() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Timeline", path: "/timeline" },
        ])}
      />
      <PageHeader
        index="—"
        kicker="A century, kept"
        title="Timeline"
        intro="The verified dates where the watch and the athlete share the story — a swim, a summit, a mile, an hour. Every entry on this line is told in full in one of our essays, and links to it."
      />
      <section className={`container ${styles.section}`}>
        <p className={styles.label}>Verified dates</p>
        <ol className={styles.timeline}>
          {timeline.map((e) => (
            <li key={`${e.year}-${e.title}`} className={styles.entry}>
              <Link href={e.href} className={styles.link}>
                <span className={styles.rail}>
                  <span className={`${styles.year} tnum`}>{e.year}</span>
                  {e.date && <span className={styles.date}>{e.date}</span>}
                  <span className={styles.tag}>{tagLabel[e.tag]}</span>
                </span>
                <span className={styles.body}>
                  <span className={styles.title}>{e.title}</span>
                  <span className={styles.line}>{e.line}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
