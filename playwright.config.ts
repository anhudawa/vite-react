import { defineConfig, devices } from "@playwright/test";

/**
 * Functional verification layer for The Long Second.
 *
 * The suite runs against a locally started production server:
 *   npx next start -p 3001
 * (the site is fully static — SSG — so no rebuild is needed between runs).
 */
export default defineConfig({
  testDir: "./tests",
  retries: 0,
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3001",
    trace: "off",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
