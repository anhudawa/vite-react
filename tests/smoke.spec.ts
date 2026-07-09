import { test, expect } from "@playwright/test";
import { collections } from "../data/collections";

/**
 * Functional smoke suite for The Long Second.
 * Runs against a production server: `npx next start -p 3001`.
 */

test.describe("home", () => {
  test("renders the h1 and hero", async ({ page }) => {
    await page.goto("/");
    const h1 = page.locator("h1#hero-title");
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(/watches athletes wear/i);
    await expect(page.locator('section[aria-labelledby="hero-title"]')).toBeVisible();
  });
});

test.describe("essays index", () => {
  test("/essays lists entries", async ({ page }) => {
    await page.goto("/essays");
    await expect(page.locator("h1")).toContainText("Essays");
    const entries = page.locator("main article");
    expect(await entries.count()).toBeGreaterThan(10);
    // Every entry links somewhere real.
    const firstLink = entries.first().locator("a").first();
    await expect(firstLink).toHaveAttribute("href", /^\//);
  });
});

test.describe("feature route", () => {
  test("/features/the-1989-tour-eight-seconds renders title (+ sources when declared)", async ({
    page,
  }) => {
    await page.goto("/features/the-1989-tour-eight-seconds");
    const title = page.locator("h1[data-article-title]");
    await expect(title).toBeVisible();
    await expect(title).toHaveText("Eight Seconds");
    // Sources block is conditional per-essay; if rendered it must carry links.
    const sources = page.locator("[data-article-sources]");
    if ((await sources.count()) > 0) {
      expect(await sources.locator("a[href^='http']").count()).toBeGreaterThan(0);
    }
  });

  test("a feature with declared sources renders the sources block", async ({ page }) => {
    // four-laps-no-hiding declares a sources array in its meta; the block must render.
    await page.goto("/features/four-laps-no-hiding");
    const sources = page.locator("[data-article-sources]");
    await expect(sources).toBeAttached();
    await expect(sources.locator("#sources-h")).toHaveText(/sources/i);
    expect(await sources.locator("a[href^='http']").count()).toBeGreaterThan(0);
  });
});

test.describe("guide route", () => {
  test("/guides/what-a-chronometer-actually-is renders the FAQ", async ({ page }) => {
    await page.goto("/guides/what-a-chronometer-actually-is");
    await expect(page.locator("h1[data-article-title]")).toHaveText(
      "What a Chronometer Actually Is"
    );
    const faq = page.locator('section[aria-labelledby="faq-h"]');
    await expect(faq).toBeVisible();
    expect(await page.locator("[data-article-faq-item]").count()).toBeGreaterThan(0);
  });
});

test.describe("legacy essay redirect", () => {
  test("/essays/<feature-slug> returns 308 with Location to /features/...", async ({
    request,
  }) => {
    const res = await request.get("/essays/the-1989-tour-eight-seconds", {
      maxRedirects: 0,
    });
    expect(res.status()).toBe(308);
    expect(res.headers()["location"]).toContain(
      "/features/the-1989-tour-eight-seconds"
    );
  });
});

test.describe("collections", () => {
  test("/collections lists every trail in the data", async ({ page }) => {
    await page.goto("/collections");
    await expect(page.locator("h1")).toContainText("Collections");
    const trailLinks = page.locator('main a[href^="/collections/"]');
    const hrefs = await trailLinks.evaluateAll((els) =>
      els.map((el) => el.getAttribute("href"))
    );
    const unique = [...new Set(hrefs)];
    // Count and membership come from the data itself, so a new collection
    // can never make this assertion stale.
    expect(unique).toHaveLength(collections.length);
    expect(unique).toEqual(
      expect.arrayContaining(collections.map((c) => `/collections/${c.slug}`))
    );
  });

  test("/collections/the-records-canon renders its numbered order", async ({ page }) => {
    await page.goto("/collections/the-records-canon");
    await expect(page.locator("h1")).toContainText("The Records Canon");
    const indices = page.locator('ol[class*="collection_trail"] [class*="collection_index"]');
    const labels = await indices.allTextContents();
    expect(labels.length).toBeGreaterThanOrEqual(2);
    // Strictly ascending 01, 02, 03, ... with no gaps.
    expect(labels).toEqual(
      labels.map((_, i) => String(i + 1).padStart(2, "0"))
    );
    // Every numbered entry links to an article.
    const entryLinks = page.locator('ol[class*="collection_trail"] li a[href^="/"]');
    expect(await entryLinks.count()).toBeGreaterThanOrEqual(labels.length);
  });
});

test.describe("timeline", () => {
  test("/timeline renders entries", async ({ page }) => {
    await page.goto("/timeline");
    await expect(page.locator("h1")).toContainText("Timeline");
    const entries = page.locator('[class*="timeline_entry"]');
    expect(await entries.count()).toBeGreaterThan(3);
    await expect(entries.first().locator('[class*="timeline_title"]')).toBeVisible();
  });
});

test.describe("search", () => {
  test("/search page loads with the search input", async ({ page }) => {
    await page.goto("/search");
    await expect(page.locator("h1")).toContainText("Search");
    await expect(page.locator('input[type="search"]#q')).toBeVisible();
  });
});

test.describe("feeds and machine surfaces", () => {
  test("/rss.xml is 200, application/rss+xml, and well-formed XML", async ({
    request,
    page,
  }) => {
    const res = await request.get("/rss.xml");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("application/rss+xml");
    const xml = await res.text();
    expect(xml.trim().length).toBeGreaterThan(0);
    // Well-formedness via the browser's strict XML parser.
    await page.goto("/");
    const parseError = await page.evaluate((src) => {
      const doc = new DOMParser().parseFromString(src, "application/xml");
      const err = doc.querySelector("parsererror");
      return err ? err.textContent : null;
    }, xml);
    expect(parseError).toBeNull();
    expect(xml).toContain("<rss");
    expect(xml).toContain("<item>");
  });

  for (const path of ["/feeds/articles.json", "/facts.json", "/knowledge-graph.json"]) {
    test(`${path} returns valid JSON`, async ({ request }) => {
      const res = await request.get(path);
      expect(res.status()).toBe(200);
      expect(res.headers()["content-type"]).toContain("application/json");
      const body = await res.text();
      const parsed = JSON.parse(body); // throws (fails test) if invalid
      expect(parsed).toBeTruthy();
      expect(typeof parsed).toBe("object");
    });
  }

  test("/llms.txt returns 200", async ({ request }) => {
    const res = await request.get("/llms.txt");
    expect(res.status()).toBe(200);
    expect((await res.text()).trim().length).toBeGreaterThan(0);
  });
});

test.describe("404", () => {
  test("bogus route renders the brand not-found copy", async ({ page }) => {
    const res = await page.goto("/this-route-does-not-exist-xyz");
    expect(res?.status()).toBe(404);
    await expect(page.locator("h1")).toContainText("The spring ran out here.");
    await expect(page.getByText(/Error 404/)).toBeVisible();
  });
});

test.describe("who wears what", () => {
  test("/who-wears-what renders the published references only", async ({ page }) => {
    await page.goto("/who-wears-what");
    await expect(page.locator("h1")).toContainText("Who Wears What");
    const links = page.locator('main a[href^="/who-wears-what/"]');
    const hrefs = [...new Set(await links.evaluateAll((els) =>
      els.map((el) => el.getAttribute("href"))
    ))];
    // Only the two published athletes are listed.
    expect(hrefs.sort()).toEqual([
      "/who-wears-what/mathieu-van-der-poel",
      "/who-wears-what/tadej-pogacar",
    ]);
    // The published watch reference itself appears on the index.
    await expect(page.getByText("RM 67-02").first()).toBeVisible();
    // In-review athletes never leak onto the public index.
    expect(hrefs).not.toContain("/who-wears-what/tom-pidcock");
  });
});
