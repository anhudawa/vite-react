import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { AuthorModule } from "@/components/AuthorModule";
import { IndexList, type IndexItem } from "@/components/IndexList";
import { JsonLd, authorPersonJsonLd, breadcrumb } from "@/lib/jsonld";
import { essays } from "@/content/essays/registry";
import { essayHref } from "@/lib/content";
import { site } from "@/lib/site";

const AUTHOR_SLUG = "anthony-walsh";

export function generateStaticParams() {
  return [{ name: AUTHOR_SLUG }];
}

export function generateMetadata({ params }: { params: { name: string } }): Metadata {
  if (params.name !== AUTHOR_SLUG) return {};
  return {
    title: site.author.name,
    description: site.author.bio,
    alternates: { canonical: `/author/${AUTHOR_SLUG}` },
  };
}

export default function AuthorPage({ params }: { params: { name: string } }) {
  if (params.name !== AUTHOR_SLUG) notFound();
  const a = site.author;
  const writing: IndexItem[] = essays.map((e) => ({
    title: e.title,
    dek: e.dek,
    href: essayHref(e),
    meta: `${e.kicker ?? "Essay"} · ${e.readingTime}`,
  }));

  return (
    <>
      <JsonLd
        data={[
          authorPersonJsonLd(),
          breadcrumb([
            { name: "Home", path: "/" },
            { name: a.name, path: `/author/${AUTHOR_SLUG}` },
          ]),
        ]}
      />
      <PageHeader
        index="—"
        kicker={`${a.role} · ${site.name}`}
        title={a.name}
        intro="Lived authority on the endurance side — raced it, suffered on it. A fan's curiosity on the watches. Every reference cited; when something isn't certain, it says so."
      />

      <div className="container" style={{ maxWidth: "54rem", margin: "0 auto" }}>
        <AuthorModule heading="Credentials" />
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--t-mono-xs)", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-faint)", margin: "var(--s-7) 0 var(--s-3)" }}>
          Elsewhere
        </p>
        <ul style={{ listStyle: "none", display: "flex", flexWrap: "wrap", gap: "var(--s-4)", padding: 0, margin: 0 }}>
          {a.sameAs.map((href) => (
            <li key={href}>
              <a href={href} rel="me noreferrer" target="_blank" style={{ color: "var(--text)", textDecoration: "underline", textUnderlineOffset: "2px", fontFamily: "var(--font-mono)", fontSize: "var(--t-body-s)" }}>
                {href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <IndexList items={writing} label="Writing" />
    </>
  );
}
