import type { ComponentType } from "react";

export interface EssayMeta {
  title: string;
  dek: string; // standfirst
  silo: "essays" | "watches-in-sport" | "buying-guides";
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
