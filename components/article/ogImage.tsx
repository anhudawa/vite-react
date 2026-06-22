import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { essays, getEssay } from "@/content/essays/registry";
import type { ArticleMode } from "@/lib/content";

// Shared OG-image generation for the editorial mode routes, so every piece gets
// a per-article card without duplicating the renderer per route.
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "An article from The Long Second";

export function ogParams(mode: ArticleMode) {
  return essays.filter((e) => e.mode === mode).map((e) => ({ slug: e.slug }));
}

export function ogImage(slug: string, footer: string) {
  const essay = getEssay(slug);
  return ogCard({
    kicker: essay?.kicker ?? footer,
    title: essay?.title ?? "The Long Second",
    footer,
  });
}
