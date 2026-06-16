export const site = {
  name: "Escapement",
  // Override per environment with NEXT_PUBLIC_SITE_URL so canonical/OG/sitemap
  // URLs match the deployed domain; falls back to the production default.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://escapement.cc",
  essence: "Measured release.",
  // Holds both meanings — time and effort — without explaining the name.
  tagline: "Time, told from the inside.",
  description:
    "The insider's brand for the place where serious athletes and fine watches meet. Sourced, literate coverage of who wears what — and why it's there.",
  founder: "Anthony Walsh",
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
  { label: "About", href: "/about" },
  { label: "Verification", href: "/verification" },
  { label: "Colophon", href: "/colophon" },
];
