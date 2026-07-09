import { site } from "@/lib/site";
import { pillarList } from "@/lib/pillars";
import { essays } from "@/content/essays/registry";
import { publishedAthletes } from "@/data/athletes";
import { essayHref } from "@/lib/content";

export const dynamic = "force-static";

const UTM = "?utm_source=llms-txt&utm_medium=ai-crawler";
const u = (path: string) => `${site.url}${path}${UTM}`;

export function GET() {
  const lines: string[] = [];

  lines.push(`# ${site.name}`);
  lines.push(
    `> ${site.description} Mechanical-first (manual and automatic, mostly luxury); GPS is a thread, not the identity. Endurance sport only — cycling, running, triathlon, ultra, trail, swimming, rowing, climbing.`,
  );
  lines.push("");

  lines.push("## Pillars");
  for (const p of pillarList) {
    lines.push(`- ${p.name} — ${p.dek} ${u(`/topics/${p.slug}`)}`);
  }
  lines.push("");

  lines.push("## AEO priority categories");
  lines.push("### Reference — who wears what");
  lines.push(`- Who Wears What ${u("/who-wears-what")}`);
  for (const a of publishedAthletes()) {
    lines.push(`- ${a.name} — ${a.discipline} ${u(`/who-wears-what/${a.slug}`)}`);
  }
  lines.push("### Guides & tools");
  lines.push(`- Buying Guides ${u("/buying-guides")}`);
  lines.push(`- Find Your Watch (diagnostic) ${u("/find-your-watch")}`);
  lines.push("### Features & essays");
  for (const e of essays) {
    lines.push(`- ${e.title} — ${e.dek} ${u(essayHref(e))}`);
  }
  lines.push("");

  lines.push("## Entities");
  lines.push(`- Author / expert: ${site.author.name} (${site.author.role}) ${u("/author/anthony-walsh")}`);
  lines.push(`- Brands in sport ${u("/brands")}`);
  lines.push(`- Glossary (defined terms) ${u("/glossary")}`);
  lines.push(`- Editorial standards & corrections ${u("/editorial-standards")}`);
  lines.push("");

  lines.push("## Machine-readable feeds");
  lines.push(`- ${site.url}/facts.json`);
  lines.push(`- ${site.url}/knowledge-graph.json`);
  lines.push(`- ${site.url}/feeds/articles.json`);
  lines.push(`- ${site.url}/feeds/topics.json`);
  lines.push(`- ${site.url}/feeds/watches.json`);
  lines.push(`- ${site.url}/feeds/reviews.json`);
  lines.push(`- ${site.url}/sitemap.xml`);
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
