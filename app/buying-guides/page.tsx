import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { IndexList, type IndexItem } from "@/components/IndexList";
import { JsonLd, breadcrumb } from "@/lib/jsonld";
import { buyersGuides } from "@/data/buyers-guides";

const bySport: IndexItem[] = buyersGuides.map((g) => ({
  title: `${g.sport}: ${g.title}`,
  dek: g.dek,
  href: `/buying-guides/${g.slug}`,
  meta: "Guide · by sport & budget",
}));

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
    title: "Swimming & Triathlon: What Survives the Water",
    dek: "Three disciplines, one wrist, and a watch that has to do all of it without drowning. The specs that matter when the swim leg is non-negotiable.",
    meta: "Guide · by sport & budget",
    tag: "Drafting",
  },
  {
    title: "Trail & Ultra: What Lasts the Night",
    dek: "The races that outrun a battery and a forecast. What to trust when the watch has to read true at hour fifteen, in the dark, with your hands gone.",
    meta: "Guide · by sport & budget",
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
        intro="Not a shop, not a sermon. Men buy watches for the movement, the money, the statement, or all three, and no reason here is purer than another. These guides are about how a watch is made, what it costs, and how it lives on a wrist."
        image={{
          src: "/photography/tudor-giro-chrono.jpg",
          alt: "A Tudor Black Bay Chrono among the Giro d'Italia trophy spiral",
          subject: "Tudor Black Bay Chrono",
          watch: "Giro d'Italia",
          ratio: "4 / 5",
          position: "center 45%",
        }}
      />
      <IndexList items={bySport} label="Buy for your sport" />
      <IndexList items={live} label="Read first — the frame" />
      <IndexList items={forthcoming} label="In the workshop" />
    </>
  );
}
