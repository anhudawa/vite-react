import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { essays, getEssay } from "@/content/essays/registry";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "An essay from The Long Second";

export function generateStaticParams() {
  return essays.map((e) => ({ slug: e.slug }));
}

export default function Image({ params }: { params: { slug: string } }) {
  const essay = getEssay(params.slug);
  return ogCard({
    kicker: essay?.kicker ?? "Essay",
    title: essay?.title ?? "The Long Second",
    footer: "Essay",
  });
}
