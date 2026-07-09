import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Collections — curated reading orders from The Long Second";

export default function Image() {
  return ogCard({
    kicker: "Collections",
    title: "Curated reading orders.",
  });
}
