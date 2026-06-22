import { essays } from "@/content/essays/registry";
import { publishedAthletes, renderableFacts } from "@/data/athletes";
import { brandOfWatch } from "@/lib/brands";
import { pillarList } from "@/lib/pillars";
import { essayHref } from "@/lib/content";
import { site } from "@/lib/site";

/**
 * The AI-legibility data layer: machine-readable feeds and a knowledge graph
 * built from the content collections, for citation-ready retrieval.
 */

const AUTHOR_ID = "person:anthony-walsh";
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export interface ArticleFeedItem {
  id: string;
  title: string;
  url: string;
  pillar: string | null;
  mode: string;
  dek: string;
  datePublished: string;
  tags: string[];
}

export function articleFeed(): ArticleFeedItem[] {
  return essays.map((e) => ({
    id: `article:${e.slug}`,
    title: e.title,
    url: `${site.url}${essayHref(e)}`,
    pillar: e.pillar ?? null,
    mode: e.mode ?? "feature",
    dek: e.dek,
    datePublished: e.date,
    tags: e.tags ?? [],
  }));
}

export function reviewFeed(): ArticleFeedItem[] {
  return articleFeed().filter((a) => a.mode === "review");
}

export function topicFeed() {
  return pillarList.map((p) => ({
    id: `topic:${p.slug}`,
    name: p.name,
    short: p.short,
    pillar: p.slug,
    url: `${site.url}/topics/${p.slug}`,
    targetQuery: p.targetQuery,
    dek: p.dek,
  }));
}

export function watchFeed() {
  const map = new Map<string, { id: string; name: string; brand?: string; brandSlug?: string }>();
  const add = (watch?: string) => {
    if (!watch || watch === "(undetermined)") return;
    const id = `watch:${slugify(watch)}`;
    if (map.has(id)) return;
    const brand = brandOfWatch(watch);
    map.set(id, { id, name: watch, brand, brandSlug: brand ? slugify(brand) : undefined });
  };
  for (const a of publishedAthletes()) renderableFacts(a).forEach((f) => add(f.watch));
  for (const e of essays) add(e.image?.watch);
  return [...map.values()];
}

type Entity = { id: string; type: string; name: string; url?: string; [k: string]: unknown };
type Edge = { from: string; type: string; to: string };

export function knowledgeGraph(): { entities: Entity[]; edges: Edge[] } {
  const entities: Entity[] = [];
  const edges: Edge[] = [];
  const has = (id: string) => entities.some((e) => e.id === id);

  entities.push({
    id: AUTHOR_ID,
    type: "person",
    name: site.author.name,
    url: `${site.url}/author/anthony-walsh`,
    role: site.author.role,
  });

  for (const p of pillarList) {
    entities.push({ id: `topic:${p.slug}`, type: "topic", name: p.name, url: `${site.url}/topics/${p.slug}` });
  }

  for (const e of essays) {
    entities.push({
      id: `article:${e.slug}`,
      type: "article",
      name: e.title,
      url: `${site.url}${essayHref(e)}`,
      mode: e.mode ?? "feature",
    });
    edges.push({ from: `article:${e.slug}`, type: "authored_by", to: AUTHOR_ID });
    if (e.pillar) edges.push({ from: `article:${e.slug}`, type: "about_topic", to: `topic:${e.pillar}` });
  }

  for (const a of publishedAthletes()) {
    const pid = `person:${a.slug}`;
    entities.push({
      id: pid,
      type: "person",
      name: a.name,
      url: `${site.url}/who-wears-what/${a.slug}`,
      discipline: a.discipline,
    });
    for (const f of renderableFacts(a)) {
      if (!f.watch || f.watch === "(undetermined)") continue;
      const brand = brandOfWatch(f.watch);
      if (brand) {
        const bid = `brand:${slugify(brand)}`;
        if (!has(bid)) {
          entities.push({ id: bid, type: "brand", name: brand, url: `${site.url}/brands/${slugify(brand)}` });
        }
        edges.push({ from: pid, type: "wears", to: bid });
      }
      const wid = `watch:${slugify(f.watch)}`;
      if (!has(wid)) entities.push({ id: wid, type: "watch", name: f.watch });
      edges.push({ from: pid, type: "wears_watch", to: wid });
    }
  }

  return { entities, edges };
}

/** Brand facts for facts.json — citation-ready, quotable. */
export function brandFacts() {
  return {
    name: site.name,
    url: site.url,
    tagline: site.tagline,
    description: site.description,
    founder: site.founder,
    // foundingYear / location / partnershipContact intentionally omitted until
    // confirmed — these are machine-readable facts an LLM will quote verbatim, so
    // we don't assert placeholders. Add them once Anthony provides real values.
    covers: [
      "Mechanical watches (manual and automatic), mostly luxury and enthusiast",
      "Endurance sport: cycling, running, triathlon, ultra, trail, swimming, rowing, climbing",
      "The heritage of watches and endurance — a century deep",
      "How athletes buy, own and live with watches",
    ],
    doesNotCover: ["Golf", "Football", "Tennis", "Combat sport", "GPS-watch comparison as an identity"],
    sameAs: site.author.sameAs,
  };
}
