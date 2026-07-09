/**
 * LINK AUDIT (editorial internal links) —  npm run link:audit
 *
 * Report-only sweep of the internal-link graph. Three passes:
 *   1. Extracts every in-body markdown link ([text](/path)) from
 *      content/essays/*.mdx prose (external http(s) links and JSX ignored) and
 *      validates each against the REAL route space — essay routes derived from
 *      the registry (slug + mode, per lib/content's essayHref) plus every
 *      app/**\/page.tsx route, discovered mechanically. Broken links are errors.
 *   2. Flags essays with ZERO in-body internal links (missed contextual-linking
 *      opportunities) and suggests up to 3 candidate targets — siblings sharing
 *      ≥2 tags or the same pillar. Advisory only; this script never edits files.
 *   3. Validates every relatedSlugs entry across the registry resolves to a
 *      real essay slug. Dead entries are errors.
 *
 * Exits 1 only on real defects (broken links / dead relatedSlugs); zero-link
 * essays and suggestions are warnings. Reports only — never rewrites.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const GREEN = "\x1b[32m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

const ROOT = join(new URL(".", import.meta.url).pathname, "..");
const ESSAYS_DIR = join(ROOT, "content", "essays");
const APP_DIR = join(ROOT, "app");

// Route sections per editorial mode — mirrors lib/content's sectionOf/essayHref.
const MODE_SECTION: Record<string, string> = {
  feature: "features",
  guide: "guides",
  review: "reviews",
  dispatch: "dispatch",
};
const ESSAY_SECTIONS = new Set(Object.values(MODE_SECTION));

// ── essay corpus: slug list from the registry, meta from each .mdx ──

type Meta = {
  title?: string;
  pillar?: string;
  mode?: string;
  tags?: string[];
  relatedSlugs?: string[];
  date?: string;
};

/** Extract the `export const meta = {…};` object literal (balanced braces,
 *  string-aware) so we can evaluate it — no fragile per-field regexes. */
