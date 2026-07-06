import { ArticleCard } from "@/components/ArticleCard";
import { relatedEssays } from "@/lib/related";
import styles from "./RelatedEssays.module.css";

export function RelatedEssays({ slug }: { slug: string }) {
  const related = relatedEssays(slug, 2);
  if (related.length === 0) return null;

  return (
    <aside className={styles.wrap} aria-labelledby="related-h" data-related-essays>
      <p id="related-h" className={styles.label}>
        Keep reading
      </p>
      <div className={styles.grid}>
        {related.map((e, i) => (
          <ArticleCard key={e.slug} essay={e} index={i + 1} />
        ))}
      </div>
    </aside>
  );
}
