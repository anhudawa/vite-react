import { essays } from "@/content/essays/registry";
import type { EssayEntry } from "@/lib/content";

export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface TagInfo {
  tag: string; // display label (first-seen casing)
  slug: string;
  count: number;
}

/** Every tag across the essays, with counts, most-used first. */
export function allTags(): TagInfo[] {
  const map = new Map<string, { tag: string; count: number }>();
  for (const e of essays) {
    for (const t of e.tags ?? []) {
      const slug = tagSlug(t);
      const existing = map.get(slug);
      if (existing) existing.count += 1;
      else map.set(slug, { tag: t, count: 1 });
    }
  }
  return [...map.entries()]
    .map(([slug, v]) => ({ slug, tag: v.tag, count: v.count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function essaysByTag(slug: string): EssayEntry[] {
  return essays.filter((e) => (e.tags ?? []).some((t) => tagSlug(t) === slug));
}

export function tagLabelFromSlug(slug: string): string | undefined {
  return allTags().find((t) => t.slug === slug)?.tag;
}
