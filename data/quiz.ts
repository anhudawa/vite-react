// "Find Your Watch" — the quiz engine, as editable config.
//
// ┌─ FOUNDER REVIEW REQUIRED ────────────────────────────────────────────────┐
// │ Every recommendation below is a real watch at an approximate EUR price.   │
// │ Confirm models, current prices and proportions, then fill `affiliateUrl`  │
// │ for each before launch. Prices are hedged ("~€280") on purpose — they     │
// │ drift. Nothing here invents a spec; where unsure, it stays general.       │
// │                                                                           │
// │ CENTRE OF GRAVITY: mechanical. The catalog leads with real manual/auto    │
// │ references (field/dive/GMT bias for an endurance athlete). GPS is a single │
// │ honest thread — one pick (GPS_PICK) that does the session and points back  │
// │ to the keeper; it never leads or dominates a result. No quartz lives here  │
// │ because the Recommendation.movement type is only "mechanical" | "gps" and  │
// │ the card badge would mislabel a quartz piece; the quartz nod lives in the  │
// │ buyers-guides instead (which has a proper "Digital" kind).                 │
// └──────────────────────────────────────────────────────────────────────────┘

export type Answers = Record<string, string>;

export type QuizOption = { value: string; label: string; hint?: string };
export type QuizQuestion = {
  id: string;
  prompt: string;
  help?: string;
  options: QuizOption[];
};

export type Recommendation = {
  name: string;
  brand: string;
  priceEUR: string; // hedged display, e.g. "~€280"
  movement: "mechanical" | "gps";
  reason: string;
  styleFit?: string[]; // nudges ordering by the reader's style answer
  affiliateUrl: string; // FOUNDER: fill before launch
};

// On-site reading wired to each outcome. Hrefs are mode routes: pieces with
// `mode: "guide"` live under /guides/<slug>, `mode: "feature"` under
// /features/<slug> (see lib/content.ts `essayHref`). Keep labels matching the
// piece's published title.
export type ReadingLink = { href: string; label: string };

export type Profile = {
  id: string;
  name: string;
  tagline: string;
  blurb: string;
  /** 2–3 best-fit essays/guides for this outcome, rendered on the result. */
  reading: ReadingLink[];
};

export type QuizResult = {
  profile: Profile;
  recommendations: Recommendation[];
};

// ─────────────────────────────── questions ───────────────────────────────
export const questions: QuizQuestion[] = [
  {
    id: "sport",
    prompt: "What do you do most?",
    help: "The sport the watch has to keep up with.",
    options: [
      { value: "road-cycling", label: "Road cycling" },
      { value: "gravel", label: "Gravel / off-road" },
      { value: "running", label: "Running" },
      { value: "triathlon", label: "Triathlon / swim" },
      { value: "swim-row", label: "Swimming / rowing" },
      { value: "climbing", label: "Climbing / outdoors" },
    ],
  },
  {
    id: "purpose",
    prompt: "What's the watch mostly for?",
    options: [
      { value: "train", label: "Training in it", hint: "Data, every session." },
      { value: "wear", label: "Wearing it off the bike", hint: "The watch you live in." },
      { value: "both", label: "Honestly, both", hint: "One wrist, two jobs." },
    ],
  },
  {
    id: "conditions",
    prompt: "What does it have to survive?",
    options: [
      { value: "sweat-rain", label: "Sweat and rain" },
      { value: "open-water", label: "Open water" },
      { value: "crashes", label: "The occasional crash" },
      { value: "desk-dinner", label: "Desk to dinner" },
    ],
  },
  {
    id: "wrist",
    prompt: "Your wrist?",
    help: "So the case actually fits.",
    options: [
      { value: "slim", label: "Slim", hint: "Under ~16cm" },
      { value: "medium", label: "Medium", hint: "~16–18cm" },
      { value: "large", label: "Large", hint: "Over ~18cm" },
    ],
  },
  {
    id: "budget",
    prompt: "What are you spending?",
    options: [
      { value: "under-500", label: "Under €500" },
      { value: "500-1500", label: "€500 – 1,500" },
      { value: "1500-5000", label: "€1,500 – 5,000" },
      { value: "no-ceiling", label: "No ceiling" },
    ],
  },
  {
    id: "movement",
    prompt: "Mechanical, or measured?",
    help: "There's no wrong answer — only an honest one.",
    options: [
      { value: "mechanical", label: "A mechanical watch I love", hint: "Made, not computed." },
      { value: "gps", label: "A GPS watch that tracks me", hint: "The instrument." },
      { value: "both", label: "Honestly, both", hint: "A trainer and a keeper." },
    ],
  },
  {
    id: "style",
    prompt: "Which wrist is more you?",
    options: [
      { value: "tool", label: "Tool", hint: "Divers, field watches." },
      { value: "dress", label: "Dress", hint: "Clean, quiet, sharp." },
      { value: "sporty-modern", label: "Sporty-modern", hint: "Integrated, technical." },
      { value: "vintage", label: "Vintage-leaning", hint: "Warm, heritage." },
    ],
  },
];

