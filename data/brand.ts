/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  BRAND FACTS — the ONE file to fill in.
 *
 *  Everything brand-identity flows from here: lib/site.ts, the JSON-LD
 *  Person/Organization schema (lib/jsonld.tsx), the machine-readable
 *  facts.json (lib/kg.ts brandFacts), and the About / author pages.
 *
 *  TODO — Anthony: paste real values over the `null`s below and the whole
 *  site lights up (schema, feeds, pages). While a field is `null` it is
 *  emitted NOWHERE — no placeholder, no "TBC", nothing — so the site ships
 *  exactly what it does today until the real fact exists.
 *
 *    foundedYear   — e.g. "2025" (year the publication was founded)
 *    baseLocation  — e.g. "Girona, Spain" (where the publication is based)
 *    contactEmail  — public contact address, e.g. "hello@thelongsecond.com"
 *    sameAs.*      — full profile URLs, e.g. "https://x.com/thelongsecond"
 *
 *  Do NOT put guesses here: these are machine-readable facts an LLM will
 *  quote verbatim.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export const brand = {
  /* ── KNOWN — canonical, verified values (moved verbatim from lib/site.ts) ── */
  name: "The Long Second",
  // Override per environment with NEXT_PUBLIC_SITE_URL so canonical/OG/sitemap
  // URLs match the deployed domain; falls back to the production default.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://thelongsecond.com",
  essence: "Measured release.",
  // The second that matters most — felt, never explained.
  tagline: "The second that matters most.",
  description:
    "Watches and the endurance athletes who live by them. The mechanical pieces worn for the life around the sport — the craft, the heritage, who wears what — told by someone who knows exactly what a second can cost.",
  founder: "Anthony Walsh",
  // The named author who signs the work. The masthead leads; the byline authenticates.
  author: {
    name: "Anthony Walsh",
    role: "Founder",
    bio: "A masters racer who buried years into the bike, then fell as hard for the watch as he ever did for the race. He writes the thing he couldn't find: watch coverage from someone who knows what a second costs.",
    portrait: "/brand/founder-bone.png",
    sameAs: [
      "https://roadmancycling.com",
      "https://www.instagram.com/roadmancycling",
    ],
    credentials: [
      { label: "Discipline", value: "Road · endurance" },
      { label: "Racing", value: "Masters category · 20+ years" },
      { label: "Field", value: "Horology — independent study" },
      { label: "Standard", value: "Every reference, cited" },
    ],
  },

  /* ── TODO — founder fills these (see the block comment above). null = not
        yet known = never emitted anywhere. ── */
  foundedYear: null as string | null,
  baseLocation: null as string | null,
  contactEmail: null as string | null,
  sameAs: {
    twitter: null as string | null,
    instagram: null as string | null,
    linkedin: null as string | null,
    strava: null as string | null,
    youtube: null as string | null,
  },
} as const;

/** The brand-level sameAs URLs actually filled in, in declaration order —
 *  consumers get real URLs only, never null. */
export function brandSameAs(): string[] {
  return Object.values(brand.sameAs).filter((v): v is string => v !== null);
}
