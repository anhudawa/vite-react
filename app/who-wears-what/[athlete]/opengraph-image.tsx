import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { publishedAthletes, getPublishedAthlete, renderableFacts } from "@/data/athletes";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "A sourced reference from The Long Second";

export function generateStaticParams() {
  return publishedAthletes().map((a) => ({ athlete: a.slug }));
}

export default function Image({ params }: { params: { athlete: string } }) {
  const a = getPublishedAthlete(params.athlete);
  const fact = a ? renderableFacts(a)[0] : undefined;
  return ogCard({
    kicker: "Who wears what",
    title: a && fact ? `${a.name} — ${fact.watch}` : "The Long Second",
    footer: "Bought, or paid to wear it",
  });
}