// ─────────────────────────────── profiles ───────────────────────────────
const PROFILES: Record<string, Profile> = {
  gps: {
    id: "by-the-numbers",
    name: "The Watch You Keep",
    tagline: "Wear the GPS for the session. Own something that outlasts it.",
    blurb:
      "If you genuinely train by the numbers, a GPS watch is the honest tool for the session — strap it on, get the data, take it off. But it's outdated in three years, and nobody hands one down. The watch worth choosing is the mechanical you wear for the life around the sport. Here's that one.",
    reading: [
      { href: "/guides/gps-watch-vs-mechanical", label: "GPS Watch vs Mechanical: What to Actually Wear" },
      { href: "/guides/your-first-automatic-what-matters", label: "Your First Automatic: What Matters" },
      { href: "/guides/sizing-a-watch-for-a-lean-wrist", label: "Sizing a Watch for a Lean Wrist" },
    ],
  },
  both: {
    id: "two-watch",
    name: "The Two-Watch Athlete",
    tagline: "One to train in, one to live in.",
    blurb:
      "The honest answer for most serious athletes. A GPS watch does the work on the session; a mechanical marks the rest of your life. The instrument is easy to choose and easy to replace. The keeper is the decision that lasts, so most of this is about that.",
    reading: [
      { href: "/guides/gps-watch-vs-mechanical", label: "GPS Watch vs Mechanical: What to Actually Wear" },
      { href: "/guides/automatics-on-the-bike", label: "Automatics on the Bike" },
      { href: "/features/the-one-watch-question", label: "The One-Watch Question" },
    ],
  },
  "mech-under-500": {
    id: "first-mechanical",
    name: "The First Mechanical",
    tagline: "The honest way into watches that outlive their batteries.",
    blurb:
      "You don't need to spend big to own something real. At this budget the right automatic is tough, wearable, and the start of a habit — the watch that turns a tracker-only wrist into a collector's.",
    reading: [
      { href: "/guides/your-first-automatic-what-matters", label: "Your First Automatic: What Matters" },
      { href: "/guides/first-nice-watch-as-an-athlete", label: "How to Buy Your First Nice Watch as an Athlete" },
      { href: "/guides/sizing-a-watch-for-a-lean-wrist", label: "Sizing a Watch for a Lean Wrist" },
    ],
  },
  "mech-500-1500": {
    id: "sport-mechanical",
    name: "The Sport Mechanical",
    tagline: "One watch, worn hard, for years.",
    blurb:
      "The sweet spot. Real movements, proper water resistance, and finishing that punches above the price — watches you can train near, travel with, and not baby.",
    reading: [
      { href: "/guides/straps-for-sport", label: "Straps for Sport: NATO, Rubber, Velcro" },
      { href: "/guides/water-resistance-for-swimmers", label: "Water Resistance, Explained for Swimmers" },
      { href: "/guides/lume-and-the-dark", label: "Lume and the Dark" },
    ],
  },
  "mech-1500-5000": {
    id: "one-watch",
    name: "The One-Watch All-Rounder",
    tagline: "Swim, dress, hand it down — one watch that does all of it.",
    blurb:
      "Enough budget for the watch most people should stop at: in-house movements, serious build, and the versatility to be the only watch you own without ever feeling like a compromise.",
    reading: [
      { href: "/features/the-one-watch-question", label: "The One-Watch Question" },
      { href: "/guides/how-to-read-a-reference", label: "How to Read a Reference" },
      { href: "/guides/when-to-service-a-mechanical-watch", label: "When to Service a Mechanical Watch" },
    ],
  },
  "mech-no-ceiling": {
    id: "grail",
    name: "The Grail Hunter",
    tagline: "No ceiling. Buy the reference everything else is measured against.",
    blurb:
      "At this level you're buying history and the smoothest engineering in watchmaking. Pieces you can swim in, dress up, and hand down — the ones the rest of the catalogue spends its life chasing.",
    reading: [
      { href: "/guides/what-a-chronometer-actually-is", label: "What a Chronometer Actually Is" },
      { href: "/guides/how-to-read-a-reference", label: "How to Read a Reference" },
      { href: "/features/the-handover", label: "The Handover" },
    ],
  },
};

