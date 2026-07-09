# The Long Second

The editorial website for **The Long Second** — a named publication on watches and
the athletes who wear them, bylined by **Anthony Walsh**. Essence: *measured release.*
(Formerly *Escapement*; renamed and given a founder/author layer — same engine.)

Built per the brand identity and build briefs: a restrained, world-class editorial
site (95% disciplined editorial restraint) with one kinetic signature — the hero
where a single second dilates: a seconds hand that slows and stretches through one
long second, then resolves.

## Stack

- **Next.js 14 (App Router) + TypeScript**, statically rendered, Vercel-ready.
- **MDX** for essays (`@next/mdx`), rendered through `mdx-components.tsx`.
- **CSS Modules + design tokens** as CSS custom properties (no Tailwind, so no
  default palette or spacing scale can leak). All tokens live in `app/globals.css`.
- Fonts via `next/font/google` (self-hosted at build, zero layout shift).

```bash
npm install
npm run dev          # http://localhost:3000
npm run verify:facts # run the fact-verification gauntlet (also runs in prebuild)
npm test             # the verification test suite (node:test)
npm run build        # production build (36 routes); fails if any fact fails a gate
npm run start        # serve the production build
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

- **The hero** — `components/hero/LongSecondHero.tsx`. A seconds hand sweeps an even
  track of sixty ticks; as it reaches twelve it slows and *stretches* — one second
  dilating, overshooting the track, the Lume glowing — then releases and resolves.
  `requestAnimationFrame`; paused off-screen via `IntersectionObserver`; never blocks
  LCP (the headline is the LCP element); reduced-motion freezes at the long second;
  real mobile composition; subtle scroll-travel.
- **The Fact Block** — `components/FactBlock.tsx`. The credibility signature: a sourced
  spec-plate (athlete / watch / relation / evidence / confidence), set largely in mono,
  with a single Lume confidence tick. Reusable across every reference page.
- **The Mark** — `components/Mark.tsx`. "The Elongated Second": a seconds track with one
  index stretched long and overshooting at twelve, in Lume. Drives the favicon, the
  masthead lockup (`Wordmark`) and the `Monogram` (TLS).
- **The author layer** — `components/Byline.tsx` + `components/AuthorModule.tsx`. The
  masthead leads; Anthony Walsh signs. A designed byline and a recurring E-E-A-T module
  (bio + mono credentials + portrait) on articles and the About page, backed by `Person`
  JSON-LD.

## Templates

- `/` — homepage with the hero, featured essays, the Fact Block reference, silo index.
- `/essays` + `/essays/[slug]` — MDX article template, a typographic showcase. Three
  real essays in the brand voice. Article + BreadcrumbList JSON-LD.
- `/who-wears-what` + `/who-wears-what/[athlete]` — athlete reference template with the
  Fact Block. The **Tadej Pogačar** page uses the real sourced facts (Richard Mille
  RM 67-02, via UAE Team Emirates). Person + BreadcrumbList JSON-LD.
- `/watches-in-sport`, `/buying-guides` — silo hubs.
- `/tag/[tag]` — topic pages generated from essay tags, with chips on each essay.
- `/search` — static client-side search over the whole corpus (`lib/search.ts`).
- `/verification` — the public account of the accuracy gauntlet (see below).
- `/colophon` — a living style guide built from the design system it documents.
- `/about` — brand story in voice, using the founder portrait asset.
- `not-found.tsx` — a real 404 with brand voice.
- `sitemap.ts`, `robots.ts`, per-template metadata, Organization/WebSite JSON-LD, and
  dynamic OG cards (`opengraph-image` per route) in the brand serif.

## Known gap — typefaces

The identity names licensed premium faces (Suisse Int'l / Söhne, GT Sectra / Canela,
Monument Mono / GT America Mono). Those licenses are not available in this environment,
so the build uses the brief's named **web fallbacks**, wired in `app/fonts.ts`:

| Voice      | Spec'd (premium)            | In use (fallback)   |
|------------|-----------------------------|---------------------|
| Grotesque  | Suisse Int'l / Söhne        | Schibsted Grotesk   |
| Serif      | GT Sectra / Canela          | Newsreader          |
| Mono       | Monument Mono / GT America  | IBM Plex Mono       |

Swapping in the licensed faces is a one-file change in `app/fonts.ts` (self-host via
`next/font/local`); the token names downstream do not change.

## Accuracy — the verification gauntlet

Accuracy is the brand's moat, so it is **enforced in code**, not promised. Every claim is
a `VerifiedFact` that carries its own provenance and must clear eight independent gates
before it can render. Because the gates are independent, the modeled probability of a
wrong claim passing all of them is their product (~`9e-8` for a typical published fact).

Everything lives in `lib/verification/`:

| File | Role |
|------|------|
| `types.ts` | `VerifiedFact`, `Source`, `Review` — verification is *structural*; you cannot build a publishable fact without the provenance the gates require. |
| `policy.ts` | Every threshold in one place (min sources, corroboration, confidence floor, staleness) + per-gate residuals. |
| `gates.ts` | The eight gates, each a pure function catching a distinct error class. |
| `confidence.ts` | Confidence **computed from evidence**, never merely asserted. |
| `references.ts` | A maker→reference-grammar registry (catches RM 67-01 vs 67-02, transposed Tudor refs). |
| `validate.ts` | `verifyFact`, `isPublishable`, and `assertPublishedFactsAreValid` (the build-time throw). |

**The eight gates:** independent sourcing · field corroboration · reference integrity ·
visual evidence · relationship clarity · adversarial review · confidence threshold ·
editorial sign-off. The public
[`/verification`](app/verification/page.tsx) page explains them, generated from the live
gate definitions so it can never drift from the code.

**Enforcement is layered — wrong information cannot ship:**

- **Build-time** — `prebuild` runs `verify:facts`, and the athlete route calls
  `assertPublishedFactsAreValid` at module load. Either one fails `next build`.
- **CI** — `.github/workflows/ci.yml` runs the gate, tests, and build on every PR. Under
  branch protection, a fact that fails a gate blocks the merge.
- **Runtime** — pages render only `publishableFacts()`; a fact's `status` is never trusted
  on its own.
- **Visible** — every Fact Block carries a `FactProvenance` disclosure (gates, sources,
  computed confidence, the accountable editor). Held claims sit in "the workshop",
  honestly labelled, never shown as fact.

### Adding a verified athlete

1. Add an `AthleteRef` to `data/athletes.ts`. Start the fact at `status: "in-review"`.
2. Attach **≥2 independent, verified sources**, each with the exact `url` + `excerpt` and
   the claim `supports` it corroborates. A party to the relationship (maker/team) does not
   independently corroborate that a watch was *worn* — add media/photo evidence for that.
3. Fill `review`: perform a disconfirming search, rule out look-alikes, then set
   `approvedBy` / `approvedAt` / `method: "dual-control"`.
4. Run `npm run verify:facts`. It prints exactly which gates fail and why.
5. Only when it reads all gates green (`8/8`) may you set `status: "published"`. The
   build enforces it.

> Source `url`s/`excerpts` in the current seed are representative — the machinery checks
> the citations *exist and corroborate*; the human (`dual-control`) gate confirms they are
> *real and current*. Replace seed citations with editor-confirmed ones before launch.

## Other applications

- **Social/OG** — dynamic branded cards (`next/og`, `lib/og.tsx`) for the site, each essay,
  and each athlete, rendered in the brand serif (Newsreader) + mono.
- **Newsletter** — the restrained "dispatch" module (`components/Subscribe.tsx`) with a
  validating `/api/subscribe` endpoint; connect a provider where noted.
- **Quality bars** — verified WCAG 2.2 AA in both themes (axe-core, every route clean);
  Lighthouse perf 95+, a11y/best-practices/SEO 100, CLS 0.

## Deploy

Zero-config on **Vercel** — import the repo and it just builds.

- **Build command:** `npm run build` (Vercel's default). `prebuild` runs the fact gate
  first, so a deploy fails fast if any published fact fails verification.
- **Node:** 20+ (`.github/workflows/ci.yml` pins 20; local dev tested on 22).
- **Environment variables:** none required today. Add the newsletter provider's key when
  wiring `/api/subscribe`, and set `NEXT_PUBLIC_SITE_URL` if you want canonical/OG URLs to
  match the production domain (defaults live in `lib/site.ts`).
- **CI / branch protection:** `.github/workflows/ci.yml` runs the gauntlet, tests and
  build on every PR. Turn on branch protection for `main` requiring the **CI** check so a
  failing or unverified fact can never merge.

### Before first launch

- Replace the representative seed citations with editor-confirmed `url`s + `excerpts`.
- Swap in the licensed typefaces in `app/fonts.ts` if/when available.
- Confirm the domain + social handles, then set `NEXT_PUBLIC_SITE_URL`.
