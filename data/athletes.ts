import type { VerifiedFact } from "../lib/verification";
import { isPublishable, publishableFacts } from "../lib/verification";
import { acquisitionOf } from "../lib/economics";

/**
 * REFERENCE DATA
 *
 * Every fact below is a VerifiedFact carrying its own provenance. It renders
 * only if it clears the verification gauntlet (lib/verification) — status is
 * never trusted on its own.
 *
 * NOTE FOR EDITORS: the source `url`s and `excerpt`s in this seed are
 * representative. Production requires an editor to attach the exact link and
 * quote and set `verified: true` only after confirming both resolve and are
 * current. The machinery enforces that the citations EXIST and corroborate;
 * the human gate ('dual-control') confirms they are REAL.
 */

export interface AthleteRef {
  slug: string;
  name: string;
  discipline: string;
  nationality: string;
  sameAs: string[];
  summary: string;
  facts: VerifiedFact[];
  notes: string[];
  image?: {
    src: string;
    alt: string;
    caption?: string;
    /** Credit line + licensing status. `unlicensed-placeholder` images are
     *  on-file editorial roughs that MUST be replaced with licensed photography
     *  before public launch — see RIGHTS.md. Tracked structurally so the gap is
     *  auditable, never silent. */
    credit?: string;
    rights?: "licensed" | "editorial-use" | "unlicensed-placeholder";
  };
}

const pogacar: AthleteRef = {
  slug: "tadej-pogacar",
  name: "Tadej Pogačar",
  discipline: "Road cycling — UAE Team Emirates",
  nationality: "Slovenian",
  sameAs: [
    "https://en.wikipedia.org/wiki/Tadej_Poga%C4%8Dar",
    "https://www.uaeteamemirates.com/rider/tadej-pogacar/",
  ],
  summary:
    "The defining rider of his generation, and the clearest case study the sport offers of a Richard Mille worn in genuine competition rather than on a red carpet.",
  image: {
    src: "/photography/pogacar-2.jpg",
    alt: "Tadej Pogačar in the UAE Team Emirates world-champion jersey, a Richard Mille RM 67-02 on his wrist",
    caption: "Richard Mille RM 67-02",
    rights: "unlicensed-placeholder",
  },
  facts: [
    {
      id: "pogacar-rm-67-02",
      status: "published",
      athlete: "Tadej Pogačar",
      watch: "Richard Mille RM 67-02",
      relation: "Sponsored — UAE Team Emirates",
      evidence: "Worn at 2025 Paris–Roubaix",
      confidence: "High",
      confidenceNote: "multiple independent reports",
      reference: "RM 67-02",
      value: { gbpApprox: 150000, note: "RM 67-02, indicative retail" },
      sources: [
        {
          id: "rm-official",
          publisher: "Richard Mille",
          kind: "official",
          tier: "primary",
          url: "https://www.richardmille.com/friends-and-partners/uae-team-emirates",
          snapshot: {
            archivedUrl:
              "https://web.archive.org/web/20260414030345/https://www.richardmille.com/friends-and-partners/uae-team-emirates",
            capturedAt: "2026-04-14",
          },
          accessedAt: "2026-06-16",
          excerpt:
            "Richard Mille's dedicated UAE Team Emirates partner page places the extra-flat automatic RM 67-02 on the team's riders.",
          supports: ["watch", "relation"],
          verified: true,
        },
        {
          id: "uae-team",
          publisher: "UAE Team Emirates",
          kind: "official",
          tier: "primary",
          url: "https://www.uaeteamemirates.com/rider/tadej-pogacar/",
          snapshot: {
            archivedUrl:
              "https://web.archive.org/web/20260423024512/https://www.uaeteamemirates.com/rider/tadej-pogacar/",
            capturedAt: "2026-04-23",
          },
          accessedAt: "2026-06-10",
          excerpt:
            "Team partner listings name Richard Mille; Pogačar is the team's lead rider.",
          supports: ["athlete", "watch", "relation"],
          verified: true,
        },
        {
          id: "watch-media",
          publisher: "Cyclingnews",
          kind: "media",
          tier: "secondary",
          url: "https://www.cyclingnews.com/pro-cycling/tadej-pogacars-usd350k-richard-mille-watch-placement-is-the-ultimate-paris-roubaix-marginal-gain/",
          publishedAt: "2025-04-14",
          accessedAt: "2026-06-16",
          excerpt:
            "Pogačar raced Paris-Roubaix in the Richard Mille RM 67-02 — a roughly $350k placement on the cobbles.",
          supports: ["watch", "evidence"],
          verified: true,
        },
        {
          id: "race-photo",
          publisher: "Race wire photography",
          kind: "photo",
          tier: "primary",
          publishedAt: "2025-04-13",
          accessedAt: "2026-06-10",
          excerpt:
            "Dated, located wrist photograph from the 2025 Paris–Roubaix start showing the RM 67-02.",
          supports: ["evidence", "watch"],
          // independent of the watch-media outlet that may have run the same image
          notIndependentOf: [],
          verified: true,
        },
      ],
      review: {
        disconfirmingSearch: true,
        contradictionsFound: [],
        confusedWithRuledOut: ["RM 67-01 (ruled out: thinner, different bezel)"],
        method: "dual-control",
        approvedBy: "A. Walsh",
        approvedAt: "2026-06-12",
        notes:
          "Relationship is team-level sponsorship, not a personal purchase; logged as such.",
      },
    },
  ],
  notes: [
    "The RM 67-02 is the relevant reference for a reason: it is Richard Mille's extra-flat, lightweight automatic, the line the brand builds specifically for athletes to wear while competing. On Pogačar it is not kept for best — it is on the wrist over the cobbles, which is precisely the use case the watch was engineered for and almost never actually subjected to.",
    "The relationship runs through UAE Team Emirates rather than a personal endorsement of the classical kind, which is the honest way to log it. The team's backing places the watch on the wrist; the rider's results are what make anyone look. That distinction — sponsorship versus personal collection — is exactly the kind of thing the rest of the internet flattens, and exactly the kind of thing this page exists to keep straight.",
    "What makes it worth a reference page is the contrast it sets up across the sport: the same race won, in some years, by a rider in a sub-£400 computer on a strap, and contested by another carrying a six-figure mechanical movement up the same climb. Both are keeping time. Only one was ever asked to.",
  ],
};

