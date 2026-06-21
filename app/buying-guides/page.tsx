import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { IndexList, type IndexItem } from "@/components/IndexList";
import { JsonLd, breadcrumb } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Buying Guides",
  description:
    "Considered, not transactional. Guides for anyone falling for watches in sport — the mechanics, the money, and the statement, covered honestly.",
};

const live: IndexItem[] = [
  {
    title: "What It Costs to Keep Time",
    dek: "The £300 Coros and the £300,000 Richard Mille keep the same time. Read this before you read any guide — it is the frame for all of them.",
    href: "/essays/what-it-costs-to-keep-time",
    meta: "Essay · On value",
  },
  {
    title: "The Sweep and the Surge",
    dek: "What a smoothly sweeping seconds hand is actually telling you, and why it is the detail worth paying for when so much else is noise.",
    href: "/essays/the-sweep-and-the-surge",
    meta: "Essay · On craft",
  },
];

const forthcoming: IndexItem[] = [
  {
    title: "The Athlete's First Mechanical Watch",
    dek: "Coming off a lifetime of GPS watches, the first mechanical is a different decision entirely. What to weigh, what to ignore, and why the cheapest honest answer is often the right one.",
    meta: "Guide",
    tag: "Drafting",
  },
  {
    title: "What Survives the Sweat",
    dek: "A watch worn while training lives a harder life than most collectors imagine. Water resistance, crystals, straps — the unglamorous specs that actually matter to someone who moves.",
    meta: "Guide",
    tag: "Drafting",
  },
];

export default function BuyingGuides() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Buying Guides", path: "/buying-guides" },
        ])}
      />
      <PageHeader
        index="03"
        kicker="Considered"
        title="Buying Guides"
        intro="Not a shop, and not a sermon. People buy watches for the movement, for the money, for the statement, or for all three — we don't pretend one reason is purer than another. These guides are about how a watch is made, what it costs, and how it actually lives on a wrist."
        image={{
          src: "/photography/tudor-giro-chrono.jpg",
          alt: "A Tudor Black Bay Chrono among the Giro d'Italia trophy spiral",
          subject: "Tudor Black Bay Chrono",
          watch: "Giro d'Italia",
          ratio: "4 / 5",
          position: "center 45%",
        }}
      />
      <IndexList items={live} label="Start here" />
      <IndexList items={forthcoming} label="In the workshop" />
    </>
  );
}
