import { essays } from "@/content/essays/registry";
import { publishedAthletes, renderableFacts } from "@/data/athletes";
import { collections } from "@/data/collections";
import { glossary } from "@/data/glossary";
import { nav, secondaryNav } from "@/lib/site";
import { essayHref } from "@/lib/content";

export type SearchKind = "Essay" | "Reference" | "Section" | "Term" | "Question";

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
    "Which athletes wear which watches — and what they cost.",
  "/watches-in-sport": "How timing, sponsorship and the watch live inside sport.",
  "/buying-guides": "How a watch is made, what it's worth, and how it lives on a training wrist.",
  "/essays": "Long-form on athletes, watches, and the one thing they share — time.",
  "/about": "Who The Long Second is for, and why an athlete is the one telling it.",
  "/timeline": "The dates where watches and endurance sport met, in one line.",
  "/collections": "Curated reading orders through the archive.",
  "/feeds": "The machine-readable editions.",
};

/** The whole searchable corpus, assembled at build time. Small by design — titles,
 *  deks, tags, glossary terms and FAQ questions, not full bodies — so it ships as
 *  a tiny payload. */
export function buildSearchIndex(): SearchDoc[] {
  const docs: SearchDoc[] = [];

  for (const e of essays) {
    docs.push({
      title: e.title,
      href: essayHref(e),
      kind: "Essay",
      summary: e.dek,
      keywords: [e.title, e.dek, e.kicker, e.silo, ...(e.tags ?? [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    });

    // Each guide question is its own doc, deep-linked to the piece's Q&A section.
    for (const f of e.faq ?? []) {
      docs.push({
        title: f.q,
        href: `${essayHref(e)}#faq-h`,
        kind: "Question",
        summary: `Answered in “${e.title}”.`,
        keywords: `${f.q} ${e.title}`.toLowerCase(),
      });
    }
  }

  for (const t of glossary) {
    docs.push({
      title: t.term,
      href: `/glossary/${t.slug}`,
      kind: "Term",
      summary: t.short,
      keywords: `${t.term} ${t.short}`.toLowerCase(),
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

  // Each collection is its own doc — the trail is a destination in itself.
  for (const c of collections) {
    docs.push({
      title: c.title,
      href: `/collections/${c.slug}`,
      kind: "Section",
      summary: c.dek,
      keywords: `${c.title} ${c.dek}`.toLowerCase(),
    });
  }

  // /feeds sits outside the nav, so it gets its own entry.
  const feedsSummary = SECTION_BLURBS["/feeds"];
  docs.push({
    title: "Feeds",
    href: "/feeds",
    kind: "Section",
    summary: feedsSummary,
    keywords: `feeds ${feedsSummary}`.toLowerCase(),
  });

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
