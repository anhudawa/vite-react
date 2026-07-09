import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { IndexList, type IndexItem } from "@/components/IndexList";
import { JsonLd, breadcrumb } from "@/lib/jsonld";
import { pillarList } from "@/lib/pillars";
import { essaysByPillar } from "@/content/essays/registry";

export const metadata: Metadata = {
  title: "Topics",
  description:
    "The five pillars of The Long Second — mechanical watches for the endurance athlete, the instrument of effort, a century of heritage, buying and owning, and dispatches.",
  alternates: { canonical: "/topics" },
};

export default function TopicsIndex() {
  const items: IndexItem[] = pillarList.map((p, i) => {
    const count = essaysByPillar(p.slug).length;
    return {
      title: p.name,
      dek: p.dek,
      href: `/topics/${p.slug}`,
      meta: `Pillar ${String(i + 1).padStart(2, "0")}${count ? ` · ${count} piece${count > 1 ? "s" : ""}` : " · in the workshop"}`,
    };
  });

  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Topics", path: "/topics" },
        ])}
      />
      <PageHeader
        index="—"
        kicker="The five pillars"
        title="Topics"
        intro="Where endurance and watches meet, organised into the five pillars the whole site is built around. Mechanical-first, heritage-deep, honest about the rest."
      />
      <IndexList items={items} label="Pillars" />
    </>
  );
}
