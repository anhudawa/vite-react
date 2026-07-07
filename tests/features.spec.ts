import { test, expect, type Page } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Verification for features shipped after the original smoke suite:
 * the /essays filter explorer, the TrailStrip, the homepage start-here band,
 * /accessibility, glossary→essay bridges, full-content RSS, section OG images,
 * and the web manifest. Runs against `npx next start -p 3001`.
 */

/** Shape of /feeds/articles.json — the machine-readable list of every essay. */
interface FeedArticle {
  url: string;
  pillar: string | null;
}

/**
 * Chip clicks only work once React has hydrated; a click that lands before
 * hydration is silently dropped (the fallback renders the same chips with no
 * handler). Retry click-then-assert until the pressed state actually flips.
 */
async function pressChip(page: Page, group: string, label: string) {
  const chip = page
    .locator(`[role="group"][aria-label="${group}"]`)
    .getByRole("button", { name: label, exact: true });
  await expect(async () => {
    await chip.click();
    await expect(chip).toHaveAttribute("aria-pressed", "true", { timeout: 1000 });
  }).toPass({ timeout: 15_000 });
}

test.describe("essays explorer", () => {
  test("filter chips render and a pillar chip filters the list + updates ?pillar=", async ({
    page,
    request,
  }) => {
    // Ground truth: every essay and its pillar, from the machine feed.
    const feedRes = await request.get("/feeds/articles.json");
    expect(feedRes.status()).toBe(200);
    const articles: FeedArticle[] = (await feedRes.json()).articles;
    const heritageCount = articles.filter((a) => a.pillar === "heritage").length;
    expect(heritageCount).toBeGreaterThan(0);
    expect(heritageCount).toBeLessThan(articles.length);

    await page.goto("/essays");

    // Both chip rows render, with an "All" chip pressed by default.
    const pillarGroup = page.locator('[role="group"][aria-label="Filter by pillar"]');
    const modeGroup = page.locator('[role="group"][aria-label="Filter by mode"]');
    await expect(pillarGroup).toBeVisible();
    await expect(modeGroup).toBeVisible();
    for (const label of ["Mechanical", "Instrument of effort", "Heritage", "Buying & owning", "Dispatches"]) {
      await expect(pillarGroup.getByRole("button", { name: label, exact: true })).toBeVisible();
    }
    await expect(
      pillarGroup.getByRole("button", { name: "All", exact: true })
    ).toHaveAttribute("aria-pressed", "true");
    expect(await page.locator("main article").count()).toBe(articles.length);

    // Click the Heritage chip: list narrows to exactly the heritage essays…
    await pressChip(page, "Filter by pillar", "Heritage");
    await expect(page.locator("main article")).toHaveCount(heritageCount);
    await expect(page.locator('[aria-live="polite"]')).toHaveText(
      `${heritageCount} of ${articles.length}`
    );
    // …and every visible card links to a heritage essay.
    const visibleHrefs = await page
      .locator("main article a[href^='/']")
      .evaluateAll((els) => els.map((el) => el.getAttribute("href")));
    const heritagePaths = new Set(
      articles.filter((a) => a.pillar === "heritage").map((a) => new URL(a.url).pathname)
    );
    for (const href of visibleHrefs) expect(heritagePaths.has(href!)).toBe(true);

    // The filter is written back to the URL (shareable state).
    expect(new URL(page.url()).searchParams.get("pillar")).toBe("heritage");

    // And it round-trips: a fresh navigation to ?pillar= initialises filtered.
    await page.goto("/essays?pillar=heritage");
    await expect(page.locator("main article")).toHaveCount(heritageCount);
  });

  test("without JS, the prerendered HTML still carries every essay link", async ({
    request,
  }) => {
    const feedRes = await request.get("/feeds/articles.json");
    const articles: FeedArticle[] = (await feedRes.json()).articles;
    expect(articles.length).toBeGreaterThan(40);

    // Raw HTML fetch — no browser, no hydration, no client-side filtering.
    const res = await request.get("/essays");
    expect(res.status()).toBe(200);
    const html = await res.text();
    for (const a of articles) {
      const path = new URL(a.url).pathname;
      expect(html, `prerendered /essays HTML must link ${path}`).toContain(
        `href="${path}"`
      );
    }
  });
});