// An example held back BY THE SYSTEM: a single, unverified source. It is marked
// in-review precisely because it cannot clear the gauntlet. It demonstrates the
// withholding behaviour and must never render as fact.
const pidcock: AthleteRef = {
  slug: "tom-pidcock",
  name: "Tom Pidcock",
  discipline: "Road / cyclo-cross / MTB",
  nationality: "British",
  sameAs: ["https://en.wikipedia.org/wiki/Tom_Pidcock"],
  summary:
    "A reference in progress. The relationship is plausible, but we haven't pinned down the watch yet — so it sits here, not published.",
  facts: [
    {
      id: "pidcock-draft",
      status: "in-review",
      athlete: "Tom Pidcock",
      watch: "(undetermined)",
      relation: "Reportedly brand-affiliated",
      evidence: "Single unconfirmed mention",
      confidence: "Low",
      reference: undefined,
      sources: [
        {
          id: "forum-post",
          publisher: "Watch forum thread",
          kind: "media",
          tier: "tertiary",
          publishedAt: "2025-09-01",
          accessedAt: "2026-06-10",
          excerpt: "A forum poster claims to have spotted a watch; no image, no follow-up.",
          supports: ["athlete"],
          verified: false,
        },
      ],
      review: {
        disconfirmingSearch: false,
        contradictionsFound: [],
        confusedWithRuledOut: [],
        method: "none",
      },
    },
  ],
  notes: [],
};

