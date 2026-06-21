import { essays } from "@/content/essays/registry";
import { publishedAthletes, renderableFacts } from "@/data/athletes";
import { nav, secondaryNav } from "@/lib/site";

export type SearchKind = "Essay" | "Reference" | "Section";

export interface SearchDoc {
  title: string;
  href: string;
  kind: SearchKind;
  summary: string;
  /** lowercased haystack of everything searchable for this doc */
  keywords: string;
}

const SECTION_BLURBS: Record<string, string> = {
  "/who-wears-what":
    "Which athletes wear which watches — and whether they bought it or are paid to.",
  "/watches-in-sport": "How timing, sponsorship and the watch live inside sport.",
  "/buying-guides": "Not a shop. How a watch is made and how it lives on a wrist.",
  "/essays": "Long-form on athletes, watches, and the one thing they share — time.",
  "/about": "Who The Long Second is for, and why an athlete is the one telling it.",
};

/** The whole searchable corpus, assembled at build time. Small by design — titles,
 *  deks, tags and key fields, not full bodies — so it ships as a tiny payload. */
export function buildSearchIndex(): SearchDoc[] {
  const docs: SearchDoc[] = [];

  for (const e of essays) {
    docs.push({
      title: e.title,
      href: `/essays/${e.slug}`,
      kind: "Essay",
      summary: e.dek,
      keywords: [e.title, e.dek, e.kicker, e.silo, ...(e.tags ?? [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    });
  }

  for (const a of publishedAthletes()) {
    const f = renderableFacts(a)[0];
    docs.push({
      title: a.name,
      href: `/who-wears-what/${a.slug}`,
      kind: "Reference",
      summary: `${f.watch} — ${f.relation}`,
      keywords: [
        a.name,
        a.discipline,
        a.nationality,
        f.watch,
        f.relation,
        f.evidence,
        f.reference,
        a.summary,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    });
  }

  for (const item of [...nav, ...secondaryNav]) {
    const summary = SECTION_BLURBS[item.href] ?? "";
    docs.push({
      title: item.label,
      href: item.href,
      kind: "Section",
      summary,
      keywords: `${item.label} ${summary}`.toLowerCase(),
    });
  }

  return docs;
}

/** Token-AND match with a light relevance score: title hits outrank body hits. */
export function searchDocs(index: SearchDoc[], query: string): SearchDoc[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  return index
    .map((doc) => {
      const title = doc.title.toLowerCase();
      let score = 0;
      for (const t of terms) {
        if (!doc.keywords.includes(t)) return { doc, score: -1 };
        if (title.includes(t)) score += 3;
        if (title.startsWith(t)) score += 2;
        score += 1;
      }
      return { doc, score };
    })
    .filter((r) => r.score >= 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.doc);
}
