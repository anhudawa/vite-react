import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { ArticleCard } from "@/components/ArticleCard";
import { allTags, essaysByTag, tagLabelFromSlug } from "@/lib/tags";
import { JsonLd, breadcrumb } from "@/lib/jsonld";
import styles from "./tag.module.css";

export function generateStaticParams() {
  return allTags().map((t) => ({ tag: t.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { tag: string };
}): Metadata {
  const label = tagLabelFromSlug(params.tag);
  if (!label) return {};
  return {
    title: `${label} — Tag`,
    description: `Every Escapement essay tagged “${label}”.`,
  };
}

export default function TagPage({ params }: { params: { tag: string } }) {
  const label = tagLabelFromSlug(params.tag);
  if (!label) notFound();
  const list = essaysByTag(params.tag);
  const others = allTags().filter((t) => t.slug !== params.tag);

  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Essays", path: "/essays" },
          { name: label, path: `/tag/${params.tag}` },
        ])}
      />
      <PageHeader
        index="#"
        kicker="Tag"
        title={label}
        intro={`${list.length} ${list.length === 1 ? "piece" : "pieces"} on this thread.`}
      />

      <section className={`container ${styles.list}`}>
        {list.map((e, i) => (
          <ArticleCard key={e.slug} essay={e} index={i + 1} />
        ))}
      </section>

      <section className={`container ${styles.more}`}>
        <p className={styles.moreLabel}>Other threads</p>
        <ul className={styles.tags}>
          {others.map((t) => (
            <li key={t.slug}>
              <Link href={`/tag/${t.slug}`} className={styles.tag}>
                {t.tag}
                <span className={styles.tagCount}>{t.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
