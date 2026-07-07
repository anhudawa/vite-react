import { readFileSync } from "node:fs";
import { join } from "node:path";
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

// ── full-content rendering ──────────────────────────────────────────────────
// The bodies are MDX, but the route is force-static, so this runs at build
// with fs access. We never execute the MDX — an honest markdown→HTML pass over
// the raw source is what a feed reader wants anyway.

const ESSAYS_DIR = join(process.cwd(), "content", "essays");

/**
 * Strip the `export const meta = {…};` block — balanced braces, string-aware.
 * Mirrors extractMeta in scripts/link-audit.mts (a script, not importable).
 */
function stripMeta(src: string): string {
  const m = /export\s+const\s+meta\s*=\s*/.exec(src);
  if (!m) return src;
  const open = src.indexOf("{", m.index + m[0].length);
  if (open < 0) return src;
  let depth = 0;
  let quote: string | null = null;
  for (let i = open; i < src.length; i++) {
    const ch = src[i];
    if (quote) {
      if (ch === "\\") i++;
      else if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'" || ch === "`") quote = ch;
    else if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        let end = i + 1;
        if (src[end] === ";") end++;
        return src.slice(0, m.index) + src.slice(end);
      }
    }
  }
  return src;
}

/** Inline markdown → HTML: escape, then links (made absolute), bold, italic. */
function inlineHtml(text: string): string {
  let s = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  // [label](href) — relative hrefs become absolute against the site URL.
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (_, label, href) => {
    const abs = href.startsWith("/") ? `${site.url}${href}` : href;
    return `<a href="${abs}">${label}</a>`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>");
  return s;
}

/**
 * Tiny markdown→HTML converter for the essay corpus: h2–h4 headings,
 * paragraphs, unordered lists, links, bold, italic, and <Pull> pull-quotes
 * (rendered as blockquotes). That is the complete grammar the essays use.
 */
function mdToHtml(md: string): string {
  // <Pull cite="…">inner</Pull> → a blockquote block, pre-rendered and fenced
  // off so the block pass emits it verbatim.
  const HTML_BLOCK = "@@html@@";
  const src = md.replace(
    /<Pull\b[^>]*>([\s\S]*?)<\/Pull>/g,
    (_, inner: string) =>
      `\n\n${HTML_BLOCK}<blockquote>${inlineHtml(inner.trim().replace(/\s+/g, " "))}</blockquote>\n\n`,
  );

  const out: string[] = [];
  for (const raw of src.split(/\n{2,}/)) {
    const block = raw.trim();
    if (!block) continue;
    if (block.startsWith(HTML_BLOCK)) {
      out.push(block.slice(HTML_BLOCK.length));
      continue;
    }
    const heading = /^(#{2,4})\s+(.+)$/.exec(block);
    if (heading && !block.includes("\n")) {
      const level = heading[1].length;
      out.push(`<h${level}>${inlineHtml(heading[2])}</h${level}>`);
      continue;
    }
    if (/^[-*]\s+/.test(block)) {
      const items = block
        .split(/\n(?=[-*]\s+)/)
        .map((li) => `<li>${inlineHtml(li.replace(/^[-*]\s+/, "").replace(/\n/g, " "))}</li>`);
      out.push(`<ul>${items.join("")}</ul>`);
      continue;
    }
    out.push(`<p>${inlineHtml(block.replace(/\n/g, " "))}</p>`);
  }
  return out.join("\n");
}

/** Full essay body as HTML, from the raw .mdx on disk. */
function essayBodyHtml(slug: string): string {
  const src = readFileSync(join(ESSAYS_DIR, `${slug}.mdx`), "utf8");
  return mdToHtml(stripMeta(src));
}

/** CDATA-wrap, splitting any literal "]]>" so the section can't close early. */
const cdata = (s: string) => `<![CDATA[${s.replace(/\]\]>/g, "]]]]><![CDATA[>")}]]>`;

export function GET() {
  const items = essays
    .map((e) => {
      const url = `${site.url}${essayHref(e)}`;
      return [
        "    <item>",
        `      <title>${esc(e.title)}</title>`,
        `      <link>${esc(url)}</link>`,
        `      <description>${esc(e.dek)}</description>`,
        `      <content:encoded>${cdata(essayBodyHtml(e.slug))}</content:encoded>`,
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
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">`,
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
