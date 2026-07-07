import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { collections, getCollection } from "@/data/collections";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "A curated reading trail from The Long Second";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export default function Image({ params }: { params: { slug: string } }) {
  const c = getCollection(params.slug);
  return ogCard({
    kicker: "Collections",
    title: c ? c.title : "The Long Second",
    footer: "Reading trail",
  });
}