const mvdp: AthleteRef = {
  slug: "mathieu-van-der-poel",
  name: "Mathieu van der Poel",
  discipline: "Road / cyclo-cross — Alpecin-Deceuninck",
  nationality: "Dutch",
  sameAs: [
    "https://en.wikipedia.org/wiki/Mathieu_van_der_Poel",
    "https://www.richardmille.com/friends-and-partners/mathieu-van-der-poel",
  ],
  summary:
    "Pogačar's great rival, in the same six-figure Richard Mille — worn to win Paris-Roubaix, not to dinner.",
  image: {
    src: "/photography/van-der-poel.jpg",
    alt: "Mathieu van der Poel roars in victory, a Richard Mille on his wrist",
    caption: "Richard Mille RM 67-02",
    rights: "unlicensed-placeholder",
  },
  facts: [
    {
      id: "mvdp-rm-67-02",
      status: "published",
      athlete: "Mathieu van der Poel",
      watch: "Richard Mille RM 67-02",
      relation: "Ambassador — Richard Mille partner since 2025",
      evidence: "Worn winning the 2025 Paris-Roubaix; RM partner since January 2025",
      confidence: "High",
      confidenceNote: "official + independent media",
      reference: "RM 67-02",
      value: { gbpApprox: 150000, note: "RM 67-02, indicative" },
      sources: [
        {
          id: "rm-official-mvdp",
          publisher: "Richard Mille",
          kind: "official",
          tier: "primary",
          url: "https://www.richardmille.com/friends-and-partners/mathieu-van-der-poel",
          snapshot: {
            archivedUrl:
              "https://web.archive.org/web/20260414034854/https://www.richardmille.com/friends-and-partners/mathieu-van-der-poel",
            capturedAt: "2026-04-14",
          },
          accessedAt: "2026-06-16",
          excerpt:
            "“We are proud to welcome him to our family and look forward to supporting him in his next challenges.” — Amanda Mille",
          supports: ["athlete", "watch", "relation", "evidence"],
          verified: true,
        },
        {
          id: "cyclingnews-mvdp",
          publisher: "Cyclingnews",
          kind: "media",
          tier: "secondary",
          url: "https://www.cyclingnews.com/news/why-are-tadej-pogacar-and-mathieu-van-der-poel-racing-the-tour-de-france-in-usd300k-watches-and-arent-they-going-to-break-them/",
          snapshot: {
            archivedUrl:
              "https://web.archive.org/web/20260311034157/https://www.cyclingnews.com/news/why-are-tadej-pogacar-and-mathieu-van-der-poel-racing-the-tour-de-france-in-usd300k-watches-and-arent-they-going-to-break-them/",
            capturedAt: "2026-03-11",
          },
          accessedAt: "2026-06-16",
          excerpt:
            "Reported Pogačar and van der Poel racing in roughly $300k Richard Mille watches (the RM 67-02).",
          supports: ["watch", "evidence"],
          verified: true,
        },
        {
          id: "domestique-mvdp",
          publisher: "Domestique Cycling",
          kind: "media",
          tier: "secondary",
          url: "https://www.domestiquecycling.com/en/features/luxury-on-the-line-why-pogacar-and-van-der-poel-wear-eur300k-watches-in-the-heat-of-the-battle/",
          snapshot: {
            archivedUrl:
              "https://web.archive.org/web/20260413035516/https://www.domestiquecycling.com/en/features/luxury-on-the-line-why-pogacar-and-van-der-poel-wear-eur300k-watches-in-the-heat-of-the-battle/",
            capturedAt: "2026-04-13",
          },
          publishedAt: "2026-04-11",
          accessedAt: "2026-06-16",
          excerpt:
            "“Mathieu van der Poel thundered to victory, also wearing the same Richard Mille model.”",
          supports: ["athlete", "relation", "evidence"],
          verified: true,
        },
        {
          id: "mvdp-photo",
          publisher: "On-file photograph",
          kind: "photo",
          tier: "primary",
          accessedAt: "2026-06-16",
          excerpt: "Mathieu van der Poel in victory, a Richard Mille RM 67-02 on his wrist.",
          supports: ["athlete", "watch", "evidence"],
          verified: true,
        },
      ],
      review: {
        disconfirmingSearch: true,
        contradictionsFound: [],
        confusedWithRuledOut: [
          "NOT a Canyon-SRAM tie — it is an individual Richard Mille partnership; his trade team is Alpecin-Deceuninck",
          "Teammate-in-the-peloton look-alike: Pogačar wears the same RM at the same races — confirm the wrist is MvdP's",
        ],
        method: "dual-control",
        approvedBy: "A. Walsh",
        approvedAt: "2026-06-16",
        notes:
          "Individual Richard Mille partnership announced January 2025; the RM 67-02 worn racing — corroborated by Richard Mille and independent cycling media.",
      },
    },
  ],
  notes: [
    "Van der Poel joined Richard Mille's family in January 2025, and like his rival Pogačar he wears the RM 67-02 — the extra-flat automatic built to be raced — over the cobbles of Paris-Roubaix, which he won with it on his wrist.",
    "It is the same watch, the same race, the same contradiction as Pogačar's: a six-figure mechanical movement asked to do the one thing it is actually engineered for — survive — while a bike computer does the timing.",
    "Logged as a paid partnership, and kept distinct from the false 'Canyon-SRAM' framing that circulates: this is an individual deal, his trade team is Alpecin-Deceuninck.",
  ],
};

