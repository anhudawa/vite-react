import { size as ogSize, contentType as ogType, alt as ogAlt, ogParams, ogImage } from "@/components/article/ogImage";

export const size = ogSize;
export const contentType = ogType;
export const alt = ogAlt;

export function generateStaticParams() {
  return ogParams("feature");
}

export default function Image({ params }: { params: { slug: string } }) {
  return ogImage(params.slug, "Feature");
}
