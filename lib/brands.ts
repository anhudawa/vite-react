import { publishedAthletes, renderableFacts } from "@/data/athletes";
import { watches } from "@/data/watches";
import { essays } from "@/content/essays/registry";
import { BRANDS } from "@/lib/verification";
import { acquisitionOf, type Stance } from "@/lib/economics";
import { essayHref } from "@/lib/content";

/**
 * THE BROWSE GRAPH — derived, never hand-maintained.
 *
 * Every published reference already names a maker in its `watch` string. We group
 * by maker so a reader can arrive from the brand as well as the athlete: a third
 * way into the same verified fact, and the money story told per brand.
 *
 * The brand layer draws from three collections at once: the athlete ledger
 * (wearers, published facts only), the watch entity library (data/watches.ts),
 * and the essays' `watchesMentioned` (coverage). A brand earns a hub if it
 * appears in any of them.
 */

export interface BrandWearer {
  athlete: string;
  slug: string;
  watch: string;
  stance: Stance;
  stanceLabel: string;
  value?: number;
}

/** A watch entity belonging to the brand — links to /watch/<slug>. */
export interface BrandWatchRef {
  model: string;
  /** entity slug, e.g. "breitling/endurance-pro" */
  slug: string;
  oneLiner: string;
}

/** A piece of coverage that mentions one of the brand's watches. */
export interface BrandEssayRef {
  slug: string;
  title: string;
  href: string;
}

export interface BrandEntry {
  brand: string;
  slug: string;
  wearers: BrandWearer[];
  watches: BrandWatchRef[];
  essays: BrandEssayRef[];
  totalGBP: number;
  paid: number;
  bought: number;
}

function brandSlug(brand: string): string {
  return brand.toLowerCase().replace(/\s+/g, "-");
}

/** Makers known to the entity library — Breitling, Bravur, … */
const entityBrands = [...new Set(watches.map((w) => w.brand))];

/** Find the maker named in a watch string — registry first, then the entity library. */
export function brandOfWatch(watch: string): string | undefined {
  return makerOf(watch);
}

function makerOf(watch: string): string | undefined {
  const w = watch.toLowerCase();
  return (
    BRANDS.find(
      (b) =>
        w.includes(b.brand.toLowerCase()) ||
        b.aliases?.some((a) => w.includes(a.toLowerCase()))
    )?.brand ?? entityBrands.find((b) => w.includes(b.toLowerCase()))
  );
}

export function deriveBrands(): BrandEntry[] {
  const map = new Map<string, BrandEntry>();

  const entryFor = (brand: string): BrandEntry =>
    map.get(brand) ??
    map
      .set(brand, {
        brand,
        slug: brandSlug(brand),
        wearers: [],
        watches: [],
        essays: [],
        totalGBP: 0,
        paid: 0,
        bought: 0,
      })
      .get(brand)!;

  // 1. The ledger — published wearers, and the money story.
  for (const athlete of publishedAthletes()) {
    const fact = renderableFacts(athlete)[0];
    if (!fact) continue;
    const brand = makerOf(fact.watch);
    if (!brand) continue;

    const acq = acquisitionOf(fact.relation);
    const entry = entryFor(brand);

    entry.wearers.push({
      athlete: athlete.name,
      slug: athlete.slug,
      watch: fact.watch,
      stance: acq.stance,
      stanceLabel: acq.label,
      value: fact.value?.gbpApprox,
    });
    entry.totalGBP += fact.value?.gbpApprox ?? 0;
    if (acq.stance === "paid") entry.paid += 1;
    else if (acq.stance === "own-money") entry.bought += 1;
  }

  // 2. The entity library — every watch page belongs to its maker's hub.
  for (const w of watches) {
    entryFor(w.brand).watches.push({
      model: w.model,
      slug: w.slug,
      oneLiner: w.oneLiner,
    });
  }

  // 3. The coverage — essays join a hub through their `watchesMentioned`.
  for (const e of essays) {
    for (const mentioned of e.watchesMentioned ?? []) {
      const brand = makerOf(mentioned);
      if (!brand) continue;
      const entry = entryFor(brand);
      if (entry.essays.some((x) => x.slug === e.slug)) continue;
      entry.essays.push({ slug: e.slug, title: e.title, href: essayHref(e) });
    }
  }

  // Dearest-first within a brand, and brands ranked by total on the wrist;
  // ledger-less brands (coverage only, so far) sit below, alphabetically.
  for (const e of map.values()) {
    e.wearers.sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
  }
  return [...map.values()].sort(
    (a, b) => b.totalGBP - a.totalGBP || a.brand.localeCompare(b.brand)
  );
}

export function getBrand(slug: string): BrandEntry | undefined {
  return deriveBrands().find((b) => b.slug === slug);
}