// IN-REVIEW. Strongly sourced (Richard Mille's own ambassador page + reputable
// watch media), staged in the workshop pending the two things only the human
// desk can close: a confirmed visual ID of each reference, and dual-control
// editorial sign-off. Promote to "published" once those clear and the licensed
// photography is on file (see notes).
const cavendish: AthleteRef = {
  slug: "mark-cavendish",
  name: "Mark Cavendish",
  discipline: "Road cycling — sprinter",
  nationality: "British",
  sameAs: [
    "https://en.wikipedia.org/wiki/Mark_Cavendish",
    "https://www.richardmille.com/friends-and-partners/mark-cavendish",
  ],
  summary:
    "A Richard Mille ambassador with a long history of the watches on race day — the brand loans him pieces, and he owns others outright. Well-sourced, and held here only while we pin each reference visually and clear the desk's sign-off.",
  image: {
    src: "/photography/cavendish-rm-dimension-data.jpg",
    alt: "Mark Cavendish in Dimension Data kit on the bars, a carbon Richard Mille on his wrist",
    caption: "Richard Mille RM 011",
    credit: "Photographer TBC — licence before publish",
    rights: "unlicensed-placeholder",
  },
  facts: [
    {
      id: "cavendish-rm011",
      status: "in-review",
      athlete: "Mark Cavendish",
      watch: "Richard Mille RM 011 (Felipe Massa)",
      relation: "Ambassador — Richard Mille (race-day watches loaned)",
      evidence: "Worn at the 2016 Tour de France in Dimension Data kit; subject of Richard Mille's own ambassador page",
      confidence: "Medium",
      confidenceNote:
        "The relationship is authoritative (the brand's own page). The specific RM 011 reference is from watch media and our read of the photo, not yet visually dual-confirmed.",
      reference: "RM 011",
      value: { gbpApprox: 150000, note: "indicative only — Richard Mille pricing is opaque and varies by execution" },
      sources: [
        {
          id: "rm-ambassador-page",
          publisher: "Richard Mille",
          kind: "official",
          tier: "primary",
          url: "https://www.richardmille.com/friends-and-partners/mark-cavendish",
          accessedAt: "2026-06-22",
          excerpt: "Richard Mille lists Mark Cavendish among its friends and partners.",
          supports: ["athlete", "relation"],
          snapshot: "unarchivable",
          verified: false,
        },
        {
          id: "timeandtide-cav-rm",
          publisher: "Time+Tide",
          kind: "media",
          tier: "secondary",
          url: "https://timeandtidewatches.com/mark-cavendish-richard-mille/",
          accessedAt: "2026-06-22",
          excerpt: "Reporting that Richard Mille gave Cavendish an RM 011 Felipe Massa 10th Anniversary edition around the 2016 Tour de France.",
          supports: ["watch", "evidence"],
          verified: false,
        },
        {
          id: "photo-dimension-data",
          publisher: "On-file race photograph",
          kind: "photo",
          tier: "primary",
          accessedAt: "2026-06-22",
          excerpt: "Dated race photo: Dimension Data glove and kit, green bar tape, a carbon-cased skeleton Richard Mille on the wrist.",
          supports: ["athlete", "watch"],
          verified: false,
        },
      ],
      review: {
        disconfirmingSearch: true,
        contradictionsFound: [],
        confusedWithRuledOut: [
          "Exact RM 011 execution not yet visually dual-confirmed — carbon RM 011 variants look alike.",
        ],
        method: "single",
        notes: "Awaiting desk dual-control sign-off and an archivable corroborating source.",
      },
    },
    {
      id: "cavendish-rm6702",
      status: "in-review",
      athlete: "Mark Cavendish",
      watch: "Richard Mille RM 67-02",
      relation: "Ambassador — Richard Mille (race-day watches loaned)",
      evidence: "Reported on his wrist for the record-equalling 35th Tour de France stage win, 2021 (Deceuninck-Quick-Step)",
      confidence: "Medium",
      confidenceNote:
        "The RM 67-02 attribution is from watch media. In our 2021 celebration photo the watch is clearly an orange-and-black RM, but whose wrist it is in the embrace needs the original full frame to confirm.",
      reference: "RM 67-02",
      value: { gbpApprox: 150000, note: "indicative only — Richard Mille pricing is opaque" },
      sources: [
        {
          id: "watchfinder-cav-rm",
          publisher: "Watchfinder",
          kind: "media",
          tier: "secondary",
          url: "https://www.watchfinder.co.uk/articles/richard-mille-for-mark-cavendish",
          accessedAt: "2026-06-22",
          excerpt: "Reporting Cavendish's Richard Mille watches, including the RM 67-02 worn on race day.",
          supports: ["watch", "evidence"],
          verified: false,
        },
        {
          id: "photo-green-jersey",
          publisher: "On-file race photograph",
          kind: "photo",
          tier: "secondary",
          accessedAt: "2026-06-22",
          excerpt: "2021 Tour celebration, green points jersey: an orange-and-black tonneau Richard Mille visible on a wrist in the embrace.",
          supports: ["watch"],
          verified: false,
        },
      ],
      review: {
        disconfirmingSearch: true,
        contradictionsFound: [],
        confusedWithRuledOut: [
          "Whose wrist in the celebration embrace — needs the original full-frame photo to confirm it is Cavendish's.",
        ],
        method: "single",
        notes: "Hold until the wrist attribution and reference are dual-confirmed.",
      },
    },
  ],
  notes: [
    "Two sightings on file: a carbon Richard Mille (reported RM 011 Felipe Massa) at the 2016 Tour in Dimension Data colours, and an orange RM 67-02 around his record-equalling 35th stage win in 2021. The image files still need adding to /photography (cavendish-rm-dimension-data.jpg, cavendish-rm-green-jersey.jpg) and licensing before publish.",
    "Cavendish is an official Richard Mille ambassador, loaned race-day pieces — so these are paid placements, not personal purchases. Separately he owns Richard Milles in his own right: two (reported at roughly £400,000 and £300,000) were taken in a knifepoint robbery at his home, which is its own grim proof of what he keeps on the wrist.",
    "Left for the desk: confirm each reference visually, settle the wrist attribution in the 2021 photo, add an archivable corroborating source, and apply dual-control sign-off — then promote both facts from in-review to published.",
  ],
};