// ─────────────────────────── recommendation catalog ───────────────────────────
// The GPS thread is deliberately one watch, not a tier ladder. If you train by
// the numbers, almost any current Coros or Garmin will do the job honestly; the
// real decision is the mechanical you wear the rest of the time, so that's where
// the catalog has depth. This single pick exists to be the honest training tool
// and then get out of the way.
const GPS_PICK: Recommendation = {
  name: "Pace 3",
  brand: "Coros",
  priceEUR: "~€249",
  movement: "gps",
  reason:
    "If you train by the numbers, this is the honest tool: ~38g, dual-band GPS, a battery measured in weeks. Wear it for the session, then take it off — the watch you keep is below.",
  affiliateUrl: "",
};

const MECH: Record<string, Recommendation[]> = {
  "under-500": [
    { name: "5 Sport", brand: "Seiko", priceEUR: "~€280", movement: "mechanical", reason: "The default honest automatic: 100m, tough, endlessly wearable — the one that starts the habit.", styleFit: ["tool", "sporty-modern", "vintage"], affiliateUrl: "" },
    { name: "Kamasu", brand: "Orient", priceEUR: "~€250", movement: "mechanical", reason: "A 200m automatic diver for the price of a nice dinner. Punches absurdly above its money.", styleFit: ["tool"], affiliateUrl: "" },
    { name: "Presage Cocktail", brand: "Seiko", priceEUR: "~€420", movement: "mechanical", reason: "If you want it dressier — a sunburst dial that reads like triple the price.", styleFit: ["dress", "vintage"], affiliateUrl: "" },
  ],
  "500-1500": [
    { name: "PRX Powermatic 80", brand: "Tissot", priceEUR: "~€700", movement: "mechanical", reason: "A Genta-era integrated-bracelet silhouette and an 80-hour movement for Swatch-group money.", styleFit: ["sporty-modern", "dress"], affiliateUrl: "" },
    { name: "Khaki Field Mechanical", brand: "Hamilton", priceEUR: "~€575", movement: "mechanical", reason: "The platonic field watch: hand-wound, legible, light, real military lineage.", styleFit: ["tool", "vintage"], affiliateUrl: "" },
    { name: "Prospex Diver (SPB143)", brand: "Seiko", priceEUR: "~€1,100", movement: "mechanical", reason: "The enthusiast's darling: 200m, a refined movement, proportions Seiko finally nailed.", styleFit: ["tool", "sporty-modern"], affiliateUrl: "" },
    { name: "C60 Trident", brand: "Christopher Ward", priceEUR: "~€900", movement: "mechanical", reason: "Direct-to-consumer value: specs and finishing that shouldn't be possible at the price.", styleFit: ["tool", "sporty-modern"], affiliateUrl: "" },
  ],
  "1500-5000": [
    { name: "Black Bay 58", brand: "Tudor", priceEUR: "~€3,600", movement: "mechanical", reason: "The one-watch answer for most people: 200m, slim, in-house, Rolex DNA at a third of the cost.", styleFit: ["tool", "vintage"], affiliateUrl: "" },
    { name: "Pelagos FXD", brand: "Tudor", priceEUR: "~€4,100", movement: "mechanical", reason: "Titanium, fixed lugs, built with the French navy — the tool watch for someone hard on gear.", styleFit: ["tool", "sporty-modern"], affiliateUrl: "" },
    { name: "Black Bay GMT", brand: "Tudor", priceEUR: "~€4,200", movement: "mechanical", reason: "A second time zone for the athlete who races abroad — in-house GMT, real travel utility, none of the wait of a crown-stamped one.", styleFit: ["tool", "sporty-modern", "vintage"], affiliateUrl: "" },
    { name: "Divers Sixty-Five", brand: "Oris", priceEUR: "~€2,200", movement: "mechanical", reason: "Independent and full of character — the enthusiast's quiet, well-made flex.", styleFit: ["vintage", "tool"], affiliateUrl: "" },
    { name: "Spirit", brand: "Longines", priceEUR: "~€2,400", movement: "mechanical", reason: "Heritage and a silicon-balance movement at a price the big crowns can't touch.", styleFit: ["dress", "vintage"], affiliateUrl: "" },
  ],
  "no-ceiling": [
    { name: "Seamaster Diver 300M", brand: "Omega", priceEUR: "~€6,500", movement: "mechanical", reason: "The all-rounder grail: a Master Chronometer movement, real history, swim-to-black-tie versatility.", styleFit: ["sporty-modern", "tool"], affiliateUrl: "" },
    { name: "Aqua Terra 150M", brand: "Omega", priceEUR: "~€6,000", movement: "mechanical", reason: "The quieter Omega: a clean 150m all-rounder you can swim, train near, and wear to dinner without a second thought.", styleFit: ["dress", "sporty-modern"], affiliateUrl: "" },
    { name: "Explorer 36", brand: "Rolex", priceEUR: "~€7,500", movement: "mechanical", reason: "The mountaineer's Rolex and the most honest one — no date fuss, no diver's heft, just a tool watch with a serious record behind it.", styleFit: ["tool", "vintage"], affiliateUrl: "" },
    { name: "Submariner", brand: "Rolex", priceEUR: "~€10,000", movement: "mechanical", reason: "The reference the whole category is measured against. Every other diver is, in some way, an answer to it.", styleFit: ["tool", "sporty-modern"], affiliateUrl: "" },
    { name: "Evolution 9 Spring Drive", brand: "Grand Seiko", priceEUR: "~€6,500", movement: "mechanical", reason: "The smoothest seconds hand in watchmaking, and finishing that humbles watches twice the price.", styleFit: ["dress", "sporty-modern"], affiliateUrl: "" },
  ],
};

