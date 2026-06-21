// Sport + budget buyers guides. The brief: a cyclist or runner lands
// here wanting to know what to actually buy for their sport, and leaves educated
// — with a curated, honest shortlist, real prices, reasons, and links.
//
// Prices are approximate RRP in GBP and deliberately hedged ("~£219") because
// they drift; the reasoning is the durable part. Picks are real, well-known
// products. Fine-watch brands link to their on-site brand page; tool/GPS brands
// link out to the maker.
//
// FOUNDER REVIEW: these guides are now mechanical-led — the watch each guide
// actually sells is the keeper you wear for the life around the sport, with GPS
// kept as one honest training-instrument option and a single quartz beater nod.
// Confirm models/prices before launch. NOTE: the on-site /brands/<slug> links
// (hamilton, seiko, tissot, omega, rolex, tudor) only resolve once a published
// athlete wears that brand — brand pages are derived from athlete data, so some
// will 404 today. This predates this edit (the old /brands/tudor link had the
// same issue). Decide per brand: publish a wearer, or point these external.

export type Pick = {
  name: string;
  brand: string;
  price: string; // hedged display string, e.g. "~£219" or "£100,000+"
  kind: "GPS" | "Digital" | "Mechanical" | "Smart";
  why: string;
  href?: string;
  external?: boolean;
};

export type Tier = {
  label: string;
  range: string;
  blurb: string;
  picks: Pick[];
};

export type SportGuide = {
  slug: string;
  sport: string;
  title: string;
  dek: string;
  intro: string;
  criteria: { head: string; body: string }[];
  tiers: Tier[];
  counsel: string;
  updated: string;
  image?: { src: string; alt: string; subject: string; watch: string; position?: string };
};