// IN-REVIEW. Cleanly sourced — official Breitling ambassador (their own page) in
// the Triathlon Squad, featured on the Endurance Pro 38. Quartz "seasoning", and
// an authentic endurance-athlete watch. Held only for the visual ID of the exact
// execution and the desk sign-off; promote once the licensed photography is on
// file.
const lucy: AthleteRef = {
  slug: "lucy-charles-barclay",
  name: "Lucy Charles-Barclay",
  discipline: "Triathlon — long course / Ironman",
  nationality: "British",
  sameAs: [
    "https://en.wikipedia.org/wiki/Lucy_Charles-Barclay",
    "https://www.breitling.com/us-en/about/ambassadors/lucy-charles-barclay/",
  ],
  summary:
    "2023 Ironman World Champion and a Breitling ambassador — the rare case where the watch was actually built for the wearer's sport. Cleanly sourced; held here only to confirm the exact execution and clear the desk's sign-off.",
  image: {
    src: "/photography/lucy-charles-barclay-1.webp",
    alt: "Lucy Charles-Barclay, a Breitling Endurance Pro on her wrist",
    caption: "Breitling Endurance Pro 38",
    credit: "Photographer TBC — licence before publish",
    rights: "unlicensed-placeholder",
  },
  facts: [
    {
      id: "lucy-endurance-pro",
      status: "in-review",
      athlete: "Lucy Charles-Barclay",
      watch: "Breitling Endurance Pro 38",
      relation: "Ambassador — Breitling (Triathlon Squad)",
      evidence: "Official Breitling ambassador and Triathlon Squad member; featured on the Endurance Pro 38, a SuperQuartz watch built for endurance athletes",
      confidence: "High",
      confidenceNote:
        "Relationship and watch are authoritative (Breitling's own pages). Held in-review only to confirm the exact execution in our images and apply the desk sign-off.",
      reference: "Endurance Pro 38",
      sources: [
        {
          id: "breitling-ambassador-lucy",
          publisher: "Breitling",
          kind: "official",
          tier: "primary",
          url: "https://www.breitling.com/us-en/about/ambassadors/lucy-charles-barclay/",
          accessedAt: "2026-06-22",
          excerpt: "Breitling's own ambassador page for Lucy Charles-Barclay, 2023 Ironman World Champion.",
          supports: ["athlete", "relation"],
          snapshot: "unarchivable",
          verified: false,
        },
        {
          id: "breitling-triathlon-squad",
          publisher: "Breitling",
          kind: "official",
          tier: "primary",
          url: "https://www.breitling.com/gb-en/about/squads/triathlon/",
          accessedAt: "2026-06-22",
          excerpt: "Breitling's Triathlon Squad page listing Charles-Barclay; Breitling is IRONMAN's official watch partner.",
          supports: ["athlete", "relation"],
          snapshot: "unarchivable",
          verified: false,
        },
        {
          id: "revolution-endurance-pro-38",
          publisher: "Revolution",
          kind: "media",
          tier: "secondary",
          url: "https://revolutionwatch.com/breitling-endurance-pro-38/",
          accessedAt: "2026-06-22",
          excerpt: "On the Breitling Endurance Pro 38 — SuperQuartz, 100m, chronograph and pulsometer, aimed at endurance athletes.",
          supports: ["watch", "evidence"],
          verified: false,
        },
      ],
      review: {
        disconfirmingSearch: true,
        contradictionsFound: [],
        confusedWithRuledOut: [
          "Endurance Pro 38 vs the 44mm execution — confirm which she is wearing in our on-file images.",
        ],
        method: "single",
        notes: "Awaiting desk dual-control sign-off and the licensed photography.",
      },
    },
  ],
  notes: [
    "An honest one for the 'mechanical-first' line: the Endurance Pro is a SuperQuartz tool watch in a light Breitlight case, not a luxury mechanical grail — and that is exactly the point. It is the rare watch genuinely engineered for the sport its wearer races, worn by the athlete it was built for, through a real partnership rather than a red-carpet loan.",
    "Three images now on file (lucy-charles-barclay-1/2/3.png — a portrait, a training frame, and a poolside shot showing the Endurance Pro). They still need a credit and licence before publish.",
    "Left for the desk: confirm the exact Endurance Pro execution against the images, add an archivable corroborating source, and apply dual-control sign-off — then promote from in-review to published.",
  ],
};