// ─────────────────────────────── resolver ───────────────────────────────
function orderByStyle(recs: Recommendation[], style?: string): Recommendation[] {
  if (!style) return recs;
  return [...recs].sort((a, b) => {
    const aFit = a.styleFit?.includes(style) ? 1 : 0;
    const bFit = b.styleFit?.includes(style) ? 1 : 0;
    return bFit - aFit;
  });
}

export function resolveResult(answers: Answers): QuizResult {
  const { movement = "mechanical", budget = "500-1500", style } = answers;
  const mech = orderByStyle(MECH[budget] ?? MECH["500-1500"], style);

  // "I train by the numbers" — answer it honestly with the one tool, then point
  // straight back at the keeper. The GPS is a single thread, never the spine.
  if (movement === "gps") {
    return {
      profile: PROFILES.gps,
      recommendations: [GPS_PICK, ...mech.slice(0, 2)],
    };
  }

  // "Honestly, both" — the tool plus the watch that lasts. Mechanical leads the
  // weight of the list even here.
  if (movement === "both") {
    return {
      profile: PROFILES.both,
      recommendations: [GPS_PICK, ...mech.slice(0, 2)],
    };
  }

  // mechanical — the default centre of gravity.
  const profile = PROFILES[`mech-${budget}`] ?? PROFILES["mech-500-1500"];
  return { profile, recommendations: mech.slice(0, 3) };
}
