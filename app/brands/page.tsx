import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { deriveBrands } from "@/lib/brands";
import { formatGBP } from "@/lib/economics";
import { JsonLd, breadcrumb } from "@/lib/jsonld";
import styles from "./brands.module.css";

export const metadata: Metadata = {
  title: "By Brand",
  description:
    "The verified references grouped by maker — who wears each brand, whether they bought it or are paid to wear it, and what sits on those wrists.",
};

export default function BrandsPage() {
  const brands = deriveBrands();
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "By Brand", path: "/brands" },
        ])}
      />
      <PageHeader
        index="—"
        kicker="The browse graph"
        title="By Brand"
        intro="The same verified references, entered from the maker. Who wears each brand, whether they bought it or are paid to wear it, and what it all costs."
      />
      <section className={`container ${styles.list}`}>
        {brands.map((b) => (
          <Link key={b.slug} href={`/brands/${b.slug}`} className={styles.brand}>
            <span className={styles.brandName}>{b.brand}</span>
            <span className={styles.brandMeta}>
              {b.wearers.length} {b.wearers.length === 1 ? "wrist" : "wrists"}
            </span>
            <span className={styles.brandTotal}>{formatGBP(b.totalGBP)}</span>
            <span className={styles.brandArrow} aria-hidden="true">
              →
            </span>
          </Link>
        ))}
      </section>
    </>
  );
}
