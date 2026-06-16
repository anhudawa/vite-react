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
npm run dev          # http://localhost:3000
npm run verify:facts # run the fact-verification gauntlet (also runs in prebuild)
npm test             # the verification test suite (node:test)
npm run build        # production build (23 routes); fails if any fact fails a gate
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

## Accuracy — the verification gauntlet

Accuracy is the brand's moat, so it is **enforced in code**, not promised. Every claim is
a `VerifiedFact` that carries its own provenance and must clear six independent gates
before it can render. Because the gates are independent, the modeled probability of a
wrong claim passing all of them is their product (~`2e-6` for a typical published fact).

Everything lives in `lib/verification/`:

| File | Role |
|------|------|
| `types.ts` | `VerifiedFact`, `Source`, `Review` — verification is *structural*; you cannot build a publishable fact without the provenance the gates require. |
| `policy.ts` | Every threshold in one place (min sources, corroboration, confidence floor, staleness) + per-gate residuals. |
| `gates.ts` | The six gates, each a pure function catching a distinct error class. |
| `confidence.ts` | Confidence **computed from evidence**, never merely asserted. |
| `references.ts` | A maker→reference-grammar registry (catches RM 67-01 vs 67-02, transposed Tudor refs). |
| `validate.ts` | `verifyFact`, `isPublishable`, and `assertPublishedFactsAreValid` (the build-time throw). |

**The six gates:** independent sourcing · field corroboration · reference integrity ·
adversarial review · confidence threshold · editorial sign-off. The public
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
5. Only when it reads `6/6 gates` may you set `status: "published"`. The build enforces it.

> Source `url`s/`excerpts` in the current seed are representative — the machinery checks
> the citations *exist and corroborate*; the human (`dual-control`) gate confirms they are
> *real and current*. Replace seed citations with editor-confirmed ones before launch.

## Other applications

- **Social/OG** — dynamic branded cards (`next/og`, `lib/og.tsx`) for the site, each essay,
  and each athlete, rendered in the brand serif (Fraunces) + mono.
- **Newsletter** — the restrained "dispatch" module (`components/Subscribe.tsx`) with a
  validating `/api/subscribe` endpoint; connect a provider where noted.
- **Quality bars** — verified WCAG 2.2 AA in both themes (axe-core, clean); Lighthouse
  perf 95+, a11y/best-practices/SEO 100, CLS 0.
