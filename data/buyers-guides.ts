// Sport + budget buyers guides. The brief: a cyclist, runner or gym-goer lands
// here wanting to know what to actually buy for their sport, and leaves educated
// — with a curated, honest shortlist, real prices, reasons, and links.
//
// Prices are approximate RRP in GBP and deliberately hedged ("~£219") because
// they drift; the reasoning is the durable part. Picks are real, well-known
// products. Fine-watch brands link to their on-site brand page; tool/GPS brands
// link out to the maker.

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
      "Here is the thing no cycling watch guide admits: on the bike, your computer does the real work. Power, route, segments — that's the head unit's job, and it does it better than anything on your wrist. So the watch is for everything else: the run you cross-train on, the gym session, the commute, and the rare ride where you genuinely want it on. Buy it for that, and the decision gets simple.",
    criteria: [
      {
        head: "It lives off the bike",
        body: "Don't pay for cycling features a £200 head unit already does better. Pay for the watch you'll wear walking around, training off the bike, and sleeping in.",
      },
      {
        head: "Light, and out of the way",
        body: "A heavy slab catches on bar tape and drives you mad on long days. Low weight and a slim case beat one more sensor every time.",
      },
      {
        head: "Battery you forget about",
        body: "The best training watch is the one you never think to charge. Weeks, not days — so it's always ready when you are.",
      },
    ],
    tiers: [
      {
        label: "Entry",
        range: "under £300",
        blurb: "Everything a serious amateur actually needs, and nothing they don't.",
        picks: [
          {
            name: "Coros Pace 3",
            brand: "Coros",
            price: "~£219",
            kind: "GPS",
            why: "The smartest £219 in sport. Thirty-odd grams, dual-band GPS, and a battery measured in weeks. Beat this watch before you spend more — most people can't.",
            href: "https://coros.com",
            external: true,
          },
          {
            name: "Forerunner 165",
            brand: "Garmin",
            price: "~£249",
            kind: "GPS",
            why: "Garmin's ecosystem at its lowest honest price: a bright AMOLED screen, the training metrics that matter, and none of the ones you'd never read.",
            href: "https://www.garmin.com",
            external: true,
          },
        ],
      },
      {
        label: "Mid",
        range: "£300–1,500",
        blurb: "One rugged tool watch that covers the ride, the run, and everything between.",
        picks: [
          {
            name: "Fenix 7",
            brand: "Garmin",
            price: "~£600",
            kind: "GPS",
            why: "Full on-wrist mapping, multi-band GPS, and a case built to be hit. The do-everything watch for someone who trains in more than one sport.",
            href: "https://www.garmin.com",
            external: true,
          },
          {
            name: "Vertix 2S",
            brand: "Coros",
            price: "~£600",
            kind: "GPS",
            why: "Battery for the truly long stuff — multi-day audax, big alpine weeks — with maps that load fast and a titanium bezel that shrugs off knocks.",
            href: "https://coros.com",
            external: true,
          },
        ],
      },
      {
        label: "The watch off the bike",
        range: "£1,500+",
        blurb: "A mechanical you can train, ride, and live in — for when the data watch comes off.",
        picks: [
          {
            name: "Black Bay 58",
            brand: "Tudor",
            price: "~£3,200",
            kind: "Mechanical",
            why: "Tudor backs a WorldTour team for a reason. This is the mechanical you can actually wear hard: 200m water resistance, a slim 39mm case that vanishes under a sleeve, and nothing precious about it.",
            href: "/brands/tudor",
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
      "If you only take one line from this page: a £219 Coros does 95% of what a £600 watch does, and the bike computer does the rest. Spend the difference on the watch you wear when you're not riding — that's the one people actually see.",
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
    dek: "Running is the one sport where the watch does everything and nobody photographs it. So buy the best instrument, not the best-looking one — then buy something nice for after.",
    intro:
      "A marathon is won in a plastic GPS watch that costs less than the winner's shoes, and it is the most useful object in the race. Running is honest like that: the watch on your wrist is doing real, decisive work — pace, splits, the discipline that decides whether the session counts. Buy the instrument first. The watch you actually love can come later, and live the rest of your life.",
    criteria: [
      {
        head: "Weight you forget",
        body: "Every gram is felt over 20 miles. The lightest watch that does the job is almost always the right one.",
      },
      {
        head: "GPS that doesn't lie",
        body: "Dual-band accuracy and a battery that outlasts your longest day. A pace number you can't trust is worse than no number at all.",
      },
      {
        head: "The three metrics that matter",
        body: "Pace, heart rate, and honest distance change how you train. The other forty screens are noise you'll stop opening by week two.",
      },
    ],
    tiers: [
      {
        label: "Entry",
        range: "under £300",
        blurb: "The value picks the people at the front of your local race are actually wearing.",
        picks: [
          {
            name: "Coros Pace 3",
            brand: "Coros",
            price: "~£219",
            kind: "GPS",
            why: "Light, accurate, and weeks of battery — the marathoner's value pick. There's a reason you see it on so many fast wrists that aren't being paid to wear it.",
            href: "https://coros.com",
            external: true,
          },
          {
            name: "Forerunner 165",
            brand: "Garmin",
            price: "~£249",
            kind: "GPS",
            why: "The cleanest way into Garmin's training tools, with a screen bright enough to read in full sun mid-stride. The right first proper running watch.",
            href: "https://www.garmin.com",
            external: true,
          },
        ],
      },
      {
        label: "Mid",
        range: "£300–800",
        blurb: "The do-everything runner's watch most people should buy and stop.",
        picks: [
          {
            name: "Forerunner 965",
            brand: "Garmin",
            price: "~£600",
            kind: "GPS",
            why: "AMOLED, full maps, multi-band GPS, and the deepest training analysis that's still actually readable. For most runners this is the last watch they need.",
            href: "https://www.garmin.com",
            external: true,
          },
          {
            name: "Race",
            brand: "Suunto",
            price: "~£399",
            kind: "GPS",
            why: "A gorgeous AMOLED display and offline maps for less than the Garmin, if you want the instrument without the ecosystem lock-in.",
            href: "https://www.suunto.com",
            external: true,
          },
        ],
      },
      {
        label: "When the medal's framed",
        range: "£800+",
        blurb: "A light mechanical for the rest of life, once the GPS watch has done its job.",
        picks: [
          {
            name: "Black Bay 54",
            brand: "Tudor",
            price: "~£2,750",
            kind: "Mechanical",
            why: "37mm, slim, and light enough to forget — the mechanical that suits a runner's wrist and a runner's restraint. Wears the achievement without shouting it.",
            href: "/brands/tudor",
          },
          {
            name: "Enduro 3",
            brand: "Garmin",
            price: "~£700",
            kind: "GPS",
            why: "If you'd rather go the other way: solar charging and a battery measured in weeks, built for people whose long run is measured in days.",
            href: "https://www.garmin.com",
            external: true,
          },
        ],
      },
    ],
    counsel:
      "Don't overspend on the running watch — overspend, if anywhere, on the one you wear after. The instrument is a tool that's outdated in three years; the mechanical you buy to mark a marathon is the one you'll still have at the next.",
    updated: "2026-06-21",
  },

  // ─────────────────────────── GYM / STRENGTH ───────────────────────────
  {
    slug: "gym",
    sport: "Gym & Strength",
    title: "What to Lift In",
    dek: "The gym is the one place the cheap tough watch beats the expensive one every time. Knurling, sweat and dropped plates don't care what you paid.",
    intro:
      "Here's the honest counsel most guides won't give you: the gym is where the grail stays in the box. Wrist heart rate is poor under heavy load, a barbell will happily mark a polished case, and sweat gets everywhere. The watch that wins here is cheap, tough, slim, and replaceable — and there's a real freedom in wearing something you genuinely do not care about while you train.",
    criteria: [
      {
        head: "Survival over data",
        body: "It will get knocked against bars, dropped on plates, and soaked in sweat. Toughness is the spec that matters; everything else is a bonus.",
      },
      {
        head: "Slim enough to clear a bar",
        body: "A thick case catches on knurling and digs into your wrist on a clean. Low profile isn't style here, it's function.",
      },
      {
        head: "Be honest about heart rate",
        body: "Wrist HR is unreliable under a heavy grip — many lifters just take the watch off for the big sets. Don't pay a premium for a number the gym defeats.",
      },
    ],
    tiers: [
      {
        label: "Entry",
        range: "under £150",
        blurb: "The honest answer to this entire page.",
        picks: [
          {
            name: "G-Shock DW-5600",
            brand: "Casio",
            price: "~£90",
            kind: "Digital",
            why: "Bombproof, slim, around 50g, and utterly unbothered by anything you drop on it. The default for a reason — most lifters never need more.",
            href: "https://www.casio.com",
            external: true,
          },
          {
            name: "F-91W",
            brand: "Casio",
            price: "~£15",
            kind: "Digital",
            why: "The £15 watch that has outlived a thousand grails in a thousand gym bags. If you want zero anxiety on the wrist, it's hard to argue with.",
            href: "https://www.casio.com",
            external: true,
          },
        ],
      },
      {
        label: "Mid",
        range: "£150–500",
        blurb: "If you want the data despite the warning above, this is how to get it.",
        picks: [
          {
            name: "Apple Watch SE",
            brand: "Apple",
            price: "~£259",
            kind: "Smart",
            why: "The best all-round tracking if you want it, and you can pull it off in a second for the heavy sets. Honest about being a tool, not a treasure.",
            href: "https://www.apple.com",
            external: true,
          },
          {
            name: "Instinct 2",
            brand: "Garmin",
            price: "~£300",
            kind: "GPS",
            why: "Rugged to a military spec, weeks of battery, and far fewer ways to break than a touchscreen. The tracker for people who are rough on gear.",
            href: "https://www.garmin.com",
            external: true,
          },
        ],
      },
      {
        label: "Premium",
        range: "£500+",
        blurb: "The only 'nice' watches that genuinely belong under a barbell.",
        picks: [
          {
            name: "MR-G Titanium",
            brand: "Casio",
            price: "~£2,500",
            kind: "Digital",
            why: "A G-Shock grown up: titanium, beautifully finished, and still fundamentally indestructible. The one way to spend real money here without regret.",
            href: "https://www.casio.com",
            external: true,
          },
          {
            name: "Black Bay 58",
            brand: "Tudor",
            price: "~£3,200",
            kind: "Mechanical",
            why: "If you insist on a mechanical, a steel sports Tudor takes more abuse than people fear — but read the counsel below before you wear it to deadlift.",
            href: "/brands/tudor",
          },
        ],
      },
    ],
    counsel:
      "The grail stays in the box. A steel sports Rolex or Tudor can survive the gym, but it's the one room where the expensive watch has nothing to prove and everything to lose. Wear the cheap tough one, lift in peace, and save the nice piece for the wrist people actually see.",
    updated: "2026-06-21",
    image: {
      src: "/photography/topuria-rm.jpg",
      alt: "A combat athlete with a Richard Mille",
      subject: "Strength & combat",
      watch: "Richard Mille",
      position: "center 30%",
    },
  },
];

export function getGuide(slug: string): SportGuide | undefined {
  return buyersGuides.find((g) => g.slug === slug);
}
