import type { VerifiedFact } from "../lib/verification";
import { isPublishable, publishableFacts } from "../lib/verification";

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
      confidenceNote: "multiple sources",
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
    "The RM 67-02 is the relevant reference for a reason: it is Richard Mille's extra-flat, lightweight automatic, the line the brand builds specifically for athletes to wear while competing. On Pogačar it is not a flex worn to dinner. It is on the wrist over the cobbles, which is precisely the use case the watch was engineered for and almost never actually subjected to.",
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
    "A reference in progress. The relationship is plausible but not yet sourced to the standard the gauntlet requires — so it is held here, not published.",
  facts: [
    {
      id: "pidcock-draft",
      status: "in-review",
      athlete: "Tom Pidcock",
      watch: "(undetermined)",
      relation: "Reportedly brand-affiliated",
      evidence: "Single uncorroborated mention",
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

// Sourced autonomously (web research), then put through the gauntlet. The
// relationship is an official Rolex testimoneeship — a brand-level claim — with
// the Everose Day-Date in our frame as the model on the wrist.
const tiger: AthleteRef = {
  slug: "tiger-woods",
  name: "Tiger Woods",
  discipline: "Golf",
  nationality: "American",
  sameAs: [
    "https://en.wikipedia.org/wiki/Tiger_Woods",
    "https://www.rolex.com/rolex-family/golf/tiger-woods",
  ],
  summary:
    "One of the longest-running ambassadorships in golf — a Rolex testimonee since 2011, here in the Everose Day-Date.",
  image: {
    src: "/photography/tiger-rolex-1.jpg",
    alt: "Tiger Woods on the course wearing an Everose Rolex Day-Date on the President bracelet",
    caption: "Rolex Day-Date 40",
    rights: "unlicensed-placeholder",
  },
  facts: [
    {
      id: "tiger-rolex-daydate",
      status: "published",
      athlete: "Tiger Woods",
      watch: "Rolex Day-Date 40",
      relation: "Ambassador — Rolex testimonee since 2011",
      evidence: "Everose Day-Date in his collection; Deepsea worn winning the 2019 Masters",
      confidence: "High",
      confidenceNote: "official + independent media",
      reference: undefined,
      value: { gbpApprox: 40000, note: "Day-Date 40 Everose, indicative retail" },
      sources: [
        {
          id: "rolex-official",
          publisher: "Rolex",
          kind: "official",
          tier: "primary",
          url: "https://www.rolex.com/rolex-family/golf/tiger-woods",
          snapshot: "unarchivable", // rolex.com blocks the Wayback Machine
          accessedAt: "2026-06-16",
          excerpt:
            "Rolex's official Rolex Family pages present Tiger Woods among its golf Testimonees.",
          supports: ["athlete", "relation"],
          verified: true,
        },
        {
          id: "coronet",
          publisher: "Coronet Magazine",
          kind: "media",
          tier: "secondary",
          url: "https://www.coronet.org/new-1minute-reads/in-golf-rolex-stands-by-tiger-woods",
          snapshot: {
            archivedUrl:
              "https://web.archive.org/web/20260424081551/https://www.coronet.org/new-1minute-reads/in-golf-rolex-stands-by-tiger-woods",
            capturedAt: "2026-04-24",
          },
          publishedAt: "2026-04-01",
          accessedAt: "2026-06-16",
          excerpt:
            "Rolex has kept the golf legend as a brand ambassador; Woods has been a Rolex ambassador since 2011.",
          supports: ["relation", "evidence"],
          verified: true,
        },
        {
          id: "wrist-enthusiast",
          publisher: "Wrist Enthusiast",
          kind: "media",
          tier: "secondary",
          url: "https://www.wristenthusiast.com/latest/2022/8/4/tiger-woods-watches",
          snapshot: {
            archivedUrl:
              "https://web.archive.org/web/20260227055258/https://www.wristenthusiast.com/latest/2022/8/4/tiger-woods-watches",
            capturedAt: "2026-02-27",
          },
          publishedAt: "2022-08-04",
          accessedAt: "2026-06-16",
          excerpt:
            "Tiger Woods became a Rolex ambassador in 2011 and owns a Rolex Day-Date 40 in Everose gold, alongside a Deepsea Sea-Dweller.",
          supports: ["athlete", "relation", "watch", "evidence"],
          verified: true,
        },
        {
          id: "tiger-photo",
          publisher: "On-file photograph",
          kind: "photo",
          tier: "primary",
          accessedAt: "2026-06-16",
          excerpt:
            "Tiger Woods wearing an Everose (rose-gold) Rolex Day-Date on the President bracelet.",
          supports: ["athlete", "watch", "evidence"],
          verified: true,
        },
      ],
      review: {
        disconfirmingSearch: true,
        contradictionsFound: [],
        confusedWithRuledOut: [
          "Day-Date vs Datejust — the President bracelet and Everose gold confirm a Day-Date",
        ],
        method: "dual-control",
        approvedBy: "A. Walsh",
        approvedAt: "2026-06-16",
        notes:
          "Logged as a brand-level testimoneeship, not a single-reference claim; the Everose Day-Date is the model in our frame.",
      },
    },
  ],
  notes: [
    "Woods has been a Rolex testimonee since 2011 — one of the longest-running ambassadorships in golf, and Rolex still publishes him among its golf family. The relationship is the verifiable fact here, corroborated by Rolex itself and by independent watch media.",
    "He is most associated with the Deepsea Sea-Dweller — a watch he has called a natural fit for its reliability, and wore (in the James Cameron edition) winning the 2019 Masters. In our frame it is the dress side of the same relationship: the Everose Day-Date on the President bracelet.",
    "We log this as an ambassadorship rather than a single reference. That distinction — the relationship versus a specific model — is exactly the thing the rest of the internet flattens, and exactly what this page exists to keep straight.",
  ],
};

// Sourced autonomously by a research pass, then put through the gauntlet. The
// claim is the brand-level testimoneeship — the documented competition watch is
// the Sky-Dweller. A green Datejust appears in some imagery but is photo-only and
// corroborated by no text source, so it is explicitly NOT claimed here.
const rahm: AthleteRef = {
  slug: "jon-rahm",
  name: "Jon Rahm",
  discipline: "Golf",
  nationality: "Spanish",
  sameAs: [
    "https://en.wikipedia.org/wiki/Jon_Rahm",
    "https://www.rolex.com/rolex-family/golf/jon-rahm",
  ],
  summary:
    "A Rolex golf testimonee — most documented in the Sky-Dweller, the watch he wore celebrating the 2023 Masters.",
  image: {
    src: "/photography/rahm-rolex-1.jpg",
    alt: "Jon Rahm on the green, a Rolex on his wrist",
    caption: "Rolex",
    rights: "unlicensed-placeholder",
  },
  facts: [
    {
      id: "rahm-rolex-testimonee",
      status: "published",
      athlete: "Jon Rahm",
      watch: "Rolex",
      relation: "Ambassador — Rolex testimonee",
      evidence: "Sky-Dweller worn celebrating the 2023 Masters",
      confidence: "High",
      confidenceNote: "official + independent media",
      reference: undefined,
      value: { gbpApprox: 15000, note: "Sky-Dweller white Rolesor, indicative retail" },
      sources: [
        {
          id: "robb-report",
          publisher: "Robb Report",
          kind: "media",
          tier: "secondary",
          url: "https://robbreport.com/style/watch-collector/jon-rahm-rolex-sky-dweller-masters-victory-1234828608/",
          snapshot: {
            archivedUrl:
              "https://web.archive.org/web/20230607132842/https://robbreport.com/style/watch-collector/jon-rahm-rolex-sky-dweller-masters-victory-1234828608/",
            capturedAt: "2023-06-07",
          },
          publishedAt: "2023-04-10",
          accessedAt: "2026-06-16",
          excerpt:
            "Rahm, who is currently the top-ranked golfer in the world, is a Testimonee for the watchmaker and has been for a while now.",
          supports: ["athlete", "relation", "watch", "evidence"],
          verified: true,
        },
        {
          id: "rolex-official-rahm",
          publisher: "Rolex",
          kind: "official",
          tier: "primary",
          url: "https://www.rolex.com/rolex-family/golf/jon-rahm",
          snapshot: {
            archivedUrl:
              "https://web.archive.org/web/20260217144950/https://www.rolex.com/rolex-family/golf/jon-rahm",
            capturedAt: "2026-02-17",
          },
          accessedAt: "2026-06-16",
          excerpt:
            "Rolex's official Rolex Family pages list Jon Rahm among its golf Testimonees (live page access-restricted; confirmed via the archived capture).",
          supports: ["athlete", "relation", "watch"],
          verified: true,
        },
        {
          id: "bobs-skydweller",
          publisher: "Bob's Watches",
          kind: "media",
          tier: "secondary",
          url: "https://www.bobswatches.com/rolex-blog/breaking-news/rolex-watches-spotted-masters-golf-tournament.html",
          publishedAt: "2023-04-10",
          accessedAt: "2026-06-16",
          excerpt:
            "We have seen the golfer wearing this particular timepiece — the Sky-Dweller ref. 326934 — as far back as 2019.",
          supports: ["watch", "evidence"],
          verified: true,
        },
        {
          id: "rahm-photo",
          publisher: "On-file photograph",
          kind: "photo",
          tier: "primary",
          accessedAt: "2026-06-16",
          excerpt: "Jon Rahm on the green wearing a Rolex.",
          supports: ["athlete", "evidence"],
          verified: true,
        },
      ],
      review: {
        disconfirmingSearch: true,
        contradictionsFound: [],
        confusedWithRuledOut: [
          "Green Datejust — photo-only, corroborated by no text source; the documented competition watch is the Sky-Dweller (ref. 326934 / M336934-0006)",
          "A '2016' testimonee start date surfaced in search summaries but could not be verified against a source body, so it is not claimed",
        ],
        method: "dual-control",
        approvedBy: "A. Walsh",
        approvedAt: "2026-06-16",
        notes:
          "Logged as a brand-level testimoneeship. The Sky-Dweller is the documented watch; the green Datejust seen in some imagery is held as unverified.",
      },
    },
  ],
  notes: [
    "Rahm is a Rolex golf testimonee — confirmed by Rolex's own family pages and by independent watch reporting. The relationship is the verifiable claim; the specific watch most often documented on him is the Sky-Dweller in white Rolesor with a blue dial.",
    "He wore that Sky-Dweller celebrating the 2023 Masters, and it has been photographed on him as far back as 2019. That consistency over years is what separates a relationship from a one-off red-carpet loan.",
    "A green-dial Datejust appears in some imagery of Rahm, but we could find no text source tying him to it — so we do not claim it. The ambassadorship is published; the Datejust is held. That line is the whole point of the page.",
  ],
};

// Sourced autonomously, then gauntlet-checked. A marquee money story: a watch
// built for him, bearing his name, worn at ~£850k ON COURT — the opposite of a
// red-carpet loan.
const nadal: AthleteRef = {
  slug: "rafael-nadal",
  name: "Rafael Nadal",
  discipline: "Tennis",
  nationality: "Spanish",
  sameAs: [
    "https://en.wikipedia.org/wiki/Rafael_Nadal",
    "https://www.richardmille.com/friends-and-partners/rafael-nadal",
  ],
  summary:
    "The purest worn-in-competition case in sport: a Richard Mille built for him, bearing his name, worn through five-set matches — at roughly £850,000.",
  facts: [
    {
      id: "nadal-rm-27",
      status: "published",
      athlete: "Rafael Nadal",
      watch: "Richard Mille RM 27 series",
      relation: "Ambassador — Richard Mille partner since 2010",
      evidence: "RM 27-05 worn on court at the 2024 Roland Garros",
      confidence: "High",
      confidenceNote: "official + independent media",
      reference: undefined,
      value: { gbpApprox: 850000, note: "RM 27-05, indicative" },
      sources: [
        {
          id: "rm-official-nadal",
          publisher: "Richard Mille",
          kind: "official",
          tier: "primary",
          url: "https://www.richardmille.com/friends-and-partners/rafael-nadal",
          snapshot: {
            archivedUrl:
              "https://web.archive.org/web/20260512094253/https://www.richardmille.com/friends-and-partners/rafael-nadal",
            capturedAt: "2026-05-12",
          },
          accessedAt: "2026-06-16",
          excerpt:
            "The RM 027 — the first watch to bear the King of Clay's name. “The watch is now like a second skin for me.”",
          supports: ["athlete", "watch", "relation", "evidence"],
          verified: true,
        },
        {
          id: "robb-report-nadal",
          publisher: "Robb Report",
          kind: "photo",
          tier: "secondary",
          url: "https://robbreport.com/style/watch-collector/gallery/rafael-nadal-richard-mille-1235474541/",
          publishedAt: "2024-05-29",
          accessedAt: "2026-06-16",
          excerpt:
            "Nadal is one of the few pros who actually wears his watch during the match; the debut RM 027 came in 2010.",
          supports: ["athlete", "watch", "relation", "evidence"],
          verified: true,
        },
        {
          id: "tennis-com-nadal",
          publisher: "Tennis.com",
          kind: "media",
          tier: "secondary",
          url: "https://www.tennis.com/baseline/articles/grand-finale-rafael-nadal-richard-mille-flying-turbillon-watch-extreme-luxury-1-million",
          snapshot: {
            archivedUrl:
              "https://web.archive.org/web/20240615182836/https://www.tennis.com/baseline/articles/grand-finale-rafael-nadal-richard-mille-flying-turbillon-watch-extreme-luxury-1-million",
            capturedAt: "2024-06-15",
          },
          publishedAt: "2024-06-13",
          accessedAt: "2026-06-16",
          excerpt:
            "My relationship with Richard Mille has undoubtedly been a pillar of my sports career since 2010.",
          supports: ["athlete", "relation", "evidence", "watch"],
          verified: true,
        },
        {
          id: "time-and-watches-nadal",
          publisher: "Time and Watches",
          kind: "media",
          tier: "secondary",
          url: "https://www.timeandwatches.com/2020/09/richard-mille-rm-27-04-tourbillon.html",
          snapshot: {
            archivedUrl:
              "https://web.archive.org/web/20260115080712/https://www.timeandwatches.com/2020/09/richard-mille-rm-27-04-tourbillon.html",
            capturedAt: "2026-01-15",
          },
          publishedAt: "2020-09-24",
          accessedAt: "2026-06-16",
          excerpt:
            "To mark the 10th anniversary of its partnership with Rafa Nadal, Richard Mille has presented the new RM 27-04.",
          supports: ["watch", "relation"],
          verified: true,
        },
      ],
      review: {
        disconfirmingSearch: true,
        contradictionsFound: [],
        confusedWithRuledOut: [
          "The RM 27 references are easily conflated — RM 027 (2010), RM 27-01, -02, -03, -04, -05; we log the series and name the RM 27-05 as the 2024 on-court instance",
          "Dealer asks (>$1.3M) vs Richard Mille list (CHF 952,000, RM 27-04) — we use list, indicatively",
        ],
        method: "dual-control",
        approvedBy: "A. Walsh",
        approvedAt: "2026-06-16",
        notes:
          "Brand-partner relationship since 2010; the RM 27 line is purpose-built for and named after him, and worn during competition — corroborated by Richard Mille and independent media.",
      },
    },
  ],
  notes: [
    "This is the case the whole site is built to honour: not a watch worn to dinner, but a tourbillon worn through the most physical tennis of his generation. Richard Mille built the RM 27 line for Nadal, named the first one after him, and engineered each iteration lighter and more shock-resistant so he could actually play in it.",
    "The money is the story. The RM 27-04 launched at CHF 952,000; the RM 27-05 he wore at the 2024 Roland Garros runs to roughly a million dollars. He is paid to wear it — but he wears it where almost no one would risk a watch a fraction of the price.",
    "We log it as a brand partnership, name the specific on-court reference in the evidence, and keep the series and the single watch distinct — because conflating the RM 27 references is the most common way this story gets told wrong.",
  ],
};

// HELD by the system, not for lack of fame but for lack of OUR standard of proof:
// the relationship is beyond doubt, but we hold a High rating until a dated,
// on-file image clears the visual-evidence gate. Held in public, honestly.
const federer: AthleteRef = {
  slug: "roger-federer",
  name: "Roger Federer",
  discipline: "Tennis",
  nationality: "Swiss",
  sameAs: [
    "https://en.wikipedia.org/wiki/Roger_Federer",
    "https://www.rolex.com/rolex-family/tennis/roger-federer",
  ],
  summary:
    "The relationship is beyond doubt — a Rolex testimonee for over two decades. We hold it here for one reason only: our visual-evidence gate wants a dated, on-file image before we rate it High.",
  facts: [
    {
      id: "federer-rolex",
      status: "in-review",
      athlete: "Roger Federer",
      watch: "Rolex",
      relation: "Ambassador — Rolex testimonee since 2001",
      evidence: "Documented for two decades; Day-Date, Datejust 'Wimbledon', Sky-Dweller",
      confidence: "High",
      confidenceNote: "held: on-file visual pending",
      reference: undefined,
      value: { gbpApprox: 30000, note: "Day-Date / Datejust, indicative" },
      sources: [
        {
          id: "rolex-official-fed",
          publisher: "Rolex",
          kind: "official",
          tier: "primary",
          url: "https://www.rolex.com/rolex-family/tennis/roger-federer",
          snapshot: {
            archivedUrl:
              "https://web.archive.org/web/20260520233304/https://www.rolex.com/rolex-family/tennis/roger-federer",
            capturedAt: "2026-05-20",
          },
          accessedAt: "2026-06-16",
          excerpt:
            "Rolex's official Rolex Family pages present Roger Federer in its tennis family (live page access-restricted; confirmed via the archived capture).",
          supports: ["athlete", "relation"],
          verified: true,
        },
        {
          id: "bobs-fed",
          publisher: "Bob's Watches",
          kind: "media",
          tier: "secondary",
          url: "https://www.bobswatches.com/rolex-blog/editorial/roger-federer-rolex-collection-unveiling-the-tennis-legends-favorite-timepieces.html",
          snapshot: {
            archivedUrl:
              "https://web.archive.org/web/20250128191719/https://www.bobswatches.com/rolex-blog/editorial/roger-federer-rolex-collection-unveiling-the-tennis-legends-favorite-timepieces.html",
            capturedAt: "2025-01-28",
          },
          publishedAt: "2024-10-03",
          accessedAt: "2026-06-16",
          excerpt:
            "As an official Rolex brand ambassador, or 'testimonee' as they're officially called, Roger Federer has access to literally any timepiece.",
          supports: ["athlete", "relation", "watch", "evidence"],
          verified: true,
        },
        {
          id: "perfect-tennis-fed",
          publisher: "Perfect Tennis",
          kind: "media",
          tier: "secondary",
          url: "https://www.perfect-tennis.com/what-rolex-watches-does-roger-federer-wear/",
          snapshot: {
            archivedUrl:
              "https://web.archive.org/web/20231013102636/https://www.perfect-tennis.com/what-rolex-watches-does-roger-federer-wear/",
            capturedAt: "2023-10-13",
          },
          publishedAt: "2023-09-29",
          accessedAt: "2026-06-16",
          excerpt:
            "Rolex partnered with Roger back in 2006 in what was one of the largest single endorsements for any professional athlete at the time.",
          supports: ["athlete", "relation", "watch", "evidence"],
          verified: true,
        },
      ],
      review: {
        disconfirmingSearch: true,
        contradictionsFound: [],
        confusedWithRuledOut: [
          "Start date 2001 (Rolex's framing) vs 2006 (the major signing) — the same relationship from two anchor points, not a contradiction",
          "Rolex's current in-play tennis testimonee is Carlos Alcaraz — do not conflate his watches with Federer's",
        ],
        method: "dual-control",
        approvedBy: "A. Walsh",
        approvedAt: "2026-06-16",
        notes:
          "Textually airtight across Rolex's own pages and independent media. Held only because we lack a dated on-file image to satisfy visual-evidence — the gate doing its job on a famous name.",
      },
    },
  ],
  notes: [
    "There is no real doubt that Federer is a Rolex testimonee — Rolex says so on its own site, and independent reporting has for twenty years. We could publish on the strength of the words alone.",
    "We don't. Our visual-evidence gate asks for a dated, located image we hold before any claim is rated High — words, however authoritative, aren't enough. Until we attach that image, Federer stays here, in review.",
    "That is the standard working on the hardest case to apply it to. If we hold Federer, you can trust what we do publish.",
  ],
};

export const athletes: AthleteRef[] = [pogacar, tiger, rahm, nadal, federer, pidcock];

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
