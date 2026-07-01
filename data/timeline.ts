import { essayHref } from "@/lib/content";

/**
 * The timeline — the verified horological-athletic dates, in one line.
 *
 * DATA DISCIPLINE: every date and claim here is sourced from an essay already
 * published on the site, and each entry links to the essay that tells it in
 * full. Nothing appears on this line that the corpus does not support.
 */

export type TimelineTag = "watch" | "sport" | "both";

export interface TimelineEntry {
  year: number;
  /** Day and month, only where the essay states one. */
  date?: string;
  title: string;
  /** One calm sentence. */
  line: string;
  /** The essay that covers it, via the canonical mode route. */
  href: string;
  tag: TimelineTag;
}

export const tagLabel: Record<TimelineTag, string> = {
  watch: "Watch",
  sport: "Sport",
  both: "Watch · Sport",
};

export const timeline: TimelineEntry[] = [
  {
    year: 1927,
    date: "21 October",
    title: "The Vindication Swim",
    line:
      "Mercedes Gleitze returns to the Channel to prove her crossing, a Rolex Oyster on a ribbon at her neck; it comes out keeping time.",
    href: essayHref({ slug: "mercedes-gleitze-and-the-oyster", mode: "feature" }),
    tag: "both",
  },
  {
    year: 1953,
    date: "29 May",
    title: "The summit of Everest",
    line:
      "Edmund Hillary and Tenzing Norgay stand on top of the world; among the expedition's watches, a British Smiths holds the stronger claim.",
    href: essayHref({ slug: "everest-1953-the-watch-and-the-record", mode: "feature" }),
    tag: "both",
  },
  {
    year: 1954,
    date: "6 May",
    title: "The four-minute mile",
    line:
      "Roger Bannister runs 3:59.4 at Iffley Road, and a barrier turns out to have been a time all along.",
    href: essayHref({ slug: "the-four-minute-mile", mode: "feature" }),
    tag: "sport",
  },
  {
    year: 1972,
    title: "Merckx's Hour",
    line:
      "Eddy Merckx rides 49.431 kilometres in sixty minutes in Mexico City, calls it the hardest single effort of his life, and never attempts it again.",
    href: essayHref({ slug: "the-longest-hour", mode: "feature" }),
    tag: "sport",
  },
  {
    year: 1978,
    date: "18 February",
    title: "The first Ironman",
    line:
      "Fifteen men set off from a Waikiki beach to settle a dare; twelve finish, Gordon Haller first in 11:46:58.",
    href: essayHref({ slug: "seventeen-hours", mode: "feature" }),
    tag: "sport",
  },
  {
    year: 1989,
    title: "Eight seconds",
    line:
      "Greg LeMond overturns Laurent Fignon's fifty-second lead in the final time trial, and Tissot's clock settles the closest Tour de France ever ridden.",
    href: essayHref({ slug: "the-1989-tour-eight-seconds", mode: "feature" }),
    tag: "both",
  },
  {
    year: 2003,
    date: "13 April",
    title: "2:15:25",
    line:
      "Paula Radcliffe runs the London Marathon in 2:15:25, a number that will hold off every challenger for sixteen years.",
    href: essayHref({ slug: "sixteen-years", mode: "feature" }),
    tag: "sport",
  },
  {
    year: 2015,
    title: "Wiggins takes the Hour",
    line:
      "Bradley Wiggins rides the Hour in a London velodrome, handed the same sixty minutes as every holder before him.",
    href: essayHref({ slug: "the-longest-hour", mode: "feature" }),
    tag: "sport",
  },
  {
    year: 2019,
    title: "The Hour at altitude",
    line:
      "Victor Campenaerts takes the Hour Record to altitude in Mexico — thinner air, the identical, non-negotiable hour.",
    href: essayHref({ slug: "the-longest-hour", mode: "feature" }),
    tag: "sport",
  },
  {
    year: 2019,
    date: "12 October",
    title: "1:59:40",
    line:
      "In a Vienna park, Eliud Kipchoge runs the first sub-two-hour marathon — a number the record book declines to keep and the clock read anyway.",
    href: essayHref({ slug: "the-number-that-doesnt-count", mode: "feature" }),
    tag: "sport",
  },
  {
    year: 2019,
    date: "13 October",
    title: "The record moves on",
    line:
      "A day later in Chicago, Brigid Kosgei runs 2:14:04, and Radcliffe's sixteen-year mark finally passes into history.",
    href: essayHref({ slug: "sixteen-years", mode: "feature" }),
    tag: "sport",
  },
  {
    year: 2022,
    date: "October",
    title: "56.792 kilometres",
    line:
      "Filippo Ganna rides 56.792 kilometres at the Tissot Velodrome in Grenchen — the Hour as it currently stands.",
    href: essayHref({ slug: "the-longest-hour", mode: "feature" }),
    tag: "both",
  },
];
