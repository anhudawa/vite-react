import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Timeline — a century of dates where watches and endurance met";

export default function Image() {
  return ogCard({
    kicker: "Timeline",
    title: "The dates where watches and endurance met.",
  });
}