test.describe("trail strip", () => {
  test("an essay in a collection shows the strip with resolving prev/next", async ({
    page,
    request,
  }) => {
    // the-1989-tour-eight-seconds sits mid-trail in the-records-canon.
    await page.goto("/features/the-1989-tour-eight-seconds");
    const strip = page.locator("nav[data-article-trail]");
    await expect(strip).toBeVisible();
    await expect(strip).toHaveAttribute("aria-label", "Reading trail");

    // Names its collection and links to the trail page.
    const collectionLink = strip.locator('a[href="/collections/the-records-canon"]');
    await expect(collectionLink).toBeVisible();
    await expect(collectionLink).toHaveText("The Records Canon");

    // Mid-trail: both a prev and a next step, and both resolve 200.
    for (const rel of ["prev", "next"] as const) {
      const link = strip.locator(`a[rel="${rel}"]`);
      await expect(link, `trail strip must offer a ${rel} step`).toHaveCount(1);
      const href = await link.getAttribute("href");
      expect(href).toMatch(/^\//);
      const res = await request.get(href!);
      expect(res.status(), `${rel} step ${href} must resolve`).toBe(200);
    }
  });
});

test.describe("homepage start-here band", () => {
  test("links to /collections/start-here and /find-your-watch", async ({ page }) => {
    await page.goto("/");
    const band = page.locator('section[aria-labelledby="start-here-h"]');
    await expect(band).toBeVisible();
    await expect(band.locator("#start-here-h")).toHaveText(/new here\?/i);
    await expect(band.locator('a[href="/collections/start-here"]')).toBeVisible();
    await expect(band.locator('a[href="/find-your-watch"]')).toBeVisible();
  });
});

test.describe("accessibility statement", () => {
  test("/accessibility renders", async ({ page }) => {
    const res = await page.goto("/accessibility");
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toContainText("Accessibility");
    await expect(page.getByRole("heading", { name: "The standard" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "How it is tested" })).toBeVisible();
  });

  test("the footer links to it from every page", async ({ page }) => {
    await page.goto("/");
    const footerLink = page.locator('footer a[href="/accessibility"]');
    await expect(footerLink).toBeVisible();
    await expect(footerLink).toHaveText("Accessibility");
  });
});

test.describe("glossary essay bridge", () => {
  test("/glossary/escapement shows 'Read the piece' resolving 200", async ({
    page,
    request,
  }) => {
    await page.goto("/glossary/escapement");
    await expect(page.locator("h1")).toContainText("Escapement");

    const bridge = page.locator("p", { hasText: "Read the piece" }).first();
    await expect(bridge).toBeVisible();
    const link = bridge.locator("a");
    await expect(link).toHaveCount(1);
    const href = await link.getAttribute("href");
    expect(href).toMatch(/^\//);
    const res = await request.get(href!);
    expect(res.status()).toBe(200);
  });
});

test.describe("rss full content", () => {
  test("/rss.xml carries <content:encoded> CDATA bodies for > 40 items", async ({
    request,
  }) => {
    const res = await request.get("/rss.xml");
    expect(res.status()).toBe(200);
    const xml = await res.text();

    expect(xml).toContain("xmlns:content=\"http://purl.org/rss/1.0/modules/content/\"");
    const items = xml.match(/<item>/g) ?? [];
    const encoded = xml.match(/<content:encoded><!\[CDATA\[/g) ?? [];
    expect(items.length).toBeGreaterThan(40);
    // Every item carries a CDATA-wrapped full body.
    expect(encoded.length).toBe(items.length);
    // The bodies are real HTML, not empty shells.
    expect(xml).toMatch(/<content:encoded><!\[CDATA\[<p>/);
  });
});

test.describe("section opengraph images", () => {
  for (const path of ["/collections/opengraph-image", "/timeline/opengraph-image"]) {
    test(`${path} returns 200 image/png`, async ({ request }) => {
      const res = await request.get(path);
      expect(res.status()).toBe(200);
      expect(res.headers()["content-type"]).toContain("image/png");
      const body = await res.body();
      // PNG magic bytes — it really is an image, not an error page.
      expect(body.subarray(0, 8)).toEqual(
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
      );
    });
  }
});

test.describe("web manifest", () => {
  test("/manifest.webmanifest returns the app manifest", async ({ request }) => {
    const res = await request.get("/manifest.webmanifest");
    expect(res.status()).toBe(200);
    const manifest = JSON.parse(await res.text());
    expect(manifest.name).toBe("The Long Second");
    expect(Array.isArray(manifest.icons)).toBe(true);
    expect(manifest.icons.length).toBeGreaterThan(0);
  });
});

test.describe("error boundary", () => {
  // A route-level error boundary can't be triggered by navigation against a
  // static production build (nothing throws on demand), so runtime behaviour
  // isn't exercised here. Instead: assert the boundary exists and is wired the
  // way Next.js requires — a client component whose default export takes reset().
  test("app/error.tsx exists and is a client-side boundary with reset()", () => {
    const file = join(process.cwd(), "app", "error.tsx");
    expect(existsSync(file), "app/error.tsx must exist").toBe(true);
    const src = readFileSync(file, "utf8");
    expect(src).toMatch(/^\s*["']use client["']/);
    expect(src).toContain("export default function");
    expect(src).toContain("reset");
  });
});
