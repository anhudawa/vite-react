import Link from "next/link";
import { collections } from "@/data/collections";
import { essays } from "@/content/essays/registry";
import { essayHref, type EssayEntry } from "@/lib/content";
import styles from "./TrailStrip.module.css";

/**
 * "Part of a trail" — when the essay sits in a curated collection, a slim
 * hairline row under the masthead names the trail and offers the step before
 * and the step after. When an essay appears in several collections, the first
 * in data/collections.ts wins. Pure navigation chrome, so it does not print
 * (see the @media print block in app/globals.css).
 */
export function TrailStrip({ slug }: { slug: string }) {
  const collection = collections.find((c) => c.slugs.includes(slug));
  if (!collection) return null;

  // Resolve the curated order against the registry, dropping any slug it
  // cannot supply — same discipline as the collection pages.
  const trail = collection.slugs
    .map((s) => essays.find((e) => e.slug === s))
    .filter((e): e is EssayEntry => e !== undefined);
  const i = trail.findIndex((e) => e.slug === slug);
  if (i === -1) return null;

  const prev = i > 0 ? trail[i - 1] : undefined;
  const next = i < trail.length - 1 ? trail[i + 1] : undefined;

  return (
    <nav className={styles.trail} aria-label="Reading trail" data-article-trail>
      <div className={styles.row}>
        <p className={styles.label}>
          Part of:{" "}
          <Link href={`/collections/${collection.slug}`} className={styles.collection}>
            {collection.title}
          </Link>
        </p>
        <p className={styles.steps}>
          {prev && (
            <Link href={essayHref(prev)} className={styles.step} rel="prev">
              <span aria-hidden="true">&larr; </span>
              {prev.title}
            </Link>
          )}
          {next && (
            <Link href={essayHref(next)} className={styles.step} rel="next">
              {next.title}
              <span aria-hidden="true"> &rarr;</span>
            </Link>
          )}
        </p>
      </div>
    </nav>
  );
}
