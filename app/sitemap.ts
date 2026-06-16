import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { nav, secondaryNav } from "@/lib/site";
import { essays } from "@/content/essays/registry";
import { publishedAthletes } from "@/data/athletes";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const staticRoutes = ["/", ...nav.map((n) => n.href), ...secondaryNav.map((n) => n.href)];

  const essayRoutes = essays.map((e) => ({
    url: `${base}/essays/${e.slug}`,
    lastModified: new Date(e.date),
  }));

  const athleteRoutes = publishedAthletes().map((a) => ({
    url: `${base}/who-wears-what/${a.slug}`,
  }));

  return [
    ...staticRoutes.map((path) => ({ url: `${base}${path}` })),
    ...essayRoutes,
    ...athleteRoutes,
  ];
}
