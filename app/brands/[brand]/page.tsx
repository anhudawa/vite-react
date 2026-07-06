import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { SectionHeading } from "@/components/SectionHeading";
import { deriveBrands, getBrand, type BrandEntry } from "@/lib/brands";
import { formatGBP } from "@/lib/economics";
import { JsonLd, breadcrumb, brandJsonLd, itemListJsonLd } from "@/lib/jsonld";
import styles from "../brands.module.css";

export function generateStaticParams() {
  return deriveBrands().map((b) => ({ brand: b.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { brand: string };
}): Metadata {
  const b = getBrand(params.brand);
  if (!b) return {};
  return {
    title: `${b.brand} in sport`,
    description: `Who wears ${b.brand}, the watches themselves, and what sits on those wrists.`,
  };
}

function introFor(b: BrandEntry): string {
  if (b.wearers.length > 0) {
    return `${b.wearers.length} ${
      b.wearers.length === 1 ? "wrist" : "wrists"
    } · ${formatGBP(b.totalGBP)} on the wrist · ${
      b.bought > 0
        ? `${b.bought} bought, ${b.paid} paid to wear it`
        : `every one a paid placement`
    }.`;
  }
  const w = `${b.watches.length} ${b.watches.length === 1 ? "watch" : "watches"} in the library`;
  const e = `${b.essays.length} ${b.essays.length === 1 ? "piece" : "pieces"} of coverage`;
  return `${w} · ${e} · wearers join the ledger as each reference clears review.`;
}

export default function BrandPage({ params }: { params: { brand: string } }) {
  const b = getBrand(params.brand);
  if (!b) notFound();

  return (
    <>
      <JsonLd
        data={[
          brandJsonLd({ name: b.brand, path: `/brands/${b.slug}` }),
          itemListJsonLd({
            name: `${b.brand} in sport`,
            path: `/brands/${b.slug}`,
            items: [
              ...b.wearers.map((w) => ({
                name: `${w.athlete} — ${w.watch}`,
                path: `/who-wears-what/${w.slug}`,
              })),
              ...b.watches.map((w) => ({
                name: `${b.brand} ${w.model}`,
                path: `/watch/${w.slug}`,
              })),
            ],
          }),
          breadcrumb([
            { name: "Home", path: "/" },
            { name: "By Brand", path: "/brands" },
            { name: b.brand, path: `/brands/${b.slug}` },
          ]),
        ]}
      />
      <PageHeader
        index="—"
        kicker="By brand"
        title={b.brand}
        intro={introFor(b)}
      />
      {b.wearers.length > 0 && (
        <section className={`container ${styles.refs}`}>
          {b.wearers.map((w) => (
            <Link key={w.slug} href={`/who-wears-what/${w.slug}`} className={styles.ref}>
              <span className={styles.refName}>{w.athlete}</span>
              <span className={styles.refWatch}>{w.watch}</span>
              <span className={styles.refStance} data-stance={w.stance}>
                {w.stanceLabel}
              </span>
              <span className={styles.refValue}>
                {w.value ? `~${formatGBP(w.value)}` : ""}
              </span>
              <span className={styles.refArrow} aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </section>
      )}
      {b.watches.length > 0 && (
        <section className="container">
          <SectionHeading kicker="The watches" />
          <div className={styles.refs}>
            {b.watches.map((w) => (
              <Link key={w.slug} href={`/watch/${w.slug}`} className={styles.ref}>
                <span className={styles.refName}>{w.model}</span>
                <span className={styles.refWatch}>{w.oneLiner}</span>
                <span aria-hidden="true" />
                <span aria-hidden="true" />
                <span className={styles.refArrow} aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
      {b.essays.length > 0 && (
        <section className="container">
          <SectionHeading kicker="The coverage" />
          <div className={styles.refs}>
            {b.essays.map((e) => (
              <Link key={e.slug} href={e.href} className={styles.ref}>
                <span className={styles.refName}>{e.title}</span>
                <span aria-hidden="true" />
                <span aria-hidden="true" />
                <span aria-hidden="true" />
                <span className={styles.refArrow} aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
      <section className={`container ${styles.foot}`}>
        <Link href="/brands" className={styles.back}>
          ← All brands
        </Link>
      </section>
    </>
  );
}
