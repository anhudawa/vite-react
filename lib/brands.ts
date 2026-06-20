import { publishedAthletes, renderableFacts } from "@/data/athletes";
import { BRANDS } from "@/lib/verification";
import { acquisitionOf, type Stance } from "@/lib/economics";

/**
 * THE BROWSE GRAPH — derived, never hand-maintained.
 *
 * Every published reference already names a maker in its `watch` string. We group
 * by maker so a reader can arrive from the brand as well as the athlete: a third
 * way into the same verified fact, and the money story told per brand.
 */

export interface BrandWearer {
  athlete: string;
  slug: string;
  watch: string;
  stance: Stance;
  stanceLabel: string;
  value?: number;
}

export interface BrandEntry {
  brand: string;
  slug: string;
  wearers: BrandWearer[];
  totalGBP: number;
  paid: number;
  bought: number;
}

function brandSlug(brand: string): string {
  return brand.toLowerCase().replace(/\s+/g, "-");
}

/** Find the registry maker named in a watch string, if any. */
export function brandOfWatch(watch: string): string | undefined {
  return makerOf(watch);
}

function makerOf(watch: string): string | undefined {
  const w = watch.toLowerCase();
  return BRANDS.find(
    (b) =>
      w.includes(b.brand.toLowerCase()) ||
      b.aliases?.some((a) => w.includes(a.toLowerCase()))
  )?.brand;
}

export function deriveBrands(): BrandEntry[] {
  const map = new Map<string, BrandEntry>();

  for (const athlete of publishedAthletes()) {
    const fact = renderableFacts(athlete)[0];
    if (!fact) continue;
    const brand = makerOf(fact.watch);
    if (!brand) continue;

    const acq = acquisitionOf(fact.relation);
    const entry =
      map.get(brand) ??
      map
        .set(brand, {
          brand,
          slug: brandSlug(brand),
          wearers: [],
          totalGBP: 0,
          paid: 0,
          bought: 0,
        })
        .get(brand)!;

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

  // Dearest-first within a brand, and brands ranked by total on the wrist.
  for (const e of map.values()) {
    e.wearers.sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
  }
  return [...map.values()].sort((a, b) => b.totalGBP - a.totalGBP);
}

export function getBrand(slug: string): BrandEntry | undefined {
  return deriveBrands().find((b) => b.slug === slug);
}
