import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { JsonLd, breadcrumb } from "@/lib/jsonld";
import { glossary, getTerm } from "@/data/glossary";
import { getEssay } from "@/content/essays/registry";
import { essayHref } from "@/lib/content";
import { site } from "@/lib/site";
import styles from "./term.module.css";

export function generateStaticParams() {
  return glossary.map((t) => ({ term: t.slug }));
}

export function generateMetadata({ params }: { params: { term: string } }): Metadata {
  const t = getTerm(params.term);
  if (!t) return {};
  return {
    title: `${t.term} — Glossary`,
    description: t.short,
    alternates: { canonical: `/glossary/${t.slug}` },
  };
}

export default function GlossaryTermPage({ params }: { params: { term: string } }) {
  const t = getTerm(params.term);
  if (!t) notFound();
  const related = (t.related ?? []).map((slug) => getTerm(slug)).filter(Boolean);
  const essay = t.essay ? getEssay(t.essay) : undefined;

  return (
    <>
      <JsonLd
        data={[
          breadcrumb([
            { name: "Home", path: "/" },
            { name: "Glossary", path: "/glossary" },
            { name: t.term, path: `/glossary/${t.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "DefinedTerm",
            name: t.term,
            description: t.short,
            url: `${site.url}/glossary/${t.slug}`,
            inDefinedTermSet: `${site.url}/glossary`,
          },
        ]}
      />
      <PageHeader index="—" kicker="Glossary" title={t.term} intro={t.short} />

      <div className={`container ${styles.prose}`}>
        <p className={styles.body}>{t.body}</p>

        {essay && (
          <p className={styles.essayLine}>
            <span className={styles.essayLabel}>Read the piece —</span>{" "}
            <Link href={essayHref(essay)} className={styles.essayLink}>
              {essay.title}
            </Link>
          </p>
        )}

        {related.length > 0 && (
          <>
            <p className={styles.relatedLabel}>Related</p>
            <ul className={styles.related}>
              {related.map((r) => (
                <li key={r!.slug}>
                  <Link href={`/glossary/${r!.slug}`} className={styles.relatedLink}>
                    {r!.term}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        <p className={styles.back}>
          <Link href="/glossary">← All terms</Link>
        </p>
      </div>
    </>
  );
}
