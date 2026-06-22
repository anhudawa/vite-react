import type { EssayEntry, EssayMeta, Pillar } from "@/lib/content";

// NOTE: `readingTime` in each essay's meta is COMPUTED, never hand-typed — run
// `npm run reading-time` (scripts/reading-time.mjs) to regenerate it from the
// actual word count at ~230 wpm. A label can't lie if no one writes it by hand.

import SameMachine, { meta as sameMachine } from "./the-same-machine.mdx";
import WhatItCosts, { meta as whatItCosts } from "./what-it-costs-to-keep-time.mdx";
import SweepSurge, { meta as sweepSurge } from "./the-sweep-and-the-surge.mdx";
import FieldGuide, { meta as fieldGuide } from "./watches-in-sport-field-guide.mdx";
import Instrument, { meta as instrument } from "./the-instrument-of-effort.mdx";
import Gleitze, { meta as gleitze } from "./mercedes-gleitze-and-the-oyster.mdx";
import Everest, { meta as everest } from "./everest-1953-the-watch-and-the-record.mdx";
import Chrono, { meta as chrono } from "./the-chronograph-for-athletes.mdx";
import AutoManual, { meta as autoManual } from "./automatic-vs-manual-wind.mdx";
import WaterResistance, { meta as waterResistance } from "./water-resistance-for-swimmers.mdx";
import OneWatch, { meta as oneWatch } from "./the-one-watch-question.mdx";
import Lineage, { meta as lineage } from "./the-model-from-feat-lineage.mdx";
import GpsVsMech, { meta as gpsVsMech } from "./gps-watch-vs-mechanical.mdx";
import F91W, { meta as f91w } from "./casio-f-91w-and-the-time-trial.mdx";
import FirstWatch, { meta as firstWatch } from "./first-nice-watch-as-an-athlete.mdx";
import Straps, { meta as straps } from "./straps-for-sport.mdx";
import LanceArmstrong, { meta as lanceArmstrong } from "./lance-armstrong-watches.mdx";
import FourMinuteMile, { meta as fourMinuteMile } from "./the-four-minute-mile.mdx";

const raw: { slug: string; meta: EssayMeta; Content: EssayEntry["Content"] }[] = [
  {
    slug: "the-four-minute-mile",
    meta: fourMinuteMile as unknown as EssayMeta,
    Content: FourMinuteMile,
  },
  {
    slug: "lance-armstrong-watches",
    meta: lanceArmstrong as unknown as EssayMeta,
    Content: LanceArmstrong,
  },
  {
    slug: "gps-watch-vs-mechanical",
    meta: gpsVsMech as unknown as EssayMeta,
    Content: GpsVsMech,
  },
  {
    slug: "casio-f-91w-and-the-time-trial",
    meta: f91w as unknown as EssayMeta,
    Content: F91W,
  },
  {
    slug: "first-nice-watch-as-an-athlete",
    meta: firstWatch as unknown as EssayMeta,
    Content: FirstWatch,
  },
  {
    slug: "straps-for-sport",
    meta: straps as unknown as EssayMeta,
    Content: Straps,
  },
  {
    slug: "the-model-from-feat-lineage",
    meta: lineage as unknown as EssayMeta,
    Content: Lineage,
  },
  {
    slug: "automatic-vs-manual-wind",
    meta: autoManual as unknown as EssayMeta,
    Content: AutoManual,
  },
  {
    slug: "water-resistance-for-swimmers",
    meta: waterResistance as unknown as EssayMeta,
    Content: WaterResistance,
  },
  {
    slug: "the-one-watch-question",
    meta: oneWatch as unknown as EssayMeta,
    Content: OneWatch,
  },
  {
    slug: "the-instrument-of-effort",
    meta: instrument as unknown as EssayMeta,
    Content: Instrument,
  },
  {
    slug: "mercedes-gleitze-and-the-oyster",
    meta: gleitze as unknown as EssayMeta,
    Content: Gleitze,
  },
  {
    slug: "everest-1953-the-watch-and-the-record",
    meta: everest as unknown as EssayMeta,
    Content: Everest,
  },
  {
    slug: "the-chronograph-for-athletes",
    meta: chrono as unknown as EssayMeta,
    Content: Chrono,
  },
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
