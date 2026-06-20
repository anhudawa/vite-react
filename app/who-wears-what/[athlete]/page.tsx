import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FactBlock } from "@/components/FactBlock";
import { FactProvenance } from "@/components/FactProvenance";
import { Figure } from "@/components/Figure";
import {
  athletes,
  getPublishedAthlete,
  publishedAthletes,
  renderableFacts,
} from "@/data/athletes";
import { assertPublishedFactsAreValid } from "@/lib/verification";
import { brandOfWatch } from "@/lib/brands";
import {
  JsonLd,
  breadcrumb,
  personJsonLd,
  productWatchJsonLd,
} from "@/lib/jsonld";
import styles from "./athlete.module.css";

// BUILD-TIME ENFORCEMENT. Evaluated when this route module loads during
// `next build`. If any fact marked "published" cannot clear the gauntlet, this
// throws and the build fails — wrong information cannot reach production.
assertPublishedFactsAreValid(athletes.flatMap((a) => a.facts));

export function generateStaticParams() {
  return publishedAthletes().map((a) => ({ athlete: a.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { athlete: string };
}): Metadata {
  const a = getPublishedAthlete(params.athlete);
  if (!a) return {};
  return {
    title: `${a.name} — Who Wears What`,
    description: a.summary,
  };
}

export default function AthletePage({
  params,
}: {
  params: { athlete: string };
}) {
  const a = getPublishedAthlete(params.athlete);
  if (!a) notFound();
  const facts = renderableFacts(a);
  const path = `/who-wears-what/${a.slug}`;
  const lead = facts[0];
  const brand = brandOfWatch(lead.watch);
  const brandSlug = brand?.toLowerCase().replace(/\s+/g, "-");

  return (
    <article className={styles.page}>
      <JsonLd
        data={[
          personJsonLd({
            name: a.name,
            nationality: a.nationality,
            sameAs: a.sameAs,
            path,
          }),
          productWatchJsonLd({
            watch: lead.watch,
            brand,
            reference: lead.reference,
          }),
          breadcrumb([
            { name: "Home", path: "/" },
            { name: "Who Wears What", path: "/who-wears-what" },
            { name: a.name, path },
          ]),
        ]}
      />

      <header className={`container ${styles.head}`}>
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <Link href="/">The Long Second</Link>
          <span className={styles.sep}>/</span>
          <Link href="/who-wears-what">Who Wears What</Link>
        </nav>
        <p className={styles.kicker}>Reference</p>
        <h1 className={styles.name}>{a.name}</h1>
        <p className={styles.discipline}>
          {a.discipline} <span aria-hidden="true">·</span> {a.nationality}
        </p>
        <p className={styles.summary}>{a.summary}</p>
      </header>

      <div className={`container ${styles.grid}`}>
        <div className={styles.facts}>
          <p className={styles.factsLabel}>Logged references</p>
          {facts.map((f) => (
            <div key={f.id} className={styles.factGroup}>
              <FactBlock fact={f} />
              <FactProvenance fact={f} />
            </div>
          ))}
          <p className={styles.disclaimer}>
            Confidence reflects the strength and number of independent sources, not our
            enthusiasm. We log the relationship as it is — sponsorship, personal
            purchase, or loan — and say so plainly.
          </p>
        </div>

        <div className={styles.notes}>
          {a.image && (
            <Figure
              src={a.image.src}
              alt={a.image.alt}
              watch={a.image.caption}
              ratio="4 / 5"
              sizes="(max-width: 900px) 100vw, 44vw"
              className={styles.portrait}
            />
          )}
          <p className={styles.notesLabel}>The context</p>
          {a.notes.map((n, i) => (
            <p key={i} className={styles.note}>
              {n}
            </p>
          ))}
        </div>
      </div>

      <div className={`container ${styles.back}`}>
        <Link href="/who-wears-what">← All references</Link>
        {brand && brandSlug && (
          <Link href={`/brands/${brandSlug}`}>More {brand} in sport →</Link>
        )}
      </div>
    </article>
  );
}
