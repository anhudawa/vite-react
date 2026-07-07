/**
 * IMAGE & VIDEO RIGHTS LEDGER — the canonical, machine-readable record.
 *
 * One record for EVERY file under public/photography, public/brand and
 * public/video. Rights information used to live in three places (essay meta
 * `image.credit` strings, `data/athletes.ts` image.rights fields, and the
 * tables in docs/IMAGE-GAPS.md); this file unifies them so the pre-launch
 * licensing debt is a number, not a folklore.
 *
 * Statuses are derived honestly:
 *   - "public-domain"           licence basis verified on the source page
 *                               before download (see docs/IMAGE-GAPS.md,
 *                               "Public-domain acquisitions").
 *   - "unlicensed-placeholder"  on-file editorial roughs (uploaded race
 *                               photography / screenshots) — MUST be licensed
 *                               or replaced before public launch. See RIGHTS.md.
 *   - "licensed"                a paid/granted licence is on file (none yet).
 *   - "own-work"                commissioned or self-shot; we own it outright.
 *   - "unknown"                 provenance genuinely undetermined — the note
 *                               in `basis` says what is missing. No guessing.
 *
 * Enforced by `npm run rights:check` (scripts/rights-check.mts): every file in
 * the three directories must have a record here, and the summary counts
 * "unlicensed-placeholder" as the pre-launch debt number. Advisory until
 * launch — deliberately NOT wired into prebuild.
 */

export type RightsStatus =
  | "public-domain"
  | "unlicensed-placeholder"
  | "licensed"
  | "own-work"
  | "unknown";

export interface RightsRecord {
  /** Path under public/, e.g. "photography/pogacar-1.jpg". */
  file: string;
  status: RightsStatus;
  /** One line: licence template / who shot it / what's owed. */
  basis: string;
  /** Source page the file (and its licence claim) was verified on. */
  source?: string;
  /** Essay slugs, athlete slugs, or "site-chrome" (homepage / hub pages /
   *  about / brand surfaces). Empty = on file, not yet wired anywhere. */
  usedBy: string[];
}

