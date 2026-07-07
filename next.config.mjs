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
    // Static assets under /photography, /video and /brand are content-addressed
    // by convention: git history shows every file in those directories was
    // added under a fresh filename and none has ever been modified in place
    // (a change ships as a new name, e.g. lucy-charles-barclay-1.webp joining
    // rather than replacing). That makes a year-long immutable cache safe.
    // _next/static is deliberately left alone — Next.js sets its own headers.
    const longCache = { key: "Cache-Control", value: "public, max-age=31536000, immutable" };
    return [
      {
        source: "/:path*",
        headers: [
          // Two years, subdomains included; no preload until the domain has run
          // HTTPS-only long enough to commit to the browser preload list.
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      { source: "/photography/:path*", headers: [longCache] },
      { source: "/video/:path*", headers: [longCache] },
      { source: "/brand/:path*", headers: [longCache] },
    ];
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
