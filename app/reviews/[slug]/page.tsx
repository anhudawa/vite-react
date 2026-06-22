import { modeStaticParams, modeMetadata, ModePage } from "@/components/article/modeRoute";

export function generateStaticParams() {
  return modeStaticParams("review");
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  return modeMetadata("review", params.slug);
}

export default function ReviewPage({ params }: { params: { slug: string } }) {
  return ModePage("review", params.slug);
}
