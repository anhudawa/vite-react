import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { JsonLd, breadcrumb } from "@/lib/jsonld";
import styles from "./feeds.module.css";

export const metadata: Metadata = {
  title: "Feeds",
  description:
    "The site in machine-readable form — RSS for readers, structured JSON for everything else.",
};

const feeds: { path: string; format: string; note: string }[] = [
  {
    path: "/rss.xml",
    format: "RSS 2.0",
    note: "Every essay as it publishes, in the reader of your choice.",
  },
  {
    path: "/feeds/articles.json",
    format: "JSON",
    note: "Every article — title, dek, dates, tags, the watches mentioned.",
  },
  {
    path: "/feeds/reviews.json",
    format: "JSON",
    note: "The review pieces alone, in the same shape. The shelf is built; the first reviews arrive with verified specs.",
  },
  {
    path: "/feeds/topics.json",
    format: "JSON",
    note: "The pillar topics — what the site covers, hub by hub.",
  },
  {
    path: "/feeds/watches.json",
    format: "JSON",
    note: "Each watch referenced across the site, with its maker.",
  },
  {
    path: "/facts.json",
    format: "JSON",
    note: "Brand facts, stated plainly — what this site is and what it covers.",
  },
  {
    path: "/knowledge-graph.json",
    format: "JSON",
    note: "The entities and the edges between them — articles, athletes, brands, watches.",
  },
  {
    path: "/sitemap.xml",
    format: "XML",
    note: "Every URL on the site, for crawlers.",
  },
  {
    path: "/llms.txt",
    format: "Text",
    note: "The site summarised for language models, with citation-ready links.",
  },
];

export default function FeedsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Feeds", path: "/feeds" },
        ])}
      />
      <PageHeader
        index="—"
        kicker="Machine-readable"
        title="Feeds"
        intro="Everything published here is also published for machines. Subscribe by RSS, or read the site as structured data — the same essays, the same facts, in formats a reader or a crawler can parse."
      />
      <section className={`container ${styles.list}`}>
        {feeds.map((f) => (
          <a key={f.path} href={f.path} className={styles.feed}>
            <span className={styles.feedPath}>{f.path}</span>
            <span className={styles.feedNote}>{f.note}</span>
            <span className={styles.feedFormat}>{f.format}</span>
            <span className={styles.feedArrow} aria-hidden="true">
              →
            </span>
          </a>
        ))}
      </section>
    </>
  );
}