const frodeno: AthleteRef = {
  slug: "jan-frodeno",
  name: "Jan Frodeno",
  discipline: "Triathlon — Olympic gold (2008) and three-time Ironman World Champion",
  nationality: "German",
  sameAs: [
    "https://en.wikipedia.org/wiki/Jan_Frodeno",
    "https://www.breitling.com/us-en/about/ambassadors/jan-frodeno/",
  ],
  summary:
    "Founding member of the Breitling Triathlon Squad, and the athlete Breitling's own CEO credits with shaping the Endurance Pro. The rare case where the wearer helped design the watch.",
  facts: [
    {
      id: "frodeno-endurance-pro",
      status: "in-review",
      athlete: "Jan Frodeno",
      watch: "Breitling Endurance Pro 44",
      relation: "Ambassador — Breitling (Triathlon Squad, founding member)",
      evidence:
        "Official Breitling ambassador; squad announced 2019. CEO Georges Kern publicly credited Frodeno's input on the Endurance Pro at its 2020 launch; his ambassador page features the model.",
      confidence: "High",
      confidenceNote:
        "Relationship and watch are authoritative (Breitling's own pages plus a named CEO quote in press). Held in-review pending desk sign-off; note the pre-2020 squad watch was the Superocean Automatic 44 IRONMAN edition — don't backdate the Endurance Pro.",
      reference: "Endurance Pro 44",
      sources: [
        {
          id: "breitling-ambassador-frodeno",
          publisher: "Breitling",
          kind: "official",
          tier: "primary",
          url: "https://www.breitling.com/us-en/about/ambassadors/jan-frodeno/",
          accessedAt: "2026-07-01",
          excerpt: "Breitling's ambassador page for Jan Frodeno, featuring the Endurance Pro 44.",
          supports: ["athlete", "relation", "watch"],
          snapshot: "unarchivable",
          verified: false,
        },
        {
          id: "sharp-endurance-pro-kern",
          publisher: "Sharp Magazine",
          kind: "media",
          tier: "secondary",
          url: "https://sharpmagazine.com/2020/08/26/breitling-endurance-pro/",
          accessedAt: "2026-07-01",
          excerpt:
            "Endurance Pro launch coverage quoting CEO Georges Kern crediting Jan Frodeno's input on the watch.",
          supports: ["relation", "evidence"],
          verified: false,
        },
        {
          id: "timeandtide-triathlon-squad",
          publisher: "Time+Tide",
          kind: "media",
          tier: "secondary",
          url: "https://timeandtidewatches.com/why-does-the-breitling-triathlon-squad-exist/",
          accessedAt: "2026-07-01",
          excerpt:
            "On the 2019 formation of the Breitling Triathlon Squad: Frodeno, Daniela Ryf, Chris McCormack.",
          supports: ["relation", "evidence"],
          verified: false,
        },
      ],
      review: {
        disconfirmingSearch: true,
        contradictionsFound: [],
        confusedWithRuledOut: [
          "Superocean Automatic 44 IRONMAN Limited Edition — the 2019 squad-era watch; distinct from the Endurance Pro (launched Aug 2020).",
        ],
        method: "single",
        notes: "Awaiting desk dual-control sign-off and rights-clear imagery.",
      },
    },
  ],
  notes: [
    "The strongest athlete-watch story on the ledger: the brand's own CEO says the athlete shaped the product. That is a design credit, not just a placement.",
    "Left for the desk: rights-clear image, archivable snapshot of the ambassador page, dual-control sign-off — then promote.",
  ],
};

