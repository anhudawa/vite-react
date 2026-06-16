import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { IndexList, type IndexItem } from "@/components/IndexList";
import { JsonLd, breadcrumb } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Watches in Sport",
  description:
    "On the wrist, in the race. How fine watches actually show up in endurance sport — the sponsorships, the timekeeping, the contradictions.",
};

const live: IndexItem[] = [
  {
    title: "The Same Machine, Described Twice",
    dek: "Why a movement and an endurance athlete are the same device, described in two vocabularies — and why that is the only honest lens on the subject.",
    href: "/essays/the-same-machine",
    meta: "Essay · The thesis",
  },
  {
    title: "Tadej Pogačar — Richard Mille RM 67-02",
    dek: "The clearest case the sport offers of a six-figure mechanical watch worn in genuine competition, over the cobbles, rather than to dinner.",
    href: "/who-wears-what/tadej-pogacar",
    meta: "Reference · Road",
  },
];

const forthcoming: IndexItem[] = [
  {
    title: "A Century of the Tour, Timed",
    dek: "Tissot and the long institutional history of official timekeeping in cycling — the quartz that decides the race, beside the mechanics on the wrists.",
    meta: "Dispatch",
    tag: "Sourcing",
  },
  {
    title: "The Team That Wears a Watch's Name",
    dek: "When a watchmaker backs an entire squad rather than a single rider, the relationship changes. What that sponsorship actually buys, and what it doesn't.",
    meta: "Dispatch",
    tag: "Sourcing",
  },
];

export default function WatchesInSport() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Watches in Sport", path: "/watches-in-sport" },
        ])}
      />
      <PageHeader
        index="02"
        kicker="In the race"
        title="Watches in Sport"
        intro="The deep luxury-mechanical vein runs through cycling — Richard Mille in the peloton, a watchmaker backing a whole team, quartz timing the Tour. We cover how the watches actually show up, contradictions intact."
        image={{
          src: "/photography/pogacar-1.jpg",
          alt: "Tadej Pogačar in the world-champion jersey, a Richard Mille on his wrist",
          subject: "Tadej Pogačar",
          watch: "Richard Mille",
          ratio: "4 / 5",
          position: "center 30%",
        }}
      />
      <IndexList items={live} label="Now reading" />
      <IndexList items={forthcoming} label="In the workshop" />
    </>
  );
}
