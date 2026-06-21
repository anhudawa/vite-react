export const site = {
  name: "The Long Second",
  // Override per environment with NEXT_PUBLIC_SITE_URL so canonical/OG/sitemap
  // URLs match the deployed domain; falls back to the production default.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://thelongsecond.com",
  essence: "Measured release.",
  // The second that matters most — felt, never explained.
  tagline: "The second that matters most.",
  description:
    "Watches, and the athletes who live by them. Told by someone who knows exactly what a second can cost — who wears what, whether they bought it or are paid to, and what it costs.",
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
} as const;

export type NavItem = { label: string; href: string; note?: string };

/** Content silos, per the build brief architecture. */
export const nav: NavItem[] = [
  { label: "Who Wears What", href: "/who-wears-what", note: "The reference" },
  { label: "Watches in Sport", href: "/watches-in-sport", note: "On the wrist, in the race" },
  { label: "Buying Guides", href: "/buying-guides", note: "Considered, not transactional" },
  { label: "Essays", href: "/essays", note: "Athletes and time" },
];

export const secondaryNav: NavItem[] = [
  { label: "By Brand", href: "/brands" },
  { label: "About", href: "/about" },
  { label: "Colophon", href: "/colophon" },
  { label: "Privacy", href: "/privacy" },
];
