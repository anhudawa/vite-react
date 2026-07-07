# PROPOSAL — A historical lane for facts that were true and are dated

**Status: proposal only. Nothing below is wired in. The code sketch is NOT APPLIED.**

Working document for founder review. Concerns the verification pipeline in
`lib/verification/`, the Ryf entry in `data/athletes.ts`, and the ledger render
in `app/who-wears-what/page.tsx`.

---

## 1. The problem, via Daniela Ryf

`ryf-endurance-pro` records a real, well-documented relationship: Breitling
Triathlon Squad member from 2018, Endurance Pro launch attendee, on-record
interviews through October 2020. She retired in 2024 and Breitling's current
ambassadors page no longer lists her. The desk logged that honestly — and the
pipeline reads the honesty as disqualification, three ways at once:

1. **The lapse is logged as a contradiction.** The delisting sits in
   `review.contradictionsFound`, and the adversarial-review gate requires that
   array to be empty (`gates.ts` line 125). A lapsed deal is treated exactly
   like a deal that never existed.
2. **The evidence has "gone stale" by definition.** Both sources predate the
   `POLICY.staleMediaYears: 4` window, so `liveSources()` drops them and the
   fact counts **zero** live sources — failing independent-sourcing and
   field-corroboration. But 2019–2020 reporting is precisely the right
   evidence for a 2018–2020 relationship. The staleness clock models drift in
   *current* relationships; applied to a closed one, it punishes contemporaneous
   records for being contemporaneous.
3. **Computed confidence collapses to Low**, below the High publish floor.

Net effect: a true, dated fact can never publish, no matter how good the
evidence gets. There is already a precedent for fixing this shape of problem:
`isOwnershipFact()` in `confidence.ts` exempts "Personal" facts from staleness
because *a purchase already happened*. A closed sponsorship already happened
too. This proposal generalises that precedent — with stricter conditions.

## 2. The proposed lane

Add one field and one structure to `VerifiedFact` (on `DisplayFact`, so
renders can see it):

- `temporal?: "current" | "historical"` — **default `"current"`**; every
  existing fact is untouched.
- `period?: { activeFrom; activeUntil; fromSourceIds; untilSourceIds }` —
  **required** when `temporal === "historical"`. Both bounds must be ISO
  dates, `activeUntil` must be in the past, and each bound must cite at least
  one verified `Source` by id.

Three consequences, and only three:

