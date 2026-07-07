# Sign-off queue — in-review athlete facts

Prepared 2026-07-07 for A. Walsh. One card per held fact in `data/athletes.ts`.
Work the cards top to bottom; each ends with a literal checklist and the exact
edit to make on approval.

**The referee is `npm run verify:facts`.** A fact renders only when
`status: "published"` AND every check in `lib/verification/gates.ts` passes at
build time. Flipping status early is safe: the build refuses to ship a
published fact that fails a check and prints exactly which one
(`lib/verification/validate.ts`, `assertPublishedFactsAreValid`). It costs a
failed deploy, never a wrong page.

## What publishing actually requires (read before ticking anything)

From `lib/verification/gates.ts` + `policy.ts` + `confidence.ts`, and the
permanence audit in `scripts/verify-sources.mts`:

1. **A source only counts once `verified: true`** — you confirmed the link
   resolves and the excerpt is accurate and current. Every source in this
   queue is currently `verified: false`, which is why the verifier shows
   "0 independent, verified, live source(s)" on all of them.
2. **Secondary sources must be dated and recent.** A `tier: "secondary"`
   source with no `publishedAt`, or one older than 4 years
   (`POLICY.staleMediaYears`), does not count toward corroboration at all.
   `tier: "primary"` sources never age out. Several cards below are blocked by
   this: their media coverage is from 2019–2020.
3. **Two independent sources overall, and two per critical field** (`watch`,
   `relation`, `evidence`). Independent means different publishers — two
   Breitling pages count as one.
4. **Computed confidence must reach High** (the publish floor). In practice:
   at least two counted independent sources, one of them primary.
5. **A fact rated High needs a verified photo or video source** on file.
6. **Dual-control sign-off**: `review.method: "dual-control"`, a named
   `approvedBy`, a valid ISO `approvedAt`.
7. **Permanence** (`npm run verify:sources`, hard-fails the build): a
   published fact needs **at least two archived** sources — a Wayback
   `snapshot` on the source entry. `"unarchivable"` pages (Breitling, Tudor,
   Richard Mille block the crawler) and physical photos don't count toward
   the two; the archives must come from the media citations.

Consequence, stated plainly: **no fact in this queue publishes on sign-off
alone.** Each needs at least some data work (dates, snapshots, a logged photo
source, or a new independent source). Three of them — Pidcock, Ryf,
Dauwalter — cannot publish regardless, by design. Per-fact detail below.

## The queue at a glance

| Fact | Claim | Verdict tonight |
|---|---|---|
| `cavendish-rm011` | Cavendish — RM 011 — Ambassador | Hold. Needs a reference decision + fresh corroboration + archives + sign-off |
| `cavendish-rm6702` | Cavendish — RM 67-02 — Ambassador | Hold. No source supports `relation`; wrist attribution open |
| `lucy-endurance-pro` | Charles-Barclay — Endurance Pro 38 — Ambassador | Near. Needs the photo logged as a source + one non-Breitling source + archives + sign-off |
| `frodeno-endurance-pro` | Frodeno — Endurance Pro 44 — Ambassador | Hold. 2020 media has aged out of corroboration; needs fresh sources + a photo |
| `ryf-endurance-pro` | Ryf — Endurance Pro — Ambassador (historical) | Cannot publish. Logged contradiction + no policy lane for lapsed sponsorships |
| `pidcock-draft` | Pidcock — (undetermined) | Cannot publish. Single tertiary forum mention; held on purpose |
| `laidlow-endurance-pro` | Laidlow — Endurance Pro 44 — Ambassador | Nearest of all. One dated photo + two Wayback captures + dates + sign-off |
| `dauwalter-tudor` | Dauwalter — Tudor (model unconfirmed) — Ambassador | Cannot publish until a reference is documented on her wrist |

---

## 1. `cavendish-rm011` — Mark Cavendish — Richard Mille RM 011 (Felipe Massa) — Ambassador (race-day loan)

