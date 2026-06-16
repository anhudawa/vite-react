import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { athletes, getAthlete } from "@/data/athletes";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "An Escapement reference";

export function generateStaticParams() {
  return athletes.filter((a) => a.published).map((a) => ({ athlete: a.slug }));
}

export default function Image({ params }: { params: { athlete: string } }) {
  const a = getAthlete(params.athlete);
  return ogCard({
    kicker: "Who wears what · Reference",
    title: a ? `${a.name} — ${a.facts[0].watch}` : "Escapement",
    footer: "Sourced reference",
  });
}
