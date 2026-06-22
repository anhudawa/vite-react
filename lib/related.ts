import { essays } from "@/content/essays/registry";
import type { EssayEntry } from "@/lib/content";

/**
 * Essays most related to `slug`. Curated `relatedSlugs` win first (the
 * bidirectional links per D.4), then we fill by shared tags, then pillar/silo.
 */
export function relatedEssays(slug: string, limit = 2): EssayEntry[] {
  const current = essays.find((e) => e.slug === slug);
  if (!current) return [];

  const out: EssayEntry[] = [];
  const take = (e?: EssayEntry) => {
    if (e && e.slug !== slug && !out.some((o) => o.slug === e.slug)) out.push(e);
  };

  // 1. curated siblings, in order
  for (const rel of current.relatedSlugs ?? []) {
    take(essays.find((e) => e.slug === rel));
    if (out.length >= limit) return out;
  }

  // 2. fill by shared tags, then same pillar, then same silo
  const tags = new Set((current.tags ?? []).map((t) => t.toLowerCase()));
  const ranked = essays
    .filter((e) => e.slug !== slug && !out.some((o) => o.slug === e.slug))
    .map((e) => {
      const shared = (e.tags ?? []).filter((t) => tags.has(t.toLowerCase())).length;
      const pillarMatch = e.pillar && e.pillar === current.pillar ? 1 : 0;
      const siloMatch = e.silo === current.silo ? 0.5 : 0;
      return { e, score: shared + pillarMatch + siloMatch };
    })
    .sort((a, b) => b.score - a.score || +new Date(b.e.date) - +new Date(a.e.date));

  for (const r of ranked) {
    take(r.e);
    if (out.length >= limit) break;
  }
  return out;
}
