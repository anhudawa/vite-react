/**
 * JSON-LD structural validator.
 *
 * Fetches a representative page set from the running site, extracts every
 * <script type="application/ld+json"> block, JSON.parses each, and asserts
 * structural sanity:
 *   - every block carries @context and @type
 *   - Article / NewsArticle blocks have headline, datePublished and author
 *   - FAQPage blocks have mainEntity Question/acceptedAnswer pairs
 *   - no literal "undefined" / "null" strings or null values leak into
 *     required fields
 *
 * Usage:  BASE_URL=http://localhost:3001 npm run validate:jsonld
 * Exits 1 on any failure, with a per-page report.
 */

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3001";

const PAGES: { label: string; path: string; expect?: string[] }[] = [
  { label: "home", path: "/" },
  {
    label: "feature (with sources)",
    path: "/features/four-laps-no-hiding",
    expect: ["Article"],
  },
  {
    label: "guide (with FAQ)",
    path: "/guides/what-a-chronometer-actually-is",
    expect: ["Article", "FAQPage"],
  },
  { label: "dispatch", path: "/dispatch/one-of-525", expect: ["NewsArticle"] },
  {
    label: "athlete",
    path: "/who-wears-what/tadej-pogacar",
    expect: ["Person"],
  },
  {
    label: "collection trail",
    path: "/collections/the-records-canon",
    expect: ["ItemList", "BreadcrumbList"],
  },
];

type Block = Record<string, unknown>;

const SCRIPT_RE =
  /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;

function extractBlocks(html: string): string[] {
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = SCRIPT_RE.exec(html)) !== null) out.push(m[1]);
  return out;
}

/** A required field must exist, be non-null, and not be a leaked literal. */
function checkRequired(
  block: Block,
  field: string,
  errors: string[],
  typeLabel: string
): void {
  const v = block[field];
  if (v === undefined || v === null) {
    errors.push(`${typeLabel}: missing required field "${field}"`);
    return;
  }
  if (typeof v === "string") {
    const s = v.trim();
    if (s === "" || s === "undefined" || s === "null") {
      errors.push(
        `${typeLabel}: required field "${field}" is a leaked literal (${JSON.stringify(v)})`
      );
    }
  }
}

/** Recursively hunt for leaked "undefined"/"null" literals or null values anywhere. */
function findLeaks(node: unknown, path: string, errors: string[]): void {
  if (node === null) {
    errors.push(`null value at ${path}`);
    return;
  }
  if (typeof node === "string") {
    const s = node.trim();
    if (s === "undefined" || s === "null") {
      errors.push(`leaked literal ${JSON.stringify(node)} at ${path}`);
    }
    if (/\bundefined\b/.test(s)) {
      errors.push(`string containing "undefined" at ${path}: ${JSON.stringify(s.slice(0, 80))}`);
    }
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((item, i) => findLeaks(item, `${path}[${i}]`, errors));
    return;
  }
  if (typeof node === "object") {
    for (const [k, v] of Object.entries(node as Block)) {
      findLeaks(v, `${path}.${k}`, errors);
    }
  }
}

function validateBlock(block: Block, errors: string[]): void {
  const type = block["@type"];
  const typeLabel = typeof type === "string" ? type : JSON.stringify(type);

  if (!("@context" in block)) errors.push(`${typeLabel}: missing @context`);
  if (!("@type" in block)) errors.push(`(unknown): missing @type`);

  const types = Array.isArray(type) ? type : [type];

  if (types.includes("Article") || types.includes("NewsArticle")) {
    checkRequired(block, "headline", errors, typeLabel);
    checkRequired(block, "datePublished", errors, typeLabel);
    checkRequired(block, "author", errors, typeLabel);
    const author = block["author"] as Block | Block[] | undefined;
    const authors = Array.isArray(author) ? author : author ? [author] : [];
    for (const a of authors) {
      if (typeof a === "object" && a !== null) {
        checkRequired(a, "name", errors, `${typeLabel}.author`);
      }
    }
    const dp = block["datePublished"];
    if (typeof dp === "string" && !/^\d{4}-\d{2}-\d{2}/.test(dp)) {
      errors.push(`${typeLabel}: datePublished not ISO-shaped: ${JSON.stringify(dp)}`);
    }
  }

  if (types.includes("FAQPage")) {
    const mainEntity = block["mainEntity"];
    if (!Array.isArray(mainEntity) || mainEntity.length === 0) {
      errors.push(`FAQPage: mainEntity missing or empty`);
    } else {
      mainEntity.forEach((q: Block, i: number) => {
        if (q["@type"] !== "Question") {
          errors.push(`FAQPage.mainEntity[${i}]: @type is not "Question"`);
        }
        checkRequired(q, "name", errors, `FAQPage.mainEntity[${i}]`);
        const answer = q["acceptedAnswer"] as Block | undefined;
        if (!answer || typeof answer !== "object") {
          errors.push(`FAQPage.mainEntity[${i}]: missing acceptedAnswer`);
        } else {
          if (answer["@type"] !== "Answer") {
            errors.push(`FAQPage.mainEntity[${i}].acceptedAnswer: @type is not "Answer"`);
          }
          checkRequired(answer, "text", errors, `FAQPage.mainEntity[${i}].acceptedAnswer`);
        }
      });
    }
  }

  // Blanket leak sweep over the whole block.
  findLeaks(block, typeLabel, errors);
}

async function validatePage(page: (typeof PAGES)[number]): Promise<string[]> {
  const errors: string[] = [];
  const url = `${BASE_URL}${page.path}`;
  let html: string;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return [`fetch failed: HTTP ${res.status}`];
    }
    html = await res.text();
  } catch (e) {
    return [`fetch failed: ${(e as Error).message}`];
  }

  const raw = extractBlocks(html);
  if (raw.length === 0) {
    return [`no <script type="application/ld+json"> blocks found`];
  }

  const seenTypes = new Set<string>();
  raw.forEach((src, i) => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(src);
    } catch (e) {
      errors.push(`block ${i}: JSON.parse failed — ${(e as Error).message}`);
      return;
    }
    const blocks: Block[] = Array.isArray(parsed) ? parsed : [parsed as Block];
    for (const b of blocks) {
      const t = b["@type"];
      for (const tt of Array.isArray(t) ? t : [t]) {
        if (typeof tt === "string") seenTypes.add(tt);
      }
      validateBlock(b, errors);
    }
  });

  for (const expected of page.expect ?? []) {
    if (!seenTypes.has(expected)) {
      errors.push(`expected a ${expected} block on this page; found: ${[...seenTypes].join(", ")}`);
    }
  }

  console.log(
    `${errors.length === 0 ? "PASS" : "FAIL"}  ${page.label.padEnd(22)} ${page.path}  (${raw.length} blocks: ${[...seenTypes].join(", ")})`
  );
  for (const err of errors) console.log(`      - ${err}`);
  return errors;
}

let failed = false;
for (const page of PAGES) {
  const errors = await validatePage(page);
  if (errors.length > 0) failed = true;
}

if (failed) {
  console.error("\nJSON-LD validation FAILED.");
  process.exit(1);
}
console.log("\nJSON-LD validation passed for all pages.");
