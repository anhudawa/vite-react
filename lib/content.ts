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
