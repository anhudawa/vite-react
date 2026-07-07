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
import EndurancePro, { meta as endurancePro } from "./the-breitling-endurance-pro.mdx";
import EightSeconds, { meta as eightSeconds } from "./the-1989-tour-eight-seconds.mdx";
import NumberDoesntCount, { meta as numberDoesntCount } from "./the-number-that-doesnt-count.mdx";
import LongestHour, { meta as longestHour } from "./the-longest-hour.mdx";
import LastKilometre, { meta as lastKilometre } from "./the-last-kilometre.mdx";
import SixteenYears, { meta as sixteenYears } from "./sixteen-years.mdx";
import OlympicClock, { meta as olympicClock } from "./omega-and-the-olympic-clock.mdx";
import Chronometer, { meta as chronometer } from "./what-a-chronometer-actually-is.mdx";
import Escapement, { meta as escapement } from "./the-escapement-the-part-that-lets-go.mdx";
import Servicing, { meta as servicing } from "./when-to-service-a-mechanical-watch.mdx";
import FirstAutomatic, { meta as firstAutomatic } from "./your-first-automatic-what-matters.mdx";
import WaterproofCase, { meta as waterproofCase } from "./the-waterproof-watch-and-the-open-water.mdx";
import OverbuiltWatch, { meta as overbuiltWatch } from "./the-overbuilt-watch.mdx";
import ElevenTests, { meta as elevenTests } from "./the-eleven-tests.mdx";
import ClockFoundShip, { meta as clockFoundShip } from "./the-clock-that-found-the-ship.mdx";
import Autobus, { meta as autobus } from "./the-autobus.mdx";
import GunTwelveHours, { meta as gunTwelveHours } from "./the-gun-at-twelve-hours.mdx";
import FourLaps, { meta as fourLaps } from "./four-laps-no-hiding.mdx";
import NoOneAtTheLine, { meta as noOneAtTheLine } from "./no-one-at-the-line.mdx";
import Lume, { meta as lume } from "./lume-and-the-dark.mdx";
import AutomaticsBike, { meta as automaticsBike } from "./automatics-on-the-bike.mdx";
import ReadReference, { meta as readReference } from "./how-to-read-a-reference.mdx";
import SizingLeanWrist, { meta as sizingLeanWrist } from "./sizing-a-watch-for-a-lean-wrist.mdx";
import UnclaimedWrist, { meta as unclaimedWrist } from "./the-unclaimed-wrist.mdx";
import OneOf525, { meta as oneOf525 } from "./one-of-525.mdx";
import SeventeenHours, { meta as seventeenHours } from "./seventeen-hours.mdx";
import Handover, { meta as handover } from "./the-handover.mdx";
import WristsOf2026Tour, { meta as wristsOf2026Tour } from "./the-wrists-of-the-2026-tour.mdx";

const raw: { slug: string; meta: EssayMeta; Content: EssayEntry["Content"] }[] = [
  { slug: "the-wrists-of-the-2026-tour", meta: wristsOf2026Tour as unknown as EssayMeta, Content: WristsOf2026Tour },
  { slug: "the-handover", meta: handover as unknown as EssayMeta, Content: Handover },
  { slug: "one-of-525", meta: oneOf525 as unknown as EssayMeta, Content: OneOf525 },
  { slug: "the-unclaimed-wrist", meta: unclaimedWrist as unknown as EssayMeta, Content: UnclaimedWrist },
  { slug: "the-overbuilt-watch", meta: overbuiltWatch as unknown as EssayMeta, Content: OverbuiltWatch },
  { slug: "the-eleven-tests", meta: elevenTests as unknown as EssayMeta, Content: ElevenTests },
  { slug: "the-clock-that-found-the-ship", meta: clockFoundShip as unknown as EssayMeta, Content: ClockFoundShip },
  { slug: "the-autobus", meta: autobus as unknown as EssayMeta, Content: Autobus },
  { slug: "the-gun-at-twelve-hours", meta: gunTwelveHours as unknown as EssayMeta, Content: GunTwelveHours },
  { slug: "four-laps-no-hiding", meta: fourLaps as unknown as EssayMeta, Content: FourLaps },
  { slug: "no-one-at-the-line", meta: noOneAtTheLine as unknown as EssayMeta, Content: NoOneAtTheLine },
  { slug: "lume-and-the-dark", meta: lume as unknown as EssayMeta, Content: Lume },
  { slug: "automatics-on-the-bike", meta: automaticsBike as unknown as EssayMeta, Content: AutomaticsBike },
  { slug: "how-to-read-a-reference", meta: readReference as unknown as EssayMeta, Content: ReadReference },
  { slug: "sizing-a-watch-for-a-lean-wrist", meta: sizingLeanWrist as unknown as EssayMeta, Content: SizingLeanWrist },
  {
    slug: "omega-and-the-olympic-clock",
    meta: olympicClock as unknown as EssayMeta,
    Content: OlympicClock,
  },
  {
    slug: "what-a-chronometer-actually-is",
    meta: chronometer as unknown as EssayMeta,
    Content: Chronometer,
  },
  {
    slug: "the-escapement-the-part-that-lets-go",
    meta: escapement as unknown as EssayMeta,
    Content: Escapement,
  },
  {
    slug: "when-to-service-a-mechanical-watch",
    meta: servicing as unknown as EssayMeta,
    Content: Servicing,
  },
  {
    slug: "your-first-automatic-what-matters",
    meta: firstAutomatic as unknown as EssayMeta,
    Content: FirstAutomatic,
  },
  {
    slug: "the-waterproof-watch-and-the-open-water",
    meta: waterproofCase as unknown as EssayMeta,
    Content: WaterproofCase,
  },
  {
    slug: "seventeen-hours",
    meta: seventeenHours as unknown as EssayMeta,
    Content: SeventeenHours,
  },
  {
    slug: "sixteen-years",
    meta: sixteenYears as unknown as EssayMeta,
    Content: SixteenYears,
  },
  {
    slug: "the-last-kilometre",
    meta: lastKilometre as unknown as EssayMeta,
    Content: LastKilometre,
  },
  {
    slug: "the-longest-hour",
    meta: longestHour as unknown as EssayMeta,
    Content: LongestHour,
  },
  {
    slug: "the-number-that-doesnt-count",
    meta: numberDoesntCount as unknown as EssayMeta,
    Content: NumberDoesntCount,
  },
  {
    slug: "the-1989-tour-eight-seconds",
    meta: eightSeconds as unknown as EssayMeta,
    Content: EightSeconds,
  },
  {
    slug: "the-breitling-endurance-pro",
    meta: endurancePro as unknown as EssayMeta,
    Content: EndurancePro,
  },
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
