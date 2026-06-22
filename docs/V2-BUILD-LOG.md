# v2 build log — overnight run

Working through the v2 roadmap slices autonomously. Newest first.

## Status

| Slice | Scope | State |
| --- | --- | --- |
| 1 | Pillar spine + content model + route taxonomy | ✅ done |
| 2 | AEO / AI-legibility layer | ✅ done |
| 3 | Trust + entity scaffolding (author, editorial-standards, glossary) | ✅ done |
| 4 | Launch content (mechanical/heritage, verified-fact only) | ⏳ in progress |

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
