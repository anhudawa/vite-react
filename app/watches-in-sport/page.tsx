import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { IndexList, type IndexItem } from "@/components/IndexList";
import { JsonLd, breadcrumb } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Watches in Sport",
  description:
    "How fine watches actually show up in endurance sport — cycling, running, triathlon — worn in genuine competition, bought or paid for, contradictions intact.",
};

const live: IndexItem[] = [
  {
    title: "Watches in Sport: A Field Guide",
    dek: "Cycling, running, triathlon — where fine watches show up in endurance sport, and the one question that tells you what each really means.",
    href: "/features/watches-in-sport-field-guide",
    meta: "Essay · The overview",
  },
  {
    title: "The Same Machine, Described Twice",
    dek: "Why a movement and an endurance athlete are the same device, described in two vocabularies — and the only honest lens on the subject.",
    href: "/features/the-same-machine",
    meta: "Essay · The thesis",
  },
  {
    title: "The Sweep and the Surge",
    dek: "The seconds hand and the rider in the final kilometre do their hardest work by looking like they are doing nothing. Smoothness is regulation under load.",
    href: "/features/the-sweep-and-the-surge",
    meta: "Essay · On craft",
  },
  {
    title: "What It Costs to Keep Time",
    dek: "A £300 GPS watch keeps better time than a £300,000 one — so the price of the expensive watch buys something other than the time. Here is what.",
    href: "/features/what-it-costs-to-keep-time",
    meta: "Essay · On value",
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
        kicker="On the wrist"
        title="Watches in Sport"
        intro="Cycling, running, triathlon — fine watches turn up on the wrists of people who measure their lives in seconds. Bought, paid for, or worn in genuine competition; we cover how they actually show up, contradictions intact."
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
