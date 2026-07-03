import createMDX from "@next/mdx";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ESSAYS_DIR = join(dirname(fileURLToPath(import.meta.url)), "content", "essays");
const MODE_SECTION = { feature: "features", guide: "guides", review: "reviews", dispatch: "dispatch" };

// Legacy /essays/<slug> URLs now live under their editorial mode. Emit real HTTP
// 308s (with a Location header) from next.config so crawlers and direct hits —
// not just in-app clicks — land on the canonical route. Mode is read straight
// from each piece's frontmatter so this stays correct as content is added.
function legacyEssayRedirects() {
  let files = [];
  try {
    files = readdirSync(ESSAYS_DIR).filter((f) => f.endsWith(".mdx") && !f.startsWith("_draft"));
  } catch {
    return [];
  }
  return files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const src = readFileSync(join(ESSAYS_DIR, file), "utf8");
    const m = src.match(/mode:\s*["'](\w+)["']/);
    const section = MODE_SECTION[m?.[1]] ?? "features";
    return { source: `/essays/${slug}`, destination: `/${section}/${slug}`, permanent: true };
  });
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return legacyEssayRedirects();
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
