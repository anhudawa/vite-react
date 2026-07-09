import { brand } from "@/data/brand";

// Canonical brand facts live in data/brand.ts — the ONE file the founder
// fills. `site` derives from it so its public API stays exactly as before.
export const site = {
  name: brand.name,
  url: brand.url,
  essence: brand.essence,
  tagline: brand.tagline,
  description: brand.description,
  founder: brand.founder,
  author: brand.author,
} as const;

export { brand, brandSameAs } from "@/data/brand";

export type NavItem = { label: string; href: string; note?: string };

/** Content silos, per the build brief architecture. */
export const nav: NavItem[] = [
  { label: "Who Wears What", href: "/who-wears-what", note: "The reference" },
  { label: "Watches in Sport", href: "/watches-in-sport", note: "On the wrist, in the race" },
  { label: "Buying Guides", href: "/buying-guides", note: "What's worth owning" },
  { label: "Essays", href: "/essays", note: "Athletes and time" },
];

export const secondaryNav: NavItem[] = [
  { label: "Topics", href: "/topics" },
  { label: "Timeline", href: "/timeline" },
  { label: "Collections", href: "/collections" },
  { label: "Glossary", href: "/glossary" },
  { label: "By Brand", href: "/brands" },
  { label: "About", href: "/about" },
  { label: "Standards", href: "/editorial-standards" },
  { label: "Colophon", href: "/colophon" },
  { label: "Privacy", href: "/privacy" },
];
