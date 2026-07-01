import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { JsonLd, breadcrumb, itemListJsonLd } from "@/lib/jsonld";
import { collections } from "@/data/collections";
import styles from "./collections.module.css";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Editor-curated reading trails through the archive — each collection sequences a handful of essays so that one piece sets up the next.",
  alternates: { canonical: "/collections" },
};

export default function CollectionsIndex() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumb([
            { name: "Home", path: "/" },
            { name: "Collections", path: "/collections" },
          ]),
          itemListJsonLd({
            name: "Collections",
            path: "/collections",
            items: collections.map((c) => ({
              name: c.title,
              path: `/collections/${c.slug}`,
            })),
          }),
        ]}
      />
      <PageHeader
        index="—"
        kicker="Reading trails"
        title="Collections"
        intro="Curated orders through the archive. Each collection sequences a handful of essays so that one piece sets up the next — a facet at a time, rather than the same race run twice."
      />
      <section className={`container ${styles.section}`}>
        <p className={styles.label}>Four trails</p>
        <ol className={styles.list}>
          {collections.map((c, i) => (
            <li key={c.slug} className={styles.item}>
              <Link href={`/collections/${c.slug}`} className={styles.link}>
                <span className={`${styles.index} tnum`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={styles.body}>
                  <span className={styles.title}>{c.title}</span>
                  <span className={styles.dek}>{c.dek}</span>
                  <span className={styles.count}>
                    {c.slugs.length} pieces, in order
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
