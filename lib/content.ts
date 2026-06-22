import type { ComponentType } from "react";

/** v2 pillar taxonomy — the hubs that establish topical authority. */
export type Pillar = "mechanical" | "instrument" | "heritage" | "owning" | "dispatch";

/** Editorial mode — drives the route taxonomy and the JSON-LD @type. */
export type ArticleMode = "feature" | "guide" | "review" | "dispatch";

export interface EssayMeta {
  title: string;
  dek: string; // standfirst
  silo: "essays" | "watches-in-sport" | "buying-guides";
  /** The pillar hub this piece belongs to (v2). */
  pillar?: Pillar;
  /** Editorial mode (v2) — feature / guide / review / dispatch. */
  mode?: ArticleMode;
  date: string; // ISO
  readingTime: string;
  kicker?: string;
  tags?: string[];
  /** Drive the after-article email capture CTA, per piece. */
  emailHook?: string;
  emailOffer?: string;
  /** Guides: answer-first Q&A — rendered as a section and FAQPage schema. */
  faq?: { q: string; a: string }[];
  image?: {
    src: string;
    alt: string;
    subject?: string;
    watch?: string;
    ratio?: string;
    position?: string;
    treatment?: "mono" | "natural";
  };
}

export interface EssayEntry extends EssayMeta {
  slug: string;
  Content: ComponentType;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** The route section for an editorial mode (v2 taxonomy). */
export function sectionOf(mode?: ArticleMode): { label: string; href: string } {
  switch (mode) {
    case "guide":
      return { label: "Guides", href: "/guides" };
    case "review":
      return { label: "Reviews", href: "/reviews" };
    case "dispatch":
      return { label: "Dispatches", href: "/dispatch" };
    case "feature":
    default:
      return { label: "Features", href: "/features" };
  }
}

/** Canonical URL for a piece, by mode. Features are the default. */
export function essayHref(e: { slug: string; mode?: ArticleMode }): string {
  return `${sectionOf(e.mode).href}/${e.slug}`;
}
