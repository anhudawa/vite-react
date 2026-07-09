import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { JsonLd, breadcrumb, itemListJsonLd } from "@/lib/jsonld";
import { collections, getCollection } from "@/data/collections";
import { getEssay } from "@/content/essays/registry";
import { essayHref } from "@/lib/content";
import styles from "./collection.module.css";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = getCollection(params.slug);
  if (!c) return {};
  return {
    title: c.title,
    description: c.dek,
    alternates: { canonical: `/collections/${c.slug}` },
  };
}

export default function CollectionTrail({ params }: { params: { slug: string } }) {
  const c = getCollection(params.slug);
  if (!c) notFound();

  const pieces = c.slugs
    .map((slug) => getEssay(slug))
    .filter((e): e is NonNullable<ReturnType<typeof getEssay>> => Boolean(e));
  const index = String(collections.findIndex((x) => x.slug === c.slug) + 1).padStart(2, "0");

  return (
    <>
      <JsonLd
        data={[
          breadcrumb([
            { name: "Home", path: "/" },
            { name: "Collections", path: "/collections" },
            { name: c.title, path: `/collections/${c.slug}` },
          ]),
          itemListJsonLd({
            name: c.title,
            path: `/collections/${c.slug}`,
            items: pieces.map((e) => ({ name: e.title, path: essayHref(e) })),
          }),
        ]}
      />
      <PageHeader index={index} kicker="Reading trail" title={c.title} intro={c.intro} />
      <section className={`container ${styles.section}`}>
        <p className={styles.label}>The order</p>
        <ol className={styles.trail}>
          {pieces.map((e, i) => (
            <li key={e.slug} className={styles.entry}>
              <Link href={essayHref(e)} className={styles.link}>
                <span className={`${styles.index} tnum`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={styles.body}>
                  <span className={styles.title}>{e.title}</span>
                  <span className={styles.dek}>{e.dek}</span>
                  <span className={styles.meta}>{e.readingTime}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
        <p className={styles.back}>
          <Link href="/collections" className={styles.backLink}>
            All collections
          </Link>
        </p>
      </section>
    </>
  );
}
