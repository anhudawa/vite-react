import { essays } from "@/content/essays/registry";
import { publishedAthletes, renderableFacts } from "@/data/athletes";
import { brandOfWatch } from "@/lib/brands";
import { pillarList } from "@/lib/pillars";
import { essayHref } from "@/lib/content";
import { site } from "@/lib/site";
import { brand, brandSameAs } from "@/data/brand";

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
  tldr: string | null;
  datePublished: string;
  dateModified: string;
  tags: string[];
  watchesMentioned: string[];
}

export function articleFeed(): ArticleFeedItem[] {
  return essays.map((e) => ({
    id: `article:${e.slug}`,
    title: e.title,
    url: `${site.url}${essayHref(e)}`,
    pillar: e.pillar ?? null,
    mode: e.mode ?? "feature",
    dek: e.dek,
    tldr: e.tldr ?? null,
    datePublished: e.date,
    dateModified: e.dateModified ?? e.date,
    tags: e.tags ?? [],
    watchesMentioned: e.watchesMentioned ?? [],
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

interface EnduranceEvent {
  id: string;
  name: string;
  /** Canonical Wikipedia/official URLs — anchors the entity for retrieval. */
  sameAs: string[];
  /** Lower-case aliases matched against essay meta and athlete facts to derive edges. */
  aliases: string[];
  /** Essays that reference the event in body prose only, where meta matching can't see it. */
  extraArticleSlugs?: string[];
}

/**
 * The endurance events the corpus actually references (in content/ or data/) —
 * nothing speculative. Edges are derived from the text we already assert:
 * essay tags/title/dek/tldr for `about_event`, athlete disciplines and verified
 * fact evidence for `competes_in`.
 */
const enduranceEvents: EnduranceEvent[] = [
  {
    id: "event:tour-de-france",
    name: "Tour de France",
    sameAs: ["https://en.wikipedia.org/wiki/Tour_de_France", "https://www.letour.fr"],
    aliases: ["tour de france"],
    // "seven Tour de France titles" — referenced in the essay body, not the meta.
    extraArticleSlugs: ["lance-armstrong-watches"],
  },
  {
    id: "event:ironman-triathlon",
    name: "Ironman Triathlon",
    sameAs: ["https://en.wikipedia.org/wiki/Ironman_Triathlon", "https://www.ironman.com"],
    aliases: ["ironman"],
  },
  {
    id: "event:uci-hour-record",
    name: "UCI Hour Record",
    sameAs: ["https://en.wikipedia.org/wiki/Hour_record"],
    aliases: ["hour record"],
  },
  {
    id: "event:london-marathon",
    name: "London Marathon",
    sameAs: ["https://en.wikipedia.org/wiki/London_Marathon", "https://www.tcslondonmarathon.com"],
    aliases: ["london marathon"],
  },
  {
    id: "event:chicago-marathon",
    name: "Chicago Marathon",
    sameAs: ["https://en.wikipedia.org/wiki/Chicago_Marathon", "https://www.chicagomarathon.com"],
    aliases: ["chicago marathon"],
    // Kosgei's 2019 record run "in Chicago" — referenced in the essay body, not the meta.
    extraArticleSlugs: ["sixteen-years"],
  },
  {
    id: "event:paris-roubaix",
    name: "Paris–Roubaix",
    sameAs: ["https://en.wikipedia.org/wiki/Paris%E2%80%93Roubaix"],
    aliases: ["paris-roubaix"],
  },
  {
    id: "event:comrades-marathon",
    name: "Comrades Marathon",
    sameAs: ["https://en.wikipedia.org/wiki/Comrades_Marathon", "https://comrades.com"],
    aliases: ["comrades"],
  },
  {
    id: "event:ineos-159-challenge",
    name: "Ineos 1:59 Challenge",
    sameAs: ["https://en.wikipedia.org/wiki/Ineos_1:59_Challenge"],
    aliases: ["ineos 1:59", "1:59 challenge"],
  },
  {
    id: "event:olympic-games",
    name: "Olympic Games",
    sameAs: ["https://en.wikipedia.org/wiki/Olympic_Games", "https://www.olympics.com"],
    aliases: ["olympics", "olympic games"],
  },
  {
    id: "event:vendee-globe",
    name: "Vendée Globe",
    sameAs: ["https://en.wikipedia.org/wiki/Vend%C3%A9e_Globe", "https://www.vendeeglobe.org"],
    aliases: ["vendee globe", "vendee-globe"],
  },
];

interface CorpusPerson {
  id: string;
  name: string;
  /** Canonical Wikipedia/official URLs — anchors the entity for retrieval. */
  sameAs: string[];
  /** Lower-case aliases matched against essay meta to derive `about_person` edges. */
  aliases: string[];
  /** Essays that reference the person in body prose only, where meta matching can't see it. */
  extraArticleSlugs?: string[];
  /** Event ids the corpus explicitly places the person in — evidence cited per entry. */
  competesIn?: string[];
}

/**
 * The people the corpus actually references, beyond the athlete ledger —
 * nothing speculative. `about_person` edges are derived from essay meta the
 * same way `about_event` edges are; if an athlete-ledger profile with the same
 * id is ever published, that richer entity wins (see knowledgeGraph below).
 */
const corpusPeople: CorpusPerson[] = [
  {
    id: "person:paula-radcliffe",
    name: "Paula Radcliffe",
    sameAs: ["https://en.wikipedia.org/wiki/Paula_Radcliffe"],
    aliases: ["paula radcliffe", "radcliffe"],
    // "2:15:25, set at the 2003 London Marathon" — sixteen-years tldr.
    competesIn: ["event:london-marathon"],
  },
  {
    id: "person:brigid-kosgei",
    name: "Brigid Kosgei",
    sameAs: ["https://en.wikipedia.org/wiki/Brigid_Kosgei"],
    aliases: ["brigid kosgei", "kosgei"],
    // Her 2019 record run "in Chicago" — sixteen-years.
    competesIn: ["event:chicago-marathon"],
  },
  {
    id: "person:eliud-kipchoge",
    name: "Eliud Kipchoge",
    sameAs: ["https://en.wikipedia.org/wiki/Eliud_Kipchoge"],
    aliases: ["eliud kipchoge", "kipchoge"],
    // The 1:59:40 in Vienna — the-number-that-doesnt-count.
    competesIn: ["event:ineos-159-challenge"],
  },
  {
    id: "person:roger-bannister",
    name: "Roger Bannister",
    sameAs: ["https://en.wikipedia.org/wiki/Roger_Bannister"],
    aliases: ["roger bannister", "bannister"],
  },
  {
    id: "person:eddy-merckx",
    name: "Eddy Merckx",
    sameAs: ["https://en.wikipedia.org/wiki/Eddy_Merckx"],
    aliases: ["eddy merckx", "merckx"],
    // "Merckx rode 49.431 km in 1972" — the-longest-hour tldr.
    competesIn: ["event:uci-hour-record"],
  },
  {
    id: "person:filippo-ganna",
    name: "Filippo Ganna",
    sameAs: ["https://en.wikipedia.org/wiki/Filippo_Ganna"],
    aliases: ["filippo ganna", "ganna"],
    // "Filippo Ganna holds it now at 56.792 km" — the-longest-hour tldr.
    competesIn: ["event:uci-hour-record"],
  },
  {
    id: "person:charlie-dalin",
    name: "Charlie Dalin",
    sameAs: ["https://en.wikipedia.org/wiki/Charlie_Dalin"],
    aliases: ["charlie dalin", "dalin"],
    // Vendée Globe record holder — sixty-four-days dek and body.
    competesIn: ["event:vendee-globe"],
  },
  {
    id: "person:bradley-wiggins",
    name: "Bradley Wiggins",
    sameAs: ["https://en.wikipedia.org/wiki/Bradley_Wiggins"],
    aliases: ["bradley wiggins", "wiggins"],
    // "Bradley Wiggins in a London velodrome" — referenced in the essay body, not the meta.
    extraArticleSlugs: ["the-longest-hour"],
    competesIn: ["event:uci-hour-record"],
  },
  {
    id: "person:greg-lemond",
    name: "Greg LeMond",
    sameAs: ["https://en.wikipedia.org/wiki/Greg_LeMond"],
    aliases: ["greg lemond", "lemond"],
    // The 1989 eight-second Tour — the-1989-tour-eight-seconds.
    competesIn: ["event:tour-de-france"],
  },
  {
    id: "person:laurent-fignon",
    name: "Laurent Fignon",
    sameAs: ["https://en.wikipedia.org/wiki/Laurent_Fignon"],
    aliases: ["laurent fignon", "fignon"],
    competesIn: ["event:tour-de-france"],
  },
  {
    id: "person:lance-armstrong",
    name: "Lance Armstrong",
    sameAs: ["https://en.wikipedia.org/wiki/Lance_Armstrong"],
    // Never bare "armstrong" — the Speedmaster essays orbit another Armstrong.
    aliases: ["lance armstrong"],
    // "seven Tour de France titles" — lance-armstrong-watches body.
    competesIn: ["event:tour-de-france"],
  },
  {
    id: "person:john-collins",
    name: "John Collins",
    // The Ironman co-founder has no dedicated Wikipedia article — no URL we can stand behind.
    sameAs: [],
    aliases: ["john collins"],
  },
  {
    id: "person:jan-frodeno",
    name: "Jan Frodeno",
    sameAs: ["https://en.wikipedia.org/wiki/Jan_Frodeno"],
    aliases: ["jan frodeno", "frodeno"],
    // The Breitling Triathlon Squad — referenced in the essay body, not the meta.
    extraArticleSlugs: ["the-breitling-endurance-pro"],
    // "three-time Ironman World Champion" — data/athletes.ts discipline.
    competesIn: ["event:ironman-triathlon"],
  },
  {
    id: "person:daniela-ryf",
    name: "Daniela Ryf",
    sameAs: ["https://en.wikipedia.org/wiki/Daniela_Ryf"],
    aliases: ["daniela ryf"],
    // "five-time Ironman World Champion" — data/athletes.ts discipline.
    competesIn: ["event:ironman-triathlon"],
  },
  {
    id: "person:mercedes-gleitze",
    name: "Mercedes Gleitze",
    sameAs: ["https://en.wikipedia.org/wiki/Mercedes_Gleitze"],
    aliases: ["mercedes gleitze", "gleitze"],
  },
  {
    id: "person:john-harrison",
    name: "John Harrison",
    sameAs: ["https://en.wikipedia.org/wiki/John_Harrison"],
    aliases: ["john harrison", "john-harrison"],
  },
];

interface CorpusWatch {
  id: string;
  name: string;
  /** "watch" unless the object predates the wristwatch — H4 is an artifact. */
  type?: "watch" | "artifact";
  /** Canonical Wikipedia/manufacturer URLs — anchors the entity for retrieval. */
  sameAs: string[];
  /** Lower-case aliases matched against essay meta to derive mention edges. */
  aliases: string[];
}

/**
 * Watches the corpus references in essay meta (tags/title/dek/tldr) without
 * listing them in `watchesMentioned` — plus sameAs anchors for ones it does.
 * Ids follow `watch:${slugify(name)}` so they merge with the entities derived
 * from `watchesMentioned` rather than duplicating them.
 */
const corpusWatches: CorpusWatch[] = [
  {
    id: "watch:omega-speedmaster",
    name: "Omega Speedmaster",
    sameAs: ["https://en.wikipedia.org/wiki/Omega_Speedmaster"],
    aliases: ["speedmaster", "moonwatch"],
  },
  {
    id: "watch:rolex-sea-dweller",
    name: "Rolex Sea-Dweller",
    sameAs: ["https://en.wikipedia.org/wiki/Rolex_Sea-Dweller"],
    aliases: ["sea-dweller"],
  },
  {
    id: "watch:rolex-deepsea",
    name: "Rolex Deepsea",
    // No standalone Wikipedia article — Rolex's own newsroom page, cited in
    // the-overbuilt-watch sources, is the anchor.
    sameAs: ["https://newsroom.rolex.com/watches/oyster-collection/rolex-deepsea"],
    aliases: ["deepsea"],
  },
  {
    id: "artifact:harrison-h4",
    name: "Harrison H4 marine timekeeper",
    type: "artifact",
    // H4 has no standalone Wikipedia article; Royal Museums Greenwich's Harrison
    // pages (cited in the-clock-that-found-the-ship sources) are the anchor.
    sameAs: ["https://www.rmg.co.uk/stories/time/harrisons-clocks-longitude-problem"],
    aliases: ["h4"],
  },
];

/** Lower-case, en-dash-folded haystack for alias matching ("Paris–Roubaix" → "paris-roubaix"). */
const eventHaystack = (parts: (string | undefined)[]) =>
  parts.filter(Boolean).join(" | ").toLowerCase().replace(/–/g, "-");

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

  for (const ev of enduranceEvents) {
    entities.push({ id: ev.id, type: "event", name: ev.name, sameAs: ev.sameAs });
  }

  // Before the essay loop, so the sameAs-anchored entity wins over the bare
  // one a `watchesMentioned` listing would otherwise create for the same id.
  for (const w of corpusWatches) {
    entities.push({ id: w.id, type: w.type ?? "watch", name: w.name, sameAs: w.sameAs });
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
    const listedWatchIds = new Set((e.watchesMentioned ?? []).map((w) => `watch:${slugify(w)}`));
    for (const w of e.watchesMentioned ?? []) {
      const wid = `watch:${slugify(w)}`;
      if (!has(wid)) entities.push({ id: wid, type: "watch", name: w });
      edges.push({ from: `article:${e.slug}`, type: "mentions_watch", to: wid });
    }
    for (const rel of e.relatedSlugs ?? []) {
      edges.push({ from: `article:${e.slug}`, type: "related_to", to: `article:${rel}` });
    }
    const essayText = eventHaystack([e.title, e.dek, e.tldr, ...(e.tags ?? [])]);
    for (const ev of enduranceEvents) {
      if (ev.aliases.some((a) => essayText.includes(a)) || ev.extraArticleSlugs?.includes(e.slug)) {
        edges.push({ from: `article:${e.slug}`, type: "about_event", to: ev.id });
      }
    }
    for (const p of corpusPeople) {
      if (p.aliases.some((a) => essayText.includes(a)) || p.extraArticleSlugs?.includes(e.slug)) {
        edges.push({ from: `article:${e.slug}`, type: "about_person", to: p.id });
      }
    }
    for (const w of corpusWatches) {
      if (listedWatchIds.has(w.id)) continue; // edge already derived from watchesMentioned
      if (w.aliases.some((a) => essayText.includes(a))) {
        edges.push({
          from: `article:${e.slug}`,
          type: w.type === "artifact" ? "mentions_artifact" : "mentions_watch",
          to: w.id,
        });
      }
    }
  }

  for (const a of publishedAthletes()) {
    const pid = `person:${a.slug}`;
    entities.push({
      id: pid,
      type: "person",
      name: a.name,
      url: `${site.url}/who-wears-what/${a.slug}`,
      discipline: a.discipline,
      ...(a.sameAs.length ? { sameAs: a.sameAs } : {}),
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
    const athleteText = eventHaystack([a.discipline, a.summary, ...renderableFacts(a).map((f) => f.evidence)]);
    for (const ev of enduranceEvents) {
      if (ev.aliases.some((al) => athleteText.includes(al))) {
        edges.push({ from: pid, type: "competes_in", to: ev.id });
      }
    }
  }

  // After the athlete loop: a published who-wears-what profile is the richer
  // entity for the same person id, so it wins and the corpus entry stands down.
  for (const p of corpusPeople) {
    if (has(p.id)) continue;
    entities.push({ id: p.id, type: "person", name: p.name, sameAs: p.sameAs });
    for (const ev of p.competesIn ?? []) {
      edges.push({ from: p.id, type: "competes_in", to: ev });
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
    // foundingYear / location / contact come from data/brand.ts (the ONE file
    // Anthony fills). While null there they are omitted entirely — these are
    // machine-readable facts an LLM will quote verbatim, so no placeholders.
    ...(brand.foundedYear ? { foundingYear: brand.foundedYear } : {}),
    ...(brand.baseLocation ? { location: brand.baseLocation } : {}),
    ...(brand.contactEmail ? { contact: brand.contactEmail } : {}),
    covers: [
      "Mechanical watches (manual and automatic), mostly luxury and enthusiast",
      "Endurance sport: cycling, distance running (the mile, 5,000m, 10,000m, steeplechase, the marathon and its records), triathlon, ultra, trail, swimming, rowing, sailing, climbing — the race against the clock",
      "The records-and-timing heritage: the four-minute mile, the sub-two-hour marathon, sport timekeeping — the long second made literal",
      "The heritage of watches and endurance — a century deep",
      "How athletes buy, own and live with watches",
    ],
    doesNotCover: [
      "Sprint and field athletics (100m/200m, hurdles, jumps, throws) — the explosive second, not the long one",
      "Golf",
      "Football",
      "Tennis",
      "Combat sport",
      "GPS-watch comparison as an identity",
    ],
    sameAs: [...new Set([...site.author.sameAs, ...brandSameAs()])],
  };
}
