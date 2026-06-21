import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { essays, getEssay } from "@/content/essays/registry";
import { formatDate } from "@/lib/content";
import { site } from "@/lib/site";
import { JsonLd, articleJsonLd, authorPersonJsonLd, breadcrumb } from "@/lib/jsonld";
import { ReadingProgress } from "@/components/ReadingProgress";
import { RelatedEssays } from "@/components/RelatedEssays";
import { Byline } from "@/components/Byline";
import { AuthorModule } from "@/components/AuthorModule";
import { Figure } from "@/components/Figure";
import { tagSlug } from "@/lib/tags";
import styles from "./prose.module.css";

export function generateStaticParams() {
  return essays.map((e) => ({ slug: e.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const essay = getEssay(params.slug);
  if (!essay) return {};
  return {
    title: essay.title,
    description: essay.dek,
    openGraph: {
      type: "article",
      title: essay.title,
      description: essay.dek,
      publishedTime: essay.date,
    },
  };
}

export default function EssayPage({ params }: { params: { slug: string } }) {
  const essay = getEssay(params.slug);
  if (!essay) notFound();

  const idx = essays.findIndex((e) => e.slug === essay.slug);
  const next = essays[(idx + 1) % essays.length];
  const Content = essay.Content;
  const path = `/essays/${essay.slug}`;

  return (
    <article className={styles.article}>
      <ReadingProgress />
      <JsonLd
        data={[
          articleJsonLd({
            title: essay.title,
            description: essay.dek,
            datePublished: essay.date,
            path,
          }),
          authorPersonJsonLd(),
          breadcrumb([
            { name: "Home", path: "/" },
            { name: "Essays", path: "/essays" },
            { name: essay.title, path },
          ]),
        ]}
      />

      <header className={styles.head}>
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <Link href="/">{site.name}</Link>
          <span className={styles.crumbSep}>/</span>
          <Link href="/essays">Essays</Link>
        </nav>
        <p className={styles.kicker}>{essay.kicker ?? "Essay"}</p>
        <h1 className={styles.title}>{essay.title}</h1>
        <p className={styles.dek}>{essay.dek}</p>
        <div className={styles.bylineRow}>
          <Byline readingTime={essay.readingTime} />
          <time className={styles.pubdate} dateTime={essay.date}>
            {formatDate(essay.date)}
          </time>
        </div>
        {essay.tags && essay.tags.length > 0 && (
          <ul className={styles.tags} aria-label="Tags">
            {essay.tags.map((t) => (
              <li key={t}>
                <Link href={`/tag/${tagSlug(t)}`} className={styles.tag}>
                  {t}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </header>

      {essay.image && (
        <div className={styles.lead}>
          <Figure
            src={essay.image.src}
            alt={essay.image.alt}
            subject={essay.image.subject}
            watch={essay.image.watch}
            ratio={essay.image.ratio ?? "3 / 2"}
            objectPosition={essay.image.position}
            treatment={essay.image.treatment ?? "mono"}
            sizes="(max-width: 960px) 100vw, 880px"
          />
        </div>
      )}

      <div className={styles.body}>
        <Content />
      </div>

      <div className={styles.authorSlot}>
        <AuthorModule />
      </div>

      <div className={styles.related}>
        <RelatedEssays slug={essay.slug} />
      </div>

      <footer className={styles.foot}>
        <p className={styles.footEssence}>{site.essence}</p>
        <div className={styles.next}>
          <span className={styles.nextLabel}>Next essay</span>
          <Link href={`/essays/${next.slug}`}>{next.title} →</Link>
        </div>
      </footer>
    </article>
  );
}
