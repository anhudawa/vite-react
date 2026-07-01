# v2 build log — overnight run

## Sprint — 30-item swarm run (2026-07-01)

All six waves complete. 25 -> 42 essays, 195 -> 392 pages, all gates green.

- **Content fleets:** 17 essays shipped through research -> adversarial verify ->
  batch critic -> line editor -> hand integration (fleet 1's first run died at the
  structured-output gate, ~345k tokens lost; relaunched on a file-drop protocol,
  now the house pattern). One draft cut as a corpus near-duplicate
  (the-two-watch-life, rebuild-around-the-handover logged as backlog).
  Glossary 18 -> 34 terms.
- **Code waves A-C:** /timeline, /collections (4 trails), /coverage (noindex),
  /feeds + /rss.xml, From-the-Record band, computed related-reading + link:graph,
  search 39 -> 92 docs with keyboard nav, per-pillar OG motifs (now on all four
  mode routes), print stylesheet, Sources block + speakable/citation schema,
  KG event entities, corpus stock-phrase linter (in prebuild, ceilings ratcheted).
- **Editorial:** thesis de-dup executed — the-same-machine keeps the finite-reserve
  resonance (sole canonical), what-it-costs re-cut in its own cost register,
  Lance paraphrases the manifesto line. Diffs presented for founder veto.
- **Ledger:** Frodeno + Ryf staged in-review (Ryf as the first dated historical
  entry). Kipchoge/Ingebrigtsen GPS deals verified but HELD OUT (GPS = demoted
  thread); Blummenfelt/Iden correctly needs-more/reject. Sign-off queue: 5.
- **AEO:** targetQuery + intent on all 42 essays.
- **Adversarial QA sweep findings, all fixed:** /collections + /feeds were
  unreachable (nav/sitemap/footer wired); one citation-attribution mismatch in
  the-overbuilt-watch (claims cut to what sources carry); 3 new-batch orphans
  given inbound links; dispatch/reviews OG routes added; 11 templated emailOffers
  varied; empty reviews feed labelled honestly.
- **Deliberate:** pillar "dispatch" vs mode "feature" on the-autobus /
  no-one-at-the-line is intended (pillar = territory, mode = format).
- **Backlog from QA:** 31/42 essays have zero inline body links (relatedSlugs
  carries all cross-linking) — a contextual-linking editorial pass; one source
  needs a Wayback capture; speakable/print rely on the CSS-Modules class-name
  seam (a data-attribute would be sturdier).


Working through the v2 roadmap slices autonomously. Newest first.

## Slice 5 — roadmap compliance pass (fact-safe gaps)
- **F.3 content model** extended to spec: `tldr`, `targetQuery`, `intent`,
  `relatedSlugs`, `watchesMentioned`, `dateModified`, `excerpt` (all optional).
- **D.3 answer-first `tldr`** wired into Article schema `description` + the
  articles feed (values backfilled progressively — agent pass next).
- **Dispatch → `NewsArticle`** schema; `dateModified` flows to schema.
- **Knowledge graph**: `mentions_watch` (from `watchesMentioned`) and
  `related_to` (from `relatedSlugs`) edges added; feed carries both.
- **F.6 stubs**: `/membership` (Phase-2 gated-content hook, noindex) and `/shop`
  (commerce stub carrying the D.6 trust-firewall comment, noindex).
