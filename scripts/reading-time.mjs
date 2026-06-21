#!/usr/bin/env node
// Compute honest reading times from the actual prose of each essay and write the
// value back into its meta. Run via `npm run reading-time`. ~230 wpm (standard
// adult silent-reading rate), rounded to the nearest minute, floor of 1.
// The label is derived from the words, so it can never drift from the truth.
import fs from "node:fs";
import path from "node:path";

const WORDS_PER_MINUTE = 230;
const dir = path.join(process.cwd(), "content/essays");

function wordCount(src) {
  const prose = src
    .replace(/^[\s\S]*?\n};\n/, "") // drop the meta export block
    .replace(/```[\s\S]*?```/g, " ") // code fences
    .replace(/<[^>]*>/g, " ") // jsx/html tags
    .replace(/[#>*_`|~[\]()|~-]/g, " "); // markdown punctuation
  return prose.split(/\s+/).filter(Boolean).length;
}

let changed = 0;
for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"))) {
  const full = path.join(dir, file);
  const src = fs.readFileSync(full, "utf8");
  const words = wordCount(src);
  const mins = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
  const label = `${mins} min`;
  const next = src.replace(/readingTime:\s*"[^"]*"/, `readingTime: "${label}"`);
  if (next !== src) {
    fs.writeFileSync(full, next);
    changed++;
  }
  console.log(`${file.replace(/\.mdx$/, "").padEnd(36)} ${String(words).padStart(4)} words -> ${label}`);
}
console.log(`\nUpdated ${changed} file(s).`);
