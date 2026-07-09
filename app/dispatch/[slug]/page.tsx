import { modeStaticParams, modeMetadata, ModePage } from "@/components/article/modeRoute";

export function generateStaticParams() {
  return modeStaticParams("dispatch");
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  return modeMetadata("dispatch", params.slug);
}

export default function DispatchPage({ params }: { params: { slug: string } }) {
  return ModePage("dispatch", params.slug);
}
