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
  image?: { src: string; alt: string; caption?: string };
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
      sources: [
        {
          id: "rm-official",
          publisher: "Richard Mille",
          kind: "official",
          tier: "primary",
          url: "https://www.richardmille.com/partners",
          accessedAt: "2026-06-10",
          excerpt:
            "Richard Mille's partnership programme places its extra-flat automatic RM 67-02 on competing endurance athletes.",
          supports: ["watch", "relation"],
          verified: true,
        },
        {
          id: "uae-team",
          publisher: "UAE Team Emirates",
          kind: "official",
          tier: "primary",
          url: "https://www.uaeteamemirates.com/rider/tadej-pogacar/",
          accessedAt: "2026-06-10",
          excerpt:
            "Team partner listings name Richard Mille; Pogačar is the team's lead rider.",
          supports: ["athlete", "watch", "relation"],
          verified: true,
        },
        {
          id: "watch-media",
          publisher: "Hodinkee",
          kind: "media",
          tier: "secondary",
          publishedAt: "2025-04-14",
          accessedAt: "2026-06-10",
          excerpt:
            "Reporting from the 2025 Classics identified the RM 67-02 on Pogačar's wrist.",
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
      sources: [
        {
          id: "rolex-official",
          publisher: "Rolex",
          kind: "official",
          tier: "primary",
          url: "https://www.rolex.com/rolex-family/golf/tiger-woods",
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

export const athletes: AthleteRef[] = [pogacar, tiger, pidcock];

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
