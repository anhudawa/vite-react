import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { nav, secondaryNav } from "@/lib/site";
import { essays } from "@/content/essays/registry";
import { publishedAthletes } from "@/data/athletes";
import { deriveBrands } from "@/lib/brands";
import { allTags } from "@/lib/tags";
import { pillarList } from "@/lib/pillars";
import { essayHref } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const staticRoutes = Array.from(
    new Set(["/", "/topics", ...nav.map((n) => n.href), ...secondaryNav.map((n) => n.href), "/search"]),
  );

  const pillarRoutes = pillarList.map((p) => ({ url: `${base}/topics/${p.slug}` }));

  const essayRoutes = essays.map((e) => ({
    url: `${base}${essayHref(e)}`,
    lastModified: new Date(e.date),
  }));

  const athleteRoutes = publishedAthletes().map((a) => ({
    url: `${base}/who-wears-what/${a.slug}`,
  }));

  const brandRoutes = deriveBrands().map((b) => ({ url: `${base}/brands/${b.slug}` }));

  const tagRoutes = allTags().map((t) => ({ url: `${base}/tag/${t.slug}` }));

  return [
    ...staticRoutes.map((path) => ({ url: `${base}${path}` })),
    ...pillarRoutes,
    ...essayRoutes,
    ...athleteRoutes,
    ...brandRoutes,
    ...tagRoutes,
  ];
}