export const rightsLedger: RightsRecord[] = [
  /* ───────────── public-domain acquisitions (2026-07-03) ─────────────
     Each verified on its source page before download; the licence basis is
     also recorded in the essay's image.credit and docs/IMAGE-GAPS.md. */
  {
    file: "photography/gemini-4-ed-white-eva.webp",
    status: "public-domain",
    basis:
      "NASA photo S65-30427 (James McDivitt, 3 June 1965) — {{PD-USGov-NASA}}, US federal government work, public domain by law.",
    source:
      "https://commons.wikimedia.org/wiki/File:Ed_White_with_Space_Gun_maneuvering_unit.jpg",
    usedBy: ["the-eleven-tests"],
  },
  {
    file: "photography/john-harrison-1767.webp",
    status: "public-domain",
    basis:
      "Thomas King, oil on canvas, 1767 (Science Museum, London) — {{PD-Art|PD-old-100}}, faithful reproduction of a public-domain painting.",
    source:
      "https://commons.wikimedia.org/wiki/File:John_Harrison_(Gem%C3%A4lde).jpg",
    usedBy: ["the-clock-that-found-the-ship"],
  },
  {
    file: "photography/mercedes-gleitze-1928.webp",
    status: "public-domain",
    basis:
      "Agence Rol / Central News press photograph, 1928 (BnF, Rol 130007) — {{PD-France}} + {{PD-1996}}, anonymous press-agency photo, copyright expired.",
    source:
      "https://commons.wikimedia.org/wiki/File:Miss_Gleitze_(CNews)_-_btv1b53201206j.jpg",
    usedBy: ["mercedes-gleitze-and-the-oyster"],
  },

  /* ───────────── public-domain acquisitions, second sweep (2026-07-07) ─────────────
     Same method as the first sweep: licence template verified on the Wikimedia
     Commons file page before download; basis recorded here, in the essay's
     image.credit and in docs/IMAGE-GAPS.md. */
  {
    file: "photography/everest-1921-west-rongbuk.webp",
    status: "public-domain",
    basis:
      "1921 British Mount Everest reconnaissance expedition photograph, published in Howard-Bury, Mount Everest: The Reconnaissance, 1921 (Longmans, Green, New York, 1922) — Commons marks it PD-US (published before 1 January 1930) + CC-PD-Mark. Book-plate margins and printed caption cropped.",
    source:
      "https://commons.wikimedia.org/wiki/File:Everest_and_Changtse,_1921.jpg",
    usedBy: ["everest-1953-the-watch-and-the-record"],
  },
  {
    file: "photography/olympics-1932-womens-100m-medallists.webp",
    status: "public-domain",
    basis:
      "Canadian Press / Canadian Olympic Association photograph, 1932, Library and Archives Canada — Commons marks it {{PD-Canada}} (photograph created before 1 January 1949) + PD-US (published 1931–1963, copyright not renewed).",
    source:
      "https://commons.wikimedia.org/wiki/File:Women%27s_100m_medallists_at_1932_Los_Angeles_Olympics.jpg",
    usedBy: ["omega-and-the-olympic-clock"],
  },
  {
    file: "photography/bannister-la-daily-news-1954.webp",
    status: "public-domain",
    basis:
      "Los Angeles Daily News photograph dated 6 May 1954 on Commons — Commons marks it {{PD-US-no notice}}: published in the US 1931–1977 without a copyright notice. Newsprint halftone; the printed page is the source of the scan.",
    source:
      "https://commons.wikimedia.org/wiki/File:Roger_Bannister_1954.jpg",
    usedBy: ["the-four-minute-mile"],
  },
  {
    file: "photography/vel-dhiv-six-days-start-1922.webp",
    status: "public-domain",
    basis:
      "Agence Rol press photograph, 3 April 1922 (BnF, Gallica btv1b53077017b) — {{PD-France}}, anonymous press-agency photo, copyright expired; same basis as the Gleitze frame. Plate borders and edge annotations cropped.",
    source:
      "https://commons.wikimedia.org/wiki/File:3-4-22,_V%C3%A9l_d%27Hiv,_d%C3%A9part_des_6_jours_-_btv1b53077017b.jpg",
    usedBy: ["four-laps-no-hiding"],
  },
  {
    file: "photography/tour-de-france-1925-col-daubisque.webp",
    status: "public-domain",
    basis:
      "Agence Rol press photograph, 1 July 1925 (BnF, Gallica btv1b53150910v) — {{PD-France}} + {{PD-1996}}, anonymous press-agency photo, copyright expired. Plate borders and edge annotations cropped.",
    source:
      "https://commons.wikimedia.org/wiki/File:1-7-25,_Tour_de_France_(cycliste_au)_col_d%27Aubisque,_un_peloton_-_btv1b53150910v.jpg",
    usedBy: ["the-autobus"],
  },

  /* ───────────── unlicensed placeholders — the pre-launch debt ─────────────
     Uploaded race photography and screenshots ("Add files via upload"
     commits), renamed and converted on file. No licence held for any of
     them. Each needs an agency licence, brand press terms, or replacement
     with owned photography before public launch. */
  {
    file: "photography/breitling-top-time-merckx-hero.webp",
    status: "unlicensed-placeholder",
    basis:
      "Uploaded screenshot converted to WebP (commit 96d4a49); photographer unknown, no licence held — license or reshoot before launch.",
    usedBy: ["one-of-525"],
  },
  {
    file: "photography/breitling-top-time-merckx-flat.webp",
    status: "unlicensed-placeholder",
    basis:
      "Uploaded screenshot converted to WebP (commit 96d4a49); on file for the entity page — photographer unknown, no licence held.",
    usedBy: [],
  },
  {
    file: "photography/breitling-top-time-merckx-caseback.webp",
    status: "unlicensed-placeholder",
    basis:
      "Uploaded screenshot converted to WebP (commit 96d4a49); on file for the entity page — photographer unknown, no licence held.",
    usedBy: [],
  },
  {
    file: "photography/cavendish-rm-dimension-data.jpg",
    status: "unlicensed-placeholder",
    basis:
      "Uploaded 2016 Tour race photo, renamed on file; credit reads 'Photographer TBC — licence before publish'. Agency licence owed.",
    usedBy: ["mark-cavendish"],
  },
  {
    file: "photography/cavendish-rm-green-jersey.jpg",
    status: "unlicensed-placeholder",
    basis:
      "Uploaded 2021 Tour celebration photo (source file named 'photo DR' — droits réservés, rights reserved); supports the in-review RM 67-02 fact. Agency licence owed.",
    usedBy: ["mark-cavendish"],
  },
  {
    file: "photography/lance-armstrong-rolex.webp",
    status: "unlicensed-placeholder",
    basis:
      "Uploaded editorial photo (stw-armstrong2.webp), renamed on file; photographer unknown, no licence held. Agency licence owed.",
    usedBy: ["lance-armstrong-watches"],
  },
  {
    file: "photography/lucy-charles-barclay-1.webp",
    status: "unlicensed-placeholder",
    basis:
      "Uploaded portrait, recompressed to WebP; credit reads 'Photographer TBC — licence before publish'. Licence or press terms owed.",
    usedBy: ["lucy-charles-barclay"],
  },
  {
    file: "photography/lucy-charles-barclay-2.webp",
    status: "unlicensed-placeholder",
    basis:
      "Uploaded training frame, recompressed to WebP; on file for the athlete page — photographer unknown, no licence held.",
    usedBy: ["lucy-charles-barclay"],
  },
  {
    file: "photography/lucy-charles-barclay-3.webp",
    status: "unlicensed-placeholder",
    basis:
      "Uploaded poolside frame showing the Endurance Pro, recompressed to WebP; photographer unknown, no licence held.",
    usedBy: ["the-breitling-endurance-pro", "lucy-charles-barclay"],
  },
  {
    file: "photography/pogacar-1.jpg",
    status: "unlicensed-placeholder",
    basis:
      "Uploaded race photo; photographer unknown, no licence held. Agency licence owed (Getty/Reuters/Imago class).",
    usedBy: [
      "watches-in-sport-field-guide",
      "the-same-machine",
      "site-chrome", // /watches-in-sport hub header
      "buyers-guide:cycling",
    ],
  },
  {
    file: "photography/pogacar-2.jpg",
    status: "unlicensed-placeholder",
    basis:
      "Uploaded race photo (world-champion jersey, RM 67-02); photographer unknown, no licence held. Agency licence owed.",
    usedBy: ["tadej-pogacar", "what-it-costs-to-keep-time"],
  },
  {
    file: "photography/tudor-giro-chrono.jpg",
    status: "unlicensed-placeholder",
    basis:
      "Uploaded photo of the Black Bay Chrono in the Giro trophy; photographer unknown, no licence held — a Tudor press-kit ask may clear it.",
    usedBy: ["site-chrome"], // homepage feature band + /buying-guides header
  },
  {
    file: "photography/van-der-poel.jpg",
    status: "unlicensed-placeholder",
    basis:
      "Uploaded race photo (victory roar, RM on wrist); photographer unknown, no licence held. Agency licence owed.",
    usedBy: [
      "mathieu-van-der-poel",
      "the-sweep-and-the-surge",
      "site-chrome", // homepage effort band
    ],
  },

  /* ───────────── brand assets ───────────── */
  {
    file: "brand/founder-bone.png",
    status: "own-work",
    basis:
      "Commissioned founder-portrait brand asset, supplied with the brand brief at the original site build (commit 75c3986) — owned outright.",
    usedBy: ["site-chrome"], // About page + author byline
  },

  /* ───────────── video ───────────── */
  {
    file: "video/pogacar-climb.mp4",
    status: "unlicensed-placeholder",
    basis:
      "11s muted loop cut from UAE Team Emirates 'attack the mountain' footage (commit ed7b48c); no licence or press-terms confirmation on file.",
    usedBy: ["site-chrome"], // homepage cinematic band
  },
  {
    file: "video/pogacar-climb-poster.jpg",
    status: "unlicensed-placeholder",
    basis:
      "Poster still extracted from the same UAE Team Emirates footage as pogacar-climb.mp4; same clearance owed.",
    usedBy: ["site-chrome"],
  },
];

/** Look up the record for a file path under public/ (e.g. "photography/x.jpg"). */
export function rightsFor(file: string): RightsRecord | undefined {
  return rightsLedger.find((r) => r.file === file);
}

/** Count of records per status — "unlicensed-placeholder" is the pre-launch debt. */
export function rightsSummary(): Record<RightsStatus, number> {
  const summary: Record<RightsStatus, number> = {
    "public-domain": 0,
    "unlicensed-placeholder": 0,
    licensed: 0,
    "own-work": 0,
    unknown: 0,
  };
  for (const r of rightsLedger) summary[r.status] += 1;
  return summary;
}
