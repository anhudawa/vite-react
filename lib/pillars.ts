import type { Pillar } from "./content";

/**
 * The five pillars (v2). Hubs that establish topical authority. Mechanical-first;
 * GPS is a thread inside `owning`, never its own pillar. Names deliberately avoid
 * Roadman's "Against the Clock".
 */
export interface PillarDef {
  slug: Pillar;
  /** Full hub title. */
  name: string;
  /** Short chip / nav label. */
  short: string;
  /** Standfirst for the hub. */
  dek: string;
  /** The head query this hub owns. */
  targetQuery: string;
}

export const PILLARS: Record<Pillar, PillarDef> = {
  mechanical: {
    slug: "mechanical",
    name: "The mechanical watch for the endurance athlete",
    short: "Mechanical",
    dek: "Manual and automatic, mostly luxury and enthusiast — the watches worth wearing for the life around the sport.",
    targetQuery: "mechanical watches for endurance athletes",
  },
  instrument: {
    slug: "instrument",
    name: "The instrument of effort",
    short: "Instrument of effort",
    dek: "The chronograph, timing and pacing — the watch as the thing you race against.",
    targetQuery: "watches for timing and pacing sport",
  },
  heritage: {
    slug: "heritage",
    name: "A century of watches and endurance",
    short: "Heritage",
    dek: "Gleitze and the Oyster, the model-from-feat lineage, the honest myths — a hundred years of watches earned in the field.",
    targetQuery: "history of watches and endurance sport",
  },
  owning: {
    slug: "owning",
    name: "Buying, owning and living with watches",
    short: "Buying & owning",
    dek: "How to buy, wear, service and travel with a watch as an athlete-collector — including the honest GPS-versus-mechanical question.",
    targetQuery: "buying a watch as an athlete",
  },
  dispatch: {
    slug: "dispatch",
    name: "Dispatches",
    short: "Dispatches",
    dek: "What's new, what's on the start lines, what we're wearing.",
    targetQuery: "new endurance watch releases",
  },
};

/** Display order. */
export const pillarList: PillarDef[] = [
  PILLARS.mechanical,
  PILLARS.instrument,
  PILLARS.heritage,
  PILLARS.owning,
  PILLARS.dispatch,
];

export function getPillar(slug: string): PillarDef | undefined {
  return pillarList.find((p) => p.slug === slug);
}
