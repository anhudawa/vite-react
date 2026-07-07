# Imagery — inventory and shot list

Refreshed 2026-07-03 against the merged 45-essay corpus (the previous version
of this file predated the endurance-only purge and referenced retired
articles). Standard per `docs/EDITORIAL.md`: every article carries an image
pairing the athlete and the watch — or, where no athlete belongs, the object
itself, photographed with intent.

**State: 7 of 45 essays have a lead image. 38 need one.** The list below is
grouped by how the image can actually be obtained, so it can be cleared in
batches rather than one impossible agency-licensing slog.

## Batch 1 — shootable at home (14 shots, one afternoon, zero rights cost)

Own watches, a bench, a bike, daylight and one dark room. Consistent
treatment: Movement-Black or Bone ground, hairline shadow, no props beyond
the subject.

| Essay | Shot |
|---|---|
| straps-for-sport | Three straps laid parallel (rubber/nylon/leather), sweat-marked honesty |
| how-to-read-a-reference | Caseback macro, reference number legible |
| lume-and-the-dark | Charged lume dial in true dark, long exposure |
| sizing-a-watch-for-a-lean-wrist | Lean wrist + card strip lug-to-lug measure |
| the-handover | GPS and mechanical side by side on a race-morning table, number pinned |
| your-first-automatic-what-matters | A modest automatic, crown-side, on a plain ground |
| when-to-service-a-mechanical-watch | Movement out of case (or watchmaker's bench if accessible) |
| automatic-vs-manual-wind | Crown mid-wind, thumb and forefinger |
| automatics-on-the-bike | Mechanical on wrist, hands on the drops, cobble texture if possible |
| gps-watch-vs-mechanical | Two wrists, two instruments, one frame |
| the-one-watch-question | One watch on an otherwise empty valet tray |
| first-nice-watch-as-an-athlete | The box open, the moment of it |
| casio-f-91w-and-the-time-trial | An F-91W (retail ~£15 — buy one) on a TT cockpit |
| the-escapement-the-part-that-lets-go | Escapement macro through a loupe (or licensed movement macro, Batch 4) |

## Batch 2 — public domain / free archive (5 shots, zero cost, verify each licence)

| Essay | Source to check |
|---|---|
| the-eleven-tests | NASA imagery is public domain — Gemini/Apollo Speedmaster frames exist on nasa.gov / archive.org |
| everest-1953-the-watch-and-the-record | 1953 expedition photos: some RGS/press frames are licensable; check pre-1955 public-domain candidates |
| mercedes-gleitze-and-the-oyster | 1927 press photography and the Daily Mail Oyster advert — UK copyright on 1927 published photos has expired |
| the-clock-that-found-the-ship | Harrison's H4 — Royal Museums Greenwich publishes collection imagery, some CC-licensed |
| omega-and-the-olympic-clock | Early Olympic timing photography via IOC/archive; 1932 LA frames may be public domain |

## Batch 3 — brand press kits (6 shots, free on request, ask via press contact)

| Essay | Ask |
|---|---|
| the-last-kilometre | Bravur press kit (small brand; the piece is warm — they will likely say yes) |
| the-overbuilt-watch | Rolex press imagery: Deepsea / Deepsea Challenge |
| the-waterproof-watch-and-the-open-water | Rolex archive: 1926 Oyster case / cutaway |
| what-a-chronometer-actually-is | COSC or brand movement-testing imagery |
| the-chronograph-for-athletes | Any brand chronograph press frame, pushers prominent |
| the-instrument-of-effort | Manifesto piece — could also run imageless by design, or reuse the strongest athlete frame |

## Batch 4 — agency licensing required (13 shots, the real budget line)

Athlete-in-the-moment frames; Getty/AP/Offside. License in one negotiation.

| Essay | Frame |
|---|---|
| the-1989-tour-eight-seconds | LeMond or Fignon, Champs-Élysées 1989 — the clock visible if it exists |
| the-four-minute-mile | Bannister at the tape, Iffley Road 1954 |
| sixteen-years | Radcliffe, London 2003 |
| the-number-that-doesnt-count | Kipchoge, Vienna 2019, the clock reading 1:59:40 |
| the-unclaimed-wrist | Kipchoge wrist frame (COROS visible), Berlin 2023 |
| seventeen-hours | Kona finish line at midnight, or 1978 archive |
| the-gun-at-twelve-hours | The Comrades final-gun moment — the race supplies media imagery |
| the-longest-hour | Ganna, Grenchen 2022 |
| four-laps-no-hiding | Pursuit rider on the boards, schedule board visible |
| no-one-at-the-line | An Everesting attempt or lone rider on a climb at dawn |
| the-autobus | The gruppetto on a mountain stage |
| omega-and-the-olympic-clock | (alternative to Batch 2 if archive fails) |
| sixteen-years / heritage overflow | — |

## Athlete ledger imagery (rights, not shots)

Everything on file is `unlicensed-placeholder` and must be licensed or
replaced before real traffic: Pogačar (×2), van der Poel, Cavendish (×2),
Lucy Charles-Barclay (×3, now WebP), Armstrong, Tudor/Giro, Merckx Top Time
set. Frodeno and Ryf (in-review) have **no imagery at all** — needed before
promotion to published.

## Process notes

- Wire each image via the essay's `image` meta (src/alt/subject/watch/ratio/
  position); alt text names athlete and watch.
