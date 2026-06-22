import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { IndexList, type IndexItem } from "@/components/IndexList";
import { JsonLd, breadcrumb } from "@/lib/jsonld";
import { pillarList, getPillar } from "@/lib/pillars";
import { essaysByPillar } from "@/content/essays/registry";
import { essayHref } from "@/lib/content";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return pillarList.map((p) => ({ pillar: p.slug }));
}

export function generateMetadata({ params }: { params: { pillar: string } }): Metadata {
  const p = getPillar(params.pillar);
  if (!p) return {};
  return {
    title: p.name,
    description: p.dek,
    alternates: { canonical: `/topics/${p.slug}` },
  };
}

export default function PillarHub({ params }: { params: { pillar: string } }) {
  const p = getPillar(params.pillar);
  if (!p) notFound();

  const pieces = essaysByPillar(p.slug);
  const items: IndexItem[] = pieces.map((e) => ({
    title: e.title,
    dek: e.dek,
    href: essayHref(e),
    meta: `${e.kicker ?? "Essay"} · ${e.readingTime}`,
  }));
  const index = String(pillarList.findIndex((x) => x.slug === p.slug) + 1).padStart(2, "0");

  return (
    <>
      <JsonLd
        data={[
          breadcrumb([
            { name: "Home", path: "/" },
            { name: "Topics", path: "/topics" },
            { name: p.short, path: `/topics/${p.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: p.name,
            description: p.dek,
            url: `${site.url}/topics/${p.slug}`,
            isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
          },
        ]}
      />
      <PageHeader index={index} kicker="Pillar" title={p.name} intro={p.dek} />
      {items.length > 0 ? (
        <IndexList items={items} label="In this pillar" />
      ) : (
        <p className="container" style={{ paddingBottom: "4rem", maxWidth: "44rem", color: "var(--text-dim)" }}>
          First pieces for this pillar are in the workshop. Meanwhile, start with{" "}
          <a href="/topics" style={{ color: "var(--text)", textDecoration: "underline" }}>
            the other pillars
          </a>
          .
        </p>
      )}
    </>
  );
}
