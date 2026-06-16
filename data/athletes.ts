import type { Fact } from "@/components/FactBlock";

export interface AthleteRef {
  slug: string;
  name: string;
  discipline: string;
  nationality: string;
  sameAs: string[]; // for Person JSON-LD
  summary: string;
  facts: Fact[];
  notes: string[]; // editorial context paragraphs, in the brand voice
  published: boolean;
}

/**
 * Reference pages. Accuracy is the moat — only sourced relationships ship as
 * published pages. The Pogačar facts are the build-map's verified sample.
 */
export const athletes: AthleteRef[] = [
  {
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
    facts: [
      {
        athlete: "Tadej Pogačar",
        watch: "Richard Mille RM 67-02",
        relation: "Sponsored — UAE Team Emirates",
        evidence: "Worn at 2025 Paris–Roubaix",
        confidence: "High",
        confidenceNote: "multiple sources",
        reference: "RM 67-02",
      },
    ],
    notes: [
      "The RM 67-02 is the relevant reference for a reason: it is Richard Mille's extra-flat, lightweight automatic, the line the brand builds specifically for athletes to wear while competing. On Pogačar it is not a flex worn to dinner. It is on the wrist over the cobbles, which is precisely the use case the watch was engineered for and almost never actually subjected to.",
      "The relationship runs through UAE Team Emirates rather than a personal endorsement of the classical kind, which is the honest way to log it. The team's backing places the watch on the wrist; the rider's results are what make anyone look. That distinction — sponsorship versus personal collection — is exactly the kind of thing the rest of the internet flattens, and exactly the kind of thing this page exists to keep straight.",
      "What makes it worth a reference page is the contrast it sets up across the sport: the same race won, in some years, by a rider in a sub-£400 computer on a strap, and contested by another carrying a six-figure mechanical movement up the same climb. Both are keeping time. Only one was ever asked to.",
    ],
    published: true,
  },
];

export function getAthlete(slug: string): AthleteRef | undefined {
  return athletes.find((a) => a.slug === slug);
}

/** Curated, honestly-labelled pipeline — references in the workshop, not yet sourced
 *  to publication standard. Shown on the silo index without fabricated specifics. */
export const forthcoming: { name: string; line: string }[] = [
  { name: "Fabian Cancellara", line: "Tudor — ambassador, and the team that bears the name" },
  { name: "Tom Pidcock", line: "On the wrist across road, cross and mountain" },
  { name: "The Tour de France", line: "Tissot, and a century of official timekeeping" },
];
