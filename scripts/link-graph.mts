/**
 * LINK GRAPH REPORT —  npm run link:graph
 *
 * For every essay, counts inbound related-reading links — how many OTHER
 * essays' relatedFor(n=3) picks include it — and flags ORPHANS (zero inbound).
 * Report-only: prints and always exits 0.
 *
 * The registry imports .mdx, which tsx cannot compile, so a resolve hook
 * redirects each .mdx import to a generated stub module exporting only its
 * `meta` block (every essay opens with `export const meta = {...};`). The
 * graph is therefore computed from the same registry and the same relatedFor
 * the site renders with — no duplicated scoring to drift.
 */
import { registerHooks } from "node:module";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const stubDir = mkdtempSync(join(tmpdir(), "link-graph-mdx-"));

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.endsWith(".mdx")) {
      const fileUrl = new URL(specifier, context.parentURL);
      const src = readFileSync(fileUrl, "utf8");
      const metaBlock = src
        .slice(0, src.indexOf("\n};") + 3)
        .replace(/^export const meta/, "const meta");
      const stub = join(stubDir, `${basename(fileURLToPath(fileUrl))}.js`);
      writeFileSync(stub, `${metaBlock}\nmodule.exports = { meta, default: () => null };\n`);
      return { url: pathToFileURL(stub).href, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
});

const { essays } = await import("../content/essays/registry");
const { relatedFor } = await import("../lib/related");

const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const GREEN = "\x1b[32m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

// Inbound edges: which essays' related-reading blocks point at each slug.
const inbound = new Map<string, string[]>(essays.map((e) => [e.slug, []]));
for (const e of essays) {
  for (const r of relatedFor(e, essays, 3)) inbound.get(r.slug)?.push(e.slug);
}

const rows = essays
  .map((e) => ({ slug: e.slug, count: inbound.get(e.slug)?.length ?? 0 }))
  .sort((a, b) => b.count - a.count || (a.slug < b.slug ? -1 : 1));

console.log(
  `\nLINK GRAPH — inbound related-reading links (relatedFor, n=3) across ${essays.length} essays\n`
);
for (const { slug, count } of rows) {
  const flag = count === 0 ? `  ${RED}ORPHAN${RESET}` : "";
  console.log(`  ${String(count).padStart(2)}  ${slug}${flag}`);
}

const orphans = rows.filter((r) => r.count === 0);
if (orphans.length > 0) {
  console.log(
    `\n${YELLOW}${orphans.length} orphan(s)${RESET} — no other essay links to them. ` +
      `${DIM}Add them to a sibling's relatedSlugs, or share tags/pillar/watches.${RESET}\n`
  );
} else {
  console.log(`${GREEN}\nOK${RESET}: every essay has at least one inbound related-reading link.\n`);
}

rmSync(stubDir, { recursive: true, force: true });