export const buyersGuides: SportGuide[] = [
  // ───────────────────────────── CYCLING ─────────────────────────────
  {
    slug: "cycling",
    sport: "Cycling",
    title: "What to Wear on the Bike",
    dek: "Your ride data lives on the head unit. The watch earns its place the other 23 hours — so buy for the life around the bike, not the two hours on it.",
    intro:
      "On the bike, your computer does the real work. Power, route, segments — that's the head unit's job, and it does it better than anything on your wrist. Which leaves the watch free to be a watch: the one you wear on the commute, at the dinner after the sportive, for the run you cross-train on, and the rest of the life that happens off the saddle. So this guide buys for that life. A cheap tracker handles the numbers if you want them; the watch you actually keep is mechanical, and that's where the money goes.",
    criteria: [
      {
        head: "It lives off the bike",
        body: "Don't pay for cycling features a £200 head unit already does better. Pay for the watch you'll wear walking around, at dinner, and for years after the GPS unit has been recycled.",
      },
      {
        head: "Light, and out of the way",
        body: "A heavy slab catches on bar tape and drives you mad on long days. A slim case sits right under a sleeve and disappears when you're not looking at it.",
      },
      {
        head: "Built to be worn hard",
        body: "Sweat, rain, the odd knock against the bars. The watch worth keeping shrugs all of it off — proper water resistance and a case you don't have to baby.",
      },
    ],
    tiers: [
      {
        label: "Entry",
        range: "under £700",
        blurb: "The honest way in: a real automatic for the life off the bike, with a cheap tracker if you want the numbers.",
        picks: [
          {
            name: "Khaki Field Mechanical",
            brand: "Hamilton",
            price: "~£525",
            kind: "Mechanical",
            why: "The platonic field watch: hand-wound, legible, light, with genuine military lineage. Wind it before the ride, read it at a glance, and it costs less than a mid-range GPS unit you'll replace twice over.",
            href: "/brands/hamilton",
          },
          {
            name: "Seiko 5 Sport",
            brand: "Seiko",
            price: "~£250",
            kind: "Mechanical",
            why: "The default honest automatic: 100m, tough, endlessly wearable. The watch that turns a tracker-only wrist into a collector's, and the one most people should start with.",
            href: "/brands/seiko",
          },
          {
            name: "Coros Pace 3",
            brand: "Coros",
            price: "~£219",
            kind: "GPS",
            why: "If you genuinely train by the numbers, this is the honest instrument: thirty-odd grams, dual-band GPS, weeks of battery. Wear it for the session — but the head unit already has your ride, so don't pay more for one.",
            href: "https://coros.com",
            external: true,
          },
        ],
      },
      {
        label: "Mid",
        range: "£700–5,000",
        blurb: "The sweet spot: one mechanical you can train near, travel with, and not baby.",
        picks: [
          {
            name: "Tissot PRX Powermatic 80",
            brand: "Tissot",
            price: "~£650",
            kind: "Mechanical",
            why: "The integrated-bracelet icon at Swatch-group money: a Genta-era silhouette, an 80-hour movement, and the versatility to go from a café stop to a dinner without changing a thing.",
            href: "/brands/tissot",
          },
          {
            name: "Black Bay 58",
            brand: "Tudor",
            price: "~£3,200",
            kind: "Mechanical",
            why: "Tudor backs a WorldTour team for a reason. The mechanical you can actually wear hard: 200m water resistance, a slim 39mm case that vanishes under a sleeve, and nothing precious about it.",
            href: "/brands/tudor",
          },
          {
            name: "Casio F-91W",
            brand: "Casio",
            price: "~£15",
            kind: "Digital",
            why: "The beater, and a fair one. Weighs nothing, lasts years on a battery, and saves the good watch a few knocks on the turbo. No shame in it — half the peloton owns one.",
            href: "https://www.casio.com",
            external: true,
          },
        ],
      },
      {
        label: "No ceiling",
        range: "£5,000+",
        blurb: "The watch you hand down, plus the fantasy the pros actually race in.",
        picks: [
          {
            name: "Aqua Terra 150M",
            brand: "Omega",
            price: "~£5,200",
            kind: "Mechanical",
            why: "The quiet all-rounder grail: a Master Chronometer movement, 150m of water resistance, and a clean dial that swims, trains, and dresses up without a second thought. The one watch most riders should stop at.",
            href: "/brands/omega",
          },
          {
            name: "RM 67-02",
            brand: "Richard Mille",
            price: "£100,000+",
            kind: "Mechanical",
            why: "The fantasy made literal — the watch Pogačar actually races in. You will not buy one. It's here because it's the ceiling of the whole idea: a mechanical light enough to climb in.",
            href: "/brands/richard-mille",
          },
        ],
      },
    ],
    counsel:
      "If you only take one line from this page: the bike computer does the ride, so a £219 tracker is all the GPS most riders need. Spend the real money on the mechanical you wear the other 23 hours. That's the one people see, and the one you keep.",
    updated: "2026-06-21",
    image: {
      src: "/photography/pogacar-1.jpg",
      alt: "Tadej Pogačar on the bike, a Richard Mille on his wrist",
      subject: "Tadej Pogačar",
      watch: "Richard Mille RM 67-02",
      position: "center 25%",
    },
  },

  // ───────────────────────────── RUNNING ─────────────────────────────
  {
    slug: "running",
    sport: "Running",
    title: "What to Run In",
    dek: "A plastic GPS watch wins the marathon, then lives in a drawer. The watch worth choosing is the mechanical you wear the rest of your life — so train in the instrument, and buy the keeper.",
    intro:
      "A marathon is won in a plastic GPS watch that costs less than the winner's shoes, and on race morning it's the most useful object on the start line. Running is honest like that: the tracker does real, decisive work — pace, splits, the discipline that decides whether the session counts. But it's a tool, replaced every few years, and nobody hands one down. So train in the instrument and choose the watch you'll actually keep: a mechanical, worn for the life around the running, marking the work without a battery to die. That's the watch this guide is really about.",
    criteria: [
      {
        head: "The keeper comes first",
        body: "The GPS unit is easy to choose and easy to replace. The decision that lasts is the mechanical you wear off the road — so that's where to put the thought, and the money.",
      },
      {
        head: "Weight you forget",
        body: "A runner's restraint suits a slim, light case. Whether it's the tracker on a long run or the automatic on a rest day, the lightest watch that does the job is almost always the right one.",
      },
      {
        head: "The tracker, kept honest",
        body: "If you do train by the numbers, dual-band accuracy and a battery that outlasts your longest day are all you need. A pace number you can't trust is worse than no number at all — but you don't pay luxury money for it.",
      },
    ],
    tiers: [
      {
        label: "Entry",
        range: "under £600",
        blurb: "A first real automatic for after the run, and the value tracker for during it.",
        picks: [
          {
            name: "Khaki Field Mechanical",
            brand: "Hamilton",
            price: "~£525",
            kind: "Mechanical",
            why: "Hand-wound, 38mm, light enough to forget — the field watch that suits a runner's wrist and a runner's restraint. Wears the training without shouting about it, and costs less than the GPS unit you'll replace before it.",
            href: "/brands/hamilton",
          },
          {
            name: "Coros Pace 3",
            brand: "Coros",
            price: "~£219",
            kind: "GPS",
            why: "The instrument, if you train by the numbers: light, accurate, weeks of battery. There's a reason you see it on so many fast wrists that aren't being paid to wear it. Buy it, then stop looking at GPS watches.",
            href: "https://coros.com",
            external: true,
          },
          {
            name: "Casio F-91W",
            brand: "Casio",
            price: "~£15",
            kind: "Digital",
            why: "The quartz beater, and an honest one. A stopwatch, a battery that lasts years, and weight you forget. Half the marathon field warms up in something like it.",
            href: "https://www.casio.com",
            external: true,
          },
        ],
      },
      {
        label: "Mid",
        range: "£600–3,000",
        blurb: "The mechanical most runners should buy and keep — slim, tough, worn for years.",
        picks: [
          {
            name: "Tissot PRX Powermatic 80",
            brand: "Tissot",
            price: "~£650",
            kind: "Mechanical",
            why: "An 80-hour automatic on an integrated bracelet for Swatch-group money. Clean enough for the office, tough enough for the everyday, and the kind of watch that earns its keep across a training block.",
            href: "/brands/tissot",
          },
          {
            name: "Black Bay 54",
            brand: "Tudor",
            price: "~£2,750",
            kind: "Mechanical",
            why: "37mm, slim, and light on the wrist — 200m of water resistance and in-house guts in the most restrained case Tudor makes. The mechanical you can actually wear hard and still wear to dinner.",
            href: "/brands/tudor",
          },
        ],
      },
      {
        label: "When the medal's framed",
        range: "£3,000+",
        blurb: "The watch you mark a marathon with and still own at the next one.",
        picks: [
          {
            name: "Aqua Terra 150M",
            brand: "Omega",
            price: "~£5,200",
            kind: "Mechanical",
            why: "A Master Chronometer movement, a clean dial, and the versatility to swim, train near, and dress up without a thought. If a marathon is worth marking, this is a watch that holds the memory better than a finisher's tee.",
            href: "/brands/omega",
          },
          {
            name: "Explorer 36",
            brand: "Rolex",
            price: "~£6,500",
            kind: "Mechanical",
            why: "The most honest Rolex: no date fuss, no diver's heft, a tool watch with a serious record behind it. 36mm sits right on a runner's wrist, and it's built to be worn every day for a lifetime.",
            href: "/brands/rolex",
          },
        ],
      },
    ],
    counsel:
      "Don't overspend on the running watch — a £219 tracker covers pace, splits, and the night section. Spend the real money, if anywhere, on the one you wear after. The instrument is outdated in three years; the mechanical you buy to mark a marathon is the one you'll still have at the next.",
    updated: "2026-06-21",
  },
];

export function getGuide(slug: string): SportGuide | undefined {
  return buyersGuides.find((g) => g.slug === slug);
}
