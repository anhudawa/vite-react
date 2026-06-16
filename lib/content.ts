import type { ComponentType } from "react";

export interface EssayMeta {
  title: string;
  dek: string; // standfirst
  silo: "essays" | "watches-in-sport" | "buying-guides";
  date: string; // ISO
  readingTime: string;
  kicker?: string;
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
