import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { SectionHeading } from "@/components/SectionHeading";
import { watches, getWatchBySlug, type WatchEntity } from "@/data/watches";
import { getAthlete, getPublishedAthlete } from "@/data/athletes";
import { getEssay } from "@/content/essays/registry";
import { essayHref } from "@/lib/content";
import { JsonLd, breadcrumb } from "@/lib/jsonld";
import styles from "./watch.module.css";

export function generateStaticParams() {
  return watches.map((w) => ({ ref: w.slug.split("/") }));
}

function resolve(ref: string[]): WatchEntity | undefined {
  return getWatchBySlug(ref.join("/"));
}

export function generateMetadata({
  params,
}: {
  params: { ref: string[] };
}): Metadata {
  const w = resolve(params.ref);
  if (!w) return {};
  return {
    title: `${w.brand} ${w.model}`,
    description: w.oneLiner,
    alternates: { canonical: `/watch/${w.slug}` },
  };
}

/** The watch as a Product with its maker and a description — nothing more.
 *  An indicative value is editorial context, never an offer, so this schema
 *  carries no offers, no price, and no aggregateRating. */
function watchEntityJsonLd(w: WatchEntity) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${w.brand} ${w.model}`,
    description: w.oneLiner,
    category: "Wristwatch",
    brand: { "@type": "Brand", name: w.brand },
  };
}

export default function WatchPage({ params }: { params: { ref: string[] } }) {
  const w = resolve(params.ref);
  if (!w) notFound();

  const brandSlug = w.slug.split("/")[0];
  const coverage = w.essaySlugs
    .map((slug) => getEssay(slug))
    .filter((e): e is NonNullable<typeof e> => Boolean(e));
  const wrists = w.athleteSlugs
    .map((slug) => getAthlete(slug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))
    .map((a) => ({ athlete: a, published: Boolean(getPublishedAthlete(a.slug)) }));

  return (
    <>
      <JsonLd
        data={[
          watchEntityJsonLd(w),
          breadcrumb([
            { name: "Home", path: "/" },
            { name: "By Brand", path: "/brands" },
            { name: w.brand, path: `/brands/${brandSlug}` },
            { name: w.model, path: `/watch/${w.slug}` },
          ]),
        ]}
      />
      <PageHeader
        index="—"
        kicker="The watch"
        title={`${w.brand} ${w.model}`}
        intro={w.oneLiner}
      />

      <div className={`container ${styles.body}`}>
        <aside className={styles.plate} aria-label="Specification">
          <header className={styles.plateHead}>
            <span className={styles.plateKicker}>Specification</span>
            <span className={styles.plateBrand}>{w.brand}</span>
          </header>
          <dl className={styles.rows}>
            {w.specs.map((s) => (
              <div className={styles.row} key={s.label}>
                <dt className={styles.label}>{s.label}</dt>
                <dd className={styles.value}>{s.value}</dd>
              </div>
            ))}
          </dl>
          {w.priceNote && <p className={styles.priceNote}>{w.priceNote}</p>}
        </aside>

        {coverage.length > 0 && (
          <section className={styles.section}>
            <SectionHeading kicker="Read the coverage" />
            <div className={styles.list}>
              {coverage.map((e) => (
                <Link key={e.slug} href={essayHref(e)} className={styles.item}>
                  <span className={styles.itemName}>{e.title}</span>
                  <span className={styles.itemMeta}>
                    {e.kicker ?? "Essay"} · {e.readingTime}
                  </span>
                  <span className={styles.itemArrow} aria-hidden="true">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {wrists.length > 0 && (
          <section className={styles.section}>
            <SectionHeading kicker="On the wrist" />
            <div className={styles.list}>
              {wrists.map(({ athlete, published }) =>
                published ? (
                  <Link
                    key={athlete.slug}
                    href={`/who-wears-what/${athlete.slug}`}
                    className={styles.item}
                  >
                    <span className={styles.itemName}>{athlete.name}</span>
                    <span className={styles.itemMeta}>{athlete.discipline}</span>
                    <span className={styles.itemArrow} aria-hidden="true">
                      →
                    </span>
                  </Link>
                ) : (
                  <div key={athlete.slug} className={styles.item}>
                    <span className={styles.itemName}>{athlete.name}</span>
                    <span className={styles.itemMeta}>{athlete.discipline}</span>
                    <span className={styles.itemTag}>Held · in review</span>
                  </div>
                )
              )}
            </div>
          </section>
        )}

        {w.sources.length > 0 && (
          <section className={styles.section}>
            <SectionHeading kicker="Sources" />
            <ul className={styles.sources}>
              {w.sources.map((s) => (
                <li key={s.url} className={styles.source}>
                  <span className={styles.sourceClaim}>{s.claim}</span>
                  <a
                    href={s.url}
                    className={styles.sourceUrl}
                    {...(s.url.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {s.url}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className={styles.foot}>
          <Link href={`/brands/${brandSlug}`} className={styles.back}>
            ← More {w.brand} in sport
          </Link>
          <Link href="/brands" className={styles.back}>
            ← All brands
          </Link>
        </div>
      </div>
    </>
  );
}
