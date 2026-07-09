/**
 * WATCH ENTITIES — the reference library.
 *
 * One entry per watch the corpus actually covers. FACT DISCIPLINE: every spec
 * value below is traceable to a published essay body or to a source URL already
 * held in the verification ledger (data/athletes.ts). Nothing here is researched
 * fresh for this file; if a figure is not in the corpus, it is not on the plate.
 * Prices are indicative and hedged — editorial context, never an offer.
 */

export interface WatchSpec {
  label: string;
  value: string;
}

export interface WatchSource {
  claim: string;
  url: string;
}

export interface WatchEntity {
  /** route slug under /watch — "brand/model" */
  slug: string;
  brand: string;
  model: string;
  oneLiner: string;
  specs: WatchSpec[];
  /** essays in content/essays that cover this watch (registry slugs) */
  essaySlugs: string[];
  /** ledger athletes (data/athletes.ts) recorded wearing it */
  athleteSlugs: string[];
  /** claims with their published corroboration, from the corpus pipeline */
  sources: WatchSource[];
  /** hedged, indicative — rendered as context, never emitted as an offer */
  priceNote?: string;
}

export const watches: WatchEntity[] = [
  {
    slug: "breitling/endurance-pro",
    brand: "Breitling",
    model: "Endurance Pro",
    oneLiner:
      "A thermo-compensated SuperQuartz chronograph in a Breitlight case — the rare luxury sports watch engineered to be raced in, and the reason it is all over the triathlon circuit.",
    specs: [
      { label: "Movement", value: "SuperQuartz, thermo-compensated, chronometer-certified" },
      { label: "Chronograph", value: "Reads to a tenth of a second" },
      { label: "Case", value: "Breitlight composite — lighter than titanium, harder than steel" },
      { label: "Weight", value: "About 64 g on the rubber strap" },
      { label: "Water resistance", value: "100 m" },
      { label: "Sizes", value: "44 mm and 38 mm" },
      { label: "Strap", value: "Rubber, or woven recycled ocean yarn" },
    ],
    essaySlugs: ["the-breitling-endurance-pro"],
    athleteSlugs: ["lucy-charles-barclay", "jan-frodeno", "daniela-ryf"],
    sources: [
      {
        claim: "SuperQuartz movement, 100 m water resistance, chronograph — the Endurance Pro 38",
        url: "https://revolutionwatch.com/breitling-endurance-pro-38/",
      },
      {
        claim: "Lucy Charles-Barclay is a Breitling ambassador",
        url: "https://www.breitling.com/us-en/about/ambassadors/lucy-charles-barclay/",
      },
      {
        claim: "Breitling's Triathlon Squad; Breitling is Ironman's official watch partner",
        url: "https://www.breitling.com/gb-en/about/squads/triathlon/",
      },
      {
        claim: "Jan Frodeno's ambassador page features the Endurance Pro 44",
        url: "https://www.breitling.com/us-en/about/ambassadors/jan-frodeno/",
      },
      {
        claim: "CEO Georges Kern credited Jan Frodeno's input on the Endurance Pro at its 2020 launch",
        url: "https://sharpmagazine.com/2020/08/26/breitling-endurance-pro/",
      },
    ],
  },
  {
    slug: "breitling/top-time-b01-eddy-merckx",
    brand: "Breitling",
    model: "Top Time B01 Eddy Merckx",
    oneLiner:
      "A Tour de France-yellow chronograph on Breitling's own B01 calibre, limited to 525 pieces — one for every race Merckx won. The production run is the record book.",
    specs: [
      { label: "Movement", value: "Breitling B01 manufacture — column wheel, vertical clutch, COSC-certified" },
      { label: "Power reserve", value: "About 70 hours" },
      { label: "Frequency", value: "28,800 vph (4 Hz)" },
      { label: "Case", value: "41 mm stainless steel, 13.3 mm thick" },
      { label: "Water resistance", value: "100 m" },
      { label: "Dial", value: "Yellow — the maillot jaune — with Merckx's signature above 6 o'clock" },
      { label: "Edition", value: "525 pieces, matching Merckx's career victories" },
      { label: "Reference", value: "AB01762C1I1X1 (leather) / AB01762C1I1A1 (bracelet)" },
    ],
    essaySlugs: ["one-of-525"],
    athleteSlugs: [],
    sources: [
      {
        claim: "Reference, dimensions, B01 calibre, 100 m rating, yellow dial with signature, 525-piece edition matching total victories",
        url: "https://www.breitling.com/us-en/watches/top-time/top-time-b01/AB01762C1I1X1/",
      },
      {
        claim: "Part of the Top Time cycling editions alongside the Fausto Coppi and Gino Bartali models (750 pieces each)",
        url: "https://www.breitling.com/us-en/campaigns/top-time-cycling-editions/",
      },
      {
        claim: "B01 is COSC-certified with a column wheel and vertical clutch; the yellow references the maillot jaune Merckx wore for a record 96 days",
        url: "https://www.fratellowatches.com/tour-de-france-yellow-breitling-top-time-b01-eddy-merckx/",
      },
    ],
    priceNote:
      "Around $8,050 on leather, $8,450 on the bracelet — indicative launch pricing, context rather than an offer.",
  },
  {
    slug: "bravur/grand-tour-sprinter",
    brand: "Bravur",
    model: "Grand Tour Sprinter",
    oneLiner:
      "A Swedish automatic chronograph, hand-built in Båstad, that themes itself to cycling with real fluency — the flamme rouge at twelve, an upside-down lucky 13, a finish-line rotor.",
    specs: [
      { label: "Movement", value: "Sellita SW511b automatic chronograph, 4 Hz" },
      { label: "Power reserve", value: "Up to 62 hours" },
      { label: "Case", value: "38.2 mm, 316L steel" },
      { label: "Water resistance", value: "10 ATM" },
      { label: "Crystal", value: "Domed sapphire, with a sapphire case back" },
      { label: "Registers", value: "15-minute and 12-hour counters" },
      { label: "Dial", value: "Muted green, tarmac texture; flamme rouge index at 12" },
      { label: "Built", value: "Hand-built in Båstad, Sweden" },
    ],
    essaySlugs: ["the-last-kilometre"],
    athleteSlugs: [],
    sources: [
      {
        claim: "Specifications, design detail and price as reported in our feature",
        url: "/features/the-last-kilometre",
      },
    ],
    priceNote: "Around $2,550 at the time of writing — indicative, and quoted as context rather than an offer.",
  },
];

export function getWatchBySlug(slug: string): WatchEntity | undefined {
  return watches.find((w) => w.slug === slug);
}

export function watchesOfBrand(brand: string): WatchEntity[] {
  return watches.filter((w) => w.brand.toLowerCase() === brand.toLowerCase());
}
