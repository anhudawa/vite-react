# The Long Second — 7-Day Sprint, Collapsed with Agent Swarms

A roadmap for finishing the build, structured two ways: as a human-paced
seven-day plan, and as a swarm-orchestrated run that compresses the ungated
~80% into a few hours of orchestrated wall-clock.

The honest framing first: **three of the seven days are gated on founder
inputs** (verified spec sheets, real brand facts, editorial taste calls). No
amount of parallelism manufactures those — they are the critical path. The
swarm compresses *work*, not *decisions*.

## The 7-day plan (human-paced)

| Day | Theme | Deliverables | Gating |
|---|---|---|---|
| 1 | Trust spine + IA | Finalize `facts.json` / About / author / editorial-standards with real brand facts; restructure header nav to the pillars; corrections log live | 🔴 brand facts (founding year, location, contact, `sameAs`) + nav call |
| 2 | Reference ledger | Research + gauntlet-verify 8–12 athlete↔watch pairings; stage in-review; promote the clean ones | 🟡 founder sign-off to publish |
| 3 | Reviews + entity layer | Build `/reviews`, `/best`, `/compare`, `/watch/[brand]/[model]` from verified spec sheets | 🔴 verified specs |
| 4 | Content breadth | Fill thin pillars — mechanical & owning guides, the athletics-timing bridge dispatch, more features | 🟢 autonomous (fact-disciplined) |
| 5 | Editorial QA + voice | Fix thesis-essay repetition (one canonical resonance piece, re-end the others), stock-phrase dedup, internal-link/`relatedSlugs` pass, extend guardrail | 🟡 taste call on the manifesto essays |
| 6 | AEO / SEO / graph | Expand knowledge-graph entities+edges, FAQ-schema coverage, `targetQuery`/`intent` backfill, OG images, sitemap/feeds | 🟢 autonomous |
| 7 | Polish + ship | Lighthouse 95+, WCAG 2.2 AA, image pipeline, full adversarial QA swarm + fix list | 🟢 autonomous |

## Collapsed into ≤24h with agent swarms

~80% of the work is embarrassingly parallel: independent content units, each
needing the same pipeline — **draft → adversarially fact-verify → voice/qa
lint → register**. That is a textbook fan-out.

**Phase A — Unblock & scaffold (serial, ~20 min).** Apply founder inputs
(brand facts, nav decision, spec sheets). Everything downstream keys off this.

**Phase B — Parallel content fleet (fan-out, ~10–16 agents).** One agent per
piece, each running research → write → adversarial verify (2–3 refuters per
fact, default-to-reject) → self voice-check → return MDX. Writes to the shared
`registry.ts` are the one conflict point — serialized merge stage (or git
worktrees per agent), never parallel edits.

**Phase C — Reviews/entity build (pipeline, gated on Phase A specs).** Per
watch: spec-corroborate → write → verify → wire `/compare` + `/best` links.

**Phase D — QA + AEO sweep (dimensional fan-out).** Reviewers split by
dimension (fact-discipline, voice/slop, a11y, schema validity, dead links,
internal-linking); each finding verified by an independent skeptic before it
makes the fix list.

**Phase E — Final gauntlet (serial, ~20 min).** Full `prebuild` (verify:facts
+ voice:check + qa:copy) + production build + Lighthouse. Ship.

**Realistic wall-clock:** the ungated ~80% runs in roughly 3–6 hours of
orchestrated wall-clock. Concurrency caps at ~16 agents, so a 30-piece fleet
runs in 2–3 waves.

## What does NOT collapse, and why it matters

- **Verified specs and brand facts** are *inputs*, not work — the founder's
  critical path. Provide them and Days 1/3 unblock instantly.
- **Editorial taste calls** (thesis-essay repetition) — executed by agents,
  but the "which piece is canonical" judgment is the founder's.
- **Published sign-off** on athlete facts — the gauntlet *requires* a named
  editor; everything stages in-review until then.
- The swarm does not lower the quality bar — it raises it: running 3
  adversarial refuters per fact is cheap in parallel and catches more than a
  single pass.