- Batches 1–2 clear 19 of 38 gaps for the cost of an afternoon and some
  archive diligence. Batch 3 is emails. Batch 4 is the only spend.
- Record credit + licence in the meta `credit`/`rights` fields as with the
  athlete data — no silent rights gaps.

## Public-domain acquisitions (2026-07-03)

Batch 2 cleared in part. Each file below was verified on its source page
before download; licence basis recorded here and in the essay's `image.credit`.

| Essay | File | Source | Licence basis |
|---|---|---|---|
| the-eleven-tests | `public/photography/gemini-4-ed-white-eva.webp` | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Ed_White_with_Space_Gun_maneuvering_unit.jpg), original at [images.nasa.gov (S65-30427)](https://images.nasa.gov/details/s65-30427) | NASA photo S65-30427, taken by James McDivitt, 3 June 1965. `{{PD-USGov-NASA}}` — US federal government work, public domain by law. |
| mercedes-gleitze-and-the-oyster | `public/photography/mercedes-gleitze-1928.webp` | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Miss_Gleitze_(CNews)_-_btv1b53201206j.jpg), original held by the Bibliothèque nationale de France (Rol 130007) | Agence Rol / Central News press photograph, 1928. `{{PD-France}}` + `{{PD-1996}}` on the file page — anonymous French press-agency photo, copyright expired; BnF publishes the plate as public domain. Plate borders and edge annotations cropped. |
| the-clock-that-found-the-ship | `public/photography/john-harrison-1767.webp` | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:John_Harrison_(Gem%C3%A4lde).jpg) | Thomas King, oil on canvas, 1767, Science Museum, London. `{{PD-Art|PD-old-100}}` — artist died c. 1796; faithful reproduction of a public-domain painting. Shows Harrison holding the Jefferys watch, H3 behind him. |
| omega-and-the-olympic-clock | — skipped | — | No genuinely PD 1932 LA / early photo-finish file could be verified on Commons; commercial archives only. Remains on Batch 2/4. |
| seventeen-hours | — skipped | — | No PD 1978 Kona imagery exists (as expected). Remains on Batch 4. |

Note on the Commons H4 photographs: every direct photo of H4/H1 on Commons is
`CC BY-SA` (own-work museum shots), which this site does not use without an
attribution-handling decision — the 1767 King portrait was the strongest
genuinely-PD option.
