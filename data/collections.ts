/**
 * Collections — editor-curated reading trails through the archive.
 *
 * The corpus holds many race-against-the-clock pieces that read repetitively
 * back-to-back. A collection fixes the order: each essay is placed so it
 * answers a different facet of the one before it.
 *
 * DATA DISCIPLINE: every slug listed here must exist in
 * content/essays/registry.ts. Pages resolve entries via `getEssay` and drop
 * anything the registry cannot supply.
 */

export interface Collection {
  slug: string;
  title: string;
  /** Standfirst for the trail. */
  dek: string;
  /** 2–3 sentences, house voice. */
  intro: string;
  /** Ordered essay slugs — the curated reading order. */
  slugs: string[];
}

export const collections: Collection[] = [
  {
    slug: "the-records-canon",
    title: "The Records Canon",
    dek: "Seven pieces on racing the clock, sequenced so each answers a different question.",
    intro:
      "Read at random, the record essays can blur into one long race against the clock. In this order, each takes a different facet: the barrier, the margin, the long hold, the mark the books refuse, the fixed hour, the deadline, and the ride with no line at all.",
    slugs: [
      "the-four-minute-mile",
      "the-1989-tour-eight-seconds",
      "sixteen-years",
      "the-number-that-doesnt-count",
      "the-longest-hour",
      "the-gun-at-twelve-hours",
      "no-one-at-the-line",
    ],
  },
  {
    slug: "start-here",
    title: "Start Here",
    dek: "Six pieces that set the terms — what the watch is for, what it costs, and how it works.",
    intro:
      "A first pass through the site for the reader who arrives cold. It opens with why an athlete wears a watch at all, moves through what keeping time asks of a machine, and ends at the door of the first purchase.",
    slugs: [
      "the-instrument-of-effort",
      "the-same-machine",
      "what-it-costs-to-keep-time",
      "the-escapement-the-part-that-lets-go",
      "what-a-chronometer-actually-is",
      "your-first-automatic-what-matters",
    ],
  },
  {
    slug: "the-triathlon-thread",
    title: "The Triathlon Thread",
    dek: "Five pieces for the swim, the bike, the run — and the long day that joins them.",
    intro:
      "Triathlon asks more of a watch than any single sport: seventeen hours of it, some in open water, all on a lean wrist. This trail runs from the race itself to the case that keeps the water out and the sizing that keeps the watch in place.",
    slugs: [
      "seventeen-hours",
      "the-breitling-endurance-pro",
      "water-resistance-for-swimmers",
      "the-waterproof-watch-and-the-open-water",
      "sizing-a-watch-for-a-lean-wrist",
    ],
  },
  {
    slug: "the-workshop",
    title: "The Workshop",
    dek: "Owning and upkeep — six pieces on buying well and keeping it running.",
    intro:
      "Ownership begins after the purchase. This trail covers the choices that matter in a first automatic, the language of references, the life the watch leads on the bike, and the small disciplines — servicing, straps, lume — that keep it useful for decades.",
    slugs: [
      "your-first-automatic-what-matters",
      "how-to-read-a-reference",
      "automatics-on-the-bike",
      "when-to-service-a-mechanical-watch",
      "straps-for-sport",
      "lume-and-the-dark",
    ],
  },
  {
    slug: "the-cycling-thread",
    title: "The Cycling Thread",
    dek: "Eight pieces for July — the Tour, the clock, and the riders who live by both.",
    intro:
      "The Tour is on, and for three weeks the sport runs on elapsed time. This trail starts at the wrists in this year's peloton and works inward: the eight seconds that decided 1989, the gruppetto's survival arithmetic, the fixed hour, the pursuit's four naked laps, a numbered edition, the last kilometre, and a ride with no line at all.",
    slugs: [
      "the-wrists-of-the-2026-tour",
      "the-1989-tour-eight-seconds",
      "the-autobus",
      "the-longest-hour",
      "four-laps-no-hiding",
      "one-of-525",
      "the-last-kilometre",
      "no-one-at-the-line",
    ],
  },
];

export function getCollection(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}
