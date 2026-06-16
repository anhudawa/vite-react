import type { EssayEntry, EssayMeta } from "@/lib/content";

import SameMachine, { meta as sameMachine } from "./the-same-machine.mdx";
import WhatItCosts, { meta as whatItCosts } from "./what-it-costs-to-keep-time.mdx";
import SweepSurge, { meta as sweepSurge } from "./the-sweep-and-the-surge.mdx";

const raw: { slug: string; meta: EssayMeta; Content: EssayEntry["Content"] }[] = [
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
