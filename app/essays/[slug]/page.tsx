import { permanentRedirect, notFound } from "next/navigation";
import { essays, getEssay } from "@/content/essays/registry";
import { essayHref } from "@/lib/content";

// Legacy route. Every piece now lives under its mode (/features, /guides,
// /reviews, /dispatch); 308-redirect the old /essays/[slug] URLs to canonical.
export function generateStaticParams() {
  return essays.map((e) => ({ slug: e.slug }));
}

export default function LegacyEssayRedirect({ params }: { params: { slug: string } }) {
  const essay = getEssay(params.slug);
  if (!essay) notFound();
  permanentRedirect(essayHref(essay));
}
