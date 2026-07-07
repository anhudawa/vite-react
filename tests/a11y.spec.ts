import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Accessibility sweeps (WCAG 2.x A + AA) across the site's core templates,
 * in both reading themes. The theme is bootstrapped by ThemeScript from
 * localStorage key `esc-theme` onto <html data-theme="...">, so we persist
 * the choice before navigation and the page renders natively in that theme.
 *
 * No rules are disabled and nothing is allow-listed: any violation fails.
 */

const PAGES = [
  { name: "home", path: "/" },
  { name: "feature essay", path: "/features/the-1989-tour-eight-seconds" },
  { name: "guide", path: "/guides/what-a-chronometer-actually-is" },
  { name: "collections", path: "/collections" },
  { name: "timeline", path: "/timeline" },
  { name: "who wears what", path: "/who-wears-what" },
  { name: "glossary", path: "/glossary" },
] as const;

const THEMES = ["dark", "light"] as const;

for (const theme of THEMES) {
  test.describe(`theme: ${theme}`, () => {
    for (const { name, path } of PAGES) {
      test(`${name} (${path}) has no WCAG A/AA violations`, async ({ page }) => {
        // Persist the theme the way a real reader's choice is persisted, so
        // ThemeScript applies it before first paint.
        await page.addInitScript((t) => {
          window.localStorage.setItem("esc-theme", t);
        }, theme);
        await page.goto(path, { waitUntil: "networkidle" });
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);

        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
          .analyze();

        const report = results.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          help: v.help,
          nodes: v.nodes.slice(0, 5).map((n) => n.target.join(" ")),
        }));
        expect(report, JSON.stringify(report, null, 2)).toEqual([]);
      });
    }
  });
}