Stated confidence: **Medium**. Confidence note on file: the relationship is
authoritative (the brand's own page); the specific RM 011 reference is from
watch media and our read of the photo, not yet visually dual-confirmed.

**Sources**

| id | Publisher | Tier / kind | URL | Supports | State |
|---|---|---|---|---|---|
| `rm-ambassador-page` | Richard Mille | primary / official | https://www.richardmille.com/friends-and-partners/mark-cavendish | athlete, relation | unverified; `unarchivable` |
| `timeandtide-cav-rm` | Time+Tide | secondary / media | https://timeandtidewatches.com/mark-cavendish-richard-mille/ | watch, evidence | unverified; **no `publishedAt`** (doesn't count until dated); no snapshot |
| `photo-dimension-data` | On-file race photograph | primary / photo | — (physical) | athlete, watch | unverified; Dimension Data kit, green bar tape, carbon skeleton RM on the wrist |

**Look-alikes already ruled out / flagged**: carbon RM 011 variants look
alike — the exact execution is not yet visually dual-confirmed (this is the
open item, recorded in `confusedWithRuledOut`).

**Still required to publish** (verifier findings, 3/8 checks passing):

- Your sign-off (name + date + dual-control) — see edit block.
- `verified: true` on each source after you confirm it.
- **Reference decision**: `"RM 011"` fails the Richard Mille reference
  grammar in `lib/verification/references.ts` (pattern expects `NN-NN`, e.g.
  67-02). Two honest options: (a) set `reference: undefined` — the fact then
  passes as a brand-level claim while the watch string still names the model;
  or (b) extend the registry pattern to admit the RM 011 family — a code
  change, not paperwork. Pinning a different-looking modern reference the
  photo can't support is not an option.
- `publishedAt` on the Time+Tide piece. If it predates 2022-07 (likely — it
  covers the 2016 gift) it still won't count, and `watch` + `evidence` need a
  fresh or primary source instead.
- `relation` needs a **second** independent source (only the RM page supports
  it). The Watchfinder piece cited on the RM 67-02 card covers his Richard
  Milles broadly — if it genuinely supports this claim too, attach it here
  with a date and snapshot.
- The photo can also support `evidence` if you confirm it is dated and
  located — extend its `supports` array when you do.
- **Two Wayback snapshots** among the web sources (RM page is unarchivable,
  the photo is physical, so both media citations need captures).

**Founder checklist**

- [ ] Sources opened and confirmed live
- [ ] Excerpts match what the pages actually say
- [ ] Look-alikes reviewed (exact RM 011 execution pinned from the photo)
- [ ] Approve as published / [ ] Hold

**Exact edit on approval** (in `data/athletes.ts`, fact `cavendish-rm011`):

```ts
status: "published",              // was "in-review"
reference: undefined,             // OR keep "RM 011" and extend the registry — decide first
review: {
  ...,                            // keep disconfirmingSearch, confusedWithRuledOut
  method: "dual-control",         // was "single"
  approvedBy: "A. Walsh",
  approvedAt: "2026-07-07",
},
// per source you confirmed:
verified: true,
publishedAt: "YYYY-MM-DD",        // secondary sources: mandatory, must be within 4 years
snapshot: { archivedUrl: "https://web.archive.org/web/<stamp>/<url>", capturedAt: "2026-07-07" },
```

Then `npm run verify:facts` — if anything still fails it names the check.

---

## 2. `cavendish-rm6702` — Mark Cavendish — Richard Mille RM 67-02 — Ambassador (race-day loan)

Stated confidence: **Medium**. Confidence note on file: the RM 67-02
attribution is from watch media; in our 2021 celebration photo the watch is
clearly an orange-and-black RM, but whose wrist it is in the embrace needs the
original full frame to confirm.

**Sources**

| id | Publisher | Tier / kind | URL | Supports | State |
|---|---|---|---|---|---|
| `watchfinder-cav-rm` | Watchfinder | secondary / media | https://www.watchfinder.co.uk/articles/richard-mille-for-mark-cavendish | watch, evidence | unverified; **no `publishedAt`**; no snapshot |
| `photo-green-jersey` | On-file race photograph | **secondary** / photo | — (physical) | watch | unverified; undated; wrist attribution unresolved |

**Look-alikes already ruled out / flagged**: whose wrist in the celebration
embrace — needs the original full-frame photo to confirm it is Cavendish's
(recorded, still open).

**Still required to publish** (4/8 checks passing — reference "RM 67-02" is
valid, relationship typed, adversarial review clean):

- Your sign-off — but sign-off is the smallest gap here.
- **`relation` has zero supporting sources.** Attach the RM ambassador page
  (already cited on the RM 011 card) plus one independent outlet.
- The full-frame original of the 2021 photo, confirming the wrist; then
  `verified: true`, a `publishedAt` (2021-07), and re-tier it `primary` so it
  never ages out. Extend `supports` to `athlete` + `evidence` if the frame
  shows it.
- `publishedAt` on Watchfinder — if older than 2022-07 it won't count and
  `watch`/`evidence` need fresher or primary corroboration.
- Two Wayback snapshots among the web sources.
- Confidence floor: needs two counted independent sources including a
  primary — the confirmed photo closes that.

**Founder checklist**

- [ ] Sources opened and confirmed live
- [ ] Excerpts match
- [ ] Look-alikes reviewed (wrist attribution settled from the full frame)
- [ ] Approve as published / [ ] Hold

**Exact edit on approval** (fact `cavendish-rm6702`):

```ts
status: "published",
review: {
  ...,
  method: "dual-control",         // was "single"
  approvedBy: "A. Walsh",
  approvedAt: "2026-07-07",
},
// photo-green-jersey, once the full frame confirms the wrist:
tier: "primary",                  // was "secondary" — physical evidence, never stale
publishedAt: "2021-07-09",        // the actual date of the frame
verified: true,
// watchfinder-cav-rm and any added relation sources:
verified: true,
publishedAt: "YYYY-MM-DD",
snapshot: { archivedUrl: "...", capturedAt: "2026-07-07" },
```

---

## 3. `lucy-endurance-pro` — Lucy Charles-Barclay — Breitling Endurance Pro 38 — Ambassador (Triathlon Squad)

Stated confidence: **High**. Confidence note on file: relationship and watch
are authoritative (Breitling's own pages); held only to confirm the exact
execution in our images and apply the desk sign-off.

**Sources**

| id | Publisher | Tier / kind | URL | Supports | State |
|---|---|---|---|---|---|
| `breitling-ambassador-lucy` | Breitling | primary / official | https://www.breitling.com/us-en/about/ambassadors/lucy-charles-barclay/ | athlete, relation | unverified; `unarchivable` |
| `breitling-triathlon-squad` | Breitling | primary / official | https://www.breitling.com/gb-en/about/squads/triathlon/ | athlete, relation | unverified; `unarchivable`; **same publisher — counts as one with the page above** |
| `revolution-endurance-pro-38` | Revolution | secondary / media | https://revolutionwatch.com/breitling-endurance-pro-38/ | watch, evidence | unverified; **no `publishedAt`**; no snapshot |

**Look-alikes already ruled out / flagged**: Endurance Pro 38 vs the 44 mm
execution — confirm which she wears in the on-file images (open; this decides
whether the fact says "38").

**Still required to publish** (3/8 checks passing):

- Your sign-off.
- `verified: true` on the three sources; `publishedAt` + snapshot on
  Revolution.
- **A photo source must be logged.** The fact is rated High, and that rating
  demands a verified photo or video source — three images are on file
  (`lucy-charles-barclay-1/2/3`, see the athlete's notes) but none is entered
  as a source. Once the 38-vs-44 call is made, add one as
  `kind: "photo", tier: "primary"` with a date, supporting `watch` (and
  `evidence` if dated/located). This also closes half of the corroboration
  gap.
- **One more independent (non-Breitling) source** supporting `relation` and
  ideally `evidence` — the two Breitling pages collapse to a single publisher,
  so relation currently corroborates 1×, and the floor is 2×.
- Two Wayback snapshots: the Breitling pages can't be captured, so the
  archives must be Revolution + the new source.
- Rights: the images are `unlicensed-placeholder` — licence before the page
  carries them (RIGHTS.md; separate from the fact machinery but same launch).

**Founder checklist**

- [ ] Sources opened and confirmed live
- [ ] Excerpts match
- [ ] Look-alikes reviewed (38 vs 44 settled against the images)
- [ ] Approve as published / [ ] Hold

**Exact edit on approval** (fact `lucy-endurance-pro`):

```ts
status: "published",
review: {
  ...,
  method: "dual-control",         // was "single"
  approvedBy: "A. Walsh",
  approvedAt: "2026-07-07",
},
// existing sources you confirmed: verified: true
// revolution-endurance-pro-38: add publishedAt + snapshot
// NEW source entry (the on-file image, once execution is confirmed):
{
  id: "photo-lucy-endurance-pro",
  publisher: "On-file photograph",
  kind: "photo",
  tier: "primary",
  publishedAt: "YYYY-MM-DD",
  accessedAt: "2026-07-07",
  excerpt: "Dated image: Charles-Barclay with the Endurance Pro 38 visible on the wrist.",
  supports: ["athlete", "watch"],
  verified: true,
},
// NEW independent media source supporting relation (+ evidence), dated within
// 4 years, with a Wayback snapshot.
```

---

## 4. `frodeno-endurance-pro` — Jan Frodeno — Breitling Endurance Pro 44 — Ambassador (Triathlon Squad, founding member)

Stated confidence: **High**. Confidence note on file: relationship and watch
are authoritative (Breitling's pages plus a named CEO quote in press); the
pre-2020 squad watch was the Superocean Automatic 44 IRONMAN edition — don't
backdate the Endurance Pro.

**Sources**

| id | Publisher | Tier / kind | URL | Supports | State |
|---|---|---|---|---|---|
| `breitling-ambassador-frodeno` | Breitling | primary / official | https://www.breitling.com/us-en/about/ambassadors/jan-frodeno/ | athlete, relation, watch | unverified; `unarchivable` |
| `sharp-endurance-pro-kern` | Sharp Magazine | secondary / media | https://sharpmagazine.com/2020/08/26/breitling-endurance-pro/ | relation, evidence | unverified; article is Aug 2020 — **outside the 4-year media window even once dated** |
| `timeandtide-triathlon-squad` | Time+Tide | secondary / media | https://timeandtidewatches.com/why-does-the-breitling-triathlon-squad-exist/ | relation, evidence | unverified; covers the 2019 squad formation — **almost certainly stale too** |

**Look-alikes already ruled out**: Superocean Automatic 44 IRONMAN Limited
Edition — the 2019 squad-era watch, distinct from the Endurance Pro (launched
Aug 2020). Done and recorded.

**Still required to publish** (3/8 checks passing) — the honest problem: the
best story here (Kern crediting Frodeno's design input) lives in 2020 media,
and the staleness policy ages that out of corroboration. It can stay in the
prose as history; it cannot carry the published claim.

- Your sign-off.
- **Fresh corroboration**: at least one, realistically two, independent
  sources dated after 2022-07 (or additional primary records) supporting
  `watch`, `relation`, `evidence` — each needs 2× and Breitling only counts
  once.
- **A verified photo/video source** — the High rating demands one; none is
  logged and no image is on file for Frodeno at all.
- Two Wayback snapshots among the counted web sources.

**Founder checklist**

- [ ] Sources opened and confirmed live
- [ ] Excerpts match (including the Kern quote)
- [ ] Look-alikes reviewed (Superocean era kept separate)
- [ ] Approve as published / [ ] Hold

**Exact edit on approval** (fact `frodeno-endurance-pro`): same shape as the
cards above — `status: "published"`, `review.method: "dual-control"`,
`approvedBy: "A. Walsh"`, `approvedAt: "2026-07-07"`, `verified: true` +
`publishedAt` + `snapshot` per confirmed source, plus the new photo source
entry and the fresh media entries. Run `npm run verify:facts` after.

---

## 5. `ryf-endurance-pro` — Daniela Ryf — Breitling Endurance Pro — Ambassador (Triathlon Squad, 2018 to at least 2020, historical)

Stated confidence: **Medium**. Confidence note on file: relationship firmly
sourced for 2018–2020; Breitling's current page no longer lists her and she
retired in 2024 — a dated, historical relationship, and the entry must say so.

**Sources**

| id | Publisher | Tier / kind | URL | Supports | State |
|---|---|---|---|---|---|
| `timeandtide-squad-ryf` | Time+Tide | secondary / media | https://timeandtidewatches.com/why-does-the-breitling-triathlon-squad-exist/ | athlete, relation | unverified; 2019-era subject — stale under the 4-year window |
| `aeworld-ryf-interview` | A&E Magazine | secondary / media | https://aeworld.com/watches-jewellery/watches/triathlete-and-ironman-world-champion-daniela-ryf-on-striving-to-be-her-best/ | relation, evidence | unverified; Oct 2020 interview — stale under the 4-year window |

**Look-alikes already ruled out**: pre-2020 squad imagery shows the
Superocean Automatic 44 IRONMAN edition, not the Endurance Pro — eras kept
separate. Done.

**Cannot go published, even with sign-off.** Three structural blocks:

1. `review.contradictionsFound` carries the (correct, honest) note that
   Breitling's current ambassadors page no longer lists her. The adversarial
   check requires that list to be **empty** — and the policy has no lane for
   a lapsed sponsorship. The only staleness carve-out is for relations
   beginning "Personal" (a purchase already happened; a brand deal can end).
2. Both sources are secondary and 2019–2020 era — neither counts as live
   corroboration, and there is no primary source at all.
3. No source supports `watch` (0× against a 2× floor), and the Medium rating
   sits below the High publish floor.

**Options, both deliberate decisions rather than paperwork**: (a) keep it in
the workshop as the ledger's first explicitly historical entry — the athlete
notes already frame it that way and the workshop displays it honestly; or
(b) change policy — add a dated/historical lane to `lib/verification` the way
ownership facts already have one. That is a code and standards decision for a
clear-headed morning, not tonight.

**Founder checklist**

- [ ] Sources opened and confirmed live (for the record, even though it holds)
- [ ] Excerpts match
- [ ] Look-alikes reviewed
- [ ] Hold (publishing is not currently possible) / [ ] Schedule the policy discussion

**No approval edit exists for this card.** Flipping it to published fails the
build on the adversarial check, by design.

---

## 6. `pidcock-draft` — Tom Pidcock — (undetermined watch) — "Reportedly brand-affiliated"

Stated confidence: **Low**. This entry exists to demonstrate the system
withholding a claim; the source comments in `data/athletes.ts` say exactly
that ("it demonstrates the withholding behaviour and must never render as
fact").

**Sources**

| id | Publisher | Tier / kind | URL | Supports | State |
|---|---|---|---|---|---|
| `forum-post` | Watch forum thread | **tertiary** / media | — | athlete only | unverified; "a forum poster claims to have spotted a watch; no image, no follow-up" |

**Look-alikes ruled out**: none — there is nothing yet to rule out.

**Cannot go published, even with sign-off.** Failing six of eight checks:
zero counted sources; zero corroboration on all critical fields; the relation
("Reportedly brand-affiliated") is not one of the declared types; no
disconfirming search was recorded; Low confidence against a High floor; no
sign-off. A signature fixes exactly one of those six.

**Publish path, if it ever firms up**: identify the watch; type the relation
(or log it explicitly as "Unverified"); two independent sources per critical
field with dates and archives; disconfirming search; then the normal queue.
Until then it stays where it is — the held card is the standard working.

**Founder checklist**

- [ ] Hold (nothing to approve)

---

## 7. `laidlow-endurance-pro` — Sam Laidlow — Breitling Endurance Pro 44 — Ambassador (Triathlon Squad)

Not on tonight's named list, but in review in the data and **the nearest to
publishable in the whole queue** — three distinct publishers, one of them
recent. Stated confidence: **High**.

**Sources**

| id | Publisher | Tier / kind | URL | Supports | State |
|---|---|---|---|---|---|
| `breitling-ambassador-laidlow` | Breitling | primary / official | https://www.breitling.com/gb-en/about/ambassadors/sam-laidlow/ | athlete, relation, watch | unverified; `unarchivable` |
| `laidlow-own-sponsors` | samlaidlow.com | primary / official | https://samlaidlow.com/en/pages/sponsors | relation | unverified; archivable, no snapshot |
| `watchilove-squad-2024` | Watch I Love | secondary / media | https://watchilove.com/2024/07/breitling-endurance-pro-in-44-and-38-mm/ | relation, evidence | unverified; July 2024 — **inside the window once `publishedAt` is set**; no snapshot |

**Look-alikes flagged**: IRONMAN limited editions (titanium 2025 WC,
Breitlight 70.3) share the Endurance Pro name — reference-level claims need
the specific photo. Recorded.

**Still required to publish**:

- Your sign-off.
- `verified: true` ×3; `publishedAt: "2024-07-.."` on the Watch I Love piece.
- **One verified, dated photo source** supporting `watch` + `evidence` — this
  single addition satisfies the High-rating visual requirement AND closes
  both fields to 2×.
- Wayback snapshots for samlaidlow.com and watchilove.com (that's the two
  archives the permanence audit demands; Breitling can't be captured).

**Founder checklist**

- [ ] Sources opened and confirmed live
- [ ] Excerpts match
- [ ] Look-alikes reviewed (exact execution pinned before any reference-level claim)
- [ ] Approve as published / [ ] Hold

**Exact edit on approval** (fact `laidlow-endurance-pro`): `status:
"published"`; `review.method: "dual-control"`, `approvedBy: "A. Walsh"`,
`approvedAt: "2026-07-07"`; `verified: true` on all three sources;
`publishedAt` on Watch I Love; `snapshot: { archivedUrl, capturedAt }` on
samlaidlow.com and watchilove.com; plus the new photo source entry (same
shape as the Lucy card's).

---

## 8. `dauwalter-tudor` — Courtney Dauwalter — Tudor (model unconfirmed) — Ambassador (announced 9 June 2026)

Also in review in the data. Stated confidence: **Medium**, and the
confidence note is candid: the relationship is strong (brand page + wire
release + independent coverage, all June 2026); the WATCH is the open
question — Tudor names no model.

**Sources**: Tudor "Hits the Trail" announcement (primary, unarchivable),
PR Newswire wire release (secondary), Canadian Running coverage (secondary) —
all supporting `relation`/`athlete`, all unverified, none dated in the data.

**Look-alikes flagged**: her Suunto Race S Titanium signature GPS watch will
be on the wrist in nearly every race photo — never caption the Suunto as a
Tudor. Recorded.

**Cannot go published until a reference is documented.** No source supports
`watch` or `evidence` (0× against 2× floors), because there is nothing to
support yet. Sign-off changes nothing. Publish path: a documented Tudor
reference on her wrist (dated photo + media naming the model), then dates,
snapshots, and the normal queue. Until then this is a strong entry waiting
for its subject.

**Founder checklist**

- [ ] Hold (watch the wire for the first model sighting)

---

## Housekeeping the queue surfaced (not tonight's work)

1. **Reference registry gaps** (`lib/verification/references.ts`): Breitling
   and the RM 011-era grammar are not in the registry — Breitling references
   currently pass on generic plausibility with a flag, and "RM 011" fails
   outright. Worth adding both properly.
2. **Registry alias quirk**: the verifier reports Dauwalter's brand-level
   claim as "(Richard Mille)" because the "RM" alias substring-matches inside
   the word "unconfi**rm**ed" in her watch string. Harmless today (the check
   passes either way, and a Tudor rule exists) but the alias match should be
   word-bounded.
3. **Shared sources**: the RM ambassador page for Cavendish legitimately
   supports `relation` on both his facts — cite it on both rather than
   hunting a new relation source for the RM 67-02 card.
4. **Rights**: Cavendish and Lucy images are `unlicensed-placeholder` —
   licence or replace before their pages go public (RIGHTS.md), independent
   of the fact machinery.
