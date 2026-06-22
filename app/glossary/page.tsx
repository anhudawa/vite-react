import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { IndexList, type IndexItem } from "@/components/IndexList";
import { JsonLd, breadcrumb } from "@/lib/jsonld";
import { glossary } from "@/data/glossary";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Glossary",
  description:
    "The vocabulary of watches and endurance, defined plainly — escapement, power reserve, lume, GMT, chronograph and the rest, with the athlete's angle where it fits.",
  alternates: { canonical: "/glossary" },
};

export default function GlossaryIndex() {
  const items: IndexItem[] = glossary.map((t) => ({
    title: t.term,
    dek: t.short,
    href: `/glossary/${t.slug}`,
    meta: "Term",
  }));

  return (
    <>
      <JsonLd
        data={[
          breadcrumb([
            { name: "Home", path: "/" },
            { name: "Glossary", path: "/glossary" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "DefinedTermSet",
            name: `${site.name} Glossary`,
            url: `${site.url}/glossary`,
            hasDefinedTerm: glossary.map((t) => ({
              "@type": "DefinedTerm",
              name: t.term,
              description: t.short,
              url: `${site.url}/glossary/${t.slug}`,
            })),
          },
        ]}
      />
      <PageHeader
        index="—"
        kicker="The vocabulary"
        title="Glossary"
        intro="Watches and endurance both run on precise words. Here they are, defined plainly — and where the two languages rhyme, we say so."
      />
      <IndexList items={items} label="Terms" />
    </>
  );
}