const ryf: AthleteRef = {
  slug: "daniela-ryf",
  name: "Daniela Ryf",
  discipline: "Triathlon — five-time Ironman World Champion (retired 2024)",
  nationality: "Swiss",
  sameAs: ["https://en.wikipedia.org/wiki/Daniela_Ryf"],
  summary:
    "Breitling Triathlon Squad member from 2018 — the Superocean IRONMAN edition first, then the Endurance Pro. Documented while it ran; she retired in 2024 and no longer appears on Breitling's current ambassador pages, so the ledger dates the relationship honestly.",
  facts: [
    {
      id: "ryf-endurance-pro",
      status: "in-review",
      athlete: "Daniela Ryf",
      watch: "Breitling Endurance Pro (38mm executions favoured)",
      relation: "Ambassador — Breitling (Triathlon Squad, 2018 to at least 2020)",
      evidence:
        "Named a Triathlon Squad member alongside Frodeno and McCormack; attended the Endurance Pro's 2020 launch and discussed the partnership in interviews; Breitling's own posts show her racing in the squad watches.",
      confidence: "Medium",
      confidenceNote:
        "Relationship firmly sourced for 2018-2020 (brand + named editorial with quotes). Breitling's current ambassadors page no longer lists her and she retired from professional racing in 2024 — so this is a dated, historical relationship, and the entry must say so.",
      reference: "Endurance Pro",
      sources: [
        {
          id: "timeandtide-squad-ryf",
          publisher: "Time+Tide",
          kind: "media",
          tier: "secondary",
          url: "https://timeandtidewatches.com/why-does-the-breitling-triathlon-squad-exist/",
          accessedAt: "2026-07-01",
          excerpt: "Names Ryf as one of the three Breitling Triathlon Squad members.",
          supports: ["athlete", "relation"],
          verified: false,
        },
        {
          id: "aeworld-ryf-interview",
          publisher: "A&E Magazine",
          kind: "media",
          tier: "secondary",
          url: "https://aeworld.com/watches-jewellery/watches/triathlete-and-ironman-world-champion-daniela-ryf-on-striving-to-be-her-best/",
          accessedAt: "2026-07-01",
          excerpt:
            "Interview (Oct 2020): Ryf discusses the Breitling partnership and the Endurance Pro launch.",
          supports: ["relation", "evidence"],
          verified: false,
        },
      ],
      review: {
        disconfirmingSearch: true,
        contradictionsFound: [
          "Breitling's current global ambassadors page (checked 2026-07-01) no longer lists Ryf or a Triathlon Squad — treated as evidence the relationship has lapsed, not that it never ran.",
        ],
        confusedWithRuledOut: [
          "Pre-2020 squad imagery shows the Superocean Automatic 44 IRONMAN edition, not the Endurance Pro — keep the eras separate.",
        ],
        method: "single",
        notes: "Stage as a dated historical reference; needs desk sign-off on the past-tense framing.",
      },
    },
  ],
  notes: [
    "The ledger's first explicitly historical entry: a real, well-sourced relationship that has since lapsed. Recording it with dates is more honest than dropping it.",
  ],
};