- **Content**: GPS-vs-mechanical bridge (#15, the one permitted GPS piece) added
  to P4. P4 (owning) now has 2 pieces.
- Still blocked on your **verified specs**: reviews (#9/#11), `/best`, `/compare`,
  `/watch/[brand]/[model]`. Routes/templates ready; content waits on specs.

## Content QA — editorial findings (your call in the morning)

A final as-a-set read of all 13 essays. Per-piece voice is good and the heritage
fact-discipline is exemplary (Gleitze/Everest/lineage invent nothing). The set's
real issue is batch-level repetition — surface this is your editorial call, so I
fixed only the one unambiguous item and am flagging the rest:

1. **Signature-move overuse (TOP ITEM).** The watch↔endurance "finite reserve /
   same machine / metering" resonance is the *spine* of FOUR features —
   the-same-machine, the-sweep-and-the-surge, the-instrument-of-effort,
   what-it-costs-to-keep-time — not the "once a quarter" VOICE.md allows. Read
   back-to-back they hit the same revelation repeatedly. And **the-same-machine
   closes on the watch-as-body metaphor** (a banned closer) — defensible only if
   it's the *sole* canonical resonance piece. Recommendation: pick ONE as
   canonical (the-same-machine is the natural choice) and re-end / de-emphasise
   the resonance in the other three so they earn their keep on a different hook;
   the publish dates already stagger (Apr/May/Jun), which helps. This is a voice
   judgement about your own thesis essays, so I did NOT unilaterally rewrite them.
2. **Recurring stock phrases** across the set: "the receipt" (×3), "metered out"
   (×3), "record of a moment that cost years". Worth de-duping when you do #1.
3. **Field guide** was the thinnest/most repetitive — I merged its two restating
   closing sections into one (committed). Still the lightest piece; consider
   folding further into the thesis it overlaps.
4. Fact-pipeline note: the live named claims (Pogačar / van der Poel · Richard
   Mille RM 67-02) ride in features, not the heritage three — they're already in
   the verified-fact store (verify:facts passes), but worth a glance.

Disposition: 5 publish-ready as-is (Gleitze, Everest, lineage, water-resistance,
automatic-vs-manual); 5 light-edit; 2 need your call (same-machine closer,
field-guide depth).

## QA pass (post slice 1–4) — fixes applied
- **BLOCKER fixed:** `/essays/<slug>` redirects were SSG-rendered (Next 14 bakes
  no `Location` header → broken for crawlers/direct hits). Moved to
  `next.config.mjs` `redirects()` (reads each piece's mode from frontmatter) — now
  a real 308 with `Location`. Removed the SSG redirect page; moved per-article OG
  images to the mode routes (`components/article/ogImage.tsx`).
- Article breadcrumb now points at the piece's **pillar hub** (`/topics/<pillar>`)
  instead of `/essays`, in both the visible nav and the BreadcrumbList schema.
- `facts.json`: removed unverified placeholders (foundingYear/location/contact) —
  no machine-readable guesses for an LLM to quote. (Bottleneck #1 still open.)
- CollectionPage hubs now enumerate members as an `ItemList`.
- Sitemap adds `/author/anthony-walsh`; KG is 18 entities / 20 edges.
- Independent QA verdict before fixes: build/test/gates green, no dead links,
  AEO endpoints valid, heritage pieces invent no facts.

## Niche decision — track & field (locked)
- **IN, and core:** distance/endurance running — the mile, 1500m, 5,000m, 10,000m,
  steeplechase, the marathon and the records canon. The purest "long second"
  (sustained suffering against the clock); already lives under "running". Now
  embraced explicitly in facts.json `covers`. Seeded with the four-minute-mile
  feature; rich backlog (Bannister done; Kipchoge sub-2 / the Hour Record / the
  marathon records canon to come).
- **OUT:** explosive athletics — 100m/200m, hurdles, jumps, throws (the compressed
  second, outside the brand's authentic endurance authority). Named in facts.json
  `doesNotCover`. Noah Lyles / Fraser-Pryce / Duplantis NOT added.
- **Bridge only (demote like GPS):** athletics *timing* heritage — Omega's Olympic
  timekeeping, photo finish, hand-timed vs electronic, finals by thousandths. One
  occasional dispatch, never a pillar. BACKLOG, not built.

## Status

| Slice | Scope | State |
| --- | --- | --- |
| 1 | Pillar spine + content model + route taxonomy | ✅ done |
| 2 | AEO / AI-legibility layer | ✅ done |
| 3 | Trust + entity scaffolding (author, editorial-standards, glossary) | ✅ done |
| 4 | Launch content (mechanical/heritage, verified-fact only) | ✅ first wave done |

## Slice 4 — first wave (4 pieces, fact-disciplined)
- `the-instrument-of-effort` (P2 feature) — the manifesto. Conceptual, my own
  voice, no external specs.
- `mercedes-gleitze-and-the-oyster` (P3 feature) — built ONLY on the roadmap's
  EVIDENCE BASE facts (Channel 7 Oct 1927, Vindication Swim 21 Oct 1927, Oyster,
  Daily Mail ad, first sporting ambassador). Honest crossing-vs-vindication
  correction in-prose. No invented specifics.
- `everest-1953-the-watch-and-the-record` (P3 feature) — the honest-myth piece on
  provided facts (Hillary/Tenzing 29 May 1953; Smiths credited at summit; Rolex
  summit claim = marketing). Contested specifics flagged in-prose, not asserted.
- `the-chronograph-for-athletes` (P2 **guide**) — exercises the new guide mode:
  answer-first lede, FAQ section + **FAQPage schema**, conceptual (no model
  specs/prices). 5 Q&A.
- New `faq` field on the model + FAQ rendering/schema in ArticleView.
- All four route correctly (/features, /guides), populate their /topics hubs,
  and flow into feeds + knowledge graph + sitemap. Reading times recomputed.
  Build + voice:check + qa:copy green.

### Slice 4 — second wave (P1 mechanical, fact-safe conceptual)
- `automatic-vs-manual-wind` (P1 guide, FAQ) — conceptual, no model specs.
- `water-resistance-for-swimmers` (P1 guide, FAQ) — ratings stated only as hedged
  conventions (per the glossary), no invented standard/ISO clause/models.
- `the-one-watch-question` (P1 feature) — conceptual.
- P1 hub now populated. Content footprint: 11 pieces — mechanical 3, instrument 4,
  heritage 3, owning 1, dispatch 0.

### Slice-4 notes / for the morning
- **No lead images** on the four new pieces (we have no rights-clear imagery for
  Gleitze/Everest, and I won't use a wrong photo). They render fine without one.
  → supply imagery, or leave imageless.
- These publish on the roadmap's provided facts (bottleneck #4). Gleitze uses
  "an afternoon and a night" as evocative duration (not a stated time); Everest
  flags contested specifics rather than asserting them. Confirm you're happy, or
  I'll hold them behind a draft flag.
- Reviews + best-for + watch-entity pages NOT built — they need verified spec
  sheets (bottleneck #2). Next wave once you supply specs.

## Slice 3 — done
- `/author/anthony-walsh` — Person entity (knowsAbout spanning endurance + watches,
  jobTitle, sameAs, credentials, authored-writing list). Article author.url now
  points here.
- `/editorial-standards` — AboutPage: what we check, how we handle uncertainty,
  the commercial firewall, and the corrections log (empty state for now). Plain
  language, no verification-as-pitch (passes qa:copy).
- `/glossary` + `/glossary/[term]` — DefinedTermSet / DefinedTerm, 18 terms
  (agent-written, tsc-clean, accurate, voice-checked).
- Footer nav + llms.txt updated with Glossary, Standards, author entity.

## Slice 2 — done
- `robots.ts`: explicit allow for GPTBot/OAI-SearchBot/ClaudeBot/anthropic-ai/
  PerplexityBot/Google-Extended/CCBot/Applebot-Extended + sitemap + host.
- `/llms.txt` (route handler): brand one-liner, pillar taxonomy, AEO priority
  categories (reference/guides/features), entity links, feed pointers. Internal
  links UTM-tagged `?utm_source=llms-txt&utm_medium=ai-crawler`.
- `/facts.json`: brand facts (name, covers, doesNotCover, founder, sameAs) —
  foundingYear/location/partnershipContact are placeholders (bottleneck #1).
- `/knowledge-graph.json`: 14 entities (person/topic/article/brand/watch) + 12
  typed edges (authored_by, about_topic, wears, wears_watch), built from content.
- Feeds: `/feeds/{articles,topics,watches,reviews}.json`, pillar as a top field.
- `lib/kg.ts` builds them all from the collections. All static, build-green,
  endpoints verified.

## Slice 1 — done
- Content model: `Pillar` + `ArticleMode` on `EssayMeta`; `lib/pillars.ts` (5 hubs).
- `/topics` index + `/topics/[pillar]` hubs (CollectionPage schema).
- Route taxonomy: `/features /guides /reviews /dispatch /[slug]` via a shared
  `ArticleView` + `modeRoute` helper. The 4 live essays serve at `/features/*`.
- `/essays/[slug]` 308-redirects to the canonical mode route (safety net for any
  missed link). `/essays` index kept as the writing archive.
- All internal links routed through `essayHref()` (ArticleCard, search, topics,
  sitemap) or updated (watches-in-sport, buying-guides). Verified: redirect +
  styling intact (screenshot).

## BOTTLENECKS — need Anthony's answer (proceeding with sensible defaults meanwhile)

1. **Brand facts for `facts.json` / `/author` / `/editorial-standards`.** I need:
   founding year, base location (EU — country?), public contact email for
   partnerships, and the founder's real `sameAs` URLs (X/Instagram/Strava/
   LinkedIn) + any credentials to cite. → Using placeholders, flagged in-file.
2. **Reviews need verified specs.** Black Bay 58 / Pelagos (and any review) need a
   confirmed spec sheet (movement, power reserve, WR, diameter, price band). I
   will NOT fabricate specs. → Writing the feature/heritage pieces that are
   argument- or provided-fact-driven; scaffolding reviews as drafts with null
   specs + a "needs verification" flag, not publishing them.
3. **Primary nav.** Header nav still lists the old silos (Who Wears What, Watches
   in Sport, Buying Guides, Essays). v2 implies pillars (/topics) are primary.
   Restructure the header to the pillars, or keep the current nav + Topics in the
   footer? → Left as-is for now.
4. **Heritage facts confidence.** I'm writing Gleitze/Oyster and the Everest-myth
   pieces from the roadmap's EVIDENCE BASE (Gleitze Channel 7 Oct 1927, Vindication
   Swim 21 Oct 1927, Rolex Oyster, first sporting ambassador; Everest 1953 Smiths
   credited first to summit, Rolex tie largely marketing). Confirm you're happy
   for these to publish on those provided facts, or hold for your source check.
5. **Quartz in the quiz** (from re-centering): `Recommendation.movement` is
   `mechanical | gps` only, so the F-91W seasoning lives in the buyers-guides, not
   the quiz. Widen the type to include `quartz` if you want it in the quiz.
6. **Affiliate URLs** across quiz + guides are blank pending your fill (existing
   FOUNDER REVIEW flag).
