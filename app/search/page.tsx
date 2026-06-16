import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SearchClient } from "@/components/SearchClient";
import { buildSearchIndex } from "@/lib/search";
import { JsonLd, breadcrumb } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the Escapement archive — essays, sourced references, and sections.",
};

export default function SearchPage() {
  const index = buildSearchIndex();
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Search", path: "/search" },
        ])}
      />
      <PageHeader
        index="—"
        kicker="The archive"
        title="Search"
        intro="Small and deliberately so. Every essay, every sourced reference, every section — find the one you mean."
      />
      <section className="container">
        <SearchClient index={index} />
      </section>
    </>
  );
}
