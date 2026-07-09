# Tomorrow — the founder's checklist

Everything below needs you; nothing below needs more than your home computer.
Ordered by leverage per minute. The machine has done everything on its side:
48+ essays, all gates green, CI green on GitHub's runners, zero type errors,
QA-swarmed twice, tested end to end.

## 1. Brand facts — 2 minutes, unlocks the trust pages
Open `data/brand.ts`. Six nullable TODO fields at the top (founding year,
base location, contact email, social sameAs links). Paste real values; the
About page, author page, facts.json, Person/Organization schema all light up
automatically. Nothing ships a placeholder until you do this.

## 2. Sign-off queue — ~20 minutes with a pen
`docs/SIGNOFF-QUEUE.md` — all 8 in-review athlete facts, each with sources,
rule-outs, and exactly what publishing requires. The doc is current as of the
QA sweep. Priority order:
- **Laidlow** (nearest: needs a dated photo source + 2 snapshots + your sign-off)
- **Cavendish RM 67-02** (primary RM partner page attached; needs an
  independent second + the wrist-attribution call)
- **Lucy** (needs an on-file image logged as a photo source + one
  non-Breitling source)
- Frodeno (2020 press has aged past the freshness window — needs fresher
  corroboration), Ryf (blocked pending your call on item 4), Pidcock (held by
  design), Cavendish RM 011, Dauwalter (needs a documented reference).
Each card ends with the mechanical edit to make on approval.

## 3. Three verdicts — one word each
- **The Endurance Pro review** (`content/essays/the-breitling-endurance-pro-review.mdx`,
  unregistered, no route): "approve" and I register it — the reviews shelf
  opens with a fully verified piece. "Veto" and it stays a demonstrator.
- **The Dalin piece** (`/features/sixty-four-days` when built): read it before
  any deploy — it handles a death from three weeks ago; the register is
  memorial, but it should carry your eyes.
- **The historical-facts proposal** (`docs/PROPOSAL-HISTORICAL-FACTS.md`):
  six open questions at the end; the big one is whether the ledger grows a
  third section ("The record") for closed relationships.

## 4. Send the press emails — 15 minutes
`docs/PRESS-EMAILS.md` — four drafts with verified send routes. Bravur first
(info@bravurwatches.com, the warmest ask and likeliest yes). Breitling via
their Press Lounge registration. Rolex and COSC via contact forms (routes
documented per brand).

## 5. One Wayback capture — 30 seconds
archive.org rate-limits this environment's IP. Save-Page-Now the Cyclingnews
Pogačar source (URL in `data/athletes.ts`, the `watch-media` entry) and note
the archive URL in its snapshot field.

## 6. Deploy — ~30 minutes, the site goes live
`docs/DEPLOY.md` — numbered Vercel runbook: project, env var, domain, the
post-deploy curl checks. The one launch blocker that remains after deploy is
item 7.

## 7. The licensing blocker — the real job
15 unlicensed placeholder assets (13 images + the hero video), all on live
pages. `data/rights.ts` is the ledger; `docs/IMAGE-GAPS.md` batches the
whole imagery programme: 14 shots you can take at home in one afternoon
(list in Batch 1), 6 press-kit asks (item 4 starts these), 13 agency
licences (the only spend). The site can deploy behind a staging URL before
this is cleared, but not to real traffic.

## Meanwhile, tonight
The stage-6 Tourmalet dispatch is being written and verified (the
Pogačar-Vingegaard dead heat met the first mountains today); the loop
integrates it, keeps CI green, and files the next dispatch when the
weekend block completes. Nothing held for your veto will publish itself.
