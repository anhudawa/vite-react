# The Sourcing Pipeline

> A verification gate is not a moat if a human has to feed it. This is the
> repeatable process by which a name becomes either a **published reference** or
> a **held draft with a named reason** — sourced by research, judged by the
> gauntlet, not asserted.

It is written so anyone (or any agent) on the team can run it without the
original author, and get the same standard every time.

---

## The loop, end to end

```
name → research → encode as VerifiedFact → gauntlet → permanence → publish / hold
```

### 1. Research (find, don't assume)
Search broadly, then **adversarially** — actively try to disprove the claim.
For each athlete establish three things independently:

- **watch** — the specific model (and reference, only if you can confirm it).
- **relation** — how the watch reached the wrist: one of the declared
  `RELATIONSHIP_TYPES` (Sponsored, Ambassador, Personal, Loan, Gifted,
  Team-issued, Retailer). Brand-level ambassadorships are valid *without* a
  model number; a specific model claim needs a model number.
- **evidence** — a dated/located sighting or record.

Collect **≥2 independent sources per critical field**. Independent means
different owners — not three sites syndicating one wire story. Prefer a primary
record (official page, dated photograph, filing) plus independent media.

> Real example of the gate working: research showed Jon Rahm's *documented*
> competition watch is a Sky-Dweller, while our photo showed a Datejust — so the
> specific "Rahm · Datejust" claim **fails field-corroboration** and is held. The
> brand-level "Rahm · Rolex ambassador" fact is sound. Encode what you can prove.

### 2. Encode as a `VerifiedFact`
Add the athlete to `data/athletes.ts`. Every `Source` needs `publisher`, `kind`,
`tier`, `excerpt` (the exact supporting line), `supports` (which fields it
backs), `accessedAt`, and `verified: true` only once a human has confirmed the
link resolves and the quote is real and current. Fill the `review` block: record
the disconfirming search, list look-alikes ruled out, name the approver,
`method: "dual-control"`.

### 3. Gauntlet — `npm run verify:facts`
The fact must clear all 8 gates to be `status: "published"`. If it doesn't, the
script prints the exact failing gate. Leave it `in-review`; do **not** weaken a
gate to force a pass. A held fact is the system working, not a failure.

### 4. Permanence — `npm run verify:sources`
Capture an immutable archive of every cited URL (Wayback "Save Page Now") and
record it in the source's `snapshot`. If a publisher blocks archiving (e.g.
rolex.com), mark it `"unarchivable"` — the fact must then stand on its *other*,
archivable sources. Aim for **DURABLE** (≥2 archived independent sources).

### 5. Rights — see `RIGHTS.md`
Attach a licensed image with a `credit` line. Editorial roughs
(`unlicensed-placeholder`) may not ship to the public.

### 6. Publish
Once green on all of the above, the page renders the Fact Block + the public
provenance panel automatically. Nothing renders that hasn't cleared the gauntlet
at build time and again on render.

---

## Keeping it true over time — `npm run verify:freshness`
Sources age out (`POLICY.staleMediaYears`). The freshness forecast reports which
facts are due for re-checking and the date each will fall below the corroboration
bar. Run it on a schedule and work the queue: re-confirm, add a fresh source, or
demote the fact.

## The commands
| command                     | purpose                                            |
| --------------------------- | -------------------------------------------------- |
| `npm run verify:facts`      | the 8-gate gauntlet; CI-blocking                   |
| `npm run verify:sources`    | archival permanence audit                          |
| `npm run verify:freshness`  | re-verification forecast / decay queue             |
| `npm test`                  | the verification logic test suite                  |

## The rule
Encode only what you can prove; let the gauntlet decide; archive the proof; and
when in doubt, **hold** — a held draft with a named reason is worth more than a
confident page that can't survive scrutiny.