export const athletes: AthleteRef[] = [
  pogacar,
  mvdp,
  pidcock,
  cavendish,
  lucy,
  frodeno,
  ryf,
];

/** An athlete is publishable iff it has at least one publishable fact. */
export function publishedAthletes(): AthleteRef[] {
  return athletes.filter((a) => a.facts.some(isPublishable));
}

export function getAthlete(slug: string): AthleteRef | undefined {
  return athletes.find((a) => a.slug === slug);
}

export function getPublishedAthlete(slug: string): AthleteRef | undefined {
  const a = getAthlete(slug);
  if (!a) return undefined;
  return a.facts.some(isPublishable) ? a : undefined;
}

/** Only the facts that cleared the gauntlet — what an athlete page may render. */
export function renderableFacts(a: AthleteRef): VerifiedFact[] {
  return publishableFacts(a.facts);
}

/** Held-back references, with their status, for honest display in "the workshop". */
export function inReviewAthletes(): AthleteRef[] {
  return athletes.filter((a) => !a.facts.some(isPublishable));
}

/** A flat, searchable index for the athlete -> watch lookup. */
export interface AthleteSearchEntry {
  slug: string;
  name: string;
  discipline: string;
  watch: string;
  stance: string; // own-money | paid | gifted | loan | unverified
  stanceLabel: string;
  valueGBP?: number;
  published: boolean;
}

export function athleteSearchList(): AthleteSearchEntry[] {
  return athletes
    .map((a) => {
      const f = a.facts[0];
      const acq = acquisitionOf(f.relation);
      return {
        slug: a.slug,
        name: a.name,
        discipline: a.discipline,
        watch: f.watch,
        stance: acq.stance,
        stanceLabel: acq.label,
        valueGBP: f.value?.gbpApprox,
        published: a.facts.some(isPublishable),
      };
    })
    .sort((x, y) => x.name.localeCompare(y.name));
}
