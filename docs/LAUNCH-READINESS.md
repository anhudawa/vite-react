# Launch readiness — The Long Second

Audited 2026-07-03 against the production build (393 pages) served locally.
Browser work ran in real Chromium: Lighthouse 13 (mobile emulation), axe-core
across six representative pages in both themes, plus functional checks.

## Audit results

| Page | Perf | A11y | Best practices | SEO |
|---|---|---|---|---|
| `/` (home) | 70 | 100 | 96 | 100 |
| `/features/sixteen-years` | 95 | 100 | 100 | 100 |

- **axe-core: zero violations** — 6 pages × dark + light themes (12 runs).
- **Keyboard**: visible lume focus ring on all tab stops; skip-link first and
  functional (now with `tabindex="-1"` on `<main>` so focus moves explicitly).
- **Reduced motion**: hero renders fully as a still. Pass.
- **Mobile 375px**: 20px horizontal overflow found in the header grid — FIXED
  (`minmax(0,1fr)` middle column + tighter gap under 820px) and re-verified in
  Chromium: scrollWidth 375/375 on home and article. Pass.
- **Print stylesheet**: present, 25 rules, sources print expanded.
- **JSON-LD**: all six scripts parse; FAQPage (5 Qs) and Sources render on the
  guide page.
- **Routes**: full sweep 200s; real 404; `/essays/*` 308s carry Location; all
  AEO endpoints (`/llms.txt`, `/facts.json`, `/knowledge-graph.json`,
  `/rss.xml`, feeds, sitemap, robots) serve.

## Fixed during this audit

- Header overflow at 375px (the one launch blocker found).
- Skip-link focus polish.
- Security headers on every route: nosniff, `X-Frame-Options: DENY`,
  strict referrer, minimal Permissions-Policy.
- `app/apple-icon.png` (180×180, brand mark on Movement Black) — iOS ignores
  SVG favicons.
- Deleted six orphaned off-niche screenshots (~12MB): photography payload
  14M → 6.9M.

## Known, accepted for launch (post-launch backlog)

1. **Home perf 70** (TBT 640ms on emulated mobile; article pages are 95).
   Pointers from the report: home `page-*.js` chunk ≈1.26s script eval,
   shared chunk `2117-*` ≈1.09s, ~84KiB unused JS, four render-blocking CSS
   files (~0.6–0.7s). Fix direction: dynamic-import below-fold client
   components on the homepage; audit what pulls the big shared chunk.
2. 31/42 essays have zero inline body links (cross-linking rides on the
   related-reading module) — editorial pass.
3. One cited source lacks a Wayback capture (`verify:sources` advisory).
4. `speakable`/print CSS depend on the CSS-Modules class-name seam — a
   data-attribute would be sturdier.

## Go-live checklist (founder actions)

1. **Vercel**: create the project off this repo/branch; framework preset
   Next.js; no special build config needed (`npm run build` runs the full
   verification gauntlet as prebuild — a fact/voice/copy violation fails the
   deploy, which is by design).
2. **Environment variables** (Production):
   - `NEXT_PUBLIC_SITE_URL=https://thelongsecond.com` (canonical/OG/sitemap
     base — falls back to this value anyway, but set it explicitly and match
     the real domain).
   - `BEEHIIV_API_KEY` + `BEEHIIV_PUBLICATION_ID` — without them the subscribe
     API returns a graceful "not configured" error in production.
3. **Domain + DNS**: point thelongsecond.com at Vercel; confirm apex + www and
   the redirect between them.
4. **Post-deploy verification** (15 min):
   - Share-card check: run the homepage and one essay through the
     opengraph.xyz /社 validators; confirm the pillar motifs render.
   - `https://thelongsecond.com/sitemap.xml` loads; submit in Google Search
     Console + Bing Webmaster; verify `robots.txt` allows the AI crawlers.
   - Subscribe flow end-to-end with a real email (welcome email arrives).
   - 308: hit an old `/essays/<slug>` URL, confirm the redirect.
5. **Decide analytics** (nothing is installed — deliberate): Vercel Analytics
   is the zero-config option; Plausible/Fathom if you want cookieless
   independence. Whatever is chosen must not require a consent banner the
   design never budgeted for.
6. **Licensing**: the athlete photography (Pogačar, MvdP, Cavendish, Lucy,
   Armstrong, Tudor/Giro) still carries `unlicensed-placeholder` rights notes —
   clear before real traffic, or swap for licensed frames.

## Addendum — second pass (same day)

The "known, accepted" backlog above has since been cleared:

1. **Home perf 70 -> 90** (TBT 640ms -> 50ms, CLS 0): the footer email capture
   was hydrating on all 393 pages; it now lazy-mounts on scroll approach
   (components/LazyMount.tsx). Article template holds 93-95.
2. **Hero dial bug**: the long-second lume index at twelve had a negative SVG
   height and had never rendered. Fixed; verified in both themes.
3. **Images**: the three Lucy PNGs (5.5MB) are now sized WebP (305KB);
   photography payload 6.9M -> 2M.
4. **Inline links**: editorial pass ran across all 42 essays (wrap-only,
   verified anchors).
5. **Launch kit**: HSTS header added; web manifest added; dispatch/reviews OG
   routes fixed (were mislabelled "Feature"); all five card variants
   render-verified.

Still open for the founder: everything under "Go-live checklist" above, plus
the Wayback capture for the Cyclingnews source (archive.org rate-limits this
environment's egress IP — it is a 30-second browser task).

## Addendum — third pass (post-merge, 2026-07-03)

Two sessions worked this branch in parallel today; their work is merged,
reconciled and gauntleted (45 essays, 367 static pages, all gates green).
Added since the second pass:

1. **Verification suite is now repo infrastructure**: `npm run test:e2e`
   (17 smoke tests: routes, 308+Location, RSS well-formedness, feeds,
   404 copy, collections ordering, the who-wears-what publishing gate)
   and 14 axe a11y sweeps (7 pages × both themes, zero WCAG A/AA
   violations, harness sanity-checked against an injected violation);
   `npm run validate:jsonld` asserts every ld+json block on 6 page types.
2. **Visual pass verified and fixed**: founder portrait invisible on the
   light theme (fixed) and printing as an empty box (now prints as an ink
   stencil); OG cards dropped the "č" in Pogačar to a fallback sans
   (Satori font-key shadowing — fixed and render-verified); reduced-motion
   hero confirmed as a proper still; print PDFs verified with sources
   expanded and chrome absent.
3. **Union repair**: link-audit's registry parser missed compact one-line
   entries, silently shrinking its route space (fixed — 116 internal
   links resolve, zero orphan essays across 45); three merged-in essays
   given editorial inbound links.
4. **Trail navigation**: essays in a collection now carry a "Part of:"
   strip with prev/next through the curated order.
5. **docs/IMAGE-GAPS.md rebuilt** against the real corpus: 7/45 essays
   have lead images; the 38 gaps are batched by acquisition route —
   14 shootable at home, 5 public-domain/archive, 6 brand press kits,
   13 agency licensing.

## Go-live: what remains is the founder's

- Domain + Vercel project (set NEXT_PUBLIC_SITE_URL per environment).
- Analytics decision (none wired; privacy page currently promises none).
- Brand facts for /about, /author, facts.json (founding year, base,
  contact, real sameAs links).
- Sign-off queue (8 in-review athlete facts) + image licensing above.
- Verified spec sheets to open the reviews shelf.
- One Wayback capture (Cyclingnews source) — archive.org rate-limits this
  environment's egress; ~30 seconds in a browser.