function extractMeta(src: string): { obj: Meta; start: number; end: number } | null {
  const m = /export\s+const\s+meta\s*=\s*/.exec(src);
  if (!m) return null;
  const open = src.indexOf("{", m.index + m[0].length);
  if (open < 0) return null;
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
        const literal = src.slice(open, i + 1);
        try {
          const obj = new Function(`return (${literal});`)() as Meta;
          return { obj, start: m.index, end: i + 1 };
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

const registrySrc = readFileSync(join(ROOT, "content", "essays", "registry.ts"), "utf8");
// Tolerates both registry entry styles: multi-line ("slug:" starts the line)
// and compact one-liners ("{ slug:" mid-line).
const registrySlugs = [...registrySrc.matchAll(/(?:^|\{)\s*slug:\s*["']([^"']+)["']/gm)].map((m) => m[1]);

type Essay = {
  slug: string;
  file: string;
  meta: Meta;
  body: string;
};
const essays: Essay[] = [];
for (const slug of registrySlugs) {
  const file = join(ESSAYS_DIR, `${slug}.mdx`);
  if (!existsSync(file)) {
    // Registry points at a file that doesn't exist — the build would fail
    // before we could; surface it and skip.
    console.log(`${RED}registry${RESET} slug "${slug}" has no ${relative(ROOT, file)}`);
    continue;
  }
  const src = readFileSync(file, "utf8");
  const parsed = extractMeta(src);
  const body = parsed ? src.slice(0, parsed.start) + src.slice(parsed.end) : src;
  essays.push({ slug, file: relative(ROOT, file), meta: parsed?.obj ?? {}, body });
}

/** Canonical route for an essay — mirrors lib/content's essayHref. */
const essayRoute = (e: Essay) => `/${MODE_SECTION[e.meta.mode ?? "feature"] ?? "features"}/${e.slug}`;
const essayBySlug = new Map(essays.map((e) => [e.slug, e]));

// ── route space: essay routes + every app/**/page.tsx, found mechanically ──

const staticRoutes = new Set<string>();
const dynamicPatterns: RegExp[] = []; // non-essay [param] routes — param unvalidatable here
function walkApp(dir: string, segments: string[]) {
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, name.name);
    if (name.isDirectory()) {
      if (name.name.startsWith(".") || name.name.startsWith("(")) continue;
      walkApp(p, [...segments, name.name]);
    } else if (name.name === "page.tsx") {
      const route = "/" + segments.join("/");
      if (segments.some((s) => s.startsWith("["))) {
        // Essay-section dynamic routes get STRICT slug+mode validation below.
        if (segments.length === 2 && ESSAY_SECTIONS.has(segments[0])) continue;
        dynamicPatterns.push(
          new RegExp(`^/${segments.map((s) => (s.startsWith("[") ? "[^/]+" : s)).join("/")}$`),
        );
      } else staticRoutes.add(route === "/" ? "/" : route);
    }
  }
}
walkApp(APP_DIR, []);
for (const e of essays) staticRoutes.add(essayRoute(e));

type Verdict = { ok: boolean; note?: string };
function validateHref(href: string): Verdict {
  const path = href.replace(/[#?].*$/, "").replace(/\/+$/, "") || "/";
  if (staticRoutes.has(path)) return { ok: true };
  const seg = path.split("/").filter(Boolean);
  // Essay-section link with a bad slug (or a slug filed under the wrong mode).
  if (seg.length === 2 && ESSAY_SECTIONS.has(seg[0])) {
    const target = essayBySlug.get(seg[1]);
    if (target)
      return { ok: false, note: `essay lives at ${essayRoute(target)} (mode: ${target.meta.mode ?? "feature"})` };
    return { ok: false, note: "no essay with that slug" };
  }
  // Legacy /essays/<slug> — next.config emits a 308, but link the canonical route.
  if (seg.length === 2 && seg[0] === "essays") {
    const target = essayBySlug.get(seg[1]);
    if (target) return { ok: true, note: `legacy route — 308s to ${essayRoute(target)}; prefer the canonical href` };
    return { ok: false, note: "no essay with that slug (legacy /essays/ route)" };
  }
  if (dynamicPatterns.some((re) => re.test(path))) return { ok: true };
  return { ok: false, note: "no matching route in app/" };
}

// ── pass 1: extract + validate in-body internal links ──

const MD_LINK = /(!?)\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
const ASSET_EXT = /\.(?:avif|gif|ico|jpe?g|pdf|png|svg|txt|webp|xml)$/i;

let brokenLinks = 0;
let legacyLinks = 0;
let checkedLinks = 0;
const linkCounts = new Map<string, number>(essays.map((e) => [e.slug, 0]));

console.log(
  `\nLINK AUDIT — ${essays.length} essay(s), ${staticRoutes.size} routes ` +
    `(${essays.length} essay + ${staticRoutes.size - essays.length} static, ${dynamicPatterns.length} dynamic pattern(s))\n`,
);

for (const e of essays) {
  for (const m of e.body.matchAll(MD_LINK)) {
    const [, bang, , href] = m;
    if (bang) continue; // image, not a route link
    if (!href.startsWith("/") || href.startsWith("//")) continue; // external / anchor / mailto
    if (ASSET_EXT.test(href)) continue; // static asset, not a route
    checkedLinks++;
    const line = e.body.slice(0, m.index).split("\n").length;
    const verdict = validateHref(href);
    if (!verdict.ok) {
      brokenLinks++;
      console.log(
        `${YELLOW}${e.file}:${line}${RESET}  ${RED}broken-link${RESET} ${href}\n    ${DIM}${verdict.note}${RESET}`,
      );
    } else {
      linkCounts.set(e.slug, (linkCounts.get(e.slug) ?? 0) + 1);
      if (verdict.note) {
        legacyLinks++;
        console.log(
          `${YELLOW}${e.file}:${line}${RESET}  ${YELLOW}legacy-link${RESET} ${href}\n    ${DIM}${verdict.note}${RESET}`,
        );
      }
    }
  }
}

// ── pass 2: zero-link essays + contextual-linking suggestions (advisory) ──

const norm = (t: string) => t.trim().toLowerCase();
function suggestFor(e: Essay): { slug: string; shared: string[]; samePillar: boolean; score: number }[] {
  const tags = new Set((e.meta.tags ?? []).map(norm));
  return essays
    .filter((c) => c.slug !== e.slug)
    .map((c) => {
      const shared = (c.meta.tags ?? []).filter((t) => tags.has(norm(t)));
      const samePillar = !!e.meta.pillar && c.meta.pillar === e.meta.pillar;
      return { slug: c.slug, shared, samePillar, score: shared.length * 2 + (samePillar ? 1 : 0) };
    })
    .filter((s) => s.shared.length >= 2 || s.samePillar)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

const zeroLink = essays.filter((e) => (linkCounts.get(e.slug) ?? 0) === 0);
if (zeroLink.length) {
  console.log(
    `${YELLOW}zero-link essays${RESET} — ${zeroLink.length} of ${essays.length} carry no in-body internal links. ` +
      `${DIM}Candidate targets (≥2 shared tags or same pillar):${RESET}`,
  );
  for (const e of zeroLink) {
    console.log(`\n  ${YELLOW}${e.file}${RESET} ${DIM}(pillar: ${e.meta.pillar ?? "—"})${RESET}`);
    const picks = suggestFor(e);
    if (!picks.length) {
      console.log(`    ${DIM}no sibling shares ≥2 tags or the pillar${RESET}`);
      continue;
    }
    for (const s of picks) {
      const why = [
        s.shared.length ? `shared tags: ${s.shared.join(", ")}` : "",
        s.samePillar ? "same pillar" : "",
      ]
        .filter(Boolean)
        .join("; ");
      console.log(`    → ${s.slug}  ${DIM}${essayRoute(essayBySlug.get(s.slug)!)}  (${why})${RESET}`);
    }
  }
  console.log("");
}

// ── pass 3: relatedSlugs must resolve to real essay slugs ──

let deadRelated = 0;
for (const e of essays) {
  for (const r of e.meta.relatedSlugs ?? []) {
    if (!essayBySlug.has(r)) {
      deadRelated++;
      console.log(
        `${YELLOW}${e.file}${RESET}  ${RED}dead-relatedSlug${RESET} "${r}"\n    ${DIM}no essay with that slug in the registry${RESET}`,
      );
    }
  }
}

// ── summary ──

const errors = brokenLinks + deadRelated;
const warnings = zeroLink.length + legacyLinks;
console.log("");
if (errors > 0) {
  console.log(
    `${RED}FAIL${RESET}: ${brokenLinks} broken link(s), ${deadRelated} dead relatedSlug(s) ` +
      `across ${checkedLinks} internal link(s). ${DIM}Fix the hrefs — routes are listed above.${RESET}\n`,
  );
  process.exit(1);
}
console.log(
  `${GREEN}OK${RESET}: ${checkedLinks} internal link(s) resolve, every relatedSlug is live` +
    (warnings ? ` ${DIM}(${zeroLink.length} zero-link essay(s), ${legacyLinks} legacy link(s) — advisory)${RESET}` : "") +
    ".\n",
);
