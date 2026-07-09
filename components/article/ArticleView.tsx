import Link from "next/link";
import { essays } from "@/content/essays/registry";
import { formatDate, essayHref, type EssayEntry } from "@/lib/content";
import { site } from "@/lib/site";
import { JsonLd, articleJsonLd, authorPersonJsonLd, breadcrumb, faqPageJsonLd } from "@/lib/jsonld";
import { getPillar } from "@/lib/pillars";
import { ReadingProgress } from "@/components/ReadingProgress";
import { relatedFor } from "@/lib/related";
import { Byline } from "@/components/Byline";
import { AuthorModule } from "@/components/AuthorModule";
import { Figure } from "@/components/Figure";
import { EmailCapture } from "@/components/EmailCapture";
import { tagSlug } from "@/lib/tags";
import { SourcesBlock } from "@/components/article/SourcesBlock";
import { TrailStrip } from "@/components/article/TrailStrip";
import styles from "./ArticleView.module.css";

/**
 * The shared article renderer. Used by every editorial route — /features,
 * /guides, /reviews, /dispatch — so the typographic craft stays identical and
 * the canonical URL follows the piece's mode.
 */
export function ArticleView({ essay }: { essay: EssayEntry }) {
  const idx = essays.findIndex((e) => e.slug === essay.slug);
  const next = essays[(idx + 1) % essays.length];
  const related = relatedFor(essay, essays);
  const Content = essay.Content;
  const path = essayHref(essay);
  const pillar = essay.pillar ? getPillar(essay.pillar) : undefined;
  const hub = pillar
    ? { name: pillar.short, path: `/topics/${pillar.slug}` }
    : { name: "Essays", path: "/essays" };

  return (
    <article className={styles.article} data-article-root>
      <ReadingProgress />
      <JsonLd
        data={[
          articleJsonLd({
            title: essay.title,
            description: essay.tldr ?? essay.dek,
            datePublished: essay.date,
            dateModified: essay.dateModified ?? essay.date,
            path,
            type: essay.mode === "dispatch" ? "NewsArticle" : "Article",
            citations: essay.sources?.map((s) => s.url),
          }),
          authorPersonJsonLd(),
          breadcrumb([
            { name: "Home", path: "/" },
            { name: hub.name, path: hub.path },
            { name: essay.title, path },
          ]),
          ...(essay.faq && essay.faq.length > 0 ? [faqPageJsonLd(essay.faq)] : []),
        ]}
      />

      <header className={styles.head}>
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <Link href="/">{site.name}</Link>
          <span className={styles.crumbSep}>/</span>
          <Link href={hub.path}>{hub.name}</Link>
        </nav>
        <p className={styles.kicker}>{essay.kicker ?? "Essay"}</p>
        <h1 className={styles.title} data-article-title>
          {essay.title}
        </h1>
        <p className={styles.dek} data-article-dek>
          {essay.dek}
        </p>
        <div className={styles.bylineRow} data-article-byline>
          <Byline readingTime={essay.readingTime} />
          <div className={styles.dates}>
            <time className={styles.pubdate} dateTime={essay.date}>
              {formatDate(essay.date)}
            </time>
            {essay.dateModified && essay.dateModified !== essay.date && (
              <time className={styles.updated} dateTime={essay.dateModified}>
                Updated {formatDate(essay.dateModified)}
              </time>
            )}
          </div>
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

      <TrailStrip slug={essay.slug} />

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

      <div className={styles.body} data-article-body>
        <Content />
      </div>

      {essay.faq && essay.faq.length > 0 && (
        <section className={styles.faq} aria-labelledby="faq-h">
          <h2 id="faq-h" className={styles.faqHead}>
            Common questions
          </h2>
          <dl>
            {essay.faq.map((f) => (
              <div key={f.q} className={styles.faqItem} data-article-faq-item>
                <dt className={styles.faqQ}>{f.q}</dt>
                <dd className={styles.faqA}>{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <div className={styles.inlineCapture} data-article-inline-capture>
        <EmailCapture
          variant="inline"
          source={`essay:${essay.slug}`}
          hook={essay.emailHook}
          offer={essay.emailOffer}
        />
      </div>

      <div className={styles.authorSlot}>
        <AuthorModule />
      </div>

      {related.length > 0 && (
        <aside className={styles.related} aria-labelledby="related-h" data-article-related>
          <p id="related-h" className={styles.relatedLabel}>
            Related reading
          </p>
          <ul className={styles.relatedList}>
            {related.map((e) => (
              <li key={e.slug} className={styles.relatedItem}>
                <Link href={essayHref(e)} className={styles.relatedTitle}>
                  {e.title}
                </Link>
                <time className={styles.relatedDate} dateTime={e.date}>
                  {formatDate(e.date)}
                </time>
              </li>
            ))}
          </ul>
        </aside>
      )}

      {essay.sources && essay.sources.length > 0 && <SourcesBlock sources={essay.sources} />}

      <footer className={styles.foot} data-article-foot>
        <p className={styles.footEssence}>{site.essence}</p>
        <div className={styles.next} data-article-next>
          <span className={styles.nextLabel}>Next</span>
          <Link href={essayHref(next)}>{next.title} →</Link>
        </div>
      </footer>
    </article>
  );
}
