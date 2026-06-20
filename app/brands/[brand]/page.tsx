import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { deriveBrands, getBrand } from "@/lib/brands";
import { formatGBP } from "@/lib/economics";
import { JsonLd, breadcrumb } from "@/lib/jsonld";
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
    description: `Who wears ${b.brand}, whether they bought it or are paid to wear it, and what sits on those wrists — every claim sourced and verified.`,
  };
}

export default function BrandPage({ params }: { params: { brand: string } }) {
  const b = getBrand(params.brand);
  if (!b) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "By Brand", path: "/brands" },
          { name: b.brand, path: `/brands/${b.slug}` },
        ])}
      />
      <PageHeader
        index="—"
        kicker="By brand"
        title={b.brand}
        intro={`${b.wearers.length} verified ${
          b.wearers.length === 1 ? "wrist" : "wrists"
        } · ${formatGBP(b.totalGBP)} on the wrist · ${
          b.bought > 0
            ? `${b.bought} bought, ${b.paid} paid to wear it`
            : `every one a paid placement`
        }.`}
      />
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
      <section className={`container ${styles.foot}`}>
        <Link href="/brands" className={styles.back}>
          ← All brands
        </Link>
      </section>
    </>
  );
}
