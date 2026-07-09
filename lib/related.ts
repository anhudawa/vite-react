import { essays } from "@/content/essays/registry";
import type { EssayEntry } from "@/lib/content";

/**
 * The related-reading engine. Hand-typed `relatedSlugs` stay as the editorial
 * override — they lead, in their order, resolved against `all` (invalid slugs
 * skipped). When absent or shorter than `n`, computed picks fill the remainder:
 * shared tags weigh 3 each (case-insensitive), same pillar 2, same mode 1,
 * shared watchesMentioned 3 each. Self excluded, no duplicates, ties broken by
 * date desc then slug — the output is fully deterministic.
 */
export function relatedFor(essay: EssayEntry, all: EssayEntry[], n = 3): EssayEntry[] {
  const out: EssayEntry[] = [];
  const take = (e?: EssayEntry) => {
    if (e && e.slug !== essay.slug && !out.some((o) => o.slug === e.slug)) out.push(e);
  };

  // 1. editorial siblings, in their order (the bidirectional links per D.4)
  for (const rel of essay.relatedSlugs ?? []) {
    take(all.find((e) => e.slug === rel));
    if (out.length >= n) return out;
  }

  // 2. computed fill — score, then a deterministic tiebreak
  const tags = new Set((essay.tags ?? []).map((t) => t.toLowerCase()));
  const watches = new Set((essay.watchesMentioned ?? []).map((w) => w.toLowerCase()));
  const ranked = all
    .filter((e) => e.slug !== essay.slug && !out.some((o) => o.slug === e.slug))
    .map((e) => {
      const sharedTags = (e.tags ?? []).filter((t) => tags.has(t.toLowerCase())).length;
      const sharedWatches = (e.watchesMentioned ?? []).filter((w) =>
        watches.has(w.toLowerCase())
      ).length;
      const samePillar = e.pillar && e.pillar === essay.pillar ? 2 : 0;
      const sameMode = e.mode && e.mode === essay.mode ? 1 : 0;
      return { e, score: sharedTags * 3 + sharedWatches * 3 + samePillar + sameMode };
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        +new Date(b.e.date) - +new Date(a.e.date) ||
        (a.e.slug < b.e.slug ? -1 : 1)
    );

  for (const r of ranked) {
    take(r.e);
    if (out.length >= n) break;
  }
  return out;
}

/** Essays most related to `slug`, against the full registry. */
export function relatedEssays(slug: string, limit = 2): EssayEntry[] {
  const current = essays.find((e) => e.slug === slug);
  return current ? relatedFor(current, essays, limit) : [];
}
