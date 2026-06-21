import type { EssayEntry, EssayMeta, Pillar } from "@/lib/content";

// NOTE: `readingTime` in each essay's meta is COMPUTED, never hand-typed — run
// `npm run reading-time` (scripts/reading-time.mjs) to regenerate it from the
// actual word count at ~230 wpm. A label can't lie if no one writes it by hand.

import SameMachine, { meta as sameMachine } from "./the-same-machine.mdx";
import WhatItCosts, { meta as whatItCosts } from "./what-it-costs-to-keep-time.mdx";
import SweepSurge, { meta as sweepSurge } from "./the-sweep-and-the-surge.mdx";
import FieldGuide, { meta as fieldGuide } from "./watches-in-sport-field-guide.mdx";

const raw: { slug: string; meta: EssayMeta; Content: EssayEntry["Content"] }[] = [
  {
    slug: "watches-in-sport-field-guide",
    meta: fieldGuide as unknown as EssayMeta,
    Content: FieldGuide,
  },
  {
    slug: "the-same-machine",
    meta: sameMachine as unknown as EssayMeta,
    Content: SameMachine,
  },
  {
    slug: "what-it-costs-to-keep-time",
    meta: whatItCosts as unknown as EssayMeta,
    Content: WhatItCosts,
  },
  {
    slug: "the-sweep-and-the-surge",
    meta: sweepSurge as unknown as EssayMeta,
    Content: SweepSurge,
  },
];

export const essays: EssayEntry[] = raw
  .map(({ slug, meta, Content }) => ({ slug, ...meta, Content }))
  .sort((a, b) => +new Date(b.date) - +new Date(a.date));

export function getEssay(slug: string): EssayEntry | undefined {
  return essays.find((e) => e.slug === slug);
}

export function essaysBySilo(silo: EssayMeta["silo"]): EssayEntry[] {
  return essays.filter((e) => e.silo === silo);
}

/** Pieces belonging to a pillar hub (v2). */
export function essaysByPillar(pillar: Pillar): EssayEntry[] {
  return essays.filter((e) => e.pillar === pillar);
}
