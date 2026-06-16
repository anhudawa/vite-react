import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FactBlock } from "@/components/FactBlock";
import { athletes, getAthlete } from "@/data/athletes";
import { JsonLd, breadcrumb, personJsonLd } from "@/lib/jsonld";
import styles from "./athlete.module.css";

export function generateStaticParams() {
  return athletes.filter((a) => a.published).map((a) => ({ athlete: a.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { athlete: string };
}): Metadata {
  const a = getAthlete(params.athlete);
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
  const a = getAthlete(params.athlete);
  if (!a || !a.published) notFound();
  const path = `/who-wears-what/${a.slug}`;

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
          breadcrumb([
            { name: "Home", path: "/" },
            { name: "Who Wears What", path: "/who-wears-what" },
            { name: a.name, path },
          ]),
        ]}
      />

      <header className={`container ${styles.head}`}>
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <Link href="/">Escapement</Link>
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
          {a.facts.map((f, i) => (
            <FactBlock key={i} fact={f} />
          ))}
          <p className={styles.disclaimer}>
            Confidence reflects the strength and number of independent sources, not our
            enthusiasm. We log the relationship as it is — sponsorship, personal
            purchase, or loan — and say so plainly.
          </p>
        </div>

        <div className={styles.notes}>
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
      </div>
    </article>
  );
}
