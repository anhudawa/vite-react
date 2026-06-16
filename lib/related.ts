import { essays } from "@/content/essays/registry";
import type { EssayEntry } from "@/lib/content";

/** Essays most related to `slug`, ranked by shared tags then shared silo. */
export function relatedEssays(slug: string, limit = 2): EssayEntry[] {
  const current = essays.find((e) => e.slug === slug);
  if (!current) return [];
  const tags = new Set((current.tags ?? []).map((t) => t.toLowerCase()));

  return essays
    .filter((e) => e.slug !== slug)
    .map((e) => {
      const shared = (e.tags ?? []).filter((t) => tags.has(t.toLowerCase())).length;
      const siloMatch = e.silo === current.silo ? 0.5 : 0;
      return { e, score: shared + siloMatch };
    })
    .sort((a, b) => b.score - a.score || +new Date(b.e.date) - +new Date(a.e.date))
    .slice(0, limit)
    .map((r) => r.e);
}
