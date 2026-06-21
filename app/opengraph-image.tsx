import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "The Long Second — the second that matters most";

export default function Image() {
  return ogCard({
    kicker: "Every sport · fine watches",
    title: "Not every second is the same length.",
  });
}
