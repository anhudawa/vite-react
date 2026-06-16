import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Escapement — time, told from the inside";

export default function Image() {
  return ogCard({
    kicker: "Endurance athletes · fine watches",
    title: "The same machine, described twice.",
  });
}
