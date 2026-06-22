import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ArticleCard } from "@/components/ArticleCard";
import { JsonLd, breadcrumb } from "@/lib/jsonld";
import { essays } from "@/content/essays/registry";
import styles from "./index.module.css";

export const metadata: Metadata = {
  title: "Essays",
  description:
    "Long-form on athletes and time, across endurance sport — the watch as the one instrument that measures what the body spends. Written by a racer, sourced to the last reference.",
};

export default function EssaysIndex() {
  const [lead, ...rest] = essays;
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Essays", path: "/essays" },
        ])}
      />
      <PageHeader
        index="04"
        kicker="The reading"
        title="Essays"
        intro="An athlete lives closer to the second than anyone — it is the unit a career is spent in. A watch is the thing built to keep it. These essays sit where the two meet."
      />
      <div className={`container ${styles.list}`}>
        <ArticleCard essay={lead} variant="lead" />
        <div className={styles.rows}>
          {rest.map((essay, i) => (
            <ArticleCard key={essay.slug} essay={essay} index={i + 2} />
          ))}
        </div>
      </div>
    </>
  );
}
