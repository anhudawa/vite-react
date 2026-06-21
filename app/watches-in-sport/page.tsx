import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { IndexList, type IndexItem } from "@/components/IndexList";
import { JsonLd, breadcrumb } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Watches in Sport",
  description:
    "How fine watches actually show up across sport — football, basketball, cycling, MMA, golf, running — the sponsorships, the purchases, the contradictions.",
};

const live: IndexItem[] = [
  {
    title: "Watches in Sport: A Field Guide",
    dek: "Tennis, golf, cycling, football, boxing — where fine watches show up across every sport, and the one question that tells you what each really means.",
    href: "/essays/watches-in-sport-field-guide",
    meta: "Essay · The overview",
  },
  {
    title: "Watches and the World Cup",
    dek: "The most-watched event on earth is the best wrist-watching on earth — and unlike golf or tennis, the watches there are mostly bought, not placed.",
    href: "/essays/watches-and-the-world-cup",
    meta: "Essay · On the wrist",
  },
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
        kicker="On the wrist"
        title="Watches in Sport"
        intro="Football, basketball, cycling, MMA, golf, running — fine watches turn up on the wrists of every sport, sometimes paid for, sometimes bought, sometimes worn in genuine competition. We cover how they actually show up, contradictions intact."
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
