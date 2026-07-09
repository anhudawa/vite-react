import { modeStaticParams, modeMetadata, ModePage } from "@/components/article/modeRoute";

export function generateStaticParams() {
  return modeStaticParams("guide");
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  return modeMetadata("guide", params.slug);
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  return ModePage("guide", params.slug);
}
