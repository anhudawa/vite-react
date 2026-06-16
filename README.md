# Escapement

The editorial website for **Escapement** — a media brand at the intersection of
endurance athletes and fine watches. Essence: *measured release.*

Built per the brand identity and build briefs: a restrained, world-class editorial
site (95% disciplined editorial restraint) with one kinetic signature — a living
lever-escapement hero.

## Stack

- **Next.js 14 (App Router) + TypeScript**, statically rendered, Vercel-ready.
- **MDX** for essays (`@next/mdx`), rendered through `mdx-components.tsx`.
- **CSS Modules + design tokens** as CSS custom properties (no Tailwind, so no
  default palette or spacing scale can leak). All tokens live in `app/globals.css`.
- Fonts via `next/font/google` (self-hosted at build, zero layout shift).

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (16 static routes)
npm run start    # serve the production build
```

## Design system (single source of truth)

`app/globals.css` holds the entire token layer, extracted verbatim from the identity:

- **Colour** — Movement Black `#16181B`, Graphite `#2A2D31`, Steel `#8B9095`,
  Bone `#F2EEE6`, Lume `#C2D24A` / glow `#D8F26A`, Brass `#9E8455` (physical only).
- **Dark (Movement Black) and Light (Bone)** reading modes, both first-class, set
  pre-paint with no flash (`components/ThemeScript.tsx`) and toggled per user choice.
- **Three type voices, never more**: a grotesque (UI/body), a high-contrast editorial
  serif (the soul), a technical mono (specs, the Fact Block). See the font gap below.
- **Motion** — custom mechanical easing curves; `prefers-reduced-motion` respected
  globally and given a deliberate still composition, not a token fallback.

## Signature pieces

- **The hero** — `components/hero/EscapementHero.tsx`. A genuine lever escapement
  (escape wheel + pallet fork + balance/hairspring) rendered in SVG and animated with
  `requestAnimationFrame`: lock → impulse → drop, the wheel advancing tooth by tooth at
  a slowed ~1.4 Hz, the Lume glowing on the pallet jewels at the instant of impulse.
  Pauses off-screen via `IntersectionObserver`; never blocks LCP (the headline is the
  LCP element); reduced-motion gets a frozen, composed instant; real mobile composition.
- **The Fact Block** — `components/FactBlock.tsx`. The credibility signature: a sourced
  spec-plate (athlete / watch / relation / evidence / confidence), set largely in mono,
  with a single Lume confidence tick. Reusable across every reference page.
- **The Mark** — `components/Mark.tsx`. An ownable glyph built from escapement geometry
  (escape-wheel teeth + pallet-fork anchor). Drives the favicon (`app/icon.svg`).

## Templates

- `/` — homepage with the hero, featured essays, the Fact Block reference, silo index.
- `/essays` + `/essays/[slug]` — MDX article template, a typographic showcase. Three
  real essays in the brand voice. Article + BreadcrumbList JSON-LD.
- `/who-wears-what` + `/who-wears-what/[athlete]` — athlete reference template with the
  Fact Block. The **Tadej Pogačar** page uses the real sourced facts (Richard Mille
  RM 67-02, via UAE Team Emirates). Person + BreadcrumbList JSON-LD.
- `/watches-in-sport`, `/buying-guides` — silo hubs.
- `/about` — brand story in voice, using the founder portrait asset.
- `not-found.tsx` — a real 404 with brand voice.
- `sitemap.ts`, `robots.ts`, per-template metadata, Organization/WebSite JSON-LD.

## Known gap — typefaces

The identity names licensed premium faces (Suisse Int'l / Söhne, GT Sectra / Canela,
Monument Mono / GT America Mono). Those licenses are not available in this environment,
so the build uses the brief's named **web fallbacks**, wired in `app/fonts.ts`:

| Voice      | Spec'd (premium)            | In use (fallback)   |
|------------|-----------------------------|---------------------|
| Grotesque  | Suisse Int'l / Söhne        | Schibsted Grotesk   |
| Serif      | GT Sectra / Canela          | Fraunces (variable) |
| Mono       | Monument Mono / GT America  | IBM Plex Mono       |

Swapping in the licensed faces is a one-file change in `app/fonts.ts` (self-host via
`next/font/local`); the token names downstream do not change.

## Accuracy note

Accuracy is the brand's moat. Only relationships sourced to publication standard ship as
published reference pages; everything else is held, honestly labelled, in "the workshop."
