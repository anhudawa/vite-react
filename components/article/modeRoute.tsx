import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { essays, getEssay } from "@/content/essays/registry";
import type { ArticleMode } from "@/lib/content";
import { ArticleView } from "./ArticleView";

/**
 * Shared implementation for the editorial route segments (/features, /guides,
 * /reviews, /dispatch). Each route file is a three-line wrapper around these, so
 * the rendering and metadata stay in one place.
 */
export function modeStaticParams(mode: ArticleMode) {
  return essays.filter((e) => e.mode === mode).map((e) => ({ slug: e.slug }));
}

export function modeMetadata(mode: ArticleMode, slug: string): Metadata {
  const essay = getEssay(slug);
  if (!essay || essay.mode !== mode) return {};
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

export function ModePage(mode: ArticleMode, slug: string) {
  const essay = getEssay(slug);
  if (!essay || essay.mode !== mode) notFound();
  return <ArticleView essay={essay} />;
}
