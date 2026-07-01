import { essays } from "@/content/essays/registry";
import { essayHref } from "@/lib/content";
import { site } from "@/lib/site";

export const dynamic = "force-static";

/** Escape the five XML entities — titles carry apostrophes and em-dashes. */
const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export function GET() {
  const items = essays
    .map((e) => {
      const url = `${site.url}${essayHref(e)}`;
      return [
        "    <item>",
        `      <title>${esc(e.title)}</title>`,
        `      <link>${esc(url)}</link>`,
        `      <description>${esc(e.dek)}</description>`,
        `      <pubDate>${new Date(e.date).toUTCString()}</pubDate>`,
        `      <guid isPermaLink="true">${esc(url)}</guid>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const lastBuildDate = essays.length
    ? new Date(essays[0].date).toUTCString()
    : new Date().toUTCString();

  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">`,
    "  <channel>",
    `    <title>${esc(site.name)}</title>`,
    `    <link>${esc(site.url)}</link>`,
    `    <description>${esc(site.description)}</description>`,
    "    <language>en-gb</language>",
    `    <lastBuildDate>${lastBuildDate}</lastBuildDate>`,
    `    <atom:link href="${esc(`${site.url}/rss.xml`)}" rel="self" type="application/rss+xml"/>`,
    items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");

  return new Response(xml, {
    headers: { "content-type": "application/rss+xml; charset=utf-8" },
  });
}