1. **The delisting flips from disqualifying to confirming.** "Breitling's
   page no longer lists her" stops being a contradiction of the claim and
   becomes evidence *for* `activeUntil`. Concretely: it moves out of
   `review.contradictionsFound` and into a proper `Source` entry (the dated
   capture of the ambassadors page) referenced by `period.untilSourceIds`.
   `contradictionsFound` must **still be empty** — it is reserved for things
   that contradict the claim *within its dated window* (e.g. "she was actually
   under contract elsewhere in 2019"), and those still block publication.
2. **Staleness treats within-window sources as records of the window.** The
   existing ownership exemption widens to a `isSettledFact()` predicate:
   ownership facts, plus historical facts. Sources published inside or at the
   close of the active window keep counting. Sources get no other break.
3. **Renders say past tense and show the range.** Date-range badge, past-tense
   stance label. Detail in section 4.

Everything else is untouched: two independent sources, per-field corroboration,
reference integrity, visual evidence for High, relationship clarity, the High
publish floor, dual-control sign-off, and the two-archived-snapshots
requirement in `verify:sources`.

**Honest note:** this lane does not hand Ryf a pass. Her fact has two secondary
media sources and no primary, so computed confidence tops out at Medium —
below the floor. The lane removes the *structural* impossibility; she still
needs a primary source (e.g. a Wayback capture of the 2019–2020 Breitling
squad page) and the same sign-off as everyone else.

## 3. What this must NOT allow

| Gate / check | Current fact | Historical fact | Difference |
|---|---|---|---|
| Independent sourcing (≥2) | live sources only | same count; within-window sources count as period records | staleness clock only |
| Field corroboration (≥2 per critical field) | unchanged | unchanged | none |
| Reference integrity | unchanged | unchanged | none |
| Visual evidence for High | unchanged | unchanged | none |
| Relationship clarity (typed relation) | unchanged | unchanged | none |
| Adversarial review | `contradictionsFound` empty | `contradictionsFound` empty **and** both bounds evidenced by verified sources **and** `activeUntil` in the past | *stricter*: two extra obligations |
| Confidence threshold (High floor, no over-claim) | unchanged | unchanged | none |
| Editorial sign-off (dual-control, named, dated) | unchanged | unchanged | none |
| Snapshots (`verify:sources`, ≥2 archived) | unchanged | unchanged | none |

- **No rumors relabelled "historical".** A rumor fails independent sourcing
  and corroboration in either lane; tense buys it nothing. The lane adds
  requirements, and removes only the two that mis-model closed relationships.
- **No laundering a weak current fact by backdating it.** The staleness
  exemption applies only when `activeUntil` is (a) in the past and (b)
  positively evidenced — a dated capture of the delisting, retirement
  coverage, a brand statement. You cannot claim "historical" for a
  relationship that might still be running: with no end evidence, the
  adversarial-review gate fails; with a fabricated end date, dual-control
  sign-off is where a named editor answers for it, same as today.
- **No softer floor.** Historical facts publish at High or hold in the
  workshop, like everything else.

## 4. Renders

**Ledger row** (`app/who-wears-what/page.tsx`): the fourth column is
`<span className={styles.refValue}>{value ?? ""}</span>`, fed by
`valueLine(f)`. For a historical fact the honest headline in that slot is the
range, so the row reads *Daniela Ryf · Breitling Endurance Pro · Was paid to
wear it · 2018–2020*:

- `refValue` slot renders `formatPeriod(f.period)` → `"2018–2020"` (years
  from `activeFrom`/`activeUntil`) instead of the value line. (Ryf's fact sets
  no `value` today, so nothing is lost; whether both should show when a value
  exists is Open Question 3.)
- `acquisitionOf()` in `lib/economics.ts` gains a `temporal` argument and
  past-tenses the label for historical facts: "Paid to wear it" → "Was paid
  to wear it".

**Fact Block** (`components/FactBlock.tsx`): same `acquisitionOf` change flows
through `styles.stanceLabel`; add a `period` badge beside `styles.ref` in the
header so the plate reads `Endurance Pro · 2018–2020` at a glance.

## 5. Code sketch — NOT APPLIED

Illustrative diff only; no file below has been changed.

```diff
--- lib/verification/types.ts (sketch, NOT APPLIED)
+++ lib/verification/types.ts
@@ interface DisplayFact @@
   confidence: Confidence;
   confidenceNote?: string;
+  /** Tense of the claim. "historical" = a relationship that ran and closed;
+   *  requires `period` with evidence for BOTH bounds. Default "current". */
+  temporal?: "current" | "historical";
+  period?: {
+    activeFrom: string;   // ISO
+    activeUntil: string;  // ISO, must be in the past
+    fromSourceIds: string[];  // verified Source ids establishing the start
+    untilSourceIds: string[]; // verified Source ids establishing the end
+  };

--- lib/verification/confidence.ts (sketch, NOT APPLIED)
+++ lib/verification/confidence.ts
@@ isOwnershipFact @@
+/** Settled facts already happened: ownership, and dated historical
+ *  relationships. Their contemporaneous sources are period records and
+ *  do not expire. (Callers pass this where isOwnershipFact is passed today.) */
+export function isSettledFact(fact: VerifiedFact): boolean {
+  return isOwnershipFact(fact) || fact.temporal === "historical";
+}

--- lib/verification/gates.ts (sketch, NOT APPLIED) — the one gate change
+++ lib/verification/gates.ts
@@ adversarial-review @@
     run: (fact) => {
       const { disconfirmingSearch, contradictionsFound, confusedWithRuledOut } =
         fact.review;
-      const pass = disconfirmingSearch && contradictionsFound.length === 0;
+      const base = disconfirmingSearch && contradictionsFound.length === 0;
+      if (fact.temporal !== "historical") {
+        const pass = base; /* current lane: unchanged */
+      }
+      // Historical lane: the bounds are claims too. A delisting is logged as
+      // a Source in period.untilSourceIds, NOT as a contradiction; anything
+      // contradicting the claim inside its window still blocks in `base`.
+      const p = fact.period;
+      const cites = (ids?: string[]) =>
+        !!ids?.some((id) => fact.sources.find((s) => s.id === id)?.verified);
+      const ended = !!p && Date.parse(p.activeUntil) < Date.now();
+      const pass = base && ended && cites(p?.fromSourceIds) && cites(p?.untilSourceIds);

--- app/who-wears-what/page.tsx (sketch, NOT APPLIED)
+++ app/who-wears-what/page.tsx
@@ published.map @@
-            const acq = acquisitionOf(f.relation);
-            const value = valueLine(f);
+            const acq = acquisitionOf(f.relation, f.temporal);
+            const value =
+              f.temporal === "historical" && f.period
+                ? `${f.period.activeFrom.slice(0, 4)}–${f.period.activeUntil.slice(0, 4)}`
+                : valueLine(f);
```

Migration for `ryf-endurance-pro` on adoption: `temporal: "historical"`;
`period: { activeFrom: "2018", activeUntil: "2024-…", fromSourceIds:
["timeandtide-squad-ryf"], untilSourceIds: ["breitling-ambassadors-delisting"] }`;
the delisting note leaves `contradictionsFound` and becomes that new dated
`Source`; relation stays typed ("Ambassador — …").

## 6. Open questions for the founder

1. **Does a historical fact count toward an athlete's "published" presence?**
   `publishedAthletes()` treats any publishable fact as presence — Ryf would
   sit in "Published references" beside current wrists. Fine with the badge,
   or does the ledger want a third section ("The record") for closed
   relationships?
2. **Does the Ryf entry deserve the work, or is workshop status fine?** Even
   with the lane she needs a primary source (archived squad-era Breitling
   page), two snapshots, and dual-control to reach the High floor. Is the
   first historical entry worth that desk time now, or is she the honest
   permanent resident of "In the workshop" until a second historical candidate
   makes the lane pay for itself?
3. **Ledger row: range instead of value, or both?** Sketch replaces the value
   line with "2018–2020". If a historical fact carries a `value`, should the
   row show `~£3,000 · 2018–2020`?
4. **What ends the window when the end is fuzzy?** Ryf is firm to "at least
   2020", delisted by 2026, retired 2024. Is `activeUntil: "2024"` (retirement)
   acceptable with the delisting as supporting evidence, or must we bound only
   what is directly evidenced ("2018–2020, lapsed by 2026")?
5. **Should `period` bounds require ≥2 corroborating sources** (matching
   `minCorroborationPerField`) rather than the ≥1 sketched — i.e. become a
   fifth `ClaimField`?
6. **Freshness:** should `nextReCheck()` return `null` for historical facts
   (as it does for ownership), on the grounds that a closed window cannot
   drift?
