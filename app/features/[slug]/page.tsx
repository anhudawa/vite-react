import { modeStaticParams, modeMetadata, ModePage } from "@/components/article/modeRoute";

export function generateStaticParams() {
  return modeStaticParams("feature");
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  return modeMetadata("feature", params.slug);
}

export default function FeaturePage({ params }: { params: { slug: string } }) {
  return ModePage("feature", params.slug);
}
