import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ArticleCard } from "@/components/ArticleCard";
import { JsonLd, breadcrumb } from "@/lib/jsonld";
import { essays } from "@/content/essays/registry";
import styles from "./index.module.css";

export const metadata: Metadata = {
  title: "Essays",
  description:
    "Long-form on athletes and time — the one relationship a watch and an endurance athlete share. No dealer spin, no borrowed expertise.",
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
        intro="Athletes have the most intense relationship with time of any group alive. A watch is the cultural object of time. These live in the overlap."
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
